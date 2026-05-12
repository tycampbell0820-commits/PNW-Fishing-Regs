// ArcGIS REST query helpers. All county layers expose the same /query endpoint
// shape, so we wrap it once with caching, retries, and a typed feature shape.

import { cacheRead, cacheWrite } from './cache';

export type Geometry =
  | { type: 'Point'; coordinates: [number, number] }
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] }
  | { type: 'LineString'; coordinates: number[][] }
  | { type: 'MultiLineString'; coordinates: number[][][] };

export interface GeoJsonFeature<P = Record<string, unknown>> {
  type: 'Feature';
  properties: P;
  geometry: Geometry | null;
}

export interface QueryOptions {
  where?: string;
  outFields?: string;
  returnGeometry?: boolean;
  resultRecordCount?: number;
  resultOffset?: number;
  geometry?: string;
  geometryType?: 'esriGeometryEnvelope' | 'esriGeometryPolygon' | 'esriGeometryPoint';
  spatialRel?: 'esriSpatialRelIntersects' | 'esriSpatialRelContains' | 'esriSpatialRelWithin';
  inSR?: number;
  outSR?: number;
}

export interface QueryResult {
  features: GeoJsonFeature[];
  exceededTransferLimit?: boolean;
}

export class ArcGISError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'ArcGISError';
  }
}

const DEFAULT_RETRY = 3;
const RETRY_BACKOFF_MS = [500, 1500, 3500];

export async function queryLayer(
  url: string,
  options: QueryOptions,
  cacheBucket: string
): Promise<QueryResult> {
  const params: Record<string, string> = {
    f: 'geojson',
    where: options.where ?? '1=1',
    outFields: options.outFields ?? '*',
    returnGeometry: String(options.returnGeometry ?? true),
    outSR: String(options.outSR ?? 4326)
  };
  if (options.resultRecordCount != null) params.resultRecordCount = String(options.resultRecordCount);
  if (options.resultOffset != null) params.resultOffset = String(options.resultOffset);
  if (options.geometry) {
    params.geometry = options.geometry;
    params.geometryType = options.geometryType ?? 'esriGeometryPolygon';
    params.spatialRel = options.spatialRel ?? 'esriSpatialRelIntersects';
    params.inSR = String(options.inSR ?? 4326);
  }

  const cached = cacheRead<QueryResult>(cacheBucket, url, params);
  if (cached) return cached;

  let lastErr: unknown;
  for (let attempt = 0; attempt < DEFAULT_RETRY; attempt++) {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${url}?${qs}`, {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) {
        throw new ArcGISError(`HTTP ${res.status} from ${url}`, res.status);
      }
      const json = (await res.json()) as {
        features?: GeoJsonFeature[];
        type?: string;
        error?: { code: number; message: string };
        exceededTransferLimit?: boolean;
        properties?: { exceededTransferLimit?: boolean };
      };
      if (json.error) {
        throw new ArcGISError(`ArcGIS error ${json.error.code}: ${json.error.message}`);
      }
      const result: QueryResult = {
        features: json.features ?? [],
        exceededTransferLimit:
          json.exceededTransferLimit ?? json.properties?.exceededTransferLimit ?? false
      };
      cacheWrite(cacheBucket, url, params, result);
      return result;
    } catch (err) {
      lastErr = err;
      if (attempt < DEFAULT_RETRY - 1) {
        await new Promise(r => setTimeout(r, RETRY_BACKOFF_MS[attempt]));
      }
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new ArcGISError(`Failed to query ${url}`);
}

// Page through a layer until exhausted (or until soft limit reached).
export async function* iteratePages(
  url: string,
  baseOptions: Omit<QueryOptions, 'resultOffset'>,
  pageSize: number,
  cacheBucket: string,
  maxRecords?: number
): AsyncGenerator<GeoJsonFeature[]> {
  let offset = 0;
  let total = 0;
  // ArcGIS pagination: keep calling until exceededTransferLimit is false AND
  // the returned page is smaller than pageSize.
  while (true) {
    const page = await queryLayer(
      url,
      { ...baseOptions, resultRecordCount: pageSize, resultOffset: offset },
      cacheBucket
    );
    if (page.features.length === 0) return;
    yield page.features;
    total += page.features.length;
    offset += pageSize;
    if (maxRecords != null && total >= maxRecords) return;
    if (!page.exceededTransferLimit && page.features.length < pageSize) return;
  }
}

// Compact ESRI geometry string for use as the `geometry` query param.
// Accepts a GeoJSON Polygon and emits the ESRI JSON shape ArcGIS expects.
export function geoJsonPolygonToEsri(geom: Geometry): string {
  if (geom.type === 'Polygon') {
    return JSON.stringify({ rings: geom.coordinates });
  }
  if (geom.type === 'MultiPolygon') {
    return JSON.stringify({ rings: geom.coordinates.flat() });
  }
  throw new Error(`Unsupported geometry for envelope: ${geom.type}`);
}
