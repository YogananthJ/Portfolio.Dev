import React, { useState } from 'react';
import { useLayout } from '../context/LayoutContext';
import { 
  Columns2, 
  LayoutGrid, 
  List, 
  Grid3X3, 
  Sliders, 
  PanelLeftClose, 
  PanelLeft, 
  Layers,
  ChevronDown,
  Sun,
  Moon,
  Laptop,
  Palette
} from 'lucide-react';
import { AccentTheme } from '../types/layout';

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
    appearance,
    setAppearance,
    accentTheme,
    setAccentTheme,
  } = useLayout();

  const [expanded, setExpanded] = useState<boolean>(false);

  const ACCENT_OPTIONS: { id: AccentTheme; label: string; bg: string }[] = [
    { id: 'signal-red', label: 'Signal Red', bg: '#E11D48' },
    { id: 'electric-blue', label: 'Electric Blue', bg: '#2563EB' },
    { id: 'forest-green', label: 'Forest Green', bg: '#059669' },
    { id: 'violet', label: 'Violet', bg: '#7C3AED' },
  ];

  return (
    <aside
      aria-label="Layout & Workspace Controls"
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end"
    >
      {/* Expanded Controls Card */}
      {expanded && (
        <div className="mb-2 p-4 bg-[var(--bg-surface)] text-[var(--text-main)] border-2 border-[var(--border-color)] shadow-xl w-72 sm:w-80 font-mono text-xs space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
            <span className="font-bold flex items-center gap-1.5 text-[var(--text-main)] uppercase tracking-wide">
              <Sliders className="w-3.5 h-3.5 text-[var(--accent)]" />
              Workspace Controls
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Layout Studio</span>
          </div>

          {/* 1. Appearance Mode (Light / Dark / System) */}
          <div>
            <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1.5 font-bold">
              Theme &amp; Appearance
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Laptop },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = appearance === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAppearance(item.id as any)}
                    type="button"
                    className={`py-1.5 px-2 text-center border font-bold uppercase transition-colors flex items-center justify-center gap-1 text-[11px] ${
                      isSelected
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-[var(--text-main)]'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Color Accent Palettes */}
          <div>
            <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1.5 font-bold flex items-center gap-1">
              <Palette className="w-3 h-3 text-[var(--accent)]" />
              Accent Palette
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {ACCENT_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAccentTheme(item.id)}
                  type="button"
                  className={`flex items-center gap-2 p-1.5 border text-[11px] font-mono text-left transition-all ${
                    accentTheme === item.id
                      ? 'border-[var(--text-main)] bg-[var(--bg-card)] ring-1 ring-[var(--accent)] font-bold'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:border-[var(--text-main)]'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.bg }}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Layout Mode Switcher */}
          <div>
            <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1.5 font-bold">
              Layout Architecture
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setLayoutMode('standard')}
                type="button"
                className={`py-1.5 px-2 text-center border font-bold uppercase transition-colors flex items-center justify-center gap-1.5 ${
                  layoutMode === 'standard'
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-[var(--text-main)]'
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
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-[var(--text-main)]'
                }`}
              >
                <Columns2 className="w-3 h-3" />
                <span>Split Workbench</span>
              </button>
            </div>
          </div>

          {/* 4. Split Ratio (Only visible if split mode active) */}
          {layoutMode === 'split' && (
            <div>
              <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1.5 font-bold">
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
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--text-main)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Project Display View Mode */}
          <div>
            <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1.5 font-bold">
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
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-[var(--text-main)]'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{view.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Spacing Density */}
          <div>
            <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1.5 font-bold">
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
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--text-main)]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Directory Sidebar Toggle */}
          <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
            <span className="text-[var(--text-muted)] text-[11px]">Directory Sidebar:</span>
            <button
              onClick={toggleSidebar}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-canvas)] text-[var(--text-main)]"
            >
              {sidebarOpen ? <PanelLeftClose className="w-3 h-3" /> : <PanelLeft className="w-3 h-3" />}
              <span>{sidebarOpen ? 'Hide' : 'Show'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Bar */}
      <div className="flex items-center gap-2">
        {/* Quick layout toggle button */}
        <button
          onClick={() => setLayoutMode(layoutMode === 'split' ? 'standard' : 'split')}
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-surface)] border-2 border-[var(--border-color)] shadow-md transition-all"
          title="Toggle Split-Screen Workspace Mode"
        >
          <Columns2 className="w-3.5 h-3.5 text-[var(--accent)]" />
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
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold uppercase bg-[var(--bg-surface)] text-[var(--text-main)] hover:border-[var(--accent)] border-2 border-[var(--border-color)] shadow-md transition-all"
        >
          <Sliders className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Layout Options</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  );
};
