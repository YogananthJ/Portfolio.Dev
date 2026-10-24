import React, { useState } from 'react';
import { Terminal, Send, Menu, X, Columns2, PanelLeft } from 'lucide-react';
import { useLayout } from '../context/LayoutContext';

interface HeaderProps {
  onOpenTerminal: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTerminal, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { layoutMode, setLayoutMode, toggleSidebar, sidebarOpen } = useLayout();

  const navLinks = [
    { href: '#overview', label: 'Overview', id: 'overview' },
    { href: '#projects', label: 'Projects', id: 'projects' },
    { href: '#architecture', label: 'Architecture', id: 'architecture' },
    { href: '#simulators', label: 'AI Labs', id: 'simulators' },
    { href: '#skills', label: 'Skills', id: 'skills' },
    { href: '#experience', label: 'Milestones', id: 'experience' },
    { href: '#contact', label: 'Contact', id: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-canvas)]/90 backdrop-blur-md border-b border-[var(--border-color)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand wordmark & Sidebar Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSidebar}
            type="button"
            className={`p-1.5 border transition-colors ${
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
            className="group flex items-center gap-2 font-display text-xl sm:text-2xl font-black tracking-tight text-[var(--text-main)] whitespace-nowrap hover:text-[var(--accent)] transition-colors"
          >
            <span>YOGANANTH</span>
            <span className="w-2 h-2 bg-[var(--accent)] group-hover:scale-125 transition-transform"></span>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs lg:text-sm font-semibold text-[var(--text-muted)] font-mono">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id && layoutMode === 'standard';
            return (
              <a
                key={link.id}
                href={link.href}
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

        {/* Zone 3: Primary Action + Split Screen + Terminal Button */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Split Screen Workbench Toggle */}
          <button
            onClick={() => setLayoutMode(layoutMode === 'split' ? 'standard' : 'split')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase border transition-colors whitespace-nowrap ${
              layoutMode === 'split'
                ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--accent)]'
            }`}
            title="Toggle Dual-Pane Split Screen Workbench"
          >
            <Columns2 className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{layoutMode === 'split' ? 'Exit Split' : 'Split View'}</span>
          </button>

          {/* Terminal Launcher */}
          <button
            onClick={onOpenTerminal}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] transition-colors whitespace-nowrap"
            title="Open Developer Console (Cmd+K)"
          >
            <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>CLI</span>
            <kbd className="hidden lg:inline-block px-1 py-0.5 text-[10px] bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]">⌘K</kbd>
          </button>

          <a
            href="#contact"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[var(--accent)] hover:opacity-90 transition-all whitespace-nowrap shadow-sm font-mono"
          >
            <span>Contact</span>
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setLayoutMode(layoutMode === 'split' ? 'standard' : 'split')}
            type="button"
            className={`p-2 border transition-colors ${
              layoutMode === 'split' ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-color)]'
            }`}
            aria-label="Toggle Split Mode"
          >
            <Columns2 className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenTerminal}
            type="button"
            className="p-2 text-[var(--text-main)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)]"
            aria-label="Open Terminal"
          >
            <Terminal className="w-4 h-4 text-[var(--accent)]" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="p-2 text-[var(--text-main)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-4 space-y-2 shadow-lg font-mono">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => {
                setLayoutMode('standard');
                setMobileMenuOpen(false);
              }}
              className="block px-3 py-2 text-sm font-bold text-[var(--text-main)] hover:bg-[var(--bg-card)]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[var(--border-color)] flex flex-col gap-2">
            <button
              onClick={() => {
                setLayoutMode(layoutMode === 'split' ? 'standard' : 'split');
                setMobileMenuOpen(false);
              }}
              type="button"
              className="py-2.5 px-3 text-xs font-bold uppercase bg-[var(--accent)] text-white text-center flex items-center justify-center gap-2"
            >
              <Columns2 className="w-4 h-4" />
              <span>{layoutMode === 'split' ? 'Exit Split View' : 'Open Split-Screen View'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
