import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Menu, X, Columns2, PanelLeft, Volume2, VolumeX, FileText, Sun, Moon } from 'lucide-react';
import { useLayout } from '../context/LayoutContext';
import { soundFX } from '../utils/soundEffects';
import { ExpandableIconButton, ExpandableIconLink } from './common/ExpandableIconButton';
import { trackSectionNavigation } from '../utils/urlActivityTracker';

interface HeaderProps {
  onOpenTerminal: () => void;
  onOpenResume?: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTerminal,
  onOpenResume,
  onNavigateSection,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { layoutMode, setLayoutMode, toggleSidebar, sidebarOpen, isDark, toggleTheme } = useLayout();

  const [soundActive, setSoundActive] = useState<boolean>(() => soundFX.getStatus());

  const handleToggleSound = () => {
    const next = soundFX.toggle();
    setSoundActive(next);
  };

  const navLinks = [
    { href: '?section=home', label: 'Overview', id: 'overview' },
    { href: '?section=projects', label: 'Projects', id: 'projects' },
    { href: '?section=skills', label: 'Skills', id: 'skills' },
    { href: '?section=github-activity', label: 'GitHub', id: 'github-activity' },
    { href: '?section=experience', label: 'Milestones', id: 'experience' },
    { href: '?section=contact', label: 'Contact', id: 'contact' },
  ];

  const primaryNavLinks = navLinks.slice(0, 6);
  const secondaryNavLinks = navLinks.slice(6);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileDrawerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreMenuOpen(false);
        if (mobileMenuOpen) {
          const focusWasInDrawer = mobileDrawerRef.current?.contains(document.activeElement);
          setMobileMenuOpen(false);
          if (focusWasInDrawer) {
            window.requestAnimationFrame(() => {
              mobileMenuBtnRef.current?.focus();
            });
          }
        }
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
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string, closeMenus = false) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      onNavigateSection(sectionId);
      if (closeMenus) {
        setMoreMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-canvas)]/95 backdrop-blur-md border-b border-[var(--border-color)] transition-colors w-full">
      <div className="max-w-[1720px] w-full mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        
        {/* Zone 1: Brand wordmark & Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <button
            id="directory-sidebar-toggle"
            onClick={toggleSidebar}
            type="button"
            aria-expanded={sidebarOpen}
            className={`h-10 w-10 sm:h-8 sm:w-8 flex items-center justify-center border transition-all duration-150 active:scale-95 cursor-pointer shrink-0 ${
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
            href="?section=home"
            onClick={(e) => handleNavClick(e, 'overview')}
            className="group flex items-center gap-1.5 sm:gap-2 font-display text-base sm:text-xl lg:text-2xl font-black tracking-tight text-[var(--text-main)] whitespace-nowrap hover:text-[var(--accent)] transition-colors"
          >
            <span>YOGANANTH</span>
            <span className="w-2 h-2 bg-[var(--accent)] group-hover:scale-125 transition-transform shrink-0"></span>
          </a>
        </div>

        {/* Zone 2: Navigation Links (Wide desktop >= 1280px; Compact 1024px-1279px; Drawer < 1024px) */}
        <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-xs xl:text-[13px] font-semibold text-[var(--text-muted)] font-mono">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id && layoutMode === 'standard';
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
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

        <nav aria-label="Compact navigation" className="hidden lg:flex xl:hidden items-center gap-2.5 text-xs font-semibold text-[var(--text-muted)] font-mono">
          {primaryNavLinks.map((link) => {
            const isActive = activeSection === link.id && layoutMode === 'standard';
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
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

          {secondaryNavLinks.length > 0 && (
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
                      onClick={(e) => handleNavClick(e, link.id, true)}
                      className="block px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Zone 3: Compact Expandable Icon Toolbar (Secondary tools collapse into mobile drawer on narrow widths) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 1. Split Screen Workbench Toggle */}
          <ExpandableIconButton
            variant="header"
            onClick={() => setLayoutMode(layoutMode === 'split' ? 'standard' : 'split')}
            aria-pressed={layoutMode === 'split'}
            aria-label={
              layoutMode === 'split'
                ? 'Exit Dual-Pane Split Screen Workbench'
                : 'Toggle Dual-Pane Split Screen Workbench'
            }
            title="Toggle Dual-Pane Split Screen Workbench"
            className={`hidden sm:inline-flex text-xs font-mono font-bold uppercase border cursor-pointer ${
              layoutMode === 'split'
                ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--accent)]'
            }`}
            icon={
              <Columns2
                className={`w-3.5 h-3.5 shrink-0 ${
                  layoutMode === 'split' ? 'text-white' : 'text-[var(--accent)]'
                }`}
              />
            }
            label={<span>{layoutMode === 'split' ? 'Exit Split' : 'Split View'}</span>}
          />

          {/* 2. Audio Synthesis Feedback Toggle (hidden < sm, available inside mobile drawer) */}
          <ExpandableIconButton
            variant="header"
            onClick={handleToggleSound}
            aria-pressed={soundActive}
            title={
              soundActive
                ? 'Procedural Sound: ACTIVE (Click to mute)'
                : 'Procedural Sound: MUTED (Click to activate audio)'
            }
            aria-label={
              soundActive
                ? 'Mute procedural sound synthesis'
                : 'Enable procedural sound synthesis'
            }
            className={`hidden sm:inline-flex text-xs font-mono font-bold uppercase border cursor-pointer ${
              soundActive
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-[var(--accent)]'
            }`}
            icon={
              soundActive ? (
                <Volume2 className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 shrink-0" />
              )
            }
            label={<span>{soundActive ? 'Sound On' : 'Muted'}</span>}
          />

          {/* 3. Light / Dark Mode Toggle (hidden < sm, available inside mobile drawer) */}
          <ExpandableIconButton
            variant="header"
            onClick={() => {
              soundFX.playClick();
              toggleTheme();
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="hidden sm:inline-flex text-xs font-mono font-bold uppercase border cursor-pointer bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-[var(--accent)]"
            icon={
              isDark ? (
                <Sun className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 shrink-0 text-[var(--text-main)]" />
              )
            }
            label={<span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          />

          {/* 4. Terminal CLI Launcher */}
          <ExpandableIconButton
            variant="header"
            onClick={() => {
              soundFX.playClick();
              onOpenTerminal();
            }}
            aria-label="Open Developer Terminal Console (Cmd+K)"
            title="Open Developer Console (Cmd+K)"
            className="hidden sm:inline-flex text-xs font-mono font-bold uppercase text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] cursor-pointer"
            icon={<Terminal className="w-3.5 h-3.5 shrink-0 text-[var(--accent)]" />}
            label={
              <>
                <span>Terminal</span>
                <kbd className="hidden xl:inline-block px-1 py-0.5 text-[9px] leading-none bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]">
                  ⌘K
                </kbd>
              </>
            }
          />

          {/* 5. Resume Dossier Launcher (shown >= 420px in top bar, always inside mobile drawer) */}
          {onOpenResume && (
            <ExpandableIconButton
              variant="header"
              onClick={() => {
                soundFX.playClick();
                onOpenResume();
              }}
              aria-label="View & Download Official Engineering Resume"
              title="View & Download Official Engineering Resume"
              className="hidden min-[420px]:inline-flex text-xs font-mono font-bold uppercase text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-amber-400 cursor-pointer"
              icon={<FileText className="w-3.5 h-3.5 shrink-0 text-amber-400" />}
              label={<span>Resume</span>}
            />
          )}

          {/* 6. Contact Button (shown >= 380px in top bar, always inside mobile drawer) */}
          <ExpandableIconLink
            variant="header"
            href="?section=contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            aria-label="Contact Yogananth J"
            title="Jump to Contact Section"
            className="hidden min-[380px]:inline-flex text-xs font-bold uppercase tracking-wider text-white bg-[var(--accent)] border border-[var(--accent)] hover:opacity-90 shadow-sm font-mono cursor-pointer"
            icon={<Send className="w-3.5 h-3.5 shrink-0" />}
            label={<span>Contact</span>}
          />

          {/* Mobile/Tablet Menu Hamburger Button (< 1024px) — always visible with reserved space */}
          <button
            ref={mobileMenuBtnRef}
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            className="flex lg:hidden h-11 w-11 items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] transition-all duration-150 active:scale-95 cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Full Drawer Navigation Menu (< 1024px) */}
      {mobileMenuOpen && (
        <nav
          ref={mobileDrawerRef}
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
                  onClick={(e) => handleNavClick(e, link.id, true)}
                  aria-current={isActive ? 'location' : undefined}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {onOpenResume && (
              <button
                onClick={() => {
                  soundFX.playClick();
                  mobileMenuBtnRef.current?.focus({ preventScroll: true });
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                type="button"
                className="py-2.5 px-3 text-xs font-bold uppercase bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-center flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-[0.97]"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Resume / CV</span>
              </button>
            )}

            <button
              onClick={() => {
                mobileMenuBtnRef.current?.focus({ preventScroll: true });
                setMobileMenuOpen(false);
                onOpenTerminal();
              }}
              type="button"
              className="py-2.5 px-3 text-xs font-bold uppercase bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-center flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-[0.97]"
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
              className="py-2.5 px-3 text-xs font-bold uppercase bg-[var(--accent)] text-white text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <Columns2 className="w-4 h-4" />
              <span>{layoutMode === 'split' ? 'Exit Split View' : 'Split-Screen Mode'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleToggleSound}
                type="button"
                aria-pressed={soundActive}
                className="py-2.5 px-3 text-xs font-bold uppercase bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {soundActive ? <Volume2 className="w-4 h-4 text-[var(--accent)]" /> : <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />}
                <span>{soundActive ? 'Sound On' : 'Muted'}</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                type="button"
                className="py-2.5 px-3 text-xs font-bold uppercase bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};
