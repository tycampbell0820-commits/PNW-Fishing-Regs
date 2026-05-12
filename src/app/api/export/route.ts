import { NextRequest, NextResponse } from 'next/server';
import { getParcel, queryParcels } from '@/lib/db';
import { parcelsToCsv } from '@/lib/csv';
import { parseQuery } from '@/lib/filters';
import type { Parcel } from '@/lib/types';

export const dynamic = 'force-dynamic';

// POST: export an explicit selection (preferred when users tick rows).
// GET: export the current filter result set.
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    selections?: { county: string; apn: string }[];
  };
  const selections = body.selections ?? [];
  const parcels: Parcel[] = [];
  for (const sel of selections) {
    const p = getParcel(sel.county, sel.apn);
    if (p) parcels.push(p);
  }
  return csvResponse(parcels, 'parcels-selected.csv');
}

export async function GET(req: NextRequest) {
  const q = parseQuery(req.nextUrl.searchParams);
  const parcels = queryParcels({ ...q, limit: q.limit ?? 5000 });
  return csvResponse(parcels, 'parcels-filtered.csv');
}

function csvResponse(parcels: Parcel[], filename: string): NextResponse {
  const csv = parcelsToCsv(parcels);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}
