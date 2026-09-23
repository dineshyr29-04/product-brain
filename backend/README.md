# ⚙️ ProductBrain Backend — System Design & API Documentation

> **Service Name:** `productbrain-backend`  
> **Runtime:** Node.js (ES Modules) + Express.js  
> **Database:** Supabase PostgreSQL + Fallback Local Memory Store  
> **AI Engine:** Google Gemini AI API (`@google/generative-ai`)

---

## 🏗️ Backend System Architecture

ProductBrain's backend is an enterprise-grade API service designed to bridge customer revenue ($ ARR), customer support complaints, engineering workflow execution, and executive product management insights.

```
                  ┌──────────────────────────────────────────────┐
                  │          Express.js Router Middleware        │
                  └──────┬──────────────────┬─────────────────┬──┘
                         │                  │                 │
                         ▼                  ▼                 ▼
                 /api/tickets       /api/opportunities   /api/dashboards
                         │                  │                 │
                         └──────────┬───────┴─────────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │    Data Layer (db.js)     │
                      │ Supabase DB / Fallback DB │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │  AI Engine (aiService.js) │
                      │      Google Gemini API    │
                      └───────────────────────────┘
```

---

## 📁 Directory & File Structure

```
backend/
├── server.js              # Express app entrypoint, middleware, health check & route registration
├── db.js                  # Database interface (Supabase client + resilient in-memory fallback)
├── aiService.js           # Gemini AI service (Resolution summary generator & PRD generator)
├── supabase_schema.sql    # PostgreSQL DDL schema script, seed data, and RLS policies
├── package.json           # Node.js ESM configuration and dependencies
├── .env                   # Environment variables (PORT, SUPABASE_URL, GEMINI_API_KEY)
└── routes/
    ├── tickets.js         # API endpoints for ticket CRUD, status transitions & auto-resolution
    ├── opportunities.js   # API endpoints for PM opportunity grouping & AI PRD generation
    └── dashboards.js      # API endpoints for Executive revenue analytics & metric aggregations
```

---

## 🔄 System Design & Core Workflows

### 1. Ticket Auto-Enrichment & Ingestion
When a customer ticket is created via `POST /api/tickets`, the backend enriches the ticket with:
- `customer_name`: Enterprise customer account name
- `arr`: Annual Recurring Revenue ($ ARR) associated with the customer
- `module`: Target product area (e.g., `Authentication`, `Billing`, `API Integration`)
- `priority`: Urgent / High / Medium / Low

### 2. Status Transition & Automated Resolution Propagation
When an engineer updates ticket status via `PUT /api/tickets/:id/status` to `Resolved`:
1. The backend triggers `aiService.generateResolutionSummary()`.
2. Gemini AI processes technical notes and generates an empathetic customer update.
3. The resolution is stored and instantly exposed to Sales & Support teams.

### 3. Revenue Aggregation & Product Opportunity Clustering
The `/api/opportunities` engine analyzes recurring unresolved tickets across modules:
1. Aggregates total $ ARR impacted by tickets grouped by product feature/module.
2. Ranks opportunities by revenue at risk.
3. Invokes `aiService.generatePRD()` to auto-generate technical PRDs (User Stories, Architecture, Success Metrics).

---

## 🔌 API Endpoints Specification

### 🟢 Health Check
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns backend operational status & API version |

### 🎫 Tickets API (`/api/tickets`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tickets` | Retrieve all tickets with optional filtering by status or module |
| `POST` | `/api/tickets` | Create a new customer support/engineering ticket |
| `PUT` | `/api/tickets/:id/status` | Update ticket status (`Open`, `In Progress`, `Resolved`) & trigger AI resolution summary |

### 💡 Product Opportunities API (`/api/opportunities`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/opportunities` | Get aggregated high-value revenue opportunities |
| `POST` | `/api/opportunities/:id/prd` | Trigger Gemini AI to generate a detailed PRD for an opportunity |

### 📊 Executive Dashboard API (`/api/dashboards`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboards/overview` | Executive KPI metrics ($ ARR at risk, total tickets, resolved ARR) |
| `GET` | `/api/dashboards/module-breakdown` | Revenue risk distribution per product module |

---

## 🔑 Environment Setup (`backend/.env`)

```env
PORT=5000
JWT_SECRET=productbrain_super_secret_jwt_key_2026
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=<your-supabase-anon-key>
GEMINI_API_KEY=<your-google-gemini-api-key>
```

---

## 🏃 Running the Backend

```bash
# Install backend dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```
