/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { UploadSection } from './components/UploadSection';
import { SourceViewer } from './components/SourceViewer';
import { AdaptationControls } from './components/AdaptationControls';
import { TransformationWorkspace } from './components/TransformationWorkspace';
import { MethodologyModal } from './components/MethodologyModal';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';
import { DocumentMetadata, TransformationOptions, TransformationResult } from './types';

export default function App() {
  const [sourceText, setSourceText] = useState<string>('');
  const [sourceMetadata, setSourceMetadata] = useState<DocumentMetadata | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  // Adaptation Options State
  const [options, setOptions] = useState<TransformationOptions>({
    targetAudience: 'High School Students (Grade 9-12)',
    readingLevel: 'Grade 10 (Standard High School)',
    tone: 'Engaging & Conversational',
    outputFormat: 'Simplified Explanation',
    language: 'English',
    desiredLength: 'Moderate (~700 words)',
    customInstructions: '',
  });

  // Transformation Results State
  const [result, setResult] = useState<TransformationResult | null>(null);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [transformError, setTransformError] = useState<string | null>(null);
  const [transformStepMessage, setTransformStepMessage] = useState<string>('');
  const transformationInProgress = useRef(false);
  const lastTransformation = useRef<{ key: string; result: TransformationResult } | null>(null);

  // Modals State
  const [showMethodology, setShowMethodology] = useState<boolean>(false);
  const [showDeployment, setShowDeployment] = useState<boolean>(false);

  // Document extracted callback
  const handleDocumentExtracted = (
    text: string,
    metadata: DocumentMetadata,
    defaultPreset?: Partial<TransformationOptions>
  ) => {
    setSourceText(text);
    setSourceMetadata(metadata);
    setResult(null);
    setTransformError(null);

    if (defaultPreset) {
      setOptions((prev) => ({
        ...prev,
        ...defaultPreset,
      }));
    }
  };

  // Reset all
  const handleReset = () => {
    setSourceText('');
    setSourceMetadata(null);
    setResult(null);
    setTransformError(null);
  };

  // Execute AI Transformation
  const handleExecuteTransformation = async () => {
    if (!sourceText.trim() || transformationInProgress.current) return;

    const payload = { sourceText: sourceText.trim(), ...options };
    const requestKey = JSON.stringify(payload);
    if (lastTransformation.current?.key === requestKey) {
      setResult(lastTransformation.current.result);
      setTransformError(null);
      return;
    }

    transformationInProgress.current = true;
    setIsTransforming(true);
    setTransformError(null);
    setTransformStepMessage('Reviewing document facts and structure...');

    const stepInterval = setInterval(() => {
      setTransformStepMessage((curr) => {
        if (curr.includes('Reviewing')) return 'Adapting tone and reading level for your audience...';
        if (curr.includes('Adapting')) return 'Composing the transformed output...';
        if (curr.includes('Composing')) return 'Running fact-check against original source...';
        return 'Polishing response...';
      });
    }, 2400);

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const error = data?.error || 'Transformation failed on the server.';
        const details = data?.details;
        throw new Error(details && details !== error ? `${error} (${details})` : error);
      }

      setResult(data.result);
      lastTransformation.current = { key: requestKey, result: data.result };
      setTimeout(() => {
        window.scrollTo({ top: 480, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Transformation error:', err);
      setTransformError(err.message || 'An error occurred during document transformation.');
    } finally {
      clearInterval(stepInterval);
      setIsTransforming(false);
      transformationInProgress.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-slate-900">
      {/* Top Header Navigation */}
      <Navbar
        onOpenMethodology={() => setShowMethodology(true)}
        onOpenDeployment={() => setShowDeployment(true)}
        onReset={handleReset}
        hasDocument={!!sourceText}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Welcome Section */}
        <section className="text-center max-w-2xl mx-auto space-y-3 pt-2 pb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
            Make every document work for every audience.
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
            Upload your document, choose your audience and tone, and transform its content into any format while preserving every essential fact.
          </p>
        </section>

        {/* WORKFLOW STEP 1: INGESTION */}
        {!sourceText ? (
          <UploadSection
            onDocumentExtracted={handleDocumentExtracted}
            isExtracting={isExtracting}
            setIsExtracting={setIsExtracting}
          />
        ) : (
          <div className="space-y-6">
            {/* Source Document Display with metadata stats */}
            {sourceMetadata && (
              <SourceViewer
                sourceText={sourceText}
                metadata={sourceMetadata}
                onClear={handleReset}
              />
            )}

            {/* WORKFLOW STEP 2: ADAPTATION CONTROLS */}
            <AdaptationControls
              options={options}
              setOptions={setOptions}
              onTransform={handleExecuteTransformation}
              isTransforming={isTransforming}
              disabled={!sourceText}
            />

            {/* Loading / Transformation Progress Card */}
            {isTransforming && (
              <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 shadow-sm text-center space-y-4">
                <div className="inline-flex p-3.5 rounded-2xl bg-stone-100 text-slate-800">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-semibold text-slate-900 text-lg">
                    Transforming your document
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium">
                    {transformStepMessage}
                  </p>
                  <p className="text-xs text-stone-400 mt-2 max-w-md mx-auto">
                    Grounding every paragraph in your source text so essential facts and conclusions stay true.
                  </p>
                </div>
              </div>
            )}

            {/* Error Notification */}
            {transformError && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-6 text-xs text-amber-900 flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">Something went wrong</h4>
                    <p className="mt-1 text-stone-700 leading-relaxed">{transformError}</p>
                    <p className="text-stone-500 mt-2">
                      Please check that your server has a valid API key configured and that the source document is accessible.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleExecuteTransformation}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-stone-100 font-medium shrink-0 cursor-pointer transition-colors text-xs"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* WORKFLOW STEP 3: RESULTS WORKSPACE */}
            {result && sourceMetadata && (
              <TransformationWorkspace
                result={result}
                sourceText={sourceText}
                sourceMetadata={sourceMetadata}
                onRetry={handleExecuteTransformation}
                isTransforming={isTransforming}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-200/80 bg-[#FAF9F5] py-8 text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-800">Content Transformer</span>
            <span>•</span>
            <span>Fact-preserving writing assistant</span>
          </div>

          <div className="flex items-center gap-4 text-stone-600">
            <button
              onClick={() => setShowMethodology(true)}
              className="hover:text-slate-900 cursor-pointer"
            >
              How It Works
            </button>
            <span>•</span>
            <button
              onClick={() => setShowDeployment(true)}
              className="hover:text-slate-900 cursor-pointer"
            >
              Export & Deployment
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MethodologyModal
        isOpen={showMethodology}
        onClose={() => setShowMethodology(false)}
      />

      <DeploymentGuideModal
        isOpen={showDeployment}
        onClose={() => setShowDeployment(false)}
      />
    </div>
  );
}
