"use client";

import React, { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolFaqProps {
  toolTitle: string;
  faqs: FaqItem[];
  className?: string;
}

export const ToolFaq: React.FC<ToolFaqProps> = ({
  toolTitle,
  faqs,
  className = "",
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className={`w-full max-w-[800px] mx-auto py-10 px-4 ${className}`}>
      <div className="text-center mb-8">
        <span className="font-mono-custom text-xs font-semibold text-[#4B1FCB] uppercase tracking-widest inline-block mb-2">
          // faqs for {toolTitle}
        </span>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0B0B14]">
          frequently asked questions
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white border-[3px] border-[#0B0B14] rounded-2xl overflow-hidden shadow-[4px_4px_0_#0B0B14]"
          >
            <div
              onClick={() => toggleFaq(idx)}
              className="flex items-center justify-between p-4 sm:p-5 cursor-pointer font-display font-semibold text-sm sm:text-base text-[#0B0B14]"
            >
              <span>{faq.question}</span>
              <span
                className={`w-7 h-7 border-2 border-[#0B0B14] rounded-full flex items-center justify-center flex-shrink-0 ml-3.5 font-bold text-base transition-transform ${
                  openFaq === idx ? "rotate-45 bg-[#C6FF3D]" : "bg-white"
                }`}
              >
                +
              </span>
            </div>

            {openFaq === idx && (
              <div className="px-4 sm:px-5 pb-5 text-[#54506a] text-xs sm:text-sm leading-relaxed border-t-2 border-[#0B0B14]/10 pt-3 font-sans">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolFaq;
