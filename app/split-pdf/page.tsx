"use client";

import React, { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import PdfOperationsTool from "@/src/components/PdfOperationsTool";
import ToolFaq from "@/src/components/ToolFaq";
import { trackToolUsage } from "@/src/lib/analytics";

const FAQS = [
  {
    question: "How do I split a PDF or extract specific pages?",
    answer: "Upload your PDF document, type page ranges into the Split settings panel (e.g., '1-3, 5, 8-10'), and click 'Split PDF' to extract those exact pages into a new document.",
  },
  {
    question: "Can I rotate individual pages before splitting?",
    answer: "Yes! Use the page thumbnail preview stage to rotate individual pages 90°, 180°, or 270°.",
  },
  {
    question: "Does splitting affect document visual quality?",
    answer: "Not at all. flip. extracts original page objects without re-compressing or degrading quality.",
  },
];

export default function SplitPdfPage() {
  useEffect(() => {
    trackToolUsage("split-pdf");
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2FF] dark:bg-[#0B0B14] text-[#0B0B14] dark:text-white flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-10 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] rounded-full px-3.5 py-1 font-mono-custom text-xs font-bold -rotate-2">
            ✂️ Split & Rotate PDF
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14]">
            Split or Rotate PDF
          </h1>
          <p className="text-sm text-[#54506a] font-sans">
            Extract selected page ranges or rotate pages using interactive thumbnail previews.
          </p>
        </div>

        <PdfOperationsTool initialMode="split" />

        <ToolFaq toolTitle="Split PDF" faqs={FAQS} />
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
