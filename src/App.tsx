/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { GalleryMatrix } from './components/GalleryMatrix';
import { SplitComparisonSlider } from './components/SplitComparisonSlider';
import { PromptDiffViewer } from './components/PromptDiffViewer';
import { StudioLab } from './components/StudioLab';
import { SyllabusCenter } from './components/SyllabusCenter';
import { ImageDetailModal } from './components/ImageDetailModal';
import { EXPERIMENTS_DATA } from './data/experiments';
import { ExperimentSet, ExperimentVariant } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('gallery');
  const [currentExperiment, setCurrentExperiment] = useState<ExperimentSet>(EXPERIMENTS_DATA[0]);

  // Comparison pair state for Split Slider and Prompt Diff
  const [activePair, setActivePair] = useState<{
    variantA: ExperimentVariant;
    variantB: ExperimentVariant;
  }>({
    variantA: EXPERIMENTS_DATA[0].variants[0],
    variantB: EXPERIMENTS_DATA[0].variants[1],
  });

  const handleSelectExperiment = (exp: ExperimentSet) => {
    setCurrentExperiment(exp);
    setActivePair({
      variantA: exp.variants[0],
      variantB: exp.variants[1] || exp.variants[0],
    });
  };

  // Modal inspection state
  const [selectedVariantForModal, setSelectedVariantForModal] =
    useState<ExperimentVariant | null>(null);

  const handleComparePair = (
    variantA: ExperimentVariant,
    variantB: ExperimentVariant,
    mode: 'split' | 'diff'
  ) => {
    setActivePair({ variantA, variantB });
    setActiveTab(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetail = (variant: ExperimentVariant) => {
    setSelectedVariantForModal(variant);
  };

  const handleCompareWithOther = (variant: ExperimentVariant) => {
    const other =
      currentExperiment.variants.find((v) => v.id !== variant.id) ||
      currentExperiment.variants[0];
    setActivePair({ variantA: variant, variantB: other });
    setActiveTab('split');
  };

  return (
    <div className="min-h-screen bg-[#0b0d13] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCreate={() => {
          setActiveTab('studio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'gallery' && (
          <GalleryMatrix
            experiment={currentExperiment}
            availableExperiments={EXPERIMENTS_DATA}
            onSelectExperiment={handleSelectExperiment}
            onOpenDetail={handleOpenDetail}
            onComparePair={handleComparePair}
          />
        )}

        {activeTab === 'split' && (
          <SplitComparisonSlider
            variants={currentExperiment.variants}
            initialVariantA={activePair.variantA}
            initialVariantB={activePair.variantB}
            onOpenDiff={(a, b) => handleComparePair(a, b, 'diff')}
          />
        )}

        {activeTab === 'diff' && (
          <PromptDiffViewer
            variants={currentExperiment.variants}
            initialVariantA={activePair.variantA}
            initialVariantB={activePair.variantB}
            onOpenSplit={(a, b) => handleComparePair(a, b, 'split')}
          />
        )}

        {activeTab === 'studio' && <StudioLab />}

        {activeTab === 'syllabus' && <SyllabusCenter />}
      </main>

      {/* Detail Modal */}
      <ImageDetailModal
        variant={selectedVariantForModal}
        onClose={() => setSelectedVariantForModal(null)}
        onCompareWithOther={handleCompareWithOther}
      />

      {/* Clean Footer (No fake versioning or buzzword tickers) */}
      <footer className="border-t border-[#1a1f30] bg-[#090b10] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">ArtPrompt Matrix</span>
            <span aria-hidden="true">·</span>
            <span>AI Art Style Prompt Experiment Laboratory</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Syllabus: Advanced Image-Generation Applications</span>
            <span aria-hidden="true">·</span>
            <span>Latent Diffusion Research</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
