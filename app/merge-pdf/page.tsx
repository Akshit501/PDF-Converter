"use client";

import React, { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import PdfOperationsTool from "@/src/components/PdfOperationsTool";
import ToolFaq from "@/src/components/ToolFaq";
import { trackToolUsage } from "@/src/lib/analytics";

const FAQS = [
  {
    question: "How do I merge multiple PDF files into one?",
    answer: "Drop or upload two or more PDF files into the stage, drag or click to reorder them into your desired sequence, and click 'Merge PDFs'.",
  },
  {
    question: "Is there a limit on how many PDF files I can combine?",
    answer: "No. Since merging runs locally in your browser memory, you can combine as many PDF files as your device RAM can handle.",
  },
  {
    question: "Are my merged documents secure?",
    answer: "100% secure. Processing happens in your local browser memory and no files are uploaded to any server.",
  },
];

export default function MergePdfPage() {
  useEffect(() => {
    trackToolUsage("merge-pdf");
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2FF] dark:bg-[#0B0B14] text-[#0B0B14] dark:text-white flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-10 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] rounded-full px-3.5 py-1 font-mono-custom text-xs font-bold -rotate-2">
            🥞 Combine PDFs
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14]">
            Merge PDF Files
          </h1>
          <p className="text-sm text-[#54506a] font-sans">
            Combine PDFs in the order you want with the easiest PDF merger available.
          </p>
        </div>

        <PdfOperationsTool initialMode="merge" />

        <ToolFaq toolTitle="Merge PDF" faqs={FAQS} />
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
