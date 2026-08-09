"use client";

import React from "react";

export const PrivacyBanner: React.FC = () => {
  const marqueeContent = (
    <span className="flex items-center gap-4">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0B0B14] dark:bg-[#C6FF3D] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0B0B14] dark:bg-[#C6FF3D]"></span>
      </span>
      <span>🔒 100% CLIENT-SIDE PRIVACY</span>
      <span>✦</span>
      <span>YOUR DATA IS SAFE WITH US</span>
      <span>✦</span>
      <span>WE DO NOT TAKE OR STORE YOUR PDF DATA</span>
      <span>✦</span>
      <span>FILES NEVER LEAVE YOUR DEVICE</span>
      <span>✦</span>
      <span>ZERO SERVER UPLOADS</span>
      <span>✦</span>
    </span>
  );

  return (
    <div className="border-t-2 border-b-[3px] border-[#0B0B14] dark:border-[#C6FF3D] bg-[#C6FF3D] text-[#0B0B14] dark:bg-[#6E3CF6] dark:text-white overflow-hidden py-2 font-mono-custom text-xs font-bold uppercase tracking-wider select-none">
      <div className="animate-marquee flex whitespace-nowrap gap-4">
        {marqueeContent}
        {marqueeContent}
        {marqueeContent}
        {marqueeContent}
      </div>
    </div>
  );
};

export default PrivacyBanner;
