"use client";

import React, { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import PdfCompressionTool from "@/src/components/PdfCompressionTool";
import ToolFaq from "@/src/components/ToolFaq";
import { trackToolUsage } from "@/src/lib/analytics";

const FAQS = [
  {
    question: "How much can PDF file size be reduced?",
    answer: "Compression results depend on document contents. PDFs heavy with high-res photos can often be reduced by 50% to 80% using Recommended or Extreme Compression.",
  },
  {
    question: "What is the difference between Low, Recommended, and Extreme compression?",
    answer: "Low Compression maintains maximum image quality with light optimization. Recommended Compression provides the best balance of file size and sharp visual clarity. Extreme Compression heavily downsamples images for minimal file size.",
  },
  {
    question: "Is text legibility preserved when compressing?",
    answer: "Yes! PDF vector text elements remain crisp and crystal clear; only embedded raster images are optimized.",
  },
];

export default function CompressPdfPage() {
  useEffect(() => {
    trackToolUsage("compress-pdf");
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2FF] dark:bg-[#0B0B14] text-[#0B0B14] dark:text-white flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-10 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] rounded-full px-3.5 py-1 font-mono-custom text-xs font-bold -rotate-2">
            📉 Shrink PDF File Size
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14]">
            Compress PDF File
          </h1>
          <p className="text-sm text-[#54506a] font-sans">
            Downsample embedded images and optimize PDF canvases to shrink document size 100% in-browser.
          </p>
        </div>

        <PdfCompressionTool />

        <ToolFaq toolTitle="Compress PDF" faqs={FAQS} />
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
