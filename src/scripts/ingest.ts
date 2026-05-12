// CLI: npm run ingest -- [county]
// Pulls raw parcels from a county connector, normalizes them (derived fields +
// score), and upserts into the local SQLite store.

import { getConnector, listCounties } from '../connectors/registry';
import { normalizeParcel } from '../lib/calculations';
import { upsertParcels } from '../lib/db';

async function main() {
  const arg = process.argv.slice(2).join(' ').trim();
  const county = arg || 'Snohomish County, WA';

  if (!listCounties().includes(county)) {
    console.error(`Unknown county: "${county}"`);
    console.error(`Available: ${listCounties().join(', ')}`);
    process.exit(1);
  }

  const connector = getConnector(county);
  console.log(`Ingesting ${county}…`);

  const raw = await connector.fetch({ minGrossAcres: 3 });
  console.log(`  fetched ${raw.length} raw parcels`);

  const normalized = raw.map(normalizeParcel);
  const n = upsertParcels(normalized);
  console.log(`  upserted ${n} parcels`);

  const scores = normalized.map(p => p.finished_lot_potential_score ?? 0);
  const max = Math.max(...scores, 0);
  const min = Math.min(...scores, 0);
  console.log(`  score range: ${min}–${max}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
