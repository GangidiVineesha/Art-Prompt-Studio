import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Download, SplitSquareVertical } from 'lucide-react';
import { ExperimentVariant } from '../types';

interface ImageDetailModalProps {
  variant: ExperimentVariant | null;
  onClose: () => void;
  onCompareWithOther?: (variant: ExperimentVariant) => void;
}

export const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
  variant,
  onClose,
  onCompareWithOther,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!variant) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(variant.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = variant.imageSrc;
    link.download = `${variant.styleId}-style-experiment.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#121520] border border-[#1f2638] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative my-auto"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2638] bg-[#0c0e16]/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
              <span>{variant.styleCategory}</span>
              <span aria-hidden="true">·</span>
              <span>{variant.medium}</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">
              {variant.styleName}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              title="Download image"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a1f30] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close (Esc)"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a1f30] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split Image & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left: Image Container */}
          <div className="md:col-span-7 bg-[#08090e] p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#1f2638]">
            <div className="relative aspect-square w-full max-w-md rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <img
                src={variant.imageSrc}
                alt={variant.styleName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Technical Inspector Pane */}
          <div className="md:col-span-5 p-6 space-y-5 bg-[#121520] flex flex-col justify-between">
            <div className="space-y-4">
              {/* Generation Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-slate-300">
                    Full Prompt
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1 font-medium"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-[#0c0e16] p-3 rounded-lg border border-[#1b2132] font-mono text-xs text-slate-200 leading-relaxed max-h-36 overflow-y-auto">
                  {variant.prompt}
                </div>
              </div>

              {/* Negative Prompt */}
              {variant.negativePrompt && (
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Negative Conditioning Constraints
                  </div>
                  <div className="bg-[#0c0e16] p-2.5 rounded-lg border border-[#1b2132] font-mono text-[11px] text-red-300/80 leading-relaxed">
                    {variant.negativePrompt}
                  </div>
                </div>
              )}

              {/* Diffusion Hyperparameters */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Diffusion Invariants & Seed
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0c0e16] p-2.5 rounded-lg border border-[#1b2132]">
                    <span className="text-slate-400 block text-[10px]">Guidance Scale (CFG)</span>
                    <span className="font-mono text-white font-semibold tabular-nums">
                      {variant.diffusionParameters.guidanceScale}
                    </span>
                  </div>

                  <div className="bg-[#0c0e16] p-2.5 rounded-lg border border-[#1b2132]">
                    <span className="text-slate-400 block text-[10px]">Sampling Steps</span>
                    <span className="font-mono text-white font-semibold tabular-nums">
                      {variant.diffusionParameters.steps} ({variant.diffusionParameters.sampler})
                    </span>
                  </div>

                  <div className="bg-[#0c0e16] p-2.5 rounded-lg border border-[#1b2132]">
                    <span className="text-slate-400 block text-[10px]">Seed Archetype</span>
                    <span className="font-mono text-white font-semibold tabular-nums">
                      {variant.diffusionParameters.seed}
                    </span>
                  </div>

                  <div className="bg-[#0c0e16] p-2.5 rounded-lg border border-[#1b2132]">
                    <span className="text-slate-400 block text-[10px]">Aspect Ratio</span>
                    <span className="font-mono text-white font-semibold">
                      {variant.diffusionParameters.aspectRatio}
                    </span>
                  </div>
                </div>
              </div>

              {/* Color Palette */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Dominant Color Palette
                </div>
                <div className="flex items-center gap-2">
                  {variant.colorPalette.map((col, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-[#0c0e16] px-2 py-1 rounded border border-[#1b2132]">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: col }} />
                      <span className="font-mono text-[10px] text-slate-300">{col}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Notes */}
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Observer Experiment Notes
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#0c0e16] p-3 rounded-lg border border-[#1b2132]">
                  {variant.notes}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            {onCompareWithOther && (
              <div className="pt-4 border-t border-[#1f2638]">
                <button
                  onClick={() => {
                    onClose();
                    onCompareWithOther(variant);
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <SplitSquareVertical className="w-4 h-4" />
                  <span>Compare with Another Style in Split View</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
