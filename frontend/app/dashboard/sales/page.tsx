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
  Download,
  TrendingUp,
  ArrowLeft,
  Search,
  Lock,
  LogOut,
  Calendar,
  Send,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import DepartmentGuard from "@/components/DepartmentGuard";
import PBLogo from "@/components/PBLogo";
import { getCurrentUser, logoutUser, UserProfile } from "@/lib/authHelper";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

interface AccountRadarItem {
  id: string;
  name: string;
  arr: number;
  owner: string;
  reachVelocity: number;
  reachTrend: string;
  engagements: number;
  engagementsTrend: string;
  engagementRate: number;
  rateTrend: string;
  status: "Active Issue" | "Stable" | "Resolved";
  issueTitle?: string;
  aiBriefing?: string;
  sparklineData: number[];
}

const defaultAccountItems: AccountRadarItem[] = [
  {
    id: "cust-1",
    name: "Acme Corp",
    arr: 420000,
    owner: "Sarah Jenkins",
    reachVelocity: 31,
    reachTrend: "+33%",
    engagements: 181,
    engagementsTrend: "+115%",
    engagementRate: 69,
    rateTrend: "+60%",
    status: "Active Issue",
    issueTitle: "High priority export performance error (QueryTimeoutException)",
    sparklineData: [12, 15, 18, 22, 25, 31]
  },
  {
    id: "cust-3",
    name: "Beta Inc",
    arr: 180000,
    owner: "Elena Rostova",
    reachVelocity: 14,
    reachTrend: "-12%",
    engagements: 85,
    engagementsTrend: "+5%",
    engagementRate: 42,
    rateTrend: "+2%",
    status: "Active Issue",
    issueTitle: "SSO authentication handshake timeout [408]",
    sparklineData: [20, 18, 16, 15, 14, 14]
  },
  {
    id: "cust-2",
    name: "Gamma Ltd",
    arr: 750000,
    owner: "Michael Chang",
    reachVelocity: 45,
    reachTrend: "+40%",
    engagements: 320,
    engagementsTrend: "+210%",
    engagementRate: 88,
    rateTrend: "+85%",
    status: "Stable",
    aiBriefing:
      "The API Gateway query timeout affecting your analytics export was resolved today by scaling our upstream database pool. Normal export speed (< 400ms) has been fully restored.",
    sparklineData: [25, 28, 35, 38, 42, 45]
  },
  {
    id: "cust-4",
    name: "Delta Global",
    arr: 520000,
    owner: "David Kim",
    reachVelocity: 22,
    reachTrend: "+15%",
    engagements: 140,
    engagementsTrend: "+45%",
    engagementRate: 55,
    rateTrend: "+20%",
    status: "Active Issue",
    issueTitle: "FATAL ERROR: JavaScript heap out of memory",
    sparklineData: [15, 16, 18, 20, 21, 22]
  },
  {
    id: "cust-5",
    name: "Epsilon Tech",
    arr: 310000,
    owner: "Sarah Jenkins",
    reachVelocity: 18,
    reachTrend: "+8%",
    engagements: 95,
    engagementsTrend: "+12%",
    engagementRate: 48,
    rateTrend: "+10%",
    status: "Active Issue",
    issueTitle: "LongTaskwarning: script execution took 11840ms on renderCanvas()",
    sparklineData: [14, 15, 15, 16, 17, 18]
  }
];

export default function SalesRadarPage() {
  const router = useRouter();
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isZeroBaseline, setIsZeroBaseline] = useState(false);

  // Active filter tab: "all", "at-risk", "resolved"
  const [activeTab, setActiveTab] = useState<"all" | "at-risk" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Log Ticket Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    customer_name: "Acme Corp",
    arr: "420000",
    title: "",
    description: "",
    priority: "High"
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    setCurrentUserState(getCurrentUser());
  }, []);

  const handleBaselineZero = async () => {
    setIsZeroBaseline(true);
    showToast("Reset Sales Radar to 0 Baseline.");
    try {
      await axios.post(`${API_BASE}/dashboards/reset-to-zero`);
    } catch {
      // client-side toggle fallback
    }
  };

  const handleLoadDemoData = async () => {
    setIsZeroBaseline(false);
    showToast("Loaded full Enterprise Sales Radar demo data.");
    try {
      await axios.get(`${API_BASE}/dashboards/sales`);
    } catch {
      // client-side toggle fallback
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast("Sales & CS Radar metrics refreshed!");
    }, 600);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.title) return;
    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE}/tickets/create`, ticketForm).catch(() => null);
      showToast("✓ Escalation ticket logged for account!");
      setShowCreateModal(false);
      setTicketForm({
        customer_name: "Acme Corp",
        arr: "420000",
        title: "",
        description: "",
        priority: "High"
      });
      setIsZeroBaseline(false);
    } catch {
      showToast("Escalation logged.");
      setShowCreateModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // CSV Export
  const exportCsv = () => {
    const headers = [
      "Account Name",
      "Contract ARR",
      "Reach Velocity",
      "Engagements",
      "Engagement Rate",
      "Status",
      "Details / AI Summary"
    ];

    const rows = (isZeroBaseline ? [] : defaultAccountItems).map((acc) => [
      `"${acc.name}"`,
      acc.arr,
      acc.reachVelocity,
      acc.engagements,
      `${acc.engagementRate}%`,
      acc.status,
      `"${(acc.aiBriefing || acc.issueTitle || "").replace(/"/g, '""')}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ProductBrain_Sales_Radar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Exported Sales Radar CSV successfully!");
  };

  const filteredItems = useMemo(() => {
    if (isZeroBaseline) return [];

    return defaultAccountItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.issueTitle || "").toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "at-risk") return item.status === "Active Issue";
      if (activeTab === "resolved") return item.status === "Stable" || item.status === "Resolved";
      return true;
    });
  }, [isZeroBaseline, activeTab, searchQuery]);

  // Calculated metrics based on baseline state
  const atRiskCount = isZeroBaseline ? 0 : defaultAccountItems.filter((i) => i.status === "Active Issue").length;
  const resolvedCount = isZeroBaseline ? 0 : defaultAccountItems.filter((i) => i.status === "Stable").length;
  const totalArrExposed = isZeroBaseline
    ? 0
    : defaultAccountItems
        .filter((i) => i.status === "Active Issue")
        .reduce((sum, item) => sum + item.arr, 0);

  // Sparkline renderer
  const renderSparkline = (data: number[], isUp: boolean) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * 50;
        const y = 18 - ((val - min) / (max - min || 1)) * 14;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg className="w-14 h-5 inline-block overflow-visible" viewBox="0 0 50 20">
        <polyline
          fill="none"
          stroke={isUp ? "#10B981" : "#F43F5E"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <DepartmentGuard requiredRole="sales">
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
                <span className="font-extrabold text-sm text-[#37322F] tracking-tight">Sales & CS Radar</span>
                <span className="ml-2 text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold border border-emerald-200">
                  Enterprise User [Sales]
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
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-200">
                  {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "SL"}
                </div>
                <span className="font-semibold hidden sm:inline">{currentUser?.name || "Enterprise Sales"}</span>
              </div>
              <button
                onClick={() => {
                  logoutUser();
                  router.push("/sign-in?role=sales");
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

        {/* Sub-Header Filter Bar */}
        <div className="w-full bg-[#F2EFEA] border-b border-[#e0dedb] px-6 lg:px-10 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "all"
                  ? "bg-white text-[#37322F] shadow-xs border border-[#d8d5d0]"
                  : "text-[#828387] hover:text-[#37322F]"
              }`}
            >
              All Accounts ({isZeroBaseline ? 0 : 5})
            </button>
            <button
              onClick={() => setActiveTab("at-risk")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "at-risk"
                  ? "bg-white text-[#37322F] shadow-xs border border-[#d8d5d0]"
                  : "text-[#828387] hover:text-[#37322F]"
              }`}
            >
              At-Risk Radar ({atRiskCount})
            </button>
            <button
              onClick={() => setActiveTab("resolved")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "resolved"
                  ? "bg-white text-[#37322F] shadow-xs border border-[#d8d5d0]"
                  : "text-[#828387] hover:text-[#37322F]"
              }`}
            >
              Resolved Updates ({resolvedCount})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#828387] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] w-44 focus:outline-none"
              />
            </div>

            <button
              onClick={exportCsv}
              className="px-3.5 py-1.5 bg-white border border-[#d8d5d0] text-[#37322F] text-xs font-semibold rounded-lg hover:bg-[#eae7e3] flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>⤓ Export to CSV</span>
            </button>

            <button className="px-3.5 py-1.5 bg-white border border-[#d8d5d0] text-[#37322F] text-xs font-semibold rounded-lg hover:bg-[#eae7e3] flex items-center gap-1.5 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-stone-600" />
              <span>Current Year 📅</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="w-full px-6 lg:px-10 py-8 space-y-8">
          {/* Top KPI Cards Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Accounts with Escalations
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{atRiskCount}</span>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {isZeroBaseline ? "0% of portfolio" : "80% of portfolio"}
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Open Support Complaints
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{atRiskCount}</span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Active Queue
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Total ARR Exposed
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">
                  ${totalArrExposed.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {atRiskCount} Accounts
                </span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                AI Customer Updates Ready
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{resolvedCount}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready to send
                </span>
              </div>
            </div>
          </div>

          {/* Main Radar Table Section */}
          <section className="bg-white border border-[#e0dedb] rounded-xl shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#e0dedb] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-[#37322F] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Enterprise Accounts Activity & Churn Radar</span>
                </h2>
                <p className="text-xs text-[#828387] mt-0.5">
                  Automated customer resolution briefings synthesized directly from engineering bug fixes.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-3.5 py-1.5 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220] flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log New Escalation</span>
              </button>
            </div>

            {isZeroBaseline || filteredItems.length === 0 ? (
              <div className="text-center py-16 px-4 bg-[#faf8f6] space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[#37322F]">Zero Customer Escalations (0 Baseline)</h3>
                <p className="text-xs text-[#828387] max-w-md mx-auto">
                  No account escalations currently present. Click "Demo Data" above to view active enterprise account radar telemetry.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F6] border-b border-[#e0dedb] text-[#828387] uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-6">ACCOUNT / CUSTOMER</th>
                      <th className="py-3 px-4">CONTRACT ARR</th>
                      <th className="py-3 px-4">REACH VELOCITY (SPARKLINE)</th>
                      <th className="py-3 px-4">ENGAGEMENTS</th>
                      <th className="py-3 px-4">ENGAGEMENT RATE</th>
                      <th className="py-3 px-6">CUSTOMER RESOLUTION BRIEFING</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede9]">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF8F6] transition-colors">
                        {/* Account */}
                        <td className="py-4 px-6">
                          <div className="font-extrabold text-sm text-[#37322F]">{item.name}</div>
                          <div className="text-[11px] text-[#828387] mt-0.5">Owner: {item.owner}</div>
                        </td>

                        {/* Contract ARR */}
                        <td className="py-4 px-4 font-mono font-bold text-sm text-[#37322F]">
                          ${item.arr.toLocaleString()}
                        </td>

                        {/* Reach Velocity Sparkline */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {renderSparkline(item.sparklineData, item.reachTrend.startsWith("+"))}
                            <span className="font-extrabold text-[#37322F]">{item.reachVelocity}</span>
                            <span
                              className={`text-[10px] font-bold ${
                                item.reachTrend.startsWith("+") ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {item.reachTrend}
                            </span>
                          </div>
                        </td>

                        {/* Engagements */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[#37322F]">{item.engagements}</span>
                            <span className="text-[10px] font-bold text-emerald-600">{item.engagementsTrend}</span>
                          </div>
                        </td>

                        {/* Engagement Rate */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[#37322F]">{item.engagementRate}%</span>
                            <span className="text-[10px] font-bold text-emerald-600">{item.rateTrend}</span>
                          </div>
                        </td>

                        {/* Customer Resolution Briefing */}
                        <td className="py-4 px-6 max-w-md">
                          {item.status === "Active Issue" ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>⚠ Active Issue</span>
                              </span>
                              <p className="text-[11px] text-[#605a57] font-medium leading-relaxed mt-1">
                                {item.issueTitle}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>✓ Stable</span>
                              </span>

                              {item.aiBriefing && (
                                <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-3.5 text-emerald-950 space-y-2">
                                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>✨ READY TO SEND TO CUSTOMER</span>
                                  </div>
                                  <p className="text-xs leading-relaxed text-emerald-900 font-medium">
                                    "{item.aiBriefing}"
                                  </p>
                                  <button
                                    onClick={() =>
                                      showToast(`✓ Client update briefing sent to ${item.name} account executive!`)
                                    }
                                    className="px-3 py-1.5 bg-emerald-700 text-white font-bold text-[11px] rounded-lg hover:bg-emerald-800 flex items-center gap-1.5 shadow-xs transition-colors"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>Send Update to Account</span>
                                  </button>
                                </div>
                              )}
                            </div>
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

        {/* Create / Import Escalation Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e0dedb] space-y-4">
              <div className="flex justify-between items-center border-b border-[#e0dedb] pb-3">
                <h3 className="font-bold text-base text-[#37322F]">Log Account Escalation</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-800 text-lg">
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreateTicket} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#828387] mb-1">Customer Account</label>
                  <input
                    type="text"
                    required
                    value={ticketForm.customer_name}
                    onChange={(e) => setTicketForm({ ...ticketForm, customer_name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#828387] mb-1">Contract ARR ($)</label>
                  <input
                    type="number"
                    required
                    value={ticketForm.arr}
                    onChange={(e) => setTicketForm({ ...ticketForm, arr: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#828387] mb-1">Escalation Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Export timeout affecting quarterly filing"
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#828387] mb-1">Description & Details</label>
                  <textarea
                    rows={3}
                    placeholder="Escalation details..."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
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
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220]"
                  >
                    {isSubmitting ? "Logging..." : "Log Escalation"}
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
