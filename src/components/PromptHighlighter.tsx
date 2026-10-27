import React from 'react';

interface PromptHighlighterProps {
  prompt: string;
  tokens?: {
    token: string;
    category: 'subject' | 'style' | 'medium' | 'lighting' | 'composition' | 'quality';
    weight?: number;
  }[];
  highlightActive?: boolean;
}

export const PromptHighlighter: React.FC<PromptHighlighterProps> = ({
  prompt,
  tokens,
  highlightActive = true,
}) => {
  if (!highlightActive || !tokens || tokens.length === 0) {
    return <span className="text-slate-300 font-mono text-xs leading-relaxed">{prompt}</span>;
  }

  // Map categories to calm, accessible text tints (no garish pills)
  const getCategoryClasses = (cat: string) => {
    switch (cat) {
      case 'subject':
        return 'text-sky-300 underline decoration-sky-500/40 decoration-1 underline-offset-2';
      case 'style':
        return 'text-purple-300 underline decoration-purple-500/40 decoration-1 underline-offset-2';
      case 'medium':
        return 'text-emerald-300 underline decoration-emerald-500/40 decoration-1 underline-offset-2';
      case 'lighting':
        return 'text-amber-300 underline decoration-amber-500/40 decoration-1 underline-offset-2';
      case 'composition':
        return 'text-indigo-300 underline decoration-indigo-500/40 decoration-1 underline-offset-2';
      case 'quality':
        return 'text-slate-400';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="font-mono text-xs leading-relaxed text-slate-300">
      {tokens.map((t, idx) => (
        <span key={idx} className="inline mr-1.5">
          <span className={getCategoryClasses(t.category)} title={`${t.category} token`}>
            {t.token}
          </span>
          {idx < tokens.length - 1 && <span className="text-slate-600">,</span>}
        </span>
      ))}
    </div>
  );
};
