# 💻 ProductBrain Frontend — Technical & System Design Guide

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5%20App%20Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk%20%2B%20Persona%20Guard-6c47ff?style=flat-square&logo=clerk)](https://clerk.com/)

This documentation details the frontend architecture, system design patterns, route specifications, component hierarchy, and security engine powering the **ProductBrain** web client.

---

## 📐 Frontend System Design & Architecture

ProductBrain's frontend is built on **Next.js 15 App Router**, leveraging React 19 Client Components (`"use client"`), Tailwind CSS styling tokens, and Clerk Authentication integrated with custom department guardrails.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            NEXT.JS 15 APP ROUTER                            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            │                                                     │
┌───────────▼───────────┐                             ┌───────────▼───────────┐
│     PUBLIC ROUTES     │                             │  AUTHENTICATED PORTALS│
├───────────────────────┤                             ├───────────────────────┤
│ • / (Landing Page)    │                             │ Protected by Guard:   │
│ • /sign-in            │                             │ • /dashboard/pm/*     │
│ • /sign-up            │                             │ • /dashboard/sales    │
└───────────────────────┘                             │ • /dashboard/eng      │
                                                      └───────────────────────┘
```

### Key Architectural Principles
1. **Full-Width Responsive Layouts**: Every portal container utilizes `w-full px-6 lg:px-12` ensuring dynamic scaling across all viewports (mobile, tablet, desktop, ultra-wide).
2. **Zero-Clutter Visual Hierarchy**: Clean white background palette (`bg-[#F7F5F3]`, `bg-white`), high-contrast dark typography (`#37322F`), and status-coded pill badges (`emerald` = resolved, `amber` = warning/in-progress, `rose` = critical/at-risk).
3. **Strict Department Isolation**: Role permission guardrails (`DepartmentGuard`) enforce zero cross-department data leakage while allowing PM Admins full governance.
4. **Resilient Data State**: Dual-mode data fetching with live REST API backend synchronization and local fallback telemetry (including `0 Baseline` reset & `Demo Data` seed modes).

---

## 📁 Page Routes Specification

| Route Path | Access Level | Description | Key Components |
| :--- | :--- | :--- | :--- |
| `/` | Public | High-impact, full-width landing page featuring hero section, 3-card showcase, alternating deep-dive breakdown, and value proposition. | `PBLogo`, `Image`, `Link`, `UserButton` |
| `/sign-in` | Public | Department role selection & credential authentication (PM Admin, Sales, Engineering). | `loginWithCredentials`, `Clerk SignIn` |
| `/sign-up` | Public | User registration page. | `Clerk SignUp` |
| `/dashboard/pm` | `role="pm"` | Executive Command Center displaying Product Score (52), ARR Exposure ($1.43M), Defect Visibility, and Donut Pie Chart. | `PMNavHeader`, `AreaChart`, `PieChart`, `CustomPieTooltip` |
| `/dashboard/pm/telemetry` | `role="pm"` | Connected Cross-Team Telemetry page mapping Sales ARR directly to Engineering tickets & stack traces. | `PMNavHeader`, Connected Pipeline Table |
| `/dashboard/pm/prds` | `role="pm"` | Autonomous PRD Library & Remediated Tickets Archive with 1-click Markdown export. | `PMNavHeader`, PRD Viewer Modal |
| `/dashboard/pm/members` | `role="pm"` | Workspace Member Access Governance console for PM Admins to grant or revoke portal permissions. | `PMNavHeader`, Member Roster Table |
| `/dashboard/sales` | `role="sales"` | Sales & CS Churn Radar showing contract ARR, Reach Velocity sparklines, and automated client briefings. | `DepartmentGuard`, Sparkline SVG |
| `/dashboard/engineering` | `role="engineering"` | Technical Backlog Queue with dark terminal stack trace code blocks and Jira-style 1-click workflow status transitions. | `DepartmentGuard`, Terminal Stack Trace |

---

## 🧩 Component Hierarchy & Core Modules

```
frontend/
├── app/
│   ├── layout.tsx                # Root HTML/Body Layout & Providers
│   ├── page.tsx                  # Landing Page (Hero, Showcase, Deep Dive)
│   ├── sign-in/[[...sign-in]]/   # Clerk & Persona Authentication Route
│   └── dashboard/
│       ├── pm/                   # Program Manager Command Center
│       │   ├── page.tsx          # Overview Dashboard
│       │   ├── telemetry/        # Connected Cross-Team Telemetry Page
│       │   ├── prds/             # Autonomous PRD Library Page
│       │   └── members/          # Member Access Governance Page
│       ├── sales/
│       │   └── page.tsx          # Sales & CS Churn Radar Page
│       └── engineering/
│           └── page.tsx          # Engineering Technical Backlog Page
│
├── components/
│   ├── PMNavHeader.tsx           # Shared PM Sub-Navbar (High-contrast active tabs, zero icons)
│   ├── DepartmentGuard.tsx       # Security Permission Guardrail Wrapper
│   └── PBLogo.tsx                # ProductBrain SVG Logo Component
│
└── lib/
    ├── authHelper.ts             # Auth Engine, Personas, Member Governance & Storage
    └── db.ts                     # DB Utility Helpers
```

### 1. `PMNavHeader.tsx` (Shared PM Navigation)
- Renders top navigation bar across all 4 PM sub-pages (`/dashboard/pm`, `/telemetry`, `/prds`, `/members`).
- **High-Contrast Active Tabs**: Highlights the active tab with a dark pill (`bg-[#37322F] text-white font-extrabold shadow-sm`) and zero icon clutter for a professional appearance.
- Includes header controls for `0 Baseline`, `Demo Data`, `Refresh`, `+ Create / Import`, and `Sign Out`.

### 2. `DepartmentGuard.tsx` (Security Guardrail)
- Wraps protected workspace pages (`<DepartmentGuard requiredRole="pm">`).
- Evaluates active session role (`getCurrentRole()`).
- If an unauthorized user attempts to access another department's workspace, redirects them safely to `/sign-in` or their authorized workspace.

### 3. `CustomPieTooltip` (Interactive Recharts Tooltip)
- Embedded inside `PieChart` in `app/dashboard/pm/page.tsx`.
- Hovering over any slice (Health 52%, Warnings 38%, Critical 10%) pops up a detailed dark tooltip (`bg-[#1C1917]`) displaying ticket #, customer ARR, issue title, status badge, and technical stack trace/fix note.

---

## 🔐 Auth Engine & State Governance (`lib/authHelper.ts`)

`lib/authHelper.ts` provides persona simulation, Clerk synchronization, and team member permission governance:

```typescript
export type UserRole = "pm" | "sales" | "engineering";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar?: string;
}
```

### Key Functions
- `loginWithCredentials(email, role)`: Verifies if the email address is authorized. PM Admins are granted immediate access. Sales and Engineering users are checked against `getTeamMembers()`.
- `addTeamMember(email, role, name)`: Adds a new authorized user to `localStorage.pb_team_members`.
- `removeTeamMember(id)`: Revokes department access for a team member.
- `getCurrentUser()` / `setCurrentUser(user)`: Manages local session persistence.

---

## 🛠️ Build & Deployment Instructions

### Local Production Build Test
To run a clean production compilation:
```bash
# 1. Clean build cache
rm -rf .next

# 2. Run Next.js build
npm run build
```

### Production Output
- **Total Routes**: 11 Static & Dynamic pages
- **Compilation Speed**: ~6.8s
- **Zero Webpack / TypeScript Errors**

---

## 📄 License

ProductBrain Frontend is proprietary software. All rights reserved.
