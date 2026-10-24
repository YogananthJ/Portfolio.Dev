import React, { useState } from 'react';
import { useLayout } from '../context/LayoutContext';
import { 
  Columns2, 
  LayoutGrid, 
  List, 
  Grid3X3, 
  Maximize2, 
  Sliders, 
  Eye, 
  PanelLeftClose, 
  PanelLeft, 
  Layers,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const LayoutController: React.FC = () => {
  const {
    layoutMode,
    setLayoutMode,
    viewMode,
    setViewMode,
    density,
    setDensity,
    sidebarOpen,
    toggleSidebar,
    splitRatio,
    setSplitRatio,
  } = useLayout();

  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <aside
      aria-label="Layout & Workspace Controls"
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end"
    >
      {/* Expanded Controls Card */}
      {expanded && (
        <div className="mb-2 p-4 bg-[#121212] text-[#F5F2EB] border-2 border-[#121212] shadow-[6px_6px_0px_0px_#E11D48] w-72 sm:w-80 font-mono text-xs space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <span className="font-bold flex items-center gap-1.5 text-white">
              <Sliders className="w-3.5 h-3.5 text-[#E11D48]" />
              Workspace Controls
            </span>
            <span className="text-[10px] text-white/50">Layout Studio</span>
          </div>

          {/* 1. Layout Mode Switcher */}
          <div>
            <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1.5 font-bold">
              Layout Architecture
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setLayoutMode('standard')}
                type="button"
                className={`py-1.5 px-2 text-center border font-bold uppercase transition-colors flex items-center justify-center gap-1.5 ${
                  layoutMode === 'standard'
                    ? 'bg-[#E11D48] text-white border-[#E11D48]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Editorial Flow</span>
              </button>
              <button
                onClick={() => setLayoutMode('split')}
                type="button"
                className={`py-1.5 px-2 text-center border font-bold uppercase transition-colors flex items-center justify-center gap-1.5 ${
                  layoutMode === 'split'
                    ? 'bg-[#E11D48] text-white border-[#E11D48]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <Columns2 className="w-3 h-3" />
                <span>Split Workbench</span>
              </button>
            </div>
          </div>

          {/* 2. Split Ratio (Only visible if split mode active) */}
          {layoutMode === 'split' && (
            <div>
              <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1.5 font-bold">
                Split Screen Ratio
              </label>
              <div className="grid grid-cols-3 gap-1 text-center">
                {[
                  { ratio: 40, label: '40 / 60' },
                  { ratio: 50, label: '50 / 50' },
                  { ratio: 60, label: '60 / 40' },
                ].map((item) => (
                  <button
                    key={item.ratio}
                    onClick={() => setSplitRatio(item.ratio)}
                    type="button"
                    className={`py-1 border text-[11px] font-bold ${
                      splitRatio === item.ratio
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Project Display View Mode */}
          <div>
            <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1.5 font-bold">
              Project Display Format
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'grid', label: 'Grid', icon: LayoutGrid },
                { id: 'list', label: 'List', icon: List },
                { id: 'bento', label: 'Bento', icon: Grid3X3 },
              ].map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => setViewMode(view.id as any)}
                    type="button"
                    className={`py-1.5 border font-bold uppercase transition-colors flex items-center justify-center gap-1 ${
                      viewMode === view.id
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{view.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Density & Element Sizing */}
          <div>
            <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1.5 font-bold">
              Spacing Density
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  type="button"
                  className={`py-1 border text-[11px] font-bold capitalize ${
                    density === d
                      ? 'bg-[#E11D48] text-white border-[#E11D48]'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Sidebar Toggle */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-white/70 text-[11px]">Directory Sidebar:</span>
            <button
              onClick={toggleSidebar}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold border border-white/20 bg-white/5 hover:bg-white/20 text-white"
            >
              {sidebarOpen ? <PanelLeftClose className="w-3 h-3" /> : <PanelLeft className="w-3 h-3" />}
              <span>{sidebarOpen ? 'Hide' : 'Show'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <div className="flex items-center gap-2">
        {/* Quick layout toggle button */}
        <button
          onClick={() => setLayoutMode(layoutMode === 'split' ? 'standard' : 'split')}
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase bg-[#EBE6DC] text-[#121212] hover:bg-[#121212] hover:text-white border-2 border-[#121212] shadow-[3px_3px_0px_0px_#121212] transition-all"
          title="Toggle Split-Screen Workspace Mode"
        >
          <Columns2 className="w-3.5 h-3.5 text-[#E11D48]" />
          <span className="hidden sm:inline">
            {layoutMode === 'split' ? 'Exit Split View' : 'Split-Screen'}
          </span>
        </button>

        {/* Master Options Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          type="button"
          aria-expanded={expanded}
          aria-label="Toggle Layout Options Panel"
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold uppercase bg-[#121212] text-white hover:bg-[#E11D48] border-2 border-[#121212] shadow-[3px_3px_0px_0px_#121212] transition-all"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Layout Options</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  );
};
