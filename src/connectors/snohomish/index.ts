import path from 'node:path';
import fs from 'node:fs';
import type { CountyConnector, FetchOptions } from '../types';
import type { RawParcel } from '../../lib/types';
import { SNOHOMISH, parcelLookupUrl } from './endpoints';
import { fetchParcels, fetchAssessorByApns } from './layers';
import { buildRawParcel, makeFailureCounters } from './merge';

// Snohomish County connector.
// Default path reads a bundled sample fixture so the app is runnable end-to-end
// without network access. Setting LANDFINDER_LIVE=1 switches to fetchLive which
// hits the public ArcGIS REST endpoints documented in ./endpoints.ts.

const SAMPLE_PATH = path.join(process.cwd(), 'src', 'data', 'snohomish-sample.json');

type SampleRecord = Omit<RawParcel, 'county' | 'source_url'> & {
  county?: string;
  source_url?: string | null;
};

function loadSample(): RawParcel[] {
  const raw = fs.readFileSync(SAMPLE_PATH, 'utf-8');
  const records = JSON.parse(raw) as SampleRecord[];
  return records.map(r => ({
    ...r,
    county: SNOHOMISH.county,
    source_url: r.source_url ?? parcelLookupUrl(r.apn)
  }));
}

async function fetchLive(options: FetchOptions): Promise<RawParcel[]> {
  const minGrossAcres = options.minGrossAcres ?? 3;
  console.log(`[snohomish] live ingest: min ${minGrossAcres} acres, max ${options.maxRecords ?? '∞'} parcels`);

  const parcelFeatures = await fetchParcels({
    minGrossAcres,
    maxRecords: options.maxRecords
  });
  console.log(`[snohomish]   fetched ${parcelFeatures.length} parcel features`);

  const apns: string[] = [];
  for (const p of parcelFeatures) {
    const apn = p.properties.PARCEL_ID ?? p.properties.PARCELID ?? p.properties.PIN ?? p.properties.APN;
    if (apn) apns.push(apn);
  }
  const assessorByApn = await fetchAssessorByApns(apns);
  console.log(`[snohomish]   joined ${assessorByApn.size}/${apns.length} assessor records`);

  const counters = makeFailureCounters();
  const out: RawParcel[] = [];
  // Sequential spatial layer fetches per parcel to be polite to county GIS.
  // Cache makes re-runs fast; a single fresh ingest is acceptably slow.
  for (const feat of parcelFeatures) {
    const parcel = await buildRawParcel(feat, assessorByApn, counters);
    if (parcel) out.push(parcel);
  }

  console.log(
    `[snohomish]   built ${out.length} parcels; layer failures: ` +
    `wetlands=${counters.wetlands} ssa=${counters.sewer_ssa} ` +
    `mains=${counters.sewer_mains} road=${counters.road}`
  );
  return out;
}

export const snohomishConnector: CountyConnector = {
  county: SNOHOMISH.county,
  async fetch(options: FetchOptions = {}) {
    if (process.env.LANDFINDER_LIVE === '1') {
      return fetchLive(options);
    }
    const records = loadSample();
    const min = options.minGrossAcres;
    return min == null
      ? records
      : records.filter(r => (r.gross_acres ?? 0) >= min);
  }
};

export { parcelLookupUrl };
