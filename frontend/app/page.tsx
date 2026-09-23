"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

const API_BASE = "http://localhost:5000/api";

// Reference Image 1 & 2 Sparkline Data Streams
const sparkReach = [
  { v: 10 }, { v: 18 }, { v: 14 }, { v: 22 }, { v: 31 }, { v: 28 }, { v: 45 }, { v: 38 }, { v: 50 }
];
const sparkEngage = [
  { v: 30 }, { v: 25 }, { v: 15 }, { v: 20 }, { v: 12 }, { v: 18 }, { v: 9 }, { v: 14 }
];
const sparkRate = [
  { v: 5 }, { v: 12 }, { v: 28 }, { v: 35 }, { v: 42 }, { v: 55 }, { v: 69 }, { v: 80 }
];

const positionTrendData = [
  { day: "Dec 18", visibility: 42 },
  { day: "Dec 25", visibility: 45 },
  { day: "Jan 01", visibility: 48 },
  { day: "Jan 08", visibility: 51 },
  { day: "Jan 13", visibility: 51 }
];

export default function ProductBrainDashboard() {
  const [activeTab, setActiveTab] = useState<"pm" | "sales" | "engineering">("pm");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Clerk User hook
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  // Persona State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [personas, setPersonas] = useState<any[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Data State
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any>(null);
  const [engData, setEngData] = useState<any>(null);
  const [pmData, setPmData] = useState<any>(null);

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [ticketModalTab, setTicketModalTab] = useState<"single" | "bulk">("single");
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isResolving, setIsResolving] = useState(false);

  // PRD Modal
  const [isPrdModalOpen, setIsPrdModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [generatingPrdId, setGeneratingPrdId] = useState<string | null>(null);

  // Ticket Form
  const [newTicket, setNewTicket] = useState({
    customer_id: "",
    product_id: "",
    title: "",
    description: "",
    priority: "High",
    category: "Export Performance",
    technical_logs: ""
  });
  const [rawDocumentText, setRawDocumentText] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);

  const fetchPersonas = async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/personas`);
      setPersonas(res.data.personas || []);
      if (res.data.personas?.length > 0 && !currentUser) {
        const pmPersona = res.data.personas.find((p: any) => p.role === "pm") || res.data.personas[0];
        handlePersonaLogin(pmPersona);
      }
    } catch (err) {
      console.error("Error fetching personas:", err);
    }
  };

  const handlePersonaLogin = async (persona: any) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { personaId: persona.id });
      setCurrentUser(res.data.user);
      setActiveTab(persona.role as "pm" | "sales" | "engineering");
      setIsLoginModalOpen(false);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [metaRes, salesRes, engRes, pmRes] = await Promise.all([
        axios.get(`${API_BASE}/dashboards/meta`),
        axios.get(`${API_BASE}/dashboards/sales`),
        axios.get(`${API_BASE}/dashboards/engineering`),
        axios.get(`${API_BASE}/dashboards/pm`)
      ]);

      setCustomers(metaRes.data.customers || []);
      setProducts(metaRes.data.products || []);
      setSalesData(salesRes.data);
      setEngData(engRes.data);
      setPmData(pmRes.data);

      if (metaRes.data.customers?.length > 0 && !newTicket.customer_id) {
        setNewTicket((prev) => ({
          ...prev,
          customer_id: metaRes.data.customers[0].id,
          product_id: metaRes.data.products[0]?.id || ""
        }));
      }
    } catch (err) {
      console.error("Error fetching ProductBrain data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
    fetchDashboardData();
  }, []);

  const handleCreateSingleTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title || !newTicket.description) return;
    try {
      setSubmittingTicket(true);
      await axios.post(`${API_BASE}/tickets/create`, newTicket);
      setIsSubmitModalOpen(false);
      setNewTicket((prev) => ({ ...prev, title: "", description: "", technical_logs: "" }));
      await fetchDashboardData();
    } catch (err) {
      console.error("Error submitting ticket:", err);
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleBulkDocumentImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawDocumentText) return;
    try {
      setSubmittingTicket(true);
      await axios.post(`${API_BASE}/tickets/bulk-import`, { rawText: rawDocumentText });
      setIsSubmitModalOpen(false);
      setRawDocumentText("");
      await fetchDashboardData();
    } catch (err) {
      console.error("Error bulk importing document:", err);
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: string, note?: string) => {
    try {
      setIsResolving(true);
      await axios.patch(`${API_BASE}/tickets/${ticketId}/status`, {
        status,
        resolution_note: note
      });
      setIsResolveModalOpen(false);
      setSelectedTicket(null);
      setResolutionNote("");
      await fetchDashboardData();
    } catch (err) {
      console.error("Error updating ticket status:", err);
    } finally {
      setIsResolving(false);
    }
  };

  const handleGeneratePrd = async (oppId: string) => {
    try {
      setGeneratingPrdId(oppId);
      const res = await axios.post(`${API_BASE}/opportunities/${oppId}/generate-prd`);
      setSelectedOpportunity(res.data.data);
      setIsPrdModalOpen(true);
      await fetchDashboardData();
    } catch (err) {
      console.error("Error generating PRD:", err);
    } finally {
      setGeneratingPrdId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F3] flex flex-col justify-center items-center font-sans text-[#37322F]">
        <div className="w-10 h-10 border-2 border-[#37322F]/20 border-t-[#37322F] rounded-full animate-spin mb-4"></div>
        <div className="font-semibold text-sm">Loading ProductBrain Enterprise System...</div>
      </div>
    );
  }

  // Reference Image 1 Donut Charts Data
  const siteHealthData = [
    { name: "Healthy Operations", value: 77, color: "#0ea5e9" },
    { name: "Critical Errors", value: 8, color: "#ef4444" },
    { name: "Warnings", value: 15, color: "#f59e0b" }
  ];

  const onPageSeoData = [
    { name: "Strategy", value: 16, color: "#3b82f6" },
    { name: "Backlinks", value: 27, color: "#0ea5e9" },
    { name: "User Experience", value: 9, color: "#a855f7" },
    { name: "Technical SEO", value: 28, color: "#f97316" },
    { name: "SIRP Features", value: 5, color: "#ef4444" },
    { name: "Semantics", value: 22, color: "#84cc16" },
    { name: "Content", value: 43, color: "#22c55e" }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3] text-[#37322F] font-sans antialiased">
      {/* Top Header Bar (Full Length Layout) */}
      <header className="w-full bg-[#F7F5F3] border-b border-[#e0dedb] px-8 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="font-extrabold text-xl tracking-tight text-[#37322F]">ProductBrain</div>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-[#eae7e3] text-[#605a57] rounded border border-[#d8d5d0]">
              Enterprise v1.0
            </span>
          </div>

          {/* Department Role Tabs */}
          <div className="flex items-center bg-[#eae7e3] p-1 rounded-lg border border-[#d8d5d0]">
            <button
              onClick={() => setActiveTab("pm")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "pm"
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605a57] hover:text-[#37322F]"
              }`}
            >
              Program Manager (PM)
            </button>
            <button
              onClick={() => setActiveTab("sales")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "sales"
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605a57] hover:text-[#37322F]"
              }`}
            >
              Sales Department
            </button>
            <button
              onClick={() => setActiveTab("engineering")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "engineering"
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605a57] hover:text-[#37322F]"
              }`}
            >
              Engineering Department
            </button>
          </div>
        </div>

        {/* Right Header Controls (Clerk Auth + Persona Switcher) */}
        <div className="flex items-center gap-4">
          {/* Clerk Auth Integration */}
          <div className="flex items-center gap-2 border-r border-[#e0dedb] pr-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-3 py-1.5 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220] transition-all">
                  Clerk Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Persona Profile Selector */}
          {currentUser && (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-[#e0dedb] rounded-lg hover:bg-[#eae7e3] transition-all text-xs text-[#37322F]"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold">{currentUser.name}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-stone-100 rounded border border-stone-200 text-[#605a57]">
                {currentUser.role}
              </span>
            </button>
          )}

          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="px-3 py-1.5 bg-white border border-[#e0dedb] rounded-lg text-xs font-medium text-[#605a57] hover:text-[#37322F] hover:bg-[#eae7e3] transition-all"
          >
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-[#37322F] hover:bg-[#252220] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-all"
          >
            + Create / Import Ticket
          </button>
        </div>
      </header>

      {/* Main Full-Length Canvas (w-full px-8, No Constrained Container Width) */}
      <main className="w-full px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* 1. PROGRAM MANAGER (PM) DASHBOARD — Exact Mirror of Reference Image 1 */}
        {/* ========================================================================= */}
        {activeTab === "pm" && pmData && (
          <div className="space-y-6">
            {/* Domain Analytics Top Strip (Matching Reference Image 1 Top Row) */}
            <div className="bg-white rounded-xl border border-[#e0dedb] p-5 shadow-xs grid grid-cols-1 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#e0dedb]">
              <div className="pr-4">
                <div className="text-xs font-semibold text-[#605a57] uppercase tracking-wider">Authority Score</div>
                <div className="text-3xl font-extrabold text-[#37322F] mt-1 flex items-baseline gap-2">
                  99 <span className="text-xs font-semibold text-emerald-600">↑ Semrush Rank 120</span>
                </div>
                <div className="text-[11px] text-[#828387] mt-1">Enterprise Product Score</div>
              </div>

              <div className="pt-4 md:pt-0 md:pl-6 pr-4">
                <div className="text-xs font-semibold text-[#605a57] uppercase tracking-wider">Organic Traffic (ARR)</div>
                <div className="text-3xl font-extrabold text-[#0ea5e9] mt-1 flex items-baseline gap-2">
                  18.9M <span className="text-xs font-semibold text-emerald-600">↑ +3.49%</span>
                </div>
                <div className="text-[11px] text-[#828387] mt-1">{formatCurrency(pmData.productHealth.affectedArr)} Affected ARR</div>
              </div>

              <div className="pt-4 md:pt-0 md:pl-6 pr-4">
                <div className="text-xs font-semibold text-[#605a57] uppercase tracking-wider">Organic Keywords (Tickets)</div>
                <div className="text-3xl font-extrabold text-[#37322F] mt-1 flex items-baseline gap-2">
                  6.2M <span className="text-xs font-semibold text-emerald-600">↑ +7.8%</span>
                </div>
                <div className="text-[11px] text-[#828387] mt-1">{pmData.productHealth.openTechnicalTickets} Active Open Incidents</div>
              </div>

              <div className="pt-4 md:pt-0 md:pl-6 pr-4">
                <div className="text-xs font-semibold text-[#605a57] uppercase tracking-wider">Paid Keywords</div>
                <div className="text-3xl font-extrabold text-[#37322F] mt-1 flex items-baseline gap-2">
                  28.8K <span className="text-xs font-semibold text-emerald-600">↑ +12.4%</span>
                </div>
                <div className="text-[11px] text-[#828387] mt-1">Paid Traffic: 2.1K</div>
              </div>

              <div className="pt-4 md:pt-0 md:pl-6">
                <div className="text-xs font-semibold text-[#605a57] uppercase tracking-wider">Ref Domains</div>
                <div className="text-3xl font-extrabold text-[#37322F] mt-1 flex items-baseline gap-2">
                  360.3K <span className="text-xs font-semibold text-emerald-600">↑ +980</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Backlinks: 1.8M</div>
              </div>
            </div>

            {/* Middle Grid: Position Tracking + Site Audit + On Page SEO (Reference Image 1) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Position Tracking Chart & Keywords List (Left Column, Image 1) */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-[#e0dedb] p-5 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
                    <div>
                      <h3 className="font-bold text-sm text-[#37322F]">Position Tracking & Visibility Trend</h3>
                      <p className="text-[11px] text-[#828387]">Updated 30 hours ago | Dec 18, 2023 - Jan 13, 2024</p>
                    </div>
                    <div className="text-xs font-bold text-[#0ea5e9]">Visibility 51% ↑ +0.03%</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {/* Area Chart for Visibility */}
                    <div className="md:col-span-2 h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={positionTrendData}>
                          <defs>
                            <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="day" stroke="#828387" fontSize={10} />
                          <YAxis stroke="#828387" fontSize={10} domain={[0, 100]} />
                          <Tooltip />
                          <Area type="monotone" dataKey="visibility" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#visGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Keywords Breakdown Box (Image 1 Style) */}
                    <div className="space-y-3 bg-[#fbfaf9] p-3 rounded-lg border border-[#e0dedb] text-xs">
                      <div className="font-bold text-[#37322F]">Top Keywords Distribution</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2 rounded border border-[#e0dedb]">
                          <div className="text-[10px] text-[#828387]">Top 3</div>
                          <div className="text-sm font-bold text-emerald-600">21</div>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#e0dedb]">
                          <div className="text-[10px] text-[#828387]">Top 10</div>
                          <div className="text-sm font-bold text-blue-600">41</div>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#e0dedb]">
                          <div className="text-[10px] text-[#828387]">Top 20</div>
                          <div className="text-sm font-bold text-amber-600">43</div>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#e0dedb]">
                          <div className="text-[10px] text-[#828387]">Top 100</div>
                          <div className="text-sm font-bold text-purple-600">43</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e0dedb] flex justify-between items-center text-xs text-[#605a57]">
                  <span>Tracked Keywords: <strong>148</strong></span>
                  <span className="font-semibold text-[#37322F]">View Full Report →</span>
                </div>
              </div>

              {/* Right Column: Site Audit Widget (Image 1 Style) */}
              <div className="bg-white rounded-xl border border-[#e0dedb] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
                    <h3 className="font-bold text-sm text-[#37322F]">Site Audit Health</h3>
                    <span className="text-[11px] text-[#828387]">Mon, Dec 25</span>
                  </div>

                  <div className="flex items-center justify-between py-6">
                    <div className="w-36 h-36 relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={siteHealthData} innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                            {siteHealthData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute text-center">
                        <div className="text-2xl font-extrabold text-[#37322F]">77%</div>
                        <div className="text-[10px] text-[#605a57]">no changes</div>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs flex-1 pl-6">
                      <div>
                        <div className="text-[#828387]">Errors</div>
                        <div className="text-2xl font-extrabold text-rose-600">204</div>
                      </div>
                      <div>
                        <div className="text-[#828387]">Warnings</div>
                        <div className="text-2xl font-extrabold text-amber-600">2,986</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#605a57]">
                      <span>Crawled Pages</span>
                      <strong>200</strong>
                    </div>
                    <div className="w-full bg-[#eae7e3] h-3 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: '77%' }}></div>
                      <div className="bg-rose-500 h-full" style={{ width: '8%' }}></div>
                      <div className="bg-amber-500 h-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e0dedb]">
                  <button className="w-full py-2 bg-[#fbfaf9] hover:bg-[#eae7e3] border border-[#e0dedb] rounded-lg text-xs font-semibold text-[#37322F]">
                    View Full Report
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row Grid: On Page SEO Checker + Backlink Audit (Image 1 Style) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* On Page SEO Checker / Distribution Widget */}
              <div className="bg-white rounded-xl border border-[#e0dedb] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
                    <h3 className="font-bold text-sm text-[#37322F]">On Page SEO & Feature Checker</h3>
                    <span className="text-[11px] text-[#828387]">Updated: Mon, Dec 25</span>
                  </div>

                  <div className="flex items-center justify-between py-6">
                    <div className="w-40 h-40 relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={onPageSeoData} innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value">
                            {onPageSeoData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute text-center">
                        <div className="text-2xl font-extrabold text-[#37322F]">150</div>
                        <div className="text-[10px] text-[#605a57]">Ideas for 27 pages</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs flex-1 pl-6">
                      {onPageSeoData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-[#605a57]">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                            {item.name}
                          </span>
                          <span className="font-bold text-[#37322F]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e0dedb] text-xs text-right font-semibold text-[#37322F]">
                  View Full Report →
                </div>
              </div>

              {/* PM Section: Product Opportunities & Gemini PRD Generator */}
              <div className="bg-white rounded-xl border border-[#e0dedb] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
                    <h3 className="font-bold text-sm text-[#37322F]">Detected Product Opportunities</h3>
                    <span className="text-[11px] font-semibold text-emerald-600">Gemini AI Engine Active</span>
                  </div>

                  <div className="space-y-3 py-4">
                    {pmData.opportunities && pmData.opportunities.map((opp: any) => (
                      <div key={opp.id} className="bg-[#fbfaf9] border border-[#e0dedb] p-4 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#37322F]">{opp.title}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">
                              {opp.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#605a57] mt-1">
                            {opp.ticket_count} tickets | {opp.customer_count} accounts | <strong>{formatCurrency(opp.affected_arr)} ARR</strong>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (opp.prd_content) {
                              setSelectedOpportunity(opp);
                              setIsPrdModalOpen(true);
                            } else {
                              handleGeneratePrd(opp.id);
                            }
                          }}
                          disabled={generatingPrdId === opp.id}
                          className="px-3 py-1.5 bg-[#37322F] text-white hover:bg-[#252220] font-bold text-xs rounded transition-all shrink-0"
                        >
                          {generatingPrdId === opp.id ? "Generating..." : opp.prd_content ? "View PRD" : "1-Click PRD"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e0dedb] text-xs text-right font-semibold text-[#37322F]">
                  View All Opportunities →
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. SALES DEPARTMENT DASHBOARD — Exact Mirror of Reference Image 2 */}
        {/* ========================================================================= */}
        {activeTab === "sales" && salesData && (
          <div className="space-y-6">
            {/* Social-Media Style Channel Summary Bar (Reference Image 2 Top Bar) */}
            <div className="bg-white rounded-xl border border-[#e0dedb] p-4 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button className="px-4 py-1.5 bg-[#37322F] text-white rounded text-xs font-semibold">Overview</button>
                <button className="text-xs font-medium text-[#605a57] hover:text-[#37322F]">Facebook Accounts</button>
                <button className="text-xs font-medium text-[#605a57] hover:text-[#37322F]">Instagram Clients</button>
                <button className="text-xs font-medium text-[#605a57] hover:text-[#37322F]">LinkedIn Enterprise</button>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 border border-[#e0dedb] rounded bg-white text-xs font-medium text-[#605a57]">Export to CSV</button>
                <button className="px-3 py-1.5 border border-[#e0dedb] rounded bg-white text-xs font-medium text-[#605a57]">This year 📅</button>
              </div>
            </div>

            {/* Account Performance & Activity Table with Inline Micro Sparklines (Reference Image 2) */}
            <div className="bg-white rounded-xl border border-[#e0dedb] p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#37322F]">Enterprise Accounts Activity & Churn Radar</h3>
                <p className="text-xs text-[#605a57]">Real-time visibility into post reach, follower growth, engagement rates, and AI customer resolution summaries.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e0dedb] text-xs font-bold text-[#605a57] uppercase tracking-wider bg-[#fbfaf9]">
                      <th className="py-3 px-4">Page / Customer</th>
                      <th className="py-3 px-4">New Followers (ARR)</th>
                      <th className="py-3 px-4">Posts Reach (Sparkline)</th>
                      <th className="py-3 px-4">Posts Engagements</th>
                      <th className="py-3 px-4">Engagement Rate</th>
                      <th className="py-3 px-4">AI Customer Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0dedb] text-sm">
                    {salesData.customerIssues && salesData.customerIssues.map((t: any, idx: number) => {
                      const reachSpark = idx % 2 === 0 ? sparkReach : sparkEngage;
                      const rateSpark = sparkRate;
                      const growthStr = idx % 2 === 0 ? "+33%" : "-51.01%";
                      const isPos = idx % 2 === 0;

                      return (
                        <tr key={t.id} className="hover:bg-[#fbfaf9] transition-colors">
                          <td className="py-4 px-4 font-bold text-[#37322F]">
                            {t.customer?.name || "Acme Corp"}
                            <div className="text-xs font-normal text-[#828387]">Account Owner: {t.customer?.account_owner || "Sales Lead"}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-[#37322F]">{formatCurrency(t.customer?.arr || 0)}</div>
                            <div className={`text-xs font-semibold ${isPos ? "text-emerald-600" : "text-rose-600"}`}>
                              {growthStr}
                            </div>
                          </td>

                          {/* Posts Reach Sparkline (Reference Image 2 Column 2) */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#37322F]">31</span>
                              <span className="text-[11px] font-semibold text-emerald-600">+33%</span>
                              <div className="w-28 h-6">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={reachSpark}>
                                    <Line type="monotone" dataKey="v" stroke="#0ea5e9" strokeWidth={1.5} dot={false} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </td>

                          {/* Posts Engagements Sparkline (Reference Image 2 Column 3) */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#37322F]">181</span>
                              <span className="text-[11px] font-semibold text-emerald-600">+115.48%</span>
                              <div className="w-28 h-6">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={sparkEngage}>
                                    <Line type="monotone" dataKey="v" stroke="#0284c7" strokeWidth={1.5} dot={false} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </td>

                          {/* Engagement Rate Sparkline (Reference Image 2 Column 4) */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#37322F]">69%</span>
                              <span className="text-[11px] font-semibold text-emerald-600">+60%</span>
                              <div className="w-28 h-6">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={rateSpark}>
                                    <Line type="monotone" dataKey="v" stroke="#059669" strokeWidth={1.5} dot={false} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 max-w-xs">
                            {t.ai_customer_summary ? (
                              <div className="bg-emerald-50 border border-emerald-200 p-2 rounded text-xs text-emerald-900 leading-relaxed font-medium">
                                {t.ai_customer_summary}
                              </div>
                            ) : (
                              <span className="text-xs text-[#828387] italic">Pending engineering resolution</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. ENGINEERING DEPARTMENT DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === "engineering" && engData && (
          <div className="space-y-6">
            {/* Engineering Queue Summary */}
            <div className="bg-white rounded-xl border border-[#e0dedb] p-5 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-xs font-semibold text-[#605a57] uppercase">Open Queue</div>
                  <div className="text-2xl font-bold text-[#37322F]">{engData.metrics.openTickets}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#605a57] uppercase">In Progress</div>
                  <div className="text-2xl font-bold text-blue-600">{engData.metrics.inProgress}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#605a57] uppercase">Blocked</div>
                  <div className="text-2xl font-bold text-amber-600">{engData.metrics.blocked}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#605a57] uppercase">Resolved Today</div>
                  <div className="text-2xl font-bold text-emerald-600">{engData.metrics.resolvedToday}</div>
                </div>
              </div>

              <div className="text-xs text-[#828387]">
                Average Resolution Time: <strong>{engData.metrics.avgResolutionTimeHours}h</strong>
              </div>
            </div>

            {/* Technical Ticket Execution Table */}
            <div className="bg-white rounded-xl border border-[#e0dedb] p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#37322F]">Engineering Technical Queue</h3>
                <p className="text-xs text-[#605a57]">Includes stack traces, technical error logs, ARR impact, and Gemini AI auto-notification triggers.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e0dedb] text-xs font-bold text-[#605a57] uppercase tracking-wider bg-[#fbfaf9]">
                      <th className="py-3 px-4">Ticket #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Technical Incident Details</th>
                      <th className="py-3 px-4">Customer ARR</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0dedb] text-sm">
                    {engData.tickets && engData.tickets.map((t: any) => (
                      <tr key={t.id} className="hover:bg-[#fbfaf9] transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-xs text-[#37322F]">#{t.ticket_number || t.id}</td>
                        <td className="py-4 px-4 font-semibold text-[#37322F]">{t.customer?.name || "Acme Corp"}</td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#37322F]">{t.title}</div>
                          <div className="text-xs text-[#605a57] mb-1">{t.description}</div>
                          {t.technical_logs && (
                            <div className="font-mono text-[11px] bg-stone-900 text-stone-200 p-2 rounded border border-stone-800 max-w-xl overflow-x-auto">
                              {t.technical_logs}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 font-bold text-emerald-700">{formatCurrency(t.customer?.arr || 0)}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 text-xs font-bold rounded ${
                              t.priority === "Critical"
                                ? "bg-rose-100 text-rose-800"
                                : t.priority === "High"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded ${
                              t.status === "Resolved"
                                ? "bg-emerald-100 text-emerald-800"
                                : t.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : t.status === "Blocked"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          {t.status !== "In Progress" && t.status !== "Resolved" && (
                            <button
                              onClick={() => handleUpdateTicketStatus(t.id, "In Progress")}
                              className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs rounded transition-all"
                            >
                              Start Work
                            </button>
                          )}

                          {t.status !== "Resolved" && (
                            <button
                              onClick={() => {
                                setSelectedTicket(t);
                                setIsResolveModalOpen(true);
                              }}
                              className="px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs rounded transition-all"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE TICKET & AI BULK DOCUMENT OCR SPLITTER */}
      {/* ========================================================================= */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-[#e0dedb] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
              <h3 className="font-bold text-lg text-[#37322F]">Create or Bulk Import Tickets</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-[#828387] hover:text-[#37322F] font-bold">
                ✕
              </button>
            </div>

            <div className="flex bg-[#eae7e3] p-1 rounded-lg border border-[#d8d5d0]">
              <button
                type="button"
                onClick={() => setTicketModalTab("single")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  ticketModalTab === "single" ? "bg-white text-[#37322F] shadow-xs" : "text-[#605a57]"
                }`}
              >
                Single Ticket Entry
              </button>
              <button
                type="button"
                onClick={() => setTicketModalTab("bulk")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  ticketModalTab === "bulk" ? "bg-white text-[#37322F] shadow-xs" : "text-[#605a57]"
                }`}
              >
                AI Bulk Document & OCR Reader
              </button>
            </div>

            {ticketModalTab === "single" ? (
              <form onSubmit={handleCreateSingleTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Customer Account</label>
                  <select
                    value={newTicket.customer_id}
                    onChange={(e) => setNewTicket({ ...newTicket, customer_id: e.target.value })}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({formatCurrency(c.arr)} ARR)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Target Product</label>
                  <select
                    value={newTicket.product_id}
                    onChange={(e) => setNewTicket({ ...newTicket, product_id: e.target.value })}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Ticket Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Export query timeout for large CSV downloads"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Customer complaint or issue description..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Technical Logs / Stack Trace (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ConnectionTimeoutException at db.driver.js:42"
                    value={newTicket.technical_logs}
                    onChange={(e) => setNewTicket({ ...newTicket, technical_logs: e.target.value })}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-mono text-xs focus:outline-none focus:border-[#37322F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-medium"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                      className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg px-3 py-2 text-sm font-medium"
                    >
                      <option value="Export Performance">Export Performance</option>
                      <option value="Login Problems">Login Problems</option>
                      <option value="API Reliability">API Reliability</option>
                      <option value="Dashboard Lag">Dashboard Lag</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsSubmitModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-[#605a57]">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTicket}
                    className="px-5 py-2 bg-[#37322F] text-white font-bold text-xs rounded-lg"
                  >
                    {submittingTicket ? "Processing..." : "Create Ticket"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleBulkDocumentImport} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">
                    Paste Support Log Document / Incident List
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Paste a multi-ticket support report or email log. ProductBrain AI will read, split, and extract individual tickets automatically..."
                    value={rawDocumentText}
                    onChange={(e) => setRawDocumentText(e.target.value)}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#37322F]"
                    required
                  />
                </div>

                <div className="p-3 bg-[#fbfaf9] rounded-lg border border-[#e0dedb] text-xs text-[#605a57]">
                  <strong>Gemini AI Document Reader:</strong> Automatically detects multiple incidents, extracts customer ARR, assigns priorities, and populates the backlog.
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsSubmitModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-[#605a57]">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTicket}
                    className="px-5 py-2 bg-[#37322F] text-white font-bold text-xs rounded-lg"
                  >
                    {submittingTicket ? "Parsing & Splitting..." : "Import & Split Document"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PERSONA AUTH / SWITCHER */}
      {/* ========================================================================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e0dedb] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
              <h3 className="font-bold text-base text-[#37322F]">Select Department Persona Profile</h3>
              <button onClick={() => setIsLoginModalOpen(false)} className="text-[#828387] font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePersonaLogin(p)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    currentUser?.id === p.id
                      ? "bg-[#37322F] text-white border-black"
                      : "bg-[#fbfaf9] hover:bg-[#eae7e3] text-[#37322F] border-[#e0dedb]"
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className={`text-xs ${currentUser?.id === p.id ? "text-stone-300" : "text-[#605a57]"}`}>{p.title}</div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-stone-200 text-stone-800">
                    {p.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MARK RESOLVED (ENGINEERING) */}
      {/* ========================================================================= */}
      {isResolveModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e0dedb] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0dedb]">
              <h3 className="font-bold text-base text-[#37322F]">Mark Ticket Resolved</h3>
              <button onClick={() => setIsResolveModalOpen(false)} className="text-[#828387] font-bold">
                ✕
              </button>
            </div>

            <div className="bg-[#fbfaf9] p-3 rounded-lg border border-[#e0dedb] text-xs">
              <div className="font-bold text-[#37322F]">{selectedTicket.title}</div>
              <div className="text-[#605a57]">Customer: {selectedTicket.customer?.name} ({formatCurrency(selectedTicket.customer?.arr || 0)} ARR)</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Engineering Resolution Note</label>
              <textarea
                rows={3}
                placeholder="Details on what was fixed..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:border-[#37322F]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button type="button" onClick={() => setIsResolveModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-[#605a57]">
                Cancel
              </button>
              <button
                type="button"
                disabled={isResolving}
                onClick={() => handleUpdateTicketStatus(selectedTicket.id, "Resolved", resolutionNote)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg"
              >
                {isResolving ? "Resolving..." : "Confirm Resolution"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: GEMINI AI PRD STUDIO */}
      {/* ========================================================================= */}
      {isPrdModalOpen && selectedOpportunity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-8 border border-[#e0dedb] shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0dedb]">
              <div>
                <h3 className="font-bold text-xl text-[#37322F]">{selectedOpportunity.title}</h3>
                <p className="text-xs text-[#605a57]">AI-Generated Technical Product Requirement Document (PRD)</p>
              </div>

              <button onClick={() => setIsPrdModalOpen(false)} className="text-[#828387] font-bold text-lg">
                ✕
              </button>
            </div>

            <div className="py-6 overflow-y-auto max-h-[65vh] text-sm text-[#37322F] space-y-4 font-mono leading-relaxed bg-[#fbfaf9] p-6 rounded-xl border border-[#e0dedb] mt-4 whitespace-pre-wrap">
              {selectedOpportunity.prd_content}
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-[#e0dedb] mt-4">
              <div className="text-xs text-[#828387]">
                Generated by <strong>Google Gemini 1.5 Flash</strong>
              </div>

              <button
                onClick={() => setIsPrdModalOpen(false)}
                className="px-6 py-2 bg-[#37322F] text-white font-bold text-xs rounded-lg"
              >
                Close PRD Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
