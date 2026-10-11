import React, { useState } from 'react';
import { X, GitBranch, Check, Copy, ShieldCheck } from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitCode = `# 1. Initialize local git repository
git init
git add .
git commit -m "feat: Content Transformer initial release"

# 2. Link your remote GitHub repository
git branch -M main
git remote add origin https://github.com/<your-username>/content-transformer.git
git push -u origin main`;

  const deployCode = `# Option A: Deploy to Google Cloud Run
gcloud run deploy content-transformer \\
  --source . \\
  --region asia-southeast1 \\
  --set-env-vars GEMINI_API_KEY="your_api_key_here" \\
  --allow-unauthenticated

# Option B: Run locally or on any Node.js host
npm install
npm run build
npm start`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 text-slate-800 flex items-center justify-center shadow-2xs">
              <GitBranch className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-semibold text-slate-900 tracking-tight">
                Export to GitHub & Deployment
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Steps to clone, export, and host Content Transformer
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

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-stone-600 max-h-[70vh] overflow-y-auto leading-relaxed">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-semibold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center">
                  1
                </span>
                Pushing Source to GitHub
              </h3>
              <button
                onClick={() => copyToClipboard(gitCode, 1)}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 1 ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-stone-500 pl-7">
              Initialize Git in the project root and push to your GitHub account:
            </p>
            <div className="pl-7">
              <pre className="bg-slate-900 text-stone-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
                {gitCode}
              </pre>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <h3 className="font-serif font-semibold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center">
                2
              </span>
              API Keys & Cost Transparency
            </h3>
            <div className="pl-7 space-y-2 text-xs text-stone-600">
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200 space-y-1">
                <div className="font-medium text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Free-Tier Compatible
                </div>
                <p className="text-stone-500">
                  Runs on <strong>Gemini 3.8 Flash</strong> (<code className="font-mono bg-stone-100 px-1 py-0.5 rounded text-stone-800">gemini-3.8-flash</code>). No paid model tier is required. Requires only a single secret: <code className="font-mono bg-stone-100 px-1 py-0.5 rounded text-stone-800">GEMINI_API_KEY</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-semibold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center">
                  3
                </span>
                Deploying to Cloud Run or Node.js Host
              </h3>
              <button
                onClick={() => copyToClipboard(deployCode, 3)}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer"
              >
                {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 3 ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="pl-7">
              <pre className="bg-slate-900 text-stone-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
                {deployCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-stone-100 font-medium hover:bg-slate-800 transition-colors cursor-pointer text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
