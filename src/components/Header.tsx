import React, { useState } from 'react';
import { Terminal, Send, Menu, X, ArrowUpRight, Columns2, PanelLeft } from 'lucide-react';
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
    { href: '#simulators', label: 'Simulators', id: 'simulators' },
    { href: '#skills', label: 'Skills', id: 'skills' },
    { href: '#experience', label: 'Experience', id: 'experience' },
    { href: '#contact', label: 'Contact', id: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F5F2EB]/90 backdrop-blur-md border-b border-[#121212]/10 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand wordmark & Sidebar Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSidebar}
            type="button"
            className={`p-1.5 border transition-colors ${
              sidebarOpen
                ? 'bg-[#121212] text-white border-[#121212]'
                : 'bg-[#EBE6DC] text-[#121212] border-[#121212]/20 hover:border-[#121212]'
            }`}
            title="Toggle Project Quick Directory Sidebar"
            aria-label="Toggle Directory Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <a
            href="#overview"
            className="group flex items-center gap-2 font-display text-xl sm:text-2xl font-black tracking-tight text-[#121212] whitespace-nowrap hover:text-[#E11D48] transition-colors"
          >
            <span>YOGANANTH</span>
            <span className="w-2 h-2 bg-[#E11D48] group-hover:scale-125 transition-transform"></span>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#121212]/75">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id && layoutMode === 'standard';
            return (
              <a
                key={link.id}
                href={link.href}
                className={`whitespace-nowrap transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#E11D48] font-bold'
                    : 'hover:text-[#121212]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E11D48]"></span>
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
                ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-[2px_2px_0px_0px_#121212]'
                : 'bg-[#EBE6DC] text-[#121212] border-[#121212]/20 hover:bg-[#121212] hover:text-white'
            }`}
            title="Toggle Dual-Pane Split Screen Workbench"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>{layoutMode === 'split' ? 'Exit Split' : 'Split View'}</span>
          </button>

          {/* Terminal Launcher */}
          <button
            onClick={onOpenTerminal}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-[#121212] bg-[#EBE6DC] hover:bg-[#121212] hover:text-[#F5F2EB] border border-[#121212]/20 rounded transition-colors whitespace-nowrap"
            title="Open Developer Console (Cmd+K)"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CLI</span>
            <kbd className="hidden lg:inline-block px-1 py-0.5 text-[10px] bg-[#121212]/10 rounded">⌘K</kbd>
          </button>

          <a
            href="#contact"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F5F2EB] bg-[#121212] hover:bg-[#E11D48] border border-[#121212] transition-all whitespace-nowrap shadow-[2px_2px_0px_0px_#121212]"
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
              layoutMode === 'split' ? 'bg-[#E11D48] text-white' : 'bg-[#EBE6DC] text-[#121212]'
            }`}
            aria-label="Toggle Split Mode"
          >
            <Columns2 className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenTerminal}
            type="button"
            className="p-2 text-[#121212] hover:bg-[#EBE6DC] border border-[#121212]/20 rounded"
            aria-label="Open Terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="p-2 text-[#121212] hover:bg-[#EBE6DC] border border-[#121212]/20 rounded"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#121212]/15 bg-[#F5F2EB] px-4 py-4 space-y-2 shadow-lg font-mono">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => {
                setLayoutMode('standard');
                setMobileMenuOpen(false);
              }}
              className="block px-3 py-2 text-sm font-bold text-[#121212] hover:bg-[#EBE6DC] rounded"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[#121212]/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setLayoutMode(layoutMode === 'split' ? 'standard' : 'split');
                setMobileMenuOpen(false);
              }}
              type="button"
              className="py-2.5 px-3 text-xs font-bold uppercase bg-[#E11D48] text-white text-center flex items-center justify-center gap-2"
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
