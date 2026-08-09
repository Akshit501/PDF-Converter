"use client";

import React from "react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const PdfDripLogo: React.FC<LogoProps> = ({
  className = "",
  iconOnly = false,
  size = "md",
}) => {
  const iconSizeClass =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-11 h-11" : "w-9.5 h-9.5";
  const textSizeClass =
    size === "sm" ? "text-xl" : size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Sleek Gradient Icon */}
      <div className="relative group cursor-pointer">
        <div className={`${iconSizeClass} bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all duration-200`}>
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>
        {/* Subtle Glow Accent */}
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#10B981] rounded-full ring-2 ring-white dark:ring-slate-900" />
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <div className={`font-display font-bold ${textSizeClass} tracking-tight text-slate-900 dark:text-white flex items-center`}>
            <span>Pdf</span>
            <span className="text-[#4F46E5] dark:text-[#818CF8] font-extrabold ml-0.5">
              Drip
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            Client-Side Studio
          </span>
        </div>
      )}
    </div>
  );
};

export default PdfDripLogo;
