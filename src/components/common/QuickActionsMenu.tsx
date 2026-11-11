import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Zap, 
  Sun, 
  Moon, 
  Laptop, 
  ChevronUp, 
  X, 
  ArrowUp, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Layers, 
  Cpu, 
  Code2, 
  GitBranch, 
  Award, 
  Mail, 
  Compass,
  Play
} from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';
import { soundFX } from '../../utils/soundEffects';

interface QuickActionsMenuProps {
  onOpenTerminal?: () => void;
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({ onOpenTerminal }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const {
    appearance,
    setAppearance,
    isDark,
    toggleTheme,
    layoutMode,
    setLayoutMode
  } = useLayout();

  const [soundActive, setSoundActive] = useState<boolean>(() => soundFX.getStatus());

  // Click outside listener to dismiss menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleToggleSound = () => {
    const next = soundFX.toggle();
    setSoundActive(next);
  };

  const handleJumpToSection = (sectionId: string) => {
    soundFX.playClick(880);
    // If user is currently in split workbench mode, switch to standard layout so section scrolling works properly
    if (layoutMode === 'split') {
      setLayoutMode('standard');
    }

    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'overview') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);

    setIsOpen(false);
  };

  const handleScrollTop = () => {
    soundFX.playClick(900);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const SECTIONS = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'architecture', label: 'Architecture', icon: GitBranch },
    { id: 'simulators', label: 'AI Labs', icon: Cpu },
    { id: 'motion-playground', label: 'Motion Lab', icon: Play },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'experience', label: 'Milestones', icon: Award },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <aside
      ref={menuRef}
      aria-label="Quick Actions Navigation & Preferences"
      className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-40 pointer-events-auto font-mono text-xs select-none"
    >
      {/* Expandable Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-[var(--bg-surface)] text-[var(--text-main)] border-2 border-[var(--border-color)] shadow-2xl p-4 origin-bottom-left max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 rounded-xs">
                  <Zap className="w-3.5 h-3.5" />
                </span>
                <div>
                  <div className="font-bold uppercase tracking-wider text-[var(--text-main)] text-xs">
                    Quick Actions
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    Fast Navigation &amp; Mode
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFX.playClick(600);
                  setIsOpen(false);
                }}
                type="button"
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                aria-label="Close Quick Actions menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Theme & Appearance Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  Appearance Mode
                </span>
                <span className="text-[10px] font-bold text-[var(--accent)] uppercase">
                  {appearance}
                </span>
              </div>

              {/* Quick 1-Click Toggle Banner */}
              <button
                onClick={() => {
                  soundFX.playClick();
                  toggleTheme();
                }}
                type="button"
                className="w-full mb-2 py-2 px-3 flex items-center justify-between border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent)] text-[var(--text-main)] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  {isDark ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-[var(--accent)] group-hover:-rotate-12 transition-transform" />
                  )}
                  <span className="font-bold text-[11px]">
                    {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                  Toggle
                </span>
              </button>

              {/* Segmented Mode Selector */}
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
                      onClick={() => {
                        soundFX.playClick();
                        setAppearance(item.id as any);
                      }}
                      type="button"
                      className={`py-1.5 px-2 text-center border font-bold uppercase transition-colors flex items-center justify-center gap-1 text-[10px] cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs'
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

            {/* 2. Jump to Top-Level Sections */}
            <div className="mb-4">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] mb-2">
                Jump to Section
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => handleJumpToSection(sec.id)}
                      type="button"
                      className="p-1.5 flex items-center gap-1.5 text-left border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-[var(--text-main)] transition-colors cursor-pointer rounded-xs"
                    >
                      <Icon className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                      <span className="truncate text-[11px] font-medium">{sec.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. System Utilities Strip */}
            <div className="pt-2.5 border-t border-[var(--border-color)] space-y-1.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] mb-1">
                System Utilities
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={handleScrollTop}
                  type="button"
                  className="py-1.5 px-2 flex items-center justify-center gap-1.5 border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer text-[10px] font-bold uppercase"
                >
                  <ArrowUp className="w-3 h-3 text-[var(--accent)]" />
                  <span>Top of Page</span>
                </button>

                <button
                  onClick={handleToggleSound}
                  type="button"
                  className="py-1.5 px-2 flex items-center justify-center gap-1.5 border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer text-[10px] font-bold uppercase"
                >
                  {soundActive ? <Volume2 className="w-3 h-3 text-emerald-400" /> : <VolumeX className="w-3 h-3 text-zinc-400" />}
                  <span>{soundActive ? 'Audio ON' : 'Audio OFF'}</span>
                </button>
              </div>

              {onOpenTerminal && (
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setIsOpen(false);
                    onOpenTerminal();
                  }}
                  type="button"
                  className="w-full py-1.5 px-2 flex items-center justify-between border border-zinc-700/60 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-[var(--accent)] transition-colors cursor-pointer text-[10px] font-mono mt-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-[var(--accent)]" />
                    <span>Terminal Console</span>
                  </span>
                  <span className="text-[9px] px-1 py-0.5 bg-white/10 rounded-xs text-white">
                    Cmd+K
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <button
        onClick={() => {
          soundFX.playClick(isOpen ? 650 : 850);
          setIsOpen(!isOpen);
        }}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Toggle Quick Actions menu"
        className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-[var(--bg-surface)] text-[var(--text-main)] border-2 transition-all shadow-md cursor-pointer ${
          isOpen
            ? 'border-[var(--accent)] ring-1 ring-[var(--accent)] text-[var(--accent)]'
            : 'border-[var(--border-color)] hover:border-[var(--accent)]'
        }`}
      >
        <Zap className={`w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-200 ${isOpen ? 'scale-110' : ''}`} />
        <span className="hidden sm:inline">Quick Actions</span>
        <span className="sm:hidden">Actions</span>
        <ChevronUp className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  );
};
