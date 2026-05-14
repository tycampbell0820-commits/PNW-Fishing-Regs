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
  fetchRoadCenterlinesForParcel,
  fetchSewerMainsForParcel,
  fetchSewerSSAForParcel,
  fetchWetlandsForParcel,
  type AssessorFeatureProps,
  type ParcelFeatureProps
} from './layers';
import { SNOHOMISH, parcelLookupUrl } from './endpoints';

// Spatial-layer fetches (wetlands, sewer, roads) are off by default because
// their endpoints are stale and every call costs four retries with backoff
// per parcel — fatal at ingest scale. Set LANDFINDER_SPATIAL_LAYERS=1 once
// real URLs are wired in to opt back in.
const SPATIAL_LAYERS_ENABLED = process.env.LANDFINDER_SPATIAL_LAYERS === '1';

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
  return props.PARCEL_ID ?? props.PARCELID ?? props.PIN ?? props.APN ?? null;
}

function siteAddressOf(props: ParcelFeatureProps): string | null {
  return props.SITUSLINE1 ?? props.SITUS ?? props.SITE_ADDR ?? props.SITUS_ADDRESS ?? null;
}

function formatMailingAddress(
  line1?: string | null,
  city?: string | null,
  state?: string | null,
  zip?: string | null
): string | null {
  const street = line1?.trim();
  const cityState = [city?.trim(), state?.trim()].filter(Boolean).join(', ');
  const tail = [cityState, zip?.trim()].filter(Boolean).join(' ');
  const out = [street, tail].filter(Boolean).join(', ');
  return out || null;
}

function ownerNameFromParcel(props: ParcelFeatureProps): string | null {
  const name = props.OWNERNAME ?? props.TAXPRNAME;
  return name?.trim() || null;
}

function mailingAddressFromParcel(props: ParcelFeatureProps): string | null {
  return (
    formatMailingAddress(props.OWNERLINE1, props.OWNERCITY, props.OWNERSTATE, props.OWNERZIP) ??
    formatMailingAddress(props.TAXPRLINE1, props.TAXPRCITY, props.TAXPRSTATE, props.TAXPRZIP)
  );
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
    asNumber(parcelFeature.properties.GIS_ACRES) ??
    asNumber(parcelFeature.properties.TAB_ACRES) ??
    asNumber(parcelFeature.properties.CALCACRES) ??
    asNumber(parcelFeature.properties.ACRES) ??
    polygonAreaAcres(parcelFeature.geometry);

  const envelope = polygonEnvelope(parcelFeature.geometry);
  if (!envelope) return null;

  const assessor = assessorByApn.get(apn) ?? null;

  // Spatial layer fetches. Each one is independently fault-tolerant.
  const [wetlandFeatures, ssaFeatures, mainFeatures, roadFeatures] = SPATIAL_LAYERS_ENABLED
    ? await Promise.all([
        fetchWetlandsForParcel(envelope).catch(() => { counters.wetlands++; return []; }),
        fetchSewerSSAForParcel(envelope).catch(() => { counters.sewer_ssa++; return []; }),
        fetchSewerMainsForParcel(envelope).catch(() => { counters.sewer_mains++; return []; }),
        fetchRoadCenterlinesForParcel(envelope).catch(() => { counters.road++; return []; })
      ])
    : [[], [], [], []];

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
    owner_name: ownerNameFromParcel(parcelFeature.properties)
      ?? (assessor ? ownerNameOf(assessor) : null),
    mailing_address: mailingAddressFromParcel(parcelFeature.properties)
      ?? (assessor ? mailingAddressOf(assessor) : null),
    site_address: siteAddressOf(parcelFeature.properties),
    gross_acres: grossAcres,
    land_value: asNumber(parcelFeature.properties.MKLND)
      ?? (assessor ? asNumber(assessor.LAND_VALUE) : null),
    improvement_value: asNumber(parcelFeature.properties.MKIMP)
      ?? (assessor ? improvementValueOf(assessor) : null),
    total_value: asNumber(parcelFeature.properties.MKTTL),
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
