import React, { useEffect } from 'react';
import { X, Github, ArrowUpRight, CheckCircle2, ExternalLink, Info, Cpu } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[var(--bg-card)] border-2 border-[var(--border-color)] shadow-2xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--bg-surface)] text-[var(--text-main)] border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider bg-[var(--accent)] text-white">
              {project.categoryLabel}
            </span>
            <span className="text-[var(--text-muted)] font-mono text-xs">/</span>
            <span className="text-[var(--text-muted)] font-mono text-xs uppercase">{project.projectKind}</span>
            <span className="text-[var(--text-muted)] font-mono text-xs">/</span>
            <span className="text-[var(--text-muted)] font-mono text-xs">{project.year}</span>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto space-y-6">
          {/* Title & Tagline */}
          <div>
            <h2 id="modal-title" className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-main)] leading-tight mb-2 uppercase">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium">
              {project.tagline}
            </p>
          </div>

          {/* Metrics Strip with Context */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] font-mono">
            {project.metrics.map((m, i) => (
              <div key={i} className="text-left">
                <div className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">{m.label}</div>
                <div className="text-xl font-bold text-[var(--accent)] tabular-nums mt-0.5">{m.value}</div>
                {m.context && (
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{m.context}</div>
                )}
              </div>
            ))}
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-2">
              System Architecture &amp; Methodology
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed mb-4">
              {project.description}
            </p>
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-muted)] leading-relaxed">
              <strong className="text-[var(--text-main)] font-bold block mb-1">Architecture Overview:</strong>
              {project.architectureOverview}
            </div>
            {project.methodologyNote && (
              <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono">
                <strong>Evaluation &amp; Methodology Note:</strong> {project.methodologyNote}
              </div>
            )}
          </div>

          {/* Interactive Project Simulator Section (Only if project has AI simulator) */}
          {project.simulatorConfig.hasSimulator && (
            <div id="modal-simulator" className="border-t border-[var(--border-color)] pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-[var(--accent)]" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                  Interactive Model Simulator
                </h4>
              </div>
              <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4">
                <ProjectSimulator project={project} />
              </div>
            </div>
          )}

          {/* Key Achievements */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
              Technical Key Achievements
            </h4>
            <ul className="space-y-2">
              {project.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack tags */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Technologies &amp; Libraries
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 text-xs font-mono bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)]">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-6 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[var(--accent)] hover:opacity-90 transition-opacity"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Code</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-colors"
                >
                  <span>Open Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              Close Window [Esc]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
