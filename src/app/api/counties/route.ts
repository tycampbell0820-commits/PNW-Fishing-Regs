import { NextResponse } from 'next/server';
import { listCounties } from '@/lib/db';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ counties: listCounties() });
}
