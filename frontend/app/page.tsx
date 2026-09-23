"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Layers,
  Code2,
  Users,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Lock,
  Cpu,
  Zap,
  Activity,
  Check,
  Sliders,
  Database,
  ArrowUpRight,
  TrendingUp,
  FileCode2,
  PieChart,
  Briefcase,
  ShieldAlert
} from "lucide-react";
import PBLogo from "@/components/PBLogo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060913] text-[#E2E8F0] font-sans antialiased selection:bg-[#4066F6] selection:text-white overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR                                                     */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#060913]/90 border-b border-slate-800/80">
        <div className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo & Monogram */}
          <PBLogo size="md" textColor="white" />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#showcase" className="hover:text-white transition-colors">
              Platform Views
            </a>
            <a href="#deep-dive" className="hover:text-white transition-colors">
              Deep Dive
            </a>
            <a href="#why-pb" className="hover:text-white transition-colors">
              Why ProductBrain
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Security & Roles
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all border border-slate-700/60"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Get Started Free</span>
              </Link>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/pm"
                  className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="pl-1 border-l border-slate-800">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </Show>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Perspective 3D Cards Inspired by Image 0: BizNest)       */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-36 overflow-hidden border-b border-slate-800/80">
        {/* Radiant Mesh Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-indigo-900/10 to-transparent pointer-events-none blur-3xl -z-10" />
        <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-purple-600/15 rounded-full pointer-events-none blur-[120px] -z-10" />

        <div className="w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Multipurpose B2B SaaS Product Operations Template</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Quickly Drive Product Operations.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Connect customer ARR escalations, automated defect intelligence, and engineering execution into one unified, role-isolated workspace.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/sign-in?role=pm"
                className="w-full sm:w-auto px-8 py-4 text-base font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Launch PM Intelligence</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#deep-dive"
                className="w-full sm:w-auto px-7 py-4 text-base font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition-all text-center"
              >
                Explore 3 Portals
              </a>
            </div>

            {/* Social Proof Counter */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">$1,430,000</div>
                <div className="text-[11px] text-slate-400">ARR At-Risk Detected</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-cyan-400">1-Click</div>
                <div className="text-[11px] text-slate-400">Autonomous PRDs</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">3 Portals</div>
                <div className="text-[11px] text-slate-400">Role Isolated</div>
              </div>
            </div>
          </div>

          {/* Right Hero: Perspective Floating Stack (Inspired by Image 0: BizNest) */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px]">
            {/* Background Backdrop Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl -z-10" />

            {/* Card 1: Back (Engineering) */}
            <div className="absolute -top-4 -right-2 w-[85%] aspect-[16/10] bg-slate-900 rounded-2xl border border-purple-500/40 shadow-2xl overflow-hidden rotate-6 opacity-75 hover:opacity-100 hover:rotate-2 transition-all duration-500">
              <Image src="/dashboard-engineering.png" alt="Engineering Backlog" fill className="object-contain object-top" />
            </div>

            {/* Card 2: Middle (Sales) */}
            <div className="absolute top-6 -left-4 w-[85%] aspect-[16/10] bg-slate-900 rounded-2xl border border-emerald-500/40 shadow-2xl overflow-hidden -rotate-6 opacity-85 hover:opacity-100 hover:rotate-0 transition-all duration-500">
              <Image src="/dashboard-sales.png" alt="Sales Radar" fill className="object-contain object-top" />
            </div>

            {/* Card 3: Front & Center (PM Control Center) */}
            <div className="relative w-[90%] aspect-[16/10] bg-slate-900 rounded-2xl border-2 border-blue-500 shadow-2xl overflow-hidden z-20 hover:scale-105 transition-all duration-500 group">
              <Image src="/dashboard-pm.png" alt="PM Control Center" fill className="object-contain object-top" />
              <div className="absolute bottom-3 left-3 bg-[#0A0F1D]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-400/40 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
                <PieChart className="w-3.5 h-3.5 text-cyan-400" />
                <span>Product Manager Command Center</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ALTERNATING DEEP-DIVE SECTIONS (Zig-Zag Layout for 3 Pages)           */}
      {/* ========================================================================= */}
      <section id="deep-dive" className="py-24 space-y-28 bg-[#080C16]">
        <div className="w-full max-w-7xl mx-auto px-6 space-y-4 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 inline-block">
            In-Depth Page Breakdown
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How Each Workspace Operates & Why It's Special
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            ProductBrain separates concerns so each team sees exactly what they need to execute at peak velocity.
          </p>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* ALTERNATING SECTION 1: PRODUCT MANAGER WORKSPACE (Image Left, Text Right) */}
        {/* ----------------------------------------------------------------------- */}
        <div className="w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: High-Res Screenshot Frame */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden group">
            <div className="px-4 py-3 bg-[#0B101D] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="font-mono text-slate-400 ml-2">https://productbrain.app/dashboard/pm</span>
              </div>
              <span className="font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                PM Portal
              </span>
            </div>
            <div className="relative aspect-[16/10] bg-slate-950">
              <Image src="/dashboard-pm.png" alt="PM Dashboard" fill className="object-contain object-top group-hover:scale-102 transition-transform duration-500" />
            </div>
          </div>

          {/* Right: Explanatory Content */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-cyan-300 border border-blue-500/30 text-xs font-bold">
              <PieChart className="w-3.5 h-3.5" />
              <span>Page 1: Product Manager Workspace</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive Command & Strategy Engine
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              The Product Manager Workspace is the central intelligence hub. It aggregates support tickets across Salesforce accounts, measures total ARR exposure, clusters defects into opportunities, and generates 5-section executive PRDs in seconds.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>PM Defect Authority Score ($1.43M ARR Base)</span>
                </div>
                <p className="text-xs text-slate-400">
                  Calculates real-time financial exposure so PMs prioritize $100k+ enterprise defects over minor cosmetic requests.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>1-Click Autonomous PRD Generation</span>
                </div>
                <p className="text-xs text-slate-400">
                  Writes full PRDs complete with Business Justification, OKRs, Tech Spec, and Implementation Roadmaps.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>PM Team Access & Role Delegation</span>
                </div>
                <p className="text-xs text-slate-400">
                  PMs maintain administrative oversight and explicitly delegate which email addresses can log into Sales or Engineering.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/sign-in?role=pm"
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300"
              >
                <span>Launch PM Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* ALTERNATING SECTION 2: SALES & CS RADAR (Text Left, Image Right)        */}
        {/* ----------------------------------------------------------------------- */}
        <div className="w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: Explanatory Content */}
          <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Page 2: Sales & CS Radar</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Customer Retention & Churn Risk Radar
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Sales teams need visibility into customer issues without digging through raw GitHub code or complex stack traces. The Sales Radar isolates at-risk accounts, displays contract ARR values, and provides plain-English client updates.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Contract ARR Visibility Per Account</span>
                </div>
                <p className="text-xs text-slate-400">
                  Displays exact account ARR (e.g. Acme Corp $420k, Gamma Ltd $750k) alongside active defect escalations.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>At-Risk Account Churn Alerts</span>
                </div>
                <p className="text-xs text-slate-400">
                  Highlights accounts affected by open defects so Account Executives can proactively address renewal risks.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Automated Non-Technical Client Briefings</span>
                </div>
                <p className="text-xs text-slate-400">
                  When Engineering resolves a defect, the system automatically translates technical fixes into professional customer updates.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/sign-in?role=sales"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                <span>Launch Sales Radar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: High-Res Screenshot Frame */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden group order-1 lg:order-2">
            <div className="px-4 py-3 bg-[#0B101D] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="font-mono text-slate-400 ml-2">https://productbrain.app/dashboard/sales</span>
              </div>
              <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Sales Portal
              </span>
            </div>
            <div className="relative aspect-[16/10] bg-slate-950">
              <Image src="/dashboard-sales.png" alt="Sales Radar" fill className="object-contain object-top group-hover:scale-102 transition-transform duration-500" />
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* ALTERNATING SECTION 3: ENGINEERING BACKLOG (Image Left, Text Right)      */}
        {/* ----------------------------------------------------------------------- */}
        <div className="w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: High-Res Screenshot Frame */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden group">
            <div className="px-4 py-3 bg-[#0B101D] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="font-mono text-slate-400 ml-2">https://productbrain.app/dashboard/engineering</span>
              </div>
              <span className="font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                Engineering Portal
              </span>
            </div>
            <div className="relative aspect-[16/10] bg-slate-950">
              <Image src="/dashboard-engineering.png" alt="Engineering Backlog" fill className="object-contain object-top group-hover:scale-102 transition-transform duration-500" />
            </div>
          </div>

          {/* Right: Explanatory Content */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold">
              <Code2 className="w-3.5 h-3.5" />
              <span>Page 3: Engineering Backlog</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              High-Velocity Incident Triage & Execution
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Engineers require raw error logs, stack traces, and clear sprint status workflows. The Engineering Backlog strips away non-essential noise while surfacing customer ARR context so developers resolve critical bugs first.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>Raw Technical Error Logs & Exception Traces</span>
                </div>
                <p className="text-xs text-slate-400">
                  Inspect exact stack traces (`QueryTimeoutException`, `Out of Memory`) directly within the incident card.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Jira-Style Workflow Status Pipeline</span>
                </div>
                <p className="text-xs text-slate-400">
                  1-Click transitions (`Open` → `In Progress` → `Resolved`) update status across the entire company in real time.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>ARR-Prioritized Defect Queue</span>
                </div>
                <p className="text-xs text-slate-400">
                  Surfaces impacted account value context so engineers fix defects affecting $750k accounts before minor issues.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/sign-in?role=engineering"
                className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300"
              >
                <span>Launch Engineering Backlog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY PRODUCTBRAIN IS SO GOOD (Value Proposition Section)               */}
      {/* ========================================================================= */}
      <section id="why-pb" className="py-24 bg-[#0B101D] border-t border-slate-800">
        <div className="w-full max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <PBLogo size="xl" showText={false} className="justify-center" />
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Why ProductBrain Is So Good
            </h2>
            <p className="text-base text-slate-300 max-w-2xl mx-auto">
              Traditional tools separate revenue from execution. ProductBrain unifies product strategy, sales customer retention, and engineering triage into one high-efficiency platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Value Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-blue-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-cyan-400 font-bold flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Direct ARR-to-Defect Visibility</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects Salesforce revenue directly to technical Jira defects, so leaders know the exact dollar amount at risk.
              </p>
            </div>

            {/* Value Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Jargon Communication</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically translates complex stack traces into professional, non-technical updates for Sales and clients.
              </p>
            </div>

            {/* Value Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-purple-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">1-Click PRD Writer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingests support incident logs and outputs structured 5-section executive PRDs with OKRs and tech specs instantly.
              </p>
            </div>

            {/* Value Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-indigo-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Strict Department Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Each department gets a custom interface. PMs retain authority and delegate login permissions to team members.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-indigo-500/30 text-center space-y-4">
            <h3 className="text-2xl font-extrabold text-white">Ready to streamline your product operations?</h3>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              Get started in under 2 minutes with pre-approved role simulation accounts. Zero credit card required.
            </p>
            <div className="pt-2">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0B101D] font-extrabold text-xs rounded-xl shadow-xl hover:bg-slate-100 transition-all"
              >
                <span>ENTER WORKSPACE PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="py-10 bg-[#04060C] border-t border-slate-800 text-xs text-slate-500">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <PBLogo size="sm" textColor="white" />

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
            <span>Next.js 15 App Router</span>
            <span>Clerk Auth Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
