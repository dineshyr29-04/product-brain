"use client";

import React, { useState, useEffect, Suspense } from "react";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  Briefcase,
  Code2,
  PieChart,
  ArrowRight,
  CheckCircle2,
  Users,
  Lock,
  ArrowLeft,
  Mail,
  Key,
  AlertCircle,
  Sparkles,
  Check
} from "lucide-react";
import {
  UserRole,
  PRESET_PERSONAS,
  setCurrentUser,
  loginWithCredentials,
  loginAsPersona,
  getTeamMembers
} from "@/lib/authHelper";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryRole = searchParams.get("role") as UserRole | null;
  const queryRedirect = searchParams.get("redirect");

  const [selectedRole, setSelectedRole] = useState<UserRole>(
    queryRole && (queryRole === "pm" || queryRole === "sales" || queryRole === "engineering")
      ? queryRole
      : "pm"
  );

  const [loginMethod, setLoginMethod] = useState<"direct" | "clerk">("direct");
  const [email, setEmail] = useState(PRESET_PERSONAS[selectedRole].email);
  const [password, setPassword] = useState("••••••••");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const roleConfigs = {
    pm: {
      label: "Product Manager",
      badge: "Workspace Owner & Admin",
      badgeColor: "bg-blue-500/20 text-cyan-300 border-blue-500/30",
      description: "Administers PRD roadmaps, opportunity clusters, and PM team access delegation.",
      redirectUrl: "/dashboard/pm",
      icon: PieChart,
      persona: PRESET_PERSONAS.pm,
      sampleEmail: "sarah.pm@productbrain.io"
    },
    sales: {
      label: "Sales Department",
      badge: "Account Executive View",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      description: "Customer ARR churn radar & plain-English briefings. Requires PM authorization.",
      redirectUrl: "/dashboard/sales",
      icon: Briefcase,
      persona: PRESET_PERSONAS.sales,
      sampleEmail: "michael.sales@productbrain.io"
    },
    engineering: {
      label: "Engineering Team",
      badge: "Staff Engineer / SRE",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      description: "Jira incident queue, stack traces & telemetry. Requires PM authorization.",
      redirectUrl: "/dashboard/engineering",
      icon: Code2,
      persona: PRESET_PERSONAS.engineering,
      sampleEmail: "alex.eng@productbrain.io"
    }
  };

  const currentConfig = roleConfigs[selectedRole];

  // Update sample email when role changes
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(roleConfigs[role].sampleEmail);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (typeof window !== "undefined") {
      localStorage.setItem("pb_user_role", role);
    }
  };

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = loginWithCredentials(email, selectedRole, password);
    if (!result.success) {
      setErrorMessage(result.error || "Login failed. Check your department authorization.");
      return;
    }

    setSuccessMessage(`Authenticated as ${result.user?.name}! Loading ${currentConfig.label} portal...`);
    const targetUrl = queryRedirect || currentConfig.redirectUrl;
    setTimeout(() => {
      router.push(targetUrl);
    }, 600);
  };

  const handleQuickPersonaLogin = (role: UserRole) => {
    const persona = loginAsPersona(role);
    setSelectedRole(role);
    setSuccessMessage(`Authenticated as ${persona.name}! Entering ${role.toUpperCase()} Workspace...`);
    const targetUrl = queryRedirect || roleConfigs[role].redirectUrl;
    setTimeout(() => {
      router.push(targetUrl);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#080C16] text-[#E2E8F0] flex flex-col justify-center items-center p-6 selection:bg-blue-600 selection:text-white font-sans antialiased relative overflow-hidden">
      {/* Radiant Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-indigo-900/10 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Brand Header */}
      <div className="mb-5 text-center max-w-md w-full">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0A0F1D] rounded-[10px] flex items-center justify-center font-bold text-white text-base">
              PB
            </div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            ProductBrain
          </span>
        </Link>
        <p className="text-xs text-slate-400">
          Enterprise Product Intelligence • Department Access Gate
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="w-full max-w-md mb-4 bg-[#0B101D] border border-slate-800 rounded-2xl p-2 shadow-xl backdrop-blur-md">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center justify-between">
          <span>1. Select Department Portal</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${currentConfig.badgeColor}`}>
            {currentConfig.badge}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mt-2">
          {(["pm", "sales", "engineering"] as UserRole[]).map((role) => {
            const cfg = roleConfigs[role];
            const Icon = cfg.icon;
            const isActive = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all border ${
                  isActive
                    ? role === "pm"
                      ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30"
                      : role === "sales"
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30"
                      : "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{cfg.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
          <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>{currentConfig.description}</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-[#0B101D] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Login Method Toggle */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            2. Sign In to {currentConfig.label}
          </div>
          <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setLoginMethod("direct")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                loginMethod === "direct"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Direct
            </button>
            <button
              onClick={() => setLoginMethod("clerk")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                loginMethod === "clerk"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Clerk SSO
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {loginMethod === "direct" ? (
          <form onSubmit={handleDirectLogin} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Authorized Department Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={currentConfig.sampleEmail}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {selectedRole === "pm"
                    ? "PM Admin: sarah.pm@productbrain.io"
                    : selectedRole === "sales"
                    ? "Approved: michael.sales@productbrain.io, elena@beta.com"
                    : "Approved: alex.eng@productbrain.io, david@delta.com"}
                </span>
                <button
                  type="button"
                  onClick={() => setEmail(currentConfig.sampleEmail)}
                  className="text-cyan-400 hover:underline"
                >
                  Autofill
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                selectedRole === "pm"
                  ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
                  : selectedRole === "sales"
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                  : "bg-purple-600 hover:bg-purple-500 shadow-purple-600/30"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Enter {currentConfig.label} Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-xl p-2 border border-slate-800 overflow-hidden">
            <SignIn
              forceRedirectUrl={currentConfig.redirectUrl}
              fallbackRedirectUrl={currentConfig.redirectUrl}
            />
          </div>
        )}
      </div>

      {/* 1-Click Instant Persona Logins */}
      <div className="w-full max-w-md mt-4 p-4 rounded-2xl bg-[#0B101D] border border-slate-800 shadow-lg text-center space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
          <span className="font-semibold flex items-center gap-1.5 text-slate-300">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Instant Role Simulation (1-Click)</span>
          </span>
          <span className="text-[10px] text-cyan-400">Pre-Approved</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleQuickPersonaLogin("pm")}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-blue-950/80 border border-blue-900/40 hover:border-blue-500/60 transition-all text-left group"
          >
            <div className="text-[11px] font-bold text-white group-hover:text-cyan-400 truncate">Sarah J.</div>
            <div className="text-[10px] text-slate-400 truncate">PM Lead</div>
            <div className="text-[9px] text-cyan-400 font-semibold mt-1">→ Enter PM</div>
          </button>

          <button
            onClick={() => handleQuickPersonaLogin("sales")}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-emerald-950/80 border border-emerald-900/40 hover:border-emerald-500/60 transition-all text-left group"
          >
            <div className="text-[11px] font-bold text-white group-hover:text-emerald-400 truncate">Michael C.</div>
            <div className="text-[10px] text-slate-400 truncate">Sales VP</div>
            <div className="text-[9px] text-emerald-400 font-semibold mt-1">→ Enter Sales</div>
          </button>

          <button
            onClick={() => handleQuickPersonaLogin("engineering")}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-purple-950/80 border border-purple-900/40 hover:border-purple-500/60 transition-all text-left group"
          >
            <div className="text-[11px] font-bold text-white group-hover:text-purple-400 truncate">Alex R.</div>
            <div className="text-[10px] text-slate-400 truncate">Staff Eng</div>
            <div className="text-[9px] text-purple-400 font-semibold mt-1">→ Enter Eng</div>
          </button>
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-5 text-xs text-slate-500">
        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080C16] text-[#E2E8F0] flex items-center justify-center">
          <div className="text-xs text-slate-400 animate-pulse">Loading Department Portal...</div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
