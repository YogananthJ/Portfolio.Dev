import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { Cpu, Search, Code, Sparkles, CheckCircle2, Network, ArrowRight } from 'lucide-react';

interface SkillsSectionProps {
  onSelectProjectTag?: (tag: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ onSelectProjectTag }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const activeCategory = SKILL_CATEGORIES[activeCategoryIndex] || SKILL_CATEGORIES[0];

  // Inter-disciplinary technological synergies
  const SYNERGIES = [
    {
      domain: 'AI & Machine Learning',
      connectsWith: 'Automation & Agent Orchestration',
      description: 'Foundational ML heuristics & LLM prompts orchestrating multi-agent systems.',
    },
    {
      domain: 'Full-Stack Web Systems',
      connectsWith: 'AI Model Inference',
      description: 'React 19 & TypeScript UIs wired to Python/FastAPI model backends.',
    },
    {
      domain: 'Vector Databases & RAG',
      connectsWith: 'Document Knowledge Retrieval',
      description: 'FAISS + Dense Embeddings powering grounded hallucination-free QA.',
    },
  ];

  const filteredSkills = activeCategory.skills.filter(
    (s) =>
      !skillSearch ||
      s.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
      s.usedIn.some((u) => u.toLowerCase().includes(skillSearch.toLowerCase()))
  );

  return (
    <section
      id="skills"
      className="py-24 border-t border-[var(--border-color)] bg-[var(--bg-canvas)] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-color)] mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 mb-3">
              <Network className="w-3.5 h-3.5" />
              <span>Technology Constellation &amp; Competencies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text-main)]">
              Technical Stack &amp; Skills
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-[var(--text-muted)] font-medium font-mono leading-relaxed">
            Practical skills verified across academic coursework, hackathon prototypes, personal open-source builds, and active agent orchestration studies.
          </p>
        </div>

        {/* Synergies Banner: AI + Full-Stack + Automation Relationships */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {SYNERGIES.map((syn, idx) => (
            <div
              key={idx}
              className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] font-mono text-xs rounded-xs relative group hover:border-[var(--accent)] transition-colors"
            >
              <div className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Inter-Disciplinary Bridge</span>
              </div>
              <div className="font-bold text-[var(--text-main)] mb-1">
                {syn.domain} <span className="text-[var(--accent)]">↔</span> {syn.connectsWith}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                {syn.description}
              </p>
            </div>
          ))}
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
                  onClick={() => {
                    setActiveCategoryIndex(i);
                    setSelectedSkill(null);
                  }}
                  type="button"
                  className={`w-full text-left p-3.5 border transition-all flex flex-col justify-between relative cursor-pointer active:scale-[0.99] ${
                    isActive
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-md'
                      : 'bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--text-main)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-tight">
                      {cat.category}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        isActive ? 'text-white/80' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      0{i + 1}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      isActive ? 'text-white/80' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {cat.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Skills Table & Tags (Right) */}
          <div className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 sm:p-7 shadow-sm rounded-xs">
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
                  placeholder="Filter technologies..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            {/* Interactive Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill) => {
                  const isSelected = selectedSkill === skill.name;
                  return (
                    <motion.div
                      layout
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setSelectedSkill(isSelected ? null : skill.name)}
                      className={`p-3.5 border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[var(--accent)] bg-[var(--bg-surface)] shadow-md ring-1 ring-[var(--accent)]'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-main)]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-bold text-xs sm:text-sm text-[var(--text-main)]">
                            {skill.name}
                          </span>
                          {skill.highlight && (
                            <span className="px-1.5 py-0.5 bg-[var(--accent)]/15 text-[var(--accent)] text-[9px] uppercase font-bold border border-[var(--accent)]/30">
                              Core
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] text-[var(--text-muted)] mb-2">
                          Proficiency: <span className="font-bold text-[var(--text-main)]">{skill.level}</span>
                        </div>
                      </div>

                      {/* Associated Projects and Usage Context */}
                      {skill.usedIn.length > 0 && (
                        <div className="pt-2 border-t border-[var(--border-color)]/60 text-[10px] text-[var(--text-muted)]">
                          <span className="text-[9px] uppercase tracking-wider block text-white/50 mb-0.5">
                            Demonstrated In:
                          </span>
                          <span className="text-[var(--accent)] font-semibold truncate block">
                            {skill.usedIn.join(' · ')}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {filteredSkills.length === 0 && (
              <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)]">
                No matching technologies found for "{skillSearch}".
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
