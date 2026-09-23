"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  RefreshCw,
  Plus,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import PBLogo from "@/components/PBLogo";
import { getCurrentUser, logoutUser, UserProfile } from "@/lib/authHelper";

interface PMNavHeaderProps {
  activeTab: "overview" | "telemetry" | "prds" | "members";
  onBaselineZero?: () => void;
  onLoadDemoData?: () => void;
  onRefresh?: () => void;
  onCreateAction?: () => void;
  isZeroBaseline?: boolean;
}

export default function PMNavHeader({
  activeTab,
  onBaselineZero,
  onLoadDemoData,
  onRefresh,
  onCreateAction,
  isZeroBaseline = false
}: PMNavHeaderProps) {
  const router = useRouter();
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setCurrentUserState(getCurrentUser());
  }, []);

  const handleRefreshClick = () => {
    if (onRefresh) {
      setRefreshing(true);
      onRefresh();
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  return (
    <header className="w-full bg-[#F7F5F3] border-b border-[#e0dedb] sticky top-0 z-30 backdrop-blur-md bg-opacity-95">
      {/* Top Bar */}
      <div className="px-6 lg:px-10 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-[#e0dedb]/60">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-[#828387] hover:text-[#37322F] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Select Workspace</span>
          </Link>
          <div className="h-4 w-px bg-[#d8d5d0]" />
          <div className="flex items-center gap-2">
            <PBLogo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#37322F] tracking-tight">
                  PM Strategy & Operations
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold border border-amber-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-700" />
                  <span>PM Admin</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Auth */}
        <div className="flex items-center gap-2">
          {onBaselineZero && (
            <button
              onClick={onBaselineZero}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                isZeroBaseline
                  ? "bg-[#37322F] text-white border-[#37322F]"
                  : "bg-white text-[#37322F] border-[#d8d5d0] hover:bg-[#eae7e3]"
              }`}
            >
              0 Baseline
            </button>
          )}
          {onLoadDemoData && (
            <button
              onClick={onLoadDemoData}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                !isZeroBaseline
                  ? "bg-[#37322F] text-white border-[#37322F]"
                  : "bg-white text-[#37322F] border-[#d8d5d0] hover:bg-[#eae7e3]"
              }`}
            >
              Demo Data
            </button>
          )}
          {onRefresh && (
            <button
              onClick={handleRefreshClick}
              disabled={refreshing}
              className="p-2 rounded-lg border border-[#d8d5d0] bg-white text-[#605a57] hover:bg-[#f0ede9] text-xs font-medium"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          )}
          {onCreateAction && (
            <button
              onClick={onCreateAction}
              className="px-3.5 py-1.5 bg-[#37322F] text-white text-xs font-semibold rounded-lg hover:bg-[#252220] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create / Import</span>
            </button>
          )}

          <div className="flex items-center gap-2 pl-3 border-l border-[#d8d5d0] ml-1">
            <div className="flex items-center gap-1.5 text-xs text-[#37322F]">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs border border-amber-300">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "PM"}
              </div>
              <span className="font-semibold hidden sm:inline">
                {currentUser?.name || "Elena Rostova [PM]"}
              </span>
            </div>
            <button
              onClick={() => {
                logoutUser();
                router.push("/sign-in?role=pm");
              }}
              title="Sign Out"
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
            <Show when="signed-in">
              <UserButton fallbackRedirectUrl="/" />
            </Show>
          </div>
        </div>
      </div>

      {/* Sub-Header Navigation Tabs (No Icons, Prominently Highlighted Active Tab) */}
      <div className="px-6 lg:px-10 py-2 bg-[#F2EFEA] flex flex-wrap items-center gap-2">
        <Link
          href="/dashboard/pm"
          className={`px-4 py-2 text-xs transition-all ${
            activeTab === "overview"
              ? "bg-[#37322F] text-white font-extrabold shadow-sm rounded-lg border border-[#37322F]"
              : "bg-white/90 text-[#605a57] font-bold rounded-lg border border-[#d8d5d0] hover:bg-white hover:text-[#37322F]"
          }`}
        >
          Executive Overview
        </Link>

        <Link
          href="/dashboard/pm/telemetry"
          className={`px-4 py-2 text-xs transition-all ${
            activeTab === "telemetry"
              ? "bg-[#37322F] text-white font-extrabold shadow-sm rounded-lg border border-[#37322F]"
              : "bg-white/90 text-[#605a57] font-bold rounded-lg border border-[#d8d5d0] hover:bg-white hover:text-[#37322F]"
          }`}
        >
          Cross-Team Telemetry
        </Link>

        <Link
          href="/dashboard/pm/prds"
          className={`px-4 py-2 text-xs transition-all ${
            activeTab === "prds"
              ? "bg-[#37322F] text-white font-extrabold shadow-sm rounded-lg border border-[#37322F]"
              : "bg-white/90 text-[#605a57] font-bold rounded-lg border border-[#d8d5d0] hover:bg-white hover:text-[#37322F]"
          }`}
        >
          PRDs & Closed Tickets
        </Link>

        <Link
          href="/dashboard/pm/members"
          className={`px-4 py-2 text-xs transition-all ${
            activeTab === "members"
              ? "bg-[#37322F] text-white font-extrabold shadow-sm rounded-lg border border-[#37322F]"
              : "bg-white/90 text-[#605a57] font-bold rounded-lg border border-[#d8d5d0] hover:bg-white hover:text-[#37322F]"
          }`}
        >
          Workspace Member Access
        </Link>
      </div>
    </header>
  );
}
