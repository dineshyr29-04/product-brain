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
  PieChart
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"pm" | "sales" | "engineering">("pm");

  const dashboardShowcase = {
    pm: {
      title: "Program Manager (PM) Control Center",
      roleBadge: "Executive & PM View",
      roleColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      description:
        "Real-time defect radar with $1.43M ARR exposure tracking, AI opportunity clustering, and 1-Click Gemini 2.5 Flash autonomous PRD generation.",
      imageSrc: "/dashboard-pm.png",
      route: "/dashboard/pm",
      buttonText: "Open PM Dashboard",
      highlights: [
        "Aggregate ARR exposed to active defects ($1,430,000)",
        "Gemini AI clustered opportunities with ARR protection estimates",
        "1-Click PRD generator with autonomous user stories and technical scope",
        "Centralized team access delegation for Sales & Engineering"
      ]
    },
    sales: {
      title: "Sales Department — Churn Risk Radar",
      roleBadge: "Sales & Account Executive View",
      roleColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      description:
        "Customer-facing health monitor showing at-risk accounts, contract ARR, reach velocity, and plain-English AI resolution summaries ready to send to clients.",
      imageSrc: "/dashboard-sales.png",
      route: "/dashboard/sales",
      buttonText: "Open Sales Dashboard",
      highlights: [
        "Contract ARR per customer (e.g. Acme Corp $420k, Gamma Ltd $750k)",
        "At-risk status radar isolating escalated accounts requiring retention",
        "Plain-English AI Customer Resolution Briefings (no confusing stack traces)",
        "One-click ticket logging for urgent client escalations"
      ]
    },
    engineering: {
      title: "Engineering Backlog & Incident Triage",
      roleBadge: "Engineering & SRE View",
      roleColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      description:
        "Noise-free technical triage queue containing raw stack traces, error telemetry, priority queues, and fast status transitions from In Progress to Resolved.",
      imageSrc: "/dashboard-engineering.png",
      route: "/dashboard/engineering",
      buttonText: "Open Engineering Dashboard",
      highlights: [
        "Deep technical logs and exceptions (QueryTimeoutException, Out of Memory)",
        "Jira-style workflow status controls (Open → In Progress → Resolved)",
        "Instant ARR prioritization context to fix highest-dollar bugs first",
        "Resolution notes trigger automatic customer updates to Sales"
      ]
    }
  };

  const currentShowcase = dashboardShowcase[activeTab];

  return (
    <div className="min-h-screen bg-[#080C16] text-[#E2E8F0] selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. NAVIGATION BAR (Glassmorphism VisionOS Style)                           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080C16]/80 border-b border-slate-800/80 transition-all duration-300">
        <div className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo & Brand Monogram */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-[#0A0F1D] rounded-[10px] flex items-center justify-center">
                <span className="text-white font-bold text-lg tracking-wider">PB</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  ProductBrain
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-cyan-500/20">
                  Enterprise v1.0
                </span>
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#showcase" className="hover:text-white transition-colors">
              Platform Views
            </a>
            <a href="#solutions" className="hover:text-white transition-colors">
              Solutions
            </a>
            <a href="#roles" className="hover:text-white transition-colors">
              Role Access
            </a>
            <a href="#workflow" className="hover:text-white transition-colors">
              Architecture
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all border border-slate-700/60"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all"
              >
                Get Started Free
              </Link>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/pm"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all flex items-center gap-2"
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
      {/* 2. HERO SECTION (VisionOS Dark Radiant Mesh Inspired by Image 0)           */}
      {/* ========================================================================= */}
      <section className="relative pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden">
        {/* Glowing Aurora Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/25 via-indigo-900/15 to-transparent pointer-events-none blur-3xl -z-10" />
        <div className="absolute top-1/4 right-10 w-[450px] h-[450px] bg-purple-600/15 rounded-full pointer-events-none blur-[120px] -z-10" />
        <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full pointer-events-none blur-[100px] -z-10" />

        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-slate-300">
                Next-Gen Product Operations • Autonomous Gemini 2.5 Intelligence
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              We Help Corporates Rediscover Their{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                Product Intelligence.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Connect Salesforce ARR, customer escalations, and technical Jira incidents into an
              autonomous engine that prioritizes $1M+ high-impact opportunities and writes executive PRDs in seconds.
            </p>

            {/* Dual Call to Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Show when="signed-out">
                <Link
                  href="/sign-in?role=pm"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Start Free as Product Manager</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Show>

              <Show when="signed-in">
                <Link
                  href="/dashboard/pm"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Launch PM Intelligence Engine</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Show>

              <a
                href="#showcase"
                className="w-full sm:w-auto px-7 py-4 text-base font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span>Explore Interactive Showcase</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Social Proof Metric Counters */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-800/80 text-left">
              <div className="p-3">
                <div className="text-2xl font-bold text-white">$1,430,000</div>
                <div className="text-xs text-slate-400">ARR At-Risk Detected</div>
              </div>
              <div className="p-3">
                <div className="text-2xl font-bold text-cyan-400">1-Click</div>
                <div className="text-xs text-slate-400">Gemini Autonomous PRDs</div>
              </div>
              <div className="p-3">
                <div className="text-2xl font-bold text-emerald-400">100% Free</div>
                <div className="text-xs text-slate-400">Serverless on Vercel</div>
              </div>
              <div className="p-3">
                <div className="text-2xl font-bold text-purple-400">3 Roles</div>
                <div className="text-xs text-slate-400">Segregated Portals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE DASHBOARD SHOWCASE (Features the user's 3 real screenshots) */}
      {/* ========================================================================= */}
      <section id="showcase" className="py-20 bg-[#060911] border-y border-slate-800/80 relative">
        <div className="w-full max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40">
              Interactive Product Tour
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              One Unified Engine. Three Specialized Portals.
            </h2>
            <p className="text-base sm:text-lg text-slate-300">
              Select a department below to explore how ProductBrain gives Product Managers, Sales Executives,
              and Software Engineers their own custom-tailored intelligence view.
            </p>
          </div>

          {/* Department Role Tab Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveTab("pm")}
              className={`px-5 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 border ${
                activeTab === "pm"
                  ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 scale-[1.02]"
                  : "bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span>Program Manager (PM)</span>
            </button>

            <button
              onClick={() => setActiveTab("sales")}
              className={`px-5 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 border ${
                activeTab === "sales"
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30 scale-[1.02]"
                  : "bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-300" />
              <span>Sales Department</span>
            </button>

            <button
              onClick={() => setActiveTab("engineering")}
              className={`px-5 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 border ${
                activeTab === "engineering"
                  ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30 scale-[1.02]"
                  : "bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <Code2 className="w-4 h-4 text-purple-300" />
              <span>Engineering Department</span>
            </button>
          </div>

          {/* Browser Mockup Window with the Screenshot */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Browser Window Header Chrome */}
            <div className="px-4 py-3 bg-[#0B101D] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-4 text-xs font-mono text-slate-400 hidden sm:inline-block">
                  https://product-brain.internal{currentShowcase.route}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${currentShowcase.roleColor}`}>
                  {currentShowcase.roleBadge}
                </span>
                <Link
                  href={currentShowcase.route}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <span>Launch Live</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* The Actual Real Screenshot */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[16/9.5] bg-slate-950 overflow-hidden">
              <Image
                src={currentShowcase.imageSrc}
                alt={currentShowcase.title}
                fill
                priority
                className="object-contain object-top"
              />
            </div>

            {/* Contextual Feature Explainer Footer */}
            <div className="p-6 sm:p-8 bg-[#0B101D] border-t border-slate-800/80 grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{currentShowcase.title}</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentShowcase.description}
                </p>
                <div className="grid sm:grid-cols-2 gap-2 pt-2">
                  {currentShowcase.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 justify-center md:items-end">
                <Link
                  href={currentShowcase.route}
                  className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>{currentShowcase.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-[11px] text-slate-400 text-center md:text-right">
                  Protected by Clerk Authentication
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DIGITAL SOLUTIONS FOR TOMORROW'S MODELS (Exact structure from Image 0)  */}
      {/* ========================================================================= */}
      <section id="solutions" className="py-24 bg-white text-[#1E293B] relative">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Digital Solutions For Tomorrow&apos;s Product Operations.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              We connect disparate enterprise stacks, delivering cutting-edge AI technology and
              connecting technical bug resolutions perfectly with executive revenue outcomes.
            </p>
          </div>

          {/* 3 Column Feature Cards Matching Image 0 */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                Innovation That Drives Growth
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                We help transform raw incident noise into meaningful ARR impact by turning customer bug logs
                into revenue-driven opportunity scores that prioritize your engineering roadmap.
              </p>
              <div className="text-xs font-semibold text-blue-600 flex items-center gap-1.5">
                <span>ARR-Weighted Priority Queue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-400 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                Driving Business Opportunities
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Harness Gemini 2.5 Flash to automatically synthesize recurring defect patterns into
                complete, structured Product Requirement Documents with scope, risks, and criteria.
              </p>
              <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
                <span>Autonomous Gemini PRDs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-400 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                Build A Competitive Edge
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Position your organization for success by strictly isolating department concerns:
                engineers get stack traces, sales gets plain-English customer briefs, and PMs hold the master keys.
              </p>
              <div className="text-xs font-semibold text-purple-600 flex items-center gap-1.5">
                <span>Strict Role Separation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ROLE ACCESS & TEAM GOVERNANCE SECTION (As Requested by User)            */}
      {/* ========================================================================= */}
      <section id="roles" className="py-24 bg-[#0A0F1D] border-t border-slate-800 relative">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40">
              Access Control & Governance
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Product Managers Control Who Logs In & Sees What
            </h2>
            <p className="text-base sm:text-lg text-slate-300">
              Only approved team members can access sensitive financial ARR or raw engineering stack traces.
              The Product Manager acts as the workspace administrator.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* PM Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0B1020] border border-blue-500/30 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-cyan-300 border border-blue-500/20">
                  Workspace Admin
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Product Manager</h3>
              <p className="text-sm text-slate-300 mb-6">
                The central intelligence authority with full oversight across all product metrics, ARR correlation, and team governance.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Invites & approves Sales and Engineering users</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Generates autonomous PRDs via Gemini AI</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Monitors what Engineering and Sales resolved</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/dashboard/pm"
                  className="block w-full py-2.5 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  Enter as PM
                </Link>
              </div>
            </div>

            {/* Sales Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0B1020] border border-emerald-500/30 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Sales Only
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Sales Department</h3>
              <p className="text-sm text-slate-300 mb-6">
                Restricted to account health, contract retention, and client briefings without technical distraction.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Dedicated view of at-risk accounts & churn radar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Plain-English resolution summaries for clients</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Blocked from accessing raw code stack traces</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/dashboard/sales"
                  className="block w-full py-2.5 text-center text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                >
                  Enter as Sales
                </Link>
              </div>
            </div>

            {/* Engineering Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0B1020] border border-purple-500/30 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Engineering Only
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Engineering Team</h3>
              <p className="text-sm text-slate-300 mb-6">
                Dedicated incident queue with raw error logs, query timeouts, and stack traces with fast status transitions.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>Deep log inspection with exception stack traces</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>One-click status transitions (In Progress → Resolved)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>Blocked from modifying sensitive ARR financial deals</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/dashboard/engineering"
                  className="block w-full py-2.5 text-center text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                >
                  Enter as Engineer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION BANNER (Dark Radiant Finish)                             */}
      {/* ========================================================================= */}
      <section className="py-24 bg-gradient-to-b from-[#080C16] to-[#04060C] relative">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-indigo-500/30 shadow-2xl text-center space-y-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 inline-block">
              Get Started In Under 2 Minutes
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto">
              Ready to eliminate customer churn from engineering blindspots?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
              Deploy 100% free with Clerk authentication and Google Gemini AI. Zero credit card required.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Show when="signed-out">
                <Link
                  href="/sign-in?role=pm"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Create Your Workspace</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Show>

              <Show when="signed-in">
                <Link
                  href="/dashboard/pm"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Launch PM Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Show>

              <Link
                href="/dashboard/sales"
                className="w-full sm:w-auto px-7 py-4 text-base font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>View Sales Radar</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="py-12 bg-[#04060C] border-t border-slate-800/80 text-xs text-slate-500">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              PB
            </div>
            <span className="font-semibold text-slate-300">ProductBrain Enterprise</span>
            <span>• Built for high-growth tech companies</span>
          </div>

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
