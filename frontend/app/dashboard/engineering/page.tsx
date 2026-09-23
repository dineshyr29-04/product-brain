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
  Inbox,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Check,
  Search,
  Code,
  Lock,
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import DepartmentGuard from "@/components/DepartmentGuard";
import PBLogo from "@/components/PBLogo";
import { getCurrentUser, logoutUser, UserProfile } from "@/lib/authHelper";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export default function EngineeringDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [engData, setEngData] = useState<any>({
    metrics: {
      openTickets: 0,
      inProgress: 0,
      blocked: 0,
      resolvedToday: 0,
      avgResolutionTimeHours: 0
    },
    tickets: []
  });

  // Action Modals & State
  const [resolvingTicket, setResolvingTicket] = useState<any>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchEngData = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`${API_BASE}/dashboards/engineering`);
      if (res.data?.success) setEngData(res.data);
    } catch (err) {
      console.error("Failed to load engineering data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEngData();
    setCurrentUserState(getCurrentUser());
  }, []);

  const handleStartWork = async (ticketId: string) => {
    try {
      const res = await axios.patch(`${API_BASE}/tickets/${ticketId}/status`, {
        status: "In Progress"
      });
      if (res.data?.success) {
        showToast("✓ Ticket moved to 'In Progress'.");
        await fetchEngData();
      }
    } catch {
      showToast("Failed to update ticket status.");
    }
  };

  const handleResolveTicket = async () => {
    if (!resolvingTicket) return;
    setIsProcessing(true);
    try {
      const res = await axios.patch(`${API_BASE}/tickets/${resolvingTicket.id}/status`, {
        status: "Resolved",
        resolution_note: resolutionNote || "Technical defect remediated and verified."
      });
      if (res.data?.success) {
        showToast("✓ Ticket resolved & automated customer summary generated for Sales!");
        setResolvingTicket(null);
        setResolutionNote("");
        await fetchEngData();
      }
    } catch {
      showToast("Failed to resolve ticket.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return (engData.tickets || []).filter((ticket: any) => {
      const matchesSearch =
        (ticket.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket.customer?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [engData.tickets, searchQuery, statusFilter]);

  const openTickets = engData.metrics?.openTickets || 0;
  const inProgress = engData.metrics?.inProgress || 0;
  const blocked = engData.metrics?.blocked || 0;
  const resolvedToday = engData.metrics?.resolvedToday || 0;

  return (
    <DepartmentGuard requiredRole="engineering">
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
            <PBLogo size="sm" showText={false} />
            <div>
              <span className="font-extrabold text-sm text-[#37322F] tracking-tight">Engineering Backlog</span>
              <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold">Sprint Execution</span>
            </div>
          </div>
        </div>

        {/* Department Security Guardrails */}
        <div className="flex items-center gap-2 bg-[#eae7e3] p-1 rounded-lg border border-[#d8d5d0]">
          <span className="px-3 py-1 bg-white text-purple-900 text-xs font-bold rounded shadow-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Engineering Backlog (Active)</span>
          </span>
          <button
            onClick={() => showToast("🔒 Restricted: PM Strategy is isolated to Product Managers.")}
            className="px-2.5 py-1 text-xs font-medium text-stone-500 hover:text-stone-700 flex items-center gap-1 transition-colors cursor-not-allowed"
            title="Access Restricted to PMs"
          >
            <Lock className="w-3 h-3 text-stone-400" />
            <span>PM Strategy</span>
          </button>
          <button
            onClick={() => showToast("🔒 Restricted: Customer ARR financials are isolated to Sales team.")}
            className="px-2.5 py-1 text-xs font-medium text-stone-500 hover:text-stone-700 flex items-center gap-1 transition-colors cursor-not-allowed"
            title="Access Restricted to Sales"
          >
            <Lock className="w-3 h-3 text-stone-400" />
            <span>Sales Radar</span>
          </button>
        </div>

        {/* Action Controls & Auth */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchEngData}
            disabled={refreshing}
            className="p-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#605a57] hover:bg-[#f0ede9] text-xs font-medium flex items-center gap-1.5"
            title="Refresh Backlog"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-[#d8d5d0]">
            <div className="flex items-center gap-1.5 text-xs text-[#37322F]">
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-[10px]">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "ENG"}
              </div>
              <span className="font-semibold hidden sm:inline">{currentUser?.name || "Alex Rivera"}</span>
              <span className="text-[10px] bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded font-mono font-medium border border-purple-200">
                Staff Eng
              </span>
            </div>
            <button
              onClick={() => {
                logoutUser();
                router.push("/sign-in?role=engineering");
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
      <main className="w-full px-6 lg:px-10 py-8 space-y-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#828387] block">Open Tickets</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#37322F]">{openTickets}</span>
            </div>
            <div className="mt-2">
              {openTickets === 0 ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Queue Clear (0 Open)
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Awaiting Triage
                </span>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#828387] block">In Progress</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#37322F]">{inProgress}</span>
            </div>
            <div className="mt-2">
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Active Sprint
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#828387] block">Blockers</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#37322F]">{blocked}</span>
            </div>
            <div className="mt-2">
              {blocked === 0 ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ 0 Blockers
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Requires Unblocking
                </span>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#828387] block">Resolved Today</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#37322F]">{resolvedToday}</span>
            </div>
            <div className="mt-2">
              <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                Avg Resolution: {engData.metrics?.avgResolutionTimeHours || 0}h
              </span>
            </div>
          </div>
        </div>

        {/* Work Queue Table */}
        <section className="bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0ede9] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#37322F] flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-600" />
                <span>Engineering Queue & Execution Pipeline</span>
              </h2>
              <p className="text-xs text-[#828387]">
                Resolving an incident triggers autonomous synthesis of a non-technical update for Sales.
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#828387] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search tickets / logs..."
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
                <option value="Blocked">Blocked</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#d8d5d0] bg-[#faf8f6] space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#37322F]">Engineering Queue is 100% Clear</h3>
              <p className="text-xs text-[#828387] max-w-md mx-auto">
                No tickets currently require engineering triage or resolution.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf8f6] border-b border-[#e0dedb] text-[#828387] uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Ticket</th>
                    <th className="py-2.5 px-4">Customer & ARR</th>
                    <th className="py-2.5 px-4">Title & Technical Logs</th>
                    <th className="py-2.5 px-4">Priority</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Engineering Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede9]">
                  {filteredTickets.map((t: any) => (
                    <tr key={t.id} className="hover:bg-[#faf8f6]">
                      <td className="py-3 px-4 font-mono font-bold text-[#37322F]">
                        #{t.ticket_number || t.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#37322F]">{t.customer?.name || "Enterprise"}</div>
                        <div className="font-mono text-[10px] text-emerald-700 font-bold">
                          ${Number(t.customer?.arr || 0).toLocaleString()} ARR
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-[#37322F]">{t.title}</div>
                        {t.technical_logs && (
                          <div className="font-mono text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200 mt-1 truncate">
                            {t.technical_logs}
                          </div>
                        )}
                        {t.resolution_note && (
                          <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                            Fix: {t.resolution_note}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${t.priority === "Critical"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : t.priority === "High"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-stone-50 text-stone-700 border-stone-200"
                            }`}
                        >
                          {t.priority}
                        </span>
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
                      <td className="py-3 px-4 text-right">
                        {t.status === "Open" && (
                          <button
                            onClick={() => handleStartWork(t.id)}
                            className="px-2.5 py-1 bg-white border border-[#d8d5d0] text-[#37322F] text-xs font-semibold rounded hover:bg-[#eae7e3]"
                          >
                            Start Work
                          </button>
                        )}
                        {t.status === "In Progress" && (
                          <button
                            onClick={() => setResolvingTicket(t)}
                            className="px-2.5 py-1 bg-emerald-700 text-white text-xs font-semibold rounded hover:bg-emerald-800 flex items-center gap-1 ml-auto"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark Resolved</span>
                          </button>
                        )}
                        {t.status === "Resolved" && (
                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Deployed</span>
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

      {/* Mark Resolved Modal */}
      {resolvingTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e0dedb] space-y-4">
            <div className="flex justify-between items-center border-b border-[#e0dedb] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#37322F]">Resolve #{resolvingTicket.ticket_number || resolvingTicket.id}</h3>
                <span className="text-xs text-[#828387]">{resolvingTicket.title}</span>
              </div>
              <button onClick={() => setResolvingTicket(null)} className="text-stone-400 hover:text-stone-800 text-lg">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#828387] mb-1">
                  Engineering Resolution Note
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="e.g. Optimized database compound index and increased connection timeout to 120s."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-[#faf8f6] text-[#37322F]"
                />
              </div>
              <div className="bg-purple-50 border border-purple-200 text-purple-900 p-2.5 rounded-lg text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  The platform will automatically translate this note into customer-facing communication for the Sales team.
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
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isProcessing ? "Synthesizing..." : "Confirm & Resolve"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </DepartmentGuard>
  );
}
