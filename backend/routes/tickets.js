import express from 'express';
import { db } from '../db.js';
import { aiService } from '../aiService.js';
import { z } from 'zod';

const router = express.Router();

const createTicketSchema = z.object({
  customer_id: z.string().min(1, 'Customer is required'),
  product_id: z.string().min(1, 'Product is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  category: z.string().optional(),
  technical_logs: z.string().optional()
});

// GET /api/tickets - List all tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await db.getTickets();
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tickets/create - Submit & auto-enrich customer ticket
router.post('/create', async (req, res) => {
  try {
    const validatedData = createTicketSchema.parse(req.body);
    const newTicket = await db.createTicket(validatedData);
    res.status(201).json({ success: true, data: newTicket });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tickets/bulk-import - AI Document Reader, OCR & Multi-Ticket Splitter
router.post('/bulk-import', async (req, res) => {
  try {
    const { rawText, imageBase64 } = req.body;
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

    res.status(201).json({
      success: true,
      count: createdTickets.length,
      data: createdTickets
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/tickets/:id/status - Update ticket status (Engineering Action)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolution_note } = req.body;

    if (!['Open', 'In Progress', 'Blocked', 'Resolved'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
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
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    res.json({ success: true, data: updatedTicket });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
