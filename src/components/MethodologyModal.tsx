import React from 'react';
import { X, BookOpen, Layers, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 text-slate-800 flex items-center justify-center shadow-2xs">
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-semibold text-slate-900 tracking-tight">
                How Content Transformer Works
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Fact-invariant adaptation methodology and guardrails
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-slate-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-stone-600 max-h-[70vh] overflow-y-auto leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="font-serif font-semibold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center">
                1
              </span>
              The Challenge of Document Adaptation
            </h3>
            <p className="text-stone-600 pl-7">
              Standard summarizers compress text but often strip away instructional clarity, critical nuances, and authentic tone. Conversely, unconstrained language models risk introducing external facts and hallucinations when rewriting complex material. Content Transformer resolves this through strict <strong>source-grounded rewriting</strong>.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="font-serif font-semibold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center">
                2
              </span>
              The Four-Step Adaptation Pipeline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
              <div className="p-4 rounded-2xl border border-stone-200 bg-[#FAF9F5]">
                <div className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Source Extraction
                </div>
                <p className="text-xs text-stone-500">
                  Binary extraction of Word documents, PDF text streams, or raw text into clean, uncorrupted UTF-8 input.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-stone-200 bg-[#FAF9F5]">
                <div className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  Lexical Calibration
                </div>
                <p className="text-xs text-stone-500">
                  Calibrates vocabulary, readability, and sentence complexity using Gemini 3.8 Flash with low temperature (0.2) to preserve facts.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-stone-200 bg-[#FAF9F5]">
                <div className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Structural Reshaping
                </div>
                <p className="text-xs text-stone-500">
                  Translates content into chosen pedagogical structures (explanations, summaries, study notes, FAQs, quizzes, slide outlines).
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-stone-200 bg-[#FAF9F5]">
                <div className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Factual Audit & Logging
                </div>
                <p className="text-xs text-stone-500">
                  Generates an automated checklist logging preserved facts and providing transparent editorial rationales for any condensed details.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50 text-xs text-stone-600 space-y-1">
            <span className="font-semibold text-slate-900 block">Server-Side Security Guarantee:</span>
            <p>
              All document parsing and model requests run server-side. Your documents are never exposed in browser script bundles, and Word DOCX exports are built natively on the server.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-stone-100 font-medium hover:bg-slate-800 transition-colors cursor-pointer text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
