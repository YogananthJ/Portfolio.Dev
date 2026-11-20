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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  // Interactive Particle Grid & Constellation Canvas
  // Interactive Latent Vector Space & Synapse Projection Field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let isDisposed = false;
    let isPageVisible = !document.hidden;
    let isCanvasInView = true;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReduced = motionQuery.matches;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 4 Semantic Visual Node Clusters (Pink/Cyan/Indigo/Emerald constellation)
    const clusterDefinitions = [
      {
        name: 'CLUSTER_ALPHA',
        centerFactor: { x: 0.22, y: 0.32 },
        color: '#E11D48',
        nodeCount: 4,
      },
      {
        name: 'CLUSTER_BETA',
        centerFactor: { x: 0.78, y: 0.28 },
        color: '#38BDF8',
        nodeCount: 4,
      },
      {
        name: 'CLUSTER_GAMMA',
        centerFactor: { x: 0.26, y: 0.72 },
        color: '#818CF8',
        nodeCount: 4,
      },
      {
        name: 'CLUSTER_DELTA',
        centerFactor: { x: 0.76, y: 0.75 },
        color: '#34D399',
        nodeCount: 4,
      },
    ];

    interface LatentNode {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      radius: number;
      clusterIndex: number;
      color: string;
    }

    const nodes: LatentNode[] = [];
    clusterDefinitions.forEach((cluster, cIdx) => {
      const cx = width * cluster.centerFactor.x;
      const cy = height * cluster.centerFactor.y;

      for (let lIdx = 0; lIdx < cluster.nodeCount; lIdx++) {
        const angle = (lIdx / cluster.nodeCount) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 35 + Math.random() * 55;
        const nx = cx + Math.cos(angle) * dist;
        const ny = cy + Math.sin(angle) * dist;

        nodes.push({
          x: nx,
          y: ny,
          baseX: nx,
          baseY: ny,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: lIdx === 0 ? 3.5 : 2.2,
          clusterIndex: cIdx,
          color: cluster.color,
        });
      }
    });

    let mouseX = -1000;
    let mouseY = -1000;
    const ripples: { x: number; y: number; r: number; maxR: number; alpha: number }[] = [];

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const onCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      ripples.push({ x: clickX, y: clickY, r: 5, maxR: 160, alpha: 0.75 });
      soundFX.playClick(680);
    };

    canvas.parentElement?.addEventListener('mousemove', onMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onCanvasClick);

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Subtle tech background grid
      const gridSize = 48;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw Click Ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rp = ripples[r];
        rp.r += 3.5;
        rp.alpha *= 0.94;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(225, 29, 72, ${rp.alpha * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (rp.r >= rp.maxR || rp.alpha < 0.02) {
          ripples.splice(r, 1);
        }
      }

      // Draw Cluster Core Halos
      clusterDefinitions.forEach((cluster) => {
        const cx = width * cluster.centerFactor.x;
        const cy = height * cluster.centerFactor.y;
        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 80);
        grad.addColorStop(0, `${cluster.color}15`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 80, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update Nodes Position with organic Brownian float
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx + Math.sin(time + i) * 0.15;
        n.y += n.vy + Math.cos(time + i * 0.8) * 0.15;

        // Soft elastic tethering to origin baseX/baseY
        const dxBase = n.baseX - n.x;
        const dyBase = n.baseY - n.y;
        n.vx += dxBase * 0.008;
        n.vy += dyBase * 0.008;
        n.vx *= 0.96;
        n.vy *= 0.96;

        // Pointer proximity & vector repulsion
        const dxMouse = mouseX - n.x;
        const dyMouse = mouseY - n.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);
        if (distMouse < 140) {
          const force = (1 - distMouse / 140) * 1.8;
          n.x -= (dxMouse / (distMouse || 1)) * force;
          n.y -= (dyMouse / (distMouse || 1)) * force;
        }

        // Intra-cluster connecting rays
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          if (n.clusterIndex === n2.clusterIndex) {
            const dx = n.x - n2.x;
            const dy = n.y - n2.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 130) {
              const alpha = (1 - dist / 130) * 0.3;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.strokeStyle = `${n.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        // Draw Node with clean visual hover glow (no technical debug text/scores)
        const isHoveredNode = distMouse < 55;
        ctx.beginPath();
        ctx.arc(n.x, n.y, isHoveredNode ? n.radius * 1.6 : n.radius, 0, Math.PI * 2);
        ctx.fillStyle = isHoveredNode ? '#FFFFFF' : n.color;
        ctx.fill();
      }

      if (!prefersReduced && isPageVisible && isCanvasInView && !isDisposed) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        animationFrameId = null;
      }
    };

    const startLoop = () => {
      if (isDisposed || animationFrameId !== null) return;
      if (prefersReduced) {
        render();
        return;
      }
      if (isPageVisible && isCanvasInView) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible && isCanvasInView && !prefersReduced) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches;
      stopLoop();
      startLoop();
    };

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isCanvasInView = entry ? entry.isIntersecting : true;
          if (isCanvasInView && isPageVisible && !prefersReduced) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { threshold: 0.01 }
      );
      intersectionObserver.observe(canvas);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery.addEventListener('change', handleMotionChange);

    render();

    return () => {
      isDisposed = true;
      stopLoop();
      intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleResize);
      canvas.parentElement?.removeEventListener('mousemove', onMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onCanvasClick);
    };
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
      {/* Dynamic Background Particle & Geometric Grid Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0"
      />

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
