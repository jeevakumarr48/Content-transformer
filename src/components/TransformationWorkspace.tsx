import React, { useState, useEffect } from 'react';
import {
  Columns2,
  FileText,
  Copy,
  Check,
  Download,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { TransformationResult, DocumentMetadata } from '../types';
import { MarkdownView } from './MarkdownView';
import { FidelityChecklistCard } from './FidelityChecklistCard';

interface TransformationWorkspaceProps {
  result: TransformationResult;
  sourceText: string;
  sourceMetadata: DocumentMetadata;
  onRetry: () => void;
  isTransforming: boolean;
}

export const TransformationWorkspace: React.FC<TransformationWorkspaceProps> = ({
  result,
  sourceText,
  sourceMetadata,
  onRetry,
  isTransforming,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'transformed' | 'fidelity'>('split');
  const [copied, setCopied] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisAvailable(true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = () => {
    if (!speechSynthesisAvailable) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = result.transformedContent
        .replace(/#+\s+/g, '')
        .replace(/[*_`]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Copy handler
  const handleCopy = () => {
    navigator.clipboard.writeText(result.transformedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // TXT Download handler
  const handleDownloadTxt = () => {
    const textBlob = new Blob(
      [
        `TITLE: ${result.title}\n`,
        `TARGET AUDIENCE: ${result.metadata.targetAudience}\n`,
        `READING LEVEL: ${result.metadata.readingLevelAchieved}\n`,
        `TONE: ${result.metadata.toneAssessment}\n`,
        `FACTUAL FIDELITY SCORE: ${result.fidelityChecklist.fidelityScore}%\n`,
        `------------------------------------------------------------\n\n`,
        result.transformedContent,
        `\n\n------------------------------------------------------------\n`,
        `VERIFICATION NOTES:\n`,
        result.fidelityChecklist.fidelityVerdict,
        `\n\nPRESERVED CORE FACTS:\n`,
        result.fidelityChecklist.preservedCoreFacts.map((f) => `• ${f}`).join('\n'),
      ],
      { type: 'text/plain;charset=utf-8' }
    );

    const url = URL.createObjectURL(textBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.title.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 40)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // DOCX Download handler
  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    setExportError(null);

    try {
      const response = await fetch('/api/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: result.title,
          content: result.transformedContent,
          metadata: result.metadata,
          fidelityChecklist: result.fidelityChecklist,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Word document.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${result.title.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 40)}.docx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('DOCX Export error:', err);
      setExportError(err.message || 'Error exporting Word document.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview & Metadata Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200">
                Transformation Complete
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-600 font-medium">
                For: <strong className="text-slate-900">{result.metadata.targetAudience}</strong>
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-600 font-medium">
                Level: <strong className="text-slate-900">{result.metadata.readingLevelAchieved}</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight leading-snug">
              {result.title}
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 mt-1.5 max-w-2xl leading-relaxed">
              {result.summaryOverview}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              title="Copy text to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Read Aloud */}
            {speechSynthesisAvailable && (
              <button
                onClick={handleToggleSpeech}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer shadow-2xs ${
                  isSpeaking
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
                title="Listen to transformed text"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-red-600" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-stone-400" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            )}

            {/* Download TXT */}
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              title="Download text file"
            >
              <Download className="w-3.5 h-3.5 text-stone-400" />
              <span>TXT</span>
            </button>

            {/* Download DOCX */}
            <button
              onClick={handleDownloadDocx}
              disabled={isExportingDocx}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-stone-100 hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
              title="Download formatted Word document"
            >
              <Download className="w-3.5 h-3.5 text-indigo-300" />
              <span>{isExportingDocx ? 'Saving...' : 'Word (.docx)'}</span>
            </button>

            {/* Regenerate Button */}
            <button
              onClick={onRetry}
              disabled={isTransforming}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              title="Regenerate with current or tweaked settings"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Key Ideas & Core Takeaways */}
        {result.keyTakeaways && result.keyTakeaways.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Original Document Key Takeaways
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {result.keyTakeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/80 text-xs text-stone-800 leading-relaxed font-sans"
                >
                  <span className="font-semibold text-slate-900 block mb-0.5">Idea {idx + 1}</span>
                  {takeaway}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {exportError && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-2xl">
          {exportError}
        </div>
      )}

      {/* View Switcher Bar */}
      <div className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-3 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'split'
                ? 'bg-slate-900 text-stone-100 shadow-2xs'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Side-by-Side Comparison</span>
          </button>

          <button
            onClick={() => setViewMode('transformed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'transformed'
                ? 'bg-slate-900 text-stone-100 shadow-2xs'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Reading View</span>
          </button>

          <button
            onClick={() => setViewMode('fidelity')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'fidelity'
                ? 'bg-slate-900 text-stone-100 shadow-2xs'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Factual Audit ({result.fidelityChecklist.fidelityScore}%)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-stone-500 font-sans">
          <span>
            Transformed: <strong className="text-slate-800">{result.metadata.actualTransformedWordCount || result.metadata.estimatedWordCount}</strong> words
          </span>
          <span>•</span>
          <span>
            Original: <strong className="text-slate-800">{sourceMetadata.wordCount}</strong> words
          </span>
        </div>
      </div>

      {/* VIEW 1: SIDE-BY-SIDE (desktop side-by-side, mobile stacked) */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Original Source */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm flex flex-col h-[650px] overflow-hidden">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                <h3 className="font-serif font-semibold text-slate-800 text-xs">
                  Original Source Document
                </h3>
              </div>
              <span className="text-[11px] text-stone-500 font-mono bg-white px-2 py-0.5 rounded border border-stone-200">
                {sourceMetadata.fileName}
              </span>
            </div>

            <div className="p-6 overflow-y-auto flex-1 font-serif text-xs text-slate-700 leading-relaxed whitespace-pre-wrap selection:bg-stone-200 bg-[#FAF9F5]">
              {sourceText}
            </div>
          </div>

          {/* Right Column: Transformed Document */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm flex flex-col h-[650px] overflow-hidden">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <h3 className="font-serif font-semibold text-slate-900 text-xs">
                  Adapted Document Output
                </h3>
              </div>
              <span className="text-[11px] font-medium text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                {result.metadata.targetAudience}
              </span>
            </div>

            <div className="p-6 overflow-y-auto flex-1 selection:bg-indigo-100 bg-white">
              <MarkdownView content={result.transformedContent} />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL READING VIEW */}
      {viewMode === 'transformed' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-8 sm:p-12 max-w-3xl mx-auto">
          <div className="border-b border-stone-200 pb-5 mb-8">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block mb-1">
              Adapted Output • {result.metadata.targetAudience}
            </span>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              {result.title}
            </h1>
          </div>

          <div className="prose max-w-none">
            <MarkdownView content={result.transformedContent} />
          </div>
        </div>
      )}

      {/* VIEW 3: SOURCE-FIDELITY AUDIT */}
      {viewMode === 'fidelity' && (
        <div className="max-w-4xl mx-auto">
          <FidelityChecklistCard checklist={result.fidelityChecklist} />
        </div>
      )}

      {/* Always render Fidelity Checklist below split view */}
      {viewMode === 'split' && (
        <div className="pt-2">
          <FidelityChecklistCard checklist={result.fidelityChecklist} />
        </div>
      )}
    </div>
  );
};
