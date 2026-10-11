import React from 'react';
import { BookOpen, GitBranch, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  onOpenMethodology: () => void;
  onOpenDeployment: () => void;
  onReset: () => void;
  hasDocument: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMethodology,
  onOpenDeployment,
  onReset,
  hasDocument,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-stone-100 flex items-center justify-center shadow-xs">
            <FileText className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-slate-900 tracking-tight text-lg">
                Content Transformer
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200/70">
                Editorial Assistant
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-sans hidden md:block">
              Tailor any document to any reader without losing essential facts
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Subtle model indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Factual Guardrails Active</span>
          </div>

          {/* Reset button if document is loaded */}
          {hasDocument && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:text-slate-900 hover:bg-stone-100 transition-colors text-xs font-medium cursor-pointer"
              title="Start with a fresh document"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Start Over</span>
            </button>
          )}

          {/* Methodology modal trigger */}
          <button
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:text-slate-900 hover:border-stone-300 transition-colors text-xs font-medium cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">How It Works</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* Deployment modal trigger */}
          <button
            onClick={onOpenDeployment}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-stone-50 hover:bg-slate-800 transition-colors text-xs font-medium cursor-pointer shadow-2xs"
          >
            <GitBranch className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden sm:inline">Export & Deploy</span>
            <span className="sm:hidden">Deploy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
