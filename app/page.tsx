"use client";

import React, { useState } from "react";
import FileUploader from "@/src/components/FileUploader";
import PdfDarkModeTool from "@/src/components/PdfDarkModeTool";
import PdfOperationsTool from "@/src/components/PdfOperationsTool";
import PdfCompressionTool from "@/src/components/PdfCompressionTool";
import PdfToImagesTool from "@/src/components/PdfToImagesTool";
import ImagesToPdfTool from "@/src/components/ImagesToPdfTool";
import PdfPageManagerTool from "@/src/components/PdfPageManagerTool";
import PdfWatermarkTool from "@/src/components/PdfWatermarkTool";
import PdfTextExtractorTool from "@/src/components/PdfTextExtractorTool";
import { UploadedFile } from "@/src/types";

type AppTab =
  | "uploader"
  | "darkmode"
  | "operations"
  | "compress"
  | "pdfToImages"
  | "imagesToPdf"
  | "pageManager"
  | "watermark"
  | "extractText";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>("darkmode");
  const [opMode, setOpMode] = useState<"merge" | "split">("merge");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const getActiveToolName = () => {
    if (activeTab === "darkmode") return "dark mode converter";
    if (activeTab === "compress") return "compress PDF";
    if (activeTab === "pdfToImages") return "pdf → images";
    if (activeTab === "imagesToPdf") return "images → PDF";
    if (activeTab === "pageManager") return "delete / reorder pages";
    if (activeTab === "watermark") return "watermark & page numbers";
    if (activeTab === "extractText") return "extract PDF text";
    if (activeTab === "operations" && opMode === "merge") return "merge PDFs";
    if (activeTab === "operations" && opMode === "split") return "split / rotate";
    return "convert file";
  };

  return (
    <div className="min-h-screen bg-[#F5F2FF] text-[#0B0B14] flex flex-col font-sans">
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#F5F2FF] border-b-[3px] border-[#0B0B14]">
        <div className="max-w-[1180px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => {
              setActiveTab("darkmode");
              setIsToolsOpen(false);
            }}
            className="flex items-center gap-2.5 font-display font-bold text-2xl text-[#0B0B14] cursor-pointer"
          >
            <span className="w-8.5 h-8.5 bg-[#0B0B14] text-[#C6FF3D] flex items-center justify-center font-bold text-lg rounded-lg -rotate-6 font-display">
              /f
            </span>
            flip.
          </div>

          {/* Tools Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border-[3px] border-[#0B0B14] text-xs sm:text-sm font-display font-bold text-[#0B0B14] shadow-[4px_4px_0_#0B0B14] hover:bg-[#C6FF3D] transition-colors"
            >
              <span>tools</span>
              <span className="text-xs font-mono-custom">
                {isToolsOpen ? "▲" : "▼"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isToolsOpen && (
              <div
                onClick={() => setIsToolsOpen(false)}
                className="absolute right-0 mt-2 w-60 sm:w-68 bg-white border-[3px] border-[#0B0B14] rounded-2xl p-2 shadow-[8px_8px_0_#0B0B14] z-50 space-y-1 max-h-96 overflow-y-auto"
              >
                {[
                  { id: "darkmode", label: "dark mode converter", emoji: "🌙", action: () => setActiveTab("darkmode") },
                  { id: "compress", label: "compress PDF", emoji: "📉", action: () => setActiveTab("compress") },
                  { id: "pdfToImages", label: "pdf → images (.zip)", emoji: "🖼️", action: () => setActiveTab("pdfToImages") },
                  { id: "imagesToPdf", label: "images → PDF", emoji: "🖼️", action: () => setActiveTab("imagesToPdf") },
                  { id: "pageManager", label: "delete / reorder pages", emoji: "📋", action: () => setActiveTab("pageManager") },
                  { id: "watermark", label: "watermark & page numbers", emoji: "✍️", action: () => setActiveTab("watermark") },
                  { id: "extractText", label: "extract PDF text", emoji: "📝", action: () => setActiveTab("extractText") },
                  {
                    id: "merge",
                    label: "merge PDFs",
                    emoji: "🥞",
                    action: () => {
                      setActiveTab("operations");
                      setOpMode("merge");
                    },
                  },
                  {
                    id: "split",
                    label: "split / rotate",
                    emoji: "✂️",
                    action: () => {
                      setActiveTab("operations");
                      setOpMode("split");
                    },
                  },
                  { id: "uploader", label: "convert file", emoji: "📄", action: () => setActiveTab("uploader") },
                ].map((item) => {
                  const isActive =
                    (item.id === "darkmode" && activeTab === "darkmode") ||
                    (item.id === "compress" && activeTab === "compress") ||
                    (item.id === "pdfToImages" && activeTab === "pdfToImages") ||
                    (item.id === "imagesToPdf" && activeTab === "imagesToPdf") ||
                    (item.id === "pageManager" && activeTab === "pageManager") ||
                    (item.id === "watermark" && activeTab === "watermark") ||
                    (item.id === "extractText" && activeTab === "extractText") ||
                    (item.id === "merge" && activeTab === "operations" && opMode === "merge") ||
                    (item.id === "split" && activeTab === "operations" && opMode === "split") ||
                    (item.id === "uploader" && activeTab === "uploader");

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setIsToolsOpen(false);
                        const ws = document.getElementById("workspace");
                        ws?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl border-2 transition-all duration-150 text-left font-display font-bold text-xs sm:text-sm ${
                        isActive
                          ? "bg-[#C6FF3D] border-[#0B0B14] shadow-xs text-[#0B0B14]"
                          : "border-transparent hover:bg-[#F5F2FF] text-[#0B0B14]"
                      }`}
                    >
                      <span className="w-6 h-6 rounded-md bg-[#0B0B14] text-white flex items-center justify-center text-xs">
                        {item.emoji}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO & WORKSPACE */}
      <header className="py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-[#C6FF3D] border-[3px] border-[#0B0B14] rounded-full px-3.5 py-1.5 font-mono-custom text-xs font-semibold -rotate-2 mb-6 shadow-xs">
              ✦ 100% In-Browser PDF Studio
            </div>

            {/* Title */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[60px] leading-[0.98] tracking-tight mb-6 text-[#0B0B14]">
              turn any file into a{" "}
              <span className="bg-[#6E3CF6] text-white px-2.5 py-0.5 inline-block -rotate-1 rounded-md">
                PDF
              </span>{" "}
              in seconds.
            </h1>

            <p className="text-lg leading-relaxed text-[#33314a] max-w-md mb-8">
              Convert images to PDF, delete/reorder pages, add watermarks, extract plain text streams, or invert to Dark Mode — all client-side.
            </p>

            {/* Trust Strip */}
            <div className="flex flex-wrap gap-4 items-center text-xs font-semibold text-[#4a475f]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.75 h-1.75 bg-[#6E3CF6] rounded-full inline-block" />
                100% Client-Side Engine
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.75 h-1.75 bg-[#6E3CF6] rounded-full inline-block" />
                Zero Server Uploads
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.75 h-1.75 bg-[#6E3CF6] rounded-full inline-block" />
                Instant Processing
              </span>
            </div>
          </div>

          {/* Main Interactive Tool Workspace */}
          <div id="workspace" className="w-full">
            {activeTab === "darkmode" ? (
              <PdfDarkModeTool selectedFile={uploadedFiles[0]?.file} />
            ) : activeTab === "compress" ? (
              <PdfCompressionTool selectedFile={uploadedFiles[0]?.file} />
            ) : activeTab === "pdfToImages" ? (
              <PdfToImagesTool selectedFile={uploadedFiles[0]?.file} />
            ) : activeTab === "imagesToPdf" ? (
              <ImagesToPdfTool />
            ) : activeTab === "pageManager" ? (
              <PdfPageManagerTool />
            ) : activeTab === "watermark" ? (
              <PdfWatermarkTool />
            ) : activeTab === "extractText" ? (
              <PdfTextExtractorTool />
            ) : activeTab === "operations" ? (
              <PdfOperationsTool initialMode={opMode} />
            ) : (
              <FileUploader
                files={uploadedFiles}
                onFilesChange={setUploadedFiles}
                maxSizeMB={100}
              />
            )}
          </div>
        </div>
      </header>

      {/* 3. MARQUEE */}
      <div className="border-t-[3px] border-b-[3px] border-[#0B0B14] bg-[#0B0B14] overflow-hidden py-3.5">
        <div className="animate-marquee">
          <span>
            IMAGES → PDF ✦ DELETE & REORDER PAGES ✦ WATERMARKS & PAGE NUMBERS ✦ EXTRACT TEXT ✦ COMPRESS PDF ✦ PDF → IMAGES ✦ DARK MODE ✦{" "}
          </span>
          <span>
            IMAGES → PDF ✦ DELETE & REORDER PAGES ✦ WATERMARKS & PAGE NUMBERS ✦ EXTRACT TEXT ✦ COMPRESS PDF ✦ PDF → IMAGES ✦ DARK MODE ✦{" "}
          </span>
        </div>
      </div>

      {/* 4. PRODUCT FAMILY GRID */}
      <section id="lineup" className="py-16">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="max-w-[640px] mx-auto mb-13 text-center">
            <span className="font-mono-custom text-xs font-semibold text-[#4B1FCB] uppercase tracking-widest inline-block mb-3">
              // the lineup
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14] mb-2.5">
              the full product family
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: "Images → PDF", emoji: "🖼️", bg: "#C6FF3D", text: "#0B0B14", rot: "-rotate-[1.5deg]", tab: "imagesToPdf" },
              { name: "Reorder Pages", emoji: "📋", bg: "#FF3D9A", text: "#FFFFFF", rot: "rotate-[1deg]", tab: "pageManager" },
              { name: "Watermark", emoji: "✍️", bg: "#6E3CF6", text: "#FFFFFF", rot: "-rotate-[0.5deg]", tab: "watermark" },
              { name: "Extract Text", emoji: "📝", bg: "#3B7DED", text: "#FFFFFF", rot: "rotate-[1deg]", tab: "extractText" },
              { name: "Compress PDF", emoji: "📉", bg: "#4B1FCB", text: "#FFFFFF", rot: "-rotate-[1.5deg]", tab: "compress" },
              { name: "PDF → Images", emoji: "📦", bg: "#1F9D55", text: "#FFFFFF", rot: "rotate-[1deg]", tab: "pdfToImages" },
              { name: "PDF Dark Mode", emoji: "🌙", bg: "#0B0B14", text: "#C6FF3D", rot: "-rotate-[0.5deg]", tab: "darkmode" },
              { name: "Merge PDF", emoji: "🥞", bg: "#E8622A", text: "#FFFFFF", rot: "rotate-[1deg]", tab: "merge" },
              { name: "Split PDF", emoji: "✂️", bg: "#2AA9C4", text: "#FFFFFF", rot: "-rotate-[0.5deg]", tab: "split" },
              { name: "Word → PDF", emoji: "📄", bg: "#3B7DED", text: "#FFFFFF", rot: "-rotate-[1.5deg]", tab: "uploader" },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.tab === "darkmode") setActiveTab("darkmode");
                  else if (item.tab === "compress") setActiveTab("compress");
                  else if (item.tab === "pdfToImages") setActiveTab("pdfToImages");
                  else if (item.tab === "imagesToPdf") setActiveTab("imagesToPdf");
                  else if (item.tab === "pageManager") setActiveTab("pageManager");
                  else if (item.tab === "watermark") setActiveTab("watermark");
                  else if (item.tab === "extractText") setActiveTab("extractText");
                  else if (item.tab === "merge") { setActiveTab("operations"); setOpMode("merge"); }
                  else if (item.tab === "split") { setActiveTab("operations"); setOpMode("split"); }
                  else setActiveTab("uploader");
                  const ws = document.getElementById("workspace");
                  ws?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`bg-white border-[3px] border-[#0B0B14] rounded-2xl p-5 text-center shadow-[4px_4px_0_#0B0B14] hover:translate-y-[-5px] hover:rotate-0 hover:shadow-[8px_8px_0_#0B0B14] transition-all cursor-pointer ${item.rot}`}
              >
                <div
                  style={{ backgroundColor: item.bg, color: item.text }}
                  className="w-11 h-11 mx-auto mb-3 border-2 border-[#0B0B14] rounded-xl flex items-center justify-center font-display font-bold text-sm shadow-xs"
                >
                  {item.emoji}
                </div>
                <p className="font-display font-semibold text-xs text-[#0B0B14]">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-10 text-center font-mono-custom text-xs text-[#6b6884]">
        <div className="max-w-[1180px] mx-auto px-6">
          © 2026 flip. — client-side PDF studio
        </div>
      </footer>
    </div>
  );
}
