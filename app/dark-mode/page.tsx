"use client";

import React, { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import PdfDarkModeTool from "@/src/components/PdfDarkModeTool";
import ToolFaq from "@/src/components/ToolFaq";
import { trackToolUsage } from "@/src/lib/analytics";

const FAQS = [
  {
    question: "How does PDF Dark Mode work?",
    answer: "PDF Dark Mode analyzes page canvas pixels in your browser and inverts light document backgrounds to dark themes while keeping embedded images and photos vibrant.",
  },
  {
    question: "Which dark mode preset should I choose?",
    answer: "Dark Charcoal (#121212) offers comfortable contrast for long reading sessions. OLED Black (#000000) provides maximum battery efficiency on AMOLED screens. Midnight Blue (#0F172A) is ideal for code & technical documentation.",
  },
  {
    question: "Can I save the converted dark PDF?",
    answer: "Yes! Once generated, click 'Download Dark PDF' to save your new PDF for offline dark mode reading.",
  },
];

export default function DarkModePage() {
  useEffect(() => {
    trackToolUsage("dark-mode");
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#09090B] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-10 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] rounded-full px-3.5 py-1 font-mono-custom text-xs font-bold -rotate-2">
            🌙 Night Mode Converter
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14]">
            PDF Dark Mode Converter
          </h1>
          <p className="text-sm text-[#54506a] font-sans">
            Invert white document pages to OLED Black or Dark Charcoal while keeping photo colors intact.
          </p>
        </div>

        <PdfDarkModeTool />

        <ToolFaq toolTitle="PDF Dark Mode" faqs={FAQS} />
      </main>

      <footer className="py-10 text-center font-mono-custom text-xs text-[#6b6884] space-y-2">
        <div>© 2026 flip. — client-side PDF studio</div>
        <div>
          <a href="/privacy" className="underline hover:text-[#6E3CF6]">
            Privacy Policy (Files Never Leave Your Device)
          </a>
        </div>
      </footer>
    </div>
  );
}
