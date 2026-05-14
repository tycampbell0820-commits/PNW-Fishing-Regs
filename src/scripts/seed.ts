// CLI: npm run seed
// Loads the bundled Snohomish County sample fixture into the local SQLite store.
// Equivalent to `npm run ingest "Snohomish County, WA"` while LANDFINDER_LIVE is unset.

import { snohomishConnector } from '../connectors/snohomish';
import { normalizeParcel } from '../lib/calculations';
import { upsertParcels } from '../lib/db';

async function main() {
  let total = 0;
  for await (const batch of snohomishConnector.fetchStream()) {
    const normalized = batch.map(normalizeParcel);
    total += upsertParcels(normalized);
  }
  console.log(`Seeded ${total} parcels for ${snohomishConnector.county}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
