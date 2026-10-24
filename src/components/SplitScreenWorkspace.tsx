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
  Maximize2,
  ExternalLink,
  Cpu
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
    const matchesCat = activeCategory === 'all' || p.category === activeCategory || p.projectKind === activeCategory;
    const matchesQuery = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] flex flex-col font-sans">
      {/* Top Workspace Header */}
      <div className="bg-[var(--bg-surface)] text-[var(--text-main)] px-4 sm:px-6 py-3 border-b border-[var(--border-color)] flex items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLayoutMode('standard')}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-white transition-opacity hover:opacity-90 font-bold uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </button>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="font-bold text-[var(--text-main)] uppercase hidden sm:inline">Dual-Pane Developer Workbench</span>
        </div>

        {/* Split Ratio Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-muted)] text-[11px] hidden md:inline">Split Ratio:</span>
          <div className="flex items-center gap-1 bg-[var(--bg-card)] p-1 border border-[var(--border-color)]">
            {[40, 50, 60].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setSplitRatio(ratio)}
                type="button"
                className={`px-2 py-0.5 text-[10px] font-bold ${
                  splitRatio === ratio
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
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
          className="overflow-y-auto border-r border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col"
          style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${splitRatio}%` : '100%' }}
        >
          {/* Explorer Header */}
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)] space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold uppercase text-[var(--text-main)]">
                Projects Directory
              </span>
              <span className="text-xs text-[var(--accent)] font-bold">
                {filteredProjects.length} Verified
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search systems..."
                className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          {/* Project List */}
          <div className="divide-y divide-[var(--border-color)]">
            {filteredProjects.map((p) => {
              const isSelected = p.id === selectedProject.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setActiveSimulatorId(p.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[var(--bg-card)] border-l-4 border-l-[var(--accent)]'
                      : 'hover:bg-[var(--bg-card)]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[var(--accent)] font-bold">
                        {p.categoryLabel} · {p.projectKind}
                      </div>
                      <h4 className="text-base font-bold text-[var(--text-main)] uppercase tracking-tight mt-0.5">
                        {p.title}
                      </h4>
                    </div>

                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)]">
                      {p.metrics[0].label}: {p.metrics[0].value}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed line-clamp-2 mb-2 text-[var(--text-muted)]">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-1.5 text-[var(--accent)]">
                      <Play className="w-3 h-3 fill-current" />
                      <span className="font-bold">
                        {p.simulatorConfig.hasSimulator ? 'Active AI Lab' : 'System Overview'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenModal(p);
                      }}
                      type="button"
                      className="text-[11px] underline font-bold text-[var(--text-main)]"
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
          className="flex-1 overflow-y-auto bg-[var(--bg-canvas)] p-4 sm:p-6 lg:p-8 flex flex-col justify-between"
          style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${100 - splitRatio}%` : '100%' }}
        >
          <div>
            {/* Active Model Title Strip */}
            <div className="p-4 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4 mb-6 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-widest block">
                  Active Sandbox &amp; Neural Evaluation
                </span>
                <h3 className="text-xl font-bold uppercase text-[var(--text-main)] mt-0.5">
                  {selectedProject.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-[var(--accent)] text-white font-bold uppercase text-[11px]"
                  >
                    <span>Live App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-main)] transition-colors font-bold uppercase text-[11px]"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onOpenModal(selectedProject)}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-main)] transition-colors font-bold uppercase text-[11px]"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </button>
              </div>
            </div>

            {/* Embedded Live Project Simulator or System Architecture Card */}
            {selectedProject.simulatorConfig.hasSimulator ? (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 sm:p-6 mb-6">
                <ProjectSimulator project={selectedProject} />
              </div>
            ) : (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 mb-6 space-y-4 font-mono text-xs">
                <div className="flex items-center gap-2 text-[var(--accent)] font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>Production Full-Stack &amp; Coursework Specification</span>
                </div>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  {selectedProject.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[var(--bg-surface)] border border-[var(--border-color)]">
                  {selectedProject.metrics.map((m, i) => (
                    <div key={i}>
                      <span className="text-[10px] text-[var(--text-muted)] uppercase block">{m.label}</span>
                      <span className="text-base font-bold text-[var(--accent)]">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Highlights & Architecture Accordion */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-2">
                System Engineering &amp; Methodology
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-mono mb-4">
                {selectedProject.architectureOverview}
              </p>

              <div className="pt-3 border-t border-[var(--border-color)] flex flex-wrap items-center gap-1.5 font-mono text-xs">
                <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Stack:</span>
                {selectedProject.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] text-[11px]">
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
