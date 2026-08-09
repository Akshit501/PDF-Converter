import React from "react";
import Navbar from "@/src/components/Navbar";
import PdfTextExtractorTool from "@/src/components/PdfTextExtractorTool";

export const metadata = {
  title: "Extract PDF Text Stream — flip.",
  description: "Pull plain text content out of PDF documents for quick copying or text file download.",
};

export default function ExtractTextPage() {
  return (
    <div className="min-h-screen bg-[#F5F2FF] text-[#0B0B14] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] rounded-full px-3 py-1 font-mono-custom text-xs font-bold -rotate-2">
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
      </main>

      <footer className="py-10 text-center font-mono-custom text-xs text-[#6b6884]">
        © 2026 flip. — client-side PDF studio
      </footer>
    </div>
  );
}
