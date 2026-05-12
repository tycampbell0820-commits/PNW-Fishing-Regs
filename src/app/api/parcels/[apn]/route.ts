import { NextRequest, NextResponse } from 'next/server';
import { getParcel } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ apn: string }> }
) {
  const { apn } = await params;
  const county = req.nextUrl.searchParams.get('county') ?? 'Snohomish County, WA';
  const parcel = getParcel(county, apn);
  if (!parcel) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ parcel });
}
