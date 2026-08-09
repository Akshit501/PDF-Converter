"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { PrivacyBanner } from "@/src/components/PrivacyBanner";
import { PdfDripLogo } from "@/src/components/PdfDripLogo";

type ToolItem = {
  name: string;
  href: string;
  icon: string;
  desc: string;
};

type ToolCategory = {
  id: string;
  label: string;
  items: ToolItem[];
};

const CATEGORIES: ToolCategory[] = [
  {
    id: "organize",
    label: "ORGANIZE",
    items: [
      { name: "Merge PDF", href: "/merge-pdf", icon: "🥞", desc: "Combine multiple PDFs into one document" },
      { name: "Split PDF", href: "/split-pdf", icon: "✂️", desc: "Separate pages or extract custom ranges" },
      { name: "Reorder & Delete", href: "/page-manager", icon: "📋", desc: "Organize, rotate, or delete pages" },
    ],
  },
  {
    id: "optimize",
    label: "OPTIMIZE",
    items: [
      { name: "Compress PDF", href: "/compress-pdf", icon: "📉", desc: "Reduce file size without quality loss" },
      { name: "PDF Dark Mode", href: "/dark-mode", icon: "🌙", desc: "Invert colors for comfortable reading" },
    ],
  },
  {
    id: "convert",
    label: "CONVERT",
    items: [
      { name: "Images to PDF", href: "/jpg-to-pdf", icon: "🖼️", desc: "Convert JPG, PNG, WEBP to PDF" },
      { name: "PDF to Images", href: "/pdf-to-jpg", icon: "📦", desc: "Extract PDF pages as PNG images" },
      { name: "PDF to Text", href: "/extract-text", icon: "📝", desc: "Extract plain text content" },
      { name: "Word to PDF", href: "/", icon: "📄", desc: "Convert DOCX documents to PDF" },
    ],
  },
  {
    id: "edit",
    label: "EDIT",
    items: [
      { name: "Watermark & Numbers", href: "/watermark", icon: "✍️", desc: "Stamp text, logos & page numbers" },
      { name: "Rotate PDF", href: "/split-pdf", icon: "🔄", desc: "Rotate pages 90°, 180° or 270°" },
    ],
  },
  {
    id: "security",
    label: "SECURITY",
    items: [
      { name: "Protect PDF", href: "/protect-pdf", icon: "🔒", desc: "Encrypt PDF with a password" },
    ],
  },
];

export const Navbar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (catId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsMegaMenuOpen(false);
    setActiveDropdown(catId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const isCategoryActive = (category: ToolCategory) => {
    return category.items.some((item) => item.href !== "/" && pathname === item.href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FDFBF7]/90 dark:bg-[#09090B]/90 backdrop-blur-md border-b border-amber-200/60 dark:border-slate-800/80 transition-colors">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => {
            setActiveDropdown(null);
            setIsMegaMenuOpen(false);
          }}
        >
          <PdfDripLogo size="md" />
        </Link>

        {/* Divided Category Dropdown Menus (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 font-display font-medium text-xs tracking-wide">
          {CATEGORIES.map((cat) => {
            const active = isCategoryActive(cat);
            const isOpen = activeDropdown === cat.id;

            return (
              <div
                key={cat.id}
                className="relative py-1"
                onMouseEnter={() => handleMouseEnter(cat.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(isOpen ? null : cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    active
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800/60"
                      : isOpen
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-800/60 dark:text-white"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] text-slate-400 opacity-80">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </button>

                {/* Popover Dropdown Card */}
                {isOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#141417] border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-xl shadow-slate-900/10 z-50 transition-all duration-150 animate-in fade-in slide-in-from-top-1"
                    onMouseEnter={() => handleMouseEnter(cat.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="space-y-1">
                      {cat.items.map((item) => {
                        const isCurrentPath = pathname === item.href;
                        return (
                          <Link
                            key={item.name + item.href}
                            href={item.href}
                            onClick={() => {
                              setActiveDropdown(null);
                              setIsMegaMenuOpen(false);
                            }}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-all group ${
                              isCurrentPath
                                ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            <span className="text-xl p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:scale-105 transition-transform">
                              {item.icon}
                            </span>
                            <div>
                              <div className="font-display font-semibold text-xs leading-tight">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-normal leading-normal mt-0.5">
                                {item.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Actions: Theme Toggle + ALL PDF TOOLS Button + Mobile Menu Button */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {/* ALL PDF TOOLS Master Trigger */}
          <div
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              setActiveDropdown(null);
              setIsMegaMenuOpen(true);
            }}
            className="relative hidden sm:block"
          >
            <button
              type="button"
              onClick={() => {
                setActiveDropdown(null);
                setIsMegaMenuOpen(!isMegaMenuOpen);
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/30 text-xs font-display font-semibold shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <span>ALL TOOLS</span>
              <span className="text-xs opacity-80">
                {isMegaMenuOpen ? "▲" : "▼"}
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <span className="font-mono-custom text-sm font-bold">
              {isMobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* Mega Dropdown Menu (Desktop) */}
      {isMegaMenuOpen && (
        <div
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
          className="bg-white dark:bg-[#141417] border-b border-slate-200 dark:border-slate-800 shadow-xl py-8 px-6 transition-all duration-200 hidden lg:block"
        >
          <div className="max-w-[1240px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-3">
                <span className="text-[11px] font-mono-custom font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  {cat.label}
                </span>
                <div className="space-y-1 font-display text-xs font-medium text-slate-700 dark:text-slate-300">
                  {cat.items.map((item) => (
                    <Link
                      key={item.href + item.name}
                      href={item.href}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#141417] border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="space-y-2">
              <div className="text-xs font-mono-custom font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1">
                {cat.label}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.items.map((item) => (
                  <Link
                    key={"mobile-" + item.href + item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="font-display font-semibold text-xs">{item.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Sliding Privacy Banner */}
      <PrivacyBanner />
    </nav>
  );
};

export default Navbar;
