"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Code,
  TrendingUp,
  Terminal,
  ShieldAlert,
  Search,
  Filter
} from "lucide-react";
import DepartmentGuard from "@/components/DepartmentGuard";
import PMNavHeader from "@/components/PMNavHeader";

interface ConnectedTelemetryItem {
  id: string;
  ticketNumber: string;
  customerName: string;
  arr: number;
  salesOwner: string;
  issueTitle: string;
  engStatus: "Open" | "In Progress" | "Resolved";
  salesStatus: "Active Issue" | "Stable";
  priority: "Critical" | "High" | "Medium";
  stackTrace: string;
  aiBriefing?: string;
}

const connectedTelemetryData: ConnectedTelemetryItem[] = [
  {
    id: "item-1",
    ticketNumber: "#1024",
    customerName: "Acme Corp",
    arr: 420000,
    salesOwner: "Sarah Jenkins",
    issueTitle: "High Priority Export Timeout",
    engStatus: "In Progress",
    salesStatus: "Active Issue",
    priority: "High",
    stackTrace: "QueryTimeoutException: 30000ms exceeded in db.driver.js:42"
  },
  {
    id: "item-2",
    ticketNumber: "#1025",
    customerName: "Beta Inc",
    arr: 180000,
    salesOwner: "Elena Rostova",
    issueTitle: "SSO Authentication Failure",
    engStatus: "Open",
    salesStatus: "Active Issue",
    priority: "Medium",
    stackTrace: "SSO_HANDSHAKE_TIMEOUT [408] redirect to sso.beta.com"
  },
  {
    id: "item-3",
    ticketNumber: "#1026",
    customerName: "Gamma Ltd",
    arr: 750000,
    salesOwner: "Michael Chang",
    issueTitle: "Analytics Export Timeout",
    engStatus: "Resolved",
    salesStatus: "Stable",
    priority: "Critical",
    stackTrace: "502 Bad Gateway: Upstream rate limiter overflow [1000req/sec]",
    aiBriefing:
      "The API Gateway query timeout affecting your analytics export was resolved today by scaling our upstream database pool. Normal export speed (< 400ms) has been fully restored."
  },
  {
    id: "item-4",
    ticketNumber: "#1027",
    customerName: "Delta Global",
    arr: 520000,
    salesOwner: "David Kim",
    issueTitle: "Memory Leak in Report Generator",
    engStatus: "Open",
    salesStatus: "Active Issue",
    priority: "High",
    stackTrace:
      "FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory"
  },
  {
    id: "item-5",
    ticketNumber: "#1028",
    customerName: "Epsilon Tech",
    arr: 310000,
    salesOwner: "Sarah Jenkins",
    issueTitle: "Slow Dashboard Render",
    engStatus: "Open",
    salesStatus: "Active Issue",
    priority: "Medium",
    stackTrace: "LongTaskwarning: script execution took 11840ms on renderCanvas()"
  }
];

export default function PMTelemetryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredItems = connectedTelemetryData.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.issueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salesOwner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.engStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalExposedArr = connectedTelemetryData
    .filter((i) => i.salesStatus === "Active Issue")
    .reduce((acc, curr) => acc + curr.arr, 0);

  const inProgressCount = connectedTelemetryData.filter((i) => i.engStatus === "In Progress").length;
  const openCount = connectedTelemetryData.filter((i) => i.engStatus === "Open").length;
  const resolvedCount = connectedTelemetryData.filter((i) => i.engStatus === "Resolved").length;

  return (
    <DepartmentGuard requiredRole="pm">
      <div className="min-h-screen bg-[#F7F5F3] text-[#37322F]">
        <PMNavHeader
          activeTab="telemetry"
          onRefresh={() => showToast("Cross-Team Telemetry synced in real time!")}
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#252220] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium border border-[#4a4643]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <main className="w-full px-6 lg:px-10 py-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-[#37322F] flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Cross-Team Connected Telemetry</span>
              </h1>
              <p className="text-xs text-[#828387] mt-1">
                Unified live tracking connecting Sales ARR escalations directly to Engineering sprint execution.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Real-Time Sync Active</span>
              </span>
            </div>
          </div>

          {/* Top Connected KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Total At-Risk Account ARR
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">
                  ${totalExposedArr.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  4 Accounts
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Eng Work In Progress
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{inProgressCount}</span>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Active Sprint
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Eng Queue (Awaiting Work)
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{openCount}</span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Needs Triage
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Automated Sales Briefings Ready
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{resolvedCount}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready to Send
                </span>
              </div>
            </div>
          </div>

          {/* Connected Pipeline Table */}
          <section className="bg-white border border-[#e0dedb] rounded-xl shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#e0dedb] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-[#37322F] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Cross-Team Connected Escalation Flow</span>
                </h2>
                <p className="text-xs text-[#828387] mt-0.5">
                  Trace customer escalations from Sales ARR impact through Engineering terminal logs to client resolution notes.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#828387] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search account / ticket..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] w-48 focus:outline-none"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] font-medium"
                >
                  <option value="All">All Engineering Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F6] border-b border-[#e0dedb] text-[#828387] uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-6">CUSTOMER ACCOUNT & ARR</th>
                    <th className="py-3 px-4">SALES STATUS</th>
                    <th className="py-3 px-4">ENG TICKET</th>
                    <th className="py-3 px-6">ENGINEERING LOG & STACK TRACE</th>
                    <th className="py-3 px-4">ENGINEERING STATUS</th>
                    <th className="py-3 px-6 text-right">CONNECTED BRIEFING STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede9]">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF8F6] transition-colors">
                      {/* Account */}
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-sm text-[#37322F]">{item.customerName}</div>
                        <div className="font-mono text-xs text-emerald-700 font-bold mt-0.5">
                          ${item.arr.toLocaleString()} ARR
                        </div>
                        <div className="text-[10px] text-[#828387] mt-0.5">AE: {item.salesOwner}</div>
                      </td>

                      {/* Sales Status */}
                      <td className="py-4 px-4">
                        {item.salesStatus === "Active Issue" ? (
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>At-Risk</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Stable</span>
                          </span>
                        )}
                      </td>

                      {/* Eng Ticket */}
                      <td className="py-4 px-4 font-mono font-extrabold text-sm text-[#37322F]">
                        {item.ticketNumber}
                      </td>

                      {/* Stack Trace */}
                      <td className="py-4 px-6 max-w-md space-y-1">
                        <div className="font-bold text-xs text-[#37322F]">{item.issueTitle}</div>
                        <div className="bg-[#1C1917] text-[#E7E5E4] p-2.5 rounded-lg font-mono text-[10px] border border-[#292524]">
                          <span className="text-amber-300">{item.stackTrace}</span>
                        </div>
                      </td>

                      {/* Eng Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-extrabold rounded border ${
                            item.engStatus === "Resolved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : item.engStatus === "In Progress"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {item.engStatus}
                        </span>
                      </td>

                      {/* Briefing Status */}
                      <td className="py-4 px-6 text-right max-w-xs">
                        {item.aiBriefing ? (
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-2.5 rounded-lg text-[11px] text-left space-y-1">
                            <div className="font-extrabold text-[10px] text-emerald-800 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>AI Briefing Ready</span>
                            </div>
                            <p className="text-[10px] leading-tight text-emerald-900 font-medium truncate">
                              "{item.aiBriefing}"
                            </p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#828387] italic">
                            Awaiting Eng Resolution Note
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
      </div>
    </DepartmentGuard>
  );
}
