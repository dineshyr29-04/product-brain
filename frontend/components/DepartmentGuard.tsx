"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, ArrowRight, LogOut, ArrowLeft, Users } from "lucide-react";
import { useDepartmentAuth, UserRole } from "@/lib/authHelper";

interface DepartmentGuardProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

export default function DepartmentGuard({ requiredRole, children }: DepartmentGuardProps) {
  const router = useRouter();
  const { isLoading, isAuthorized, currentUser, denialReason, signOut } = useDepartmentAuth(requiredRole);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F5F3] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#37322F] text-white flex items-center justify-center font-bold text-lg mb-4 animate-pulse">
          PB
        </div>
        <h2 className="text-base font-bold text-[#37322F]">Verifying Department Authorization...</h2>
        <p className="text-xs text-[#828387] mt-1 max-w-sm">
          Checking PM access grants and role credentials for {requiredRole.toUpperCase()} workspace.
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    const roleLabels = {
      pm: "Product Manager Workspace",
      sales: "Sales Radar",
      engineering: "Engineering Backlog"
    };

    const myDashboardUrl = currentUser?.role === "sales" ? "/dashboard/sales" : "/dashboard/engineering";
    const myDashboardLabel = currentUser?.role === "sales" ? "Sales Radar" : "Engineering Backlog";

    return (
      <div className="min-h-screen bg-[#080C16] text-[#E2E8F0] flex flex-col items-center justify-center p-6 selection:bg-blue-600 selection:text-white">
        <div className="max-w-md w-full bg-[#0B101D] border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center shadow-lg shadow-red-500/10">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
              Department Isolation Active
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Access Restricted
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {denialReason || `This workspace is restricted to ${roleLabels[requiredRole]}. Workspaces are strictly separated by department.`}
            </p>
          </div>

          {currentUser && (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Session:</div>
              <div className="font-semibold text-white flex items-center justify-between">
                <span>{currentUser.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-cyan-300">
                  {currentUser.role.toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{currentUser.email}</div>
            </div>
          )}

          <div className="space-y-2 pt-2">
            {currentUser && currentUser.role !== requiredRole && (
              <Link
                href={myDashboardUrl}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <span>Go to Your {myDashboardLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              onClick={signOut}
              className="w-full py-2 px-4 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Role / Log In Again</span>
            </button>

            <Link
              href="/"
              className="block text-center text-xs text-slate-400 hover:text-white pt-2 transition-colors"
            >
              ← Back to Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
