import React from 'react';
import { Sparkles, SlidersHorizontal, BookOpen, Layers, SplitSquareVertical } from 'lucide-react';

export type ActiveTab = 'gallery' | 'split' | 'diff' | 'studio' | 'syllabus';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenCreate: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab, onOpenCreate }) => {
  return (
    <header className="border-b border-[#1f2537] bg-[#0c0e16]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectTab('gallery')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block shadow-sm shadow-blue-500/50" />
            ArtPrompt Matrix
          </span>
        </button>

        {/* Zone 2: 4-5 Navigation Links (single-line, clean typography) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onSelectTab('gallery')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gallery'
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 opacity-75" />
            Prompt Gallery
          </button>

          <button
            onClick={() => onSelectTab('split')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'split'
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SplitSquareVertical className="w-4 h-4 opacity-75" />
            A/B Split Slider
          </button>

          <button
            onClick={() => onSelectTab('diff')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'diff'
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 opacity-75" />
            Prompt Diff
          </button>

          <button
            onClick={() => onSelectTab('studio')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'studio'
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 opacity-75" />
            Studio Lab
          </button>

          <button
            onClick={() => onSelectTab('syllabus')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'syllabus'
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 opacity-75" />
            Syllabus
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCreate}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm shadow-blue-600/30 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>+</span>
            <span>New Experiment</span>
          </button>
        </div>
      </div>
    </header>
  );
};
