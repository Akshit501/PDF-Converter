import React from "react";
import Navbar from "@/src/components/Navbar";

export const metadata = {
  title: "Privacy Policy — Files Never Leave Your Device — flip.",
  description: "Learn how flip. converts and processes PDF documents 100% in-browser on your local device without external server uploads.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#09090B] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[860px] mx-auto w-full px-6 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-block bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] rounded-full px-3.5 py-1 font-mono-custom text-xs font-bold -rotate-2">
            🔒 100% In-Browser Privacy
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0B0B14]">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#54506a] font-mono-custom">
            Last updated: August 2026 · flip. client-side studio
          </p>
        </div>

        {/* Highlight Card */}
        <div className="bg-[#0B0B14] text-[#C6FF3D] border-[3px] border-[#0B0B14] rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0_#6E3CF6] space-y-3">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
            The Golden Rule: Files Never Leave Your Device
          </h2>
          <p className="text-sm text-[#b9b6cf] font-sans leading-relaxed">
            Unlike traditional PDF tools that upload your documents to third-party cloud servers, <strong className="text-white">flip.</strong> executes all conversions, page splitting, image extractions, and dark mode rendering 100% client-side inside your web browser.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 font-sans">
          <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6 shadow-[4px_4px_0_#0B0B14] space-y-2">
            <h3 className="font-display font-bold text-lg text-[#0B0B14]">
              1. Local Browser Memory Execution
            </h3>
            <p className="text-sm text-[#54506a] leading-relaxed">
              When you drop or select a PDF file, your web browser reads the file binary directly using WebAssembly engines (<code className="font-mono-custom font-bold text-[#6E3CF6]">pdf-lib</code> and <code className="font-mono-custom font-bold text-[#6E3CF6]">pdfjs-dist</code>). No file bytes are ever sent over HTTP to any remote server or database.
            </p>
          </div>

          <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6 shadow-[4px_4px_0_#0B0B14] space-y-2">
            <h3 className="font-display font-bold text-lg text-[#0B0B14]">
              2. Zero Data Retention & Automatic Memory Release
            </h3>
            <p className="text-sm text-[#54506a] leading-relaxed">
              Because no files are uploaded, there are no databases or cloud storage buckets holding your documents. The moment you close or refresh your browser tab, your operating system reclaims the local RAM allocated to the document.
            </p>
          </div>

          <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6 shadow-[4px_4px_0_#0B0B14] space-y-2">
            <h3 className="font-display font-bold text-lg text-[#0B0B14]">
              3. Privacy-Preserving Analytics
            </h3>
            <p className="text-sm text-[#54506a] leading-relaxed">
              We may track anonymous aggregate metrics (such as which tool tab was opened or overall conversion counts) to help us improve the user experience. These metrics never contain file names, page contents, document metadata, or personal identifiable information (PII).
            </p>
          </div>

          <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6 shadow-[4px_4px_0_#0B0B14] space-y-2">
            <h3 className="font-display font-bold text-lg text-[#0B0B14]">
              4. Security & Compliance
            </h3>
            <p className="text-sm text-[#54506a] leading-relaxed">
              Because your documents never traverse the network, <strong>flip.</strong> is inherently compliant with strict data privacy guidelines including GDPR, HIPAA, and CCPA requirements for document handling.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-10 text-center font-mono-custom text-xs text-[#6b6884]">
        © 2026 flip. — client-side PDF studio
      </footer>
    </div>
  );
}
