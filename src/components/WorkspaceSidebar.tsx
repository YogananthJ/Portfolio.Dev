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
      className="fixed top-16 left-0 bottom-0 z-30 w-72 sm:w-80 bg-[#EBE6DC] border-r-2 border-[#121212] shadow-[6px_0px_0px_0px_#121212] flex flex-col justify-between overflow-y-auto font-mono text-xs animate-in slide-in-from-left duration-200"
    >
      {/* Top Header */}
      <div>
        <div className="p-4 bg-[#121212] text-white flex items-center justify-between border-b-2 border-[#121212]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-pulse"></span>
            <span className="font-bold uppercase tracking-wider text-xs">Project Directory</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            type="button"
            className="text-white/60 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project List Quick Jump */}
        <div className="p-3 space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-[#121212]/50 px-2 py-1">
            7 Deployed Projects
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
                    ? 'bg-[#121212] text-white border-[#121212] shadow-[2px_2px_0px_0px_#E11D48]'
                    : 'bg-[#F5F2EB] text-[#121212] border-[#121212]/20 hover:bg-white hover:border-[#121212]'
                }`}
              >
                <div>
                  <div className="font-bold text-[11px] uppercase tracking-tight flex items-center gap-1.5">
                    <span className={isSelected ? 'text-[#E11D48]' : 'text-[#121212]/50'}>0{idx + 1}.</span>
                    <span>{p.title}</span>
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#121212]/60'}`}>
                    {p.categoryLabel} · {p.metrics[0].value}
                  </div>
                </div>
                <Play className={`w-3 h-3 shrink-0 mt-1 ${isSelected ? 'text-[#E11D48] fill-current' : 'text-[#121212]/40'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 bg-[#F5F2EB] border-t-2 border-[#121212] space-y-2">
        <button
          onClick={() => setLayoutMode('split')}
          type="button"
          className="w-full py-2 px-3 text-center bg-[#E11D48] text-white font-bold uppercase tracking-wider text-[11px] shadow-[2px_2px_0px_0px_#121212] hover:bg-[#F20D26] transition-colors"
        >
          Open Dual-Pane Workbench
        </button>

        <div className="pt-2 text-[10px] text-[#121212]/60 text-center">
          Yogananth J · Available 2026
        </div>
      </div>
    </aside>
  );
};
