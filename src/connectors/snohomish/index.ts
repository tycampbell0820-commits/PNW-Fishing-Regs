import path from 'node:path';
import fs from 'node:fs';
import type { CountyConnector, FetchOptions } from '../types';
import type { RawParcel } from '../../lib/types';
import type { AssessorFeatureProps } from './layers';
import { SNOHOMISH, parcelLookupUrl } from './endpoints';
import { iterateParcelPages } from './layers';
import { buildRawParcel, makeFailureCounters } from './merge';

// Snohomish County connector.
// Default path reads a bundled sample fixture so the app is runnable end-to-end
// without network access. Setting LANDFINDER_LIVE=1 switches to the live stream
// that hits the public ArcGIS REST endpoint defined in ./endpoints.ts.

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

async function* fetchLiveStream(options: FetchOptions): AsyncGenerator<RawParcel[]> {
  const minGrossAcres = options.minGrossAcres ?? 3;
  console.log(`[snohomish] live ingest: min ${minGrossAcres} acres, max ${options.maxRecords ?? '∞'} parcels`);

  const counters = makeFailureCounters();
  const emptyAssessor = new Map<string, AssessorFeatureProps>();
  let totalFetched = 0;
  let totalBuilt = 0;

  for await (const page of iterateParcelPages({ minGrossAcres, maxRecords: options.maxRecords })) {
    totalFetched += page.length;
    const built: RawParcel[] = [];
    for (const feat of page) {
      const parcel = await buildRawParcel(feat, emptyAssessor, counters);
      if (parcel) built.push(parcel);
    }
    totalBuilt += built.length;
    console.log(`[snohomish]   page: ${page.length} features → ${built.length} parcels (running total ${totalBuilt})`);
    if (built.length > 0) yield built;
  }

  console.log(
    `[snohomish]   done. ${totalBuilt} parcels built from ${totalFetched} features; layer failures: ` +
    `wetlands=${counters.wetlands} ssa=${counters.sewer_ssa} ` +
    `mains=${counters.sewer_mains} road=${counters.road}`
  );
}

async function* fetchSampleStream(options: FetchOptions): AsyncGenerator<RawParcel[]> {
  const records = loadSample();
  const min = options.minGrossAcres;
  const filtered = min == null ? records : records.filter(r => (r.gross_acres ?? 0) >= min);
  if (filtered.length > 0) yield filtered;
}

export const snohomishConnector: CountyConnector = {
  county: SNOHOMISH.county,
  fetchStream(options: FetchOptions = {}) {
    return process.env.LANDFINDER_LIVE === '1'
      ? fetchLiveStream(options)
      : fetchSampleStream(options);
  }
};

export { parcelLookupUrl };
