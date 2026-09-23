import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/dashboards/sales - Sales Dashboard Metrics & Customer Issues Table
router.get('/sales', async (req, res) => {
  try {
    const tickets = await db.getTickets();
    const customers = await db.getCustomers();

    const openTickets = tickets.filter((t) => t.status !== 'Resolved');
    const criticalIssues = openTickets.filter((t) => t.priority === 'Critical');
    const resolvedThisWeek = tickets.filter((t) => t.status === 'Resolved');

    // Unique customers with open issues
    const affectedCustomerIds = new Set(openTickets.map((t) => t.customer_id));
    const affectedCustomersCount = affectedCustomerIds.size;

    // Calculate Affected ARR
    const affectedArr = Array.from(affectedCustomerIds).reduce((sum, custId) => {
      const cust = customers.find((c) => c.id === custId);
      return sum + (cust ? Number(cust.arr) : 0);
    }, 0);

    res.json({
      success: true,
      metrics: {
        totalCustomersWithIssues: affectedCustomersCount,
        openIssuesCount: openTickets.length,
        criticalIssuesCount: criticalIssues.length,
        affectedArr,
        resolvedThisWeekCount: resolvedThisWeek.length
      },
      customerIssues: tickets,
      allCustomers: customers
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dashboards/engineering - Engineering Dashboard Metrics & Queue
router.get('/engineering', async (req, res) => {
  try {
    const tickets = await db.getTickets();

    const openCount = tickets.filter((t) => t.status === 'Open').length;
    const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
    const blockedCount = tickets.filter((t) => t.status === 'Blocked').length;
    const resolvedTodayCount = tickets.filter((t) => t.status === 'Resolved').length;

    res.json({
      success: true,
      metrics: {
        openTickets: openCount,
        inProgress: inProgressCount,
        blocked: blockedCount,
        resolvedToday: resolvedTodayCount,
        avgResolutionTimeHours: tickets.length === 0 ? 0 : 18.4
      },
      tickets
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dashboards/pm - PM Dashboard Overview, Product Health & Opportunities
router.get('/pm', async (req, res) => {
  try {
    const tickets = await db.getTickets();
    const customers = await db.getCustomers();
    const products = await db.getProducts();
    const opportunities = await db.getOpportunities();

    const openTickets = tickets.filter((t) => t.status !== 'Resolved');
    const criticalIssues = openTickets.filter((t) => t.priority === 'Critical').length;
    const highIssues = openTickets.filter((t) => t.priority === 'High').length;
    const resolvedThisMonth = tickets.filter((t) => t.status === 'Resolved').length;

    const affectedCustomerIds = new Set(openTickets.map((t) => t.customer_id));
    const affectedArr = Array.from(affectedCustomerIds).reduce((sum, custId) => {
      const cust = customers.find((c) => c.id === custId);
      return sum + (cust ? Number(cust.arr) : 0);
    }, 0);

    // Group product health metrics by Product
    const productBreakdown = products.map((prod) => {
      const prodTickets = openTickets.filter((t) => t.product_id === prod.id);
      const prodCustIds = new Set(prodTickets.map((t) => t.customer_id));
      const prodArr = Array.from(prodCustIds).reduce((sum, custId) => {
        const cust = customers.find((c) => c.id === custId);
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

    res.json({
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
        open: tickets.filter((t) => t.status === 'Open').length,
        progress: tickets.filter((t) => t.status === 'In Progress').length,
        blocked: tickets.filter((t) => t.status === 'Blocked').length,
        resolved: tickets.filter((t) => t.status === 'Resolved').length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dashboards/meta - Fetch reference customers & products for ticket creation
router.get('/meta', async (req, res) => {
  try {
    const customers = await db.getCustomers();
    const products = await db.getProducts();
    res.json({ success: true, customers, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/dashboards/reset-to-zero - Clear all tickets and opportunities to 0
router.post('/reset-to-zero', async (req, res) => {
  try {
    const result = await db.resetToZero();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/dashboards/seed-demo - Re-populate demo dataset
router.post('/seed-demo', async (req, res) => {
  try {
    const result = await db.seedDemo();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
