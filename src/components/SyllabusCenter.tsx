import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Layers,
  Activity,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { PromptAnalysisResponse } from '../types';

export const SyllabusCenter: React.FC = () => {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [samplePrompt, setSamplePrompt] = useState<string>(
    'Traditional Japanese Edo period Ukiyo-e woodblock print of a mechanical owl with brass gears and luminous amber eyes, delicate woodcut linework, bokashi color gradation, antique washi paper texture'
  );
  const [analysisResult, setAnalysisResult] = useState<PromptAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyzePrompt = async () => {
    if (!samplePrompt.trim()) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch('/api/analyze-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: samplePrompt }),
      });
      if (!res.ok) throw new Error('API server error: ' + res.status);
      const data: PromptAnalysisResponse = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'Failed to analyze prompt');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const modules = [
    {
      id: 'mod-1',
      number: '01',
      title: 'Latent Conditioning & Cross-Attention Mechanics',
      summary:
        'How text encoders (CLIP / T5) project natural language tokens into keys and values that modulate spatial UNet feature maps.',
      content: [
        {
          heading: 'From Words to Spatial Attention Maps',
          body: 'Modern latent diffusion models (such as Stable Diffusion, Imagen, and Midjourney) do not paint pixels directly from text. Instead, a frozen text encoder embeds each token into a high-dimensional vector. During the reverse diffusion process, cross-attention layers calculate dot-product attention between image feature maps (queries Q) and the text embeddings (keys K and values V).',
        },
        {
          heading: 'Token Position Bias (The Left-to-Right Gradient)',
          body: 'Empirical studies demonstrate that tokens appearing early in the prompt string exert significantly higher gradient influence on coarse composition, object geometry, and focal placement. Style tags placed toward the end act primarily as high-frequency texture and color-space filters.',
        },
      ],
      keyTakeaway:
        'Always anchor the invariant subject (e.g. "mechanical owl") near the front, and distribute medium, substrate, and lighting tokens in descending order of specificity.',
    },
    {
      id: 'mod-2',
      number: '02',
      title: 'The Anatomy of a Production Style Prompt',
      summary:
        'A rigorous 5-layer taxonomy for structuring prompts to achieve reproducible, high-fidelity aesthetic variations.',
      content: [
        {
          heading: 'The 5-Layer Prompt Stack',
          body: 'A well-engineered prompt is composed of distinct semantic layers: 1) Subject Core (the noun and immediate attributes), 2) Artistic Style / Movement (e.g. Ukiyo-e, Baroque), 3) Medium & Physical Substrate (oil on linen, washi paper, polymer clay), 4) Lighting Paradigm (golden hour, chiaroscuro, volumetric neon), and 5) Framing / Optics (macro 85mm, wide-angle 24mm).',
        },
        {
          heading: 'Avoiding "Prompt Soup"',
          body: 'Stacking conflicting quality buzzwords (e.g. "trending on artstation, 8k, hyperrealistic, octane render, masterpiece") introduces latent noise and dilutes intentional style vectors. Precision beats quantity.',
        },
      ],
      keyTakeaway:
        'Replace generic adjectives with authentic domain nouns: specify "bokashi gradation on washi paper" rather than "Japanese style, very nice".',
    },
    {
      id: 'mod-3',
      number: '03',
      title: 'Style Bleed & Semantic Entanglement',
      summary:
        'Why style descriptors inadvertently mutate subject anatomy and how negative conditioning creates clean semantic boundaries.',
      content: [
        {
          heading: 'The Concept Leakage Phenomenon',
          body: 'Because diffusion models learn statistical co-occurrences, style words like "watercolor" or "claymation" carry strong correlations with soft edges, paper backgrounds, or rounded toy-like proportions. When applying "watercolor" to a "steampunk robot", the robot itself may bleed into fluid pigment puddles rather than retaining hard mechanical brass.',
        },
        {
          heading: 'Mitigating Bleed with Negative Prompts',
          body: 'Negative prompts push the latent trajectory away from unwanted correlations. Pairing "claymation" with a negative prompt like "cgi, sharp geometric edges, 2d drawing" forces the model to double down on physical tactile realism while preserving the intended creature anatomy.',
        },
      ],
      keyTakeaway:
        'When testing style variations, inspect whether the style modified only the rendering shader or inadvertently altered the subject’s proportions.',
    },
    {
      id: 'mod-4',
      number: '04',
      title: 'Classifier-Free Guidance (CFG) & Sampling Dynamics',
      summary:
        'Tuning the mathematical trade-off between strict prompt adherence and visual naturalism during iterative denoising.',
      content: [
        {
          heading: 'Understanding Guidance Scale (w)',
          body: 'Classifier-Free Guidance (CFG) blends the unconditional score estimation with the conditional score estimation: ε_total = ε_uncond + w * (ε_cond - ε_uncond). A scale of w=7.0 to 8.5 is the sweet spot for style prompt experiments. Values above 12.0 produce saturated color clipping and over-sharpened artifacts.',
        },
        {
          heading: 'Step Count & Sampler Invariants',
          body: 'When comparing styles, hold the seed and step count constant. Switching samplers (e.g. Euler vs DPM++ 2M Karras) midway through an experiment introduces confounding noise trajectory variations.',
        },
      ],
      keyTakeaway:
        'In scientific prompt experiments, hold CFG, steps, seed, and resolution constant across all style variants.',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Syllabus Header */}
      <div className="pb-4 border-b border-[#1f2638]">
        <div className="text-xs text-blue-400 font-medium">Curriculum Reference</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
          Advanced Image Generation: Prompt Engineering & Style Mechanics
        </h2>
        <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
          Master the theoretical principles and mathematical dynamics of text-to-image conditioning, latent manifold steering, and token attention distribution.
        </p>
      </div>

      {/* Module Selector & Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Module Sidebar Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 px-2 pb-1">
            Course Modules
          </div>
          {modules.map((mod, idx) => {
            const isActive = activeModuleIndex === idx;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModuleIndex(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#182035] border-blue-500 shadow-sm text-white'
                    : 'bg-[#121520] border-[#1f2638] text-slate-300 hover:border-[#2d3752]'
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-blue-400 font-mono font-semibold">
                  <span>Unit {mod.number}</span>
                </div>
                <div className="text-sm font-bold mt-1 text-white">{mod.title}</div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {mod.summary}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Module Detail */}
        <div className="lg:col-span-8 bg-[#121520] border border-[#1f2638] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2 pb-6 border-b border-[#1f2638]">
            <div className="flex items-center gap-2 text-xs text-blue-400 font-mono font-semibold">
              <span>Unit {modules[activeModuleIndex].number}</span>
              <span aria-hidden="true">·</span>
              <span>Theoretical & Applied Foundation</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              {modules[activeModuleIndex].title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {modules[activeModuleIndex].summary}
            </p>
          </div>

          {/* Module Subsections */}
          <div className="space-y-6">
            {modules[activeModuleIndex].content.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-2">
                <h4 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{sec.heading}</span>
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed pl-6">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          {/* Key Takeaway Callout */}
          <div className="p-4 bg-[#0c0e16] rounded-xl border border-[#1b2132] flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-amber-300">Prompt Engineering Best Practice:</span>
              <p className="text-slate-300 leading-relaxed">
                {modules[activeModuleIndex].keyTakeaway}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Student Tool: Live Prompt Tokenizer & Cross-Attention Inspector */}
      <div className="bg-[#121520] border border-[#1f2638] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f2638]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <Activity className="w-5 h-5 text-blue-400" />
              <span>Interactive Prompt Tokenizer & Attention Inspector</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Submit any experimental prompt to decompose its tokens, evaluate attention weighting, and assess style bleed risks.
            </p>
          </div>

          <button
            onClick={handleAnalyzePrompt}
            disabled={isAnalyzing}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Parsing Prompt Syntax...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Deconstruct with Gemini</span>
              </>
            )}
          </button>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Test Image Generation Prompt</label>
          <textarea
            value={samplePrompt}
            onChange={(e) => setSamplePrompt(e.target.value)}
            rows={3}
            className="w-full bg-[#0c0e16] border border-[#1f2638] rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {analysisError && (
          <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-xs text-red-200">
            {analysisError}
          </div>
        )}

        {/* Results */}
        {analysisResult && (
          <div className="space-y-5 pt-2">
            {/* Categorized Layers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#0c0e16] rounded-xl border border-[#1b2132]">
                <div className="text-[11px] text-slate-400 font-medium">Subject Core</div>
                <div className="text-xs font-bold text-sky-400 mt-1 truncate">
                  {analysisResult.subject}
                </div>
              </div>

              <div className="p-3 bg-[#0c0e16] rounded-xl border border-[#1b2132]">
                <div className="text-[11px] text-slate-400 font-medium">Art Style Movement</div>
                <div className="text-xs font-bold text-purple-400 mt-1 truncate">
                  {analysisResult.style}
                </div>
              </div>

              <div className="p-3 bg-[#0c0e16] rounded-xl border border-[#1b2132]">
                <div className="text-[11px] text-slate-400 font-medium">Medium & Substrate</div>
                <div className="text-xs font-bold text-emerald-400 mt-1 truncate">
                  {analysisResult.medium}
                </div>
              </div>

              <div className="p-3 bg-[#0c0e16] rounded-xl border border-[#1b2132]">
                <div className="text-[11px] text-slate-400 font-medium">Style Bleed Risk</div>
                <div className="text-xs font-bold text-amber-400 mt-1 truncate">
                  {analysisResult.styleBleedRisk}
                </div>
              </div>
            </div>

            {/* Token-by-Token Attention Map */}
            <div className="p-4 bg-[#0c0e16] rounded-xl border border-[#1b2132] space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Token Attention Sequence & Relative Salience
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResult.tokenBreakdown.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-[#121520] border border-[#1f2638] rounded-lg text-xs space-y-1"
                  >
                    <div className="font-mono font-medium text-white">{t.token}</div>
                    <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 border-t border-[#1f2638] pt-1">
                      <span className="text-blue-400">{t.category}</span>
                      <span className="font-mono text-emerald-400">w: {t.estimatedAttentionWeight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diffusion Research Insight */}
            <div className="p-4 bg-[#121520] rounded-xl border border-[#1f2638] space-y-2">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Cross-Attention Model Analysis
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysisResult.diffusionInsight}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
