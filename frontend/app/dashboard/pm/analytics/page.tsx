"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";
import {
  TrendingUp,
  CheckCircle2,
  Download,
  FileText,
  Calendar,
  ShieldCheck,
  Building,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import DepartmentGuard from "@/components/DepartmentGuard";
import PMNavHeader from "@/components/PMNavHeader";

const quarterlyArrTrend = [
  { quarter: "Q1 2025", arrProtected: 1200000, defectsResolved: 14 },
  { quarter: "Q2 2025", arrProtected: 1550000, defectsResolved: 18 },
  { quarter: "Q3 2025", arrProtected: 1890000, defectsResolved: 22 },
  { quarter: "Q4 2025", arrProtected: 2180000, defectsResolved: 26 }
];

const productLineMetrics = [
  { name: "Product A (Core Platform)", defects: 12, mttrHours: 16.2, arr: 940000 },
  { name: "Product B (Analytics Hub)", defects: 6, mttrHours: 14.5, arr: 490000 },
  { name: "Product C (Integrations API)", defects: 8, mttrHours: 21.0, arr: 750000 }
];

const executiveBoardReportData = [
  {
    account: "Gamma Ltd",
    arr: 750000,
    incidents: 1,
    category: "Integrations & API",
    mttr: 12.0,
    status: "Remediated",
    retainedArr: 750000
  },
  {
    account: "Acme Corp",
    arr: 420000,
    incidents: 2,
    category: "Export & DB Driver",
    mttr: 18.5,
    status: "In Progress",
    retainedArr: 420000
  },
  {
    account: "Delta Global",
    arr: 520000,
    incidents: 1,
    category: "Memory Allocation",
    mttr: 24.0,
    status: "Under Triage",
    retainedArr: 520000
  },
  {
    account: "Epsilon Tech",
    arr: 310000,
    incidents: 1,
    category: "UI Render Lag",
    mttr: 15.2,
    status: "Under Triage",
    retainedArr: 310000
  },
  {
    account: "Beta Inc",
    arr: 180000,
    incidents: 1,
    category: "SSO Handshake",
    mttr: 20.1,
    status: "Under Triage",
    retainedArr: 180000
  }
];

export default function PMAnalyticsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const exportPdfReport = () => {
    showToast("✓ Generated Board-Ready Executive Analytics PDF!");
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const exportCsv = () => {
    const headers = [
      "Account Name",
      "Contract ARR",
      "Incidents",
      "Primary Category",
      "MTTR (Hours)",
      "Status",
      "Retained ARR"
    ];
    const rows = executiveBoardReportData.map((item) => [
      `"${item.account}"`,
      item.arr,
      item.incidents,
      `"${item.category}"`,
      item.mttr,
      item.status,
      item.retainedArr
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Executive_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Exported Executive Analytics CSV!");
  };

  return (
    <DepartmentGuard requiredRole="pm">
      <div className="min-h-screen bg-[#F7F5F3] text-[#37322F]">
        <PMNavHeader
          activeTab="analytics"
          onRefresh={() => showToast("Executive Analytics & Board metrics updated!")}
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
                <BarChart3 className="w-5 h-5 text-amber-700" />
                <span>Executive Analytics & Board Reporting</span>
              </h1>
              <p className="text-xs text-[#828387] mt-1">
                Board-level revenue protection metrics, mean time to resolution (MTTR), and product line health telemetry.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportCsv}
                className="px-3.5 py-1.5 bg-white border border-[#d8d5d0] text-[#37322F] text-xs font-extrabold rounded-lg hover:bg-[#eae7e3] flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Download Analytics CSV</span>
              </button>

              <button
                onClick={exportPdfReport}
                className="px-4 py-1.5 bg-[#37322F] text-white text-xs font-extrabold rounded-lg hover:bg-[#252220] flex items-center gap-1.5 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                <span>📄 Export Board Report (PDF)</span>
              </button>
            </div>
          </div>

          {/* Top KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Total Retained ARR
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">$2,180,000</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  +18.5% YoY
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Defect Resolution Rate
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">94.2%</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ High Velocity
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Average MTTR (Resolution)
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">18.4h</span>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  -4.2h Imprv
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Customer Retention Index
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">98.5%</span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Top Decile
                </span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart 1: Quarterly ARR Protection Trend (Span 7) */}
            <div className="lg:col-span-7 bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0ede9] pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-[#37322F]">Quarterly ARR Protection & Retention Trend</h3>
                  <span className="text-xs text-[#828387]">Cumulative ARR retained through automated defect triage</span>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Q4 Peak: $2.18M
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={quarterlyArrTrend}>
                    <defs>
                      <linearGradient id="arrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ede9" />
                    <XAxis dataKey="quarter" stroke="#828387" fontSize={11} tickLine={false} />
                    <YAxis stroke="#828387" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val / 1000000}M`} />
                    <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "ARR Protected"]} />
                    <Area type="monotone" dataKey="arrProtected" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#arrGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Product Line Defect Distribution (Span 5) */}
            <div className="lg:col-span-5 bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0ede9] pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-[#37322F]">Defect Volume by Product Line</h3>
                  <span className="text-xs text-[#828387]">Incident count and MTTR hours</span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productLineMetrics} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ede9" />
                    <XAxis type="number" stroke="#828387" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#828387" fontSize={10} width={120} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="defects" fill="#0284C7" radius={[0, 4, 4, 0]} name="Defect Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Section 3: Executive Board Report Summary Table */}
          <section className="bg-white border border-[#e0dedb] rounded-xl shadow-xs p-6 space-y-4">
            <div className="border-b border-[#e0dedb] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#37322F] flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>Executive Board Report Summary</span>
                </h2>
                <p className="text-xs text-[#828387] mt-0.5">
                  Consolidated portfolio risk table ready for board presentation.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 bg-stone-100 text-stone-700 rounded border border-stone-200">
                5 Major Accounts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F6] border-b border-[#e0dedb] text-[#828387] uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-6">ACCOUNT NAME</th>
                    <th className="py-3 px-4">CONTRACT ARR</th>
                    <th className="py-3 px-4">INCIDENTS</th>
                    <th className="py-3 px-6">PRIMARY DEFECT CATEGORY</th>
                    <th className="py-3 px-4">MTTR (HOURS)</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-6 text-right">ARR PROTECTED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede9]">
                  {executiveBoardReportData.map((item) => (
                    <tr key={item.account} className="hover:bg-[#FAF8F6] transition-colors">
                      <td className="py-4 px-6 font-extrabold text-sm text-[#37322F]">
                        {item.account}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-sm text-[#37322F]">
                        ${item.arr.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-bold text-[#37322F]">{item.incidents}</td>
                      <td className="py-4 px-6 text-xs text-[#605a57] font-medium">{item.category}</td>
                      <td className="py-4 px-4 font-mono font-bold text-[#37322F]">{item.mttr}h</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-extrabold rounded border ${
                            item.status === "Remediated"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : item.status === "In Progress"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-extrabold text-sm text-emerald-700">
                        ${item.retainedArr.toLocaleString()}
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
