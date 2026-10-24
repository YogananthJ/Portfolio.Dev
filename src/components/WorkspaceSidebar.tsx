import React from 'react';
import { useLayout } from '../context/LayoutContext';
import { PROJECTS } from '../data/portfolioData';
import { X, Play, Code2, Layers, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface WorkspaceSidebarProps {
  onSelectProject: (projectId: string) => void;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({ onSelectProject }) => {
  const { sidebarOpen, setSidebarOpen, activeSimulatorId, setActiveSimulatorId, setLayoutMode } = useLayout();

  if (!sidebarOpen) return null;

  return (
    <aside
      aria-label="Workspace Quick-Jump Navigator"
      className="fixed top-16 left-0 bottom-0 z-30 w-72 sm:w-80 bg-[var(--bg-surface)] border-r border-[var(--border-color)] shadow-xl flex flex-col justify-between overflow-y-auto font-mono text-xs animate-in slide-in-from-left duration-200"
    >
      {/* Top Header */}
      <div>
        <div className="p-4 bg-[var(--bg-card)] text-[var(--text-main)] flex items-center justify-between border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
            <span className="font-bold uppercase tracking-wider text-xs">Project Directory</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            type="button"
            className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project List Quick Jump */}
        <div className="p-3 space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] px-2 py-1">
            10 Verified Projects
          </div>
          {PROJECTS.map((p, idx) => {
            const isSelected = activeSimulatorId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActiveSimulatorId(p.id);
                  onSelectProject(p.id);
                }}
                type="button"
                className={`w-full text-left p-2.5 border transition-all flex items-start justify-between gap-2 ${
                  isSelected
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                    : 'bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--text-main)]'
                }`}
              >
                <div>
                  <div className="font-bold text-[11px] uppercase tracking-tight flex items-center gap-1.5">
                    <span className={isSelected ? 'text-white/80' : 'text-[var(--accent)]'}>0{idx + 1}.</span>
                    <span>{p.title}</span>
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                    {p.categoryLabel} · {p.metrics[0].value}
                  </div>
                </div>
                <Play className={`w-3 h-3 shrink-0 mt-1 ${isSelected ? 'text-white fill-current' : 'text-[var(--text-muted)]'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border-color)] space-y-2">
        <button
          onClick={() => setLayoutMode('split')}
          type="button"
          className="w-full py-2 px-3 text-center bg-[var(--accent)] text-white font-bold uppercase tracking-wider text-[11px] hover:opacity-90 transition-opacity"
        >
          Open Dual-Pane Workbench
        </button>

        <div className="pt-2 text-[10px] text-[var(--text-muted)] text-center">
          Yogananth J · Aspiring AI Engineer
        </div>
      </div>
    </aside>
  );
};
