import type { RawParcel } from '../../lib/types';
import type { GeoJsonFeature } from './arcgis';
import {
  intersectionAcres,
  centroidInsideAny,
  nearestLineDistanceFeet,
  polygonAreaAcres,
  polygonEnvelope,
  roadFrontageFeet,
  touchesAnyLine
} from './geometry';
import {
  fetchAssessorByApns,
  fetchRoadCenterlinesForParcel,
  fetchSewerMainsForParcel,
  fetchSewerSSAForParcel,
  fetchWetlandsForParcel,
  type AssessorFeatureProps,
  type ParcelFeatureProps
} from './layers';
import { SNOHOMISH, parcelLookupUrl } from './endpoints';

interface LayerFailureCounters {
  wetlands: number;
  sewer_ssa: number;
  sewer_mains: number;
  road: number;
}

function asNumber(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function asDateString(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') {
    // ArcGIS dates are epoch ms.
    const d = new Date(v);
    if (!Number.isFinite(d.getTime())) return null;
    return d.toISOString().slice(0, 10);
  }
  return null;
}

function apnOf(props: ParcelFeatureProps): string | null {
  return props.PARCELID ?? props.PIN ?? props.APN ?? null;
}

function siteAddressOf(props: ParcelFeatureProps): string | null {
  return props.SITUS ?? props.SITE_ADDR ?? props.SITUS_ADDRESS ?? null;
}

function ownerNameOf(props: AssessorFeatureProps): string | null {
  return props.OWNER_NAME ?? props.OWNER ?? props.TAXPAYER ?? null;
}

function mailingAddressOf(props: AssessorFeatureProps): string | null {
  return props.MAILING_ADDRESS ?? props.MAIL_ADDR ?? null;
}

function improvementValueOf(props: AssessorFeatureProps): number | null {
  return asNumber(props.IMPROVEMENT_VALUE ?? props.IMP_VALUE);
}

function lastSaleOf(props: AssessorFeatureProps): string | null {
  return asDateString(props.LAST_SALE_DATE ?? props.SALE_DATE);
}

// Build one RawParcel by joining the parcel feature with assessor + spatial layers.
export async function buildRawParcel(
  parcelFeature: GeoJsonFeature<ParcelFeatureProps>,
  assessorByApn: Map<string, AssessorFeatureProps>,
  counters: LayerFailureCounters
): Promise<RawParcel | null> {
  const apn = apnOf(parcelFeature.properties);
  if (!apn || !parcelFeature.geometry) return null;

  const grossAcres =
    asNumber(parcelFeature.properties.CALCACRES) ??
    asNumber(parcelFeature.properties.ACRES) ??
    polygonAreaAcres(parcelFeature.geometry);

  const envelope = polygonEnvelope(parcelFeature.geometry);
  if (!envelope) return null;

  const assessor = assessorByApn.get(apn) ?? null;

  // Spatial layer fetches. Each one is independently fault-tolerant.
  const [wetlandFeatures, ssaFeatures, mainFeatures, roadFeatures] = await Promise.all([
    fetchWetlandsForParcel(envelope).catch(() => { counters.wetlands++; return []; }),
    fetchSewerSSAForParcel(envelope).catch(() => { counters.sewer_ssa++; return []; }),
    fetchSewerMainsForParcel(envelope).catch(() => { counters.sewer_mains++; return []; }),
    fetchRoadCenterlinesForParcel(envelope).catch(() => { counters.road++; return []; })
  ]);

  const wetlandAcres = wetlandFeatures.length > 0
    ? intersectionAcres(parcelFeature.geometry, wetlandFeatures)
    : null;

  const insideSSA = ssaFeatures.length > 0
    ? centroidInsideAny(parcelFeature.geometry, ssaFeatures)
    : null;

  const distanceToSewer = mainFeatures.length > 0
    ? nearestLineDistanceFeet(parcelFeature.geometry, mainFeatures)
    : null;

  const touchesRoad = roadFeatures.length > 0
    ? touchesAnyLine(parcelFeature.geometry, roadFeatures)
    : null;

  const roadFrontage = roadFeatures.length > 0
    ? roadFrontageFeet(parcelFeature.geometry, roadFeatures, 2)
    : null;

  return {
    county: SNOHOMISH.county,
    apn,
    owner_name: assessor ? ownerNameOf(assessor) : null,
    mailing_address: assessor ? mailingAddressOf(assessor) : null,
    site_address: siteAddressOf(parcelFeature.properties),
    gross_acres: grossAcres,
    land_value: assessor ? asNumber(assessor.LAND_VALUE) : null,
    improvement_value: assessor ? improvementValueOf(assessor) : null,
    total_value: null,
    last_sale_date: assessor ? lastSaleOf(assessor) : null,
    wetland_acres: wetlandAcres,
    inside_sewer_service_area: insideSSA,
    distance_to_sewer: distanceToSewer,
    touches_public_road: touchesRoad,
    estimated_road_frontage: roadFrontage,
    source_url: parcelLookupUrl(apn)
  };
}

export function makeFailureCounters(): LayerFailureCounters {
  return { wetlands: 0, sewer_ssa: 0, sewer_mains: 0, road: 0 };
}
