import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Menu, X, Columns2, PanelLeft, Volume2, VolumeX, FileText, Sun, Moon } from 'lucide-react';
import { useLayout } from '../context/LayoutContext';
import { soundFX } from '../utils/soundEffects';

interface HeaderProps {
  onOpenTerminal: () => void;
  onOpenResume?: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTerminal, onOpenResume, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { layoutMode, setLayoutMode, toggleSidebar, sidebarOpen, isDark, toggleTheme } = useLayout();

  const [soundActive, setSoundActive] = useState<boolean>(() => soundFX.getStatus());

  const handleToggleSound = () => {
    const next = soundFX.toggle();
    setSoundActive(next);
  };

  const navLinks = [
    { href: '#overview', label: 'Overview', id: 'overview' },
    { href: '#projects', label: 'Projects', id: 'projects' },
    { href: '#architecture', label: 'Architecture', id: 'architecture' },
    { href: '#simulators', label: 'AI Labs', id: 'simulators' },
    { href: '#motion-playground', label: 'Motion Lab', id: 'motion-playground' },
    { href: '#skills', label: 'Skills', id: 'skills' },
    { href: '#github-activity', label: 'GitHub', id: 'github-activity' },
    { href: '#experience', label: 'Milestones', id: 'experience' },
    { href: '#contact', label: 'Contact', id: 'contact' },
  ];

  const primaryNavLinks = navLinks.slice(0, 6);
  const secondaryNavLinks = navLinks.slice(6);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-canvas)]/95 backdrop-blur-md border-b border-[var(--border-color)] transition-colors w-full">
      <div className="max-w-[1720px] w-full mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        
        {/* Zone 1: Brand wordmark & Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleSidebar}
            type="button"
            aria-expanded={sidebarOpen}
            className={`p-1.5 border transition-colors cursor-pointer ${
              sidebarOpen
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--text-main)]'
            }`}
            title="Toggle Project Quick Directory Sidebar"
            aria-label="Toggle Directory Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <a
            href="#overview"
            className="group flex items-center gap-1.5 sm:gap-2 font-display text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-[var(--text-main)] whitespace-nowrap hover:text-[var(--accent)] transition-colors"
          >
            <span>YOGANANTH</span>
            <span className="w-2 h-2 bg-[var(--accent)] group-hover:scale-125 transition-transform"></span>
          </a>
        </div>

        {/* Zone 2: Navigation Links (Wide screens: all 9; Laptops: 6 primary + More dropdown; Tablet/Mobile: Drawer) */}
        {/* 2A. Wide desktop: full navigation strip (>= 1280px) */}
        <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-xs xl:text-[13px] font-semibold text-[var(--text-muted)] font-mono">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id && layoutMode === 'standard';
            return (
              <a
                key={link.id}
                href={link.href}
                aria-current={isActive ? 'location' : undefined}
                className={`whitespace-nowrap transition-colors py-1 relative ${
                  isActive
                    ? 'text-[var(--accent)] font-bold'
                    : 'hover:text-[var(--text-main)]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"></span>
                )}
              </a>
            );
          })}
        </nav>

        {/* 2B. Laptop desktop (1024px - 1279px): 6 primary links + sleek "More" dropdown */}
        <nav aria-label="Compact navigation" className="hidden lg:flex xl:hidden items-center gap-2.5 text-xs font-semibold text-[var(--text-muted)] font-mono">
          {primaryNavLinks.map((link) => {
            const isActive = activeSection === link.id && layoutMode === 'standard';
            return (
              <a
                key={link.id}
                href={link.href}
                aria-current={isActive ? 'location' : undefined}
                className={`whitespace-nowrap transition-colors py-1 relative ${
                  isActive
                    ? 'text-[var(--accent)] font-bold'
                    : 'hover:text-[var(--text-main)]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"></span>
                )}
              </a>
            );
          })}

          {/* "More" dropdown for secondary links */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setMoreMenuOpen((prev) => !prev)}
              type="button"
              aria-expanded={moreMenuOpen}
              aria-haspopup="menu"
              aria-controls="header-more-menu"
              className="px-2 py-1 flex items-center gap-1 hover:text-[var(--text-main)] transition-colors cursor-pointer"
            >
              <span>More</span>
              <span className="text-[10px]" aria-hidden="true">▾</span>
            </button>
            {moreMenuOpen && (
              <div 
                id="header-more-menu"
                role="menu"
                className="absolute top-full right-0 mt-1.5 w-36 bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl py-1 z-50 rounded-xs"
                onMouseLeave={() => setMoreMenuOpen(false)}
              >
                {secondaryNavLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setMoreMenuOpen(false)}
                    className="block px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Action Controls (Responsive cluster: Never clips!) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Split Screen Workbench Toggle (Icon on laptop/tablet, Text on wide screens) */}
          <button
            onClick={() => setLayoutMode(layoutMode === 'split' ? 'standard' : 'split')}
            type="button"
            aria-pressed={layoutMode === 'split'}
            aria-label="Toggle Dual-Pane Split Screen Workbench"
            className={`hidden sm:flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-mono font-bold uppercase border transition-colors whitespace-nowrap cursor-pointer ${
              layoutMode === 'split'
                ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--accent)]'
            }`}
            title="Toggle Dual-Pane Split Screen Workbench"
          >
            <Columns2 className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden xl:inline">{layoutMode === 'split' ? 'Exit Split' : 'Split View'}</span>
          </button>

          {/* Audio Synthesis Feedback Toggle */}
          <button
            onClick={handleToggleSound}
            type="button"
            aria-pressed={soundActive}
            className={`p-1.5 border transition-colors cursor-pointer ${
              soundActive
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
            }`}
            title={soundActive ? 'Procedural Sound: ACTIVE (Click to mute)' : 'Procedural Sound: MUTED (Click to activate audio)'}
            aria-label="Toggle procedural sound synthesis"
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Light / Dark Mode Toggle with Framer Motion Glassmorphism Cross-Fade */}
          <button
            onClick={() => {
              soundFX.playClick();
              toggleTheme();
            }}
            type="button"
            className="p-1.5 border transition-colors cursor-pointer bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-[var(--accent)]"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />}
          </button>

          {/* Terminal CLI Launcher */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenTerminal();
            }}
            type="button"
            className="hidden sm:flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-mono font-medium text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] transition-colors whitespace-nowrap cursor-pointer"
            title="Open Developer Console (Cmd+K)"
          >
            <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden xl:inline">CLI</span>
            <kbd className="hidden 2xl:inline-block px-1 py-0.5 text-[10px] bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]">⌘K</kbd>
          </button>

          {/* Resume Dossier Launcher (Always visible) */}
          {onOpenResume && (
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenResume();
              }}
              type="button"
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-mono font-bold uppercase text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-amber-400 transition-colors whitespace-nowrap cursor-pointer"
              title="View & Download Official Engineering Resume"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Resume</span>
            </button>
          )}

          {/* Contact Button (Always visible) */}
          <a
            href="#contact"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[var(--accent)] hover:opacity-90 transition-all whitespace-nowrap shadow-sm font-mono shrink-0 cursor-pointer"
          >
            <span>Contact</span>
            <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </a>

          {/* Mobile/Tablet Menu Hamburger Button (< 1024px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            className="flex lg:hidden p-1.5 sm:p-2 text-[var(--text-main)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Full Drawer Navigation Menu (< 1024px) */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Mobile navigation"
          className="lg:hidden border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-4 space-y-3 shadow-2xl font-mono animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pb-3 border-b border-[var(--border-color)]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id && layoutMode === 'standard';
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => {
                    setLayoutMode('standard');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-xs font-bold transition-colors rounded-xs ${
                    isActive
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTerminal();
              }}
              type="button"
              className="py-2.5 px-3 text-xs font-bold uppercase bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-center flex items-center justify-center gap-2 cursor-pointer flex-1"
            >
              <Terminal className="w-4 h-4 text-[var(--accent)]" />
              <span>Open Terminal (CLI)</span>
            </button>

            <button
              onClick={() => {
                setLayoutMode(layoutMode === 'split' ? 'standard' : 'split');
                setMobileMenuOpen(false);
              }}
              type="button"
              className="py-2.5 px-3 text-xs font-bold uppercase bg-[var(--accent)] text-white text-center flex items-center justify-center gap-2 cursor-pointer flex-1"
            >
              <Columns2 className="w-4 h-4" />
              <span>{layoutMode === 'split' ? 'Exit Split View' : 'Split-Screen Mode'}</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              type="button"
              className="py-2.5 px-3 text-xs font-bold uppercase bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-center flex items-center justify-center gap-2 cursor-pointer flex-1"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
