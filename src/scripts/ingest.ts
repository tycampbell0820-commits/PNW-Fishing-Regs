// CLI: npm run ingest -- [county] [--limit N] [--min-acres N]
//
// Pulls raw parcels from a county connector in pages, normalizes each batch
// (derived fields + score), and upserts into the local SQLite store. Streaming
// keeps peak memory bounded so very large counties ingest on small VMs.
//
// Live ingestion requires LANDFINDER_LIVE=1. Without it, the connector yields
// its bundled sample data in a single batch.

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

  let totalUpserted = 0;
  let minScore = Infinity;
  let maxScore = -Infinity;

  for await (const batch of connector.fetchStream({
    minGrossAcres: args.minGrossAcres ?? 3,
    maxRecords: args.limit
  })) {
    const normalized = batch.map(normalizeParcel);
    totalUpserted += upsertParcels(normalized);
    for (const p of normalized) {
      const s = p.finished_lot_potential_score ?? 0;
      if (s < minScore) minScore = s;
      if (s > maxScore) maxScore = s;
    }
    console.log(`  batch upserted ${normalized.length} (running total ${totalUpserted})`);
  }

  console.log(`  upserted ${totalUpserted} parcels`);

  if (totalUpserted === 0) {
    console.error(
      'Ingest produced 0 parcels — treating as failure so the caller can ' +
      'restore the previous DB. Check the connector output above for the ' +
      'underlying fetch error.'
    );
    process.exit(2);
  }

  if (Number.isFinite(minScore) && Number.isFinite(maxScore)) {
    console.log(`  score range: ${minScore}–${maxScore}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
