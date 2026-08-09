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
    label: "ORGANIZE PDF",
    items: [
      { name: "Merge PDF", href: "/merge-pdf", icon: "🥞", desc: "Combine multiple PDFs into one" },
      { name: "Split PDF", href: "/split-pdf", icon: "✂️", desc: "Separate pages or extract ranges" },
      { name: "Reorder & Delete", href: "/page-manager", icon: "📋", desc: "Organize, rotate, or delete pages" },
    ],
  },
  {
    id: "optimize",
    label: "OPTIMIZE PDF",
    items: [
      { name: "Compress PDF", href: "/compress-pdf", icon: "📉", desc: "Reduce file size without quality loss" },
      { name: "PDF Dark Mode", href: "/dark-mode", icon: "🌙", desc: "Invert colors for night reading" },
    ],
  },
  {
    id: "convert",
    label: "CONVERT PDF",
    items: [
      { name: "Images to PDF", href: "/jpg-to-pdf", icon: "🖼️", desc: "Convert JPG, PNG, WEBP to PDF" },
      { name: "PDF to Images", href: "/pdf-to-jpg", icon: "📦", desc: "Extract PDF pages as PNG images" },
      { name: "PDF to Text", href: "/extract-text", icon: "📝", desc: "Extract plain text content" },
      { name: "Word to PDF", href: "/", icon: "📄", desc: "Convert DOCX documents to PDF" },
    ],
  },
  {
    id: "edit",
    label: "EDIT PDF",
    items: [
      { name: "Watermark & Numbers", href: "/watermark", icon: "✍️", desc: "Stamp text, logos & page numbers" },
      { name: "Rotate PDF", href: "/split-pdf", icon: "🔄", desc: "Rotate pages 90°, 180° or 270°" },
    ],
  },
  {
    id: "security",
    label: "PDF SECURITY",
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
    <nav className="sticky top-0 z-50 bg-[#F5F2FF] dark:bg-[#0B0B14] border-b-[3px] border-[#0B0B14] dark:border-[#C6FF3D] transition-colors">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
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
        <div className="hidden lg:flex items-center gap-3 font-display font-bold text-xs uppercase tracking-wider">
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
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    active
                      ? "bg-[#6E3CF6] text-white border-2 border-[#0B0B14] dark:bg-[#C6FF3D] dark:text-[#0B0B14] font-extrabold shadow-[2px_2px_0_#0B0B14]"
                      : isOpen
                      ? "bg-[#6E3CF6]/15 text-[#6E3CF6] border-transparent dark:bg-white/10 dark:text-[#C6FF3D]"
                      : "border-transparent text-[#0B0B14] dark:text-gray-200 hover:text-[#6E3CF6] dark:hover:text-[#C6FF3D] hover:bg-[#6E3CF6]/10 dark:hover:bg-white/10"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] font-mono-custom opacity-80">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </button>

                {/* Popover Dropdown Card */}
                {isOpen && (
                  <div
                    className="absolute top-full left-0 mt-1.5 w-64 bg-white dark:bg-[#161624] border-[3px] border-[#0B0B14] dark:border-[#C6FF3D] rounded-2xl p-3 shadow-[6px_6px_0_#0B0B14] dark:shadow-[6px_6px_0_#6E3CF6] z-50 transition-all duration-150 animate-in fade-in slide-in-from-top-2"
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
                            className={`flex items-start gap-3 p-2.5 rounded-xl border-2 transition-all group ${
                              isCurrentPath
                                ? "bg-[#C6FF3D] border-[#0B0B14] text-[#0B0B14]"
                                : "border-transparent hover:border-[#0B0B14] hover:bg-[#C6FF3D] hover:text-[#0B0B14] text-[#0B0B14] dark:text-gray-200 dark:hover:bg-[#C6FF3D] dark:hover:text-[#0B0B14]"
                            }`}
                          >
                            <span className="text-xl p-1 bg-[#F5F2FF] dark:bg-[#202030] rounded-lg border border-[#0B0B14] group-hover:scale-110 transition-transform">
                              {item.icon}
                            </span>
                            <div>
                              <div className="font-display font-bold text-xs leading-tight">
                                {item.name}
                              </div>
                              <div className="text-[10px] opacity-80 group-hover:text-[#0B0B14] font-sans font-normal leading-normal mt-0.5">
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

        {/* Right Actions: Theme Toggle + ALL PDF TOOLS Mega Dropdown + Mobile Menu Button */}
        <div className="flex items-center space-x-2.5">
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
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#0B0B14] text-[#C6FF3D] dark:bg-[#C6FF3D] dark:text-[#0B0B14] border-[3px] border-[#0B0B14] text-xs font-display font-bold uppercase tracking-wider shadow-[3px_3px_0_#6E3CF6] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <span>ALL TOOLS</span>
              <span className="text-xs font-mono-custom">
                {isMegaMenuOpen ? "▲" : "▼"}
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#0B0B14] text-white dark:bg-[#C6FF3D] dark:text-[#0B0B14] border-2 border-[#0B0B14] cursor-pointer"
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
          className="bg-white dark:bg-[#161624] border-b-[3px] border-[#0B0B14] dark:border-[#C6FF3D] shadow-[0_12px_0_#0B0B14] dark:shadow-[0_12px_0_#6E3CF6] py-8 px-6 transition-all duration-200 hidden lg:block"
        >
          <div className="max-w-[1240px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-2.5">
                <span className="text-[11px] font-mono-custom font-bold text-[#6E3CF6] dark:text-[#C6FF3D] uppercase tracking-wider block border-b-2 border-[#0B0B14] dark:border-[#C6FF3D] pb-1">
                  {cat.label}
                </span>
                <div className="space-y-1.5 font-display text-xs font-bold text-[#0B0B14] dark:text-gray-200">
                  {cat.items.map((item) => (
                    <Link
                      key={item.href + item.name}
                      href={item.href}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="flex items-center space-x-2 p-2 rounded-xl border border-transparent hover:border-[#0B0B14] hover:bg-[#C6FF3D] hover:text-[#0B0B14] transition-all"
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
        <div className="lg:hidden bg-white dark:bg-[#161624] border-b-[3px] border-[#0B0B14] dark:border-[#C6FF3D] px-4 py-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="space-y-2">
              <div className="text-xs font-mono-custom font-bold text-[#6E3CF6] dark:text-[#C6FF3D] uppercase tracking-wider border-b-2 border-[#0B0B14] dark:border-[#C6FF3D] pb-1">
                {cat.label}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.items.map((item) => (
                  <Link
                    key={"mobile-" + item.href + item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-[#0B0B14] bg-[#F5F2FF] dark:bg-[#202030] hover:bg-[#C6FF3D] dark:hover:bg-[#C6FF3D] dark:hover:text-[#0B0B14] transition-all"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="font-display font-bold text-xs">{item.name}</div>
                      <div className="text-[10px] text-gray-600 dark:text-gray-300 font-sans">{item.desc}</div>
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
