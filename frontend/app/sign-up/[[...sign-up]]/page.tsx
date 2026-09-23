"use client";

import React, { useState, Suspense } from "react";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Shield,
  Briefcase,
  Code2,
  PieChart,
  ArrowLeft,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { UserRole } from "@/lib/authHelper";

function SignUpContent() {
  const searchParams = useSearchParams();
  const queryRole = searchParams.get("role") as UserRole | null;

  const [selectedRole, setSelectedRole] = useState<UserRole>(
    queryRole && (queryRole === "pm" || queryRole === "sales" || queryRole === "engineering")
      ? queryRole
      : "pm"
  );

  const roleConfigs = {
    pm: {
      label: "Product Manager",
      badge: "Workspace Creator",
      redirectUrl: "/dashboard/pm",
      icon: PieChart
    },
    sales: {
      label: "Sales Team",
      badge: "Account Executive",
      redirectUrl: "/dashboard/sales",
      icon: Briefcase
    },
    engineering: {
      label: "Engineering Team",
      badge: "Software Engineer",
      redirectUrl: "/dashboard/engineering",
      icon: Code2
    }
  };

  const currentConfig = roleConfigs[selectedRole];

  return (
    <div className="min-h-screen bg-[#080C16] text-[#E2E8F0] flex flex-col justify-center items-center p-6 selection:bg-blue-600 selection:text-white font-sans antialiased relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-indigo-900/10 to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="mb-6 text-center max-w-md w-full">
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
          Create an enterprise account and claim your department workspace
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="w-full max-w-md mb-5 bg-[#0B101D] border border-slate-800 rounded-2xl p-2 shadow-xl backdrop-blur-md">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center justify-between">
          <span>Register As</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-300 border border-blue-500/20">
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
                onClick={() => {
                  setSelectedRole(role);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("pb_user_role", role);
                  }
                }}
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
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-2 border border-slate-800 overflow-hidden">
        <SignUp
          forceRedirectUrl={currentConfig.redirectUrl}
          fallbackRedirectUrl={currentConfig.redirectUrl}
        />
      </div>

      <div className="mt-4 text-xs text-slate-400 flex items-center gap-4">
        <Link href={`/sign-in?role=${selectedRole}`} className="text-cyan-400 hover:underline flex items-center gap-1">
          <span>Already registered? Sign In</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
        <span>•</span>
        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080C16] text-[#E2E8F0] flex items-center justify-center">
          <div className="text-xs text-slate-400 animate-pulse">Loading Registration...</div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
