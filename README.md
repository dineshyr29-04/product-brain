# 🧠 ProductBrain V1 — Enterprise Product Intelligence Platform

> **Hackathon Theme:** Enterprise AI  
> **Core Concept:** An autonomous product intelligence engine that bridges the gap between Sales deals (ARR), Customer Support complaints, and Engineering execution.

---

## 📌 The Real-World Problem Addressed

Modern software enterprises lose millions in churned accounts because Sales deals in Salesforce, Support complaints in Zendesk, and Engineering tickets in Jira operate in complete silos. Product Managers spend 40% of their week manually copying data, writing PRDs, and trying to guess which technical task brings the most revenue.

**ProductBrain V1 proves a complete automated loop:**
> **Customer Issue → Ticket Auto-Enrichment ($ ARR) → Sales Visibility + Engineering Action → Engineering Resolution → Automated Resolution Dispatch → PM Revenue Aggregation & Opportunity Detection → 1-Click Gemini AI PRD Studio**

---

## 🛠️ Assignment Tech Stack & Architecture

- **Frontend:** Next.js / React 19 + Tailwind CSS + Lucide Icons + Recharts
- **Backend:** Node.js + Express.js + Zod Validation + JWT Authentication
- **Database:** Supabase PostgreSQL (`supabase_schema.sql` included) + Embedded fallback store for instant local demos
- **AI Engine:** Google Gemini API (`gemini-1.5-flash`) for auto-generating customer resolution summaries & Product Opportunity PRDs

---

## 🚀 Quick Start Guide

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
# Listens on http://localhost:5000
```

### 2. Start Frontend Application
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev -- -p 3000
# Access UI at http://localhost:3000
```

---

## 🗄️ Database Setup (Supabase)

Copy the SQL script located in `backend/supabase_schema.sql` and run it directly in your **Supabase SQL Editor** to create the PostgreSQL tables and seed data.

Add your credentials to `backend/.env`:
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## 🏆 Key V1 Features Implemented

1. **Auto-Enriched Customer Tickets:** Submitting an issue automatically attaches Customer Name, $ ARR, Product Module, and Priority.
2. **Sales & Revenue View:** Answers *"Which of my high-value customers are experiencing issues?"* with live AI customer resolution updates.
3. **Engineering Execution Queue:** Status transition (`Open` → `In Progress` → `Resolved`).
4. **Automated Resolution Propagation:** Marking a ticket `Resolved` invokes Gemini AI to generate an empathetic customer-facing update for Sales & Support.
5. **Product Opportunity Aggregation:** Detects recurring issues affecting high $ ARR and groups them for the PM.
6. **1-Click Gemini PRD Studio:** Generates complete technical PRDs (User Stories, Architecture, KPIs) in seconds using Google Gemini.
