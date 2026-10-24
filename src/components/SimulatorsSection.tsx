import React, { useState } from 'react';
import { PROJECTS } from '../data/portfolioData';
import { ProjectSimulator } from './ProjectSimulator';
import { Play, Sparkles, Terminal, ArrowUpRight } from 'lucide-react';

export const SimulatorsSection: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('loan-approval');

  const selectedProject = PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0];

  return (
    <section id="simulators" className="py-20 sm:py-28 bg-[#121212] text-[#F5F2EB] border-b-2 border-[#121212] relative overflow-hidden paper-grid-dark">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/15 mb-10">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-[#E11D48] uppercase mb-2">
              02 — Live Interactive Lab &amp; Sandboxes
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
              Model Simulators
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/70 font-medium">
            Test and interact directly with algorithms, computer vision pipelines, underwriting parameters, and NLP cadence evaluators in real-time.
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          {PROJECTS.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                type="button"
                className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold uppercase transition-all border ${
                  isSelected
                    ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-[2px_2px_0px_0px_#ffffff]'
                    : 'bg-[#1C1C1E] text-white/75 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{proj.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Simulator Container */}
        <div className="bg-[#F5F2EB] text-[#121212] p-2 sm:p-4 rounded-xs border-2 border-white/20 shadow-[6px_6px_0px_0px_#E11D48]">
          <div className="p-3 bg-[#EBE6DC] border border-[#121212]/15 flex flex-wrap items-center justify-between gap-3 text-xs font-mono mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#121212]">Active Model:</span>
              <span className="text-[#E11D48] font-bold">{selectedProject.title}</span>
              <span className="text-[#121212]/40">·</span>
              <span className="text-[#121212]/75">{selectedProject.categoryLabel}</span>
            </div>
            <a
              href={selectedProject.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#121212] hover:text-[#E11D48] font-bold flex items-center gap-1 underline underline-offset-2"
            >
              <span>GitHub Repo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <ProjectSimulator project={selectedProject} />
        </div>
      </div>
    </section>
  );
};
