"use client";

import React from "react";
import Link from "next/link";

interface PBLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textColor?: "white" | "dark" | "gradient";
  className?: string;
  href?: string;
}

export default function PBLogo({
  size = "md",
  showText = true,
  textColor = "gradient",
  className = "",
  href = "/"
}: PBLogoProps) {
  const sizeMap = {
    sm: { box: "w-8 h-8 rounded-lg text-sm", text: "text-lg" },
    md: { box: "w-10 h-10 rounded-xl text-base", text: "text-xl" },
    lg: { box: "w-12 h-12 rounded-2xl text-xl", text: "text-2xl" },
    xl: { box: "w-16 h-16 rounded-2xl text-2xl", text: "text-3xl" }
  };

  const currentSize = sizeMap[size];

  const logoGraphic = (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* Mass-Professional Logo Badge */}
      <div className={`relative ${currentSize.box} bg-gradient-to-br from-cyan-400 via-indigo-600 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-105 transition-all duration-300`}>
        <div className="w-full h-full bg-[#0A0F1D] rounded-[inherit] flex items-center justify-center font-black tracking-tighter text-white relative overflow-hidden">
          {/* Subtle Ambient Mesh Highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-purple-500/20 pointer-events-none" />
          <span className="relative z-10 bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent font-extrabold">
            PB
          </span>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-tight ${currentSize.text} ${
              textColor === "white"
                ? "text-white"
                : textColor === "dark"
                ? "text-[#0F172A]"
                : "bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent"
            } group-hover:opacity-90 transition-opacity`}
          >
            ProductBrain
          </span>
          <span className="text-[9px] font-bold tracking-widest uppercase text-cyan-400/80 -mt-1">
            Enterprise Engine
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex group">
        {logoGraphic}
      </Link>
    );
  }

  return logoGraphic;
}
