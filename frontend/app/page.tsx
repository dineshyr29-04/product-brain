"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlusCircle,
  Sparkles,
  Users,
  Building2,
  FileText,
  ChevronRight,
  RefreshCw,
  Search,
  Check,
  X,
  Layers,
  BarChart3,
  ShieldAlert,
  UserCheck,
  LogOut,
  Lock
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

export default function ProductBrainDashboard() {
  const [activeTab, setActiveTab] = useState<"sales" | "engineering" | "pm">("pm");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Persona Auth State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [personas, setPersonas] = useState<any[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Metadata
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Dashboard Data
  const [salesData, setSalesData] = useState<any>(null);
  const [engData, setEngData] = useState<any>(null);
  const [pmData, setPmData] = useState<any>(null);

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isResolving, setIsResolving] = useState(false);

  // PRD Modal
  const [isPrdModalOpen, setIsPrdModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [generatingPrdId, setGeneratingPrdId] = useState<string | null>(null);

  // New Ticket Form State
  const [newTicket, setNewTicket] = useState({
    customer_id: "",
    product_id: "",
    title: "",
    description: "",
    priority: "High",
    category: "Export Performance"
  });
  const [submittingTicket, setSubmittingTicket] = useState(false);

  const fetchPersonas = async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/personas`);
      setPersonas(res.data.personas || []);
      if (res.data.personas?.length > 0 && !currentUser) {
        // Default login as Product Manager
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
      setActiveTab(persona.role as "sales" | "engineering" | "pm");
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

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title || !newTicket.description) return;
    try {
      setSubmittingTicket(true);
      await axios.post(`${API_BASE}/tickets/create`, newTicket);
      setIsSubmitModalOpen(false);
      setNewTicket((prev) => ({ ...prev, title: "", description: "" }));
      await fetchDashboardData();
    } catch (err) {
      console.error("Error submitting ticket:", err);
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
        <div className="w-12 h-12 border-4 border-[#37322F]/20 border-t-[#37322F] rounded-full animate-spin mb-4"></div>
        <div className="font-semibold text-lg">Loading ProductBrain Intelligence Engine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F3] text-[#37322F] font-sans">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-[#F7F5F3]/90 backdrop-blur-md border-b border-[#e0dedb]">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#37322F] rounded-xl flex items-center justify-center text-white shadow-sm">
              <Brain className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight flex items-center gap-2">
                ProductBrain <span className="text-xs px-2 py-0.5 bg-black/5 text-[#37322F] rounded-full font-mono border border-black/10">V1</span>
              </div>
              <div className="text-xs text-[#605a57]">Enterprise Product Intelligence Platform</div>
            </div>
          </div>

          {/* Role Navigation Tabs */}
          <div className="flex items-center bg-[#eae7e3] p-1 rounded-xl border border-[#d8d5d0]">
            <button
              onClick={() => setActiveTab("pm")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "pm"
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605a57] hover:text-[#37322F]"
              }`}
            >
              <Brain className="w-3.5 h-3.5" /> PM Command Center
            </button>
            <button
              onClick={() => setActiveTab("sales")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "sales"
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605a57] hover:text-[#37322F]"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> Sales & Revenue View
            </button>
            <button
              onClick={() => setActiveTab("engineering")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "engineering"
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605a57] hover:text-[#37322F]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Engineering Queue
            </button>
          </div>

          {/* Active Persona Badge & Actions */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e0dedb] rounded-xl hover:bg-[#eae7e3] transition-all text-xs font-medium text-[#37322F]"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="font-semibold">{currentUser.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 rounded-full border border-stone-200 uppercase font-mono text-[#605a57]">
                  {currentUser.role}
                </span>
              </button>
            )}

            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="p-2 rounded-lg bg-white border border-[#e0dedb] text-[#605a57] hover:text-[#37322F] hover:bg-[#eae7e3] transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-[#37322F] hover:bg-[#252220] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" /> + Customer Ticket
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        {/* ========================================================================= */}
        {/* PM DASHBOARD VIEW */}
        {/* ========================================================================= */}
        {activeTab === "pm" && pmData && (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#828387] mb-3">Product Health Overview</div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#e0dedb] shadow-xs">
                  <div className="text-xs text-[#605a57] font-medium mb-1">Affected Customer ARR</div>
                  <div className="text-2xl font-extrabold text-rose-600">{formatCurrency(pmData.productHealth.affectedArr)}</div>
                  <div className="text-xs text-[#828387] mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Tied to {pmData.productHealth.customersWithOpenIssues} open accounts
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#e0dedb] shadow-xs">
                  <div className="text-xs text-[#605a57] font-medium mb-1">Open Technical Tickets</div>
                  <div className="text-2xl font-extrabold text-[#37322F]">{pmData.productHealth.openTechnicalTickets}</div>
                  <div className="text-xs text-[#828387] mt-2 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> {pmData.productHealth.criticalIssues} Critical | {pmData.productHealth.highPriorityIssues} High
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#e0dedb] shadow-xs">
                  <div className="text-xs text-[#605a57] font-medium mb-1">Total Customer Accounts</div>
                  <div className="text-2xl font-extrabold text-[#37322F]">{pmData.productHealth.totalCustomers.toLocaleString()}</div>
                  <div className="text-xs text-[#828387] mt-2 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" /> Active B2B enterprise tier
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#e0dedb] shadow-xs">
                  <div className="text-xs text-[#605a57] font-medium mb-1">Avg Resolution Time</div>
                  <div className="text-2xl font-extrabold text-[#37322F]">{pmData.productHealth.avgResolutionTimeHours}h</div>
                  <div className="text-xs text-[#828387] mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {pmData.productHealth.resolvedThisMonth} resolved this month
                  </div>
                </div>
              </div>
            </div>

            {/* Product Opportunities Section (Gemini AI Detection) */}
            <div className="bg-gradient-to-br from-[#37322F] to-[#1c1917] rounded-3xl p-6 text-white shadow-lg border border-black/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Product Opportunities Detected by ProductBrain</h3>
                    <p className="text-xs text-stone-300">
                      ProductBrain automatically aggregates recurring customer issues with high $ ARR impact into strategic PRD opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {pmData.opportunities && pmData.opportunities.map((opp: any) => (
                  <div key={opp.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30">
                          {opp.status}
                        </span>
                        <span className="text-sm font-extrabold text-emerald-400">{formatCurrency(opp.affected_arr)} ARR</span>
                      </div>
                      <h4 className="font-bold text-base mb-2">{opp.title}</h4>
                      <div className="text-xs text-stone-300 space-y-1 mb-4">
                        <div>• <strong>{opp.ticket_count}</strong> related support tickets logged</div>
                        <div>• <strong>{opp.customer_count}</strong> high-tier enterprise accounts affected</div>
                        <div>• <strong>Product Area:</strong> {opp.product?.name || "Core Platform"}</div>
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
                      className="w-full py-2.5 px-4 bg-white text-[#37322F] hover:bg-stone-100 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
                    >
                      {generatingPrdId === opp.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#37322F]" />
                          Generating Gemini PRD...
                        </>
                      ) : opp.prd_content ? (
                        <>
                          <FileText className="w-4 h-4 text-emerald-600" /> View PRD Document
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-500" /> 1-Click Generate PRD (Gemini AI)
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Issues Breakdown Table */}
            <div className="bg-white rounded-2xl border border-[#e0dedb] p-6 shadow-xs">
              <h3 className="font-bold text-base mb-4 text-[#37322F] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" /> Revenue Impact by Product Area
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e0dedb] text-xs font-bold text-[#605a57] uppercase tracking-wider bg-[#fbfaf9]">
                      <th className="py-3 px-4">Product Module</th>
                      <th className="py-3 px-4">Open Tickets</th>
                      <th className="py-3 px-4">Customers Affected</th>
                      <th className="py-3 px-4">Affected ARR</th>
                      <th className="py-3 px-4">Impact Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0dedb] text-sm">
                    {pmData.productBreakdown && pmData.productBreakdown.map((prod: any) => (
                      <tr key={prod.product_id} className="hover:bg-[#fbfaf9] transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#37322F]">{prod.product_name}</td>
                        <td className="py-3.5 px-4 font-medium">{prod.open_tickets} tickets</td>
                        <td className="py-3.5 px-4 font-medium">{prod.customers_affected} accounts</td>
                        <td className="py-3.5 px-4 font-bold text-rose-600">{formatCurrency(prod.affected_arr)}</td>
                        <td className="py-3.5 px-4">
                          <div className="w-36 bg-[#eae7e3] rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#37322F] h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (prod.affected_arr / (pmData.productHealth.affectedArr || 1)) * 100
                                )}%`
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SALES DASHBOARD VIEW */}
        {/* ========================================================================= */}
        {activeTab === "sales" && salesData && (
          <div className="space-y-8">
            {/* Sales Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#e0dedb] shadow-xs">
                <div className="text-xs text-[#605a57] font-medium mb-1">Customers with Issues</div>
                <div className="text-2xl font-extrabold text-[#37322F]">{salesData.metrics.totalCustomersWithIssues}</div>
                <div className="text-xs text-[#828387] mt-2">Active enterprise contracts</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e0dedb] shadow-xs">
                <div className="text-xs text-[#605a57] font-medium mb-1">Total Affected ARR</div>
                <div className="text-2xl font-extrabold text-rose-600">{formatCurrency(salesData.metrics.affectedArr)}</div>
                <div className="text-xs text-rose-500 mt-2 font-medium">Revenue requiring engineering attention</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e0dedb] shadow-xs">
                <div className="text-xs text-[#605a57] font-medium mb-1">Open Issues</div>
                <div className="text-2xl font-extrabold text-[#37322F]">{salesData.metrics.openIssuesCount}</div>
                <div className="text-xs text-[#828387] mt-2">{salesData.metrics.criticalIssuesCount} Critical severity</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e0dedb] shadow-xs">
                <div className="text-xs text-[#605a57] font-medium mb-1">Resolved This Week</div>
                <div className="text-2xl font-extrabold text-emerald-600">{salesData.metrics.resolvedThisWeekCount}</div>
                <div className="text-xs text-emerald-600 mt-2 font-medium">Customers auto-updated</div>
              </div>
            </div>

            {/* Sales Customer Issues Table */}
            <div className="bg-white rounded-2xl border border-[#e0dedb] p-6 shadow-xs">
              <div className="mb-4">
                <h3 className="font-bold text-base text-[#37322F]">Which of my customers are currently having problems?</h3>
                <p className="text-xs text-[#605a57]">Real-time visibility into customer-impacting tickets and automated resolution notifications.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e0dedb] text-xs font-bold text-[#605a57] uppercase tracking-wider bg-[#fbfaf9]">
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">ARR Value</th>
                      <th className="py-3 px-4">Issue Title</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">AI Resolution Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0dedb] text-sm">
                    {salesData.customerIssues && salesData.customerIssues.map((t: any) => (
                      <tr key={t.id} className="hover:bg-[#fbfaf9] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#37322F]">
                          {t.customer?.name || "Acme Corp"}
                          <div className="text-xs font-normal text-[#828387]">Owner: {t.customer?.account_owner || "Sales Team"}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">{formatCurrency(t.customer?.arr || 0)}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#37322F]">{t.title}</div>
                          <div className="text-xs text-[#605a57]">{t.description}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              t.priority === "Critical"
                                ? "bg-rose-100 text-rose-700"
                                : t.priority === "High"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              t.status === "Resolved"
                                ? "bg-emerald-100 text-emerald-800"
                                : t.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          {t.ai_customer_summary ? (
                            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-900 leading-relaxed font-medium">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
                              {t.ai_customer_summary}
                            </div>
                          ) : (
                            <span className="text-xs text-[#828387] italic">Pending engineering resolution</span>
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

        {/* ========================================================================= */}
        {/* ENGINEERING DASHBOARD VIEW */}
        {/* ========================================================================= */}
        {activeTab === "engineering" && engData && (
          <div className="space-y-8">
            {/* Engineering Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#e0dedb] shadow-xs">
                <div className="text-xs text-[#605a57] font-medium mb-1">Open Queue</div>
                <div className="text-2xl font-extrabold text-[#37322F]">{engData.metrics.openTickets}</div>
                <div className="text-xs text-[#828387] mt-2">Awaiting sprint pickup</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e0dedb] shadow-xs">
                <div className="text-xs text-[#605a57] font-medium mb-1">In Progress</div>
                <div className="text-2xl font-extrabold text-blue-600">{engData.metrics.inProgress}</div>
                <div className="text-xs text-blue-600 mt-2 font-medium">Active engineering work</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e0dedb] shadow-xs">
                <div className="text-xs text-[#605a57] font-medium mb-1">Blocked</div>
                <div className="text-2xl font-extrabold text-amber-600">{engData.metrics.blocked}</div>
                <div className="text-xs text-amber-600 mt-2 font-medium">Requires external info</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e0dedb] shadow-xs">
                <div className="text-xs text-[#605a57] font-medium mb-1">Resolved Today</div>
                <div className="text-2xl font-extrabold text-emerald-600">{engData.metrics.resolvedToday}</div>
                <div className="text-xs text-emerald-600 mt-2 font-medium">Auto-notified to Sales</div>
              </div>
            </div>

            {/* Engineering Ticket Queue */}
            <div className="bg-white rounded-2xl border border-[#e0dedb] p-6 shadow-xs">
              <div className="mb-4">
                <h3 className="font-bold text-base text-[#37322F]">Engineering Execution Queue</h3>
                <p className="text-xs text-[#605a57]">Tickets automatically attached with Customer ARR & Priority. Changing status to Resolved triggers Gemini AI notification.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e0dedb] text-xs font-bold text-[#605a57] uppercase tracking-wider bg-[#fbfaf9]">
                      <th className="py-3 px-4">Ticket</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Issue Description</th>
                      <th className="py-3 px-4">Customer ARR</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0dedb] text-sm">
                    {engData.tickets && engData.tickets.map((t: any) => (
                      <tr key={t.id} className="hover:bg-[#fbfaf9] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#37322F]">#{t.ticket_number || t.id}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#37322F]">{t.customer?.name || "Acme Corp"}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#37322F]">{t.title}</div>
                          <div className="text-xs text-[#605a57]">{t.description}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">{formatCurrency(t.customer?.arr || 0)}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              t.priority === "Critical"
                                ? "bg-rose-100 text-rose-700"
                                : t.priority === "High"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
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
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {t.status !== "In Progress" && t.status !== "Resolved" && (
                            <button
                              onClick={() => handleUpdateTicketStatus(t.id, "In Progress")}
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs rounded-lg transition-all"
                            >
                              Start
                            </button>
                          )}

                          {t.status !== "Resolved" && (
                            <button
                              onClick={() => {
                                setSelectedTicket(t);
                                setIsResolveModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs rounded-lg transition-all"
                            >
                              ✓ Mark Resolved
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
      {/* MODAL: PERSONA AUTH / SWITCHER */}
      {/* ========================================================================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#e0dedb] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#37322F] flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" /> Switch Persona Profile
              </h3>
              <button onClick={() => setIsLoginModalOpen(false)} className="text-[#828387] hover:text-[#37322F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#605a57] mb-4">Select an enterprise persona profile to experience ProductBrain V1 from their perspective.</p>

            <div className="space-y-3">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePersonaLogin(p)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    currentUser?.id === p.id
                      ? "bg-[#37322F] text-white border-black"
                      : "bg-[#fbfaf9] hover:bg-[#eae7e3] text-[#37322F] border-[#e0dedb]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden shrink-0">
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{p.name}</div>
                      <div className={`text-xs ${currentUser?.id === p.id ? "text-stone-300" : "text-[#605a57]"}`}>{p.title}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                      currentUser?.id === p.id
                        ? "bg-amber-400 text-black"
                        : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {p.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SUBMIT CUSTOMER TICKET */}
      {/* ========================================================================= */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#e0dedb] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#37322F] flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" /> Submit Customer Technical Issue
              </h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-[#828387] hover:text-[#37322F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Select Customer Account</label>
                <select
                  value={newTicket.customer_id}
                  onChange={(e) => setNewTicket({ ...newTicket, customer_id: e.target.value })}
                  className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#37322F]"
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
                  className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Export failing for datasets > 50MB"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide technical error details or customer complaint..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Issue Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                  >
                    <option value="Export Performance">Export Performance</option>
                    <option value="Login Problems">Login Problems</option>
                    <option value="API Reliability">API Reliability</option>
                    <option value="Dashboard Lag">Dashboard Lag</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#605a57] hover:text-[#37322F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="px-5 py-2.5 bg-[#37322F] text-white hover:bg-[#252220] text-xs font-bold rounded-xl shadow-xs"
                >
                  {submittingTicket ? "Enriching Ticket..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RESOLVE TICKET (ENGINEERING) */}
      {/* ========================================================================= */}
      {isResolveModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#e0dedb] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#37322F] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Mark Ticket Resolved
              </h3>
              <button onClick={() => setIsResolveModalOpen(false)} className="text-[#828387] hover:text-[#37322F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#fbfaf9] p-3 rounded-xl border border-[#e0dedb] mb-4 text-xs">
              <div className="font-bold text-[#37322F]">{selectedTicket.title}</div>
              <div className="text-[#605a57]">Customer: {selectedTicket.customer?.name} ({formatCurrency(selectedTicket.customer?.arr || 0)} ARR)</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#605a57] uppercase mb-1">Engineering Resolution Note</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Increased export query timeout threshold and optimized database indexes."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full bg-[#fbfaf9] border border-[#e0dedb] rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#37322F]"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Gemini AI Auto-Dispatch:</strong> ProductBrain will generate a customer-facing summary and update Sales automatically upon resolving.
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#605a57]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isResolving}
                  onClick={() => handleUpdateTicketStatus(selectedTicket.id, "Resolved", resolutionNote)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {isResolving ? "Resolving & Notifying AI..." : "✓ Confirm Resolution"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: GEMINI AI PRD STUDIO */}
      {/* ========================================================================= */}
      {isPrdModalOpen && selectedOpportunity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 border border-[#e0dedb] shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0dedb]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-600 rounded-xl border border-amber-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#37322F]">{selectedOpportunity.title}</h3>
                  <p className="text-xs text-[#605a57]">AI-Generated Technical Product Requirement Document (PRD)</p>
                </div>
              </div>

              <button onClick={() => setIsPrdModalOpen(false)} className="text-[#828387] hover:text-[#37322F]">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-6 overflow-y-auto max-h-[65vh] text-sm text-[#37322F] space-y-4 font-mono leading-relaxed bg-[#fbfaf9] p-6 rounded-2xl border border-[#e0dedb] mt-4 whitespace-pre-wrap">
              {selectedOpportunity.prd_content}
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-[#e0dedb] mt-4">
              <div className="text-xs text-[#828387]">
                Generated by <strong>Google Gemini 1.5 Flash</strong> for ProductBrain V1
              </div>

              <button
                onClick={() => setIsPrdModalOpen(false)}
                className="px-6 py-2.5 bg-[#37322F] text-[#ffffff] hover:bg-[#252220] text-xs font-bold rounded-xl"
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
