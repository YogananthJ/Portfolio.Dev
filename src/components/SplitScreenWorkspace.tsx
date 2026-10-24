import React, { useState } from 'react';
import { useLayout } from '../context/LayoutContext';
import { PROJECTS } from '../data/portfolioData';
import { ProjectSimulator } from './ProjectSimulator';
import { 
  ArrowLeft, 
  Github, 
  Play, 
  Search, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  ArrowUpRight,
  Maximize2
} from 'lucide-react';

interface SplitScreenWorkspaceProps {
  onOpenModal: (project: any) => void;
}

export const SplitScreenWorkspace: React.FC<SplitScreenWorkspaceProps> = ({ onOpenModal }) => {
  const { 
    splitRatio, 
    setSplitRatio, 
    setLayoutMode, 
    activeSimulatorId, 
    setActiveSimulatorId 
  } = useLayout();

  const [search, setSearch] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const selectedProject = PROJECTS.find((p) => p.id === activeSimulatorId) || PROJECTS[0];

  const filteredProjects = PROJECTS.filter((p) => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesQuery = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col font-sans">
      {/* Top Workspace Header */}
      <div className="bg-[#121212] text-white px-4 sm:px-6 py-3 border-b-2 border-[#121212] flex items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLayoutMode('standard')}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#E11D48] text-white border border-white/20 transition-colors font-bold uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </button>
          <span className="text-white/40">/</span>
          <span className="font-bold text-white uppercase hidden sm:inline">Dual-Pane Developer Workbench</span>
        </div>

        {/* Split Ratio Controls */}
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-[11px] hidden md:inline">Split Ratio:</span>
          <div className="flex items-center gap-1 bg-white/10 p-1 border border-white/20">
            {[40, 50, 60].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setSplitRatio(ratio)}
                type="button"
                className={`px-2 py-0.5 text-[10px] font-bold ${
                  splitRatio === ratio
                    ? 'bg-[#E11D48] text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {ratio}% / {100 - ratio}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Pane: Project Explorer */}
        <div
          className="overflow-y-auto border-r-2 border-[#121212] bg-[#EBE6DC] flex flex-col"
          style={{ width: window.innerWidth >= 1024 ? `${splitRatio}%` : '100%' }}
        >
          {/* Explorer Header */}
          <div className="p-4 border-b border-[#121212]/15 bg-[#F5F2EB] space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-black uppercase text-[#121212]">
                Projects Directory
              </span>
              <span className="text-xs text-[#E11D48] font-bold">
                {filteredProjects.length} Available
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#121212]/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models, algorithms, frameworks..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#121212]/30 focus:outline-[#E11D48]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1 text-[11px]">
              {['all', 'machine-learning', 'computer-vision', 'full-stack', 'genai-nlp'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  type="button"
                  className={`px-2 py-0.5 font-bold uppercase transition-colors border ${
                    activeCategory === cat
                      ? 'bg-[#121212] text-white border-[#121212]'
                      : 'bg-white text-[#121212] border-[#121212]/20 hover:bg-[#121212]/10'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat === 'genai-nlp' ? 'GenAI' : cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Project List Items */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {filteredProjects.map((p, idx) => {
              const isSelected = p.id === activeSimulatorId;
              return (
                <div
                  key={p.id}
                  onClick={() => setActiveSimulatorId(p.id)}
                  className={`p-4 border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#121212] text-white border-[#121212] shadow-[4px_4px_0px_0px_#E11D48]'
                      : 'bg-white text-[#121212] border-[#121212]/20 hover:border-[#121212] hover:bg-[#F5F2EB]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-[#E11D48]">
                        <span>0{idx + 1}.</span>
                        <span>{p.categoryLabel}</span>
                        <span className="text-[#121212]/30">·</span>
                        <span>{p.year}</span>
                      </div>
                      <h4 className="font-display text-lg font-black uppercase tracking-tight mt-0.5">
                        {p.title}
                      </h4>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                      isSelected ? 'bg-[#E11D48] text-white border-transparent' : 'bg-[#EBE6DC] text-[#121212] border-[#121212]/20'
                    }`}>
                      {p.metrics[0].label}: {p.metrics[0].value}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed line-clamp-2 mb-3 font-medium ${
                    isSelected ? 'text-white/80' : 'text-[#121212]/75'
                  }`}>
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-current/10">
                    <div className="flex items-center gap-1.5">
                      <Play className="w-3 h-3 fill-current text-[#E11D48]" />
                      <span className="font-bold">
                        {isSelected ? 'Live in Simulator &rarr;' : 'Click to Load in Simulator'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenModal(p);
                      }}
                      type="button"
                      className="text-[11px] underline font-bold"
                    >
                      Deep Dive
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Live Model Simulator & Telemetry */}
        <div
          className="flex-1 overflow-y-auto bg-[#F5F2EB] p-4 sm:p-6 lg:p-8 flex flex-col justify-between"
          style={{ width: window.innerWidth >= 1024 ? `${100 - splitRatio}%` : '100%' }}
        >
          <div>
            {/* Active Model Title Strip */}
            <div className="p-4 bg-[#121212] text-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#E11D48] flex flex-wrap items-center justify-between gap-4 mb-6 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#E11D48] font-bold uppercase tracking-widest block">
                  Active Sandbox &amp; Neural Evaluation
                </span>
                <h3 className="font-display text-2xl font-black uppercase text-white mt-0.5">
                  {selectedProject.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#E11D48] text-white border border-white/20 transition-colors font-bold uppercase text-[11px]"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repo</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>

                <button
                  onClick={() => onOpenModal(selectedProject)}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black hover:bg-[#E11D48] hover:text-white transition-colors font-bold uppercase text-[11px]"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </button>
              </div>
            </div>

            {/* Embedded Live Project Simulator */}
            <ProjectSimulator project={selectedProject} />

            {/* Technical Highlights & Architecture Accordion */}
            <div className="mt-6 bg-[#EBE6DC] border-2 border-[#121212] p-5 shadow-[4px_4px_0px_0px_#121212]">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#E11D48] mb-2">
                System Engineering &amp; Methodology
              </h4>
              <p className="text-xs sm:text-sm text-[#121212]/80 leading-relaxed font-mono mb-4">
                {selectedProject.architectureOverview}
              </p>

              <div className="pt-3 border-t border-[#121212]/15 flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="text-[#121212]/50 font-bold uppercase text-[10px]">Stack:</span>
                {selectedProject.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-[#F5F2EB] border border-[#121212]/20 text-[#121212] font-semibold text-[11px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
