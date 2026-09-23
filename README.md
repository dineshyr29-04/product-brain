# 🧠 ProductBrain — Enterprise Product Operations & Intelligence Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js Engine](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Supabase PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-emerald?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

ProductBrain is a unified, enterprise-grade Product Operations & Intelligence platform that bridges the gap between customer escalations, sales revenue churn risk, product management strategy, and engineering sprint execution.

---

## 🌟 Key Value Proposition

Traditional SaaS organizations operate in silos:
- **Sales Teams** lose enterprise contracts because they lack visibility into engineering bug fixes.
- **Engineering Teams** resolve low-priority bugs without knowing which defects impact $500k+ ARR accounts.
- **Product Managers** spend days writing PRDs manually from fragmented support tickets.

**ProductBrain solves this permanently** by connecting real-time customer ARR to technical exception logs, clustering recurring defects into strategic opportunities, generating 1-click executive PRD specs, and providing non-technical customer briefings automatically upon bug resolution.

---

## 🚀 Three Role-Isolated Department Workspaces

ProductBrain provides three specialized, role-isolated portals tailored to each department's workflow:

```
                          ┌─────────────────────────────────────────┐
                          │         PRODUCTBRAIN PLATFORM           │
                          └───────────────────┬─────────────────────┘
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         │                                    │                                    │
┌────────▼─────────┐                ┌─────────▼────────┐                ┌──────────▼──────────┐
│ PROGRAM MANAGER  │                │    SALES & CS    │                │ ENGINEERING BACKLOG │
│    WORKSPACE     │                │   CHURN RADAR    │                │    TRIAGE QUEUE     │
├──────────────────┤                ├──────────────────┤                ├─────────────────────┤
│ • Executive PRDs │                │ • ARR Exposure   │                │ • Error Stack Traces│
│ • ARR Clustering │                │ • At-Risk Badges │                │ • Jira-Style Triage │
│ • Cross Telemetry│                │ • Auto Briefings │                │ • ARR Priority      │
│ • Member Access  │                │ • Sparklines     │                │ • 1-Click Resolve   │
└──────────────────┘                └──────────────────┘                └─────────────────────┘
```

### 1. 📊 Program Manager (PM) Command Center (`/dashboard/pm`)
The executive strategy engine for product leaders:
- **Executive Overview (`/dashboard/pm`)**: Real-time Product Health score (52%), Defect Visibility trend chart, ARR Exposure ($1,430,000 across 4 accounts), and priority breakdown.
- **Cross-Team Telemetry (`/dashboard/pm/telemetry`)**: Unified table mapping customer ARR (Acme $420k, Gamma $750k) directly to active engineering sprint status (#1024, #1025) and resolution briefings.
- **PRD & Closed Tickets Archive (`/dashboard/pm/prds`)**: Autonomous PRD specification repository (e.g. *PRD-101: Upstream DB Connection Pool Auto-Scaler*) with 1-click Markdown export and remediated ticket logs ($750k retained ARR).
- **Workspace Member Access Governance (`/dashboard/pm/members`)**: Exclusive PM Admin console to grant, restrict, or revoke team member access to Sales or Engineering portals.

### 2. 📈 Sales & CS Churn Radar (`/dashboard/sales`)
The customer retention radar built for Account Executives & Customer Success:
- **Contract ARR Impact**: Displays contract ARR per account (Acme $420,000, Gamma $750,000, Delta $520,000).
- **Reach & Engagement Sparklines**: Visualizes engagement trends, reach velocity, and activity rates.
- **At-Risk Churn Alerts**: Clear badges distinguishing stable accounts from active escalation risks.
- **Automated Non-Technical Client Briefings**: Synthesizes professional, plain-English customer updates when engineering resolves a bug (e.g., *"The API Gateway query timeout affecting your analytics export was resolved today..."*).

### 3. ⚡ Engineering Backlog Queue (`/dashboard/engineering`)
The high-velocity triage hub for Staff Engineers & Developers:
- **Raw Exception Logs & Stack Traces**: Dark terminal code blocks displaying exact runtime errors (`QueryTimeoutException`, `SSO_HANDSHAKE_TIMEOUT`, `heap out of memory`, `renderCanvas() took 11840ms`).
- **Jira-Style Status Pipeline**: 1-Click workflow status transitions (`Open` ➔ `In Progress` ➔ `Resolved`).
- **ARR Context Prioritization**: Surfaces financial impact next to bug tickets so developers resolve high-value defects first.
- **Automated Synthesis Trigger**: Marking a ticket resolved automatically generates a customer briefing for the Sales team.

---

## 🏗️ Architecture & Technology Stack

```
 ┌──────────────────────────────────────────────────────────────────┐
 │                         FRONTEND                                 │
 │  Next.js 15 App Router • React 19 • Tailwind CSS • Clerk Auth   │
 └────────────────────────────────┬─────────────────────────────────┘
                                  │  REST API / JSON
 ┌────────────────────────────────▼─────────────────────────────────┐
 │                         BACKEND                                  │
 │  Node.js • Express.js • Intelligence API Engine • Supabase DB    │
 └────────────────────────────────┬─────────────────────────────────┘
                                  │  PostgreSQL Client
 ┌────────────────────────────────▼─────────────────────────────────┐
 │                        DATABASE                                  │
 │  Supabase PostgreSQL (Customers, Products, Tickets, PRDs, Logs)  │
 └──────────────────────────────────────────────────────────────────┘
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router) | High-performance server/client rendered UI with full-width responsive layouts |
| **Authentication** | Clerk Auth + Local Persona Guard | Role-based authentication & strict department permission guardrails |
| **Styling & Icons** | Tailwind CSS + Lucide Icons | Clean white typography, professional high-contrast components |
| **Backend Runtime** | Node.js + Express.js | REST API routes for telemetry, ticket management, and auth |
| **Database** | Supabase PostgreSQL | Persistent storage for accounts, tickets, PRD specs, and resolution logs |
| **Intelligence Engine** | ProductBrain AI Service | Autonomous opportunity clustering, PRD writing, and briefing synthesis |

---

## 📂 Repository Structure

```
product-brain/
├── frontend/                     # Next.js 15 Frontend Application
│   ├── app/                      # Next.js App Router Page Routes
│   │   ├── page.tsx              # High-Impact Full-Width Landing Page
│   │   ├── sign-in/              # Department Role Login & Sign-in Page
│   │   ├── sign-up/              # Registration Page
│   │   └── dashboard/            # Role-Isolated Workspace Portals
│   │       ├── pm/               # PM Executive Command Center & Sub-Pages
│   │       │   ├── page.tsx      # Executive Overview Dashboard
│   │       │   ├── telemetry/    # Connected Cross-Team Telemetry Page
│   │       │   ├── prds/         # PRD Specs & Remediated Tickets Archive
│   │       │   └── members/      # PM Admin Member Access Governance
│   │       ├── sales/            # Sales & CS Churn Radar Portal
│   │       └── engineering/      # Engineering Technical Backlog Queue
│   ├── components/               # Shared Reusable UI Components
│   │   ├── PMNavHeader.tsx       # PM Sub-Navbar with High-Contrast Active Tabs
│   │   ├── DepartmentGuard.tsx   # Security Permission Guardrail
│   │   └── PBLogo.tsx            # ProductBrain SVG Logo Component
│   ├── lib/                      # Helper Utilities & Auth Engine
│   │   └── authHelper.ts         # Persona Auth, Member Governance, Local State
│   └── package.json
│
├── backend/                      # Node.js Express API Backend
│   ├── server.js                 # Server Entry Point & Express App
│   ├── db.js                     # Supabase PostgreSQL Connection & Data Store
│   ├── aiService.js              # Intelligence Engine (PRD Generator & Summarizer)
│   ├── supabase_schema.sql       # PostgreSQL DDL Database Schema
│   └── routes/                   # Express REST API Route Controllers
│       ├── auth.js               # Authentication & Persona Routes
│       ├── dashboards.js         # PM, Sales & Eng Telemetry Routes
│       ├── opportunities.js      # PRD Generation & Opportunity Clustering
│       └── tickets.js            # Ticket Creation, Bulk Import & Status Routes
│
├── vercel.json                   # Vercel Deployment Configuration
└── README.md                     # Comprehensive Platform Documentation
```

---

## 🛠️ Local Development & Setup Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/dineshyr29-04/product-brain.git
cd product-brain
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend application will be running at `http://localhost:3000`.

### 3. Backend Setup (Optional for API Backend)
```bash
cd ../backend
npm install
npm start
```
The Express backend service runs at `http://localhost:5000`.

### 4. Build for Production
To test production compilation locally:
```bash
cd frontend
npm run build
```

---

## 🔒 Security & Role Isolation

ProductBrain enforces **Strict Department Security Guardrails** using `DepartmentGuard`:
- **Program Manager Workspace (`/dashboard/pm/*`)**: Restricted to PM Admins (`role="pm"`). Grants exclusive administrative governance to manage member access.
- **Sales Radar (`/dashboard/sales`)**: Restricted to Sales & Account Execs (`role="sales"`). Protects raw engineering stack traces while surfacing ARR data.
- **Engineering Backlog (`/dashboard/engineering`)**: Restricted to Developers & Engineers (`role="engineering"`). Displays technical exception logs and sprint status.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
