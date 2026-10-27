import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Loader2,
  Lightbulb,
} from 'lucide-react';
import { STYLE_CATALOG } from '../data/styleCatalog';
import { StyleDefinition, StyleSuggestionResponse } from '../types';

interface StudioLabProps {
  onExperimentCreated?: (subject: string, styles: string[]) => void;
}

const PRESET_SUBJECTS = [
  'a girl with a laptop, studying at a desk in a room with a window',
  'A wise mechanical owl with intricate brass gears perched on a gnarled oak branch',
  'A solitary astronaut tending a bioluminescent cosmic greenhouse on Mars',
  'An ancient moss-covered stone lighthouse standing tall against a tempestuous ocean',
  'A vintage Victorian pocket watch with exposed escapement wheel resting on velvet',
];

export const StudioLab: React.FC<StudioLabProps> = () => {
  const [subject, setSubject] = useState<string>(PRESET_SUBJECTS[0]);
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>([
    'realistic',
    'cartoon-anime',
    'watercolor',
    'sketch-pencil',
  ]);

  // Modifiers
  const [lightingPreset, setLightingPreset] = useState<string>('default');
  const [mediumPreset, setMediumPreset] = useState<string>('default');
  const [cameraFraming, setCameraFraming] = useState<string>('balanced');
  const [styleWeight, setStyleWeight] = useState<number>(1.0);

  // Gemini suggestions state
  const [geminiSuggestions, setGeminiSuggestions] = useState<StyleSuggestionResponse | null>(null);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  // Copy state
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const selectedStyles: StyleDefinition[] = selectedStyleIds
    .map((id) => STYLE_CATALOG.find((s) => s.id === id))
    .filter(Boolean) as StyleDefinition[];

  const handleToggleStyle = (styleId: string) => {
    if (selectedStyleIds.includes(styleId)) {
      if (selectedStyleIds.length > 2) {
        setSelectedStyleIds(selectedStyleIds.filter((id) => id !== styleId));
      }
    } else {
      if (selectedStyleIds.length < 4) {
        setSelectedStyleIds([...selectedStyleIds, styleId]);
      } else {
        // Replace last
        setSelectedStyleIds([...selectedStyleIds.slice(0, 3), styleId]);
      }
    }
  };

  const handleSuggestStylesWithGemini = async () => {
    if (!subject.trim()) return;
    setIsSuggesting(true);
    setSuggestError(null);
    try {
      const res = await fetch('/api/suggest-styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject }),
      });
      if (!res.ok) throw new Error('API server error: ' + res.status);
      const data: StyleSuggestionResponse = await res.json();
      setGeminiSuggestions(data);
    } catch (err: any) {
      console.error(err);
      setSuggestError(err.message || 'Failed to fetch suggestions');
    } finally {
      setIsSuggesting(false);
    }
  };

  const generatePromptForStyle = (style: StyleDefinition) => {
    let base = style.promptTemplate.replace('{subject}', subject.trim());

    if (lightingPreset !== 'default') {
      base += `, ${lightingPreset}`;
    }
    if (mediumPreset !== 'default') {
      base += `, rendered in ${mediumPreset}`;
    }
    if (cameraFraming !== 'balanced') {
      base += `, ${cameraFraming}`;
    }
    if (styleWeight > 1.2) {
      base += `, highly accentuated stylistic intensity`;
    }

    return base;
  };

  const handleCopyPrompt = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const all = selectedStyles
      .map(
        (st, idx) =>
          `[Style ${idx + 1}: ${st.name}]\n${generatePromptForStyle(st)}\n`
      )
      .join('\n');
    navigator.clipboard.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleReset = () => {
    setSubject(PRESET_SUBJECTS[0]);
    setSelectedStyleIds(['ukiyo-e', 'cyberpunk-neon', 'impressionist-oil', 'claymation-stopmotion']);
    setLightingPreset('default');
    setMediumPreset('default');
    setCameraFraming('balanced');
    setStyleWeight(1.0);
    setGeminiSuggestions(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f2638]">
        <div>
          <div className="text-xs text-blue-400 font-medium">Prompt Engineering Workshop</div>
          <h2 className="text-2xl font-bold text-white font-display">Style Matrix Composer</h2>
          <p className="text-sm text-slate-400">
            Formulate comparative prompt matrices by systematically modulating artistic medium, lighting models, and stylistic weight.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-[#121520] hover:bg-[#1a1f30] border border-[#1f2638] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Workshop</span>
          </button>
        </div>
      </div>

      {/* Step 1: Define Subject Core */}
      <div className="bg-[#121520] border border-[#1f2638] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Define Invariant Subject (Control Variable)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Keep the core subject identical across all comparative iterations to measure style impact cleanly.
            </p>
          </div>

          <button
            onClick={handleSuggestStylesWithGemini}
            disabled={isSuggesting}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {isSuggesting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>AI Suggest Contrasting Styles</span>
          </button>
        </div>

        <textarea
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          rows={3}
          className="w-full bg-[#0c0e16] border border-[#1f2638] rounded-xl p-4 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="Enter subject prompt (e.g. A solitary astronaut in an alien greenhouse...)"
        />

        {/* Quick subject suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
          <span className="text-slate-500 font-medium">Quick presets:</span>
          {PRESET_SUBJECTS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSubject(s)}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left truncate max-w-xs"
            >
              {s.slice(0, 32)}...
              {idx < PRESET_SUBJECTS.length - 1 && <span className="text-slate-600 ml-2" aria-hidden="true">·</span>}
            </button>
          ))}
        </div>

        {/* Gemini Suggestions Callout */}
        {suggestError && (
          <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-xs text-red-200">
            {suggestError}
          </div>
        )}

        {geminiSuggestions && (
          <div className="p-4 bg-[#0c0e16] rounded-xl border border-[#1b2132] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <Lightbulb className="w-4 h-4" />
              <span>Gemini Recommended Style Variations for Maximum Contrast</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {geminiSuggestions.suggestions.map((sugg, sIdx) => (
                <div key={sIdx} className="p-3 bg-[#121520] rounded-lg border border-[#1f2638] space-y-1">
                  <div className="text-xs font-bold text-white">{sugg.styleName}</div>
                  <p className="text-[11px] text-slate-400 leading-normal">{sugg.rationale}</p>
                  <p className="text-[11px] font-mono text-slate-300 pt-1 border-t border-[#1f2638]">{sugg.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Choose 2 to 4 Styles to Compare */}
      <div className="bg-[#121520] border border-[#1f2638] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
              2
            </span>
            <span>Select 2 to 4 Art Styles to Contrast</span>
          </h3>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {selectedStyleIds.length} of 4 selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STYLE_CATALOG.map((st) => {
            const isSelected = selectedStyleIds.includes(st.id);
            return (
              <button
                key={st.id}
                onClick={() => handleToggleStyle(st.id)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-[#182035] border-blue-500 shadow-sm shadow-blue-500/20'
                    : 'bg-[#0c0e16] border-[#1f2638] hover:border-[#2d3752]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] font-medium text-blue-400">{st.category}</span>
                    <span className={isSelected ? 'text-blue-400 font-bold' : 'text-slate-600'}>
                      {isSelected ? '✓' : '+'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">{st.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">{st.medium}</div>
                </div>

                <div className="flex items-center gap-1 pt-2 border-t border-white/5">
                  {st.colorPalette.map((col, idx) => (
                    <span
                      key={idx}
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: col }}
                    />
                  ))}
                  <span className="text-[10px] text-slate-500 ml-auto font-mono">
                    Bleed: {st.styleBleedRisk}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Global Modifiers & Prompt Parameters */}
      <div className="bg-[#121520] border border-[#1f2638] rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
            3
          </span>
          <span>Fine-Tune Modifiers & Conditioning Weight</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Lighting override */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Lighting Environment</label>
            <select
              value={lightingPreset}
              onChange={(e) => setLightingPreset(e.target.value)}
              className="w-full bg-[#0c0e16] border border-[#1f2638] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="default">Style Default Lighting</option>
              <option value="golden hour natural sunlight with long shadows">Golden Hour Sunlight</option>
              <option value="volumetric neon cyan and magenta rim light">Volumetric Neon</option>
              <option value="dramatic raking candlelight tenebrism">Candlelight Chiaroscuro</option>
              <option value="diffused studio macro softbox illumination">Studio Softbox</option>
              <option value="moody overcast misty twilight">Overcast Twilight</option>
            </select>
          </div>

          {/* Medium override */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Substrate / Surface</label>
            <select
              value={mediumPreset}
              onChange={(e) => setMediumPreset(e.target.value)}
              className="w-full bg-[#0c0e16] border border-[#1f2638] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="default">Style Native Substrate</option>
              <option value="aged fibrous mulberry washi paper">Mulberry Washi Paper</option>
              <option value="heavy textured linen canvas with impasto relief">Rough Linen Canvas</option>
              <option value="tactile polymer clay with micro fingerprints">Polymer Clay Miniature</option>
              <option value="octane raytraced shaders with subsurface scattering">Octane 3D Shaders</option>
              <option value="antique translucent stained glass">Translucent Glass</option>
            </select>
          </div>

          {/* Camera / Framing */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Framing & Lens</label>
            <select
              value={cameraFraming}
              onChange={(e) => setCameraFraming(e.target.value)}
              className="w-full bg-[#0c0e16] border border-[#1f2638] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="balanced">Balanced Centered Framing</option>
              <option value="extreme macro close-up 85mm f/1.4 shallow depth of field">Macro 85mm f/1.4</option>
              <option value="cinematic wide-angle 24mm atmospheric view">Wide-Angle 24mm</option>
              <option value="dramatic low-angle heroic perspective">Low-Angle Heroic</option>
              <option value="orthographic flat graphic projection">Orthographic Flat</option>
            </select>
          </div>

          {/* Style weight slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">Style Intensity (w_style)</label>
              <span className="font-mono text-blue-400 tabular-nums">{styleWeight.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={1.8}
              step={0.1}
              value={styleWeight}
              onChange={(e) => setStyleWeight(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Subtle (0.6x)</span>
              <span>Nominal (1.0x)</span>
              <span>Dominant (1.8x)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Synthesized Comparative Prompt Matrix Output */}
      <div className="bg-[#121520] border border-[#1f2638] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f2638]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              <span>Synthesized Comparative Prompt Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {selectedStyles.length} parallel prompt variations ready to run in any state-of-the-art diffusion engine.
            </p>
          </div>

          <button
            onClick={handleCopyAll}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied Full Matrix' : 'Copy All Generated Prompts'}</span>
          </button>
        </div>

        {/* Matrix List */}
        <div className="space-y-4">
          {selectedStyles.map((style, idx) => {
            const compiledPrompt = generatePromptForStyle(style);
            return (
              <div
                key={style.id}
                className="bg-[#0c0e16] border border-[#1f2638] rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1f2638] text-white text-xs font-mono font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-white">{style.name}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-xs text-blue-400 font-medium">{style.category}</span>
                  </div>

                  <button
                    onClick={() => handleCopyPrompt(idx, compiledPrompt)}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="font-mono text-xs leading-relaxed text-slate-200 bg-[#121520] p-3 rounded-lg border border-[#1b2132]">
                  {compiledPrompt}
                </p>

                <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>
                    <strong className="text-slate-300">Diffusion Behavior:</strong> {style.diffusionBehavior}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
