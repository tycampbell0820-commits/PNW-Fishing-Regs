// Per-layer query helpers. Each function knows its endpoint, fields, and how
// to surface failures (returning empty + logging rather than throwing).

import { iteratePages, queryLayer, type GeoJsonFeature } from './arcgis';
import { SNOHOMISH } from './endpoints';
import { envelopeToEsri } from './geometry';

export interface ParcelFeatureProps {
  // Snohomish FeatureServer (services6.arcgis.com) — current source of truth.
  PARCEL_ID?: string;
  GIS_ACRES?: number;
  TAB_ACRES?: number;
  OWNERNAME?: string;
  OWNERLINE1?: string;
  OWNERCITY?: string;
  OWNERSTATE?: string;
  OWNERZIP?: string;
  TAXPRNAME?: string;
  TAXPRLINE1?: string;
  TAXPRCITY?: string;
  TAXPRSTATE?: string;
  TAXPRZIP?: string;
  SITUSLINE1?: string;
  MKLND?: number;
  MKIMP?: number;
  MKTTL?: number;
  // Legacy / fallback names from the old gis.snoco.org MapServer schema.
  PARCELID?: string;
  PIN?: string;
  APN?: string;
  CALCACRES?: number;
  ACRES?: number;
  SITUS?: string;
  SITE_ADDR?: string;
  SITUS_ADDRESS?: string;
}

export interface AssessorFeatureProps {
  PARCELID?: string;
  PIN?: string;
  OWNER_NAME?: string;
  OWNER?: string;
  TAXPAYER?: string;
  MAILING_ADDRESS?: string;
  MAIL_ADDR?: string;
  LAND_VALUE?: number;
  IMP_VALUE?: number;
  IMPROVEMENT_VALUE?: number;
  LAST_SALE_DATE?: string | number;
  SALE_DATE?: string | number;
}

const PAGE_SIZE = 1000;

// Fields we actually read in merge.ts. Restricting outFields dramatically
// reduces per-feature memory (the full schema is 50+ columns, most unused).
const PARCEL_OUTFIELDS = [
  'PARCEL_ID', 'GIS_ACRES', 'TAB_ACRES',
  'OWNERNAME', 'OWNERLINE1', 'OWNERCITY', 'OWNERSTATE', 'OWNERZIP',
  'TAXPRNAME', 'TAXPRLINE1', 'TAXPRCITY', 'TAXPRSTATE', 'TAXPRZIP',
  'SITUSLINE1',
  'MKLND', 'MKIMP', 'MKTTL'
].join(',');

export async function* iterateParcelPages(
  options: { minGrossAcres: number; maxRecords?: number }
): AsyncGenerator<GeoJsonFeature<ParcelFeatureProps>[]> {
  const where = `GIS_ACRES >= ${options.minGrossAcres}`;
  try {
    for await (const page of iteratePages(
      SNOHOMISH.parcels,
      { where, returnGeometry: true, outFields: PARCEL_OUTFIELDS },
      PAGE_SIZE,
      'parcels',
      options.maxRecords
    )) {
      yield page as GeoJsonFeature<ParcelFeatureProps>[];
    }
  } catch (err) {
    console.error('[snohomish] parcels fetch failed:', (err as Error).message);
  }
}

export async function fetchParcels(
  options: { minGrossAcres: number; maxRecords?: number }
): Promise<GeoJsonFeature<ParcelFeatureProps>[]> {
  const out: GeoJsonFeature<ParcelFeatureProps>[] = [];
  for await (const page of iterateParcelPages(options)) {
    out.push(...page);
    if (options.maxRecords != null && out.length >= options.maxRecords) {
      return out.slice(0, options.maxRecords);
    }
  }
  return out;
}

export async function fetchAssessorByApns(apns: string[]): Promise<Map<string, AssessorFeatureProps>> {
  const byApn = new Map<string, AssessorFeatureProps>();
  if (apns.length === 0) return byApn;

  // ArcGIS WHERE clauses have practical length limits; batch APN lookups.
  const BATCH = 250;
  for (let i = 0; i < apns.length; i += BATCH) {
    const batch = apns.slice(i, i + BATCH);
    const list = batch.map(a => `'${a.replace(/'/g, "''")}'`).join(',');
    const where = `PARCELID IN (${list})`;
    try {
      const result = await queryLayer(
        SNOHOMISH.assessor,
        { where, returnGeometry: false },
        'assessor'
      );
      for (const f of result.features as GeoJsonFeature<AssessorFeatureProps>[]) {
        const apn = f.properties.PARCELID ?? f.properties.PIN;
        if (apn) byApn.set(apn, f.properties);
      }
    } catch (err) {
      console.error('[snohomish] assessor batch failed:', (err as Error).message);
    }
  }
  return byApn;
}

// Fetch wetland polygons intersecting the parcel's bounding box.
export async function fetchWetlandsForParcel(envelope: [number, number, number, number]) {
  try {
    const result = await queryLayer(
      SNOHOMISH.wetlands,
      {
        where: '1=1',
        returnGeometry: true,
        geometry: envelopeToEsri(envelope),
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelIntersects'
      },
      'wetlands'
    );
    return result.features;
  } catch (err) {
    console.error('[snohomish] wetlands query failed:', (err as Error).message);
    return [];
  }
}

export async function fetchSewerSSAForParcel(envelope: [number, number, number, number]) {
  try {
    const result = await queryLayer(
      SNOHOMISH.sewerServiceArea,
      {
        where: '1=1',
        returnGeometry: true,
        geometry: envelopeToEsri(envelope),
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelIntersects'
      },
      'sewer-ssa'
    );
    return result.features;
  } catch (err) {
    console.error('[snohomish] sewer SSA query failed:', (err as Error).message);
    return [];
  }
}

export async function fetchSewerMainsForParcel(envelope: [number, number, number, number]) {
  // Expand the envelope by ~0.02° (≈ 2km) to find nearby mains for distance lookup.
  const [xmin, ymin, xmax, ymax] = envelope;
  const padded: [number, number, number, number] = [xmin - 0.02, ymin - 0.02, xmax + 0.02, ymax + 0.02];
  try {
    const result = await queryLayer(
      SNOHOMISH.sewerMains,
      {
        where: '1=1',
        returnGeometry: true,
        geometry: envelopeToEsri(padded),
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelIntersects'
      },
      'sewer-mains'
    );
    return result.features;
  } catch (err) {
    console.error('[snohomish] sewer mains query failed:', (err as Error).message);
    return [];
  }
}

export async function fetchRoadCenterlinesForParcel(envelope: [number, number, number, number]) {
  try {
    const result = await queryLayer(
      SNOHOMISH.roadCenterlines,
      {
        where: '1=1',
        returnGeometry: true,
        geometry: envelopeToEsri(envelope),
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelIntersects'
      },
      'road-centerlines'
    );
    return result.features;
  } catch (err) {
    console.error('[snohomish] road centerlines query failed:', (err as Error).message);
    return [];
  }
}
