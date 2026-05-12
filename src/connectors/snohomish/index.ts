import path from 'node:path';
import fs from 'node:fs';
import type { CountyConnector, FetchOptions } from '../types';
import type { RawParcel } from '../../lib/types';
import { SNOHOMISH, parcelLookupUrl } from './endpoints';

// Snohomish County connector.
//
// Phase 1 strategy:
//   - For live ingestion, hit the ArcGIS REST endpoints in ./endpoints.ts,
//     page through results, and join wetland/sewer/road features by APN or
//     spatial overlay. Stubs for that wire format live in `fetchLive` below.
//   - For local development and the acceptance flow, the connector reads a
//     normalized sample fixture so the app is runnable end-to-end without
//     network access. Replace `useSampleData()` with `fetchLive()` once an
//     API key / proxy is in place.
//
// All RawParcel fields can be null; derived fields (usable_acres,
// improvement_ratio, wetland_percent, score) are computed downstream.

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

// Live ingest stub. Wire each layer query here, then merge on APN.
// Left intentionally lightweight in Phase 1 — sample data drives the UI.
async function fetchLive(_options: FetchOptions): Promise<RawParcel[]> {
  // 1) Query SNOHOMISH.parcels for features where CALCACRES >= min, paged 1000 at a time.
  // 2) Join SNOHOMISH.assessor by PARCELID to pull owner_name / mailing_address /
  //    site_address / land_value / improvement_value / last_sale_date.
  // 3) For each parcel polygon, intersect SNOHOMISH.wetlands to compute wetland_acres.
  // 4) Test polygon against SNOHOMISH.sewerServiceArea for inside flag, then run a
  //    nearest-feature query against SNOHOMISH.sewerMains for distance_to_sewer.
  // 5) Test polygon edge against SNOHOMISH.roadCenterlines (buffered by ROW width)
  //    for touches_public_road and estimated_road_frontage.
  // 6) Return RawParcel[] — derived fields and score are computed by normalizeParcel().
  throw new Error('Live Snohomish ingest not enabled in Phase 1. Run `npm run seed`.');
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
