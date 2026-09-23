"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Plus,
  ShieldCheck,
  Download,
  FileText,
  Layers,
  ArrowRight,
  TrendingUp,
  Inbox,
  Clock,
  AlertTriangle,
  RotateCcw,
  Check
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

// Safe Client Clerk Header Component with error boundary
function ClerkAuthHeader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="text-xs text-[#828387] px-2">Clerk Auth</div>;
  }

  return (
    <div className="flex items-center gap-2.5 border-r border-[#e0dedb] pr-4">
      <Show when="signed-in">
        <div className="flex items-center gap-2">
          <OrganizationSwitcher
            hidePersonal={false}
            afterCreateOrganizationUrl="/"
            afterLeaveOrganizationUrl="/"
            afterSelectOrganizationUrl="/"
            appearance={{
              elements: {
                rootBox: "flex items-center text-xs",
                organizationSwitcherTrigger:
                  "py-1 px-2.5 border border-[#e0dedb] rounded-lg bg-white hover:bg-[#eae7e3] text-[#37322F] text-xs font-semibold shadow-xs transition-all"
              }
            }}
          />
          <UserButton fallbackRedirectUrl="/" />
        </div>
      </Show>
      <Show when="signed-out">
        <div className="flex items-center gap-2">
          <SignInButton mode="modal">
            <button className="px-3 py-1.5 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220] transition-all shadow-xs">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-3 py-1.5 bg-white border border-[#d8d5d0] text-[#37322F] text-xs font-semibold rounded-lg hover:bg-[#eae7e3] transition-all shadow-xs">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </Show>
    </div>
  );
}

// Sparkline dynamic generators
const sparkReach = [
  { v: 10 }, { v: 18 }, { v: 14 }, { v: 22 }, { v: 31 }, { v: 28 }, { v: 45 }, { v: 38 }, { v: 50 }
];
const sparkEngage = [
  { v: 30 }, { v: 25 }, { v: 15 }, { v: 20 }, { v: 12 }, { v: 18 }, { v: 9 }, { v: 14 }
];
const sparkRate = [
  { v: 5 }, { v: 12 }, { v: 28 }, { v: 35 }, { v: 42 }, { v: 55 }, { v: 69 }, { v: 80 }
];

const fallbackCustomers = [
  { id: "cust-1", name: "Acme Corp", arr: 420000, account_owner: "Sarah Jenkins" },
  { id: "cust-2", name: "Gamma Ltd", arr: 750000, account_owner: "Michael Chang" },
  { id: "cust-3", name: "Beta Inc", arr: 180000, account_owner: "Elena Rostova" },
  { id: "cust-4", name: "Delta Global", arr: 520000, account_owner: "David Kim" },
  { id: "cust-5", name: "Epsilon Tech", arr: 310000, account_owner: "Sarah Jenkins" }
];

const fallbackProducts = [
  { id: "prod-1", name: "Product A (Core Platform)" },
  { id: "prod-2", name: "Product B (Analytics Hub)" },
  { id: "prod-3", name: "Product C (Integrations API)" }
];

const initialZeroPmData = {
  productHealth: {
    totalCustomers: 5,
    customersWithOpenIssues: 0,
    openTechnicalTickets: 0,
    resolvedThisMonth: 0,
    affectedArr: 0,
    criticalIssues: 0,
    highPriorityIssues: 0,
    avgResolutionTimeHours: 0
  },
  productBreakdown: [],
  opportunities: [],
  engineeringHealth: { open: 0, progress: 0, blocked: 0, resolved: 0 }
};

const initialZeroSalesData = {
  metrics: {
    totalCustomersWithIssues: 0,
    openIssuesCount: 0,
    criticalIssuesCount: 0,
    affectedArr: 0,
    resolvedThisWeekCount: 0
  },
  customerIssues: [],
  allCustomers: fallbackCustomers
};

const initialZeroEngData = {
  metrics: {
    openTickets: 0,
    inProgress: 0,
    blocked: 0,
    resolvedToday: 0,
    avgResolutionTimeHours: 0
  },
  tickets: []
};

export default function ProductBrainDashboard() {
  const [activeTab, setActiveTab] = useState<"pm" | "sales" | "engineering">("pm");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persona State
  const [currentUser, setCurrentUser] = useState<any>({
    id: "persona-pm",
    name: "Elena Rostova",
    role: "pm",
    title: "Principal Product Manager"
  });
  const [personas, setPersonas] = useState<any[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Data State — Starts strictly from 0 baseline
  const [customers, setCustomers] = useState<any[]>(fallbackCustomers);
  const [products, setProducts] = useState<any[]>(fallbackProducts);
  const [salesData, setSalesData] = useState<any>(initialZeroSalesData);
  const [engData, setEngData] = useState<any>(initialZeroEngData);
  const [pmData, setPmData] = useState<any>(initialZeroPmData);

  // Sales View Filter
  const [salesFilter, setSalesFilter] = useState<"all" | "at-risk" | "resolved">("all");

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [ticketModalTab, setTicketModalTab] = useState<"single" | "bulk">("single");
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isResolving, setIsResolving] = useState(false);

  // PRD Modal
  const [isPrdModalOpen, setIsPrdModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [generatingPrdId, setGeneratingPrdId] = useState<string | null>(null);

  // Ticket Form
  const [newTicket, setNewTicket] = useState({
    customer_id: "cust-1",
    product_id: "prod-1",
    title: "",
    description: "",
    priority: "High",
    category: "Export Performance",
    technical_logs: ""
  });
  const [rawDocumentText, setRawDocumentText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [submittingTicket, setSubmittingTicket] = useState(false);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchPersonas = async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/personas`);
      if (res.data?.personas && res.data.personas.length > 0) {
        setPersonas(res.data.personas);
        if (!currentUser) {
          const pmPersona = res.data.personas.find((p: any) => p.role === "pm") || res.data.personas[0];
          setCurrentUser(pmPersona);
        }
      }
    } catch {
      // Keep initial persona if server persona call fails
    }
  };

  const handlePersonaLogin = async (persona: any) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { personaId: persona.id });
      setCurrentUser(res.data.user);
      setActiveTab(persona.role as "pm" | "sales" | "engineering");
      setIsLoginModalOpen(false);
      showToast(`Switched persona to ${persona.name} (${persona.role.toUpperCase()})`);
    } catch {
      setCurrentUser(persona);
      setActiveTab(persona.role as "pm" | "sales" | "engineering");
      setIsLoginModalOpen(false);
      showToast(`Switched persona to ${persona.name}`);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [metaRes, salesRes, engRes, pmRes] = await Promise.all([
        axios.get(`${API_BASE}/dashboards/meta`).catch(() => ({ data: { customers: fallbackCustomers, products: fallbackProducts } })),
        axios.get(`${API_BASE}/dashboards/sales`).catch(() => ({ data: initialZeroSalesData })),
        axios.get(`${API_BASE}/dashboards/engineering`).catch(() => ({ data: initialZeroEngData })),
        axios.get(`${API_BASE}/dashboards/pm`).catch(() => ({ data: initialZeroPmData }))
      ]);

      const custs = metaRes.data?.customers && metaRes.data.customers.length > 0 ? metaRes.data.customers : fallbackCustomers;
      const prods = metaRes.data?.products && metaRes.data.products.length > 0 ? metaRes.data.products : fallbackProducts;

      setCustomers(custs);
      setProducts(prods);
      setSalesData(salesRes.data || initialZeroSalesData);
      setEngData(engRes.data || initialZeroEngData);
      setPmData(pmRes.data || initialZeroPmData);

      if (custs.length > 0 && !newTicket.customer_id) {
        setNewTicket((prev) => ({
          ...prev,
          customer_id: custs[0].id,
          product_id: prods[0]?.id || "prod-1"
        }));
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
    fetchDashboardData();
  }, []);

  // Quick Baseline Reset / Demo Data Seeder Workflows
  const handleResetToZero = async () => {
    try {
      setRefreshing(true);
      await axios.post(`${API_BASE}/dashboards/reset-to-zero`);
      await fetchDashboardData();
      showToast("Reset completed: Starting dashboard values set to 0");
    } catch {
      setSalesData(initialZeroSalesData);
      setEngData(initialZeroEngData);
      setPmData(initialZeroPmData);
      showToast("Reset to 0 baseline complete");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSeedDemoData = async () => {
    try {
      setRefreshing(true);
      await axios.post(`${API_BASE}/dashboards/seed-demo`);
      await fetchDashboardData();
      showToast("Loaded 5 enterprise demo tickets & opportunities!");
    } catch (err) {
      showToast("Could not seed data from server. Please check backend.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateSingleTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title || !newTicket.description) return;
    try {
      setSubmittingTicket(true);
      await axios.post(`${API_BASE}/tickets/create`, newTicket);
      setIsSubmitModalOpen(false);
      setNewTicket((prev) => ({ ...prev, title: "", description: "", technical_logs: "" }));
      await fetchDashboardData();
      showToast("Ticket created and linked to ARR impact successfully!");
    } catch (err) {
      console.error("Error submitting ticket:", err);
      showToast("Error submitting ticket. Check backend connection.");
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const b64 = event.target?.result as string;
        setUploadedImageBase64(b64);
        if (!rawDocumentText) {
          setRawDocumentText(`[OCR Document Image: ${file.name}]\nImage uploaded. ProductBrain AI OCR will extract and split incident tickets.`);
        }
        showToast(`Image "${file.name}" loaded for AI OCR.`);
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setRawDocumentText(text);
        setUploadedImageBase64(null);
        showToast(`Loaded ${file.name} (${text.split('\n').length} lines).`);
      };
      reader.readAsText(file);
    }
  };

  const handleBulkDocumentImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawDocumentText && !uploadedImageBase64) {
      showToast("Please paste text or upload an incident file/image.");
      return;
    }
    try {
      setSubmittingTicket(true);
      const res = await axios.post(`${API_BASE}/tickets/bulk-import`, {
        rawText: rawDocumentText,
        imageBase64: uploadedImageBase64
      });
      setIsSubmitModalOpen(false);
      setRawDocumentText("");
      setUploadedFileName(null);
      setUploadedImageBase64(null);
      await fetchDashboardData();
      showToast(`Success! Gemini AI extracted and created ${res.data?.count || 1} tickets.`);
    } catch (err: any) {
      console.error("Error bulk importing document:", err);
      showToast(err.response?.data?.error || "Error parsing document. Backend AI service active.");
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: string, note?: string) => {
    try {
      setIsResolving(true);
      await axios.patch(`${API_BASE}/tickets/${ticketId}/status`, {
        status,
        resolution_note: note
      });
      setIsResolveModalOpen(false);
      setSelectedTicket(null);
      setResolutionNote("");
      await fetchDashboardData();
      showToast(`Ticket status updated to ${status}. Gemini generated customer update!`);
    } catch (err) {
      console.error("Error updating ticket status:", err);
      showToast("Error updating ticket status.");
    } finally {
      setIsResolving(false);
    }
  };

  const handleGeneratePrd = async (oppId: string) => {
    try {
      setGeneratingPrdId(oppId);
      const res = await axios.post(`${API_BASE}/opportunities/${oppId}/generate-prd`);
      setSelectedOpportunity(res.data.data);
      setIsPrdModalOpen(true);
      await fetchDashboardData();
      showToast("Gemini 1.5 Flash generated technical PRD document!");
    } catch (err) {
      console.error("Error generating PRD:", err);
      showToast("PRD generation error. Retrying with cached opportunity.");
    } finally {
      setGeneratingPrdId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleExportCSV = () => {
    const rows = [
      ["Customer", "Account Owner", "ARR", "Priority", "Status", "Title", "AI Resolution Summary"],
      ...(salesData.customerIssues || []).map((t: any) => [
        t.customer?.name || "Enterprise Customer",
        t.customer?.account_owner || "Sales Lead",
        t.customer?.arr || 0,
        t.priority || "Medium",
        t.status || "Open",
        `"${(t.title || "").replace(/"/g, '""')}"`,
        `"${(t.ai_customer_summary || "Pending Resolution").replace(/"/g, '""')}"`
      ])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ProductBrain_Sales_Radar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported Sales Radar data to CSV!");
  };

  // Sample Log for 1-Click AI Test
  const insertSampleLog = () => {
    setRawDocumentText(`INCIDENT LOG REPORT - ESCALATED FROM ZENDESK
Ticket 1: Acme Corp ($420k ARR) - High Priority
Users report export query timeouts on 50MB CSV files. Database logs show QueryTimeoutException at db.driver.js:42.

Ticket 2: Gamma Ltd ($750k ARR) - Critical Priority
502 Bad Gateway observed on API Gateway during peak payload bursts. Rate-limiting bucket overflow.

Ticket 3: Delta Global ($520k ARR) - High Priority
Out of Memory (OOM) memory leak when multiple concurrent users download large analytics charts simultaneously.`);
  };

  // Live Calculated Dynamic Metrics (Ensuring starting values are 0)
  const openTicketsCount = pmData?.productHealth?.openTechnicalTickets || 0;
  const criticalCount = pmData?.productHealth?.criticalIssues || 0;
  const affectedArrValue = pmData?.productHealth?.affectedArr || 0;
  const resolvedCount = pmData?.productHealth?.resolvedThisMonth || 0;
  const opportunitiesCount = pmData?.opportunities?.length || 0;

  // Authority score starts at 0 if no tickets/health, otherwise scales dynamically
  const dynamicAuthorityScore = openTicketsCount === 0 && resolvedCount === 0 ? 0 : Math.max(10, 100 - openTicketsCount * 12);

  // Position trend chart data starts at 0% visibility when 0 tickets, or mirrors real load
  const dynamicPositionTrendData = useMemo(() => {
    if (openTicketsCount === 0 && resolvedCount === 0) {
      return [
        { day: "Day 1", visibility: 0 },
        { day: "Day 2", visibility: 0 },
        { day: "Day 3", visibility: 0 },
        { day: "Day 4", visibility: 0 },
        { day: "Today", visibility: 0 }
      ];
    }
    return [
      { day: "Dec 18", visibility: 42 },
      { day: "Dec 25", visibility: 45 },
      { day: "Jan 01", visibility: 48 },
      { day: "Jan 08", visibility: 51 },
      { day: "Jan 13", visibility: 51 }
    ];
  }, [openTicketsCount, resolvedCount]);

  // Site health donut data starts with 0 errors when clean
  const siteHealthData = useMemo(() => {
    if (openTicketsCount === 0 && criticalCount === 0) {
      return [
        { name: "Healthy Operations", value: 100, color: "#10b981" },
        { name: "Critical Errors", value: 0, color: "#ef4444" },
        { name: "Warnings", value: 0, color: "#f59e0b" }
      ];
    }
    return [
      { name: "Healthy Operations", value: Math.max(20, 100 - openTicketsCount * 10), color: "#0ea5e9" },
      { name: "Critical Errors", value: criticalCount * 4 || 5, color: "#ef4444" },
      { name: "Warnings", value: openTicketsCount * 3 || 8, color: "#f59e0b" }
    ];
  }, [openTicketsCount, criticalCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F3] flex flex-col justify-center items-center font-sans text-[#37322F]">
        <div className="w-10 h-10 border-2 border-[#37322F]/20 border-t-[#37322F] rounded-full animate-spin mb-4"></div>
        <div className="font-semibold text-sm">Initializing ProductBrain Engine...</div>
        <p className="text-xs text-[#828387] mt-1">Starting baseline metrics from 0</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3] text-[#37322F] font-sans antialiased selection:bg-[#eae7e3]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#37322F] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-medium border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 opacity-60 hover:opacity-100 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Top Header Bar (Full Length Layout) */}
      <header className="w-full bg-[#F7F5F3] border-b border-[#e0dedb] px-6 md:px-8 py-3 flex flex-wrap items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-opacity-95 gap-3">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#37322F] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              PB
            </div>
            <div>
              <div className="font-extrabold text-lg md:text-xl tracking-tight text-[#37322F] leading-none">
                ProductBrain
              </div>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 bg-[#eae7e3] text-[#605a57] rounded border border-[#d8d5d0]">
                Enterprise v1.0
              </span>
            </div>
          </Link>

          {/* Department Role Tabs */}
          <div className="flex items-center bg-[#eae7e3] p-1 rounded-lg border border-[#d8d5d0]">
            <button
              onClick={() => setActiveTab("pm")}
              className={`px-3 md:px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === "pm"
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605a57] hover:text-[#37322F]"
                }`}
            >
              Program Manager (PM)
            </button>
            <button
              onClick={() => setActiveTab("sales")}
              className={`px-3 md:px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === "sales"
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605a57] hover:text-[#37322F]"
                }`}
            >
              Sales Department
            </button>
            <button
              onClick={() => setActiveTab("engineering")}
              className={`px-3 md:px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === "engineering"
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605a57] hover:text-[#37322F]"
                }`}
            >
              Engineering Department
            </button>
          </div>
        </div>

        {/* Right Header Controls (Clerk Auth + Persona Switcher + Quick Actions) */}
        <div className="flex items-center gap-3">
          {/* Clerk Auth Integration */}
          <ClerkAuthHeader />

          {/* Persona Profile Selector */}
          {currentUser && (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e0dedb] rounded-lg hover:bg-[#eae7e3] transition-all text-xs text-[#37322F]"
              title="Click to switch department persona"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold">{currentUser.name}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-stone-100 rounded border border-stone-200 text-[#605a57]">
                {currentUser.role}
              </span>
            </button>
          )}

          {/* Baseline 0 / Demo Data Switcher */}
          <div className="hidden lg:flex items-center bg-[#eae7e3] p-0.5 rounded-lg border border-[#d8d5d0] text-xs">
            <button
              onClick={handleResetToZero}
              title="Set all tickets, opportunities & metrics to starting 0 baseline"
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${openTicketsCount === 0
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605a57] hover:text-[#37322F]"
                }`}
            >
              <RotateCcw className="w-3 h-3" />
              0 Baseline
            </button>
            <button
              onClick={handleSeedDemoData}
              title="Load 5 realistic demo tickets & opportunities"
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${openTicketsCount > 0
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605a57] hover:text-[#37322F]"
                }`}
            >
              <Layers className="w-3 h-3" />
              Demo Data
            </button>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="p-2 md:px-3 md:py-1.5 bg-white border border-[#e0dedb] rounded-lg text-xs font-medium text-[#605a57] hover:text-[#37322F] hover:bg-[#eae7e3] transition-all flex items-center gap-1.5"
            title="Refresh dashboard data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-[#37322F] hover:bg-[#252220] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create / Import</span>
          </button>
        </div>
      </header>

      {/* Main Full-Length Canvas (w-full px-6 md:px-8 py-6 space-y-6) */}
      <main className="w-full px-6 md:px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* 1. PROGRAM MANAGER (PM) DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === "pm" && (
          <div className="space-y-6">
            {/* Domain Analytics Top Strip — Dynamic values starting at 0 with zero indications */}
            <div className="bg-white rounded-xl border border-[#e0dedb] p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#e0dedb]">
              {/* Metric 1: Product Score */}
              <div className="pr-4">
                <div className="text-xs font-semibold text-[#605a57] uppercase tracking-wider">Product Score</div>
                <div className="text-3xl font-extrabold text-[#37322F] mt-1 flex items-baseline gap-2">
                  {dynamicAuthorityScore}
                  {dynamicAuthorityScore === 0 ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded border border-stone-200">
                      Baseline: 0
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600">↑ Health 92%</span>
                  )}
                </div>
                <div className="text-[11px] text-[#828387] mt-1">
                  {openTicketsCount === 0 ? "Indication: No open defects" : "Calculated from defect severity"}
                </div>
              </div>

              {/* Metric 2: Affected ARR */}
              <div className="pt-4 md:pt-0 md:pl-6 pr-4">
                <div className="text-xs font-semibold text-[#605a57] uppercase tracking-wider">Affected ARR</div>
                <div className="text-3xl font-extrabold text-[#0ea5e9] mt-1 flex items-baseline gap-2">
                  {formatCurrency(affectedArrValue)}
                  {affectedArrValue === 0 ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> $0 at risk
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-600">
                      {pmData?.productHealth?.customersWithOpenIssues} accounts
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#828387] mt-1">
                  {affectedArrValue === 0 ? (
                    <span className="text-emerald-600 font-medium">Indication: 100% Portfolio Secure</span>
                  ) : (
                    <span>Customer ARR exposed to bugs</span>
                  )}
                </div>
              </div>

              {/* Metric 3: Active Incidents / Tickets */}
              <div className="pt-4 md:pt-0 md:pl-6 pr-4">
                <div className="text-xs font-semibold text-[#605a57] uppercase tracking-wider">Active Incidents</div>
                <div className="text-3xl font-extrabold text-[#37322F] mt-1 flex items-baseline gap-2">
                  {openTicketsCount}
                  {openTicketsCount === 0 ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> 0 defects
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-600">Active Queue</span>
                  )}
                </div>
                <div className="text-[11px] text-[#828387] mt-1">
                  {openTicketsCount === 0 ? (
                    <span className="text-emerald-600 font-medium">Indication: Backlog is 0 / Clear</span>
                  ) : (
                    <span>Open customer support tickets</span>
                  )}
                </div>
              </div>

              {/* Metric 4: Critical Issues */}
              <div className="pt-4 md:pt-0 md:pl-6 pr-4">
                <div className="text-xs font-semibold text-[#605a57] uppercase tracking-wider">Critical Issues</div>
                <div className="text-3xl font-extrabold text-[#37322F] mt-1 flex items-baseline gap-2">
                  {criticalCount}
                  {criticalCount === 0 ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" /> 0 Critical
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-600">Urgent</span>
                  )}
                </div>
                <div className="text-[11px] text-[#828387] mt-1">
                  {criticalCount === 0 ? (
                    <span className="text-emerald-600 font-medium">Indication: 0 Sev-1 escapements</span>
                  ) : (
                    <span className="text-rose-600 font-medium">Immediate engineer required</span>
                  )}
                </div>
              </div>

              {/* Metric 5: Resolved This Month */}
              <div className="pt-4 md:pt-0 md:pl-6">
                <div className="text-xs font-semibold text-[#605a57] uppercase tracking-wider">Resolved Today/Month</div>
                <div className="text-3xl font-extrabold text-[#37322F] mt-1 flex items-baseline gap-2">
                  {resolvedCount}
                  {resolvedCount === 0 ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded border border-stone-200">
                      Count: 0
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600">↑ Solved</span>
                  )}
                </div>
                <div className="text-[11px] text-[#828387] mt-1">
                  {resolvedCount === 0 ? "Indication: 0 items closed" : "With AI client summary"}
                </div>
              </div>
            </div>

            {/* Middle Grid: Position Tracking + Site Audit Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Position Tracking Chart & Distribution */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-[#e0dedb] p-5 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
                    <div>
                      <h3 className="font-bold text-sm text-[#37322F]">Incident Visibility Trend & Defect Radar</h3>
                      <p className="text-[11px] text-[#828387]">
                        {openTicketsCount === 0
                          ? "Starting baseline: 0 active defect vectors detected"
                          : "Real-time telemetry updated continuously"}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-[#0ea5e9] flex items-center gap-1">
                      {openTicketsCount === 0 ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          0% Defect Velocity (Stable)
                        </span>
                      ) : (
                        <span>Defect Visibility 51%</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {/* Area Chart for Visibility */}
                    <div className="md:col-span-2 h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dynamicPositionTrendData}>
                          <defs>
                            <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="day" stroke="#828387" fontSize={10} />
                          <YAxis stroke="#828387" fontSize={10} domain={[0, 100]} />
                          <Tooltip />
                          <Area type="monotone" dataKey="visibility" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#visGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Breakdown Box with Zero Indications */}
                    <div className="space-y-3 bg-[#fbfaf9] p-3 rounded-lg border border-[#e0dedb] text-xs">
                      <div className="font-bold text-[#37322F] flex items-center justify-between">
                        <span>Incident Priority Distribution</span>
                        {openTicketsCount === 0 && (
                          <span className="text-[10px] text-emerald-600 font-mono">0 active</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2 rounded border border-[#e0dedb]">
                          <div className="text-[10px] text-[#828387]">Critical</div>
                          <div className="text-sm font-bold text-rose-600">{criticalCount}</div>
                          {criticalCount === 0 && (
                            <div className="text-[9px] text-emerald-600">0 count</div>
                          )}
                        </div>
                        <div className="bg-white p-2 rounded border border-[#e0dedb]">
                          <div className="text-[10px] text-[#828387]">High Priority</div>
                          <div className="text-sm font-bold text-amber-600">
                            {pmData?.productHealth?.highPriorityIssues || 0}
                          </div>
                          {(pmData?.productHealth?.highPriorityIssues || 0) === 0 && (
                            <div className="text-[9px] text-emerald-600">0 count</div>
                          )}
                        </div>
                        <div className="bg-white p-2 rounded border border-[#e0dedb]">
                          <div className="text-[10px] text-[#828387]">In Progress</div>
                          <div className="text-sm font-bold text-blue-600">
                            {engData?.metrics?.inProgress || 0}
                          </div>
                          {(engData?.metrics?.inProgress || 0) === 0 && (
                            <div className="text-[9px] text-stone-500">0 active</div>
                          )}
                        </div>
                        <div className="bg-white p-2 rounded border border-[#e0dedb]">
                          <div className="text-[10px] text-[#828387]">Resolved</div>
                          <div className="text-sm font-bold text-emerald-600">{resolvedCount}</div>
                          {resolvedCount === 0 && (
                            <div className="text-[9px] text-stone-500">0 count</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e0dedb] flex justify-between items-center text-xs text-[#605a57]">
                  <span>
                    Total Tracked Incidents:{" "}
                    <strong>{openTicketsCount + resolvedCount}</strong>
                    {openTicketsCount + resolvedCount === 0 && (
                      <span className="ml-1 text-emerald-600 font-semibold">(Starting Baseline: 0)</span>
                    )}
                  </span>
                  <button
                    onClick={() => setActiveTab("engineering")}
                    className="font-semibold text-[#37322F] hover:underline flex items-center gap-1"
                  >
                    View Engineering Queue <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Site Audit Health Widget */}
              <div className="bg-white rounded-xl border border-[#e0dedb] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
                    <h3 className="font-bold text-sm text-[#37322F]">Enterprise System Health</h3>
                    <span className="text-[11px] text-[#828387]">Live Monitoring</span>
                  </div>

                  <div className="flex items-center justify-between py-6">
                    <div className="w-36 h-36 relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={siteHealthData} innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                            {siteHealthData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute text-center">
                        <div className="text-2xl font-extrabold text-[#37322F]">
                          {openTicketsCount === 0 ? "100%" : `${Math.max(20, 100 - openTicketsCount * 12)}%`}
                        </div>
                        <div className="text-[10px] text-[#605a57]">
                          {openTicketsCount === 0 ? "0 defects" : "health score"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs flex-1 pl-6">
                      <div>
                        <div className="text-[#828387]">Critical Escapements</div>
                        <div className="text-2xl font-extrabold text-rose-600">{criticalCount}</div>
                        {criticalCount === 0 && (
                          <div className="text-[10px] text-emerald-600 font-medium">✓ Indication: 0 Errors</div>
                        )}
                      </div>
                      <div>
                        <div className="text-[#828387]">Open Warnings</div>
                        <div className="text-2xl font-extrabold text-amber-600">{openTicketsCount}</div>
                        {openTicketsCount === 0 && (
                          <div className="text-[10px] text-emerald-600 font-medium">✓ Indication: 0 Warnings</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#605a57]">
                      <span>Monitored Products</span>
                      <strong>{products.length} Products</strong>
                    </div>
                    <div className="w-full bg-[#eae7e3] h-3 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: openTicketsCount === 0 ? "100%" : "70%" }}></div>
                      <div className="bg-rose-500 h-full" style={{ width: openTicketsCount === 0 ? "0%" : "15%" }}></div>
                      <div className="bg-amber-500 h-full" style={{ width: openTicketsCount === 0 ? "0%" : "15%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e0dedb]">
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="w-full py-2 bg-[#fbfaf9] hover:bg-[#eae7e3] border border-[#e0dedb] rounded-lg text-xs font-semibold text-[#37322F] transition-all"
                  >
                    + Log New Incident
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row Grid: Detected Opportunities & Gemini AI PRD Generator */}
            <div className="bg-white rounded-xl border border-[#e0dedb] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-base text-[#37322F]">
                    Autonomous Product Opportunities (Gemini AI Clustered)
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-stone-100 border border-stone-200 rounded">
                    Count: {opportunitiesCount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Gemini AI Engine Active
                  </span>
                </div>
              </div>

              {/* ZERO COUNT INDICATION FOR OPPORTUNITIES */}
              {opportunitiesCount === 0 ? (
                <div className="py-12 px-6 border-2 border-dashed border-[#e0dedb] rounded-xl text-center bg-[#fbfaf9] space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#37322F]">
                      0 Detected Opportunities &bull; Backlog is Clean
                    </h4>
                    <p className="text-xs text-[#605a57] max-w-md mx-auto mt-1 leading-relaxed">
                      Gemini AI continuously clusters recurring customer tickets. When 2 or more related incidents are logged for a product, an autonomous opportunity will appear here with 1-Click PRD generation.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="px-4 py-2 bg-[#37322F] hover:bg-[#252220] text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Log or Import Tickets
                    </button>
                    <button
                      onClick={handleSeedDemoData}
                      className="px-4 py-2 bg-white border border-[#e0dedb] hover:bg-[#eae7e3] text-xs font-semibold text-[#37322F] rounded-lg transition-all"
                    >
                      Load Sample Clusters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {pmData.opportunities.map((opp: any) => (
                    <div
                      key={opp.id}
                      className="bg-[#fbfaf9] border border-[#e0dedb] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-stone-400 transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#37322F]">{opp.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">
                            {opp.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#605a57] mt-1 flex flex-wrap items-center gap-3">
                          <span>{opp.ticket_count} tickets aggregated</span>
                          <span>•</span>
                          <span>{opp.customer_count} accounts affected</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">
                            {formatCurrency(opp.affected_arr)} ARR Protection
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (opp.prd_content) {
                            setSelectedOpportunity(opp);
                            setIsPrdModalOpen(true);
                          } else {
                            handleGeneratePrd(opp.id);
                          }
                        }}
                        disabled={generatingPrdId === opp.id}
                        className="px-4 py-2 bg-[#37322F] text-white hover:bg-[#252220] font-bold text-xs rounded-lg transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        {generatingPrdId === opp.id
                          ? "Generating PRD with Gemini..."
                          : opp.prd_content
                            ? "View Generated PRD"
                            : "1-Click Gemini PRD"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. SALES DEPARTMENT DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            {/* Social-Media Style Channel Summary Bar */}
            <div className="bg-white rounded-xl border border-[#e0dedb] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={() => setSalesFilter("all")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${salesFilter === "all" ? "bg-[#37322F] text-white" : "text-[#605a57] hover:text-[#37322F]"
                    }`}
                >
                  All Accounts ({customers.length})
                </button>
                <button
                  onClick={() => setSalesFilter("at-risk")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${salesFilter === "at-risk" ? "bg-[#37322F] text-white" : "text-[#605a57] hover:text-[#37322F]"
                    }`}
                >
                  At-Risk Radar ({salesData?.metrics?.totalCustomersWithIssues || 0})
                </button>
                <button
                  onClick={() => setSalesFilter("resolved")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${salesFilter === "resolved" ? "bg-[#37322F] text-white" : "text-[#605a57] hover:text-[#37322F]"
                    }`}
                >
                  Resolved Updates ({salesData?.metrics?.resolvedThisWeekCount || 0})
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 border border-[#e0dedb] rounded bg-white text-xs font-medium text-[#605a57] hover:bg-[#eae7e3] transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export to CSV
                </button>
                <span className="text-xs text-[#828387] px-2 py-1 bg-[#fbfaf9] border border-[#e0dedb] rounded">
                  Current Year 📅
                </span>
              </div>
            </div>

            {/* Sales Metrics Strip with Zero Indications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-[#e0dedb] shadow-xs">
                <div className="text-xs font-semibold text-[#605a57]">Accounts with Escalations</div>
                <div className="text-2xl font-bold text-[#37322F] mt-1 flex items-baseline gap-2">
                  {salesData?.metrics?.totalCustomersWithIssues || 0}
                  {(salesData?.metrics?.totalCustomersWithIssues || 0) === 0 && (
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      ✓ 0 at risk
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#828387] mt-1">
                  {(salesData?.metrics?.totalCustomersWithIssues || 0) === 0
                    ? "Indication: 100% account retention"
                    : "Action required to retain account"}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#e0dedb] shadow-xs">
                <div className="text-xs font-semibold text-[#605a57]">Open Support Complaints</div>
                <div className="text-2xl font-bold text-[#37322F] mt-1 flex items-baseline gap-2">
                  {salesData?.metrics?.openIssuesCount || 0}
                  {(salesData?.metrics?.openIssuesCount || 0) === 0 && (
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      ✓ 0 active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#828387] mt-1">
                  {(salesData?.metrics?.openIssuesCount || 0) === 0
                    ? "Indication: Zero open escalations"
                    : "Linked to engineering backlog"}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#e0dedb] shadow-xs">
                <div className="text-xs font-semibold text-[#605a57]">Total ARR Exposed</div>
                <div className="text-2xl font-bold text-[#0ea5e9] mt-1 flex items-baseline gap-2">
                  {formatCurrency(salesData?.metrics?.affectedArr || 0)}
                  {(salesData?.metrics?.affectedArr || 0) === 0 && (
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      ✓ $0 exposed
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#828387] mt-1">
                  {(salesData?.metrics?.affectedArr || 0) === 0
                    ? "Indication: Enterprise contracts secure"
                    : "At-risk contract value"}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#e0dedb] shadow-xs">
                <div className="text-xs font-semibold text-[#605a57]">AI Customer Updates Ready</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1 flex items-baseline gap-2">
                  {salesData?.metrics?.resolvedThisWeekCount || 0}
                  {(salesData?.metrics?.resolvedThisWeekCount || 0) === 0 && (
                    <span className="text-[10px] font-mono text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                      Count: 0
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#828387] mt-1">
                  {(salesData?.metrics?.resolvedThisWeekCount || 0) === 0
                    ? "Indication: 0 pending notices"
                    : "Empathetic resolutions ready to send"}
                </div>
              </div>
            </div>

            {/* Account Performance & Activity Table with Inline Sparklines */}
            <div className="bg-white rounded-xl border border-[#e0dedb] p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#37322F]">Enterprise Accounts Activity & Churn Radar</h3>
                <p className="text-xs text-[#605a57]">
                  Real-time telemetry on ARR, post engagement, reach metrics, and Gemini AI customer resolution briefings.
                </p>
              </div>

              {/* Zero State for Customer Issues Table */}
              {(salesData.customerIssues || []).length === 0 ? (
                <div className="py-12 px-6 border-2 border-dashed border-[#e0dedb] rounded-xl text-center bg-[#fbfaf9] space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#37322F]">
                      0 Customer Escalations &bull; All Accounts Healthy
                    </h4>
                    <p className="text-xs text-[#605a57] max-w-md mx-auto mt-1 leading-relaxed">
                      There are currently 0 active customer tickets or churn risks recorded. Telemetry and AI resolution briefings will populate in this table when tickets are logged.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="px-4 py-2 bg-[#37322F] hover:bg-[#252220] text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Log Customer Ticket
                    </button>
                    <button
                      onClick={handleSeedDemoData}
                      className="px-4 py-2 bg-white border border-[#e0dedb] hover:bg-[#eae7e3] text-xs font-semibold text-[#37322F] rounded-lg transition-all"
                    >
                      Load Sample Accounts Data
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#e0dedb] text-xs font-bold text-[#605a57] uppercase tracking-wider bg-[#fbfaf9]">
                        <th className="py-3 px-4">Account / Customer</th>
                        <th className="py-3 px-4">Contract ARR</th>
                        <th className="py-3 px-4">Reach Velocity (Sparkline)</th>
                        <th className="py-3 px-4">Engagements</th>
                        <th className="py-3 px-4">Engagement Rate</th>
                        <th className="py-3 px-4">AI Customer Resolution Briefing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0dedb] text-sm">
                      {salesData.customerIssues.map((t: any, idx: number) => {
                        const reachSpark = idx % 2 === 0 ? sparkReach : sparkEngage;
                        const rateSpark = sparkRate;
                        const isResolved = t.status === "Resolved";

                        return (
                          <tr key={t.id} className="hover:bg-[#fbfaf9] transition-colors">
                            <td className="py-4 px-4 font-bold text-[#37322F]">
                              {t.customer?.name || "Acme Corp"}
                              <div className="text-xs font-normal text-[#828387]">
                                Owner: {t.customer?.account_owner || "Sales Lead"}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-[#37322F]">
                                {formatCurrency(t.customer?.arr || 0)}
                              </div>
                              <div className={`text-xs font-semibold ${isResolved ? "text-emerald-600" : "text-amber-600"}`}>
                                {isResolved ? "✓ Stable" : "⚠ Active Issue"}
                              </div>
                            </td>

                            {/* Posts Reach Sparkline */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#37322F]">31</span>
                                <span className="text-[11px] font-semibold text-emerald-600">+33%</span>
                                <div className="w-24 h-6">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={reachSpark}>
                                      <Line type="monotone" dataKey="v" stroke="#0ea5e9" strokeWidth={1.5} dot={false} />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </td>

                            {/* Posts Engagements Sparkline */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#37322F]">181</span>
                                <span className="text-[11px] font-semibold text-emerald-600">+115%</span>
                                <div className="w-24 h-6">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={sparkEngage}>
                                      <Line type="monotone" dataKey="v" stroke="#0284c7" strokeWidth={1.5} dot={false} />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </td>

                            {/* Engagement Rate Sparkline */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#37322F]">69%</span>
                                <span className="text-[11px] font-semibold text-emerald-600">+60%</span>
                                <div className="w-24 h-6">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={rateSpark}>
                                      <Line type="monotone" dataKey="v" stroke="#059669" strokeWidth={1.5} dot={false} />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-4 max-w-xs">
                              {t.ai_customer_summary ? (
                                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-xs text-emerald-900 leading-relaxed font-medium">
                                  <div className="font-bold text-[10px] text-emerald-800 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-emerald-600" /> Ready to send to customer:
                                  </div>
                                  {t.ai_customer_summary}
                                </div>
                              ) : (
                                <div className="text-xs text-[#828387] italic flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span>Pending engineering resolution note</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. ENGINEERING DEPARTMENT DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === "engineering" && (
          <div className="space-y-6">
            {/* Engineering Queue Summary Strip with Zero Indications */}
            <div className="bg-white rounded-xl border border-[#e0dedb] p-5 shadow-xs flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6 md:gap-10">
                <div>
                  <div className="text-xs font-semibold text-[#605a57] uppercase">Open Queue</div>
                  <div className="text-2xl font-bold text-[#37322F] flex items-baseline gap-2">
                    {engData?.metrics?.openTickets || 0}
                    {(engData?.metrics?.openTickets || 0) === 0 && (
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        ✓ Queue Clear
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#605a57] uppercase">In Progress</div>
                  <div className="text-2xl font-bold text-blue-600 flex items-baseline gap-2">
                    {engData?.metrics?.inProgress || 0}
                    {(engData?.metrics?.inProgress || 0) === 0 && (
                      <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                        0 active
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#605a57] uppercase">Blocked</div>
                  <div className="text-2xl font-bold text-amber-600 flex items-baseline gap-2">
                    {engData?.metrics?.blocked || 0}
                    {(engData?.metrics?.blocked || 0) === 0 && (
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        ✓ 0 Blockers
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#605a57] uppercase">Resolved Today</div>
                  <div className="text-2xl font-bold text-emerald-600 flex items-baseline gap-2">
                    {engData?.metrics?.resolvedToday || 0}
                    {(engData?.metrics?.resolvedToday || 0) === 0 && (
                      <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                        0 today
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#828387]">
                Average Resolution Time:{" "}
                <strong className="text-[#37322F]">{engData?.metrics?.avgResolutionTimeHours || 0}h</strong>
              </div>
            </div>

            {/* Technical Ticket Execution Table */}
            <div className="bg-white rounded-xl border border-[#e0dedb] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#37322F]">Engineering Technical Backlog Queue</h3>
                  <p className="text-xs text-[#605a57]">
                    Includes stack traces, technical error logs, ARR impact, and Gemini AI auto-notification triggers.
                  </p>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-3 py-1.5 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220] transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + New Incident
                </button>
              </div>

              {/* Zero State for Engineering Queue Table */}
              {(engData.tickets || []).length === 0 ? (
                <div className="py-12 px-6 border-2 border-dashed border-[#e0dedb] rounded-xl text-center bg-[#fbfaf9] space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#37322F]">
                      0 Pending Engineering Tickets &bull; Queue Clear
                    </h4>
                    <p className="text-xs text-[#605a57] max-w-md mx-auto mt-1 leading-relaxed">
                      All engineering tickets have been triaged and resolved. There are no open stack traces, crash reports, or customer escapements pending engineer action.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="px-4 py-2 bg-[#37322F] hover:bg-[#252220] text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create Technical Ticket
                    </button>
                    <button
                      onClick={handleSeedDemoData}
                      className="px-4 py-2 bg-white border border-[#e0dedb] hover:bg-[#eae7e3] text-xs font-semibold text-[#37322F] rounded-lg transition-all"
                    >
                      Load Demo Backlog
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#e0dedb] text-xs font-bold text-[#605a57] uppercase tracking-wider bg-[#fbfaf9]">
                        <th className="py-3 px-4">Ticket #</th>
                        <th className="py-3 px-4">Customer Account</th>
                        <th className="py-3 px-4">Incident Details & Technical Logs</th>
                        <th className="py-3 px-4">Customer ARR</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0dedb] text-sm">
                      {engData.tickets.map((t: any) => (
                        <tr key={t.id} className="hover:bg-[#fbfaf9] transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-xs text-[#37322F]">
                            #{t.ticket_number || t.id}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#37322F]">
                            {t.customer?.name || "Acme Corp"}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-[#37322F]">{t.title}</div>
                            <div className="text-xs text-[#605a57] mb-1">{t.description}</div>
                            {t.technical_logs && (
                              <div className="font-mono text-[11px] bg-stone-900 text-stone-200 p-2 rounded border border-stone-800 max-w-xl overflow-x-auto whitespace-pre-wrap">
                                {t.technical_logs}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 font-bold text-emerald-700">
                            {formatCurrency(t.customer?.arr || 0)}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2 py-0.5 text-xs font-bold rounded ${t.priority === "Critical"
                                  ? "bg-rose-100 text-rose-800"
                                  : t.priority === "High"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                            >
                              {t.priority}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2 py-0.5 text-xs font-semibold rounded ${t.status === "Resolved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : t.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : t.status === "Blocked"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-stone-100 text-stone-700"
                                }`}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            {t.status !== "In Progress" && t.status !== "Resolved" && (
                              <button
                                onClick={() => handleUpdateTicketStatus(t.id, "In Progress")}
                                className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs rounded transition-all"
                              >
                                Start Work
                              </button>
                            )}

                            {t.status !== "Resolved" && (
                              <button
                                onClick={() => {
                                  setSelectedTicket(t);
                                  setIsResolveModalOpen(true);
                                }}
                                className="px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs rounded transition-all"
                              >
                                Mark Resolved
                              </button>
                            )}

                            {t.status === "Resolved" && (
                              <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                                <Check className="w-3.5 h-3.5" /> Resolved
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE TICKET & AI BULK DOCUMENT OCR SPLITTER */}
      {/* ========================================================================= */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-[#e0dedb] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
              <h3 className="font-bold text-lg text-[#37322F]">Create or Bulk Import Tickets</h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-[#828387] hover:text-[#37322F] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex bg-[#eae7e3] p-1 rounded-lg border border-[#d8d5d0]">
              <button
                type="button"
                onClick={() => setTicketModalTab("single")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${ticketModalTab === "single" ? "bg-white text-[#37322F] shadow-xs" : "text-[#605a57]"
                  }`}
              >
                Single Ticket Entry
              </button>
              <button
                type="button"
                onClick={() => setTicketModalTab("bulk")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${ticketModalTab === "bulk" ? "bg-white text-[#37322F] shadow-xs" : "text-[#605a57]"
                  }`}
              >
                AI Bulk Document & OCR Reader
              </button>
            </div>

            {ticketModalTab === "single" ? (
              <form onSubmit={handleCreateSingleTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Customer Account</label>
                  <select
                    value={newTicket.customer_id}
                    onChange={(e) => setNewTicket({ ...newTicket, customer_id: e.target.value })}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({formatCurrency(c.arr)} ARR) &bull; Owner: {c.account_owner || "Lead"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Target Product</label>
                  <select
                    value={newTicket.product_id}
                    onChange={(e) => setNewTicket({ ...newTicket, product_id: e.target.value })}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Ticket Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Export query timeout for large CSV downloads"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Customer complaint or issue description..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">
                    Technical Logs / Stack Trace (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ConnectionTimeoutException at db.driver.js:42"
                    value={newTicket.technical_logs}
                    onChange={(e) => setNewTicket({ ...newTicket, technical_logs: e.target.value })}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-mono text-xs focus:outline-none focus:border-[#37322F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-medium"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                      className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-medium"
                    >
                      <option value="Export Performance">Export Performance</option>
                      <option value="Login Problems">Login Problems</option>
                      <option value="API Reliability">API Reliability</option>
                      <option value="Dashboard Lag">Dashboard Lag</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#605a57]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTicket}
                    className="px-5 py-2 bg-[#37322F] text-white font-bold text-xs rounded-lg"
                  >
                    {submittingTicket ? "Processing..." : "Create Ticket"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleBulkDocumentImport} className="space-y-4">
                {/* File Upload / OCR Dropzone */}
                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">
                    Upload Incident File or Document Scan (OCR)
                  </label>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="bulk-file-input"
                      className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-white border border-[#d8d5d0] hover:bg-[#eae7e3] text-xs font-semibold rounded-lg text-[#37322F] transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 rotate-180 text-[#0ea5e9]" />
                      <span>Choose File (.txt, .csv, .log, .png, .jpg)</span>
                    </label>
                    <input
                      id="bulk-file-input"
                      type="file"
                      accept=".txt,.csv,.log,.json,.pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={insertSampleLog}
                      className="text-xs font-semibold text-[#0ea5e9] hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Load 3-Incident Test Sample
                    </button>
                  </div>

                  {uploadedFileName && (
                    <div className="mt-2 flex items-center justify-between px-3 py-1.5 bg-[#eae7e3] border border-[#d8d5d0] rounded-lg text-xs text-[#37322F]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#37322F]" />
                        <span className="font-medium font-mono">{uploadedFileName}</span>
                        {uploadedImageBase64 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded">
                            OCR Mode
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFileName(null);
                          setUploadedImageBase64(null);
                          setRawDocumentText("");
                        }}
                        className="text-[#828387] hover:text-red-600 font-bold text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {uploadedImageBase64 && (
                    <div className="mt-2 p-2 border border-[#d8d5d0] rounded-lg bg-white flex items-center gap-3">
                      <img
                        src={uploadedImageBase64}
                        alt="OCR Preview"
                        className="w-16 h-16 object-cover rounded border border-[#e0dedb]"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-[#37322F]">Document Image OCR Ready</div>
                        <div className="text-[#828387] text-[11px]">
                          Gemini Vision OCR will scan text and split multiple incident tickets automatically.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#605a57] uppercase">
                      Raw Text / Pasted Document Content
                    </label>
                    {rawDocumentText && (
                      <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                        ~{Math.max(1, rawDocumentText.split(/(?:\r?\n){2,}|---|===|Incident\s*#?\d*/i).filter(Boolean).length)} incident(s) detected
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Paste a multi-ticket support report, customer email trail, or logs. ProductBrain AI will read, split, and extract individual tickets automatically..."
                    value={rawDocumentText}
                    onChange={(e) => setRawDocumentText(e.target.value)}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#37322F]"
                  />
                </div>

                <div className="p-3 bg-[#fbfaf9] rounded-lg border border-[#e0dedb] text-xs text-[#605a57]">
                  <strong>Gemini AI Document Reader & Splitter:</strong> Automatically detects multiple incidents, extracts customer ARR, matches products, assigns priorities, and populates the backlog.
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#605a57]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTicket || (!rawDocumentText.trim() && !uploadedImageBase64)}
                    className="px-5 py-2 bg-[#37322F] text-white font-bold text-xs rounded-lg hover:bg-[#252220] transition-all disabled:opacity-50"
                  >
                    {submittingTicket ? "Parsing & Splitting..." : "Import & Split Document"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PERSONA AUTH / SWITCHER */}
      {/* ========================================================================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e0dedb] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
              <h3 className="font-bold text-base text-[#37322F]">Select Department Persona Profile</h3>
              <button onClick={() => setIsLoginModalOpen(false)} className="text-[#828387] font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {(personas.length > 0
                ? personas
                : [
                  { id: "persona-pm", name: "Elena Rostova", role: "pm", title: "Principal Product Manager" },
                  { id: "persona-sales", name: "Marcus Vance", role: "sales", title: "VP of Enterprise Sales" },
                  { id: "persona-eng", name: "Devin Chen", role: "engineering", title: "Lead Systems Architect" }
                ]
              ).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePersonaLogin(p)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${currentUser?.id === p.id
                      ? "bg-[#37322F] text-white border-black"
                      : "bg-[#fbfaf9] hover:bg-[#eae7e3] text-[#37322F] border-[#e0dedb]"
                    }`}
                >
                  <div>
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className={`text-xs ${currentUser?.id === p.id ? "text-stone-300" : "text-[#605a57]"}`}>
                      {p.title}
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-stone-200 text-stone-800">
                    {p.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MARK RESOLVED (ENGINEERING) */}
      {/* ========================================================================= */}
      {isResolveModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e0dedb] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
              <h3 className="font-bold text-base text-[#37322F]">Mark Ticket Resolved</h3>
              <button onClick={() => setIsResolveModalOpen(false)} className="text-[#828387] font-bold">
                ✕
              </button>
            </div>

            <div className="bg-[#fbfaf9] p-3 rounded-lg border border-[#e0dedb] text-xs">
              <div className="font-bold text-[#37322F]">{selectedTicket.title}</div>
              <div className="text-[#605a57]">
                Customer: {selectedTicket.customer?.name} ({formatCurrency(selectedTicket.customer?.arr || 0)} ARR)
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">
                Engineering Resolution Note
              </label>
              <textarea
                rows={3}
                placeholder="Details on what was fixed (e.g. Increased query timeout and patched memory leak in db.driver)..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:border-[#37322F]"
              />
              <p className="text-[11px] text-[#828387] mt-1">
                Gemini AI will autonomously synthesize this note into an empathetic, non-technical customer update for the Sales department.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsResolveModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#605a57]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResolving}
                onClick={() => handleUpdateTicketStatus(selectedTicket.id, "Resolved", resolutionNote)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all"
              >
                {isResolving ? "Synthesizing AI Summary..." : "Confirm & Trigger AI Summary"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: GEMINI AI PRD STUDIO */}
      {/* ========================================================================= */}
      {isPrdModalOpen && selectedOpportunity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-8 border border-[#e0dedb] shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0dedb]">
              <div>
                <h3 className="font-bold text-xl text-[#37322F]">{selectedOpportunity.title}</h3>
                <p className="text-xs text-[#605a57]">AI-Generated Technical Product Requirement Document (PRD)</p>
              </div>

              <button onClick={() => setIsPrdModalOpen(false)} className="text-[#828387] font-bold text-lg">
                ✕
              </button>
            </div>

            <div className="py-6 overflow-y-auto max-h-[65vh] text-sm text-[#37322F] space-y-4 font-mono leading-relaxed bg-[#fbfaf9] p-6 rounded-xl border border-[#e0dedb] mt-4 whitespace-pre-wrap">
              {selectedOpportunity.prd_content}
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-[#e0dedb] mt-4">
              <div className="text-xs text-[#828387] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Synthesized by <strong>Google Gemini 1.5 Flash</strong> &bull; Backlog impact: {formatCurrency(selectedOpportunity.affected_arr || 0)} ARR
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedOpportunity.prd_content || "");
                    showToast("PRD Markdown copied to clipboard!");
                  }}
                  className="px-4 py-2 border border-[#e0dedb] hover:bg-[#eae7e3] text-xs font-semibold rounded-lg transition-all"
                >
                  Copy PRD
                </button>
                <button
                  onClick={() => setIsPrdModalOpen(false)}
                  className="px-6 py-2 bg-[#37322F] text-white font-bold text-xs rounded-lg hover:bg-[#252220] transition-all"
                >
                  Close PRD Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
