// CLI: npm run ingest -- [county] [--limit N] [--min-acres N]
//
// Pulls raw parcels from a county connector, normalizes them (derived fields +
// score), and upserts into the local SQLite store.
//
// Live ingestion requires LANDFINDER_LIVE=1. Without it, the connector returns
// its bundled sample data — useful for offline UI work.

import { getConnector, listCounties } from '../connectors/registry';
import { normalizeParcel } from '../lib/calculations';
import { upsertParcels } from '../lib/db';

interface CliArgs {
  county: string;
  limit?: number;
  minGrossAcres?: number;
}

function parseArgs(argv: string[]): CliArgs {
  let county = 'Snohomish County, WA';
  let limit: number | undefined;
  let minGrossAcres: number | undefined;

  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--limit') {
      const v = Number(argv[++i]);
      if (Number.isFinite(v) && v > 0) limit = v;
    } else if (a === '--min-acres') {
      const v = Number(argv[++i]);
      if (Number.isFinite(v) && v > 0) minGrossAcres = v;
    } else if (a.startsWith('--limit=')) {
      const v = Number(a.split('=')[1]);
      if (Number.isFinite(v) && v > 0) limit = v;
    } else if (a.startsWith('--min-acres=')) {
      const v = Number(a.split('=')[1]);
      if (Number.isFinite(v) && v > 0) minGrossAcres = v;
    } else {
      positional.push(a);
    }
  }
  if (positional.length > 0) county = positional.join(' ');
  return { county, limit, minGrossAcres };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!listCounties().includes(args.county)) {
    console.error(`Unknown county: "${args.county}"`);
    console.error(`Available: ${listCounties().join(', ')}`);
    process.exit(1);
  }

  const connector = getConnector(args.county);
  console.log(`Ingesting ${args.county}${args.limit ? ` (limit ${args.limit})` : ''}…`);

  const raw = await connector.fetch({
    minGrossAcres: args.minGrossAcres ?? 3,
    maxRecords: args.limit
  });

  console.log(`  fetched ${raw.length} raw parcels`);
  const normalized = raw.map(normalizeParcel);
  const n = upsertParcels(normalized);
  console.log(`  upserted ${n} parcels`);

  if (n === 0) {
    console.error(
      'Ingest produced 0 parcels — treating as failure so the caller can ' +
      'restore the previous DB. Check the connector output above for the ' +
      'underlying fetch error.'
    );
    process.exit(2);
  }

  const scores = normalized
    .map(p => p.finished_lot_potential_score ?? 0)
    .sort((a, b) => a - b);
  if (scores.length > 0) {
    console.log(`  score range: ${scores[0]}–${scores[scores.length - 1]}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
