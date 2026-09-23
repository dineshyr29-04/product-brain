import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const opportunities = await db.getOpportunities();
    return NextResponse.json({
      success: true,
      count: opportunities.length,
      data: opportunities
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
