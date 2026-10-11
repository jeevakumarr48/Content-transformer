import React from 'react';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split by double newlines into blocks
  const blocks = content.split(/\n\s*\n/);

  const renderInline = (text: string) => {
    const parts: React.ReactNode[] = [];
    let key = 0;

    // Pattern for **bold**, *italic*, `code`
    const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      if (match[1]) {
        // **bold**
        parts.push(
          <strong key={key++} className="font-semibold text-slate-900">
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        // *italic*
        parts.push(
          <em key={key++} className="italic text-slate-800">
            {match[4]}
          </em>
        );
      } else if (match[5]) {
        // `code`
        parts.push(
          <code
            key={key++}
            className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-800 text-xs font-mono border border-stone-200"
          >
            {match[6]}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`space-y-4 text-slate-800 leading-relaxed font-sans ${className}`}>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 1
        if (trimmed.startsWith('# ')) {
          return (
            <h1
              key={i}
              className="text-2xl font-serif font-bold text-slate-900 border-b border-stone-200 pb-2 mt-6 first:mt-0 tracking-tight"
            >
              {renderInline(trimmed.replace(/^#\s+/, ''))}
            </h1>
          );
        }

        // Heading 2
        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={i}
              className="text-lg font-serif font-bold text-slate-900 border-b border-stone-100 pb-1.5 mt-5 tracking-tight flex items-center gap-2"
            >
              <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full inline-block"></span>
              {renderInline(trimmed.replace(/^##\s+/, ''))}
            </h2>
          );
        }

        // Heading 3
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={i} className="text-base font-serif font-semibold text-slate-900 mt-4 tracking-tight">
              {renderInline(trimmed.replace(/^###\s+/, ''))}
            </h3>
          );
        }

        // Blockquote
        if (trimmed.startsWith('>')) {
          const quoteLines = trimmed
            .split('\n')
            .map((l) => l.replace(/^>\s*/, ''))
            .join(' ');
          return (
            <blockquote
              key={i}
              className="border-l-3 border-stone-300 bg-stone-50/70 pl-4 py-2 text-stone-700 italic rounded-r-xl my-3"
            >
              {renderInline(quoteLines)}
            </blockquote>
          );
        }

        // Bullet list
        if (trimmed.split('\n').every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
          const items = trimmed.split('\n').filter((l) => l.trim().length > 0);
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5 my-2 marker:text-stone-400">
              {items.map((item, j) => (
                <li key={j} className="text-slate-700">
                  {renderInline(item.trim().replace(/^[-*]\s+/, ''))}
                </li>
              ))}
            </ul>
          );
        }

        // Numbered list
        if (trimmed.split('\n').every((line) => /^\d+\.\s/.test(line.trim()))) {
          const items = trimmed.split('\n').filter((l) => l.trim().length > 0);
          return (
            <ol key={i} className="list-decimal pl-5 space-y-1.5 my-2 marker:font-medium marker:text-stone-500">
              {items.map((item, j) => (
                <li key={j} className="text-slate-700">
                  {renderInline(item.trim().replace(/^\d+\.\s+/, ''))}
                </li>
              ))}
            </ol>
          );
        }

        // Table
        if (trimmed.includes('|') && trimmed.includes('\n')) {
          const lines = trimmed.split('\n').filter((l) => l.trim().length > 0);
          if (lines.length >= 2 && lines[0].includes('|')) {
            const headerCells = lines[0]
              .split('|')
              .map((c) => c.trim())
              .filter((c, idx, arr) => (idx > 0 && idx < arr.length - 1) || c.length > 0);
            const rowLines = lines.slice(lines[1].includes('---') ? 2 : 1);

            return (
              <div key={i} className="overflow-x-auto my-4 border border-stone-200 rounded-2xl shadow-2xs">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-stone-50 text-slate-900 border-b border-stone-200 font-semibold">
                    <tr>
                      {headerCells.map((th, hIdx) => (
                        <th key={hIdx} className="px-4 py-2.5">
                          {renderInline(th)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {rowLines.map((r, rIdx) => {
                      const cells = r
                        .split('|')
                        .map((c) => c.trim())
                        .filter((c, idx, arr) => (idx > 0 && idx < arr.length - 1) || c.length > 0);
                      return (
                        <tr key={rIdx} className="hover:bg-stone-50/60 transition-colors">
                          {cells.map((td, cIdx) => (
                            <td key={cIdx} className="px-4 py-2.5">
                              {renderInline(td)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // Standard paragraph
        return (
          <p key={i} className="text-slate-800 leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
