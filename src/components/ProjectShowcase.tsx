import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ProjectItem, ProjectCategory } from '../types/portfolio';
import { PROJECTS } from '../data/portfolioData';
import { ProjectCard } from './ProjectCard';
import { useLayout } from '../context/LayoutContext';
import { initScrollStagger } from '../utils/gsapAnimations';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Grid3X3, 
  Play, 
  Github, 
  ArrowUpRight,
  Activity,
  Layers
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
    { id: 'all', label: 'All Projects (7)' },
    { id: 'machine-learning', label: 'Machine Learning' },
    { id: 'computer-vision', label: 'Computer Vision' },
    { id: 'full-stack', label: 'Full-Stack Web' },
    { id: 'data-analytics', label: 'Data Analytics' },
    { id: 'genai-nlp', label: 'Generative AI & NLP' },
  ];

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((proj) => {
      const matchesCategory =
        selectedCategory === 'all' || proj.category === selectedCategory;
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
      initScrollStagger(cards, 0.1);
    }
  }, [filteredProjects, viewMode]);

  // Spacing density classes
  const densityGapClass =
    density === 'compact' ? 'gap-4' : density === 'spacious' ? 'gap-10' : 'gap-6 sm:gap-8';
  const densityPadClass =
    density === 'compact' ? 'py-14 sm:py-20' : density === 'spacious' ? 'py-28 sm:py-36' : 'py-20 sm:py-28';

  return (
    <section id="projects" className={`${densityPadClass} bg-[#F5F2EB] border-b-2 border-[#121212] relative transition-all`}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#121212] mb-10">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-[#E11D48] uppercase mb-2">
              01 — Selected Works &amp; Applications
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#121212]">
              Engineered Systems
            </h2>
          </div>

          {/* View Mode Toggle Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-[#EBE6DC] p-1 border border-[#121212]/20">
              <button
                onClick={() => setViewMode('grid')}
                type="button"
                className={`p-1.5 transition-colors ${
                  viewMode === 'grid' ? 'bg-[#121212] text-white' : 'text-[#121212]/70 hover:text-[#121212]'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                type="button"
                className={`p-1.5 transition-colors ${
                  viewMode === 'list' ? 'bg-[#121212] text-white' : 'text-[#121212]/70 hover:text-[#121212]'
                }`}
                title="Compact Table / List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('bento')}
                type="button"
                className={`p-1.5 transition-colors ${
                  viewMode === 'bento' ? 'bg-[#121212] text-white' : 'text-[#121212]/70 hover:text-[#121212]'
                }`}
                title="Editorial Bento View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            <p className="max-w-xs text-xs font-mono text-[#121212]/60 hidden lg:block">
              Showing {filteredProjects.length} projects · Layout: <span className="font-bold text-[#E11D48] uppercase">{viewMode}</span>
            </p>
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Functional category segmented filter buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EBE6DC] border border-[#121212]/20 rounded-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                type="button"
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors rounded-xs whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#121212] text-white shadow-xs'
                    : 'text-[#121212]/70 hover:text-[#121212] hover:bg-white/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by tech (e.g. XGBoost, PyTorch, React)..."
              className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-white border border-[#121212]/30 text-[#121212] placeholder:text-[#121212]/40 focus:outline-[#E11D48]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#121212]/50 hover:text-[#121212]"
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
          <div ref={gridContainerRef} className="bg-[#EBE6DC] border-2 border-[#121212] shadow-[6px_6px_0px_0px_#121212] overflow-x-auto font-mono">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#121212] text-white border-b-2 border-[#121212] text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">System Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Key Benchmark Metric</th>
                  <th className="py-3 px-4">Core Tech Stack</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#121212]/15">
                {filteredProjects.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="project-card-item hover:bg-white/60 transition-colors cursor-pointer"
                    onClick={() => onOpenModal(p)}
                  >
                    <td className="py-3.5 px-4 font-bold text-[#E11D48]">0{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-display text-sm font-black text-[#121212] uppercase tracking-tight">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-[#121212]/60 line-clamp-1">{p.tagline}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#121212]">{p.categoryLabel}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-800 tabular-nums">
                        {p.metrics[0].label}: {p.metrics[0].value}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 text-[10px] text-[#121212]/70">
                        {p.tags.slice(0, 3).join(' · ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onOpenModal(p)}
                          type="button"
                          className="px-2.5 py-1 text-[11px] font-bold uppercase bg-[#121212] text-white hover:bg-[#E11D48] transition-colors flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Simulator</span>
                        </button>
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 border border-[#121212]/30 hover:bg-white text-[#121212] transition-colors"
                          title="View Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VIEW MODE 3: ASYMMETRIC BENTO GRID --- */}
        {viewMode === 'bento' && (
          <div ref={gridContainerRef} className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {filteredProjects.map((project, index) => {
              // Asymmetric bento span logic
              const isLarge = index === 0 || index === 3;
              return (
                <div
                  key={project.id}
                  className={`project-card-item ${isLarge ? 'md:col-span-7' : 'md:col-span-5'}`}
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

        {/* Empty Search State */}
        {filteredProjects.length === 0 && (
          <div className="p-12 text-center bg-[#EBE6DC] border-2 border-dashed border-[#121212]/20">
            <SlidersHorizontal className="w-8 h-8 text-[#121212]/40 mx-auto mb-3" />
            <div className="font-display text-lg font-bold text-[#121212] uppercase mb-1">
              No matching projects found
            </div>
            <p className="text-xs font-mono text-[#121212]/60 mb-4">
              Try adjusting your search criteria or reset filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              type="button"
              className="px-4 py-2 text-xs font-mono font-bold uppercase bg-[#121212] text-white hover:bg-[#E11D48] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
