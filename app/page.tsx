"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/src/components/Navbar";
import FileUploader from "@/src/components/FileUploader";
import { UploadedFile } from "@/src/types";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F5F2FF] text-[#0B0B14] flex flex-col font-sans">
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. HERO */}
      <header className="py-16 md:py-20 relative overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-[#C6FF3D] border-[3px] border-[#0B0B14] rounded-full px-3.5 py-1.5 font-mono-custom text-xs font-semibold -rotate-2 mb-6 shadow-xs">
              ✦ zero installs, zero cap
            </div>

            {/* H1 Title */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[64px] leading-[0.98] tracking-tight mb-6 text-[#0B0B14]">
              turn any file into a{" "}
              <span className="bg-[#6E3CF6] text-white px-2.5 py-0.5 inline-block -rotate-1 rounded-md">
                PDF
              </span>{" "}
              in seconds.
            </h1>

            {/* Subtitle */}
            <p className="text-lg leading-relaxed text-[#33314a] max-w-md mb-8">
              drag it in, we crunch it, you download. word, excel, slides, jpgs — whatever's on your camera roll, flip. handles it.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap gap-3.5 mb-8">
              <a
                href="#workspace"
                className="btn-brutal-purple px-7 py-4 text-base font-display font-bold"
              >
                start converting
              </a>
              <a
                href="#lineup"
                className="px-7 py-4 rounded-xl border-[3px] border-[#0B0B14] bg-white text-[#0B0B14] font-display font-bold text-base hover:bg-[#F5F2FF] transition-colors inline-flex items-center justify-center"
              >
                see all tools
              </a>
            </div>

            {/* Trust Strip */}
            <div className="flex flex-wrap gap-4 items-center text-xs font-semibold text-[#4a475f]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.75 h-1.75 bg-[#6E3CF6] rounded-full inline-block" />
                256-bit encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.75 h-1.75 bg-[#6E3CF6] rounded-full inline-block" />
                100% in-browser
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.75 h-1.75 bg-[#6E3CF6] rounded-full inline-block" />
                no signup needed
              </span>
            </div>
          </div>

          {/* Hero Converter Workspace */}
          <div id="workspace" className="w-full">
            <FileUploader
              files={uploadedFiles}
              onFilesChange={setUploadedFiles}
              maxSizeMB={100}
            />
          </div>
        </div>
      </header>

      {/* 3. MARQUEE */}
      <div className="border-t-[3px] border-b-[3px] border-[#0B0B14] bg-[#0B0B14] overflow-hidden py-3.5">
        <div className="animate-marquee">
          <span>
            WORD → PDF ✦ PDF → WORD ✦ MERGE PDF ✦ SPLIT PDF ✦ DARK MODE ✦ COMPRESS PDF ✦ IMAGES → PDF ✦{" "}
          </span>
          <span>
            WORD → PDF ✦ PDF → WORD ✦ MERGE PDF ✦ SPLIT PDF ✦ DARK MODE ✦ COMPRESS PDF ✦ IMAGES → PDF ✦{" "}
          </span>
        </div>
      </div>

      {/* 4. HOW IT WORKS */}
      <section className="py-20">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="max-w-[640px] mx-auto mb-13 text-center">
            <span className="font-mono-custom text-xs font-semibold text-[#4B1FCB] uppercase tracking-widest inline-block mb-3">
              // how it works
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14] mb-2.5">
              three steps. no notes.
            </h2>
            <p className="text-[#54506a] text-lg">
              honestly this is the whole process. we're not gonna gatekeep it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5">
            <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-7 shadow-[4px_4px_0_#0B0B14] hover:translate-y-[-4px] hover:shadow-[8px_8px_0_#0B0B14] transition-all">
              <span className="stroked-num text-4xl block mb-2.5">01</span>
              <h3 className="font-display font-bold text-xl mb-2 text-[#0B0B14]">upload</h3>
              <p className="text-[#54506a] text-sm leading-relaxed">
                pick your word, excel, powerpoint, or whatever file's giving you trouble.
              </p>
            </div>

            <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-7 shadow-[4px_4px_0_#0B0B14] hover:translate-y-[-4px] hover:shadow-[8px_8px_0_#0B0B14] transition-all">
              <span className="stroked-num text-4xl block mb-2.5">02</span>
              <h3 className="font-display font-bold text-xl mb-2 text-[#0B0B14]">we cook</h3>
              <p className="text-[#54506a] text-sm leading-relaxed">
                our converter does its thing and turns it into a clean PDF in seconds.
              </p>
            </div>

            <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-7 shadow-[4px_4px_0_#0B0B14] hover:translate-y-[-4px] hover:shadow-[8px_8px_0_#0B0B14] transition-all">
              <span className="stroked-num text-4xl block mb-2.5">03</span>
              <h3 className="font-display font-bold text-xl mb-2 text-[#0B0B14]">download</h3>
              <p className="text-[#54506a] text-sm leading-relaxed">
                grab your file. everything you uploaded gets wiped from our servers after.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY FLIP / FEATURES */}
      <section className="py-16 pt-0">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="max-w-[640px] mx-auto mb-13 text-center">
            <span className="font-mono-custom text-xs font-semibold text-[#4B1FCB] uppercase tracking-widest inline-block mb-3">
              // why flip.
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14] mb-2.5">
              built different, actually private
            </h2>
            <p className="text-[#54506a] text-lg">
              the boring-but-important stuff, made short.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5.5">
            <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6.5 shadow-[4px_4px_0_#0B0B14]">
              <div className="w-11 h-11 border-2 border-[#0B0B14] rounded-xl bg-[#C6FF3D] flex items-center justify-center text-xl mb-4">
                🔒
              </div>
              <h3 className="font-display font-bold text-base mb-2 text-[#0B0B14]">locked down</h3>
              <p className="text-[#54506a] text-xs leading-relaxed">
                256-bit SSL on every transfer. your files are never sold or shared. ever.
              </p>
            </div>

            <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6.5 shadow-[4px_4px_0_#0B0B14]">
              <div className="w-11 h-11 border-2 border-[#0B0B14] rounded-xl bg-[#FF3D9A] text-xl mb-4">
                ⏱️
              </div>
              <h3 className="font-display font-bold text-base mb-2 text-[#0B0B14]">self-destructs</h3>
              <p className="text-[#54506a] text-xs leading-relaxed">
                files auto-delete after 3 hours whether you remember to or not.
              </p>
            </div>

            <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6.5 shadow-[4px_4px_0_#0B0B14]">
              <div className="w-11 h-11 border-2 border-[#0B0B14] rounded-xl bg-[#8EE4FF] text-xl mb-4">
                🌍
              </div>
              <h3 className="font-display font-bold text-base mb-2 text-[#0B0B14]">runs anywhere</h3>
              <p className="text-[#54506a] text-xs leading-relaxed">
                windows, mac, linux, phone — if it's got a browser, it works.
              </p>
            </div>

            <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6.5 shadow-[4px_4px_0_#0B0B14]">
              <div className="w-11 h-11 border-2 border-[#0B0B14] rounded-xl bg-[#6E3CF6] text-white text-xl mb-4">
                🧰
              </div>
              <h3 className="font-display font-bold text-base mb-2 text-[#0B0B14]">full toolkit</h3>
              <p className="text-[#54506a] text-xs leading-relaxed">
                merge, split, dark mode, compression — way more than just conversions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRODUCT FAMILY GRID (Linking to dedicated tool pages) */}
      <section id="lineup" className="py-16 pt-0">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="max-w-[640px] mx-auto mb-13 text-center">
            <span className="font-mono-custom text-xs font-semibold text-[#4B1FCB] uppercase tracking-widest inline-block mb-3">
              // the lineup
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14] mb-2.5">
              the full product family
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "JPG to PDF", emoji: "🖼️", bg: "#C6FF3D", text: "#0B0B14", rot: "-rotate-[1.5deg]", href: "/jpg-to-pdf" },
              { name: "Merge PDF", emoji: "🥞", bg: "#3B7DED", text: "#FFFFFF", rot: "rotate-[1deg]", href: "/merge-pdf" },
              { name: "Split PDF", emoji: "✂️", bg: "#E8622A", text: "#FFFFFF", rot: "-rotate-[0.5deg]", href: "/split-pdf" },
              { name: "Compress PDF", emoji: "📉", bg: "#4B1FCB", text: "#FFFFFF", rot: "-rotate-[1.5deg]", href: "/compress-pdf" },
              { name: "PDF Dark Mode", emoji: "🌙", bg: "#0B0B14", text: "#C6FF3D", rot: "-rotate-[0.5deg]", href: "/dark-mode" },
              { name: "PDF to Images", emoji: "📦", bg: "#1F9D55", text: "#FFFFFF", rot: "rotate-[1deg]", href: "/pdf-to-jpg" },
              { name: "Reorder Pages", emoji: "📋", bg: "#FF3D9A", text: "#FFFFFF", rot: "rotate-[1deg]", href: "/page-manager" },
              { name: "Add Watermark", emoji: "✍️", bg: "#6E3CF6", text: "#FFFFFF", rot: "-rotate-[0.5deg]", href: "/watermark" },
              { name: "Extract Text", emoji: "📝", bg: "#3B7DED", text: "#FFFFFF", rot: "rotate-[1deg]", href: "/extract-text" },
              { name: "Protect PDF", emoji: "🔒", bg: "#FF3D9A", text: "#FFFFFF", rot: "-rotate-[0.5deg]", href: "/protect-pdf" },
              { name: "Word to PDF", emoji: "W", bg: "#3B7DED", text: "#FFFFFF", rot: "rotate-[1deg]", href: "/" },
              { name: "Excel to PDF", emoji: "X", bg: "#1F9D55", text: "#FFFFFF", rot: "-rotate-[0.5deg]", href: "/" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`bg-white border-[3px] border-[#0B0B14] rounded-2xl p-5.5 text-center shadow-[4px_4px_0_#0B0B14] hover:translate-y-[-5px] hover:rotate-0 hover:shadow-[8px_8px_0_#0B0B14] transition-all cursor-pointer block ${item.rot}`}
              >
                <div
                  style={{ backgroundColor: item.bg, color: item.text }}
                  className="w-11 h-11 mx-auto mb-3 border-2 border-[#0B0B14] rounded-xl flex items-center justify-center font-display font-bold text-sm shadow-xs"
                >
                  {item.emoji}
                </div>
                <p className="font-display font-semibold text-xs text-[#0B0B14]">{item.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQS */}
      <section className="py-16 pt-0">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-10">
            <span className="font-mono-custom text-xs font-semibold text-[#4B1FCB] uppercase tracking-widest inline-block mb-3">
              // faqs
            </span>
            <h2 className="font-display font-bold text-3xl text-[#0B0B14]">
              questions, answered fast
            </h2>
          </div>

          <div className="space-y-3.5">
            {[
              {
                q: "how do i convert a file to PDF for free?",
                a: "upload your file above — word, excel, powerpoint, jpg, and more all work — and download the finished PDF. no account, no cost.",
              },
              {
                q: "can i convert a PDF back to Word or Excel?",
                a: "yep. same three-step flow works in reverse for Word, Excel, PowerPoint, and image exports too.",
              },
              {
                q: "do i need to install anything?",
                a: "nope, it's 100% browser-based. windows, mac, linux, or mobile — you're good.",
              },
              {
                q: "is it actually safe to upload my documents?",
                a: "every transfer is 256-bit encrypted, files auto-delete after 3 hours, and nothing is ever shared with third parties.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border-[3px] border-[#0B0B14] rounded-2xl overflow-hidden shadow-[4px_4px_0_#0B0B14]"
              >
                <div
                  onClick={() => toggleFaq(idx)}
                  className="flex items-center justify-between p-4.5 sm:p-5.5 cursor-pointer font-display font-semibold text-base text-[#0B0B14]"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`w-7 h-7 border-2 border-[#0B0B14] rounded-full flex items-center justify-center flex-shrink-0 ml-3.5 font-bold text-base transition-transform ${
                      openFaq === idx ? "rotate-45 bg-[#C6FF3D]" : "bg-white"
                    }`}
                  >
                    +
                  </span>
                </div>

                {openFaq === idx && (
                  <div className="px-4.5 sm:px-5.5 pb-5 text-[#54506a] text-sm leading-relaxed border-t-2 border-[#0B0B14]/10 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA BAND */}
      <div className="bg-[#0B0B14] border-t-[3px] border-b-[3px] border-[#0B0B14] py-18 text-center relative overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-6">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-3.5">
            ready to flip your files?
          </h2>
          <p className="text-[#b9b6cf] text-lg mb-8">
            no signup. no watermark. no catch.
          </p>
          <a
            href="#workspace"
            className="btn-brutal-solid px-8 py-4 text-base font-display font-bold bg-[#C6FF3D] text-[#0B0B14] shadow-[8px_8px_0_#6E3CF6] hover:translate-x-[-3px] hover:translate-y-[-3px] inline-block"
          >
            choose a file →
          </a>
        </div>
      </div>

      {/* 9. FOOTER */}
      <footer className="py-10 text-center font-mono-custom text-xs text-[#6b6884]">
        <div className="max-w-[1180px] mx-auto px-6">
          © 2026 flip. — made for people who hate slow converters
        </div>
      </footer>
    </div>
  );
}
