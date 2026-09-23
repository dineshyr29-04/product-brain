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
  {
    name: "Health Score (Resolved)",
    value: 52,
    color: "#0284C7",
    details: [
      {
        ticket: "#1026",
        account: "Gamma Ltd ($750k ARR)",
        title: "Analytics Export Timeout",
        status: "Resolved Today",
        fix: "Scaled database pool & query timeout to 120s"
      }
    ]
  },
  {
    name: "Active Warnings (In Progress & Open Queue)",
    value: 38,
    color: "#F59E0B",
    details: [
      {
        ticket: "#1024",
        account: "Acme Corp ($420k ARR)",
        title: "High Priority Export Timeout",
        status: "In Progress",
        fix: "QueryTimeoutException in db.driver.js:42"
      },
      {
        ticket: "#1025",
        account: "Beta Inc ($180k ARR)",
        title: "SSO Authentication Failure",
        status: "Open Queue",
        fix: "SSO_HANDSHAKE_TIMEOUT [408]"
      },
      {
        ticket: "#1028",
        account: "Epsilon Tech ($310k ARR)",
        title: "Slow Dashboard Render",
        status: "Open Queue",
        fix: "renderCanvas took 11840ms"
      }
    ]
  },
  {
    name: "Critical Risks (Memory & Gateway)",
    value: 10,
    color: "#EF4444",
    details: [
      {
        ticket: "#1027",
        account: "Delta Global ($520k ARR)",
        title: "Memory Leak in Report Generator",
        status: "Open Queue",
        fix: "JavaScript heap out of memory"
      }
    ]
  }
];

// Rich Hover Tooltip Component for Donut Pie Chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1C1917] text-white p-3.5 rounded-xl shadow-2xl border border-[#37322F] text-xs max-w-xs space-y-2.5 z-50">
        <div
          className="flex justify-between items-center border-b border-[#37322F] pb-1.5 font-bold"
          style={{ color: data.color }}
        >
          <span>{data.name}</span>
          <span className="font-mono text-sm bg-stone-800 px-1.5 py-0.5 rounded text-white">{data.value}%</span>
        </div>
        <div className="space-y-2">
          {data.details?.map((d: any, i: number) => (
            <div key={i} className="bg-[#292524] p-2.5 rounded-lg text-[11px] space-y-1">
              <div className="flex justify-between items-center text-amber-300 font-extrabold">
                <span>{d.ticket} • {d.account}</span>
                <span className="text-[9px] bg-stone-700 text-stone-200 px-1.5 py-0.5 rounded font-mono">
                  {d.status}
                </span>
              </div>
              <div className="text-white font-medium truncate">{d.title}</div>
              <div className="text-[10px] text-stone-400 font-mono truncate">{d.fix}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

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

  // Team Access Delegation
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
          <div className="fixed bottom-6 right-6 z-50 bg-[#252220] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium border border-[#4a4643]">
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

        {/* Main Content Area */}
        <main className="w-full px-6 lg:px-10 py-6 space-y-6">
          
          {/* 5 KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Card 1: Product Score */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#828387] block">
                PRODUCT SCORE
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">52</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ↑ Health 92%
                </span>
              </div>
            </div>

            {/* Card 2: Affected ARR */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#828387] block">
                AFFECTED ARR
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">
                  ${(affectedArr || 0).toLocaleString()}
                </span>
              </div>
              <span className="text-xs text-[#828387] font-medium block">4 accounts</span>
            </div>

            {/* Card 3: Active Incidents */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#828387] block">
                ACTIVE INCIDENTS
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{openTickets}</span>
              </div>
              <span className="text-xs text-amber-700 font-semibold block">4 Active Queue</span>
            </div>

            {/* Card 4: Critical Issues */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#828387] block">
                CRITICAL ISSUES
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{criticalCount}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  🛡️ 0 Critical
                </span>
              </div>
            </div>

            {/* Card 5: Resolved Today */}
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#828387] block">
                RESOLVED TODAY/MONTH
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">1</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ↑ 1 Solved
                </span>
              </div>
            </div>
          </div>

          {/* Middle 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column: Defect Visibility Trend & Priority Grid (Span 8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Defect Visibility Area Chart */}
              <div className="bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#f0ede9] pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-[#37322F]">Defect Visibility</h3>
                    <span className="text-xs text-[#828387]">Active Defect Visibility Score</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    51%
                  </span>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#828387" fontSize={11} tickLine={false} />
                      <YAxis stroke="#828387" fontSize={11} tickLine={false} domain={[30, 60]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#0284C7" strokeWidth={2} fillOpacity={1} fill="url(#trendGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 4 Priority Distribution Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-[#e0dedb] rounded-xl p-4 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-[#828387] uppercase tracking-wider block">CRITICAL</span>
                  <span className="text-2xl font-black text-[#37322F]">0</span>
                  <span className="text-[10px] text-emerald-600 block font-medium">✓ 0 Blockers</span>
                </div>
                <div className="bg-white border border-[#e0dedb] rounded-xl p-4 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-[#828387] uppercase tracking-wider block">HIGH</span>
                  <span className="text-2xl font-black text-[#37322F]">2</span>
                  <span className="text-[10px] text-amber-600 block font-medium">Acme / Delta</span>
                </div>
                <div className="bg-white border border-[#e0dedb] rounded-xl p-4 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-[#828387] uppercase tracking-wider block">IN PROGRESS</span>
                  <span className="text-2xl font-black text-[#37322F]">0</span>
                  <span className="text-[10px] text-blue-600 block font-medium">Active Queue</span>
                </div>
                <div className="bg-white border border-[#e0dedb] rounded-xl p-4 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-[#828387] uppercase tracking-wider block">RESOLVED</span>
                  <span className="text-2xl font-black text-[#37322F]">1</span>
                  <span className="text-[10px] text-emerald-600 block font-medium">Gamma Ltd</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#faf8f6] border border-[#e0dedb] p-3 rounded-xl text-xs">
                <span className="text-[#828387]">Autonomous Incident Triaging active across all connected repositories.</span>
                <Link href="/dashboard/engineering" className="text-xs font-semibold text-[#828387] hover:text-[#37322F]">
                  View Engineering Queue →
                </Link>
              </div>
            </div>

            {/* Right Column: Enterprise System Health (Span 4) */}
            <div className="lg:col-span-4 bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#f0ede9] pb-3">
                <h3 className="font-bold text-sm text-[#37322F]">Enterprise System Health</h3>
                <span className="text-[10px] text-[#828387]">Live Monitoring (Hover for Ticket Details)</span>
              </div>

              {/* Donut Chart with Rich Hover Tooltip */}
              <div className="relative h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomPieTooltip />} />
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

          {/* Bottom Section: Autonomous Product Opportunities */}
          <section className="bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#f0ede9] pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-[#37322F]">
                  Autonomous Product Opportunities (Intelligence Clustered)
                </h3>
                <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                  Count : {opportunities.length}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Intelligence Engine Active</span>
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
                    <span>{opp.prd_content ? "View / Regenerate PRD" : "✨ 1-Click PRD Spec"}</span>
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
                    className="w-full p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                  >
                    {fallbackCustomers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (${Number(c.arr || 0).toLocaleString()} ARR)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#828387] block mb-1">Product Area</label>
                  <select
                    value={ticketForm.product_id}
                    onChange={(e) => setTicketForm({ ...ticketForm, product_id: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                  >
                    {fallbackProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#828387] block mb-1">Issue Summary</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Export 504 timeout on large datasets"
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#828387] block mb-1">Customer Escalation Details</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe impact..."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-lg hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#37322F] text-white font-semibold rounded-lg hover:bg-[#252220]"
                  >
                    {isSubmitting ? "Processing..." : "Log Incident"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: View PRD Spec */}
        {selectedOpportunity && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e0dedb] space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-[#e0dedb] pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded uppercase">
                    ✨ Autonomous PRD Specification
                  </span>
                  <h3 className="font-extrabold text-lg text-[#37322F] mt-1">{selectedOpportunity.title}</h3>
                </div>
                <button onClick={() => setSelectedOpportunity(null)} className="text-stone-400 hover:text-stone-800 text-xl font-bold">
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-[#828387] uppercase tracking-wider text-[10px] mb-1">
                    Problem Summary & ARR Risk
                  </h4>
                  <p className="text-[#37322F] bg-[#FAF8F6] p-3 rounded-xl border border-[#e0dedb]">
                    {selectedOpportunity.problem_summary || selectedOpportunity.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#828387] uppercase tracking-wider text-[10px] mb-2">
                    Acceptance Criteria
                  </h4>
                  <div className="bg-emerald-50/60 border border-emerald-200/80 p-3 rounded-xl text-emerald-950 font-mono space-y-1">
                    <div>✓ Query timeout threshold increased to 120,000ms</div>
                    <div>✓ Zero 504 Gateway Timeout errors under 1,000 concurrent user exports</div>
                    <div>✓ Automated non-technical status update dispatched to Sales team</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e0dedb] flex justify-end gap-2">
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="px-4 py-2 bg-[#37322F] text-white font-bold text-xs rounded-lg hover:bg-[#252220]"
                >
                  Close Specification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DepartmentGuard>
  );
}
