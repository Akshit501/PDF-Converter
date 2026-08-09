"use client";

import React, { useState, useRef } from "react";
import {
  Lock,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { protectPdf, SecurityResult } from "@/src/lib/pdfSecurity";

export const PdfSecurityTool: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<SecurityResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExecuteProtect = async () => {
    if (!file) {
      setErrorMessage("Please choose a PDF file to encrypt.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("Please enter a password to protect your PDF.");
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const res = await protectPdf(file, password.trim());
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to encrypt PDF document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.blobUrl;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6 md:p-8 shadow-[8px_8px_0_#0B0B14] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#0B0B14]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-[#6E3CF6] text-white border-2 border-[#0B0B14] flex items-center justify-center font-bold shadow-xs">
              <Lock className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#0B0B14]">
                Protect PDF with Password
              </h3>
              <p className="text-xs text-[#5a5770] font-sans">
                Encrypt PDF document 100% client-side with user password protection
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
                setResult(null);
                setErrorMessage(null);
              }
            }}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl border-2 border-[#0B0B14] bg-white hover:bg-[#F5F2FF] text-xs font-display font-bold text-[#0B0B14] transition-colors flex items-center space-x-2"
          >
            <FileText className="w-4 h-4 text-[#6E3CF6]" />
            <span>{file ? file.name : "Choose PDF Document"}</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[#0B0B14] font-mono-custom font-bold block mb-1.5">
              Set PDF Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong password to encrypt PDF"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border-2 border-[#0B0B14] bg-white text-xs font-mono-custom font-bold outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#5a5770] hover:text-[#0B0B14]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExecuteProtect}
            disabled={!file || isProcessing || !password.trim()}
            className="w-full px-6 py-3.5 rounded-xl bg-[#0B0B14] text-[#C6FF3D] border-[3px] border-[#0B0B14] text-xs font-display font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Encrypting PDF...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Encrypt & Protect PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FF3D9A] text-white border-[3px] border-[#0B0B14] shadow-[4px_4px_0_#0B0B14] text-xs font-bold font-display flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-white border-[3px] border-[#0B0B14] shadow-[8px_8px_0_#0B0B14] flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-7 h-7 text-[#6E3CF6]" />
              <div>
                <h4 className="font-display font-bold text-base text-[#0B0B14]">
                  PDF Encrypted Successfully!
                </h4>
                <p className="text-xs text-[#5a5770] font-mono-custom">
                  Protected with password ({result.filename})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="px-6 py-3 rounded-xl bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] text-xs font-display font-bold transition-all flex items-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              <Download className="w-4 h-4" />
              <span>Download Protected PDF</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PdfSecurityTool;
