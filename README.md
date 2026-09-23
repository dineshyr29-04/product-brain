# 🧠 ProductBrain V1 — Enterprise Product Intelligence Engine

> **Hackathon Theme:** Enterprise AI  
> **Core Mission:** Bridge Sales deals ($ ARR), Support complaints, and Engineering execution into a unified autonomous intelligence engine.

---

## 📌 Problem & Solution

Modern enterprise software teams operate in silos:
- **Sales & Customer Success** track account churn & $ ARR in Salesforce/HubSpot.
- **Customer Support** receives urgent complaints in Zendesk/Intercom.
- **Engineering** works on tickets in Jira/GitHub Issues.
- **Product Managers** spend 40% of their week manually reconciling data and writing PRDs.

**ProductBrain V1 solves this with an automated intelligence feedback loop:**
```
 ┌─────────────────┐       ┌────────────────────────┐       ┌─────────────────────────┐
 │ Customer Support│ ───►  │ Auto ARR Enrichment    │ ───►  │ Engineering Execution   │
 │ Issue Input     │       │ ($ Account Impact)     │       │ Queue (Open ➔ In Prog)  │
 └─────────────────┘       └────────────────────────┘       └────────────┬────────────┘
                                                                         │
 ┌─────────────────┐       ┌────────────────────────┐                    │
 │ 1-Click Gemini  │ ◄───  │ PM Revenue Aggregator  │ ◄───────────────────┘ (Status = Resolved)
 │ AI PRD Studio   │       │ & Opportunity Grouping │                     │
 └─────────────────┘       └────────────────────────┘                     ▼
                                                             ┌─────────────────────────┐
                                                             │ Gemini AI Auto Customer │
                                                             │ Resolution Dispatch     │
                                                             └─────────────────────────┘
```

---

## 🏛️ End-to-End System Architecture

ProductBrain V1 consists of a Next.js 14 frontend, a Node.js/Express REST API backend, a PostgreSQL database (Supabase), and Google Gemini AI for autonomous text synthesis.

```
                           ┌─────────────────────────────────┐
                           │   Next.js 14 Frontend Portal    │
                           │   (Executive, Sales, Eng, PM)   │
                           └────────────────┬────────────────┘
                                            │ HTTP / JSON API
                                            ▼
                           ┌─────────────────────────────────┐
                           │    Node.js / Express Backend    │
                           │         (server.js)             │
                           └──────┬──────────────────┬───────┘
                                  │                  │
                ┌─────────────────┴─┐              ┌─┴────────────────┐
                │ Data Access Layer │              │  AI Core Engine  │
                │     (db.js)       │              │  (aiService.js)  │
                └─────────┬─────────┘              └────────┬─────────┘
                          │                                 │
                 ┌────────┴────────┐               ┌────────┴────────┐
                 ▼                 ▼               ▼                 ▼
          Supabase PostgreSQL  In-Memory Store  Gemini AI API    Resolution & PRD
          (supabase_schema.sql)  (Fallback)     (gemini-1.5-flash) Output Synthesis
```

---

## 🗄️ Database Schema & Data Design (Supabase PostgreSQL)

ProductBrain utilizes a PostgreSQL schema defined in [`backend/supabase_schema.sql`](file:///home/dina/project/product-brain/backend/supabase_schema.sql):

### 1. `tickets` Table
Stores incoming customer support & engineering issues.
- `id` (UUID, Primary Key)
- `title` (TEXT) — Brief summary of issue
- `description` (TEXT) — Technical detail or customer complaint
- `customer_name` (TEXT) — Enterprise account name
- `arr` (NUMERIC) — Customer Annual Recurring Revenue ($ ARR)
- `module` (TEXT) — Product area (e.g. `Authentication`, `Billing`, `API Integration`)
- `priority` (TEXT) — `Urgent`, `High`, `Medium`, `Low`
- `status` (TEXT) — `Open`, `In Progress`, `Resolved`
- `resolution_notes` (TEXT) — Engineer resolution notes
- `ai_resolution_summary` (TEXT) — Gemini AI generated customer-facing resolution summary
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 2. `opportunities` Table
Aggregates high-value product improvement clusters for Product Managers.
- `id` (UUID, Primary Key)
- `title` (TEXT) — Feature opportunity title
- `module` (TEXT) — Affected product module
- `total_arr_at_risk` (NUMERIC) — Aggregated $ ARR affected across tickets
- `ticket_count` (INTEGER) — Total linked tickets
- `status` (TEXT) — `Identified`, `PRD Generated`, `In Development`
- `ai_prd_content` (TEXT) — Complete Gemini AI generated PRD document

---

## 🛠️ Complete Repository Structure

```
product-brain/
├── README.md                      # 👈 Unified Main System Overview (This File)
├── backend/                       # Node.js / Express API Backend Service
│   ├── README.md                  # 📄 Backend System Design & API Specs
│   ├── server.js                  # API entry point & route definitions
│   ├── db.js                      # Supabase DB client & fallback store
│   ├── aiService.js               # Google Gemini AI engine integration
│   ├── supabase_schema.sql        # Supabase PostgreSQL DDL schema & seed data
│   └── routes/                    # API Route Controllers (tickets, opportunities, dashboards)
└── frontend/                      # Next.js 14 Frontend Application
    ├── README.md                  # 📄 Frontend Architecture & UI Overview
    ├── app/                       # App Router layouts and page views
    ├── components/                # Persona dashboards, charts & PRD Studio components
    ├── lib/                       # API integration helpers & utility functions
    └── hooks/                     # Custom React hooks for API data fetching
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18.x
- npm or pnpm

### 1. Configure Backend Environment
Navigate to `backend/.env` and verify key settings:
```env
PORT=5000
JWT_SECRET=productbrain_super_secret_jwt_key_2026
SUPABASE_URL=https://bbkqjbzuwuurbzkgnuld.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=AQ.Ab8RN6...
```

### 2. Start Backend API Server
```bash
cd backend
npm install
npm dev   # Runs backend on http://localhost:5000
```

### 3. Start Frontend Dashboard
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev   # Runs UI on http://localhost:3000
```

---

## 📚 Detailed Subsystem Documentation

- ⚙️ **Backend System Design & API Specifications:** [`backend/README.md`](file:///home/dina/project/product-brain/backend/README.md)
- 💻 **Frontend Architecture & Component Guide:** [`frontend/README.md`](file:///home/dina/project/product-brain/frontend/README.md)
