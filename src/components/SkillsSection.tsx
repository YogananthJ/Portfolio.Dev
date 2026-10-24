import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { Cpu, CheckCircle2, Search, ArrowRight, Code, Sparkles } from 'lucide-react';

interface SkillsSectionProps {
  onSelectProjectTag?: (tag: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ onSelectProjectTag }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [skillSearch, setSkillSearch] = useState<string>('');

  const activeCategory = SKILL_CATEGORIES[activeCategoryIndex] || SKILL_CATEGORIES[0];

  return (
    <section id="skills" className="py-20 border-t border-[var(--border-color)] bg-[var(--bg-canvas)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-color)] mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 mb-3">
              <Code className="w-3.5 h-3.5" />
              Verified Competencies &amp; Exploration
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text-main)]">
              Technical Stack &amp; Skills
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            Practical skills verified across academic projects, hackathon prototypes, personal builds, and active agent orchestration studies.
          </p>
        </div>

        {/* Skills Architecture Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Category Tabs (Left) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold mb-3 px-1">
              Select Discipline (7 Domains)
            </div>
            {SKILL_CATEGORIES.map((cat, i) => {
              const isActive = activeCategoryIndex === i;
              return (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategoryIndex(i)}
                  type="button"
                  className={`w-full text-left p-3.5 border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                      : 'bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--text-main)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-tight">
                      {cat.category}
                    </span>
                    <span className={`text-xs font-mono font-bold ${isActive ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                      0{i + 1}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${isActive ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                    {cat.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Skills Table & Tags (Right) */}
          <div className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)] mb-6">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] uppercase tracking-tight">
                  {activeCategory.category}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                  {activeCategory.skills.length} verified technologies &amp; frameworks
                </p>
              </div>

              {/* Instant Filter */}
              <div className="relative min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="Filter skills..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            {/* Skills Table List */}
            <div className="divide-y divide-[var(--border-color)] font-mono">
              {activeCategory.skills
                .filter((s) => !skillSearch || s.name.toLowerCase().includes(skillSearch.toLowerCase()))
                .map((skill) => (
                  <div
                    key={skill.name}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[var(--bg-surface)] px-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-[var(--text-main)]">
                        {skill.name}
                      </span>
                      {skill.highlight && (
                        <span className="px-1.5 py-0.2 bg-[var(--accent)]/15 text-[var(--accent)] text-[9px] uppercase font-bold border border-[var(--accent)]/30">
                          Core
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {skill.usedIn.length > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] truncate max-w-xs">
                          <span className="text-[10px] uppercase">Built with:</span>
                          <span className="truncate">{skill.usedIn.join(', ')}</span>
                        </div>
                      )}
                      <span className="px-2 py-0.5 text-[10px] bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold shrink-0">
                        {skill.level}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
