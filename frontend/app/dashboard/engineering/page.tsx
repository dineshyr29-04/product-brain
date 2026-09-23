"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Plus,
  ArrowLeft,
  Check,
  Search,
  Code,
  Lock,
  LogOut,
  Terminal,
  Play,
  Copy,
  UserCheck,
  Ban,
  Filter
} from "lucide-react";
import { useRouter } from "next/navigation";
import DepartmentGuard from "@/components/DepartmentGuard";
import PBLogo from "@/components/PBLogo";
import { getCurrentUser, logoutUser, UserProfile } from "@/lib/authHelper";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

interface EngineeringTicket {
  ticketNumber: string;
  customerName: string;
  customerArr: number;
  productName: string;
  title: string;
  stackTrace: string;
  priority: "Critical" | "High" | "Medium";
  status: "Open" | "In Progress" | "Resolved" | "Blocked";
  assignedEngineer: string;
  gitBranch: string;
  resolutionNote?: string;
  blockerReason?: string;
}

const defaultTickets: EngineeringTicket[] = [
  {
    ticketNumber: "#1024",
    customerName: "Acme Corp",
    customerArr: 420000,
    productName: "Product A (Core Platform)",
    title: "High Priority Export Timeout",
    stackTrace: "QueryTimeoutException: 30000ms exceeded in db.driver.js:42\n  at Database.executeQuery (/app/db/driver.js:42:11)\n  at ExportService.streamCsv (/app/services/export.js:108:5)",
    priority: "High",
    status: "In Progress",
    assignedEngineer: "Alex Rivera (Staff Eng)",
    gitBranch: "fix/issue-1024-db-query-timeout-pool"
  },
  {
    ticketNumber: "#1025",
    customerName: "Beta Inc",
    customerArr: 180000,
    productName: "Product A (Core Platform)",
    title: "SSO Authentication Failure",
    stackTrace: "SSO_HANDSHAKE_TIMEOUT [408] redirect to sso.beta.com\n  at SAMLProvider.verifyHandshake (/app/auth/saml.js:84:12)",
    priority: "Medium",
    status: "Open",
    assignedEngineer: "David Kim (Backend Eng)",
    gitBranch: "fix/issue-1025-saml-handshake-retry"
  },
  {
    ticketNumber: "#1026",
    customerName: "Gamma Ltd",
    customerArr: 750000,
    productName: "Product C (Integrations API)",
    title: "Analytics Export Timeout",
    stackTrace: "502 Bad Gateway: Upstream rate limiter overflow [1000req/sec]\n  at RateLimiter.checkBucket (/app/gateway/limiter.js:22:9)",
    priority: "Critical",
    status: "Resolved",
    assignedEngineer: "Alex Rivera (Staff Eng)",
    gitBranch: "fix/issue-1026-gateway-rate-limiter",
    resolutionNote: "Scaled database connection pool and updated query timeout limits to 120s."
  },
  {
    ticketNumber: "#1027",
    customerName: "Delta Global",
    customerArr: 520000,
    productName: "Product B (Analytics Hub)",
    title: "Memory Leak in Report Generator",
    stackTrace: "FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory\n  at RenderEngine.compileCanvas (/app/pdf/render.js:210:4)",
    priority: "High",
    status: "Open",
    assignedEngineer: "Sarah Jenkins (Lead Eng)",
    gitBranch: "fix/issue-1027-heap-memory-buffer"
  },
  {
    ticketNumber: "#1028",
    customerName: "Epsilon Tech",
    customerArr: 310000,
    productName: "Product B (Analytics Hub)",
    title: "Slow Dashboard Render",
    stackTrace: "LongTaskwarning: script execution took 11840ms on renderCanvas()\n  at CanvasChart.drawPoints (/app/ui/canvas.js:55:18)",
    priority: "Medium",
    status: "Open",
    assignedEngineer: "David Kim (Backend Eng)",
    gitBranch: "fix/issue-1028-canvas-render-optimize"
  }
];

export default function EngineeringDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isZeroBaseline, setIsZeroBaseline] = useState(false);

  const [tickets, setTickets] = useState<EngineeringTicket[]>(defaultTickets);

  // Resolution Modal State
  const [resolvingTicket, setResolvingTicket] = useState<EngineeringTicket | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Inspector Modal State
  const [inspectingTicket, setInspectingTicket] = useState<EngineeringTicket | null>(null);

  // New Incident Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    customerName: "Acme Corp",
    customerArr: "420000",
    productName: "Product A (Core Platform)",
    title: "",
    stackTrace: "",
    priority: "High" as "Critical" | "High" | "Medium"
  });

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [productFilter, setProductFilter] = useState("All");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    setCurrentUserState(getCurrentUser());
  }, []);

  const handleBaselineZero = async () => {
    setIsZeroBaseline(true);
    showToast("Reset Engineering Backlog to 0 Baseline.");
    try {
      await axios.post(`${API_BASE}/dashboards/reset-to-zero`);
    } catch {}
  };

  const handleLoadDemoData = async () => {
    setIsZeroBaseline(false);
    setTickets(defaultTickets);
    showToast("Loaded full Engineering Backlog demo data.");
    try {
      await axios.get(`${API_BASE}/dashboards/engineering`);
    } catch {}
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast("Engineering queue telemetry refreshed!");
    }, 600);
  };

  const handleStartWork = (ticketNumber: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.ticketNumber === ticketNumber ? { ...t, status: "In Progress" } : t))
    );
    showToast(`✓ Ticket ${ticketNumber} moved to 'In Progress'.`);
  };

  const handleToggleBlock = (ticketNumber: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.ticketNumber === ticketNumber) {
          const isBlocked = t.status === "Blocked";
          return {
            ...t,
            status: isBlocked ? "Open" : "Blocked",
            blockerReason: isBlocked ? undefined : "Awaiting upstream DB driver update"
          };
        }
        return t;
      })
    );
    showToast(`✓ Ticket ${ticketNumber} status updated.`);
  };

  const handleAssignEngineer = (ticketNumber: string, engineer: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.ticketNumber === ticketNumber ? { ...t, assignedEngineer: engineer } : t))
    );
    showToast(`✓ Assigned ${ticketNumber} to ${engineer}.`);
  };

  const handleResolveTicket = async () => {
    if (!resolvingTicket) return;
    setIsProcessing(true);

    setTimeout(() => {
      setTickets((prev) =>
        prev.map((t) =>
          t.ticketNumber === resolvingTicket.ticketNumber
            ? {
                ...t,
                status: "Resolved",
                resolutionNote: resolutionNote || "Technical defect remediated and verified."
              }
            : t
        )
      );
      showToast(
        `✓ ${resolvingTicket.ticketNumber} resolved! Non-technical update generated for Sales.`
      );
      setResolvingTicket(null);
      setResolutionNote("");
      setIsProcessing(false);
    }, 400);
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.title) return;

    const newTicket: EngineeringTicket = {
      ticketNumber: `#${1024 + tickets.length + 1}`,
      customerName: newTicketForm.customerName,
      customerArr: Number(newTicketForm.customerArr) || 100000,
      productName: newTicketForm.productName,
      title: newTicketForm.title,
      stackTrace: newTicketForm.stackTrace || "Runtime Exception logged",
      priority: newTicketForm.priority,
      status: "Open",
      assignedEngineer: "Alex Rivera (Staff Eng)",
      gitBranch: `fix/issue-${1024 + tickets.length + 1}-patch`
    };

    setTickets((prev) => [newTicket, ...prev]);
    setIsZeroBaseline(false);
    setShowCreateModal(false);
    setNewTicketForm({
      customerName: "Acme Corp",
      customerArr: "420000",
      productName: "Product A (Core Platform)",
      title: "",
      stackTrace: "",
      priority: "High"
    });
    showToast(`✓ Incident ${newTicket.ticketNumber} logged into Engineering Queue.`);
  };

  const activeTickets = isZeroBaseline ? [] : tickets;

  const filteredTickets = useMemo(() => {
    return activeTickets.filter((t) => {
      const matchesSearch =
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.stackTrace.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      const matchesProduct = productFilter === "All" || t.productName === productFilter;
      return matchesSearch && matchesStatus && matchesProduct;
    });
  }, [activeTickets, searchQuery, statusFilter, productFilter]);

  // Metrics calculations
  const openCount = isZeroBaseline ? 0 : activeTickets.filter((t) => t.status === "Open").length;
  const inProgressCount = isZeroBaseline ? 0 : activeTickets.filter((t) => t.status === "In Progress").length;
  const blockedCount = isZeroBaseline ? 0 : activeTickets.filter((t) => t.status === "Blocked").length;
  const resolvedCount = isZeroBaseline ? 0 : activeTickets.filter((t) => t.status === "Resolved").length;

  return (
    <DepartmentGuard requiredRole="engineering">
      <div className="min-h-screen bg-[#F7F5F3] text-[#37322F]">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#252220] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium border border-[#4a4643]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 text-stone-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Top Header */}
        <header className="w-full bg-[#F7F5F3] border-b border-[#e0dedb] px-6 lg:px-10 py-3 flex flex-wrap items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-opacity-95 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-[#828387] hover:text-[#37322F] transition-all">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Select Workspace</span>
            </Link>
            <div className="h-4 w-px bg-[#d8d5d0]" />
            <div className="flex items-center gap-2">
              <PBLogo size="sm" showText={false} />
              <div>
                <span className="font-extrabold text-sm text-[#37322F] tracking-tight">Engineering Backlog</span>
                <span className="ml-2 text-[10px] font-mono px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold border border-purple-200">
                  Staff Engineer [Engineering]
                </span>
              </div>
            </div>
          </div>

          {/* Action Controls & Auth */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBaselineZero}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                isZeroBaseline
                  ? "bg-[#37322F] text-white border-[#37322F]"
                  : "bg-white text-[#37322F] border-[#d8d5d0] hover:bg-[#eae7e3]"
              }`}
            >
              0 Baseline
            </button>
            <button
              onClick={handleLoadDemoData}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                !isZeroBaseline
                  ? "bg-[#37322F] text-white border-[#37322F]"
                  : "bg-white text-[#37322F] border-[#d8d5d0] hover:bg-[#eae7e3]"
              }`}
            >
              Demo Data
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg border border-[#d8d5d0] bg-white text-[#605a57] hover:bg-[#f0ede9] text-xs font-medium"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-1.5 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create / Import</span>
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-[#d8d5d0] ml-1">
              <div className="flex items-center gap-1.5 text-xs text-[#37322F]">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs border border-purple-200">
                  {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "ENG"}
                </div>
                <span className="font-semibold hidden sm:inline">{currentUser?.name || "Staff Engineer"}</span>
              </div>
              <button
                onClick={() => {
                  logoutUser();
                  router.push("/sign-in?role=engineering");
                }}
                title="Sign Out"
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
              <Show when="signed-in">
                <UserButton fallbackRedirectUrl="/" />
              </Show>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="w-full px-6 lg:px-10 py-8 space-y-8">
          {/* Top KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                OPEN QUEUE
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{openCount}</span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                IN PROGRESS
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{inProgressCount}</span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                BLOCKED
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{blockedCount}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                    blockedCount === 0
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-rose-700 bg-rose-50 border-rose-200"
                  }`}
                >
                  {blockedCount === 0 ? "✓ 0 Blockers" : "Requires Unblocking"}
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                RESOLVED TODAY
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{resolvedCount}</span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Average Resolution Time
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">
                  {isZeroBaseline ? "0.0h" : "18.4h"}
                </span>
              </div>
            </div>
          </div>

          {/* Main Table Section */}
          <section className="bg-white border border-[#e0dedb] rounded-xl shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#e0dedb] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-[#37322F] flex items-center gap-2">
                  <Code className="w-4 h-4 text-purple-600" />
                  <span>Engineering Technical Backlog Queue</span>
                </h2>
                <p className="text-xs text-[#828387] mt-0.5">
                  Technical exception trace logs, owner assignment, and real-time incident resolution workflow.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#828387] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search ticket / stack trace..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] w-44 focus:outline-none"
                  />
                </div>

                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] font-medium"
                >
                  <option value="All">All Products</option>
                  <option value="Product A (Core Platform)">Product A (Core Platform)</option>
                  <option value="Product B (Analytics Hub)">Product B (Analytics Hub)</option>
                  <option value="Product C (Integrations API)">Product C (Integrations API)</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-3.5 py-1.5 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220] flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Incident</span>
                </button>
              </div>
            </div>

            {isZeroBaseline || filteredTickets.length === 0 ? (
              <div className="text-center py-16 px-4 bg-[#faf8f6] space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[#37322F]">Engineering Backlog Queue Clear (0 Baseline)</h3>
                <p className="text-xs text-[#828387] max-w-md mx-auto">
                  No pending engineering incidents in queue. Click "Demo Data" to restore screenshot backlog tickets.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F6] border-b border-[#e0dedb] text-[#828387] uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-6">TICKET #</th>
                      <th className="py-3 px-4">CUSTOMER ACCOUNT</th>
                      <th className="py-3 px-6">INCIDENT DETAILS & TECHNICAL LOGS</th>
                      <th className="py-3 px-4">ASSIGNED ENGINEER</th>
                      <th className="py-3 px-4">PRIORITY</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede9]">
                    {filteredTickets.map((t) => (
                      <tr key={t.ticketNumber} className="hover:bg-[#FAF8F6] transition-colors">
                        <td className="py-4 px-6 font-mono font-extrabold text-sm text-[#37322F]">
                          {t.ticketNumber}
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-extrabold text-sm text-[#37322F]">{t.customerName}</div>
                          <div className="font-mono text-xs text-emerald-700 font-bold mt-0.5">
                            ${t.customerArr.toLocaleString()} ARR
                          </div>
                        </td>

                        <td className="py-4 px-6 max-w-md space-y-2">
                          <div className="font-extrabold text-sm text-[#37322F]">{t.title}</div>

                          {/* Interactive Terminal Code Block */}
                          <div
                            onClick={() => setInspectingTicket(t)}
                            className="bg-[#1C1917] text-[#E7E5E4] p-3 rounded-lg font-mono text-[11px] border border-[#292524] shadow-inner space-y-1 cursor-pointer hover:border-amber-400 transition-all group"
                          >
                            <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold border-b border-[#292524] pb-1 mb-1">
                              <span className="flex items-center gap-1.5">
                                <Terminal className="w-3 h-3 text-emerald-400" />
                                <span>STACK TRACE LOG</span>
                              </span>
                              <span className="text-stone-400 group-hover:text-amber-300 transition-colors">
                                Inspect Details 🔍
                              </span>
                            </div>
                            <div className="break-all leading-relaxed text-amber-200 truncate">
                              {t.stackTrace.split("\n")[0]}
                            </div>
                          </div>

                          {t.resolutionNote && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-lg text-[11px]">
                              <span className="font-bold text-emerald-800">Fix Note: </span>
                              {t.resolutionNote}
                            </div>
                          )}

                          {t.blockerReason && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2 rounded-lg text-[10px]">
                              <span className="font-bold text-rose-700">Blocker Reason: </span>
                              {t.blockerReason}
                            </div>
                          )}
                        </td>

                        {/* Assigned Engineer Selector */}
                        <td className="py-4 px-4">
                          <select
                            value={t.assignedEngineer}
                            onChange={(e) => handleAssignEngineer(t.ticketNumber, e.target.value)}
                            className="text-xs p-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] font-semibold"
                          >
                            <option value="Alex Rivera (Staff Eng)">Alex Rivera (Staff Eng)</option>
                            <option value="David Kim (Backend Eng)">David Kim (Backend Eng)</option>
                            <option value="Sarah Jenkins (Lead Eng)">Sarah Jenkins (Lead Eng)</option>
                          </select>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 text-[11px] font-extrabold rounded border ${
                              t.priority === "Critical"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : t.priority === "High"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-stone-100 text-stone-700 border-stone-200"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 text-[11px] font-extrabold rounded border ${
                              t.status === "Resolved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : t.status === "In Progress"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : t.status === "Blocked"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right space-x-1.5">
                          {t.status === "Open" && (
                            <button
                              onClick={() => handleStartWork(t.ticketNumber)}
                              className="px-2.5 py-1.5 bg-white border border-[#d8d5d0] text-[#37322F] text-xs font-bold rounded-lg hover:bg-[#eae7e3] shadow-xs inline-flex items-center gap-1"
                            >
                              <Play className="w-3 h-3 text-stone-600 fill-stone-600" />
                              <span>Start Work</span>
                            </button>
                          )}

                          {t.status !== "Resolved" && (
                            <button
                              onClick={() => handleToggleBlock(t.ticketNumber)}
                              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border shadow-xs inline-flex items-center gap-1 ${
                                t.status === "Blocked"
                                  ? "bg-white text-stone-700 border-[#d8d5d0] hover:bg-stone-100"
                                  : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                              }`}
                            >
                              <Ban className="w-3 h-3" />
                              <span>{t.status === "Blocked" ? "Unblock" : "Block"}</span>
                            </button>
                          )}

                          {t.status !== "Resolved" && (
                            <button
                              onClick={() => setResolvingTicket(t)}
                              className="px-2.5 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 shadow-xs inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark Resolved</span>
                            </button>
                          )}

                          {t.status === "Resolved" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>✓ Resolved</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>

        {/* Stack Trace Inspector Modal */}
        {inspectingTicket && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-[#1C1917] text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#292524] space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-[#292524] pb-3">
                <div>
                  <span className="font-mono text-xs font-extrabold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700">
                    {inspectingTicket.ticketNumber} • {inspectingTicket.customerName} (${inspectingTicket.customerArr.toLocaleString()} ARR)
                  </span>
                  <h3 className="font-extrabold text-lg text-white mt-1">{inspectingTicket.title}</h3>
                </div>
                <button
                  onClick={() => setInspectingTicket(null)}
                  className="text-stone-400 hover:text-white text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 font-bold">
                    Full Exception Stack Trace
                  </div>
                  <pre className="bg-black/80 text-amber-200 p-4 rounded-xl border border-[#292524] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {inspectingTicket.stackTrace}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#292524] p-3 rounded-xl border border-[#37322F]">
                    <div className="text-[10px] text-stone-400 uppercase font-bold">Git Fix Branch</div>
                    <div className="text-emerald-400 font-bold mt-1 text-xs truncate">
                      {inspectingTicket.gitBranch}
                    </div>
                  </div>

                  <div className="bg-[#292524] p-3 rounded-xl border border-[#37322F]">
                    <div className="text-[10px] text-stone-400 uppercase font-bold">Assigned Lead</div>
                    <div className="text-white font-bold mt-1 text-xs truncate">
                      {inspectingTicket.assignedEngineer}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#292524] flex justify-between items-center">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`git checkout -b ${inspectingTicket.gitBranch}`);
                    showToast("✓ Copied git checkout command to clipboard!");
                  }}
                  className="px-3.5 py-2 bg-[#292524] hover:bg-[#37322F] text-amber-300 font-mono text-xs font-bold rounded-lg border border-[#37322F] flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Git Branch Cmd</span>
                </button>

                <button
                  onClick={() => setInspectingTicket(null)}
                  className="px-4 py-2 bg-white text-stone-900 font-extrabold text-xs rounded-lg hover:bg-stone-200"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mark Resolved Modal */}
        {resolvingTicket && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e0dedb] space-y-4">
              <div className="flex justify-between items-center border-b border-[#e0dedb] pb-3">
                <div>
                  <h3 className="font-bold text-base text-[#37322F]">Resolve {resolvingTicket.ticketNumber}</h3>
                  <span className="text-xs text-[#828387]">{resolvingTicket.title}</span>
                </div>
                <button onClick={() => setResolvingTicket(null)} className="text-stone-400 hover:text-stone-800 text-lg">
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#828387] mb-1">
                    Engineering Fix & Resolution Note
                  </label>
                  <textarea
                    rows={3}
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="e.g. Scaled database connection pool and updated query timeout limits to 120s."
                    className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-[#faf8f6] text-[#37322F]"
                  />
                </div>
                <div className="bg-purple-50 border border-purple-200 text-purple-900 p-3 rounded-xl text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>
                    The platform automatically synthesizes a customer-facing briefing note for the Sales team upon resolution.
                  </span>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setResolvingTicket(null)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResolveTicket}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>{isProcessing ? "Synthesizing..." : "Confirm & Resolve"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Incident Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e0dedb] space-y-4">
              <div className="flex justify-between items-center border-b border-[#e0dedb] pb-3">
                <h3 className="font-bold text-base text-[#37322F]">Log Engineering Incident</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-800 text-lg">
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreateIncident} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#828387] mb-1">Customer Account</label>
                  <input
                    type="text"
                    required
                    value={newTicketForm.customerName}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, customerName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#828387] mb-1">Incident Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rate limiter bottleneck on API gateway"
                    value={newTicketForm.title}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, title: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#828387] mb-1">Technical Stack Trace / Log</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. 502 Bad Gateway: Upstream rate limiter overflow"
                    value={newTicketForm.stackTrace}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, stackTrace: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] font-mono"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220]"
                  >
                    Log Incident
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DepartmentGuard>
  );
}
