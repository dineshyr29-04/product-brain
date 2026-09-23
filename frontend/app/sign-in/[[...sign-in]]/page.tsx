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
  Check,
  Eye,
  EyeOff
} from "lucide-react";
import {
  UserRole,
  PRESET_PERSONAS,
  setCurrentUser,
  loginWithCredentials,
  loginAsPersona,
  getTeamMembers
} from "@/lib/authHelper";
import PBLogo from "@/components/PBLogo";

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
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const roleConfigs = {
    pm: {
      label: "Product Manager",
      badge: "Workspace Creator & Admin",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Administers PRD roadmaps, opportunity clusters, and PM team access delegation.",
      redirectUrl: "/dashboard/pm",
      icon: PieChart,
      persona: PRESET_PERSONAS.pm,
      sampleEmail: "sarah.pm@productbrain.io"
    },
    sales: {
      label: "Sales Department",
      badge: "Account Executive View",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      description: "Customer ARR churn radar & plain-English briefings. Requires PM authorization.",
      redirectUrl: "/dashboard/sales",
      icon: Briefcase,
      persona: PRESET_PERSONAS.sales,
      sampleEmail: "michael.sales@productbrain.io"
    },
    engineering: {
      label: "Engineering Team",
      badge: "Staff Engineer / SRE",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      description: "Jira incident queue, stack traces & telemetry. Requires PM authorization.",
      redirectUrl: "/dashboard/engineering",
      icon: Code2,
      persona: PRESET_PERSONAS.engineering,
      sampleEmail: "alex.eng@productbrain.io"
    }
  };

  const currentConfig = roleConfigs[selectedRole];

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

    setSuccessMessage(`Authenticated as ${result.user?.name}! Entering ${currentConfig.label}...`);
    const targetUrl = queryRedirect || currentConfig.redirectUrl;
    setTimeout(() => {
      router.push(targetUrl);
    }, 500);
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
    <div className="min-h-screen bg-white text-[#0F172A] font-sans antialiased grid lg:grid-cols-12 overflow-hidden selection:bg-purple-600 selection:text-white">
      {/* LEFT COLUMN: Clean White Form */}
      <div className="lg:col-span-6 xl:col-span-5 p-6 sm:p-10 lg:p-14 flex flex-col justify-between overflow-y-auto max-h-screen">
        <div>
          {/* Top Brand Monogram */}
          <div className="mb-6 flex items-center justify-between">
            <PBLogo size="lg" textColor="dark" />
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="space-y-1 mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Login to Workspace
            </h1>
            <p className="text-xs text-slate-500">
              Select your department portal and enter your authorized credentials.
            </p>
          </div>

          {/* Department Portal Tabs */}
          <div className="mb-6 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center justify-between">
              <span>Department Portal</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${currentConfig.badgeColor}`}>
                {currentConfig.badge}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 mt-1.5">
              {(["pm", "sales", "engineering"] as UserRole[]).map((role) => {
                const cfg = roleConfigs[role];
                const Icon = cfg.icon;
                const isActive = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${
                      isActive
                        ? role === "pm"
                          ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                          : role === "sales"
                          ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20"
                          : "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20"
                        : "bg-white text-slate-600 border-slate-200/80 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate">{cfg.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Authentication Container */}
          <div className="space-y-4">
            {/* Toggle Direct vs Clerk SSO */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Sign in method</span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                <button
                  type="button"
                  onClick={() => setLoginMethod("direct")}
                  className={`px-3 py-0.5 rounded-md font-semibold transition-all ${
                    loginMethod === "direct"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Direct
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("clerk")}
                  className={`px-3 py-0.5 rounded-md font-semibold transition-all ${
                    loginMethod === "clerk"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Clerk SSO
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {loginMethod === "direct" ? (
              <form onSubmit={handleDirectLogin} className="space-y-4">
                {/* Google SSO Button */}
                <button
                  type="button"
                  onClick={() => handleQuickPersonaLogin(selectedRole)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 font-semibold text-xs text-slate-700 flex items-center justify-center gap-2.5 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] text-slate-400 font-medium shrink-0">
                    Or sign in with email
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-600 transition-all"
                  />
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[240px]">Sample: {currentConfig.sampleEmail}</span>
                    <button
                      type="button"
                      onClick={() => setEmail(currentConfig.sampleEmail)}
                      className="text-purple-600 font-semibold hover:underline shrink-0"
                    >
                      Autofill
                    </button>
                  </div>
                </div>

                {/* Password Input with Visible Toggler */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 focus:outline-none transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Keep me logged in & Forgot password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Keep me logged in</span>
                  </label>
                  <a href="#" className="text-purple-600 hover:underline font-semibold text-[11px]">
                    Forgot password?
                  </a>
                </div>

                {/* Primary Pill Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Login to {currentConfig.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="bg-white rounded-xl p-2 border border-slate-200">
                <SignIn
                  forceRedirectUrl={currentConfig.redirectUrl}
                  fallbackRedirectUrl={currentConfig.redirectUrl}
                />
              </div>
            )}
          </div>

          {/* 1-Click Instant Persona Simulation */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>Instant 1-Click Role Simulation</span>
              </span>
              <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Pre-Approved
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-left">
              <button
                type="button"
                onClick={() => handleQuickPersonaLogin("pm")}
                className="p-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all group"
              >
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-blue-600 truncate">
                  Sarah J.
                </div>
                <div className="text-[10px] text-slate-400 truncate">PM Lead</div>
                <div className="text-[9px] text-blue-600 font-bold mt-0.5">→ Enter PM</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersonaLogin("sales")}
                className="p-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all group"
              >
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-600 truncate">
                  Michael C.
                </div>
                <div className="text-[10px] text-slate-400 truncate">Sales VP</div>
                <div className="text-[9px] text-emerald-600 font-bold mt-0.5">→ Enter Sales</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersonaLogin("engineering")}
                className="p-2 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 transition-all group"
              >
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-purple-600 truncate">
                  Alex R.
                </div>
                <div className="text-[10px] text-slate-400 truncate">Staff Eng</div>
                <div className="text-[9px] text-purple-600 font-bold mt-0.5">→ Enter Eng</div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Switch Link */}
        <div className="pt-6 text-center text-xs text-slate-500">
          <span>Don't have an account? </span>
          <Link href="/sign-up" className="text-purple-600 font-bold hover:underline">
            Sign up free
          </Link>
        </div>
      </div>

      {/* RIGHT COLUMN: Feature Showcase */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900 pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Product Operations Engine</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Unify Customer Escalations, Revenue Risk & Engineering Triage
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            ProductBrain connects support defects directly to contract ARR value, enabling PMs to cluster issues, generate 1-click executive PRDs, and automate customer briefings.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">PM Strategy & PRD Automation</div>
                <div className="text-[11px] text-slate-400">
                  Synthesize high-ARR customer feedback into structured PRDs instantly.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">Sales & CS Churn Radar</div>
                <div className="text-[11px] text-slate-400">
                  Track contract ARR exposure and dispatch plain-English client briefings.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">Engineering Sprint Triage</div>
                <div className="text-[11px] text-slate-400">
                  Inspect exception stack traces and resolve high-ARR defects first.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>© 2026 ProductBrain Inc.</span>
          <span>Enterprise Product Operations v1.0</span>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-xs font-bold">Loading Login...</div>}>
      <SignInContent />
    </Suspense>
  );
}
