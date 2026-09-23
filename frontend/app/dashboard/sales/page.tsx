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
  FileText,
  TrendingUp,
  Inbox,
  AlertTriangle,
  ArrowLeft,
  Search,
  Filter
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

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

export default function SalesRadarPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [salesData, setSalesData] = useState<any>({
    metrics: {
      totalCustomersWithIssues: 0,
      openIssuesCount: 0,
      criticalIssuesCount: 0,
      affectedArr: 0,
      resolvedThisWeekCount: 0
    },
    customerIssues: [],
    allCustomers: fallbackCustomers
  });

  const [metaCustomers, setMetaCustomers] = useState<any[]>(fallbackCustomers);
  const [metaProducts, setMetaProducts] = useState<any[]>(fallbackProducts);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Log Ticket Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    customer_id: "cust-1",
    product_id: "prod-1",
    title: "",
    description: "",
    priority: "High",
    category: "Export Performance",
    technical_logs: ""
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchSalesData = async () => {
    try {
      setRefreshing(true);
      const [salesRes, metaRes] = await Promise.all([
        axios.get(`${API_BASE}/dashboards/sales`).catch(() => null),
        axios.get(`${API_BASE}/dashboards/meta`).catch(() => null)
      ]);

      if (salesRes?.data?.success) setSalesData(salesRes.data);
      if (metaRes?.data?.success) {
        if (metaRes.data.customers?.length) setMetaCustomers(metaRes.data.customers);
        if (metaRes.data.products?.length) setMetaProducts(metaRes.data.products);
      }
    } catch (err) {
      console.error("Failed to load sales data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.description) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/tickets/create`, ticketForm);
      if (res.data?.success) {
        showToast("✓ Escalation ticket logged for account!");
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
        await fetchSalesData();
      }
    } catch {
      showToast("Error creating ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // CSV Export for Sales & Account Execs
  const exportCsv = () => {
    const issues = salesData.customerIssues || [];
    if (issues.length === 0) {
      showToast("No issues to export at 0 baseline.");
      return;
    }

    const headers = [
      "Ticket Number",
      "Customer",
      "Account ARR",
      "Product",
      "Issue Title",
      "Priority",
      "Status",
      "AI Customer Summary"
    ];

    const rows = issues.map((t: any) => [
      `#${t.ticket_number || t.id}`,
      `"${t.customer?.name || "Enterprise Account"}"`,
      t.customer?.arr || 0,
      `"${t.product?.name || "Core Platform"}"`,
      `"${(t.title || "").replace(/"/g, '""')}"`,
      t.priority || "Medium",
      t.status || "Open",
      `"${(t.ai_customer_summary || "Pending engineering resolution").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ProductBrain_Sales_Escalations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Exported CSV successfully!");
  };

  const filteredIssues = useMemo(() => {
    return (salesData.customerIssues || []).filter((issue: any) => {
      const matchesSearch =
        (issue.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (issue.customer?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (issue.product?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || issue.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || issue.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [salesData.customerIssues, searchQuery, statusFilter, priorityFilter]);

  const affectedArr = salesData.metrics?.affectedArr || 0;
  const totalCustomersWithIssues = salesData.metrics?.totalCustomersWithIssues || 0;
  const openIssuesCount = salesData.metrics?.openIssuesCount || 0;

  return (
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
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              SL
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#37322F] tracking-tight">Sales & CS Radar</span>
              <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">ARR Health</span>
            </div>
          </div>
        </div>

        {/* Workspace Switcher */}
        <div className="flex items-center gap-2 bg-[#eae7e3] p-1 rounded-lg border border-[#d8d5d0]">
          <Link href="/dashboard/pm" className="px-3 py-1 text-xs font-medium text-[#605a57] hover:text-[#37322F] transition-all">PM Dashboard</Link>
          <span className="px-3 py-1 bg-white text-[#37322F] text-xs font-bold rounded shadow-xs">Sales Radar</span>
          <Link href="/dashboard/engineering" className="px-3 py-1 text-xs font-medium text-[#605a57] hover:text-[#37322F] transition-all">Engineering Backlog</Link>
        </div>

        {/* Action Controls & Auth */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSalesData}
            disabled={refreshing}
            className="p-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#605a57] hover:bg-[#f0ede9] text-xs font-medium flex items-center gap-1.5"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={exportCsv}
            className="px-3 py-1.5 bg-white border border-[#d8d5d0] text-[#37322F] text-xs font-semibold rounded-lg hover:bg-[#eae7e3] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Customer Escalation</span>
          </button>

          <div className="pl-2 border-l border-[#d8d5d0]">
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
          <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#828387] block">Accounts Affected</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#37322F]">{totalCustomersWithIssues}</span>
              <span className="text-xs font-medium text-[#828387]">/ {metaCustomers.length} accounts</span>
            </div>
            <div className="mt-2">
              {totalCustomersWithIssues === 0 ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ 100% Accounts Clear
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Needs AE Outreach
                </span>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#828387] block">Active Open Issues</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#37322F]">{openIssuesCount}</span>
            </div>
            <div className="mt-2">
              {openIssuesCount === 0 ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Zero Open Defects
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {salesData.metrics?.criticalIssuesCount || 0} Critical Escalations
                </span>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#828387] block">Affected Account ARR</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#37322F]">${affectedArr.toLocaleString()}</span>
            </div>
            <div className="mt-2">
              {affectedArr === 0 ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ $0 ARR at Risk
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Under Escalation
                </span>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#828387] block">Resolved This Week</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#37322F]">{salesData.metrics?.resolvedThisWeekCount || 0}</span>
            </div>
            <div className="mt-2">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Ready for Client Notification
              </span>
            </div>
          </div>
        </div>

        {/* Customer Issues Radar Table */}
        <section className="bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0ede9] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#37322F] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Account Escalation Radar & AI Client Updates</span>
              </h2>
              <p className="text-xs text-[#828387]">
                Customer-facing updates synthesized by Gemini when engineering resolves an incident.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#828387] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter customer / ticket..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#d8d5d0] bg-[#faf8f6] text-[#37322F] w-48"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs p-1.5 rounded-lg border border-[#d8d5d0] bg-[#faf8f6] text-[#37322F]"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#d8d5d0] bg-[#faf8f6] space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#37322F]">Zero Customer Escalations in Queue</h3>
              <p className="text-xs text-[#828387] max-w-md mx-auto">
                No active defects currently affect accounts. You can log an escalation ticket directly when customers report an issue.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220]"
              >
                + Log Account Escalation
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf8f6] border-b border-[#e0dedb] text-[#828387] uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Customer Account</th>
                    <th className="py-2.5 px-4">ARR Value</th>
                    <th className="py-2.5 px-4">Impacted Product</th>
                    <th className="py-2.5 px-4">Issue Description</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Gemini AI Client Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede9]">
                  {filteredIssues.map((t: any) => (
                    <tr key={t.id} className="hover:bg-[#faf8f6]">
                      <td className="py-3 px-4 font-bold text-[#37322F]">
                        {t.customer?.name || "Enterprise Account"}
                        <span className="block text-[10px] text-[#828387] font-normal">
                          Owner: {t.customer?.account_owner || "Account Exec"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#37322F]">
                        ${Number(t.customer?.arr || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-600">
                        {t.product?.name || "Core Platform"}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-[#37322F] truncate">{t.title}</div>
                        <div className="text-[11px] text-[#828387] truncate">{t.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${t.status === "Resolved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : t.status === "In Progress"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        {t.ai_customer_summary ? (
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2 rounded-lg text-[11px] leading-relaxed">
                            <span className="font-bold flex items-center gap-1 text-[10px] text-emerald-800 uppercase tracking-wider mb-0.5">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              Ready for Customer Email:
                            </span>
                            {t.ai_customer_summary}
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#828387] italic">
                            Awaiting engineering fix & resolution note...
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

      {/* Log Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e0dedb] space-y-4">
            <div className="flex justify-between items-center border-b border-[#e0dedb] pb-3">
              <h3 className="font-bold text-base text-[#37322F]">Log Account Escalation</h3>
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
                <label className="block text-xs font-bold text-[#828387] mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp cannot run quarterly report"
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#828387] mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Customer escalation feedback..."
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
  );
}
