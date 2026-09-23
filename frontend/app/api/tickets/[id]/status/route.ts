import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiService } from '@/lib/aiService';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, resolution_note } = body;

    if (!['Open', 'In Progress', 'Blocked', 'Resolved'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    let aiCustomerSummary = null;

    if (status === 'Resolved') {
      const currentTicket = await db.getTicketById(id);
      if (currentTicket) {
        aiCustomerSummary = await aiService.generateCustomerResolutionSummary({
          ticketTitle: currentTicket.title,
          customerName: currentTicket.customer ? currentTicket.customer.name : 'Valued Customer',
          resolutionNote: resolution_note || 'Issue investigated and resolved.'
        });
      }
    }

    const updatedTicket = await db.updateTicketStatus(id, {
      status,
      resolution_note,
      ai_customer_summary: aiCustomerSummary
    });

    if (!updatedTicket) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedTicket });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
