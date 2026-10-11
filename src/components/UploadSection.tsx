import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  Clipboard,
  AlertCircle,
  Loader2,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_DOCUMENTS, SampleDocument } from '../data/sampleDocuments';
import { DocumentMetadata } from '../types';

interface UploadSectionProps {
  onDocumentExtracted: (text: string, metadata: DocumentMetadata, defaultPreset?: Partial<any>) => void;
  isExtracting: boolean;
  setIsExtracting: (val: boolean) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onDocumentExtracted,
  isExtracting,
  setIsExtracting,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('samples');
  const [pasteContent, setPasteContent] = useState('');
  const [pasteTitle, setPasteTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler
  const handleFileUpload = async (file: File) => {
    setExtractionError(null);
    setIsExtracting(true);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch('/api/extract-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to extract text from this document.');
      }

      onDocumentExtracted(data.text, {
        fileName: data.fileName,
        fileType: data.fileType,
        fileSize: data.fileSize,
        wordCount: data.wordCount,
        charCount: data.charCount,
        paragraphCount: data.paragraphCount,
      });
    } catch (err: any) {
      console.error('File extraction failed:', err);
      setExtractionError(err.message || 'Error processing document.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Direct paste handler
  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteContent.trim()) {
      setExtractionError('Please paste or enter some text before continuing.');
      return;
    }

    setExtractionError(null);
    setIsExtracting(true);

    try {
      const response = await fetch('/api/extract-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: pasteContent,
          fileName: pasteTitle.trim() || 'Pasted Notes.txt',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to process pasted text.');
      }

      onDocumentExtracted(data.text, {
        fileName: data.fileName,
        fileType: data.fileType,
        fileSize: data.fileSize,
        wordCount: data.wordCount,
        charCount: data.charCount,
        paragraphCount: data.paragraphCount,
      });
    } catch (err: any) {
      console.error('Text parsing failed:', err);
      setExtractionError(err.message || 'Error processing pasted text.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Sample document load handler
  const handleLoadSample = (sample: SampleDocument) => {
    setExtractionError(null);
    const wordCount = sample.content.trim().split(/\s+/).length;
    const charCount = sample.content.length;

    onDocumentExtracted(
      sample.content,
      {
        fileName: `${sample.title}.txt`,
        fileType: 'txt',
        fileSize: charCount,
        wordCount,
        charCount,
        paragraphCount: sample.content.split(/\n\s*\n/).length,
      },
      {
        targetAudience: sample.defaultAudience,
        readingLevel: sample.defaultReadingLevel,
        tone: sample.defaultTone,
        outputFormat: sample.defaultFormat,
      }
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-lg font-serif font-semibold text-slate-900 tracking-tight">
            Select or upload your source document
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Choose an example document or bring your own research, report, or narrative.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex p-1 bg-stone-100 rounded-2xl border border-stone-200/80 text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('samples')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'samples'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            Example Documents
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {/* Error notification if extraction fails */}
      {extractionError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{extractionError}</p>
            <p className="text-amber-700 mt-0.5">
              Please make sure your file contains readable text and is not an empty or password-protected document.
            </p>
          </div>
        </div>
      )}

      {/* Tab 1: Example Documents */}
      {activeTab === 'samples' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_DOCUMENTS.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleLoadSample(doc)}
                className="group p-5 rounded-2xl border border-stone-200/80 hover:border-indigo-300 bg-stone-50/50 hover:bg-white transition-all cursor-pointer flex flex-col justify-between hover:shadow-sm"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                      {doc.category}
                    </span>
                    <span className="text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Load Document <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                  <h3 className="font-serif font-semibold text-slate-900 text-sm leading-snug group-hover:text-indigo-950 transition-colors">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {doc.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span>
                    Default Audience: <strong className="text-stone-700">{doc.defaultAudience}</strong>
                  </span>
                  <span>
                    Format: <strong className="text-stone-700">{doc.defaultFormat}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Upload File */}
      {activeTab === 'upload' && (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
            accept=".txt,.pdf,.docx,.doc,.md"
            className="hidden"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center border ${
              dragOver
                ? 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-300'
                : 'border-stone-200 bg-stone-50/60 hover:bg-stone-50 hover:border-stone-300'
            }`}
          >
            {isExtracting ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="font-medium text-slate-800 text-sm">
                  Reading document and extracting text...
                </p>
                <p className="text-xs text-stone-500">
                  Processing formatting, paragraphs, and contents
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-2xs text-stone-700">
                  <Upload className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    Drop your document here, or <span className="text-indigo-600 underline">browse files</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Supports Microsoft Word (.docx), PDF (.pdf), and Plain Text (.txt, .md) up to 25MB.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 text-xs text-stone-500 font-medium">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-stone-200">
                    <FileText className="w-3 h-3 text-stone-500" /> PDF
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-stone-200">
                    <File className="w-3 h-3 text-stone-500" /> DOCX
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-stone-200">
                    <FileSpreadsheet className="w-3 h-3 text-stone-500" /> TXT
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Paste Text */}
      {activeTab === 'paste' && (
        <form onSubmit={handlePasteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Document title (optional)
            </label>
            <input
              type="text"
              value={pasteTitle}
              onChange={(e) => setPasteTitle(e.target.value)}
              placeholder="e.g. Chapter 4 Summary, Project Proposal, Meeting Notes"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">
                Source text
              </label>
              <span className="text-[11px] text-stone-500">
                {pasteContent.length} characters • {pasteContent.trim() ? pasteContent.trim().split(/\s+/).length : 0} words
              </span>
            </div>
            <textarea
              rows={7}
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder="Paste the source document text here (articles, research papers, reports, study guides)..."
              className="w-full p-4 text-xs font-sans rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isExtracting || !pasteContent.trim()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-stone-100 font-medium text-xs hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-xs"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing text...</span>
                </>
              ) : (
                <>
                  <span>Load Document</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
