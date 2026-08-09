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
    size === "sm" ? "w-7 h-7" : size === "lg" ? "w-11 h-11" : "w-9 h-9";
  const textSizeClass =
    size === "sm" ? "text-xl" : size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Liquid Drip Icon Badge */}
      <div className="relative group cursor-pointer">
        <div className={`${iconSizeClass} bg-[#0B0B14] text-[#C6FF3D] dark:bg-[#C6FF3D] dark:text-[#0B0B14] border-2 border-[#0B0B14] rounded-xl -rotate-6 group-hover:rotate-0 flex items-center justify-center font-display font-black shadow-[2px_2px_0_#6E3CF6] dark:shadow-[2px_2px_0_#C6FF3D] transition-transform duration-200`}>
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            {/* Custom PDF Document with Drip Effect */}
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>
        {/* Animated Drip Droplet */}
        <span className="absolute -bottom-1.5 right-0.5 w-2 h-2.5 bg-[#6E3CF6] dark:bg-[#C6FF3D] rounded-b-full rounded-t-xs" />
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className={`font-display font-black ${textSizeClass} tracking-tight text-[#0B0B14] dark:text-white flex items-center gap-0.5`}>
            <span>Pdf</span>
            <span className="text-[#6E3CF6] dark:text-[#C6FF3D] font-extrabold relative">
              Drip
              {/* Pink Accent Drip Dot */}
              <span className="inline-block w-2 h-2 bg-[#FF3D9A] rounded-full ml-0.5 animate-pulse" />
            </span>
          </div>
          <span className="text-[9px] font-mono-custom font-bold text-[#54506a] dark:text-gray-400 uppercase tracking-widest mt-0.5">
            // GEN Z PDF STUDIO
          </span>
        </div>
      )}
    </div>
  );
};

export default PdfDripLogo;
