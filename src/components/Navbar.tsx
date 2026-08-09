"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      onMouseLeave={() => setIsMegaMenuOpen(false)}
      className="sticky top-0 z-50 bg-[#F5F2FF] border-b-[3px] border-[#0B0B14]"
    >
      <div className="max-w-[1180px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display font-bold text-2xl text-[#0B0B14] cursor-pointer"
        >
          <span className="w-8.5 h-8.5 bg-[#0B0B14] text-[#C6FF3D] flex items-center justify-center font-bold text-lg rounded-lg -rotate-6 font-display">
            /f
          </span>
          flip.
        </Link>

        {/* Quick Nav Links */}
        <div className="hidden lg:flex items-center gap-6 font-display font-bold text-xs uppercase tracking-wider">
          <Link
            href="/merge-pdf"
            className={`hover:text-[#6E3CF6] transition-colors ${
              pathname === "/merge-pdf" ? "text-[#6E3CF6] underline font-extrabold" : ""
            }`}
          >
            MERGE PDF
          </Link>
          <Link
            href="/split-pdf"
            className={`hover:text-[#6E3CF6] transition-colors ${
              pathname === "/split-pdf" ? "text-[#6E3CF6] underline font-extrabold" : ""
            }`}
          >
            SPLIT PDF
          </Link>
          <Link
            href="/compress-pdf"
            className={`hover:text-[#6E3CF6] transition-colors ${
              pathname === "/compress-pdf" ? "text-[#6E3CF6] underline font-extrabold" : ""
            }`}
          >
            COMPRESS PDF
          </Link>
          <Link
            href="/jpg-to-pdf"
            className={`hover:text-[#6E3CF6] transition-colors ${
              pathname === "/jpg-to-pdf" ? "text-[#6E3CF6] underline font-extrabold" : ""
            }`}
          >
            IMAGES TO PDF
          </Link>
          <Link
            href="/dark-mode"
            className={`hover:text-[#6E3CF6] transition-colors ${
              pathname === "/dark-mode" ? "text-[#6E3CF6] underline font-extrabold" : ""
            }`}
          >
            DARK MODE
          </Link>
        </div>

        {/* ALL PDF TOOLS Mega Dropdown Trigger (Hover & Click) */}
        <div
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          className="relative"
        >
          <button
            type="button"
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0B0B14] text-[#C6FF3D] border-[3px] border-[#0B0B14] text-xs font-display font-bold uppercase tracking-wider shadow-[4px_4px_0_#6E3CF6] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
          >
            <span>ALL PDF TOOLS</span>
            <span className="text-xs font-mono-custom">
              {isMegaMenuOpen ? "▲" : "▼"}
            </span>
          </button>
        </div>
      </div>

      {/* iLovePDF-Style Categorized Mega Dropdown Menu */}
      {isMegaMenuOpen && (
        <div
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          className="bg-white border-b-[3px] border-[#0B0B14] shadow-[0_12px_0_#0B0B14] py-8 px-6 transition-all duration-200"
        >
          <div className="max-w-[1180px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* 1. ORGANIZE PDF */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono-custom font-bold text-[#6E3CF6] uppercase tracking-wider block border-b-2 border-[#0B0B14] pb-1">
                ORGANIZE PDF
              </span>
              <div className="space-y-1.5 font-display text-xs font-bold text-[#0B0B14]">
                <Link
                  href="/merge-pdf"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>🥞</span>
                  <span>Merge PDF</span>
                </Link>
                <Link
                  href="/split-pdf"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>✂️</span>
                  <span>Split PDF</span>
                </Link>
                <Link
                  href="/page-manager"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>📋</span>
                  <span>Delete / Reorder</span>
                </Link>
              </div>
            </div>

            {/* 2. OPTIMIZE PDF */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono-custom font-bold text-[#6E3CF6] uppercase tracking-wider block border-b-2 border-[#0B0B14] pb-1">
                OPTIMIZE PDF
              </span>
              <div className="space-y-1.5 font-display text-xs font-bold text-[#0B0B14]">
                <Link
                  href="/compress-pdf"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>📉</span>
                  <span>Compress PDF</span>
                </Link>
                <Link
                  href="/dark-mode"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>🌙</span>
                  <span>PDF Dark Mode</span>
                </Link>
              </div>
            </div>

            {/* 3. CONVERT TO PDF */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono-custom font-bold text-[#6E3CF6] uppercase tracking-wider block border-b-2 border-[#0B0B14] pb-1">
                CONVERT TO PDF
              </span>
              <div className="space-y-1.5 font-display text-xs font-bold text-[#0B0B14]">
                <Link
                  href="/jpg-to-pdf"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>🖼️</span>
                  <span>JPG / PNG to PDF</span>
                </Link>
                <Link
                  href="/"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>📄</span>
                  <span>WORD to PDF</span>
                </Link>
              </div>
            </div>

            {/* 4. CONVERT FROM PDF */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono-custom font-bold text-[#6E3CF6] uppercase tracking-wider block border-b-2 border-[#0B0B14] pb-1">
                CONVERT FROM PDF
              </span>
              <div className="space-y-1.5 font-display text-xs font-bold text-[#0B0B14]">
                <Link
                  href="/pdf-to-jpg"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>📦</span>
                  <span>PDF to Images (.zip)</span>
                </Link>
                <Link
                  href="/extract-text"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>📝</span>
                  <span>PDF to Text</span>
                </Link>
              </div>
            </div>

            {/* 5. EDIT PDF */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono-custom font-bold text-[#6E3CF6] uppercase tracking-wider block border-b-2 border-[#0B0B14] pb-1">
                EDIT PDF
              </span>
              <div className="space-y-1.5 font-display text-xs font-bold text-[#0B0B14]">
                <Link
                  href="/split-pdf"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>🔄</span>
                  <span>Rotate PDF</span>
                </Link>
                <Link
                  href="/watermark"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>🔢</span>
                  <span>Add Page Numbers</span>
                </Link>
                <Link
                  href="/watermark"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>✍️</span>
                  <span>Add Watermark</span>
                </Link>
              </div>
            </div>

            {/* 6. PDF SECURITY */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono-custom font-bold text-[#6E3CF6] uppercase tracking-wider block border-b-2 border-[#0B0B14] pb-1">
                PDF SECURITY
              </span>
              <div className="space-y-1.5 font-display text-xs font-bold text-[#0B0B14]">
                <Link
                  href="/protect-pdf"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#C6FF3D]"
                >
                  <span>🔒</span>
                  <span>Protect PDF</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
