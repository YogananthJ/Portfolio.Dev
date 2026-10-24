import React, { useEffect } from 'react';
import { X, Github, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ProjectItem } from '../types/portfolio';
import { ProjectSimulator } from './ProjectSimulator';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#F5F2EB] border-2 border-[#121212] shadow-[8px_8px_0px_0px_#121212] my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#121212] text-white border-b-2 border-[#121212]">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider bg-[#E11D48] text-white">
              {project.categoryLabel}
            </span>
            <span className="text-white/40 font-mono text-xs">/</span>
            <span className="text-white/80 font-mono text-xs">{project.year}</span>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1 text-white hover:text-[#E11D48] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto space-y-8">
          {/* Title & Tagline */}
          <div>
            <h2 id="modal-title" className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#121212] leading-tight mb-2 uppercase">
              {project.title}
            </h2>
            <p className="text-base sm:text-lg text-[#121212]/80 font-medium">
              {project.tagline}
            </p>
          </div>

          {/* Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#EBE6DC] border border-[#121212]/20 font-mono">
            {project.metrics.map((m, i) => (
              <div key={i} className="text-center sm:text-left">
                <div className="text-[11px] uppercase tracking-wider text-[#121212]/60 font-semibold">{m.label}</div>
                <div className="font-display text-xl sm:text-2xl font-black text-[#121212] tabular-nums mt-0.5">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#E11D48] mb-2">
              System Architecture &amp; Methodology
            </h4>
            <p className="text-sm sm:text-base text-[#121212]/85 leading-relaxed mb-4">
              {project.description}
            </p>
            <div className="p-4 bg-white/60 border border-[#121212]/15 text-xs font-mono text-[#121212]/80 leading-relaxed">
              <strong className="text-[#121212] font-bold block mb-1">Architecture Overview:</strong>
              {project.architectureOverview}
            </div>
          </div>

          {/* Interactive Project Simulator Section */}
          <div id="modal-simulator">
            <ProjectSimulator project={project} />
          </div>

          {/* Engineering Highlights */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#E11D48] mb-3">
              Technical Key Achievements
            </h4>
            <ul className="space-y-2">
              {project.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#121212]/80 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack tags */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#121212]/60 mb-2">
              Technologies &amp; Libraries
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 text-xs font-mono font-semibold bg-[#EBE6DC] text-[#121212] border border-[#121212]/20">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-6 border-t border-[#121212]/15 flex flex-wrap items-center justify-between gap-4">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#121212] hover:bg-[#E11D48] transition-colors shadow-[3px_3px_0px_0px_#121212]"
            >
              <Github className="w-4 h-4" />
              <span>Inspect Code Repository</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[#121212] hover:bg-[#EBE6DC] border border-[#121212]/30 transition-colors"
            >
              Close Window [Esc]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
