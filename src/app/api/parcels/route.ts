import { NextRequest, NextResponse } from 'next/server';
import { queryParcels } from '@/lib/db';
import { parseQuery } from '@/lib/filters';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = parseQuery(req.nextUrl.searchParams);
  const parcels = queryParcels(q);
  return NextResponse.json({ parcels, count: parcels.length });
}
