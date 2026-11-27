import React, { useEffect, useState, memo } from 'react';
import {
  ArrowDown,
  Github,
  Linkedin,
  Terminal,
  Sparkles,
  Copy,
  Check,
  FileText,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { DigitalVisitingCard } from './DigitalVisitingCard';
import { ParticleNetworkCanvas } from './common/ParticleNetworkCanvas';
import { soundFX } from '../utils/soundEffects';

interface HeroProps {
  onOpenTerminal: () => void;
  onExploreWork: () => void;
  onOpenResume?: () => void;
}

const HeroLiveClock = memo(function HeroLiveClock() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      if (document.hidden) return;
      const now = new Date();
      try {
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        setCurrentTime(`${timeStr} IST`);
      } catch {
        setCurrentTime(now.toLocaleTimeString());
      }
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    const handleVisibility = () => {
      if (!document.hidden) updateTime();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <span className="font-semibold text-[var(--text-main)] tabular-nums">
      {currentTime || 'India Standard Time'}
    </span>
  );
});

export const Hero: React.FC<HeroProps> = ({
  onOpenTerminal,
  onExploreWork,
  onOpenResume,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  return (
    <section
      id="overview"
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-[var(--bg-canvas)] pt-4 sm:pt-6 pb-10 sm:pb-12 select-none"
    >
      {/* Dynamic Self-Reorganizing Interactive Particle Network */}
      <ParticleNetworkCanvas />

      {/* Top Telemetry Bar */}
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono border-b border-[var(--border-color)] pb-2.5 sm:pb-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 font-bold text-[#E11D48] shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping" aria-hidden="true"></span>
              ENGINEERING RADAR
            </span>
            <span className="text-[var(--text-muted)]/50 hidden sm:inline" aria-hidden="true">/</span>
            <span className="text-[var(--text-muted)] hidden sm:inline truncate">{PERSONAL_INFO.role}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-[var(--text-muted)] font-mono">
            <span className="hidden min-[420px]:inline">{PERSONAL_INFO.location}</span>
            <span className="text-[var(--text-muted)]/50 hidden min-[420px]:inline" aria-hidden="true">/</span>
            <HeroLiveClock />
          </div>
        </div>
      </div>

      {/* Center Hero Stage */}
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-4 sm:py-8 lg:py-10 z-10 flex-1 flex flex-col justify-center">
        {/* Monolithic Display Headline + Primary Actions + Cartoon Visiting Card */}
        <div className="relative mb-6 sm:mb-8 lg:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 items-center">
            {/* Left Column: Identity, Role, Short Intro, and Main Actions */}
            <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-7">
              <div className="text-[11px] sm:text-xs font-mono tracking-widest text-[var(--accent)] uppercase font-bold mb-1.5 sm:mb-2 flex items-center gap-2">
                <span className="inline-block w-4 h-px bg-[var(--accent)]" aria-hidden="true"></span>
                <span>AI Engineer · Full-Stack Developer · Automation Specialist</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[72px] xl:text-[86px] 2xl:text-[100px] leading-[0.92] tracking-tight uppercase text-[var(--text-main)] drop-shadow-sm">
                Yogananth J
              </h1>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-[var(--text-main)] font-medium leading-snug sm:leading-relaxed max-w-2xl select-text">
                {PERSONAL_INFO.headline}
              </p>

              {/* Primary & Secondary Actions — Immediately Reachable on First Screen */}
              <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  id="hero-explore-projects"
                  onClick={() => {
                    soundFX.playClick();
                    onExploreWork();
                  }}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] border border-[var(--accent)] shadow-md transition-[background-color,transform,box-shadow] duration-150 active:scale-[0.97] cursor-pointer font-mono rounded-xs"
                >
                  <span>Explore Projects</span>
                  <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                </button>

                {onOpenResume && (
                  <button
                    id="hero-view-resume"
                    onClick={() => {
                      soundFX.playClick();
                      onOpenResume();
                    }}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:text-[var(--accent)] border-2 border-[var(--border-color)] shadow-xs transition-[border-color,color,transform,box-shadow] duration-150 active:scale-[0.97] cursor-pointer rounded-xs"
                    title="View & Download Official Engineering Résumé"
                  >
                    <FileText className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                    <span>View Résumé</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    soundFX.playClick();
                    onOpenTerminal();
                  }}
                  type="button"
                  className="hidden sm:inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--bg-surface)] hover:border-[var(--accent)] border border-[var(--border-color)] transition-[border-color,transform] duration-150 active:scale-[0.97] cursor-pointer rounded-xs"
                >
                  <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>CLI (⌘K)</span>
                </button>
              </div>

              {/* Verified Specialization Summary */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs font-semibold text-[var(--text-muted)] mt-4 max-w-3xl font-mono">
                <span>Multi-Agent Orchestration (CrewAI)</span>
                <span className="text-[var(--accent)] font-bold" aria-hidden="true">·</span>
                <span>Hybrid Vector RAG</span>
                <span className="text-[var(--accent)] font-bold" aria-hidden="true">·</span>
                <span>Vibeathon 6.0 Top 60 Finalist</span>
                <span className="text-[var(--accent)] font-bold" aria-hidden="true">·</span>
                <span>Certified Claude Developer</span>
              </div>
            </div>

            {/* Right Column: Cartoon Digital Visiting Card with Flip Interaction */}
            <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-5 relative flex items-center justify-center lg:justify-end z-20 w-full">
              <DigitalVisitingCard />
            </div>
          </div>
        </div>

        {/* Detailed Developer Profile & Direct Touchpoints (below first-screen CTA + Card on mobile) */}
        <div
          id="about"
          className="mt-2 sm:mt-4 flex flex-col justify-between bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-5 sm:p-8 shadow-sm rounded-xs relative select-text"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
              Developer Profile &amp; Mission
            </div>
            <p className="text-sm sm:text-base text-[var(--text-main)] leading-relaxed mb-4 font-medium">
              {PERSONAL_INFO.bio}
            </p>
            <div className="p-3 bg-amber-50 border border-amber-700/35 text-xs text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-300 mb-4 font-mono leading-relaxed">
              {PERSONAL_INFO.statusNote}
            </div>
          </div>

          {/* Social and Direct Email Touchpoints */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-color)] text-xs font-mono">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors duration-150"
              >
                <Github className="w-3.5 h-3.5" aria-hidden="true" />
                <span>GitHub</span>
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors duration-150"
              >
                <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
              <button
                onClick={onOpenTerminal}
                type="button"
                className="sm:hidden inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-150 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                <span>CLI</span>
              </button>
            </div>

            <button
              onClick={handleCopyEmail}
              type="button"
              className="inline-flex items-center gap-1.5 text-[var(--text-main)] hover:text-[var(--accent)] transition-colors duration-150 cursor-pointer active:scale-[0.98]"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                  <span className="text-emerald-500 font-bold">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>{PERSONAL_INFO.email}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scroll Explorer Indicator */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center text-center font-mono text-[11px] text-[var(--text-muted)]">
          <span className="tracking-widest uppercase mb-1">
            EXPLORE 10 ENGINEERED SYSTEMS
          </span>
          <ArrowDown className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};
