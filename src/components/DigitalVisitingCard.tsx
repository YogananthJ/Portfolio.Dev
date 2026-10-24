import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { 
  Mail, 
  Linkedin, 
  Globe, 
  MapPin, 
  RotateCcw, 
  GraduationCap, 
  Cpu, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

interface DigitalVisitingCardProps {
  className?: string;
}

export const DigitalVisitingCard: React.FC<DigitalVisitingCardProps> = ({ className = '' }) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardChassisRef = useRef<HTMLDivElement | null>(null);
  const cardInnerRef = useRef<HTMLDivElement | null>(null);
  const backContentRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef<boolean>(false);

  // Measure square vs expanded dimensions based on viewport
  const getDimensions = () => {
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 768;

    const squareSize = isMobile ? 176 : isTablet ? 208 : 224; // w-44 / w-52 / w-56
    const expandedWidth = isMobile ? 285 : 320;
    const expandedHeight = isMobile ? 440 : 485;

    return { squareSize, expandedWidth, expandedHeight };
  };

  const handleFlip = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { squareSize, expandedWidth, expandedHeight } = getDimensions();

    if (prefersReducedMotion) {
      if (cardInnerRef.current) {
        gsap.set(cardInnerRef.current, { rotationY: nextFlipped ? 180 : 0 });
      }
      if (cardChassisRef.current) {
        gsap.set(cardChassisRef.current, {
          width: nextFlipped ? expandedWidth : squareSize,
          height: nextFlipped ? expandedHeight : squareSize,
        });
      }
      isAnimatingRef.current = false;
      return;
    }

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    timelineRef.current = tl;

    if (nextFlipped) {
      // 1. Flip to Back & Expand
      tl.to(cardInnerRef.current, {
        rotationY: 180,
        duration: 0.75,
        ease: 'power3.inOut',
      }, 0)
      .to(cardChassisRef.current, {
        width: expandedWidth,
        height: expandedHeight,
        duration: 0.7,
        ease: 'power3.inOut',
      }, 0.05);

      // 2. Stagger reveal back-side details
      if (backContentRef.current) {
        const staggerItems = backContentRef.current.querySelectorAll('.card-stagger-item');
        tl.fromTo(
          staggerItems,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.05,
            ease: 'power2.out',
          },
          0.35
        );
      }
    } else {
      // Return to Front & Shrink to Square
      tl.to(cardInnerRef.current, {
        rotationY: 0,
        duration: 0.7,
        ease: 'power3.inOut',
      }, 0)
      .to(cardChassisRef.current, {
        width: squareSize,
        height: squareSize,
        duration: 0.65,
        ease: 'power3.inOut',
      }, 0.05);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('mjyogananth@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  // Adjust dimensions on window resize if currently flipped
  useEffect(() => {
    const onResize = () => {
      if (cardChassisRef.current) {
        const { squareSize, expandedWidth, expandedHeight } = getDimensions();
        gsap.set(cardChassisRef.current, {
          width: isFlipped ? expandedWidth : squareSize,
          height: isFlipped ? expandedHeight : squareSize,
        });
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isFlipped]);

  return (
    <div
      ref={containerRef}
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Interactive Card Chassis with 3D Flip */}
      <div
        ref={cardChassisRef}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isFlipped}
        aria-label={isFlipped ? 'Click to flip back to photo' : 'Click to flip and expand digital visiting card'}
        className={`relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 cursor-pointer select-none transition-shadow ${
          isFlipped
            ? 'shadow-[10px_10px_0px_0px_var(--border-color)]'
            : 'shadow-[6px_6px_0px_0px_var(--border-color)] hover:shadow-[8px_8px_0px_0px_var(--border-color)]'
        }`}
      >
        <div
          ref={cardInnerRef}
          className="relative w-full h-full transition-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* ========================================================================= */}
          {/* FRONT FACE: Original Square Profile Portrait */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 w-full h-full bg-[var(--bg-surface)] border-4 border-[var(--border-color)] overflow-hidden group"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
          >
            <img
              src="/assets/aistudio/favicon_507da8ac.png"
              alt="Portrait of Yogananth"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="eager"
            />

            {/* Click to Flip Cue Sticker */}
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-xs text-white text-[9px] font-mono font-bold tracking-wider border border-white/20 uppercase flex items-center gap-1 opacity-90 group-hover:opacity-100 group-hover:bg-[var(--accent)] transition-all">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>Click to Flip</span>
            </div>

            {/* Status Sticker */}
            <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-[var(--bg-card)]/90 backdrop-blur-xs text-[var(--text-main)] text-[10px] font-mono font-bold tracking-wider border border-[var(--border-color)] text-center uppercase">
              Open to Opportunities
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BACK FACE: Polished Vertical Digital Visiting Card */}
          {/* ========================================================================= */}
          <div
            ref={backContentRef}
            className="absolute inset-0 w-full h-full bg-[#F5F2EB] dark:bg-[#18181B] text-[#121212] dark:text-[#F4F4F5] border-4 border-[var(--border-color)] p-4 sm:p-5 flex flex-col justify-between overflow-hidden paper-grid"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {/* 1. Card Top Bar & Flip-back Button */}
            <div className="card-stagger-item flex items-center justify-between border-b border-[#121212]/20 dark:border-white/20 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#121212]/70 dark:text-white/70">
                  DIGITAL VISITING CARD
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                type="button"
                className="p-1 text-[#121212]/70 dark:text-white/70 hover:text-[var(--accent)] hover:bg-[#121212]/5 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
                title="Flip back to portrait"
                aria-label="Flip back to portrait"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Identity Header: Mini Portrait + Name + Title */}
            <div className="card-stagger-item space-y-2 py-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded border-2 border-[var(--border-color)] overflow-hidden shrink-0 shadow-xs">
                  <img
                    src="/assets/aistudio/favicon_507da8ac.png"
                    alt="Mini avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight leading-none text-[#121212] dark:text-white">
                    YOGANANTH J
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[11px] font-bold text-[var(--accent)] uppercase">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>AI / ML Engineer</span>
                  </div>
                </div>
              </div>

              {/* Qualification Badge */}
              <div className="card-stagger-item p-2 bg-[#EBE6DC] dark:bg-[#202024] border border-[#121212]/20 dark:border-white/15 space-y-0.5">
                <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase text-[#121212]/60 dark:text-white/60">
                  <GraduationCap className="w-3 h-3 text-[var(--accent)]" />
                  <span>Academic Qualification</span>
                </div>
                <div className="font-mono text-[11px] font-semibold text-[#121212] dark:text-white leading-tight">
                  B.Tech in Artificial Intelligence &amp; Machine Learning
                </div>
              </div>
            </div>

            {/* 3. Contact & Verified Web Channels */}
            <div className="card-stagger-item space-y-2 py-1">
              <div className="font-mono text-[9px] uppercase font-bold text-[#121212]/50 dark:text-white/50 tracking-wider">
                Direct Channels &amp; Links:
              </div>

              {/* Email */}
              <div className="card-stagger-item flex items-center justify-between p-1.5 bg-white/70 dark:bg-black/30 border border-[#121212]/15 dark:border-white/15 hover:border-[var(--accent)] transition-colors">
                <a
                  href="mailto:mjyogananth@gmail.com"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 font-mono text-xs text-[#121212] dark:text-white font-medium hover:text-[var(--accent)] transition-colors truncate"
                  title="Send email to mjyogananth@gmail.com"
                >
                  <Mail className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span className="truncate">mjyogananth@gmail.com</span>
                </a>
                <button
                  onClick={handleCopyEmail}
                  type="button"
                  className="p-1 hover:text-[var(--accent)] text-[#121212]/60 dark:text-white/60 transition-colors shrink-0"
                  title="Copy email address"
                  aria-label="Copy email"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* LinkedIn */}
              <div className="card-stagger-item flex items-center justify-between p-1.5 bg-white/70 dark:bg-black/30 border border-[#121212]/15 dark:border-white/15 hover:border-[var(--accent)] transition-colors">
                <a
                  href="https://www.linkedin.com/in/yogananth-j-653400307/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 font-mono text-xs text-[#121212] dark:text-white font-medium hover:text-[var(--accent)] transition-colors truncate"
                  title="Open LinkedIn profile"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">linkedin.com/in/yogananth-j</span>
                </a>
                <ExternalLink className="w-3 h-3 text-[#121212]/40 dark:text-white/40 shrink-0" />
              </div>

              {/* Portfolio */}
              <div className="card-stagger-item flex items-center justify-between p-1.5 bg-white/70 dark:bg-black/30 border border-[#121212]/15 dark:border-white/15 hover:border-[var(--accent)] transition-colors">
                <a
                  href="https://iam-mjyogananth.pages.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 font-mono text-xs text-[#121212] dark:text-white font-medium hover:text-[var(--accent)] transition-colors truncate"
                  title="Visit portfolio at iam-mjyogananth.pages.dev"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">iam-mjyogananth.pages.dev</span>
                </a>
                <ExternalLink className="w-3 h-3 text-[#121212]/40 dark:text-white/40 shrink-0" />
              </div>

              {/* Location */}
              <div className="card-stagger-item flex items-center gap-2 p-1.5 bg-white/70 dark:bg-black/30 border border-[#121212]/15 dark:border-white/15 font-mono text-xs text-[#121212] dark:text-white font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
                <span className="truncate">Attur, Tamil Nadu, India</span>
              </div>
            </div>

            {/* 4. Card Footer / ID Bar */}
            <div className="card-stagger-item pt-2 border-t border-[#121212]/15 dark:border-white/15 flex items-center justify-between font-mono text-[9px] text-[#121212]/50 dark:text-white/50">
              <span>CARD ID: YJ-2026-AIML</span>
              <span className="text-[var(--accent)] font-bold">CLICK TO FLIP BACK &crarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative neo-brutalist badge (only visible when not flipped to avoid obstruction) */}
      {!isFlipped && (
        <div className="absolute -top-3 -right-3 px-2 py-1 bg-[var(--accent)] text-white text-[10px] font-mono font-bold uppercase tracking-wider border-2 border-[var(--border-color)] shadow-sm pointer-events-none">
          AI &amp; Web Dev
        </div>
      )}
    </div>
  );
};
