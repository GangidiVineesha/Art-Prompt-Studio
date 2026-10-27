import React, { useState } from 'react';
import { ArrowLeftRight, Sparkles, Loader2 } from 'lucide-react';
import { ExperimentVariant, PromptComparisonResponse } from '../types';

interface PromptDiffViewerProps {
  variants: ExperimentVariant[];
  initialVariantA?: ExperimentVariant;
  initialVariantB?: ExperimentVariant;
  onOpenSplit?: (a: ExperimentVariant, b: ExperimentVariant) => void;
}

export const PromptDiffViewer: React.FC<PromptDiffViewerProps> = ({
  variants,
  initialVariantA,
  initialVariantB,
  onOpenSplit,
}) => {
  const [variantAId, setVariantAId] = useState<string>(
    initialVariantA?.id || variants[0]?.id || ''
  );
  const [variantBId, setVariantBId] = useState<string>(
    initialVariantB?.id || variants[1]?.id || ''
  );

  const [aiAnalysis, setAiAnalysis] = useState<PromptComparisonResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const variantA = variants.find((v) => v.id === variantAId) || variants[0];
  const variantB = variants.find((v) => v.id === variantBId) || variants[1];

  // Tokenize by commas or spaces
  const cleanTokens = (str: string) =>
    str
      .toLowerCase()
      .replace(/[.,]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const wordsA = cleanTokens(variantA.prompt);
  const wordsB = cleanTokens(variantB.prompt);

  const setA = new Set(wordsA);
  const setB = new Set(wordsB);

  const sharedWords = wordsA.filter((w) => setB.has(w));
  const uniqueToA = wordsA.filter((w) => !setB.has(w));
  const uniqueToB = wordsB.filter((w) => !setB.has(w));

  // Jaccard similarity
  const intersectionSize = new Set(sharedWords).size;
  const unionSize = new Set([...wordsA, ...wordsB]).size;
  const jaccard = unionSize > 0 ? (intersectionSize / unionSize) * 100 : 0;

  const handleSwap = () => {
    const temp = variantAId;
    setVariantAId(variantBId);
    setVariantBId(temp);
    setAiAnalysis(null);
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/compare-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptA: variantA.prompt,
          promptB: variantB.prompt,
          styleA: variantA.styleName,
          styleB: variantB.styleName,
        }),
      });
      if (!res.ok) {
        throw new Error('API server returned error code ' + res.status);
      }
      const data: PromptComparisonResponse = await res.json();
      setAiAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to connect to prompt comparison engine');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f2638]">
        <div>
          <div className="text-xs text-blue-400 font-medium">Textual Conditioning Analysis</div>
          <h2 className="text-2xl font-bold text-white font-display">Prompt Token Diff & Distance</h2>
          <p className="text-sm text-slate-400">
            Compare word-level token substitutions to see how specific style keywords divert the diffusion UNet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSwap}
            className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#121520] hover:bg-[#1a1f30] border border-[#1f2638] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap Prompts</span>
          </button>

          {onOpenSplit && (
            <button
              onClick={() => onOpenSplit(variantA, variantB)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
            >
              Open Split Slider
            </button>
          )}
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#121520] border border-[#1f2638] rounded-xl space-y-2">
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
            Prompt A (Baseline)
          </div>
          <select
            value={variantAId}
            onChange={(e) => {
              setVariantAId(e.target.value);
              setAiAnalysis(null);
            }}
            className="w-full bg-[#0c0e16] border border-[#1f2638] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.styleName}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 bg-[#121520] border border-[#1f2638] rounded-xl space-y-2">
          <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
            Prompt B (Target)
          </div>
          <select
            value={variantBId}
            onChange={(e) => {
              setVariantBId(e.target.value);
              setAiAnalysis(null);
            }}
            className="w-full bg-[#0c0e16] border border-[#1f2638] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.styleName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Image Reference Pair */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative rounded-xl overflow-hidden aspect-video border border-[#1f2638] bg-[#090b10]">
          <img
            src={variantA.imageSrc}
            alt={variantA.styleName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-[#0b0e17]/85 text-xs text-sky-300 font-semibold backdrop-blur-md">
            {variantA.styleName}
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden aspect-video border border-[#1f2638] bg-[#090b10]">
          <img
            src={variantB.imageSrc}
            alt={variantB.styleName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-[#0b0e17]/85 text-xs text-purple-300 font-semibold backdrop-blur-md">
            {variantB.styleName}
          </div>
        </div>
      </div>

      {/* Quantitative Distance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#121520] border border-[#1f2638] p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Jaccard Token Overlap</div>
          <div className="text-xl font-bold text-white mt-1 font-mono tabular-nums">
            {jaccard.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Shared vocabulary index</div>
        </div>

        <div className="bg-[#121520] border border-[#1f2638] p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Shared Semantic Tokens</div>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono tabular-nums">
            {intersectionSize}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Preserved subject core</div>
        </div>

        <div className="bg-[#121520] border border-[#1f2638] p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">A Unique Modifiers</div>
          <div className="text-xl font-bold text-sky-400 mt-1 font-mono tabular-nums">
            {new Set(uniqueToA).size}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Style A specific tokens</div>
        </div>

        <div className="bg-[#121520] border border-[#1f2638] p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">B Unique Modifiers</div>
          <div className="text-xl font-bold text-purple-400 mt-1 font-mono tabular-nums">
            {new Set(uniqueToB).size}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Style B specific tokens</div>
        </div>
      </div>

      {/* Side-by-Side Prompt Text Diff Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prompt A */}
        <div className="bg-[#121520] border border-[#1f2638] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-[#1f2638]">
            <span className="font-semibold text-sky-400">Prompt A ({variantA.styleName})</span>
            <span className="tabular-nums">{variantA.prompt.length} chars</span>
          </div>

          <div className="font-mono text-xs leading-relaxed text-slate-300 bg-[#0c0e16] p-4 rounded-lg border border-[#1b2132]">
            {variantA.prompt.split(/(\s+|,)/).map((segment, idx) => {
              const clean = segment.toLowerCase().replace(/[.,]/g, '');
              const isUnique = clean.length > 2 && !setB.has(clean);
              return (
                <span
                  key={idx}
                  className={
                    isUnique
                      ? 'bg-sky-500/20 text-sky-200 px-1 py-0.5 rounded font-semibold'
                      : 'text-slate-400'
                  }
                >
                  {segment}
                </span>
              );
            })}
          </div>

          <div className="text-xs text-slate-400">
            <span className="text-sky-300 font-semibold">Highlighted:</span> tokens unique to Style A (woodblock/linework).
          </div>
        </div>

        {/* Prompt B */}
        <div className="bg-[#121520] border border-[#1f2638] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-[#1f2638]">
            <span className="font-semibold text-purple-400">Prompt B ({variantB.styleName})</span>
            <span className="tabular-nums">{variantB.prompt.length} chars</span>
          </div>

          <div className="font-mono text-xs leading-relaxed text-slate-300 bg-[#0c0e16] p-4 rounded-lg border border-[#1b2132]">
            {variantB.prompt.split(/(\s+|,)/).map((segment, idx) => {
              const clean = segment.toLowerCase().replace(/[.,]/g, '');
              const isUnique = clean.length > 2 && !setA.has(clean);
              return (
                <span
                  key={idx}
                  className={
                    isUnique
                      ? 'bg-purple-500/20 text-purple-200 px-1 py-0.5 rounded font-semibold'
                      : 'text-slate-400'
                  }
                >
                  {segment}
                </span>
              );
            })}
          </div>

          <div className="text-xs text-slate-400">
            <span className="text-purple-300 font-semibold">Highlighted:</span> tokens unique to Style B (modifiers & lighting).
          </div>
        </div>
      </div>

      {/* AI Latent Comparison Button & Result */}
      <div className="bg-[#121520] border border-[#1f2638] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Gemini AI Diffusion Manifold Analysis</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluate how the diffusion model&apos;s text encoder maps these two prompts to distinct regions of CLIP latent space.
            </p>
          </div>

          <button
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-60 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating Attention Trajectories...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Latent Divergence Analysis</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-xs text-red-200">
            {errorMsg}
          </div>
        )}

        {aiAnalysis && (
          <div className="space-y-4 pt-4 border-t border-[#1f2638]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#0c0e16] rounded-xl border border-[#1b2132] space-y-1">
                <div className="text-xs text-slate-400 font-medium">Invariant Subject Identified</div>
                <div className="text-sm font-semibold text-emerald-400">
                  {aiAnalysis.commonSubject}
                </div>
              </div>

              <div className="p-4 bg-[#0c0e16] rounded-xl border border-[#1b2132] space-y-1">
                <div className="text-xs text-slate-400 font-medium">Estimated Latent Space Distance</div>
                <div className="text-sm font-semibold text-blue-400 font-mono tabular-nums">
                  {aiAnalysis.latentSpaceDistanceScore}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0c0e16] rounded-xl border border-[#1b2132] space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Key Divergence Mechanisms
              </div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                {aiAnalysis.divergenceFactors.map((factor, idx) => (
                  <li key={idx}>{factor}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#0c0e16] rounded-xl border border-[#1b2132] space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Semantic Drift & Style Bleed Risk
              </div>
              <p className="text-xs text-amber-300 leading-relaxed">
                {aiAnalysis.semanticDriftRisk}
              </p>
            </div>

            <div className="p-4 bg-[#0c0e16] rounded-xl border border-[#1b2132] space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Educational Synthesis for Prompt Engineers
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {aiAnalysis.comparativeAnalysis}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
