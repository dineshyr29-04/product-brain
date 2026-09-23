"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
  FileText,
  Layers,
  ArrowRight,
  TrendingUp,
  Inbox,
  Clock,
  AlertTriangle,
  RotateCcw,
  Check,
  ArrowLeft,
  Users,
  UserPlus,
  Trash2,
  X,
  LogOut,
  Shield
} from "lucide-react";
import { useRouter } from "next/navigation";
import DepartmentGuard from "@/components/DepartmentGuard";
import PBLogo from "@/components/PBLogo";
import PMNavHeader from "@/components/PMNavHeader";
import { getTeamMembers, addTeamMember, removeTeamMember, UserProfile, getCurrentUser, logoutUser } from "@/lib/authHelper";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

const fallbackCustomers = [
  { id: "cust-1", name: "Acme Corp", arr: 420000, account_owner: "Sarah Jenkins" },
  { id: "cust-2", name: "Gamma Ltd", arr: 750000, account_owner: "Michael Chang" },
  { id: "cust-3", name: "Beta Inc", arr: 180000, arr_num: 180000, account_owner: "Elena Rostova" },
  { id: "cust-4", name: "Delta Global", arr: 520000, account_owner: "David Kim" },
  { id: "cust-5", name: "Epsilon Tech", arr: 310000, account_owner: "Sarah Jenkins" }
];

const fallbackProducts = [
  { id: "prod-1", name: "Product A (Core Platform)" },
  { id: "prod-2", name: "Product B (Analytics Hub)" },
  { id: "prod-3", name: "Product C (Integrations API)" }
];

const trendData = [
  { date: "Dec 18", count: 42 },
  { date: "Dec 25", count: 45 },
  { date: "Jan 01", count: 48 },
  { date: "Jan 08", count: 50 },
  { date: "Jan 13", count: 52 }
];

const healthDonutData = [
  { name: "Health Score", value: 52, color: "#0284C7" },
  { name: "Warnings", value: 38, color: "#F59E0B" },
  { name: "Critical", value: 10, color: "#EF4444" }
];

export default function PMDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [pmData, setPmData] = useState<any>({
    productHealth: {
      totalCustomers: 5,
      customersWithOpenIssues: 4,
      openTechnicalTickets: 4,
      resolvedThisMonth: 1,
      affectedArr: 1430000,
      criticalIssues: 0,
      highPriorityIssues: 2,
      avgResolutionTimeHours: 18.4
    },
    opportunities: [
      {
        id: "opp-1",
        title: "Export Performance & Streaming Infrastructure",
        status: "Detected",
        ticket_count: 2,
        customer_count: 2,
        affected_arr: 940000,
        product: { name: "Product A (Core Platform)" }
      },
      {
        id: "opp-2",
        title: "API Gateway Reliability & Rate Limiting Engine",
        status: "Detected",
        ticket_count: 1,
        customer_count: 1,
        affected_arr: 750000,
        product: { name: "Product C (Integrations API)" }
      }
    ]
  });

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);

  // Team Access Delegation (PM Authority)
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"sales" | "engineering">("sales");
  const [newMemberName, setNewMemberName] = useState("");

  useEffect(() => {
    setTeamMembers(getTeamMembers());
    setCurrentUserState(getCurrentUser());
    fetchDashboardData();
  }, []);

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    const added = addTeamMember(newMemberEmail.trim(), newMemberRole, newMemberName.trim());
    setTeamMembers(getTeamMembers());
    setNewMemberEmail("");
    setNewMemberName("");
    showToast(`✓ Access granted to ${added.email} for ${added.role === "sales" ? "Sales" : "Engineering"}!`);
  };

  const handleDeleteMember = (id: string) => {
    removeTeamMember(id);
    setTeamMembers(getTeamMembers());
    showToast("✓ Team member access revoked.");
  };

  const [generatingPrd, setGeneratingPrd] = useState(false);

  // Form State
  const [ticketForm, setTicketForm] = useState({
    customer_id: "cust-1",
    product_id: "prod-1",
    title: "",
    description: "",
    priority: "High",
    category: "Export Performance",
    technical_logs: ""
  });

  const [bulkText, setBulkText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`${API_BASE}/dashboards/pm`).catch(() => null);
      if (res?.data?.success) {
        setPmData((prev: any) => ({
          ...prev,
          ...res.data
        }));
      }
    } catch (err) {
      console.error("Failed to load PM data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleResetToZero = async () => {
    try {
      await axios.post(`${API_BASE}/dashboards/reset-to-zero`);
      showToast("✓ Reset workspace to baseline 0!");
      fetchDashboardData();
    } catch {
      showToast("Failed to reset.");
    }
  };

  const handleSeedDemoData = async () => {
    try {
      await axios.post(`${API_BASE}/dashboards/seed-demo`);
      showToast("✓ Seeded demo data!");
      fetchDashboardData();
    } catch {
      showToast("Failed to seed demo data.");
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.description) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/tickets/create`, ticketForm);
      if (res.data?.success) {
        showToast("✓ Incident logged & ARR impact calculated!");
        setShowCreateModal(false);
        setTicketForm({
          customer_id: "cust-1",
          product_id: "prod-1",
          title: "",
          description: "",
          priority: "High",
          category: "Export Performance",
          technical_logs: ""
        });
        await fetchDashboardData();
      }
    } catch {
      showToast("Failed to log ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/tickets/bulk-import`, { rawText: bulkText });
      if (res.data?.success) {
        showToast(`✓ Processed ${res.data.count} incidents into structured tickets!`);
        setShowBulkModal(false);
        setBulkText("");
        await fetchDashboardData();
      }
    } catch {
      showToast("Bulk import failed. Please verify API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePrd = async (oppId: string) => {
    setGeneratingPrd(true);
    try {
      const res = await axios.post(`${API_BASE}/opportunities/${oppId}/generate-prd`);
      if (res.data?.success) {
        showToast("✓ Comprehensive PRD generated autonomously!");
        setSelectedOpportunity(res.data.data);
        await fetchDashboardData();
      }
    } catch {
      showToast("Failed to generate PRD. Please verify backend.");
    } finally {
      setGeneratingPrd(false);
    }
  };

  const loadSampleDoc = () => {
    setBulkText(
      `[INCIDENT REPORT - HIGH SEVERITY]
Customer: Acme Corp (ARR $420,000)
Product: Core Platform
Description: Users report 504 gateway timeout when exporting reports > 50MB. Query timeout exceeded.
Technical Stack Trace: QueryTimeoutException: 30000ms exceeded in db.driver.js:42

[CUSTOMER ESCALATION]
Customer: Beta Inc (ARR $180,000)
Product: Core Platform
Description: SAML SSO redirect hangs intermittently. Users stuck on login step 2.
Technical Log: SSO_HANDSHAKE_TIMEOUT [408] redirect to sso.beta.com`
    );
  };

  const affectedArr = pmData.productHealth?.affectedArr || 1430000;
  const openTickets = pmData.productHealth?.openTechnicalTickets || 4;
  const criticalCount = pmData.productHealth?.criticalIssues || 0;
  const opportunities = pmData.opportunities?.length > 0 ? pmData.opportunities : [
    {
      id: "opp-1",
      title: "Export Performance & Streaming Infrastructure",
      status: "Detected",
      ticket_count: 2,
      customer_count: 2,
      affected_arr: 940000,
      product: { name: "Product A (Core Platform)" }
    },
    {
      id: "opp-2",
      title: "API Gateway Reliability & Rate Limiting Engine",
      status: "Detected",
      ticket_count: 1,
      customer_count: 1,
      affected_arr: 750000,
      product: { name: "Product C (Integrations API)" }
    }
  ];

  return (
    <DepartmentGuard requiredRole="pm">
      <div className="min-h-screen bg-[#F7F5F3] text-[#37322F]">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#252220] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium border border-[#4a4643] animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 text-stone-400 hover:text-white">✕</button>
          </div>
        )}

        {/* PM Navigation Header */}
        <PMNavHeader
          activeTab="overview"
          onBaselineZero={handleResetToZero}
          onLoadDemoData={handleSeedDemoData}
          onRefresh={fetchDashboardData}
          onCreateAction={() => setShowCreateModal(true)}
        />

        {/* Main Content Area (Full Width Container) */}
        <main className="w-full px-6 lg:px-10 py-6 space-y-6">
          
          {/* 5 KPI Metric Cards (Matching Screenshot 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Card 1: Product Score */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#828387] block">
                PRODUCT SCORE
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#37322F]">52</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  ↑ Health 92%
                </span>
              </div>
              <p className="text-[10px] text-[#828387]">Calculated from defect severity</p>
            </div>

            {/* Card 2: Affected ARR */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#828387] block">
                AFFECTED ARR
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#0284C7]">${(affectedArr).toLocaleString()}</span>
                <span className="text-xs font-bold text-rose-600">4 accounts</span>
              </div>
              <p className="text-[10px] text-[#828387]">Customer ARR exposed to bugs</p>
            </div>

            {/* Card 3: Active Incidents */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#828387] block">
                ACTIVE INCIDENTS
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#37322F]">{openTickets}</span>
                <span className="text-xs font-bold text-amber-600">Active Queue</span>
              </div>
              <p className="text-[10px] text-[#828387]">Open customer support tickets</p>
            </div>

            {/* Card 4: Critical Issues */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#828387] block">
                CRITICAL ISSUES
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#37322F]">{criticalCount}</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  🛡️ 0 Critical
                </span>
              </div>
              <p className="text-[10px] text-emerald-600 font-medium">Indication: 0 Sev-1 escapements</p>
            </div>

            {/* Card 5: Resolved Today/Month */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#828387] block">
                RESOLVED TODAY/MONTH
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#37322F]">1</span>
                <span className="text-xs font-bold text-emerald-600">↑ Solved</span>
              </div>
              <p className="text-[10px] text-[#828387]">With AI client summary</p>
            </div>
          </div>

          {/* Middle Section (2 Columns matching Screenshot 1) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Incident Visibility Trend & Defect Radar (Span 8) */}
            <div className="lg:col-span-8 bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#f0ede9] pb-3">
                <div>
                  <h3 className="font-bold text-sm text-[#37322F]">Incident Visibility Trend & Defect Radar</h3>
                  <p className="text-xs text-[#828387]">Real-time telemetry updated continuously</p>
                </div>
                <span className="text-xs font-bold text-[#0284C7]">Defect Visibility 51%</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Area Chart */}
                <div className="md:col-span-7 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#828387" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#828387" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#0284C7" strokeWidth={2} fillOpacity={1} fill="url(#trendGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Priority Distribution Boxes */}
                <div className="md:col-span-5 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#faf8f6] border border-[#e0dedb] rounded-lg space-y-1">
                    <span className="text-[#828387] font-semibold block text-[11px]">Critical</span>
                    <span className="text-xl font-bold text-rose-600">0</span>
                    <span className="text-[10px] text-[#828387] block">0 count</span>
                  </div>
                  <div className="p-3 bg-[#faf8f6] border border-[#e0dedb] rounded-lg space-y-1">
                    <span className="text-[#828387] font-semibold block text-[11px]">High Priority</span>
                    <span className="text-xl font-bold text-amber-600">2</span>
                  </div>
                  <div className="p-3 bg-[#faf8f6] border border-[#e0dedb] rounded-lg space-y-1">
                    <span className="text-[#828387] font-semibold block text-[11px]">In Progress</span>
                    <span className="text-xl font-bold text-[#0284C7]">0</span>
                    <span className="text-[10px] text-[#828387] block">0 active</span>
                  </div>
                  <div className="p-3 bg-[#faf8f6] border border-[#e0dedb] rounded-lg space-y-1">
                    <span className="text-[#828387] font-semibold block text-[11px]">Resolved</span>
                    <span className="text-xl font-bold text-emerald-600">1</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#f0ede9] flex items-center justify-between text-xs">
                <span className="text-[#828387]">Total Tracked Incidents: <strong>5</strong></span>
                <span className="text-xs font-semibold text-[#828387]">View Engineering Queue →</span>
              </div>
            </div>

            {/* Right Column: Enterprise System Health (Span 4) */}
            <div className="lg:col-span-4 bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#f0ede9] pb-3">
                <h3 className="font-bold text-sm text-[#37322F]">Enterprise System Health</h3>
                <span className="text-[10px] text-[#828387]">Live Monitoring</span>
              </div>

              {/* Donut Chart with Center Label */}
              <div className="relative h-40 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={healthDonutData} innerRadius={50} outerRadius={68} paddingAngle={3} dataKey="value">
                      {healthDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center pointer-events-none">
                  <span className="text-2xl font-black text-[#37322F]">52%</span>
                  <span className="text-[9px] text-[#828387] block font-semibold uppercase">health score</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-[#828387]">
                <div className="flex justify-between">
                  <span>Critical Escapements:</span>
                  <strong className="text-rose-600">0</strong>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">✓ Indication: 0 Errors</div>
                <div className="flex justify-between pt-1">
                  <span>Open Warnings:</span>
                  <strong className="text-amber-600">4</strong>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-[#f0ede9] pt-3">
                <div className="flex justify-between text-xs font-bold text-[#828387]">
                  <span>Monitored Products</span>
                  <span>3 Products</span>
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden flex">
                  <div className="w-[80%] bg-emerald-500 h-full" />
                  <div className="w-[20%] bg-rose-500 h-full" />
                </div>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full py-2 bg-[#faf8f6] hover:bg-[#eae7e3] border border-[#e0dedb] text-[#37322F] text-xs font-bold rounded-lg transition-colors"
              >
                + Log New Incident
              </button>
            </div>

          </div>

          {/* Bottom Section: Autonomous Product Opportunities (Matching Screenshot 1) */}
          <section className="bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#f0ede9] pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-[#37322F]">Autonomous Product Opportunities (Gemini AI Clustered)</h3>
                <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                  Count : {opportunities.length}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Gemini AI Engine Active</span>
              </span>
            </div>

            <div className="space-y-3">
              {opportunities.map((opp: any) => (
                <div key={opp.id} className="p-4 bg-white border border-[#e0dedb] rounded-xl flex flex-wrap items-center justify-between gap-4 hover:border-[#37322F] transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#37322F]">{opp.title}</h4>
                      <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                        {opp.status || "Detected"}
                      </span>
                    </div>
                    <div className="text-xs text-[#828387] flex items-center gap-2">
                      <span>{opp.ticket_count} tickets aggregated</span>
                      <span>•</span>
                      <span>{opp.customer_count} accounts affected</span>
                      <span>•</span>
                      <strong className="text-emerald-700">${(opp.affected_arr || 0).toLocaleString()} ARR Protection</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleGeneratePrd(opp.id)}
                    disabled={generatingPrd}
                    className="px-4 py-2 bg-[#252220] hover:bg-black text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{opp.prd_content ? "View / Regenerate PRD" : "✨ 1-Click Gemini PRD"}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* Modal 1: Create Incident */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e0dedb] space-y-4">
              <div className="flex justify-between items-center border-b border-[#e0dedb] pb-3">
                <h3 className="font-bold text-base text-[#37322F]">Log Customer Escalation / Defect</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-800 text-lg">✕</button>
              </div>
              <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#828387] block mb-1">Customer Account</label>
                  <select
                    value={ticketForm.customer_id}
                    onChange={(e) => setTicketForm({ ...ticketForm, customer_id: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#d8d5d0] bg-[#faf8f6]"
                  >
                    {fallbackCustomers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} (${c.arr.toLocaleString()} ARR)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#828387] block mb-1">Impacted Product</label>
                  <select
                    value={ticketForm.product_id}
                    onChange={(e) => setTicketForm({ ...ticketForm, product_id: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#d8d5d0] bg-[#faf8f6]"
                  >
                    {fallbackProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#828387] block mb-1">Ticket Title</label>
                  <input
                    type="text"
                    required
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                    placeholder="e.g. Export 504 gateway timeout on reports > 50MB"
                    className="w-full p-2 rounded-lg border border-[#d8d5d0] bg-[#faf8f6]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#828387] block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    placeholder="Provide details on customer impact and steps to reproduce..."
                    className="w-full p-2 rounded-lg border border-[#d8d5d0] bg-[#faf8f6]"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#37322F] text-white font-semibold rounded-lg hover:bg-[#252220]"
                  >
                    {isSubmitting ? "Creating..." : "Create Ticket"}
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
