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
  category: z.string().optional()
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

// PATCH /api/tickets/:id/status - Update ticket status (Engineering Action)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolution_note } = req.body;

    if (!['Open', 'In Progress', 'Blocked', 'Resolved'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    let aiCustomerSummary = null;

    // Trigger AI Customer-Facing Resolution Summary when status changes to Resolved!
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
