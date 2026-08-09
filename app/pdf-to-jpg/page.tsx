"use client";

import React, { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import PdfToImagesTool from "@/src/components/PdfToImagesTool";
import ToolFaq from "@/src/components/ToolFaq";
import { trackToolUsage } from "@/src/lib/analytics";

const FAQS = [
  {
    question: "How do I extract PDF pages into PNG or JPG images?",
    answer: "Upload your PDF document, choose your export format (PNG or JPG) and image quality, then click 'Convert PDF to Images'. Your pages will be packaged into a downloadable .zip archive.",
  },
  {
    question: "What resolution are the exported images?",
    answer: "PdfDrip renders PDF page canvases at high DPI (2.0x scale) to ensure sharp text and image clarity.",
  },
  {
    question: "Do I need unzipping software to extract the images?",
    answer: "Most modern operating systems (Windows, macOS, Android, iOS) can open and extract .zip files natively with one click.",
  },
];

export default function PdfToJpgPage() {
  useEffect(() => {
    trackToolUsage("pdf-to-jpg");
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2FF] dark:bg-[#0B0B14] text-[#0B0B14] dark:text-white flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-10 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] rounded-full px-3.5 py-1 font-mono-custom text-xs font-bold -rotate-2">
            📦 Export PDF Pages
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14]">
            Convert PDF to JPG / PNG
          </h1>
          <p className="text-sm text-[#54506a] font-sans">
            Extract every page of a PDF document into high-resolution images and download as a ZIP archive.
          </p>
        </div>

        <PdfToImagesTool />

        <ToolFaq toolTitle="PDF to Images" faqs={FAQS} />
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
