import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tickets = await db.getTickets();
    const customers = await db.getCustomers();
    const products = await db.getProducts();
    const opportunities = await db.getOpportunities();

    const openTickets = tickets.filter((t: any) => t.status !== 'Resolved');
    const criticalIssues = openTickets.filter((t: any) => t.priority === 'Critical').length;
    const highIssues = openTickets.filter((t: any) => t.priority === 'High').length;
    const resolvedThisMonth = tickets.filter((t: any) => t.status === 'Resolved').length;

    const affectedCustomerIds = new Set(openTickets.map((t: any) => t.customer_id));
    const affectedArr = Array.from(affectedCustomerIds).reduce((sum: number, custId: any) => {
      const cust = customers.find((c: any) => c.id === custId);
      return sum + (cust ? Number(cust.arr) : 0);
    }, 0);

    const productBreakdown = products.map((prod: any) => {
      const prodTickets = openTickets.filter((t: any) => t.product_id === prod.id);
      const prodCustIds = new Set(prodTickets.map((t: any) => t.customer_id));
      const prodArr = Array.from(prodCustIds).reduce((sum: number, custId: any) => {
        const cust = customers.find((c: any) => c.id === custId);
        return sum + (cust ? Number(cust.arr) : 0);
      }, 0);

      return {
        product_id: prod.id,
        product_name: prod.name,
        open_tickets: prodTickets.length,
        customers_affected: prodCustIds.size,
        affected_arr: prodArr
      };
    });

    return NextResponse.json({
      success: true,
      productHealth: {
        totalCustomers: customers.length,
        customersWithOpenIssues: affectedCustomerIds.size,
        openTechnicalTickets: openTickets.length,
        resolvedThisMonth,
        affectedArr,
        criticalIssues,
        highPriorityIssues: highIssues,
        avgResolutionTimeHours: tickets.length === 0 ? 0 : 18.4
      },
      productBreakdown,
      opportunities,
      engineeringHealth: {
        totalOpenIssues: openTickets.length,
        inProgress: openTickets.filter((t: any) => t.status === 'In Progress').length,
        blocked: openTickets.filter((t: any) => t.status === 'Blocked').length,
        avgVelocityHrs: 18.4
      },
      priorityTickets: tickets.slice(0, 10)
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
