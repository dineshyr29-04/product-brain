"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Sparkles,
  Download,
  ExternalLink,
  ShieldCheck,
  Search,
  Eye,
  Check,
  Layers,
  Clock,
  ArrowRight
} from "lucide-react";
import DepartmentGuard from "@/components/DepartmentGuard";
import PMNavHeader from "@/components/PMNavHeader";

interface PrdItem {
  id: string;
  prdId: string;
  title: string;
  category: string;
  clusterArr: number;
  customerCount: number;
  customers: string[];
  status: "Approved for Sprint" | "Implemented / Resolved" | "Under PM Review";
  summary: string;
  userStories: string[];
  acceptanceCriteria: string[];
}

interface ClosedTicket {
  ticketNumber: string;
  customerName: string;
  arr: number;
  issueTitle: string;
  resolutionNote: string;
  aiBriefing: string;
  closedAt: string;
}

const samplePrds: PrdItem[] = [
  {
    id: "prd-1",
    prdId: "PRD-101",
    title: "Upstream Database Connection Pool Auto-Scaler",
    category: "Export & DB Infrastructure",
    clusterArr: 940000,
    customerCount: 2,
    customers: ["Acme Corp ($420k)", "Beta Inc ($180k)"],
    status: "Approved for Sprint",
    summary:
      "Remediates high-volume report export timeouts by dynamically scaling database driver connection pools and introducing async chunk streaming.",
    userStories: [
      "As an Enterprise Analyst, I want large CSV/PDF exports to stream asynchronously without connection timeouts.",
      "As a Lead Engineer, I want connection pools to auto-scale dynamically during peak query bursts."
    ],
    acceptanceCriteria: [
      "Query execution timeout threshold increased to 120,000ms for large dataset exports.",
      "Zero 504 Gateway Timeout errors observed under 1,000 concurrent user exports."
    ]
  },
  {
    id: "prd-2",
    prdId: "PRD-102",
    title: "API Gateway Rate Limiter & Upstream Buffer Engine",
    category: "Integrations API",
    clusterArr: 750000,
    customerCount: 1,
    customers: ["Gamma Ltd ($750k)"],
    status: "Implemented / Resolved",
    summary:
      "Mitigates 502 Bad Gateway rate limiter overflow by implementing token bucket throttling and Redis token refresh caching.",
    userStories: [
      "As an API Integrator, I want automated retry headers when rate limits are approached.",
      "As a DevOps Engineer, I want buffer queues to smooth traffic spikes up to 5,000 req/sec."
    ],
    acceptanceCriteria: [
      "Rate limiter overflow handled gracefully with HTTP 429 Retry-After headers.",
      "Upstream connection latency remains under 400ms during peak load."
    ]
  }
];

const closedTicketsHistory: ClosedTicket[] = [
  {
    ticketNumber: "#1026",
    customerName: "Gamma Ltd",
    arr: 750000,
    issueTitle: "Analytics Export Timeout",
    resolutionNote: "Scaled database connection pool and updated query timeout limits to 120s.",
    aiBriefing:
      "The API Gateway query timeout affecting your analytics export was resolved today by scaling our upstream database pool. Normal export speed (< 400ms) has been fully restored.",
    closedAt: "Today at 14:32"
  }
];

export default function PMPrdsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrd, setSelectedPrd] = useState<PrdItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const exportPrdMarkdown = (prd: PrdItem) => {
    const markdown = `# ${prd.prdId}: ${prd.title}
**Category**: ${prd.category}
**Retained ARR**: $${prd.clusterArr.toLocaleString()}
**Impacted Accounts**: ${prd.customers.join(", ")}
**Status**: ${prd.status}

## Summary
${prd.summary}

## User Stories
${prd.userStories.map((us) => `- ${us}`).join("\n")}

## Acceptance Criteria
${prd.acceptanceCriteria.map((ac) => `- [ ] ${ac}`).join("\n")}
`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${prd.prdId}_Specification.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`✓ Exported ${prd.prdId} Markdown specification!`);
  };

  const filteredPrds = samplePrds.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prdId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DepartmentGuard requiredRole="pm">
      <div className="min-h-screen bg-[#F7F5F3] text-[#37322F]">
        <PMNavHeader
          activeTab="prds"
          onRefresh={() => showToast("PRD repository & ticket archive updated!")}
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
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>PRD Specifications & Closed Tickets Archive</span>
              </h1>
              <p className="text-xs text-[#828387] mt-1">
                Maintain autonomous Gemini PRD documents and historical log of remediated engineering tickets.
              </p>
            </div>
          </div>

          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Active Autonomous PRDs
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">{samplePrds.length}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready for Sprint
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Closed Technical Tickets
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">
                  {closedTicketsHistory.length}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Remediated
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                Retained ARR Protected
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">$750,000</span>
                <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  Gamma Ltd
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#e0dedb] rounded-xl p-5 shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#828387] block">
                PRD Synthesis Time
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#37322F]">&lt; 2.0s</span>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Instant PRD
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Autonomous PRD Maintenance Library */}
          <section className="bg-white border border-[#e0dedb] rounded-xl shadow-xs p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e0dedb] pb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#37322F] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Autonomous PRD Library</span>
                </h2>
                <p className="text-xs text-[#828387] mt-0.5">
                  AI-synthesized Product Requirement Documents clustered from high-ARR customer feedback.
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#828387] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search PRD ID / title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] w-48 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPrds.map((prd) => (
                <div
                  key={prd.id}
                  className="bg-[#FAF8F6] border border-[#e0dedb] rounded-xl p-5 space-y-3 hover:shadow-sm transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {prd.prdId}
                      </span>
                      <span className="ml-2 text-xs font-semibold text-[#828387]">{prd.category}</span>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border ${
                        prd.status === "Implemented / Resolved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {prd.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-[#37322F]">{prd.title}</h3>
                  <p className="text-xs text-[#605a57] leading-relaxed line-clamp-2">{prd.summary}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#e0dedb]">
                    <div className="text-xs font-extrabold text-[#37322F]">
                      Protected ARR: <span className="text-emerald-700 font-mono">${prd.clusterArr.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPrd(prd)}
                        className="px-3 py-1.5 bg-white border border-[#d8d5d0] text-[#37322F] text-xs font-bold rounded-lg hover:bg-[#eae7e3] flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View PRD</span>
                      </button>
                      <button
                        onClick={() => exportPrdMarkdown(prd)}
                        className="px-3 py-1.5 bg-[#37322F] text-white text-xs font-bold rounded-lg hover:bg-[#252220] flex items-center gap-1 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Closed & Resolved Tickets History */}
          <section className="bg-white border border-[#e0dedb] rounded-xl shadow-xs p-6 space-y-4">
            <div className="border-b border-[#e0dedb] pb-4">
              <h2 className="text-base font-extrabold text-[#37322F] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Closed & Remediated Tickets History</span>
              </h2>
              <p className="text-xs text-[#828387] mt-0.5">
                Archived log of tickets marked resolved by engineering and communicated to sales.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F6] border-b border-[#e0dedb] text-[#828387] uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-6">TICKET #</th>
                    <th className="py-3 px-4">CUSTOMER ACCOUNT</th>
                    <th className="py-3 px-4">RETAINED ARR</th>
                    <th className="py-3 px-6">ISSUE & ENGINEERING FIX NOTE</th>
                    <th className="py-3 px-4">CLOSED TIMESTAMP</th>
                    <th className="py-3 px-6 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede9]">
                  {closedTicketsHistory.map((t) => (
                    <tr key={t.ticketNumber} className="hover:bg-[#FAF8F6] transition-colors">
                      <td className="py-4 px-6 font-mono font-extrabold text-sm text-[#37322F]">
                        {t.ticketNumber}
                      </td>
                      <td className="py-4 px-4 font-extrabold text-sm text-[#37322F]">
                        {t.customerName}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-sm text-emerald-700">
                        ${t.arr.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 max-w-md space-y-1">
                        <div className="font-bold text-xs text-[#37322F]">{t.issueTitle}</div>
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-2.5 rounded-lg text-[11px]">
                          <span className="font-bold text-emerald-800">Resolution Note: </span>
                          {t.resolutionNote}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-[#828387]">{t.closedAt}</td>
                      <td className="py-4 px-6 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Remediated</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* View PRD Modal */}
        {selectedPrd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e0dedb] space-y-5 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-[#e0dedb] pb-4">
                <div>
                  <span className="font-mono text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedPrd.prdId}
                  </span>
                  <h3 className="font-extrabold text-lg text-[#37322F] mt-1">{selectedPrd.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedPrd(null)}
                  className="text-stone-400 hover:text-stone-800 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-[#828387] uppercase tracking-wider text-[10px] mb-1">
                    Executive Summary
                  </h4>
                  <p className="text-[#37322F] bg-[#FAF8F6] p-3 rounded-xl border border-[#e0dedb] leading-relaxed">
                    {selectedPrd.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#828387] uppercase tracking-wider text-[10px] mb-2">
                    User Stories
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedPrd.userStories.map((us, idx) => (
                      <li key={idx} className="bg-amber-50/50 border border-amber-200/60 p-2.5 rounded-lg text-[#37322F]">
                        {us}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-[#828387] uppercase tracking-wider text-[10px] mb-2">
                    Acceptance Criteria
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedPrd.acceptanceCriteria.map((ac, idx) => (
                      <li key={idx} className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-200/60 p-2.5 rounded-lg text-[#37322F]">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{ac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e0dedb] flex justify-end gap-2">
                <button
                  onClick={() => exportPrdMarkdown(selectedPrd)}
                  className="px-4 py-2 bg-[#37322F] text-white font-bold text-xs rounded-lg hover:bg-[#252220] flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Markdown</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DepartmentGuard>
  );
}
