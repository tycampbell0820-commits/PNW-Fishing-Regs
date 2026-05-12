import { feature, featureCollection } from '@turf/helpers';
import area from '@turf/area';
import length from '@turf/length';
import intersect from '@turf/intersect';
import buffer from '@turf/buffer';
import booleanIntersects from '@turf/boolean-intersects';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import type {
  Feature,
  LineString,
  MultiLineString,
  MultiPolygon,
  Point,
  Polygon,
  Position
} from 'geojson';
import type { Geometry, GeoJsonFeature } from './arcgis';

const SQM_PER_ACRE = 4046.8564224;
const M_PER_FT = 0.3048;

export const squareMetersToAcres = (sqm: number): number => sqm / SQM_PER_ACRE;
export const metersToFeet = (m: number): number => m / M_PER_FT;

export function asPolygonFeature(geom: Geometry): Feature<Polygon | MultiPolygon> | null {
  if (geom.type === 'Polygon') {
    return feature({ type: 'Polygon', coordinates: geom.coordinates as Position[][] });
  }
  if (geom.type === 'MultiPolygon') {
    return feature({ type: 'MultiPolygon', coordinates: geom.coordinates as Position[][][] });
  }
  return null;
}

export function asLineFeature(geom: Geometry): Feature<LineString | MultiLineString> | null {
  if (geom.type === 'LineString') {
    return feature({ type: 'LineString', coordinates: geom.coordinates as Position[] });
  }
  if (geom.type === 'MultiLineString') {
    return feature({ type: 'MultiLineString', coordinates: geom.coordinates as Position[][] });
  }
  return null;
}

export function polygonAreaAcres(geom: Geometry): number {
  const f = asPolygonFeature(geom);
  if (!f) return 0;
  return squareMetersToAcres(area(f));
}

// Sum of intersection acres between a parcel polygon and a list of polygon features.
export function intersectionAcres(parcel: Geometry, others: GeoJsonFeature[]): number {
  const a = asPolygonFeature(parcel);
  if (!a) return 0;
  let total = 0;
  for (const o of others) {
    if (!o.geometry) continue;
    const b = asPolygonFeature(o.geometry);
    if (!b) continue;
    try {
      const inter = intersect(featureCollection([a, b]));
      if (inter) total += squareMetersToAcres(area(inter));
    } catch {
      // turf throws on self-intersecting / invalid geometry; skip.
    }
  }
  return total;
}

// True if any polygon in `others` intersects the parcel polygon.
export function intersectsAnyPolygon(parcel: Geometry, others: GeoJsonFeature[]): boolean {
  const a = asPolygonFeature(parcel);
  if (!a) return false;
  for (const o of others) {
    if (!o.geometry) continue;
    const b = asPolygonFeature(o.geometry);
    if (!b) continue;
    try {
      if (booleanIntersects(a, b)) return true;
    } catch {
      // ignore invalid geometry
    }
  }
  return false;
}

// Total length (in feet) of road centerline segments whose geometry intersects
// the parcel polygon (optionally buffered). Approximates frontage by summing the
// full length of intersecting segments — county centerlines are typically split
// at intersections so each segment is short.
export function roadFrontageFeet(
  parcel: Geometry,
  lines: GeoJsonFeature[],
  bufferMeters = 0
): number {
  const a = asPolygonFeature(parcel);
  if (!a) return 0;
  const region = bufferMeters > 0
    ? (buffer(a, bufferMeters, { units: 'meters' }) as Feature<Polygon | MultiPolygon> | undefined)
    : a;
  if (!region) return 0;

  let totalKm = 0;
  for (const l of lines) {
    if (!l.geometry) continue;
    const ln = asLineFeature(l.geometry);
    if (!ln) continue;
    try {
      if (booleanIntersects(region, ln)) {
        totalKm += length(ln, { units: 'kilometers' });
      }
    } catch {
      // ignore
    }
  }
  return metersToFeet(totalKm * 1000);
}

// True if any line in `lines` directly touches the parcel polygon boundary
// (uses a tiny epsilon buffer to absorb GIS rounding).
export function touchesAnyLine(parcel: Geometry, lines: GeoJsonFeature[]): boolean {
  const a = asPolygonFeature(parcel);
  if (!a) return false;
  const epsilon = buffer(a, 1, { units: 'meters' }) as Feature<Polygon | MultiPolygon> | undefined;
  if (!epsilon) return false;
  for (const l of lines) {
    if (!l.geometry) continue;
    const ln = asLineFeature(l.geometry);
    if (!ln) continue;
    try {
      if (booleanIntersects(epsilon, ln)) return true;
    } catch {
      // ignore
    }
  }
  return false;
}

// True if the parcel centroid falls within any polygon in `others`.
export function centroidInsideAny(parcel: Geometry, others: GeoJsonFeature[]): boolean {
  const c = polygonCentroid(parcel);
  if (!c) return false;
  const pt: Feature<Point> = feature({ type: 'Point', coordinates: c });
  for (const o of others) {
    if (!o.geometry) continue;
    const poly = asPolygonFeature(o.geometry);
    if (!poly) continue;
    try {
      if (booleanPointInPolygon(pt, poly)) return true;
    } catch {
      // ignore
    }
  }
  return false;
}

// Approximate haversine distance between two lon/lat points in feet.
export function haversineFeet(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const [lon1, lat1] = a;
  const [lon2, lat2] = b;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return metersToFeet(2 * R * Math.asin(Math.sqrt(h)));
}

// Nearest distance (feet) from a parcel centroid to any line vertex.
// Phase 2 approximation; a true polygon-to-line nearest-point query can land in Phase 3.
export function nearestLineDistanceFeet(
  parcel: Geometry,
  lines: GeoJsonFeature[]
): number | null {
  if (lines.length === 0) return null;
  const centroid = polygonCentroid(parcel);
  if (!centroid) return null;
  let best = Infinity;
  for (const l of lines) {
    if (!l.geometry) continue;
    for (const pt of linePoints(l.geometry)) {
      const d = haversineFeet(centroid, pt);
      if (d < best) best = d;
    }
  }
  return best === Infinity ? null : best;
}

export function polygonCentroid(geom: Geometry): [number, number] | null {
  const rings: Position[][] =
    geom.type === 'Polygon' ? (geom.coordinates as Position[][])
      : geom.type === 'MultiPolygon' ? ((geom.coordinates as Position[][][])[0] ?? [])
      : [];
  const ring = rings[0];
  if (!ring || ring.length === 0) return null;
  let x = 0;
  let y = 0;
  for (const [lon, lat] of ring) {
    x += lon;
    y += lat;
  }
  return [x / ring.length, y / ring.length];
}

function* linePoints(geom: Geometry): Generator<[number, number]> {
  if (geom.type === 'LineString') {
    for (const c of geom.coordinates as Position[]) yield [c[0], c[1]];
  } else if (geom.type === 'MultiLineString') {
    for (const ln of geom.coordinates as Position[][]) {
      for (const c of ln) yield [c[0], c[1]];
    }
  }
}

// Bounding-box envelope of a polygon, in [xmin, ymin, xmax, ymax].
export function polygonEnvelope(geom: Geometry): [number, number, number, number] | null {
  let xmin = Infinity;
  let ymin = Infinity;
  let xmax = -Infinity;
  let ymax = -Infinity;
  const rings: Position[][] =
    geom.type === 'Polygon' ? (geom.coordinates as Position[][])
      : geom.type === 'MultiPolygon' ? ((geom.coordinates as Position[][][]).flat() as Position[][])
      : [];
  for (const ring of rings) {
    for (const [x, y] of ring) {
      if (x < xmin) xmin = x;
      if (y < ymin) ymin = y;
      if (x > xmax) xmax = x;
      if (y > ymax) ymax = y;
    }
  }
  if (!Number.isFinite(xmin)) return null;
  return [xmin, ymin, xmax, ymax];
}

export function envelopeToEsri(env: [number, number, number, number]): string {
  const [xmin, ymin, xmax, ymax] = env;
  return JSON.stringify({ xmin, ymin, xmax, ymax, spatialReference: { wkid: 4326 } });
}
