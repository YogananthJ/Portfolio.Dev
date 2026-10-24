import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { Cpu, CheckCircle2, Search, ArrowRight, Code } from 'lucide-react';

interface SkillsSectionProps {
  onSelectProjectTag?: (tag: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ onSelectProjectTag }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [skillSearch, setSkillSearch] = useState<string>('');

  const activeCategory = SKILL_CATEGORIES[activeCategoryIndex];

  return (
    <section id="skills" className="py-20 sm:py-28 bg-[#F5F2EB] border-b-2 border-[#121212] relative paper-grid">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#121212] mb-12">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-[#E11D48] uppercase mb-2">
              03 — Core Toolkit &amp; Competencies
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#121212]">
              Technical Skills
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#121212]/75 font-medium">
            Rigorous engineering background spanning deep learning frameworks, high-throughput backend APIs, automated scripting, and modern frontend systems.
          </p>
        </div>

        {/* Skills Architecture Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Category Tabs (Left) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-[#121212]/60 font-bold mb-3 px-1">
              Select Discipline
            </div>
            {SKILL_CATEGORIES.map((cat, i) => {
              const isActive = activeCategoryIndex === i;
              return (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategoryIndex(i)}
                  type="button"
                  className={`w-full text-left p-4 border-2 transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#121212] text-white border-[#121212] shadow-[4px_4px_0px_0px_#E11D48]'
                      : 'bg-[#EBE6DC] text-[#121212] border-[#121212]/20 hover:border-[#121212] hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base sm:text-lg font-black uppercase tracking-tight">
                      {cat.category}
                    </span>
                    <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#E11D48]' : 'text-[#121212]/50'}`}>
                      0{i + 1}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${isActive ? 'text-white/70' : 'text-[#121212]/70'}`}>
                    {cat.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Skills Table & Tags (Right) */}
          <div className="lg:col-span-8 bg-[#EBE6DC] border-2 border-[#121212] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#121212]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#121212]/15 mb-6">
              <div>
                <h3 className="font-display text-2xl font-black text-[#121212] uppercase tracking-tight">
                  {activeCategory.category}
                </h3>
                <p className="text-xs text-[#121212]/70 font-mono mt-0.5">
                  {activeCategory.skills.length} verified technologies &amp; frameworks
                </p>
              </div>

              {/* Instant Filter */}
              <div className="relative min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#121212]/40" />
                <input
                  type="text"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="Filter skills..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-white border border-[#121212]/30 text-[#121212] focus:outline-[#E11D48]"
                />
              </div>
            </div>

            {/* Skills Table List */}
            <div className="divide-y divide-[#121212]/10 font-mono">
              {activeCategory.skills
                .filter((s) => !skillSearch || s.name.toLowerCase().includes(skillSearch.toLowerCase()))
                .map((skill) => (
                  <div
                    key={skill.name}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/40 px-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-[#E11D48] rounded-full shrink-0"></span>
                      <span className="text-sm font-bold text-[#121212]">{skill.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      {skill.usedIn.length > 0 && (
                        <span className="text-[#121212]/50 text-[11px]">
                          Used in {skill.usedIn.length} projects
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-[#F5F2EB] border border-[#121212]/20 text-[#121212] font-semibold text-[11px]">
                        {skill.level}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Practical Engineering Note */}
            <div className="mt-8 pt-4 border-t border-[#121212]/15 flex items-start gap-3 bg-[#F5F2EB] p-4 border border-[#121212]/20">
              <Cpu className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" />
              <div className="text-xs text-[#121212]/80 leading-relaxed font-mono">
                <strong className="text-[#121212]">Engineering Principle:</strong> I prioritize measurable working code over buzzwords. Every framework in this stack has been validated through deployed applications, model convergence benchmarks, or automated pipelines.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
