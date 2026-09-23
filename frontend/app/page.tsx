"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import PBLogo from "@/components/PBLogo";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white w-full overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR (Clean White Glassmorphism, Full Width, Responsive) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 w-full shadow-xs">
        <div className="w-full px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <PBLogo size="md" textColor="dark" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#showcase" className="hover:text-blue-600 transition-colors">
              Platform Views
            </a>
            <a href="#deep-dive" className="hover:text-blue-600 transition-colors">
              Deep Dive
            </a>
            <a href="#why-pb" className="hover:text-blue-600 transition-colors">
              Why ProductBrain
            </a>
            <a href="#security" className="hover:text-blue-600 transition-colors">
              Role Isolation
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-1"
              >
                <span>Get Started Free</span>
                <span>→</span>
              </Link>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/pm"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-1"
                >
                  <span>Go to Workspace</span>
                  <span>→</span>
                </Link>
                <div className="pl-1 border-l border-slate-200">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </Show>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? "Close ✕" : "Menu ☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-2.5 text-sm font-semibold text-slate-700">
              <a
                href="#showcase"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-600 py-1"
              >
                Platform Views
              </a>
              <a
                href="#deep-dive"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-600 py-1"
              >
                Deep Dive
              </a>
              <a
                href="#why-pb"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-600 py-1"
              >
                Why ProductBrain
              </a>
              <a
                href="#security"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-600 py-1"
              >
                Role Isolation
              </a>
            </nav>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/sign-in"
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
              >
                Get Started Free →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Full Width, Pure White Background, Clean Typography)    */}
      {/* ========================================================================= */}
      <section className="bg-white text-slate-900 pt-12 pb-16 md:pt-20 md:pb-28 border-b border-slate-100 w-full">
        <div className="w-full px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-8 text-center">
          
          {/* Badge */}
          <div>
            <span className="inline-block bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-2xs">
              Enterprise Product Operations Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Quickly Drive Product Operations.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Connect customer escalations, defect intelligence, and engineering triage into one unified, role-isolated workspace.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto sm:max-w-none">
            <Link
              href="/sign-in?role=pm"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all text-center"
            >
              <span>Launch Product Workspace</span>
              <span className="ml-2">→</span>
            </Link>
            <a
              href="#showcase"
              className="w-full sm:w-auto px-7 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base rounded-xl border border-slate-200 transition-all text-center"
            >
              Explore 3 Department Portals
            </a>
          </div>

          {/* Social Proof Counter Bar */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 text-center max-w-4xl mx-auto">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-xl sm:text-2xl font-black text-slate-900">$1,430,000</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">ARR At-Risk Baseline</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-xl sm:text-2xl font-black text-blue-600">1-Click</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Executive PRD Generation</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-xl sm:text-2xl font-black text-emerald-600">3 Portals</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Strict Role Isolation</div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PLATFORM SHOWCASE (3 Crisp White Side-by-Side Cards, Full Width)       */}
      {/* ========================================================================= */}
      <section id="showcase" className="py-16 md:py-24 bg-slate-50/60 border-b border-slate-200 w-full">
        <div className="w-full px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-200 inline-block">
              Platform Overview
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Three Specialized Portals. One Unified Engine.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Each department gets a dedicated interface tailored to their workflow with strict role permission guardrails.
            </p>
          </div>

          {/* 3 Column Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* CARD 1: SALES & CS RADAR */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
              {/* Image Frame */}
              <div className="relative w-full aspect-[16/10] bg-slate-100 border-b border-slate-200 overflow-hidden">
                <Image
                  src="/dashboard-sales.png"
                  alt="Sales & CS Radar Portal"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain object-top"
                />
                <div className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-xs">
                  Sales Portal
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Sales & CS Radar
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    A dedicated customer retention portal displaying contract ARR at risk, at-risk client badges, and automated plain-English client briefings.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700">
                  <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                    Key Features:
                  </div>
                  <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Tracks contract ARR per account (Acme $420k, Gamma $750k)</li>
                    <li>Isolates churn-risk accounts with real-time alerts</li>
                    <li>Generates non-technical client briefings automatically</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    href="/sign-in?role=sales"
                    className="block w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-center border border-emerald-200 transition-colors"
                  >
                    Explore Sales Portal →
                  </Link>
                </div>
              </div>
            </div>

            {/* CARD 2: PRODUCT MANAGER WORKSPACE (Featured Center Card) */}
            <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-md hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden">
              <div className="bg-blue-600 text-white text-[10px] font-extrabold py-1.5 text-center uppercase tracking-widest">
                Executive Command Center
              </div>

              {/* Image Frame */}
              <div className="relative w-full aspect-[16/10] bg-slate-100 border-b border-slate-200 overflow-hidden">
                <Image
                  src="/dashboard-pm.png"
                  alt="Product Manager Workspace"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain object-top"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-xs">
                  PM Admin Portal
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Product Manager Workspace
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    The executive command center unifying defect telemetry with revenue impact, opportunity clustering, autonomous PRD creation, and department access delegation.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700">
                  <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                    Key Features:
                  </div>
                  <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Calculates aggregate ARR exposed to defects ($1,430,000)</li>
                    <li>Clusters recurring support incidents into strategic opportunities</li>
                    <li>Generates 5-section executive PRDs in 1 click</li>
                    <li>Manages Team Access delegation for Sales & Engineering</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    href="/sign-in?role=pm"
                    className="block w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 text-center shadow-xs transition-colors"
                  >
                    Launch PM Workspace →
                  </Link>
                </div>
              </div>
            </div>

            {/* CARD 3: ENGINEERING BACKLOG */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
              {/* Image Frame */}
              <div className="relative w-full aspect-[16/10] bg-slate-100 border-b border-slate-200 overflow-hidden">
                <Image
                  src="/dashboard-engineering.png"
                  alt="Engineering Backlog Portal"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain object-top"
                />
                <div className="absolute top-3 left-3 bg-purple-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-xs">
                  Engineering Portal
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Engineering Backlog
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    A high-velocity technical triage hub providing exception stack traces, Jira-style priority queues, and fast workflow status transitions.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700">
                  <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                    Key Features:
                  </div>
                  <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Displays raw error telemetry and stack traces</li>
                    <li>Jira-style workflow pipeline (Open → In Progress → Resolved)</li>
                    <li>Surfaces ARR impact so developers resolve high-value defects first</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    href="/sign-in?role=engineering"
                    className="block w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-purple-50 text-purple-800 hover:bg-purple-100 text-center border border-purple-200 transition-colors"
                  >
                    Explore Engineering Portal →
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Section Action Link */}
          <div className="text-center pt-4">
            <Link
              href="/sign-in"
              className="inline-block px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
            >
              LEARN MORE & ENTER PORTAL →
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ALTERNATING DEEP-DIVE SECTIONS (Full Width, Pure Crisp Layout)         */}
      {/* ========================================================================= */}
      <section id="deep-dive" className="py-16 md:py-24 bg-white border-b border-slate-200 w-full space-y-24">
        
        <div className="w-full px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-3 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200 inline-block">
            In-Depth Page Breakdown
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Each Workspace Operates & Why It's Special
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            ProductBrain separates concerns so each team sees exactly what they need to execute at peak velocity.
          </p>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* ALTERNATING SECTION 1: PRODUCT MANAGER WORKSPACE (Image Left, Text Right) */}
        {/* ----------------------------------------------------------------------- */}
        <div className="w-full px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: High-Res Screenshot Frame */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-slate-50 shadow-md overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>https://productbrain.app/dashboard/pm</span>
              <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                PM Portal
              </span>
            </div>
            <div className="relative aspect-[16/10] bg-white">
              <Image src="/dashboard-pm.png" alt="PM Dashboard" fill className="object-contain object-top" />
            </div>
          </div>

          {/* Right: Explanatory Content */}
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Page 1: Product Manager Workspace
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Executive Command & Strategy Engine
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The Product Manager Workspace is the central intelligence hub. It aggregates support tickets across accounts, measures total ARR exposure, clusters defects into opportunities, and generates 5-section executive PRDs in seconds.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">
                  PM Defect Authority Score ($1.43M ARR Base)
                </div>
                <p className="text-xs text-slate-600">
                  Calculates real-time financial exposure so PMs prioritize $100k+ enterprise defects over minor requests.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">
                  1-Click Autonomous PRD Generation
                </div>
                <p className="text-xs text-slate-600">
                  Writes full PRDs complete with Business Justification, OKRs, Tech Spec, and Implementation Roadmaps.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">
                  PM Team Access & Role Delegation
                </div>
                <p className="text-xs text-slate-600">
                  PMs maintain administrative oversight and explicitly delegate which email addresses can log into Sales or Engineering.
                </p>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/sign-in?role=pm"
                className="inline-block text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Launch PM Workspace →
              </Link>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* ALTERNATING SECTION 2: SALES & CS RADAR (Text Left, Image Right)        */}
        {/* ----------------------------------------------------------------------- */}
        <div className="w-full px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Explanatory Content */}
          <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Page 2: Sales & CS Radar
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Customer Retention & Churn Risk Radar
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sales teams need visibility into customer issues without digging through raw GitHub code or complex stack traces. The Sales Radar isolates at-risk accounts, displays contract ARR values, and provides plain-English client updates.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">
                  Contract ARR Visibility Per Account
                </div>
                <p className="text-xs text-slate-600">
                  Displays exact account ARR (Acme $420k, Gamma $750k) alongside active defect escalations.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">
                  At-Risk Account Churn Alerts
                </div>
                <p className="text-xs text-slate-600">
                  Highlights accounts affected by open defects so Account Executives can proactively address renewal risks.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">
                  Automated Non-Technical Client Briefings
                </div>
                <p className="text-xs text-slate-600">
                  When Engineering resolves a defect, the system automatically translates technical fixes into professional customer updates.
                </p>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/sign-in?role=sales"
                className="inline-block text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Launch Sales Radar →
              </Link>
            </div>
          </div>

          {/* Right: High-Res Screenshot Frame */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-slate-50 shadow-md overflow-hidden order-1 lg:order-2">
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>https://productbrain.app/dashboard/sales</span>
              <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                Sales Portal
              </span>
            </div>
            <div className="relative aspect-[16/10] bg-white">
              <Image src="/dashboard-sales.png" alt="Sales Radar" fill className="object-contain object-top" />
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* ALTERNATING SECTION 3: ENGINEERING BACKLOG (Image Left, Text Right)      */}
        {/* ----------------------------------------------------------------------- */}
        <div className="w-full px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: High-Res Screenshot Frame */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-slate-50 shadow-md overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>https://productbrain.app/dashboard/engineering</span>
              <span className="font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                Engineering Portal
              </span>
            </div>
            <div className="relative aspect-[16/10] bg-white">
              <Image src="/dashboard-engineering.png" alt="Engineering Backlog" fill className="object-contain object-top" />
            </div>
          </div>

          {/* Right: Explanatory Content */}
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Page 3: Engineering Backlog
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              High-Velocity Incident Triage & Execution
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Engineers require raw error logs, stack traces, and clear sprint status workflows. The Engineering Backlog strips away non-essential noise while surfacing customer ARR context so developers resolve critical bugs first.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">
                  Raw Technical Error Logs & Exception Traces
                </div>
                <p className="text-xs text-slate-600">
                  Inspect exact stack traces (`QueryTimeoutException`, `Out of Memory`) directly within the incident card.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">
                  Jira-Style Workflow Status Pipeline
                </div>
                <p className="text-xs text-slate-600">
                  1-Click transitions (`Open` → `In Progress` → `Resolved`) update status across the entire company in real time.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">
                  ARR-Prioritized Defect Queue
                </div>
                <p className="text-xs text-slate-600">
                  Surfaces impacted account value context so engineers fix defects affecting $750k accounts before minor issues.
                </p>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/sign-in?role=engineering"
                className="inline-block text-xs font-bold text-purple-700 hover:text-purple-800"
              >
                Launch Engineering Backlog →
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. WHY PRODUCTBRAIN IS SO GOOD (Value Proposition Section, Pure White)    */}
      {/* ========================================================================= */}
      <section id="why-pb" className="py-16 md:py-24 bg-slate-50/70 border-b border-slate-200 w-full">
        <div className="w-full px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="flex justify-center">
              <PBLogo size="lg" showText={false} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Leading Product & Revenue Teams Choose ProductBrain
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Traditional tools separate revenue from execution. ProductBrain unifies product strategy, sales customer retention, and engineering triage into one high-efficiency platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Value Card 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                $
              </div>
              <h3 className="text-base font-bold text-slate-900">Direct ARR-to-Defect Visibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects Salesforce revenue directly to technical defects, so leaders know the exact dollar amount at risk.
              </p>
            </div>

            {/* Value Card 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                ✓
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero Jargon Communication</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically translates complex stack traces into professional, non-technical updates for Sales and clients.
              </p>
            </div>

            {/* Value Card 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-sm">
                ✦
              </div>
              <h3 className="text-base font-bold text-slate-900">1-Click PRD Writer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingests support incident logs and outputs structured 5-section executive PRDs with OKRs and tech specs instantly.
              </p>
            </div>

            {/* Value Card 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-sm">
                🔒
              </div>
              <h3 className="text-base font-bold text-slate-900">Strict Department Isolation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Each department gets a custom interface. PMs retain authority and delegate login permissions to team members.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-8 sm:p-10 rounded-3xl bg-blue-600 text-white text-center space-y-4 shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to streamline your product operations?</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto">
              Get started in under 2 minutes with pre-approved role simulation accounts. Zero credit card required.
            </p>
            <div className="pt-2">
              <Link
                href="/sign-in"
                className="inline-block px-8 py-3.5 bg-white text-blue-600 font-black text-xs sm:text-sm rounded-xl shadow-md hover:bg-blue-50 transition-all"
              >
                ENTER WORKSPACE PORTAL →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOOTER (Pure White, Full Width, Crisp Text)                           */}
      {/* ========================================================================= */}
      <footer className="py-10 bg-white border-t border-slate-200 text-xs text-slate-500 w-full">
        <div className="w-full px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <PBLogo size="sm" textColor="dark" />

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
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
