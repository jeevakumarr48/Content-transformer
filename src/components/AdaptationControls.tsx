import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  FileText,
  Clock,
  Globe,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { TransformationOptions } from '../types';

interface AdaptationControlsProps {
  options: TransformationOptions;
  setOptions: React.Dispatch<React.SetStateAction<TransformationOptions>>;
  onTransform: () => void;
  isTransforming: boolean;
  disabled: boolean;
}

export const AdaptationControls: React.FC<AdaptationControlsProps> = ({
  options,
  setOptions,
  onTransform,
  isTransforming,
  disabled,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const audienceOptions = [
    { value: 'High School Students (Grade 9-12)', label: 'High School Students', desc: 'Clear fundamentals, relatable context, accessible language' },
    { value: 'Undergraduate / College Students', label: 'College & University Students', desc: 'Conceptual depth, domain terms, formal structure' },
    { value: 'General Public / Lay Audience', label: 'General Public & Curious Readers', desc: 'Jargon-free, engaging explanations and real-world impact' },
    { value: 'Executive Leadership & C-Suite', label: 'Executive Leadership & C-Suite', desc: 'Bottom-line first, strategic insights, high-level impact' },
    { value: 'Elementary School Students (Grade 4-6)', label: 'Young Students (Grade 4-6)', desc: 'Simple phrasing, vivid analogies, friendly tone' },
    { value: 'Postgraduates & Academic Researchers', label: 'Postgraduates & Specialists', desc: 'Methodological rigor, precise domain terminology' },
    { value: 'ESL / Non-native English Speakers', label: 'ESL / Language Learners', desc: 'Direct grammar, plain sentence structure, no idioms' },
    { value: 'Technical Domain Specialists', label: 'Technical Specialists & Engineers', desc: 'Technical specifications, architecture, and evidence' },
  ];

  const toneOptions = [
    { value: 'Engaging & Conversational', label: 'Engaging & Conversational' },
    { value: 'Objective & Academic', label: 'Clear, Objective & Informative' },
    { value: 'Crisp & Executive', label: 'Crisp, Polished & Executive' },
    { value: 'Educational & Step-by-Step', label: 'Educational & Step-by-Step' },
    { value: 'Empathetic & Supportive', label: 'Empathetic & Approachable' },
    { value: 'Journalistic & Balanced', label: 'Journalistic & Balanced' },
    { value: 'Inspiring & Story-driven', label: 'Narrative & Story-driven' },
  ];

  const outputFormats = [
    {
      id: 'Simplified Explanation',
      title: 'Simplified Explanation',
      desc: 'Demystifies complex ideas with clear sections and intuitive everyday analogies.',
    },
    {
      id: 'Executive Summary',
      title: 'Executive Summary',
      desc: 'Focuses on critical takeaways, strategic findings, and bottom-line outcomes.',
    },
    {
      id: 'Structured Study Notes',
      title: 'Structured Study Notes',
      desc: 'Organized bullet points, core definitions, and review memory anchors.',
    },
    {
      id: 'Comprehensive FAQs',
      title: 'Comprehensive FAQs',
      desc: 'Curated question-and-answer pairs answering key reader inquiries.',
    },
    {
      id: 'Interactive Q&A Quiz Format',
      title: 'Interactive Q&A Quiz',
      desc: 'Comprehension checks and practice questions with verified answer keys.',
    },
    {
      id: 'Presentation Slide Outline',
      title: 'Presentation Slide Outline',
      desc: 'Slide-by-slide structure with speaking points and bullet summaries.',
    },
    {
      id: 'Formal Academic Report',
      title: 'Formal Academic Report',
      desc: 'Structured with abstract, methodology context, discussion, and conclusions.',
    },
  ];

  const lengthOptions = [
    { value: 'Concise (~300 words)', label: 'Concise (~300 words)', desc: 'Quick overview of key points' },
    { value: 'Moderate (~700 words)', label: 'Balanced (~700 words)', desc: 'Standard thorough explanation' },
    { value: 'In-Depth (~1,200 words)', label: 'In-Depth (~1,200 words)', desc: 'Rich detail and evidence' },
    { value: 'Comprehensive (~1,800+ words)', label: 'Exhaustive (~1,800+ words)', desc: 'Complete, section-by-section coverage' },
  ];

  const readingLevels = [
    'Grade 5 (Simple & Relatable)',
    'Grade 8 (Plain Language & Accessible)',
    'Grade 10 (Standard High School)',
    'Grade 12 (Advanced High School)',
    'Undergraduate (College Standard)',
    'Postgraduate (Specialist & Formal)',
  ];

  const languages = [
    'English',
    'Spanish (Español)',
    'French (Français)',
    'German (Deutsch)',
    'Mandarin Chinese (中文)',
    'Japanese (日本語)',
    'Hindi (हिन्दी)',
    'Portuguese (Português)',
    'Arabic (العربية)',
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <h2 className="text-lg font-serif font-semibold text-slate-900 tracking-tight">
          How would you like to adapt this document?
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Choose your reader, tone, and format. Every core argument and fact from the original will be preserved.
        </p>
      </div>

      <div className="space-y-6">
        {/* Natural Language Question 1: Who is this for? & Reading Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Who is this for?</span>
            </label>
            <select
              value={options.targetAudience}
              onChange={(e) => setOptions((prev) => ({ ...prev, targetAudience: e.target.value }))}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
            >
              {audienceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-500">
              Adapts vocabulary, analogies, and pacing for this specific audience.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Reading level</span>
            </label>
            <select
              value={options.readingLevel}
              onChange={(e) => setOptions((prev) => ({ ...prev, readingLevel: e.target.value }))}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
            >
              {readingLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-500">
              Sets sentence complexity and readability targets.
            </p>
          </div>
        </div>

        {/* Natural Language Question 2: What format would you like? */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>What format would you like?</span>
            </label>
            <span className="text-[11px] text-stone-500">
              Select one format
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {outputFormats.map((fmt) => {
              const isSelected = options.outputFormat === fmt.id;
              return (
                <div
                  key={fmt.id}
                  onClick={() => setOptions((prev) => ({ ...prev, outputFormat: fmt.id }))}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 hover:bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-semibold ${
                          isSelected ? 'text-indigo-950 font-bold' : 'text-slate-800'
                        }`}
                      >
                        {fmt.title}
                      </h4>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      {fmt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Natural Language Question 3 & 4: How should it sound? and How much detail? */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>How should it sound?</span>
            </label>
            <select
              value={options.tone}
              onChange={(e) => setOptions((prev) => ({ ...prev, tone: e.target.value }))}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
            >
              {toneOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>How much detail do you need?</span>
            </label>
            <select
              value={options.desiredLength}
              onChange={(e) => setOptions((prev) => ({ ...prev, desiredLength: e.target.value }))}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
            >
              {lengthOptions.map((len) => (
                <option key={len.value} value={len.value}>
                  {len.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Language</span>
            </label>
            <select
              value={options.language}
              onChange={(e) => setOptions((prev) => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Collapsible specific notes */}
        <div className="border-t border-stone-200/80 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-medium text-stone-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Add specific focus or guidance (optional)</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-3">
              <textarea
                rows={2}
                value={options.customInstructions}
                onChange={(e) => setOptions((prev) => ({ ...prev, customInstructions: e.target.value }))}
                placeholder="e.g. Focus particularly on the financial takeaways; provide real-life analogies; emphasize next steps for teachers."
                className="w-full p-3.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>
          )}
        </div>

        {/* Primary Transformation Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onTransform}
            disabled={disabled || isTransforming}
            className={`w-full py-3.5 px-6 rounded-2xl font-medium text-sm text-stone-50 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              disabled || isTransforming
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.99]'
            }`}
          >
            {isTransforming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                <span>Adapting document for your audience...</span>
              </>
            ) : (
              <>
                <span>Transform Document</span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
