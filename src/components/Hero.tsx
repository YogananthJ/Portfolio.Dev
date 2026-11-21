import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
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
import { trackSectionNavigation } from '../utils/urlActivityTracker';

interface HeroProps {
  onOpenTerminal: () => void;
  onExploreWork: () => void;
  onOpenResume?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenTerminal,
  onExploreWork,
  onOpenResume,
}) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -42]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 28]);
  const bioScale = useTransform(scrollYProgress, [0, 1], [1, shouldReduceMotion ? 1 : 0.985]);

  const [copiedEmail, setCopiedEmail] = useState(false);

  // Live IST Clock & Telemetry
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
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
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  return (
    <section
      ref={heroRef}
      id="overview"
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-[var(--bg-canvas)] pt-6 pb-12 select-none"
    >
      {/* Dynamic Self-Reorganizing Interactive Particle Network */}
      <ParticleNetworkCanvas />

      {/* Top Telemetry Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 z-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 font-bold text-[#E11D48]">
              <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping"></span>
              ENGINEERING RADAR
            </span>
            <span className="text-white/20">/</span>
            <span className="text-[var(--text-muted)]">{PERSONAL_INFO.role}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] font-mono">
            <span>{PERSONAL_INFO.location}</span>
            <span className="text-white/20">/</span>
            <span className="font-semibold text-[var(--text-main)] tabular-nums">
              {currentTime || 'India Standard Time'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Center Hero Stage */}
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 sm:py-10 lg:py-12 z-10 flex-1 flex flex-col justify-center">
        {/* Giant Monolithic Display Headline + Avatar Lockup */}
        <div className="relative mb-6 sm:mb-8 lg:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 items-center">
            {/* Left Column: Headline and Key Specializations */}
            <motion.div
              style={{ y: headlineY }}
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="lg:col-span-7 xl:col-span-7 2xl:col-span-7 will-change-transform"
            >
              <div className="text-[11px] sm:text-xs font-mono tracking-widest text-[var(--accent)] uppercase font-bold mb-2 flex items-center gap-2">
                <span className="inline-block w-4 h-px bg-[var(--accent)]"></span>
                <span>AI Engineer · Full-Stack Developer · Automation Specialist</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[90px] 2xl:text-[104px] leading-[0.9] tracking-tight uppercase text-[var(--text-main)] drop-shadow-sm">
                YOGANANTH
              </h1>

              {/* Verified Specialization Pills */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm font-semibold text-[var(--text-muted)] mt-4 max-w-3xl font-mono">
                <span>Multi-Agent Orchestration (CrewAI)</span>
                <span className="text-[var(--accent)] font-bold">·</span>
                <span>Hybrid Vector RAG</span>
                <span className="text-[var(--accent)] font-bold">·</span>
                <span>Vibeathon 6.0 Top 60 Finalist</span>
                <span className="text-[var(--accent)] font-bold">·</span>
                <span>Certified Claude Developer</span>
              </div>
            </motion.div>

            {/* Right Column: Digital Visiting Card */}
            <motion.div
              style={{ y: cardY }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 xl:col-span-5 2xl:col-span-5 relative flex items-center justify-center lg:justify-end z-20 w-full will-change-transform"
            >
              <DigitalVisitingCard />
            </motion.div>
          </div>
        </div>

        {/* Hero Biography & Action Cluster */}
        <motion.div
          id="about"
          style={{ scale: bioScale }}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.55 }}
          className="mt-4 sm:mt-6 flex flex-col justify-between bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-6 sm:p-8 shadow-sm rounded-xs relative group will-change-transform"
        >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                Developer Profile &amp; Mission
              </div>
              <p className="text-sm sm:text-base text-[var(--text-main)] leading-relaxed mb-4 font-medium">
                {PERSONAL_INFO.bio}
              </p>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400 mb-4 font-mono leading-relaxed">
                {PERSONAL_INFO.statusNote}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    trackSectionNavigation('projects');
                    onExploreWork();
                  }}
                  type="button"
                  className="flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[var(--accent)] hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer font-mono"
                >
                  <span>Explore 10 Projects</span>
                  <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                </button>

                {onOpenResume && (
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onOpenResume();
                    }}
                    type="button"
                    className="flex items-center gap-1.5 px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--bg-surface)] hover:border-amber-400 border border-[var(--border-color)] transition-all active:scale-95 cursor-pointer"
                    title="View & Download Official Engineering Resume"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Resume / CV</span>
                  </button>
                )}

                <button
                  onClick={onOpenTerminal}
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--bg-surface)] hover:border-[var(--accent)] border border-[var(--border-color)] transition-all active:scale-95 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>CLI (⌘K)</span>
                </button>
              </div>

              {/* Social and Direct Email Touchpoints */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)] text-xs font-mono">
                <div className="flex items-center gap-3">
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </div>

                <button
                  onClick={handleCopyEmail}
                  type="button"
                  className="flex items-center gap-1.5 text-[var(--text-main)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-bold">Email Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>{PERSONAL_INFO.email}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
        </motion.div>

        {/* Scroll Explorer Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col items-center justify-center text-center font-mono text-[11px] text-[var(--text-muted)]"
        >
          <span className="tracking-widest uppercase mb-1">
            EXPLORE 10 ENGINEERED SYSTEMS
          </span>
          <ArrowDown className="w-4 h-4 text-[var(--accent)] animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
};
