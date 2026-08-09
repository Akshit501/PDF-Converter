"use client";

import React, { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import PdfWatermarkTool from "@/src/components/PdfWatermarkTool";
import ToolFaq from "@/src/components/ToolFaq";
import { trackToolUsage } from "@/src/lib/analytics";

const FAQS = [
  {
    question: "How do I add text watermarks or page numbers to a PDF?",
    answer: "Upload your PDF, type your custom watermark text (e.g., 'CONFIDENTIAL' or 'DRAFT'), pick your placement (Diagonal Center, Bottom Center, Top Right), toggle page numbers on or off, and click 'Apply Watermark'.",
  },
  {
    question: "What page number formats are supported?",
    answer: "flip. automatically formats page numbers as 'Page X of Y' centered at the bottom of every page.",
  },
];

export default function WatermarkPage() {
  useEffect(() => {
    trackToolUsage("watermark");
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2FF] dark:bg-[#0B0B14] text-[#0B0B14] dark:text-white flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-10 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] rounded-full px-3.5 py-1 font-mono-custom text-xs font-bold -rotate-2">
            ✍️ Text & Number Overlays
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14]">
            Add Watermark & Page Numbers
          </h1>
          <p className="text-sm text-[#54506a] font-sans">
            Overlay custom text watermarks (Diagonal, Bottom, Top Right) and automatic page numbers onto pages.
          </p>
        </div>

        <PdfWatermarkTool />

        <ToolFaq toolTitle="Watermark & Page Numbers" faqs={FAQS} />
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
