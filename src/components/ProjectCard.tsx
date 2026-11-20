import React from 'react';
import { Github, ArrowUpRight, ArrowRight } from 'lucide-react';
import { ProjectItem } from '../types/portfolio';

export interface ProjectCardProps {
  project: ProjectItem;
  onOpenModal: (project: ProjectItem) => void;
  index: number;
  variant?: 'standard' | 'wide';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenModal,
  index,
  variant = 'standard',
}) => {
  const formattedIndex = String(index + 1).padStart(2, '0');
  const isWide = variant === 'wide';

  return (
    <article className="project-card-item group relative flex flex-col justify-between h-full bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm hover:border-[var(--accent)] transition-all duration-200 rounded-xs overflow-hidden">
      {/* Accent hover bar at top */}
      <div
        className="h-0.5 w-full bg-[var(--border-color)] group-hover:bg-[var(--accent)] transition-colors duration-200"
        aria-hidden="true"
      />

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Uncluttered Metadata Line */}
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[var(--text-muted)] mb-3">
            <span className="uppercase tracking-wider tabular-nums">
              <span className="text-[var(--accent)] font-bold mr-2">{formattedIndex}</span>
              <span>{project.categoryLabel}</span>
              <span className="mx-1.5 opacity-50">·</span>
              <span>{project.year}</span>
            </span>

            {project.demoUrl && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Live
              </span>
            )}
          </div>

          {/* Title (stretched button opens full details modal) */}
          <h3
            className={`font-bold text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors leading-snug ${
              isWide ? 'text-xl sm:text-2xl' : 'text-lg'
            }`}
          >
            <button
              type="button"
              onClick={() => onOpenModal(project)}
              className="text-left cursor-pointer focus-visible:outline-none"
            >
              <span className="absolute inset-0 z-0" aria-hidden="true" />
              {project.title}
            </button>
          </h3>

          {/* Concise Tagline */}
          <p
            className={`text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mt-2 ${
              isWide ? 'line-clamp-2 max-w-2xl' : 'line-clamp-2'
            }`}
          >
            {project.tagline}
          </p>
        </div>

        {/* Bottom Stack & Actions */}
        <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
          <p className="text-[11px] font-mono text-[var(--text-muted)] truncate mb-4">
            {project.tags.slice(0, isWide ? 4 : 3).join(' · ')}
          </p>

          <div className="relative z-10 flex items-center justify-between gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => onOpenModal(project)}
              className="inline-flex items-center gap-1.5 font-bold text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            <div className="flex items-center gap-2">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-project-id={project.id}
                  data-link-role="project_demo"
                  aria-label={`Open live demo for ${project.title}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] font-bold transition-colors text-[11px] rounded-xs whitespace-nowrap shrink-0"
                >
                  <span>Live Demo</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-project-id={project.id}
                data-link-role="project_repo"
                aria-label={`View GitHub repository for ${project.title}`}
                title="View source on GitHub"
                className="inline-flex items-center justify-center p-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors rounded-xs shrink-0"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
