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
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import DepartmentGuard from "@/components/DepartmentGuard";
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

export default function PMDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [pmData, setPmData] = useState<any>({
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
  });

  const [metaCustomers, setMetaCustomers] = useState<any[]>(fallbackCustomers);
  const [metaProducts, setMetaProducts] = useState<any[]>(fallbackProducts);

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
      const [pmRes, metaRes] = await Promise.all([
        axios.get(`${API_BASE}/dashboards/pm`).catch(() => null),
        axios.get(`${API_BASE}/dashboards/meta`).catch(() => null)
      ]);

      if (pmRes?.data?.success) setPmData(pmRes.data);
      if (metaRes?.data?.success) {
        if (metaRes.data.customers?.length) setMetaCustomers(metaRes.data.customers);
        if (metaRes.data.products?.length) setMetaProducts(metaRes.data.products);
      }
    } catch (err) {
      console.error("Failed to load PM data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.description) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/tickets/create`, ticketForm);
      if (res.data?.success) {
        showToast("✓ Ticket created and synthesized successfully!");
        setShowCreateModal(false);
        setTicketForm({
          customer_id: metaCustomers[0]?.id || "cust-1",
          product_id: metaProducts[0]?.id || "prod-1",
          title: "",
          description: "",
          priority: "High",
          category: "Export Performance",
          technical_logs: ""
        });
        await fetchDashboardData();
      }
    } catch {
      showToast("Error creating ticket. Please check backend.");
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

  const handleResetToZero = async () => {
    try {
      await axios.post(`${API_BASE}/dashboards/reset-to-zero`);
      showToast("✓ Baseline reset: All counts and opportunities set to 0.");
      await fetchDashboardData();
    } catch {
      showToast("Could not reset counts.");
    }
  };

  const handleSeedDemoData = async () => {
    try {
      await axios.post(`${API_BASE}/dashboards/seed-demo`);
      showToast("✓ Demo telemetry, tickets & opportunities loaded.");
      await fetchDashboardData();
    } catch {
      showToast("Could not load demo data.");
    }
  };

  const loadSampleDoc = () => {
    setBulkText(
      `--- PRODUCTION SUPPORT ESCALATION LOG ---
Incident 1:
Client: Acme Corp ($420k ARR)
Issue: QueryTimeoutException during 50MB CSV report download on Core Platform.
Urgency: Critical Sev-1 escalation.

Incident 2:
Client: Beta Inc ($180k ARR)
Issue: Users encountering SSO handshake loop during SAML authentication redirect.
Urgency: High priority.`
    );
  };

  const affectedArr = pmData.productHealth?.affectedArr || 0;
  const openTickets = pmData.productHealth?.openTechnicalTickets || 0;
  const criticalCount = pmData.productHealth?.criticalIssues || 0;
  const opportunities = pmData.opportunities || [];
  const authorityScore = openTickets === 0 ? 0 : Math.min(100, Math.round(50 + opportunities.length * 15));

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

      {/* Top Header */}
      <header className="w-full bg-[#F7F5F3] border-b border-[#e0dedb] px-6 py-3 flex flex-wrap items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-opacity-95 gap-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-[#828387] hover:text-[#37322F] transition-all">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Select Workspace</span>
          </Link>
          <div className="h-4 w-px bg-[#d8d5d0]" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#37322F] text-white flex items-center justify-center font-bold text-xs">
              PM
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#37322F] tracking-tight">Product Manager Workspace</span>
              <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold">PRD & Roadmap</span>
            </div>
          </div>
        </div>

        {/* Workspace Switcher */}
        <div className="flex items-center gap-2 bg-[#eae7e3] p-1 rounded-lg border border-[#d8d5d0]">
          <span className="px-3 py-1 bg-white text-[#37322F] text-xs font-bold rounded shadow-xs">PM Dashboard</span>
          <Link href="/dashboard/sales" className="px-3 py-1 text-xs font-medium text-[#605a57] hover:text-[#37322F] transition-all">Sales Radar</Link>
          <Link href="/dashboard/engineering" className="px-3 py-1 text-xs font-medium text-[#605a57] hover:text-[#37322F] transition-all">Engineering Backlog</Link>
        </div>

        {/* Action Controls & Auth */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="p-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#605a57] hover:bg-[#f0ede9] text-xs font-medium flex items-center gap-1.5"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>

          <div className="flex items-center border border-[#d8d5d0] rounded-lg overflow-hidden bg-white text-[11px] font-semibold">
            <button onClick={handleResetToZero} className="px-2 py-1 hover:bg-[#eae7e3] border-r border-[#d8d5d0] text-stone-600">
              0 Baseline
            </button>
            <button onClick={handleSeedDemoData} className="px-2 py-1 hover:bg-[#eae7e3] text-stone-600">
              Demo Data
            </button>
          </div>

          <button
            onClick={() => setShowBulkModal(true)}
            className="px-3 py-1.5 bg-white border border-[#d8d5d0] text-[#37322F] text-xs font-semibold rounded-lg hover:bg-[#eae7e3] flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Document Reader</span>
          </button>

          <button
            onClick={() => setShowTeamModal(true)}
            className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100 flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Access ({teamMembers.length})</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Ticket</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-[#d8d5d0]">
            <div className="flex items-center gap-1.5 text-xs text-[#37322F]">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "PM"}
              </div>
              <span className="font-semibold hidden sm:inline">{currentUser?.name || "Sarah Jenkins"}</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-medium border border-blue-200">
                PM Admin
              </span>
            </div>
            <button
              onClick={() => {
                logoutUser();
                router.push("/sign-in");
              }}
              title="Sign Out / Switch Department"
              className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"
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
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Authority Score */}
          <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#828387]">
              <span>PM Authority Score</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#37322F]">{authorityScore}</span>
              <span className="text-xs font-medium text-[#828387]">/ 100</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {openTickets === 0 ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ 0 Baseline • Zero Critical Defects
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {opportunities.length} Clusters Detected
                </span>
              )}
            </div>
          </div>

          {/* Card 2: ARR at Risk */}
          <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#828387]">
              <span>Direct ARR At Risk</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#37322F]">
                ${affectedArr.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {affectedArr === 0 ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ $0 At Risk • 100% ARR Secure
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Impacts {pmData.productHealth?.customersWithOpenIssues || 0} Accounts
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Active Incidents */}
          <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#828387]">
              <span>Active Incidents</span>
              <Inbox className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#37322F]">{openTickets}</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {openTickets === 0 ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Backlog Clear (0 Tickets)
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {criticalCount} Critical Priority
                </span>
              )}
            </div>
          </div>

          {/* Card 4: Resolved This Month */}
          <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#828387]">
              <span>Resolved This Month</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#37322F]">
                {pmData.productHealth?.resolvedThisMonth || 0}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                Avg Resolution: {pmData.productHealth?.avgResolutionTimeHours || 0}h
              </span>
            </div>
          </div>
        </div>

        {/* Opportunity Clusters Section */}
        <section className="bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0ede9] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#37322F] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Detected Product Opportunities (Intelligently Clustered)</span>
              </h2>
              <p className="text-xs text-[#828387] mt-0.5">
                Incidents aggregated by category to justify high-impact roadmap investments with real ARR metrics.
              </p>
            </div>
            <div className="text-xs font-mono font-medium text-[#828387]">
              {opportunities.length} Clusters Found
            </div>
          </div>

          {opportunities.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#d8d5d0] bg-[#faf8f6] space-y-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center mx-auto text-[#828387]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#37322F]">0 Opportunity Clusters at Baseline</h3>
              <p className="text-xs text-[#828387] max-w-md mx-auto">
                ProductBrain clusters support tickets automatically when multiple enterprise incidents correlate to a common root cause.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleSeedDemoData}
                  className="px-3.5 py-1.5 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220] transition-all"
                >
                  Load Demo Clusters
                </button>
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="px-3.5 py-1.5 bg-white border border-[#d8d5d0] text-[#37322F] text-xs font-semibold rounded-lg hover:bg-[#eae7e3] transition-all"
                >
                  Paste Incident Document
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map((opp: any) => (
                <div key={opp.id} className="border border-[#e0dedb] rounded-xl p-5 bg-[#faf8f6] space-y-4 hover:border-[#37322F] transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-[#37322F]">{opp.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-white border border-[#d8d5d0] rounded text-[#605a57]">
                          {opp.product?.name || "Core Platform"}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ${(opp.affected_arr || 0).toLocaleString()} ARR Affected
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-purple-100 text-purple-800 rounded border border-purple-200">
                      {opp.status || "Detected"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-[#e0dedb]">
                    <div>
                      <span className="text-[#828387] block text-[10px] uppercase font-bold">Related Tickets</span>
                      <span className="font-extrabold text-[#37322F] text-sm">{opp.ticket_count} tickets</span>
                    </div>
                    <div>
                      <span className="text-[#828387] block text-[10px] uppercase font-bold">Accounts Impacted</span>
                      <span className="font-extrabold text-[#37322F] text-sm">{opp.customer_count} accounts</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#e0dedb]">
                    <button
                      onClick={() => handleGeneratePrd(opp.id)}
                      disabled={generatingPrd}
                      className="px-3 py-1.5 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220] flex items-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                      <span>{opp.prd_content ? "View / Regenerate PRD" : "1-Click Generate PRD"}</span>
                    </button>
                    {opp.prd_content && (
                      <button
                        onClick={() => setSelectedOpportunity(opp)}
                        className="text-xs font-semibold text-purple-700 hover:text-purple-900 underline"
                      >
                        Open PRD Document →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Product Health Breakdown */}
        <section className="bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#37322F] flex items-center gap-2">
            <Layers className="w-4 h-4 text-stone-600" />
            <span>Product Portfolio Health Breakdown</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f6] border-b border-[#e0dedb] text-[#828387] uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Product Module</th>
                  <th className="py-2.5 px-4">Open Incidents</th>
                  <th className="py-2.5 px-4">Accounts Impacted</th>
                  <th className="py-2.5 px-4">ARR at Risk</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ede9]">
                {(pmData.productBreakdown || []).map((prod: any) => (
                  <tr key={prod.product_id} className="hover:bg-[#faf8f6]">
                    <td className="py-3 px-4 font-semibold text-[#37322F]">{prod.product_name}</td>
                    <td className="py-3 px-4 font-mono">{prod.open_tickets}</td>
                    <td className="py-3 px-4 font-mono">{prod.customers_affected}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#37322F]">${(prod.affected_arr || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      {prod.open_tickets === 0 ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          100% Healthy
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Needs Attention
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* PRD Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#e0dedb]">
            <div className="px-6 py-4 border-b border-[#e0dedb] flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#37322F] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Product Requirement Document (PRD)</span>
                </h3>
                <span className="text-xs text-[#828387]">{selectedOpportunity.title}</span>
              </div>
              <button onClick={() => setSelectedOpportunity(null)} className="text-stone-400 hover:text-stone-800 text-lg">✕</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-[#37322F] bg-[#faf8f6] whitespace-pre-wrap leading-relaxed">
              {selectedOpportunity.prd_content || "PRD content being formatted..."}
            </div>
            <div className="px-6 py-3 border-t border-[#e0dedb] flex justify-end gap-2 bg-white rounded-b-2xl">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedOpportunity.prd_content);
                  showToast("✓ PRD markdown copied to clipboard!");
                }}
                className="px-4 py-2 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220]"
              >
                Copy Markdown
              </button>
              <button onClick={() => setSelectedOpportunity(null)} className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e0dedb] space-y-4">
            <div className="flex justify-between items-center border-b border-[#e0dedb] pb-3">
              <h3 className="font-bold text-base text-[#37322F]">Log New Customer Ticket</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-800 text-lg">✕</button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#828387] mb-1">Customer Account</label>
                <select
                  value={ticketForm.customer_id}
                  onChange={(e) => setTicketForm({ ...ticketForm, customer_id: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                >
                  {metaCustomers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${Number(c.arr || 0).toLocaleString()} ARR)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#828387] mb-1">Impacted Product</label>
                <select
                  value={ticketForm.product_id}
                  onChange={(e) => setTicketForm({ ...ticketForm, product_id: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                >
                  {metaProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#828387] mb-1">Ticket Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Export timeout on CSV files > 50MB"
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#828387] mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter problem details reported by the customer..."
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#828387] mb-1">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#828387] mb-1">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                  >
                    <option value="Export Performance">Export Performance</option>
                    <option value="Login Problems">Login Problems</option>
                    <option value="API Reliability">API Reliability</option>
                    <option value="Dashboard Lag">Dashboard Lag</option>
                    <option value="General">General</option>
                  </select>
                </div>
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
                  {isSubmitting ? "Creating..." : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Bulk Document Reader Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e0dedb] space-y-4">
            <div className="flex justify-between items-center border-b border-[#e0dedb] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#37322F] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI Bulk Document & OCR Reader</span>
                </h3>
                <span className="text-xs text-[#828387]">
                  Paste incident emails or log documents. Automated engine parses & splits into individual tickets.
                </span>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="text-stone-400 hover:text-stone-800 text-lg">✕</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#828387]">Raw Document / Incident Content</label>
                <button onClick={loadSampleDoc} className="text-xs font-semibold text-purple-700 hover:underline">
                  Load Sample Document
                </button>
              </div>
              <textarea
                rows={8}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Paste multi-incident escalation log, customer email chain, or OCR dump..."
                className="w-full text-xs font-mono p-3 rounded-lg border border-[#d8d5d0] bg-[#faf8f6] text-[#37322F]"
              />
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={isSubmitting || !bulkText.trim()}
                  className="px-4 py-2 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220] flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>{isSubmitting ? "Parsing..." : "Parse & Split Document"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Team Access Delegation Modal (PM Authority) */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#e0dedb] space-y-5">
            <div className="flex items-center justify-between border-b border-[#e0dedb] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#37322F]">Team Access & Role Delegation</h3>
                  <p className="text-[11px] text-[#828387]">Only authorized members can log into Sales or Engineering</p>
                </div>
              </div>
              <button onClick={() => setShowTeamModal(false)} className="text-stone-400 hover:text-stone-800 text-lg">✕</button>
            </div>

            {/* Add Member Form */}
            <form onSubmit={handleAddNewMember} className="p-3 bg-[#faf8f6] rounded-xl border border-[#e0dedb] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#828387] flex items-center gap-1">
                <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Authorize New Department Member</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Full Name (e.g. John Doe)"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                />
                <input
                  type="email"
                  required
                  placeholder="corporate.email@company.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-[#605a57]">Department:</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as any)}
                    className="text-xs font-semibold p-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                  >
                    <option value="sales">Sales Department</option>
                    <option value="engineering">Engineering Team</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Grant Access</span>
                </button>
              </div>
            </form>

            {/* Approved Members List */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#828387]">
                Approved Workspace Members ({teamMembers.length})
              </span>
              <div className="max-h-56 overflow-y-auto space-y-1.5 divide-y divide-[#f0ede9]">
                {teamMembers.map((member) => (
                  <div key={member.id} className="pt-2 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#37322F] flex items-center gap-1.5">
                        <span>{member.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium border ${
                          member.role === "sales"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}>
                          {member.role === "sales" ? "Sales Dept" : "Engineering"}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#828387]">{member.email}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      title="Revoke Access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#e0dedb] flex justify-end">
              <button
                onClick={() => setShowTeamModal(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </DepartmentGuard>
  );
}
