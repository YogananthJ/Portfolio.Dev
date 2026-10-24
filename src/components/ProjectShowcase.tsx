import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ProjectItem, ProjectCategory } from '../types/portfolio';
import { PROJECTS } from '../data/portfolioData';
import { ProjectCard } from './ProjectCard';
import { useLayout } from '../context/LayoutContext';
import { initScrollStagger } from '../utils/gsapAnimations';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Grid3X3, 
  Play, 
  Github, 
  ArrowUpRight,
  ExternalLink,
  Layers,
  Code
} from 'lucide-react';

interface ProjectShowcaseProps {
  onOpenModal: (project: ProjectItem) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onOpenModal }) => {
  const { viewMode, setViewMode, density } = useLayout();
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const categories: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: 'All Projects (10)' },
    { id: 'genai-agent', label: 'GenAI & Agents (4)' },
    { id: 'academic', label: 'Academic Coursework (4)' },
    { id: 'hackathon', label: 'Hackathon (1)' },
    { id: 'full-stack', label: 'Full-Stack Web (2)' },
    { id: 'computer-vision', label: 'Computer Vision (2)' },
  ];

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((proj) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        proj.category === selectedCategory ||
        proj.projectKind === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        proj.title.toLowerCase().includes(query) ||
        proj.description.toLowerCase().includes(query) ||
        proj.tags.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Trigger GSAP stagger animation on card elements
  useEffect(() => {
    if (gridContainerRef.current) {
      const cards = Array.from(gridContainerRef.current.querySelectorAll('.project-card-item')) as HTMLElement[];
      initScrollStagger(cards, 0.08);
    }
  }, [filteredProjects, viewMode]);

  // Spacing density classes
  const densityGapClass =
    density === 'compact' ? 'gap-4' : density === 'spacious' ? 'gap-10' : 'gap-6';
  const densityPadClass =
    density === 'compact' ? 'py-14' : density === 'spacious' ? 'py-28' : 'py-20';

  return (
    <section id="projects" className={`${densityPadClass} bg-[var(--bg-canvas)] border-t border-[var(--border-color)] relative transition-all`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-color)] mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 mb-3">
              <Code className="w-3.5 h-3.5" />
              Verified Codebases &amp; Prototypes
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text-main)]">
              Engineered Systems
            </h2>
          </div>

          {/* View Mode Toggle Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-[var(--bg-surface)] p-1 border border-[var(--border-color)]">
              <button
                onClick={() => setViewMode('grid')}
                type="button"
                className={`p-1.5 transition-colors ${
                  viewMode === 'grid' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                type="button"
                className={`p-1.5 transition-colors ${
                  viewMode === 'list' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
                title="Compact Table / List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('bento')}
                type="button"
                className={`p-1.5 transition-colors ${
                  viewMode === 'bento' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
                title="Editorial Bento View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            <p className="max-w-xs text-xs font-mono text-[var(--text-muted)] hidden lg:block">
              Showing {filteredProjects.length} projects · Layout: <span className="font-bold text-[var(--accent)] uppercase">{viewMode}</span>
            </p>
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Functional category segmented filter buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--bg-surface)] border border-[var(--border-color)]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                type="button"
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by tech (e.g. CrewAI, Llama, PyTorch)..."
              className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* --- VIEW MODE 1: STANDARD GRID VIEW --- */}
        {viewMode === 'grid' && (
          <div ref={gridContainerRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${densityGapClass}`}>
            {filteredProjects.map((project, index) => (
              <div key={project.id} className="project-card-item">
                <ProjectCard
                  project={project}
                  onOpenModal={onOpenModal}
                  index={index}
                />
              </div>
            ))}
          </div>
        )}

        {/* --- VIEW MODE 2: COMPACT LIST / LEDGER VIEW --- */}
        {viewMode === 'list' && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">System Title</th>
                  <th className="py-3 px-4">Taxonomy</th>
                  <th className="py-3 px-4">Key Metrics Context</th>
                  <th className="py-3 px-4">Tech Stack</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-main)]">
                {filteredProjects.map((proj, i) => (
                  <tr key={proj.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                    <td className="py-3 px-4 text-[var(--text-muted)]">0{i + 1}</td>
                    <td className="py-3 px-4 font-bold">
                      <div className="text-sm text-[var(--text-main)]">{proj.title}</div>
                      <div className="text-[11px] text-[var(--text-muted)] font-normal line-clamp-1">{proj.tagline}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[10px] uppercase font-bold text-[var(--accent)]">
                        {proj.projectKind}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {proj.metrics[0] && (
                        <div>
                          <span className="font-bold text-[var(--accent)]">{proj.metrics[0].value}</span>
                          <span className="text-[10px] text-[var(--text-muted)] block">{proj.metrics[0].label}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {proj.tags.slice(0, 3).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[10px] text-[var(--text-muted)]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-[var(--accent)] hover:underline font-bold"
                            title="Open Live App"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                          title="View Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => onOpenModal(proj)}
                          className="px-2 py-1 bg-[var(--bg-surface)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border-color)] font-bold transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VIEW MODE 3: BENTO VIEW --- */}
        {viewMode === 'bento' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => {
              const isLarge = index === 0 || index === 3;
              return (
                <div
                  key={project.id}
                  className={`project-card-item ${
                    isLarge ? 'md:col-span-2' : 'md:col-span-1'
                  }`}
                >
                  <ProjectCard
                    project={project}
                    onOpenModal={onOpenModal}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
