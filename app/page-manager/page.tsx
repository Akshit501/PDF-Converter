"use client";

import React, { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import PdfPageManagerTool from "@/src/components/PdfPageManagerTool";
import ToolFaq from "@/src/components/ToolFaq";
import { trackToolUsage } from "@/src/lib/analytics";

const FAQS = [
  {
    question: "How do I reorder or delete pages in a PDF?",
    answer: "Upload your PDF file. Each page will render as an interactive thumbnail card. Click 'Move Left' or 'Move Right' to reorder pages, or click 'Delete Page' to remove unwanted pages.",
  },
  {
    question: "Can I save the newly organized PDF?",
    answer: "Yes! Click 'Save Organized PDF' to generate and download the updated PDF file instantly.",
  },
];

export default function PageManagerPage() {
  useEffect(() => {
    trackToolUsage("page-manager");
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2FF] dark:bg-[#0B0B14] text-[#0B0B14] dark:text-white flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-10 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] rounded-full px-3.5 py-1 font-mono-custom text-xs font-bold -rotate-2">
            📋 Organize PDF Pages
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14]">
            Delete & Reorder PDF Pages
          </h1>
          <p className="text-sm text-[#54506a] font-sans">
            Organize page sequence or delete unwanted pages using interactive thumbnail cards.
          </p>
        </div>

        <PdfPageManagerTool />

        <ToolFaq toolTitle="Delete & Reorder Pages" faqs={FAQS} />
      </main>

      <footer className="py-10 text-center font-mono-custom text-xs text-[#6b6884] space-y-2">
        <div>© 2026 PdfDrip — client-side PDF studio</div>
        <div>
          <a href="/privacy" className="underline hover:text-[#6E3CF6]">
            Privacy Policy (Files Never Leave Your Device)
          </a>
        </div>
      </footer>
    </div>
  );
}
