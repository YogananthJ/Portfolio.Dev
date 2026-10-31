import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ArrowUp, Github, Linkedin, Heart } from 'lucide-react';
import { VisitorCounter } from './VisitorCounter';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090909] text-[#F5F2EB] py-12 border-t-2 border-[#121212] font-mono">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              YOGANANTH
            </div>
            <div className="text-xs text-white/60 mt-1">
              AI Engineer · Full-Stack Developer · Automation Specialist
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/5 hover:bg-[#E11D48] border border-white/10 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/5 hover:bg-[#E11D48] border border-white/10 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <button
              onClick={scrollToTop}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/10 hover:bg-white hover:text-black transition-colors border border-white/20"
              title="Return to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dedicated Total Visitors Counter Section */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10">
          <div className="text-xs text-white/70 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E11D48]"></span>
            <span className="font-semibold text-white">PORTFOLIO TRAFFIC MONITOR</span>
            <span className="text-white/40 hidden md:inline">— Tracking verified unique visits</span>
          </div>
          <div>
            <VisitorCounter />
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            &copy; {new Date().getFullYear()} Yogananth J. Designed &amp; engineered with intent.
          </div>
          <div className="flex items-center gap-2">
            <span>Built with React &amp; TypeScript</span>
            <span>·</span>
            <span>Zero-slop architectural craft</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
