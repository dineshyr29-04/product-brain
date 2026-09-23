import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    let tickets = await db.getTickets();

    if (status) {
      tickets = tickets.filter((t: any) => t.status === status);
    }
    if (priority) {
      tickets = tickets.filter((t: any) => t.priority === priority);
    }

    return NextResponse.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer_id, product_id, title, description, priority, category, technical_logs } = body;

    if (!customer_id || !product_id || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required ticket fields' },
        { status: 400 }
      );
    }

    const newTicket = await db.createTicket({
      customer_id,
      product_id,
      title,
      description,
      priority: priority || 'Medium',
      category: category || 'General',
      technical_logs: technical_logs || null
    });

    return NextResponse.json({ success: true, data: newTicket }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
