import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    system: 'ProductBrain V1 Unified Serverless API',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
}
