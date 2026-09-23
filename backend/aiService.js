import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const isGeminiConfigured = Boolean(apiKey && !apiKey.includes('your_gemini'));

let genAI = null;
if (isGeminiConfigured) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Google Gemini API Service initialized');
  } catch (err) {
    console.warn('⚠️ Gemini initialization failed:', err.message);
  }
} else {
  console.log('💡 Gemini API key not set or default placeholder. Smart fallback generators enabled.');
}

export const aiService = {
  /**
   * Generates a customer-facing resolution summary when Engineering resolves a ticket.
   */
  async generateCustomerResolutionSummary({ ticketTitle, customerName, resolutionNote }) {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `
You are an expert Enterprise Product Communications Specialist at a B2B SaaS company.
A technical issue has just been resolved by Engineering. Write a professional, reassuring 2-sentence update specifically tailored for the Sales & Customer Support team to send to the customer.

Context:
- Customer: ${customerName}
- Ticket Title: ${ticketTitle}
- Engineering Resolution Note: ${resolutionNote}

Guidelines:
- Tone: Professional, empathetic, clear.
- Explain what was fixed without using overly raw internal jargon.
- Emphasize stability and appreciation for their patience.
`;
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      } catch (err) {
        console.warn('Fallback resolution generator used:', err.message);
      }
    }

    // High-quality smart fallback
    return `Our engineering team has successfully resolved the "${ticketTitle}" issue for ${customerName}. ${resolutionNote ? `Resolution details: ${resolutionNote}.` : 'The fix has been deployed to production and all operations are fully restored.'}`;
  },

  /**
   * Generates a complete Technical PRD for a detected Product Opportunity.
   */
  async generatePRD({ opportunityTitle, productName, ticketCount, customerCount, affectedArr }) {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `
You are a Principal Product Manager at a leading B2B SaaS Enterprise.
Write a comprehensive, highly detailed Product Requirement Document (PRD) in clean Markdown format for a newly detected Product Opportunity.

Opportunity Title: ${opportunityTitle}
Product: ${productName}
Key Impact Data:
- Total Related Tickets: ${ticketCount}
- Total Customers Affected: ${customerCount}
- Total Affected ARR (Annual Recurring Revenue): $${affectedArr.toLocaleString()}

Please format the PRD strictly using the following Markdown sections:

# PRD: ${opportunityTitle}
**Product:** ${productName}  
**Status:** In Review | **Target Quarter:** Next Sprint  
**Revenue Impact:** $${affectedArr.toLocaleString()} ARR Protected | **Affected Accounts:** ${customerCount} Customers

---

## 1. Executive Summary & Problem Justification
Explain why this product initiative is critical, connecting technical debt/bottlenecks directly to the $${affectedArr.toLocaleString()} ARR at risk.

## 2. Customer Impact & Recurring Patterns
Synthesize the recurring customer friction across the ${customerCount} impacted enterprise clients.

## 3. High-Level Requirements & User Stories
List 3-4 key User Stories with strict Acceptance Criteria (Given... When... Then...).

## 4. Proposed Technical Architecture & Core Changes
Describe API changes, database query optimizations, rate limiters, or streaming endpoints needed.

## 5. Success Metrics & Business KPIs
Define measurable KPIs (e.g. 99.9% uptime, <200ms export latency, zero customer churn on affected accounts).
`;
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (err) {
        console.warn('Fallback PRD generator used:', err.message);
      }
    }

    // High-quality markdown fallback template
    return `# PRD: ${opportunityTitle}
**Product:** ${productName}  
**Status:** Draft / Approved | **Priority:** High  
**Revenue Impact:** $${affectedArr.toLocaleString()} ARR Protected | **Affected Accounts:** ${customerCount} Customers

---

## 1. Executive Summary & Problem Justification
This initiative addresses a critical recurring infrastructure limitation in **${productName}**. Over **${customerCount} enterprise customers** representing **$${affectedArr.toLocaleString()} in ARR** have experienced recurring technical friction across **${ticketCount} logged incidents**. Resolving the root cause will protect high-ARR renewals and eliminate support ticket fatigue.

## 2. Customer Impact & Recurring Patterns
- **Primary Bottleneck:** High memory consumption and query timeouts during heavy batch operations.
- **Affected Clients:** High-tier accounts including Acme Corp, Gamma Ltd, and Delta Global.
- **Business Risk:** Contract cancellations due to SLA violations during peak business hours.

## 3. High-Level Requirements & User Stories
- **US-1 (Streaming Data Export):** As an enterprise admin, I want asynchronous CSV report generation so that large dataset downloads never time out.
  - *Acceptance Criteria:* Downloads > 500MB process via background queues; email link dispatched upon completion.
- **US-2 (Rate-Limiting & Fair Use):** As a platform architect, I want dynamic rate-limiting per account tier to prevent single-tenant OOM crashes.
  - *Acceptance Criteria:* Rate limits scale dynamically based on account subscription tier.

## 4. Proposed Technical Architecture & Core Changes
- Implement Redis-backed BullMQ job queue for asynchronous batch exports.
- Optimize database indexes on created_at timestamp and tenant partitioning keys.
- Deploy automated chunking middleware to stream memory buffers directly to cloud storage.

## 5. Success Metrics & Business KPIs
- **Customer Churn:** 0% contract loss on top 20 accounts.
- **Performance:** 99.95% API success rate during peak traffic windows.
- **Support Ticket Reduction:** 85% drop in related support tickets within 30 days of release.`;
  }
};
