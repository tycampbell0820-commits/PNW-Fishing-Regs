// CLI: npm run probe
//
// Sends a small probe query to each Snohomish County ArcGIS endpoint and prints
// the property keys + first-record sample so you can confirm the endpoints are
// reachable AND that the field-name assumptions in src/connectors/snohomish/
// match what the live service actually returns.
//
// Use this before turning LANDFINDER_LIVE=1 on a real deploy.

import { SNOHOMISH } from '../connectors/snohomish/endpoints';

interface ProbeResult {
  layer: string;
  url: string;
  ok: boolean;
  status?: number;
  count?: number;
  fieldKeys?: string[];
  sample?: Record<string, unknown>;
  error?: string;
}

async function probe(label: string, url: string): Promise<ProbeResult> {
  const params = new URLSearchParams({
    f: 'geojson',
    where: '1=1',
    outFields: '*',
    returnGeometry: 'false',
    resultRecordCount: '1'
  });
  try {
    const res = await fetch(`${url}?${params.toString()}`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) {
      return { layer: label, url, ok: false, status: res.status, error: `HTTP ${res.status}` };
    }
    const json = (await res.json()) as {
      features?: Array<{ properties?: Record<string, unknown> }>;
      error?: { message: string };
    };
    if (json.error) {
      return { layer: label, url, ok: false, error: json.error.message };
    }
    const features = json.features ?? [];
    const sample = features[0]?.properties ?? {};
    return {
      layer: label,
      url,
      ok: true,
      count: features.length,
      fieldKeys: Object.keys(sample),
      sample
    };
  } catch (err) {
    return { layer: label, url, ok: false, error: (err as Error).message };
  }
}

async function main() {
  const targets: { label: string; url: string }[] = [
    { label: 'parcels', url: SNOHOMISH.parcels },
    { label: 'assessor', url: SNOHOMISH.assessor },
    { label: 'wetlands', url: SNOHOMISH.wetlands },
    { label: 'sewer_ssa', url: SNOHOMISH.sewerServiceArea },
    { label: 'sewer_mains', url: SNOHOMISH.sewerMains },
    { label: 'road_centerlines', url: SNOHOMISH.roadCenterlines }
  ];

  console.log(`Probing ${targets.length} Snohomish County endpoints…\n`);
  for (const t of targets) {
    const r = await probe(t.label, t.url);
    console.log(`▸ ${r.layer}`);
    console.log(`    url: ${r.url}`);
    if (r.ok) {
      console.log(`    ok: features=${r.count}, fields=[${(r.fieldKeys ?? []).join(', ')}]`);
      if (r.sample) {
        console.log(`    sample: ${JSON.stringify(r.sample, null, 2).replace(/\n/g, '\n    ')}`);
      }
    } else {
      console.log(`    FAILED: ${r.error}`);
    }
    console.log();
  }

  console.log('Field-name expectations (see src/connectors/snohomish/merge.ts):');
  console.log('  parcels:   PARCELID | PIN | APN, CALCACRES | ACRES, SITUS | SITE_ADDR | SITUS_ADDRESS');
  console.log('  assessor:  PARCELID | PIN, OWNER_NAME | OWNER | TAXPAYER,');
  console.log('             MAILING_ADDRESS | MAIL_ADDR, LAND_VALUE,');
  console.log('             IMPROVEMENT_VALUE | IMP_VALUE, LAST_SALE_DATE | SALE_DATE');
  console.log('');
  console.log('If a probe shows different keys, update the field accessors in');
  console.log('src/connectors/snohomish/merge.ts (asNumber-wrapped) and re-run.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
