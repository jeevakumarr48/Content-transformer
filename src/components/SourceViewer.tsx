import React, { useState } from 'react';
import {
  FileText,
  Search,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Hash,
  X,
} from 'lucide-react';
import { DocumentMetadata } from '../types';

interface SourceViewerProps {
  sourceText: string;
  metadata: DocumentMetadata;
  onClear: () => void;
}

export const SourceViewer: React.FC<SourceViewerProps> = ({
  sourceText,
  metadata,
  onClear,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sourceText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const estReadTime = Math.max(1, Math.ceil(metadata.wordCount / 225));

  // Highlight search term in text if present
  const renderHighlightedText = () => {
    if (!searchQuery.trim()) {
      return sourceText;
    }

    const regex = new RegExp(`(${searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi');
    const parts = sourceText.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-amber-200 text-slate-900 font-medium px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center shadow-2xs">
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-semibold text-slate-900 text-sm sm:text-base truncate max-w-xs sm:max-w-md">
                {metadata.fileName}
              </h3>
              <span className="uppercase text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                {metadata.fileType}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Source of truth • Loaded for transformation
            </p>
          </div>
        </div>

        {/* Quick Stats Chips */}
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-stone-200 shadow-2xs" title="Word Count">
            <Hash className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-slate-900">{metadata.wordCount.toLocaleString()}</span>
            <span className="text-[11px] text-stone-500">words</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-stone-200 shadow-2xs" title="Reading Time">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-slate-900">{estReadTime}</span>
            <span className="text-[11px] text-stone-500">min read</span>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-2xs"
            title="Copy original text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-2xs"
            title={isCollapsed ? 'Show document text' : 'Hide document text'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          <button
            onClick={onClear}
            className="p-1.5 rounded-xl border border-stone-200 bg-white hover:bg-red-50 text-stone-500 hover:text-red-600 transition-colors cursor-pointer shadow-2xs"
            title="Change document"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Collapsible Source Viewer Body */}
      {!isCollapsed && (
        <div className="p-5 sm:p-6 space-y-3">
          {/* Search Bar */}
          <div className="relative max-w-sm">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words or phrases in source..."
              className="w-full pl-9 pr-7 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-stone-50/50 text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Text Container with comfortable reading font */}
          <div className="max-h-64 overflow-y-auto p-4 bg-[#FAF9F5] rounded-2xl border border-stone-200/80 text-xs font-serif text-slate-800 leading-relaxed whitespace-pre-wrap selection:bg-indigo-100">
            {renderHighlightedText()}
          </div>
        </div>
      )}
    </div>
  );
};
