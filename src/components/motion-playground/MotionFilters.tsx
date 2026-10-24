import React from 'react';
import { Sparkles, Filter, Layers } from 'lucide-react';
import { MotionCategory } from './motion-playground.types';

interface MotionFiltersProps {
  activeCategory: MotionCategory;
  onSelectCategory: (cat: MotionCategory) => void;
  onSurpriseMe: () => void;
  totalCount: number;
  filteredCount: number;
}

const CATEGORIES: { id: MotionCategory; label: string }[] = [
  { id: 'all', label: 'All Experiments' },
  { id: 'gsap', label: 'GSAP 3.0' },
  { id: 'threejs', label: 'Three.js / 3D' },
  { id: 'vanillajs', label: 'CSS / Vanilla JS' },
  { id: 'canvas', label: 'Canvas 2D' },
];

export const MotionFilters: React.FC<MotionFiltersProps> = ({
  activeCategory,
  onSelectCategory,
  onSurpriseMe,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-[var(--border-color)]">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[var(--text-muted)] mr-1">
          <Filter className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Filter:</span>
        </div>

        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              type="button"
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                isActive
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[2px_2px_0px_0px_var(--border-color)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Controls: Surprise Me & Count */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs font-mono text-[var(--text-muted)]">
          Showing <strong className="text-[var(--text-main)]">{filteredCount}</strong> of {totalCount}
        </span>

        <button
          onClick={onSurpriseMe}
          type="button"
          className="px-3.5 py-1.5 bg-[var(--text-main)] text-[var(--bg-canvas)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border-color)] font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_var(--accent)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          title="Randomly pick an experiment and trigger its motion"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Surprise Me</span>
        </button>
      </div>
    </div>
  );
};
