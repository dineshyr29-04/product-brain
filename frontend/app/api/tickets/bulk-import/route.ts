import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiService } from '@/lib/aiService';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds serverless execution on Vercel

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rawText, imageBase64 } = body;

    const customers = await db.getCustomers();
    const products = await db.getProducts();

    const parsedTickets = await aiService.parseBulkDocumentOrOCR({
      rawText,
      imageBase64,
      customers,
      products
    });

    const createdTickets = [];
    for (const tData of parsedTickets) {
      const ticket = await db.createTicket({
        customer_id: tData.customer_id || customers[0]?.id || 'cust-1',
        product_id: tData.product_id || products[0]?.id || 'prod-1',
        title: tData.title || 'Imported Incident Ticket',
        description: tData.description || 'Extracted via AI Document Reader',
        priority: tData.priority || 'High',
        category: tData.category || 'Export Performance',
        technical_logs: tData.technical_logs || null
      });
      createdTickets.push(ticket);
    }

    return NextResponse.json(
      {
        success: true,
        count: createdTickets.length,
        data: createdTickets
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
