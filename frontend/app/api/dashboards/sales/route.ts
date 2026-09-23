import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tickets = await db.getTickets();
    const customers = await db.getCustomers();

    const openTickets = tickets.filter((t: any) => t.status !== 'Resolved');
    const criticalIssues = openTickets.filter((t: any) => t.priority === 'Critical');
    const resolvedThisWeek = tickets.filter((t: any) => t.status === 'Resolved');

    const affectedCustomerIds = new Set(openTickets.map((t: any) => t.customer_id));
    const affectedArr = Array.from(affectedCustomerIds).reduce((sum: number, custId: any) => {
      const cust = customers.find((c: any) => c.id === custId);
      return sum + (cust ? Number(cust.arr) : 0);
    }, 0);

    return NextResponse.json({
      success: true,
      metrics: {
        totalCustomersWithIssues: affectedCustomerIds.size,
        openIssuesCount: openTickets.length,
        criticalIssuesCount: criticalIssues.length,
        affectedArr,
        resolvedThisWeekCount: resolvedThisWeek.length
      },
      customerIssues: tickets,
      allCustomers: customers
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
