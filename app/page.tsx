"use client";

import React, { useState } from "react";
import FileUploader from "@/src/components/FileUploader";
import PdfDarkModeTool from "@/src/components/PdfDarkModeTool";
import { UploadedFile } from "@/src/types";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState<"uploader" | "darkmode">("uploader");

  return (
    <div className="min-h-screen text-[#13161C] flex flex-col font-sans">
      <div className="max-w-[1180px] w-full mx-auto px-5 md:px-10">
        {/* NAV */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5 font-display font-semibold text-xl tracking-tight text-[#13161C]">
            <span className="w-[26px] h-[26px] relative block">
              <svg viewBox="0 0 26 26" className="w-full h-full">
                <path d="M4 2h13l5 5v17H4z" fill="none" stroke="#13161C" strokeWidth="1.6" />
                <path d="M17 2v5h5" fill="none" stroke="#13161C" strokeWidth="1.6" />
                <path d="M17 2v5h5" fill="#FF7A1A" fillOpacity="0.25" />
              </svg>
            </span>
            Foldr
          </div>

          <div className="hidden md:flex items-center gap-9 text-sm text-[#4A505C] font-medium">
            <button
              onClick={() => setActiveTab("uploader")}
              className={`hover:text-[#13161C] transition-colors ${
                activeTab === "uploader" ? "text-[#FF7A1A] font-bold" : ""
              }`}
            >
              Convert
            </button>
            <button
              onClick={() => setActiveTab("darkmode")}
              className={`hover:text-[#13161C] transition-colors ${
                activeTab === "darkmode" ? "text-[#FF7A1A] font-bold" : ""
              }`}
            >
              PDF Dark Mode
            </button>
            <a href="#formats" className="hover:text-[#13161C] transition-colors">Formats</a>
            <a href="#how-it-works" className="hover:text-[#13161C] transition-colors">How it works</a>
          </div>

          <a
            href="#converter"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#13161C] text-white hover:bg-black transition-colors"
          >
            Open converter
          </a>
        </nav>

        {/* HERO */}
        <section id="converter" className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center py-12 lg:py-24">
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 font-mono-custom text-xs tracking-wider text-[#1C7A38] bg-[#E3F6E7] px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2FA84F] inline-block" />
              No signup · files deleted after 1 hour
            </div>

            {/* H1 */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] tracking-tight mb-5 text-[#13161C]">
              Turn any PDF into the file you<br className="hidden sm:block" /> actually{" "}
              <span className="text-[#FF7A1A]">need.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg leading-relaxed text-[#4A505C] max-w-md mb-8">
              Drop a PDF, pick a format or invert to Dark Mode in seconds. No watermarks, no waiting rooms.
            </p>

            {/* Hero CTA */}
            <div className="flex flex-wrap gap-3.5 mb-9">
              <button
                onClick={() => setActiveTab("uploader")}
                className={`inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === "uploader"
                    ? "bg-[#FF7A1A] text-white hover:bg-[#C85400]"
                    : "border border-[#D7DBE0] text-[#13161C] hover:bg-white"
                }`}
              >
                Convert a file
              </button>

              <button
                onClick={() => setActiveTab("darkmode")}
                className={`inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === "darkmode"
                    ? "bg-[#FF7A1A] text-white hover:bg-[#C85400]"
                    : "border border-[#D7DBE0] text-[#13161C] hover:bg-white"
                }`}
              >
                🌙 PDF Dark Mode
              </button>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#8A909B] font-mono-custom">
              <span>2.4M files converted</span>
              <span>·</span>
              <span>256-bit encryption</span>
              <span>·</span>
              <span>Avg. 8s per file</span>
            </div>
          </div>

          {/* Hero Visual Container */}
          <div id="dropzone" className="bg-white border border-[#D7DBE0] rounded-2xl p-6 sm:p-9 min-h-[420px] flex flex-col items-center justify-center relative shadow-sm">
            {/* 3D Morph Stage Animation */}
            <div className="w-[180px] h-[220px] relative perspective-[900px] mb-4">
              <div className="absolute inset-0 rounded-r-[6px] rounded-l-none bg-white border-[1.5px] border-[#13161C] shadow-[6px_6px_0_#FFEBD9] flex flex-col items-center justify-center animate-flip backface-hidden transform-style-3d">
                <div className="font-mono-custom font-medium text-xs px-3 py-1 rounded bg-[#FFF6D6] text-[#8A6A00] mb-2.5">
                  .pdf
                </div>
                <div className="w-[70%] space-y-2">
                  <div className="h-0.5 bg-[#D7DBE0] rounded" />
                  <div className="h-0.5 bg-[#D7DBE0] rounded w-[80%]" />
                  <div className="h-0.5 bg-[#D7DBE0] rounded w-[60%]" />
                </div>
                <div className="absolute top-0 right-0 w-0 h-0 border-t-0 border-r-[16px] border-b-[16px] border-l-0 border-t-transparent border-r-[#EEF0F2] border-b-transparent border-l-transparent" />
              </div>

              <div className="absolute inset-0 rounded-r-[6px] rounded-l-none bg-white border-[1.5px] border-[#13161C] shadow-[6px_6px_0_#FFEBD9] flex flex-col items-center justify-center animate-flip-out backface-hidden transform-style-3d">
                <div className="font-mono-custom font-medium text-xs px-3 py-1 rounded bg-[#E3F6E7] text-[#1C7A38] mb-2.5">
                  .docx
                </div>
                <div className="w-[70%] space-y-2">
                  <div className="h-0.5 bg-[#D7DBE0] rounded" />
                  <div className="h-0.5 bg-[#D7DBE0] rounded w-[80%]" />
                  <div className="h-0.5 bg-[#D7DBE0] rounded w-[60%]" />
                </div>
                <div className="absolute top-0 right-0 w-0 h-0 border-t-0 border-r-[16px] border-b-[16px] border-l-0 border-t-transparent border-r-[#EEF0F2] border-b-transparent border-l-transparent" />
              </div>
            </div>

            {/* Switch between Uploader and Dark Mode Engine */}
            {activeTab === "uploader" ? (
              <FileUploader
                files={uploadedFiles}
                onFilesChange={setUploadedFiles}
                maxSizeMB={100}
              />
            ) : (
              <PdfDarkModeTool selectedFile={uploadedFiles[0]?.file} />
            )}
          </div>
        </section>

        {/* Dedicated PDF Dark Mode Engine Section */}
        <section id="darkmode-section" className="py-12 border-t border-[#D7DBE0]">
          <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFEBD9] text-[#C85400] text-xs font-mono-custom font-bold">
              <span>Task 2: Light-to-Dark Converter Engine</span>
            </div>
            <h2 className="font-display font-bold text-3xl text-[#13161C]">
              PDF Light-to-Dark Studio
            </h2>
            <p className="text-xs text-[#4A505C]">
              Invert PDF backgrounds to OLED Black, Dark Charcoal, or Midnight Blue without inverting colors in photos.
            </p>
          </div>

          <PdfDarkModeTool selectedFile={uploadedFiles[0]?.file} />
        </section>

        {/* FORMAT STRIP */}
        <section id="formats" className="py-2 pb-20">
          <div className="font-mono-custom text-xs text-[#8A909B] uppercase tracking-wider mb-4">
            Supported conversions
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { from: "pdf", to: "docx" },
              { from: "pdf", to: "xlsx" },
              { from: "pdf", to: "pptx" },
              { from: "pdf", to: "jpg" },
              { from: "pdf", to: "png" },
              { from: "docx", to: "pdf" },
              { from: "jpg", to: "pdf" },
              { from: "pptx", to: "pdf" },
            ].map((chip, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 bg-white border border-[#D7DBE0] rounded-xl px-4 py-3 font-mono-custom text-xs font-medium"
              >
                <span className="text-[#8A6A00]">{chip.from}</span>
                <span className="text-[#FF7A1A]">→</span>
                <span className="text-[#1C7A38]">{chip.to}</span>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20">
          <div className="max-w-[520px] mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-3 text-[#13161C]">
              Three steps, no detours
            </h2>
            <p className="text-[#4A505C] text-sm sm:text-base leading-relaxed">
              Every conversion runs the same clean path — drop the file, we handle the formatting, you get it back exactly as it looked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            <div className="bg-white border border-[#D7DBE0] rounded-2xl p-7">
              <div className="font-mono-custom text-xs font-semibold text-[#C85400] bg-[#FFEBD9] w-8 h-8 rounded-full flex items-center justify-center mb-5">
                01
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-[#13161C]">
                Drop your file
              </h3>
              <p className="text-sm text-[#4A505C] leading-relaxed">
                Drag it in or browse from your device. We accept files up to 100MB.
              </p>
            </div>

            <div className="bg-white border border-[#D7DBE0] rounded-2xl p-7">
              <div className="font-mono-custom text-xs font-semibold text-[#C85400] bg-[#FFEBD9] w-8 h-8 rounded-full flex items-center justify-center mb-5">
                02
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-[#13161C]">
                Pick a format
              </h3>
              <p className="text-sm text-[#4A505C] leading-relaxed">
                Choose where it's going — Word, Excel, image, or back into PDF.
              </p>
            </div>

            <div className="bg-white border border-[#D7DBE0] rounded-2xl p-7">
              <div className="font-mono-custom text-xs font-semibold text-[#C85400] bg-[#FFEBD9] w-8 h-8 rounded-full flex items-center justify-center mb-5">
                03
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-[#13161C]">
                Download it
              </h3>
              <p className="text-sm text-[#4A505C] leading-relaxed">
                Your converted file is ready in seconds, with layout and fonts intact.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* FEATURES */}
      <section className="features-bg text-white rounded-3xl p-10 md:p-16 mx-5 md:mx-10 my-6">
        <div className="max-w-[1180px] mx-auto space-y-12">
          <div className="max-w-[520px]">
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-3 text-white">
              Built for files you can't afford to mess up
            </h2>
            <p className="text-[#B7BCC6] text-sm sm:text-base leading-relaxed">
              Formatting, tables, and images survive the trip — both ways.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="pt-4 border-t border-[#2C3038] space-y-2">
              <span className="font-mono-custom text-xs text-[#FF7A1A] font-semibold block">A</span>
              <h4 className="font-display font-semibold text-base text-white">Layout stays intact</h4>
              <p className="text-xs text-[#9BA0AA] leading-relaxed">
                Columns, tables, and images land in the same place they started.
              </p>
            </div>

            <div className="pt-4 border-t border-[#2C3038] space-y-2">
              <span className="font-mono-custom text-xs text-[#E8B400] font-semibold block">B</span>
              <h4 className="font-display font-semibold text-base text-white">Files auto-delete</h4>
              <p className="text-xs text-[#9BA0AA] leading-relaxed">
                Everything you upload is wiped from our servers after one hour.
              </p>
            </div>

            <div className="pt-4 border-t border-[#2C3038] space-y-2">
              <span className="font-mono-custom text-xs text-[#FF7A1A] font-semibold block">C</span>
              <h4 className="font-display font-semibold text-base text-white">Batch conversion</h4>
              <p className="text-xs text-[#9BA0AA] leading-relaxed">
                Queue up to 20 files and convert them together.
              </p>
            </div>

            <div className="pt-4 border-t border-[#2C3038] space-y-2">
              <span className="font-mono-custom text-xs text-[#2FA84F] font-semibold block">D</span>
              <h4 className="font-display font-semibold text-base text-white">Works on any device</h4>
              <p className="text-xs text-[#9BA0AA] leading-relaxed">
                No install. Runs in the browser on desktop, tablet, or phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND & FOOTER */}
      <div className="max-w-[1180px] w-full mx-auto px-5 md:px-10">
        <section className="text-center py-24 space-y-4">
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#13161C]">
            Your file is one drop away.
          </h2>
          <p className="text-[#4A505C] text-sm sm:text-base">
            No account, no credit card, no catch.
          </p>
          <div className="pt-2">
            <a
              href="#dropzone"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold bg-[#FF7A1A] text-white hover:bg-[#C85400] transition-colors"
            >
              Convert a file now
            </a>
          </div>
        </section>

        <footer className="border-t border-[#D7DBE0] py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-[#8A909B]">
            <div className="flex items-center gap-2 font-display font-semibold text-base text-[#13161C]">
              <span className="w-[20px] h-[20px] relative block">
                <svg viewBox="0 0 26 26" className="w-full h-full">
                  <path d="M4 2h13l5 5v17H4z" fill="none" stroke="#13161C" strokeWidth="1.6" />
                  <path d="M17 2v5h5" fill="none" stroke="#13161C" strokeWidth="1.6" />
                </svg>
              </span>
              Foldr
            </div>

            <div className="flex items-center gap-7">
              <a href="#" className="hover:text-[#13161C] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#13161C] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#13161C] transition-colors">API</a>
              <a href="#" className="hover:text-[#13161C] transition-colors">Contact</a>
            </div>

            <div className="font-mono-custom">
              © 2026 Foldr
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
