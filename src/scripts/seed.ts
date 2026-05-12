// CLI: npm run seed
// Loads the bundled Snohomish County sample fixture into the local SQLite store.
// Equivalent to `npm run ingest "Snohomish County, WA"` while LANDFINDER_LIVE is unset.

import { snohomishConnector } from '../connectors/snohomish';
import { normalizeParcel } from '../lib/calculations';
import { upsertParcels } from '../lib/db';

async function main() {
  const raw = await snohomishConnector.fetch();
  const normalized = raw.map(normalizeParcel);
  const n = upsertParcels(normalized);
  console.log(`Seeded ${n} parcels for ${snohomishConnector.county}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
