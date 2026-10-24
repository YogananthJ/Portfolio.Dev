import React, { useState } from 'react';
import { PROJECTS } from '../data/portfolioData';
import { ProjectSimulator } from './ProjectSimulator';
import { Play, Sparkles, Terminal, ArrowUpRight, AlertTriangle, ExternalLink, Cpu } from 'lucide-react';

export const SimulatorsSection: React.FC = () => {
  // Only projects with active AI simulators
  const aiSimulatorProjects = PROJECTS.filter((p) => p.simulatorConfig.hasSimulator);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('cognitive-ai');

  const selectedProject =
    aiSimulatorProjects.find((p) => p.id === selectedProjectId) || aiSimulatorProjects[0];

  return (
    <section id="simulators" className="py-20 border-t border-[var(--border-color)] bg-[var(--bg-canvas)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-color)] mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 mb-3">
              <Cpu className="w-3.5 h-3.5" />
              Interactive AI Sandboxes
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--text-main)]">
              AI Project Labs &amp; Simulators
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              Explore interactive client-side sandboxes for AI agent workflows, retrieval-augmented generation (RAG), emotion cadence detection, and multi-spectral computer vision.
            </p>
          </div>

          {/* Recruiter Transparency Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto px-3 py-2 bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-600 dark:text-amber-400 max-w-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Recruiter Notice:</strong> Client-side simulators illustrate pipeline mechanics and parameter reactivity; real inference links are highlighted with external buttons.
            </span>
          </div>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-[var(--border-color)] pb-4">
          {aiSimulatorProjects.map((proj) => {
            const isSelected = proj.id === selectedProject.id;
            return (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                type="button"
                className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold uppercase transition-all border ${
                  isSelected
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-[var(--text-main)]'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{proj.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Simulator Container */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 sm:p-6 shadow-sm">
          {/* Header bar */}
          <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono mb-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--text-main)]">Active Lab:</span>
              <span className="text-[var(--accent)] font-bold">{selectedProject.title}</span>
              <span className="text-[var(--border-color)]">·</span>
              <span className="text-[var(--text-muted)]">{selectedProject.categoryLabel}</span>
            </div>

            <div className="flex items-center gap-3">
              {selectedProject.demoUrl && (
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline font-bold flex items-center gap-1"
                >
                  <span>Live App / Bot</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-main)] hover:text-[var(--accent)] font-bold flex items-center gap-1 underline underline-offset-2"
              >
                <span>GitHub Source</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Render Active Simulator */}
          <ProjectSimulator project={selectedProject} />
        </div>
      </div>
    </section>
  );
};
