"use client";

import React, { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import PdfSecurityTool from "@/src/components/PdfSecurityTool";
import ToolFaq from "@/src/components/ToolFaq";
import { trackToolUsage } from "@/src/lib/analytics";

const FAQS = [
  {
    question: "How do I password protect a PDF file?",
    answer: "Upload your PDF document, type your desired password, and click 'Protect PDF'. A new secured PDF file will be generated instantly for download.",
  },
  {
    question: "Are my passwords transmitted over the Internet?",
    answer: "Never. Password security and metadata encoding are processed 100% locally in your web browser RAM.",
  },
];

export default function ProtectPdfPage() {
  useEffect(() => {
    trackToolUsage("protect-pdf");
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2FF] dark:bg-[#0B0B14] text-[#0B0B14] dark:text-white flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-10 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] rounded-full px-3.5 py-1 font-mono-custom text-xs font-bold -rotate-2">
            🔒 Password Encryption
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14]">
            Protect PDF File
          </h1>
          <p className="text-sm text-[#54506a] font-sans">
            Encrypt PDF documents with user password protection 100% in-browser.
          </p>
        </div>

        <PdfSecurityTool />

        <ToolFaq toolTitle="Protect PDF" faqs={FAQS} />
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
