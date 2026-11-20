import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ProjectItem, ProjectCategory } from '../types/portfolio';
import { PROJECTS } from '../data/portfolioData';
import { ProjectCard } from './ProjectCard';
import { useLayout } from '../context/LayoutContext';
import {
  clearSearchParam,
  getCurrentUrlParam,
  trackSearchQuery,
} from '../utils/urlActivityTracker';
import {
  Search,
  LayoutGrid,
  List,
  Grid3X3,
  Github,
  ArrowUpRight,
  ArrowRight,
  X,
  RotateCcw,
  Code,
} from 'lucide-react';

interface ProjectShowcaseProps {
  onOpenModal: (project: ProjectItem) => void;
}

function resolveInitialSearch(): string {
  const raw = getCurrentUrlParam('search');
  if (!raw) return '';
  return raw;
}

const CATEGORY_DEFS: { id: ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'genai-agent', label: 'GenAI & Agents' },
  { id: 'academic', label: 'Academic' },
  { id: 'hackathon', label: 'Hackathon' },
  { id: 'full-stack', label: 'Full-Stack' },
  { id: 'computer-vision', label: 'Vision' },
];

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onOpenModal }) => {
  const { viewMode, setViewMode, density } = useLayout();
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [searchQuery, setSearchQuery] = useState<string>(resolveInitialSearch);
  const searchDebounceRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        window.clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return PROJECTS.filter((proj) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        proj.category === selectedCategory ||
        proj.projectKind === selectedCategory;

      const matchesSearch =
        !query ||
        proj.title.toLowerCase().includes(query) ||
        proj.tagline.toLowerCase().includes(query) ||
        proj.description.toLowerCase().includes(query) ||
        proj.categoryLabel.toLowerCase().includes(query) ||
        proj.tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSearchChange = (nextVal: string) => {
    setSearchQuery(nextVal);
    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }
    if (!nextVal.trim()) {
      clearSearchParam();
    } else {
      searchDebounceRef.current = window.setTimeout(() => {
        trackSearchQuery(nextVal);
      }, 200);
    }
  };

  const handleClearSearch = () => {
    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }
    setSearchQuery('');
    clearSearchParam();
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    handleClearSearch();
  };

  const densityGapClass =
    density === 'compact' ? 'gap-4' : density === 'spacious' ? 'gap-9' : 'gap-6';
  const densityPadClass =
    density === 'compact' ? 'py-14' : density === 'spacious' ? 'py-28' : 'py-24';

  const getBentoColSpan = (idx: number, total: number): string => {
    if (total === 1) return 'md:col-span-2 lg:col-span-12';
    if (total === 2) return 'md:col-span-1 lg:col-span-6';
    if (idx === 0) return 'md:col-span-2 lg:col-span-7';
    if (idx === 1) return 'md:col-span-1 lg:col-span-5';
    if (idx === 2) return 'md:col-span-1 lg:col-span-5';
    if (idx === 3) return 'md:col-span-2 lg:col-span-7';
    return 'md:col-span-1 lg:col-span-4';
  };

  return (
    <section
      id="projects"
      className={`${densityPadClass} border-t border-[var(--border-color)] bg-[var(--bg-canvas)] relative`}
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        {/* Section Header matching website theme */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-color)] mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 mb-3">
              <Code className="w-3.5 h-3.5" />
              <span>Selected Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text-main)]">
              Projects Showcased
            </h2>
          </div>

          {/* Layout Mode Controls */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            </span>
            <div
              role="group"
              aria-label="Project layout view mode"
              className="inline-flex items-center gap-1 bg-[var(--bg-surface)] border border-[var(--border-color)] p-1 rounded-xs"
            >
              {[
                { id: 'grid' as const, label: 'Grid', icon: LayoutGrid },
                { id: 'bento' as const, label: 'Bento', icon: Grid3X3 },
                { id: 'list' as const, label: 'List', icon: List },
              ].map((mode) => {
                const Icon = mode.icon;
                const active = viewMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setViewMode(mode.id)}
                    aria-pressed={active}
                    aria-label={`${mode.label} view`}
                    title={`${mode.label} view`}
                    className={`p-1.5 transition-colors cursor-pointer rounded-xs ${
                      active
                        ? 'bg-[var(--accent)] text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
          <div
            role="group"
            aria-label="Filter projects by category"
            className="flex flex-wrap items-center gap-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] p-1 rounded-xs"
          >
            {CATEGORY_DEFS.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors cursor-pointer whitespace-nowrap shrink-0 rounded-xs ${
                    isSelected
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && searchQuery) {
                  handleClearSearch();
                }
              }}
              aria-label="Search projects by title or technology"
              placeholder="Search projects..."
              className="w-full pl-9 pr-8 py-2 text-xs font-mono bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] rounded-xs"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                type="button"
                aria-label="Clear project search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xs px-6 py-14 text-center">
            <p className="text-sm font-mono font-bold uppercase text-[var(--text-main)]">
              No projects match your current filter.
            </p>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1.5">
              Clear your search or switch back to all categories to view all builds.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors cursor-pointer rounded-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}

        {/* --- GRID VIEW (DEFAULT) --- */}
        {filteredProjects.length > 0 && viewMode === 'grid' && (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${densityGapClass}`}>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.95 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{
                  duration: 0.44,
                  ease: [0.22, 1, 0.36, 1],
                  delay: shouldReduceMotion ? 0 : (index % 3) * 0.06,
                }}
                className="h-full"
              >
                <ProjectCard
                  project={project}
                  onOpenModal={onOpenModal}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* --- BALANCED BENTO VIEW --- */}
        {filteredProjects.length > 0 && viewMode === 'bento' && (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 ${densityGapClass}`}>
            {filteredProjects.map((project, index) => {
              const colSpan = getBentoColSpan(index, filteredProjects.length);
              const isWide =
                filteredProjects.length === 1 ||
                filteredProjects.length === 2 ||
                index === 0 ||
                index === 3;
              return (
                <motion.div
                  key={project.id}
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, x: index % 2 === 0 ? -22 : 22, y: 12 }
                  }
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.08 }}
                  transition={{
                    duration: 0.46,
                    ease: [0.22, 1, 0.36, 1],
                    delay: shouldReduceMotion ? 0 : Math.min(index, 3) * 0.06,
                  }}
                  className={`h-full ${colSpan}`}
                >
                  <ProjectCard
                    project={project}
                    onOpenModal={onOpenModal}
                    index={index}
                    variant={isWide ? 'wide' : 'standard'}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* --- CLEAN LIST VIEW --- */}
        {filteredProjects.length > 0 && viewMode === 'list' && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xs divide-y divide-[var(--border-color)] overflow-hidden">
            {filteredProjects.map((proj, i) => (
              <motion.div
                key={proj.id}
                initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.36,
                  ease: [0.22, 1, 0.36, 1],
                  delay: shouldReduceMotion ? 0 : Math.min(i, 5) * 0.04,
                }}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-[var(--bg-surface)] transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <span className="text-xs font-mono font-bold text-[var(--accent)] tabular-nums pt-0.5 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                        <button
                          type="button"
                          onClick={() => onOpenModal(proj)}
                          className="text-left cursor-pointer focus-visible:outline-none"
                        >
                          {proj.title}
                        </button>
                      </h3>
                      {proj.demoUrl && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-1">
                      {proj.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 shrink-0 pl-8 sm:pl-0 font-mono text-xs">
                  <span className="text-[11px] text-[var(--text-muted)] hidden md:inline">
                    {proj.categoryLabel} · {proj.year}
                  </span>

                  <div className="flex items-center gap-2">
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-project-id={proj.id}
                        data-link-role="project_demo"
                        aria-label={`Open live demo for ${proj.title}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] font-bold transition-colors text-[11px] rounded-xs whitespace-nowrap shrink-0"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-project-id={proj.id}
                      data-link-role="project_repo"
                      aria-label={`View GitHub repository for ${proj.title}`}
                      title="View source on GitHub"
                      className="inline-flex items-center justify-center p-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors rounded-xs shrink-0"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => onOpenModal(proj)}
                      aria-label={`Explore ${proj.title}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--bg-surface)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border-color)] font-bold transition-colors text-[11px] rounded-xs cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
