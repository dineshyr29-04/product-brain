import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const personas = typeof db.getPersonas === 'function' ? await db.getPersonas() : [
      { id: 'p-1', name: 'Product Manager', email: 'pm@productbrain.io', role: 'pm', department: 'Product Strategy' },
      { id: 'p-2', name: 'Sales Lead', email: 'sales@productbrain.io', role: 'sales', department: 'Sales & Success' },
      { id: 'p-3', name: 'Staff Engineer', email: 'eng@productbrain.io', role: 'engineering', department: 'Engineering' }
    ];
    return NextResponse.json({ success: true, personas });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
