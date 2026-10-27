import React, { useState } from 'react';
import {
  Grid,
  Columns,
  Maximize2,
  Copy,
  Check,
  SplitSquareVertical,
  SlidersHorizontal,
  Info,
  Sparkles,
  Image as ImageIcon,
  Eye,
  Layers,
} from 'lucide-react';
import { ExperimentSet, ExperimentVariant } from '../types';
import { PromptHighlighter } from './PromptHighlighter';

interface GalleryMatrixProps {
  experiment: ExperimentSet;
  availableExperiments: ExperimentSet[];
  onSelectExperiment: (exp: ExperimentSet) => void;
  onOpenDetail: (variant: ExperimentVariant) => void;
  onComparePair: (variantA: ExperimentVariant, variantB: ExperimentVariant, mode: 'split' | 'diff') => void;
}

export const GalleryMatrix: React.FC<GalleryMatrixProps> = ({
  experiment,
  availableExperiments,
  onSelectExperiment,
  onOpenDetail,
  onComparePair,
}) => {
  const [layout, setLayout] = useState<'grid' | 'strip'>('grid');
  const [highlightTokens, setHighlightTokens] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [showReferenceSheet, setShowReferenceSheet] = useState<boolean>(false);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([
    experiment.variants[0]?.id || '',
    experiment.variants[1]?.id || '',
  ]);

  const handleCopyPrompt = (variant: ExperimentVariant, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(variant.prompt);
    setCopiedId(variant.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllPrompts = () => {
    const formatted = experiment.variants
      .map(
        (v) =>
          `### ${v.styleName} (${v.styleCategory})\nPrompt: "${v.prompt}"\n`
      )
      .join('\n');
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedVariants.includes(id)) {
      if (selectedVariants.length > 1) {
        setSelectedVariants(selectedVariants.filter((v) => v !== id));
      }
    } else {
      if (selectedVariants.length >= 2) {
        setSelectedVariants([selectedVariants[1], id]);
      } else {
        setSelectedVariants([...selectedVariants, id]);
      }
    }
  };

  const selectedVariantObjects = experiment.variants.filter((v) =>
    selectedVariants.includes(v.id)
  );

  return (
    <div className="space-y-8">
      {/* Syllabus Equation Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">
              Core Syllabus Concept · Latent Conditioning
            </div>
            <div className="text-base sm:text-lg font-bold text-white font-display flex flex-wrap items-center gap-2">
              <span className="text-sky-300">Same subject</span>
              <span className="text-slate-400">+</span>
              <span className="text-purple-300">Different style prompts</span>
              <span className="text-slate-400">=</span>
              <span className="text-emerald-300">Different results</span>
            </div>
          </div>
        </div>

        {experiment.referenceImage && (
          <button
            onClick={() => setShowReferenceSheet(!showReferenceSheet)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-[#161a29] hover:bg-[#20273d] border border-blue-400/30 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Eye className="w-4 h-4 text-blue-400" />
            <span>{showReferenceSheet ? 'Hide Syllabus Sheet' : 'View Syllabus Infographic'}</span>
          </button>
        )}
      </div>

      {/* Optional Syllabus Reference Sheet Viewer */}
      {showReferenceSheet && experiment.referenceImage && (
        <div className="bg-[#121520] border border-blue-500/40 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span>Syllabus Reference Specification Sheet</span>
            </span>
            <button
              onClick={() => setShowReferenceSheet(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="rounded-xl overflow-hidden border border-[#232a3e] max-h-[500px] flex items-center justify-center bg-black/40">
            <img
              src={experiment.referenceImage}
              alt="Prompt vs Image Comparison Gallery reference sheet"
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[500px] object-contain"
            />
          </div>
        </div>
      )}

      {/* Hero Header & Experiment Switcher */}
      <section className="bg-[#121520] border border-[#1f2638] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1f2638]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-blue-400 font-medium">
              <span>Syllabus Experiment</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300 font-semibold">{experiment.variants.length} Style Variations</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">{experiment.syllabusTopic}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              {experiment.title}
            </h1>

            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              {experiment.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Experiment Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-[#0c0e16] rounded-lg border border-[#1f2638]">
              {availableExperiments.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => onSelectExperiment(exp)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    experiment.id === exp.id
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {exp.id === 'exp-girl-laptop' ? 'Girl with Laptop (6 Styles)' : 'Mechanical Owl (4 Styles)'}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyAllPrompts}
              className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#1a1f30] hover:bg-[#232a42] border border-[#2b344e] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied All Prompts' : `Copy All ${experiment.variants.length} Prompts`}</span>
            </button>

            {selectedVariantObjects.length === 2 && (
              <button
                onClick={() =>
                  onComparePair(selectedVariantObjects[0], selectedVariantObjects[1], 'split')
                }
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <SplitSquareVertical className="w-3.5 h-3.5" />
                <span>Compare Selected (2)</span>
              </button>
            )}
          </div>
        </div>

        {/* Experiment Constant: The Shared Subject (Control Variable) */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-1">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Control Subject Variable (Invariant Baseline)
            </div>
            <div className="text-sm sm:text-base font-medium text-white font-mono bg-[#0c0e16] px-4 py-3 rounded-lg border border-[#1b2132]">
              &quot;{experiment.subject}&quot;
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col justify-start md:justify-end gap-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span className="font-semibold">Invariant Features:</span>
              <span>Subject, Laptop, Desk, Window</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Only the style prefix and surface descriptors vary across the series.
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Controls & Legend Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1">
        <div className="flex items-center gap-3">
          {/* Layout buttons */}
          <div className="flex items-center p-1 bg-[#121520] border border-[#1f2638] rounded-lg">
            <button
              onClick={() => setLayout('grid')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                layout === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>3x2 Grid</span>
            </button>
            <button
              onClick={() => setLayout('strip')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                layout === 'strip'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Strip View</span>
            </button>
          </div>

          <button
            onClick={() => setHighlightTokens(!highlightTokens)}
            className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              highlightTokens
                ? 'bg-[#1a2238] border-blue-500/50 text-blue-300'
                : 'bg-[#121520] border-[#1f2638] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Syntax Highlighting: {highlightTokens ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Token Syntax Legend */}
        {highlightTokens && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="text-slate-500 font-medium">Prompt Syntax:</span>
            <span className="text-sky-300 underline decoration-sky-500/40">Subject</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-purple-300 underline decoration-purple-500/40">Style</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-300 underline decoration-emerald-500/40">Medium</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-300 underline decoration-amber-500/40">Lighting</span>
          </div>
        )}
      </div>

      {/* Comparison Gallery Grid */}
      <div
        className={`grid gap-6 ${
          layout === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
        }`}
      >
        {experiment.variants.map((variant) => {
          const isSelected = selectedVariants.includes(variant.id);
          return (
            <article
              key={variant.id}
              onClick={() => onOpenDetail(variant)}
              className={`group bg-[#121520] rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col ${
                isSelected
                  ? 'border-blue-500/70 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                  : 'border-[#1f2638] hover:border-[#2d3752]'
              }`}
            >
              {/* Visual Container */}
              <div className="relative aspect-square w-full bg-[#090b10] overflow-hidden">
                <img
                  src={variant.imageSrc}
                  alt={`${variant.styleName} rendering of ${experiment.coreSubjectToken}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {/* Top overlay controls */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                  {/* Select toggle button */}
                  <button
                    onClick={(e) => handleToggleSelect(variant.id, e)}
                    className={`pointer-events-auto px-2.5 py-1 text-xs font-semibold rounded-md backdrop-blur-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-[#0b0e17]/80 text-slate-300 hover:bg-[#161c2e] border border-white/10'
                    }`}
                  >
                    <span>{isSelected ? '✓ Selected' : 'Select'}</span>
                  </button>

                  {/* Zoom button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetail(variant);
                    }}
                    title="Inspect details and diffusion metrics"
                    className="pointer-events-auto p-1.5 rounded-md bg-[#0b0e17]/80 hover:bg-[#161c2e] text-slate-300 border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom Color Palette Swatches */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#0b0e17]/80 p-1 rounded backdrop-blur-md border border-white/10">
                  {variant.colorPalette.map((color, cIdx) => (
                    <span
                      key={cIdx}
                      className="w-2.5 h-2.5 rounded-sm shadow-xs"
                      style={{ backgroundColor: color }}
                      title={`Palette color: ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-blue-400 font-medium">{variant.styleCategory}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{variant.medium}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors font-display">
                    {variant.styleName}
                  </h3>

                  {/* Generation Prompt */}
                  <div className="bg-[#0c0e16] p-3 rounded-lg border border-[#1b2132] max-h-32 overflow-y-auto">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 mb-1 border-b border-[#1b2132]">
                      <span className="font-semibold uppercase tracking-wider text-slate-500">
                        Exact Prompt
                      </span>
                      <button
                        onClick={(e) => handleCopyPrompt(variant, e)}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedId === variant.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <PromptHighlighter
                      prompt={variant.prompt}
                      tokens={variant.promptTokens}
                      highlightActive={highlightTokens}
                    />
                  </div>

                  {/* Key Modifiers */}
                  <div className="text-xs text-slate-400 flex flex-wrap gap-x-2 gap-y-1 items-center">
                    <span className="text-slate-500">Key tokens:</span>
                    {variant.keyModifiers.map((mod, mIdx) => (
                      <span key={mIdx} className="text-slate-300">
                        {mod}
                        {mIdx < variant.keyModifiers.length - 1 && (
                          <span className="text-slate-600 ml-2" aria-hidden="true">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-[#1b2132] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2 tabular-nums">
                    <span>CFG: {variant.diffusionParameters.guidanceScale}</span>
                    <span aria-hidden="true">·</span>
                    <span>Steps: {variant.diffusionParameters.steps}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const other =
                          experiment.variants.find((v) => v.id !== variant.id) ||
                          experiment.variants[0];
                        onComparePair(variant, other, 'split');
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <SplitSquareVertical className="w-3.5 h-3.5" />
                      <span>Split A/B</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Educational Analysis Callout */}
      <section className="bg-[#121520] border border-[#1f2638] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-base font-semibold text-white">
              Syllabus Experiment Findings: Latent Style Vector Orthogonality
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {experiment.educationalInsight}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Preserved Invariants:</span>
              <span>Girl at desk posture</span>
              <span aria-hidden="true">·</span>
              <span>Laptop screen orientation</span>
              <span aria-hidden="true">·</span>
              <span>Left-to-right window light path</span>
              <span aria-hidden="true">·</span>
              <span>Open notebook and coffee mug foreground anchors</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
