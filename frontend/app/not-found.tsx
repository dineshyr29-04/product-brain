import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, LayoutDashboard, BarChart3, Wrench, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] text-[#37322F] font-sans flex flex-col justify-between p-6 md:p-12">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#37322F] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            PB
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#37322F]">
              ProductBrain
            </span>
            <span className="ml-2 text-[10px] font-mono font-medium px-1.5 py-0.5 bg-[#eae7e3] text-[#605a57] rounded border border-[#d8d5d0]">
              v1.0
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs font-medium text-[#605a57]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Status: Online
        </div>
      </header>

      {/* Main 404 Card */}
      <main className="max-w-2xl mx-auto w-full my-12 bg-white rounded-2xl border border-[#e0dedb] p-8 md:p-12 shadow-sm text-center">
        <div className="w-16 h-16 bg-[#eae7e3] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#37322F] border border-[#d8d5d0]">
          <ShieldAlert className="w-8 h-8 text-[#37322F]" />
        </div>

        <span className="text-xs font-mono font-bold tracking-widest text-[#828387] uppercase px-3 py-1 bg-[#fbfaf9] border border-[#e0dedb] rounded-full">
          Error 404 &bull; Resource Relocated
        </span>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[#37322F] tracking-tight mt-4 mb-3">
          Page Not Found
        </h1>

        <p className="text-sm text-[#605a57] max-w-md mx-auto leading-relaxed">
          The requested address or resource does not exist within the ProductBrain intelligence network. It may have been moved, archived, or temporarily unindexed.
        </p>

        {/* Quick Navigation Directives */}
        <div className="mt-8 pt-8 border-t border-[#e0dedb] grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <Link
            href="/"
            className="p-3.5 rounded-xl border border-[#e0dedb] bg-[#fbfaf9] hover:bg-[#eae7e3] hover:border-[#d8d5d0] transition-all group"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-[#37322F] mb-1">
              <LayoutDashboard className="w-3.5 h-3.5 text-[#0ea5e9]" />
              PM Dashboard
            </div>
            <div className="text-[11px] text-[#828387]">
              Product opportunities, ARR & backlog
            </div>
          </Link>

          <Link
            href="/?tab=sales"
            className="p-3.5 rounded-xl border border-[#e0dedb] bg-[#fbfaf9] hover:bg-[#eae7e3] hover:border-[#d8d5d0] transition-all group"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-[#37322F] mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-[#0284c7]" />
              Sales Radar
            </div>
            <div className="text-[11px] text-[#828387]">
              Enterprise accounts & churn risk
            </div>
          </Link>

          <Link
            href="/?tab=engineering"
            className="p-3.5 rounded-xl border border-[#e0dedb] bg-[#fbfaf9] hover:bg-[#eae7e3] hover:border-[#d8d5d0] transition-all group"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-[#37322F] mb-1">
              <Wrench className="w-3.5 h-3.5 text-[#10b981]" />
              Engineering
            </div>
            <div className="text-[11px] text-[#828387]">
              Technical incident resolution queue
            </div>
          </Link>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#37322F] hover:bg-[#252220] text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to ProductBrain Workspace
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#828387]">
        &copy; {new Date().getFullYear()} ProductBrain Enterprise AI. Autonomous Product Intelligence Platform.
      </footer>
    </div>
  );
}
