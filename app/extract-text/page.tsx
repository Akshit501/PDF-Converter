"use client";

import React, { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import PdfTextExtractorTool from "@/src/components/PdfTextExtractorTool";
import ToolFaq from "@/src/components/ToolFaq";
import { trackToolUsage } from "@/src/lib/analytics";

const FAQS = [
  {
    question: "How do I extract plain text from a PDF document?",
    answer: "Upload your PDF file and click 'Extract Text Stream'. The text layer will render instantly in a copyable text box.",
  },
  {
    question: "Can I download the extracted text as a file?",
    answer: "Yes! Click 'Download .txt File' to save the extracted text directly to your computer or phone.",
  },
];

export default function ExtractTextPage() {
  useEffect(() => {
    trackToolUsage("extract-text");
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2FF] dark:bg-[#0B0B14] text-[#0B0B14] dark:text-white flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-10 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] rounded-full px-3.5 py-1 font-mono-custom text-xs font-bold -rotate-2">
            📝 Plain Text Extractor
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14]">
            Extract PDF Text
          </h1>
          <p className="text-sm text-[#54506a] font-sans">
            Pull plain text streams out of PDF pages for quick copying or downloading as a .txt file.
          </p>
        </div>

        <PdfTextExtractorTool />

        <ToolFaq toolTitle="Extract Text" faqs={FAQS} />
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
