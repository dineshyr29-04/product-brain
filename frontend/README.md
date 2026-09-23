# 💻 ProductBrain Frontend — Next.js Application Architecture

> **Service Name:** `productbrain-frontend`  
> **Framework:** Next.js (App Router) + React 19 + TypeScript  
> **Styling:** Tailwind CSS + Lucide React Icons + Recharts Data Visualization

---

## 🏗️ Frontend Architecture & Component Hierarchy

The ProductBrain frontend provides a real-time, responsive web portal serving Sales, Engineering, Support, and Executive Product Management personas.

```
                    ┌──────────────────────────────────────────────┐
                    │               Root Layout (app/)             │
                    └──────────────────────┬───────────────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
           Executive / PM Portal                  Customer Support & Eng
        (Dashboards, PRD Studio)                    (Tickets & Queue)
                        │                                     │
                        ├──────────────────┬──────────────────┤
                        ▼                  ▼                  ▼
                  Overview Cards     Charts & Visuals     Ticket Modals
```

---

## 📁 Directory & Component Structure

```
frontend/
├── app/                   # Next.js App Router routes & pages
│   ├── layout.tsx         # Root application layout with theme provider & navigation header
│   ├── page.tsx           # ProductBrain Main Dashboard (Executive Analytics & Ticket Feed)
│   └── globals.css        # Global CSS styles & Tailwind directives
├── components/            # UI Components & Modules
│   ├── ui/                # Reusable Primitive Components (Button, Card, Badge, Modal, Tabs)
│   ├── dashboard/         # Executive metrics, ARR risk cards, and module health breakdown
│   ├── tickets/           # Ticket list view, priority indicators, status update controls
│   ├── opportunities/     # Opportunity revenue clustering list & 1-Click AI PRD modal
│   └── prd-studio/        # Gemini AI PRD preview, markdown viewer & exporter
├── lib/                   # Helper Utilities & API Service Client
│   ├── utils.ts           # Classname merger (clsx + tailwind-merge) & currency formatters
│   └── api.ts             # Axios API client pointing to Node.js backend (/api)
├── hooks/                 # Custom React hooks (useTickets, useOpportunities, useDashboard)
├── public/                # Static assets, logos, and preview graphics
└── package.json           # Frontend package configuration & flexible dependencies
```

---

## 🚀 Persona Dashboards & Core Views

1. **Executive Product Overview:** High-level metrics showing $ ARR at risk, total active tickets, resolved revenue, and AI-identified feature opportunities.
2. **Support & Sales View:** Real-time customer ticket creation with automatic $ ARR tag and customer account identification.
3. **Engineering Execution Queue:** Ticket state transition (`Open` → `In Progress` → `Resolved`) triggering AI customer resolution generation.
4. **1-Click Gemini PRD Studio:** View auto-generated technical PRDs created by Gemini AI for top-ranked revenue opportunities.

---

## 🔌 Backend Integration Configuration

Create a `.env.local` file inside `frontend/`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

---

## 🏃 Running the Frontend

```bash
# Install frontend dependencies
npm install --legacy-peer-deps

# Start Next.js development server
npm run dev

# Build for production
npm run build
```
