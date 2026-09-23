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
  Briefcase
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"pm" | "sales" | "engineering">("pm");

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#1E293B] font-sans antialiased selection:bg-[#4066F6] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. BLUE HEADER & NAVIGATION BAR (Inspired by Lander Reference Image)      */}
      {/* ========================================================================= */}
      <header className="bg-[#4066F6] text-white border-b border-blue-400/30 sticky top-0 z-50 shadow-md">
        <div className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo & Brand Monogram */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white text-[#4066F6] font-black text-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              PB
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-blue-100 transition-colors">
                ProductBrain
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-200">
                Enterprise Product Engine
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-blue-100">
            <a href="#showcase" className="hover:text-white transition-colors">
              Platform Views
            </a>
            <a href="#departments" className="hover:text-white transition-colors">
              Department Roles
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Security & Auth
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 rounded-xl transition-all border border-white/30"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 text-sm font-bold text-[#4066F6] bg-white hover:bg-blue-50 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Get Started Free</span>
              </Link>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/pm"
                  className="px-5 py-2 text-sm font-bold text-[#4066F6] bg-white hover:bg-blue-50 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="pl-1 border-l border-blue-400/40">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </Show>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO AREA (Rich Royal Blue Gradient Inspired by Lander Reference Image) */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-[#4066F6] via-[#3B60EE] to-[#3156DC] text-white pt-16 pb-36 text-center relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="w-full max-w-5xl mx-auto px-6 space-y-5 relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-blue-100">
            Customize, Ingest, Convert!
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Quickly Drive Product Execution.
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto font-medium leading-relaxed">
            Connect customer escalations, automated defect intelligence, and engineering triage into one unified workspace.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-in?role=pm"
              className="px-8 py-4 bg-white text-[#4066F6] font-extrabold text-base rounded-2xl shadow-2xl hover:bg-blue-50 transition-all flex items-center gap-2 group"
            >
              <span>Launch Product Workspace</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#showcase"
              className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold text-base rounded-2xl transition-all"
            >
              Explore 3 Portals
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PRIMARY PAGE SHOWCASE SECTION (3 Side-by-Side Cards Overlapping Hero)  */}
      {/* ========================================================================= */}
      <section id="showcase" className="relative -mt-24 pb-20 px-6">
        <div className="w-full max-w-7xl mx-auto space-y-12">
          
          {/* Section Sub-Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4066F6] bg-blue-100/80 px-3.5 py-1 rounded-full border border-blue-200">
              Complete Workspace Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Three Specialized Portals. One Unified Engine.
            </h2>
            <p className="text-sm text-slate-500">
              Each department gets a dedicated interface tailored to their workflow with strict role isolation.
            </p>
          </div>

          {/* 3 Cards Container (Side-by-Side Layout matching reference image) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* ------------------------------------------------------------------- */}
            {/* CARD 1: SALES & CS RADAR (Left Card)                                */}
            {/* ------------------------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col transition-all hover:shadow-2xl group">
              {/* Card Screenshot Preview Frame */}
              <div className="relative w-full aspect-[4/3] bg-slate-900 overflow-hidden border-b border-slate-200">
                <Image
                  src="/dashboard-sales.png"
                  alt="Sales Radar Portal Preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  <span>Sales Portal</span>
                </div>
              </div>

              {/* Card Content & Explanation */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#4066F6] transition-colors">
                    Sales & CS Radar
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    A dedicated customer retention portal displaying contract ARR at risk, at-risk client badges, and automated plain-English client briefings.
                  </p>
                </div>

                {/* What it can do & why special */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                    Key Capabilities & Special Features:
                  </div>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Tracks contract ARR per account (e.g. Acme Corp $420k, Gamma Ltd $750k)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Isolates churn-risk accounts with real-time escalation badges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Generates non-technical client briefings automatically when engineering resolves a bug</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    href="/sign-in?role=sales"
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 border border-emerald-200"
                  >
                    <span>Explore Sales Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* CARD 2: PRODUCT MANAGER WORKSPACE (Center Card - Elevated & Highlighted) */}
            {/* ------------------------------------------------------------------- */}
            <div className="bg-white rounded-3xl border-2 border-[#4066F6] shadow-2xl overflow-hidden flex flex-col transition-all lg:-translate-y-4 group">
              {/* Featured Badge Header */}
              <div className="bg-[#4066F6] text-white text-[11px] font-bold py-1.5 text-center uppercase tracking-widest">
                ★ Core Executive Command Center
              </div>

              {/* Card Screenshot Preview Frame */}
              <div className="relative w-full aspect-[4/3] bg-slate-900 overflow-hidden border-b border-slate-200">
                <Image
                  src="/dashboard-pm.png"
                  alt="Product Manager Control Center Preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#4066F6] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                  <PieChart className="w-3 h-3" />
                  <span>PM Admin Portal</span>
                </div>
              </div>

              {/* Card Content & Explanation */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#4066F6] transition-colors">
                    Product Manager Workspace
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    The executive command center unifying defect telemetry with revenue impact, opportunity clustering, autonomous PRD creation, and department access delegation.
                  </p>
                </div>

                {/* What it can do & why special */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                    Key Capabilities & Special Features:
                  </div>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4066F6] shrink-0 mt-0.5" />
                      <span>Calculates aggregate ARR exposed to defects ($1,430,000 baseline)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4066F6] shrink-0 mt-0.5" />
                      <span>Clusters recurring support incidents into strategic product opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4066F6] shrink-0 mt-0.5" />
                      <span>Generates comprehensive 5-section executive PRDs in 1 click</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4066F6] shrink-0 mt-0.5" />
                      <span>Manages Team Access delegation to grant/revoke Sales & Engineering logins</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    href="/sign-in?role=pm"
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#4066F6] text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Launch PM Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* CARD 3: ENGINEERING BACKLOG (Right Card)                            */}
            {/* ------------------------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col transition-all hover:shadow-2xl group">
              {/* Card Screenshot Preview Frame */}
              <div className="relative w-full aspect-[4/3] bg-slate-900 overflow-hidden border-b border-slate-200">
                <Image
                  src="/dashboard-engineering.png"
                  alt="Engineering Backlog Preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                  <Code2 className="w-3 h-3" />
                  <span>Engineering Portal</span>
                </div>
              </div>

              {/* Card Content & Explanation */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#4066F6] transition-colors">
                    Engineering Backlog
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    A high-velocity technical triage hub providing exception stack traces, Jira-style priority queues, and fast workflow status transitions.
                  </p>
                </div>

                {/* What it can do & why special */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                    Key Capabilities & Special Features:
                  </div>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>Displays raw error telemetry, stack traces, and exception logs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>Jira-style workflow controls (Open → In Progress → Resolved)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>Surfaces underlying customer ARR context so engineers fix high-value bugs first</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    href="/sign-in?role=engineering"
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5 border border-purple-200"
                  >
                    <span>Explore Engineering Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Central Bottom Action Button (Lander Inspired) */}
          <div className="text-center pt-6">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#4066F6] hover:bg-blue-600 text-white font-extrabold text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            >
              <span>LEARN MORE & ENTER PORTAL</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DEPARTMENT GOVERNANCE & SECURITY BREAKDOWN                            */}
      {/* ========================================================================= */}
      <section id="departments" className="py-20 bg-white border-t border-slate-200">
        <div className="w-full max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4066F6]">
              Role Separation & Security
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Why Separating Portals Matters
            </h2>
            <p className="text-sm text-slate-500">
              Sales shouldn't decode complex stack traces, and Engineers shouldn't navigate raw ARR contracts. ProductBrain keeps focus razor-sharp.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#4066F6] font-bold flex items-center justify-center text-lg">
                👑
              </div>
              <h3 className="text-base font-bold text-slate-800">Product Manager Authority</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                PMs act as workspace administrators. They delegate who can log into Sales or Engineering, cluster defects into high-value opportunities, and generate formal PRDs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
                💼
              </div>
              <h3 className="text-base font-bold text-slate-800">Sales ARR Protection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Account Executives track at-risk accounts, view plain-English customer briefing notes, and log new client escalations without seeing internal Jira tickets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-lg">
                💻
              </div>
              <h3 className="text-base font-bold text-slate-800">Engineering Noise Reduction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Engineers inspect clean stack traces and error telemetry. Resolving a ticket automatically dispatches a non-technical update to Sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="bg-[#0F172A] text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#4066F6] text-white font-bold flex items-center justify-center text-xs">
              PB
            </div>
            <span className="font-bold text-white">ProductBrain Enterprise</span>
            <span>• Unified Product Operations Platform</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
            <span>Next.js 15 App Router</span>
            <span>Clerk Authentication</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
