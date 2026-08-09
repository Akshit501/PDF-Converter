"use client";

import React from "react";

export const PrivacyBanner: React.FC = () => {
  const marqueeContent = (
    <span className="flex items-center gap-6">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        LIVE SECURITY
      </span>
      <span className="text-slate-200">🔒 100% IN-BROWSER PRIVACY</span>
      <span className="text-slate-600">·</span>
      <span className="text-slate-300">YOUR PDF DATA IS SAFE WITH US</span>
      <span className="text-slate-600">·</span>
      <span className="text-slate-300">FILES NEVER LEAVE YOUR DEVICE</span>
      <span className="text-slate-600">·</span>
      <span className="text-slate-300">ZERO SERVER UPLOADS</span>
      <span className="text-slate-600">·</span>
    </span>
  );

  return (
    <div className="bg-slate-900 text-slate-100 border-t border-b border-slate-800 overflow-hidden py-2 font-mono-custom text-xs font-medium tracking-wide select-none">
      <div className="animate-marquee flex whitespace-nowrap gap-6">
        {marqueeContent}
        {marqueeContent}
        {marqueeContent}
      </div>
    </div>
  );
};

export default PrivacyBanner;
