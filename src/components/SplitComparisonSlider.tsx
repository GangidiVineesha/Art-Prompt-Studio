import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeftRight, Copy, Check, Info } from 'lucide-react';
import { ExperimentVariant } from '../types';

interface SplitComparisonSliderProps {
  variants: ExperimentVariant[];
  initialVariantA?: ExperimentVariant;
  initialVariantB?: ExperimentVariant;
  onOpenDiff?: (a: ExperimentVariant, b: ExperimentVariant) => void;
}

export const SplitComparisonSlider: React.FC<SplitComparisonSliderProps> = ({
  variants,
  initialVariantA,
  initialVariantB,
  onOpenDiff,
}) => {
  const [variantAId, setVariantAId] = useState<string>(
    initialVariantA?.id || variants[0]?.id || ''
  );
  const [variantBId, setVariantBId] = useState<string>(
    initialVariantB?.id || variants[1]?.id || ''
  );
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copiedSide, setCopiedSide] = useState<'A' | 'B' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const variantA = variants.find((v) => v.id === variantAId) || variants[0];
  const variantB = variants.find((v) => v.id === variantBId) || variants[1];

  // Dragging logic
  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = clientX - rect.left;
      const percent = Math.min(Math.max((rawX / rect.width) * 100, 2), 98);
      setSliderPos(percent);
    },
    []
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX);
    };
    const onMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging, handleMove]);

  const handleSwap = () => {
    const temp = variantAId;
    setVariantAId(variantBId);
    setVariantBId(temp);
  };

  const handleCopy = (side: 'A' | 'B', text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSide(side);
    setTimeout(() => setCopiedSide(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title & Setup Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f2638]">
        <div>
          <div className="text-xs text-blue-400 font-medium">Interactive Comparison Tool</div>
          <h2 className="text-2xl font-bold text-white font-display">A/B Split-Slider Inspection</h2>
          <p className="text-sm text-slate-400">
            Drag the central divider to inspect cross-style boundary transformations and micro-textures.
          </p>
        </div>

        {/* Swap button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSwap}
            className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#121520] hover:bg-[#1a1f30] border border-[#1f2638] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap A / B</span>
          </button>

          {onOpenDiff && (
            <button
              onClick={() => onOpenDiff(variantA, variantB)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
            >
              Analyze Prompt Diff
            </button>
          )}
        </div>
      </div>

      {/* Style Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Style A Selector */}
        <div className="p-4 bg-[#121520] border border-[#1f2638] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-sky-400 uppercase tracking-wider">Style A (Left)</span>
            <span>{variantA.styleCategory}</span>
          </div>
          <select
            value={variantAId}
            onChange={(e) => setVariantAId(e.target.value)}
            className="w-full bg-[#0c0e16] border border-[#1f2638] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.styleName} ({v.medium})
              </option>
            ))}
          </select>
        </div>

        {/* Style B Selector */}
        <div className="p-4 bg-[#121520] border border-[#1f2638] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-purple-400 uppercase tracking-wider">Style B (Right)</span>
            <span>{variantB.styleCategory}</span>
          </div>
          <select
            value={variantBId}
            onChange={(e) => setVariantBId(e.target.value)}
            className="w-full bg-[#0c0e16] border border-[#1f2638] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.styleName} ({v.medium})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* The Split Slider Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative aspect-square max-h-[640px] w-full mx-auto bg-[#090b10] rounded-2xl overflow-hidden border border-[#1f2638] shadow-2xl select-none cursor-ew-resize group"
      >
        {/* Image B (Base layer: Right side) */}
        <img
          src={variantB.imageSrc}
          alt={variantB.styleName}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Image A (Clipped layer: Left side) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={variantA.imageSrc}
            alt={variantA.styleName}
            referrerPolicy="no-referrer"
            className="absolute top-0 left-0 w-full h-full object-cover max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              height: containerRef.current ? `${containerRef.current.clientHeight}px` : '100%',
            }}
          />
        </div>

        {/* Vertical Divider Line & Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Centered Knob */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs">
            <ArrowLeftRight className="w-4 h-4 text-slate-800" />
          </div>
        </div>

        {/* Top Floating Badges */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="bg-[#0b0e17]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-sky-300">
            {variantA.styleName}
          </div>
        </div>

        <div className="absolute top-4 right-4 pointer-events-none">
          <div className="bg-[#0b0e17]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-purple-300">
            {variantB.styleName}
          </div>
        </div>

        {/* Percentage Tracker */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-[#0b0e17]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono text-slate-300 tabular-nums">
            {Math.round(sliderPos)}% / {100 - Math.round(sliderPos)}%
          </div>
        </div>
      </div>

      {/* Side-by-Side Prompt Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Style A Prompt Card */}
        <div className="bg-[#121520] border border-[#1f2638] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1f2638]">
            <span className="font-semibold text-sky-400">{variantA.styleName} Prompt</span>
            <button
              onClick={() => handleCopy('A', variantA.prompt)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              {copiedSide === 'A' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSide === 'A' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="font-mono text-xs leading-relaxed text-slate-300 bg-[#0c0e16] p-3 rounded-lg border border-[#1b2132]">
            {variantA.prompt}
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Medium:</span>
              <span>{variantA.medium}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Lighting:</span>
              <span>{variantA.lighting}</span>
            </div>
          </div>
        </div>

        {/* Style B Prompt Card */}
        <div className="bg-[#121520] border border-[#1f2638] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1f2638]">
            <span className="font-semibold text-purple-400">{variantB.styleName} Prompt</span>
            <button
              onClick={() => handleCopy('B', variantB.prompt)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              {copiedSide === 'B' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSide === 'B' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="font-mono text-xs leading-relaxed text-slate-300 bg-[#0c0e16] p-3 rounded-lg border border-[#1b2132]">
            {variantB.prompt}
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Medium:</span>
              <span>{variantB.medium}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Lighting:</span>
              <span>{variantB.lighting}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latent Transformation Analysis */}
      <div className="bg-[#121520] border border-[#1f2638] rounded-xl p-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
          <div className="font-semibold text-white">Observer Note: Latent Boundary Transformation</div>
          <p>
            Observe how the tree branch and the owl&apos;s claws remain at identical spatial coordinate anchors across both models, but the surface normal computation in the cross-attention layers resolves into distinct material shaders—for example, woodblock fibrous paper grain versus glossy neon rain specularities.
          </p>
        </div>
      </div>
    </div>
  );
};
