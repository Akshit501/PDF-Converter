"use client";

import React, { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import ImagesToPdfTool from "@/src/components/ImagesToPdfTool";
import ToolFaq from "@/src/components/ToolFaq";
import { trackToolUsage } from "@/src/lib/analytics";

const FAQS = [
  {
    question: "How do I convert JPG or PNG images into a single PDF?",
    answer: "Click '+ Add more files' or drop your images into the stage, select your preferred page orientation (Portrait or Landscape) and page size (A4, Letter, Fit), then click 'Convert to PDF'.",
  },
  {
    question: "Are my uploaded photos sent to a server?",
    answer: "No. All image encoding and PDF rendering happen 100% locally in your web browser using WebAssembly. Your photos never leave your device.",
  },
  {
    question: "Can I reorder or delete images before creating the PDF?",
    answer: "Yes! Use the left/right arrow controls on each thumbnail card to rearrange page order or the trash icon to delete images.",
  },
  {
    question: "What image formats are supported?",
    answer: "flip. supports JPG, JPEG, PNG, WEBP, and GIF images.",
  },
];

export default function JpgToPdfPage() {
  useEffect(() => {
    trackToolUsage("jpg-to-pdf");
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2FF] dark:bg-[#0B0B14] text-[#0B0B14] dark:text-white flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-10 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] rounded-full px-3.5 py-1 font-mono-custom text-xs font-bold -rotate-2">
            🖼️ Convert Images to PDF
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14]">
            Convert JPG to PDF
          </h1>
          <p className="text-sm text-[#54506a] font-sans">
            Convert JPG and PNG images to PDF in seconds. Easily adjust orientation, margins, and page sizes.
          </p>
        </div>

        <ImagesToPdfTool />

        <ToolFaq toolTitle="JPG to PDF" faqs={FAQS} />
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
