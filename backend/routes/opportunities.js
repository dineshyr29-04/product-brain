import express from 'express';
import { db } from '../db.js';
import { aiService } from '../aiService.js';

const router = express.Router();

// GET /api/opportunities - List detected product opportunities
router.get('/', async (req, res) => {
  try {
    const opps = await db.getOpportunities();
    res.json({ success: true, data: opps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/opportunities/:id/generate-prd - 1-Click PRD Generator (Gemini AI)
router.post('/:id/generate-prd', async (req, res) => {
  try {
    const { id } = req.params;
    const opps = await db.getOpportunities();
    const opp = opps.find((o) => o.id === id);

    if (!opp) {
      return res.status(404).json({ success: false, error: 'Opportunity not found' });
    }

    const productName = opp.product ? opp.product.name : 'Core Platform';

    // Call Gemini AI PRD Generator
    const prdMarkdown = await aiService.generatePRD({
      opportunityTitle: opp.title,
      productName,
      ticketCount: opp.ticket_count,
      customerCount: opp.customer_count,
      affectedArr: opp.affected_arr
    });

    await db.updateOpportunityPrd(id, prdMarkdown);

    res.json({
      success: true,
      data: {
        id,
        title: opp.title,
        status: 'PRD Created',
        prd_content: prdMarkdown
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
