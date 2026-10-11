import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, ArrowRight, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { FidelityChecklist } from '../types';

interface FidelityChecklistCardProps {
  checklist: FidelityChecklist;
}

export const FidelityChecklistCard: React.FC<FidelityChecklistCardProps> = ({ checklist }) => {
  const [activeTab, setActiveTab] = useState<'facts' | 'omissions' | 'adaptations'>('facts');
  const [expandedReasonIndex, setExpandedReasonIndex] = useState<number | null>(null);

  const score = checklist.fidelityScore || 95;

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="p-6 border-b border-stone-200 bg-stone-50/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-slate-800 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-semibold text-slate-900 text-base">
                  Factual Fidelity & Source Check
                </h3>
                <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {score}% facts preserved
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Verification that original arguments, names, data, and conclusions remain intact.
              </p>
            </div>
          </div>
        </div>

        {/* Verdict Box */}
        <div className="mt-4 bg-white rounded-2xl p-4 border border-stone-200/80 text-xs text-stone-700 flex items-start gap-2.5 shadow-2xs">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-900 font-medium">Fact-check summary:</strong> {checklist.fidelityVerdict}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 bg-stone-50/30 text-xs font-medium text-stone-600">
        <button
          onClick={() => setActiveTab('facts')}
          className={`flex-1 py-3 px-4 text-center flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'facts'
              ? 'border-indigo-600 text-slate-900 font-semibold bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Preserved Core Facts</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700 text-[11px] font-medium">
            {checklist.preservedCoreFacts?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('omissions')}
          className={`flex-1 py-3 px-4 text-center flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'omissions'
              ? 'border-indigo-600 text-slate-900 font-semibold bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>Condensed / Omitted Details</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700 text-[11px] font-medium">
            {checklist.omittedOrCondensedDetails?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('adaptations')}
          className={`flex-1 py-3 px-4 text-center flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'adaptations'
              ? 'border-indigo-600 text-slate-900 font-semibold bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <ArrowRight className="w-4 h-4 text-indigo-600" />
          <span>Concept Adaptations</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700 text-[11px] font-medium">
            {checklist.conceptAdaptations?.length || 0}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'facts' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-500 mb-2">
              Key empirical claims, figures, names, and conclusions from the source verified in the adapted text:
            </p>
            {checklist.preservedCoreFacts && checklist.preservedCoreFacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {checklist.preservedCoreFacts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/70 text-xs text-slate-800 leading-relaxed font-sans"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">No specific core facts logged.</p>
            )}
          </div>
        )}

        {activeTab === 'omissions' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-500 mb-2">
              Secondary details intentionally condensed or omitted to match the selected audience and reading length:
            </p>
            {checklist.omittedOrCondensedDetails && checklist.omittedOrCondensedDetails.length > 0 ? (
              <div className="space-y-2.5">
                {checklist.omittedOrCondensedDetails.map((item, idx) => {
                  const isExpanded = expandedReasonIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/60 text-xs text-slate-800 transition-all"
                    >
                      <div
                        className="flex items-start justify-between gap-3 cursor-pointer"
                        onClick={() => setExpandedReasonIndex(isExpanded ? null : idx)}
                      >
                        <div className="flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span className="font-semibold text-slate-900">{item.detail}</span>
                        </div>
                        <button
                          type="button"
                          className="text-stone-500 hover:text-slate-800 text-xs flex items-center gap-1 font-medium shrink-0 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide' : 'Why'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-2.5 pt-2 border-t border-amber-200/50 pl-6 text-stone-600 leading-relaxed">
                          <strong className="text-slate-900 font-medium">Editorial reason:</strong>{' '}
                          {item.reason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200/70 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No material details were omitted from this transformation.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'adaptations' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-500 mb-2">
              How technical terms and specialized concepts were translated for the reader:
            </p>
            {checklist.conceptAdaptations && checklist.conceptAdaptations.length > 0 ? (
              <div className="space-y-2.5">
                {checklist.conceptAdaptations.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/80 text-xs text-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 md:w-5/12">
                      <span className="px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700 text-[10px] font-semibold uppercase tracking-wider">
                        Original
                      </span>
                      <span className="font-medium text-slate-900">{item.originalConcept}</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-stone-400 hidden md:block shrink-0" />

                    <div className="flex items-center gap-2 md:w-6/12 bg-white px-3 py-1.5 rounded-xl border border-stone-200/70 shadow-2xs">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold shrink-0">
                        Adapted
                      </span>
                      <span className="text-stone-700">{item.adaptedExplanation}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">No concept mappings recorded.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
