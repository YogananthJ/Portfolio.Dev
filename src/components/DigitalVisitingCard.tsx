import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { 
  Mail, 
  Linkedin, 
  Globe, 
  MapPin, 
  RotateCcw, 
  Cpu, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles,
  ArrowRight
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

  // Compute closed square vs expanded landscape dimensions (Target ratio ~23 / 15)
  const getDimensions = () => {
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

    // Closed state: Preserves original square photo dimensions
    // w-44 (176px), sm:w-52 (208px), md:w-56 (224px)
    const squareSize = isMobile ? 176 : isTablet ? 208 : 224;

    // Expanded landscape target dimensions:
    // Aspect ratio: 23 / 15 (1.5333) -> Clearly horizontal rectangle, visibly wider than tall
    // Desktop: 460px wide x 300px tall
    // Tablet: 420px wide x 274px tall
    // Mobile: min(420, window.innerWidth - 32) wide, height comfortable for all text
    let expandedWidth = 460;
    let expandedHeight = 300;

    if (isMobile) {
      expandedWidth = Math.min(420, Math.max(300, window.innerWidth - 32));
      const calculatedHeight = Math.round(expandedWidth * (15 / 23));
      // Ensure content fits comfortably without clipping while remaining strictly landscape
      expandedHeight = Math.max(260, calculatedHeight);
    } else if (isTablet) {
      expandedWidth = 420;
      expandedHeight = 274;
    } else {
      expandedWidth = 460;
      expandedHeight = 300;
    }

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
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        isAnimatingRef.current = false;
        if (!nextFlipped && cardChassisRef.current) {
          gsap.set(cardChassisRef.current, { clearProps: 'width,height' });
        }
      },
    });

    timelineRef.current = tl;

    if (nextFlipped) {
      // 1. Flip to Back & Expand to Landscape Rectangle
      tl.to(cardInnerRef.current, {
        rotationY: 180,
        duration: 0.65,
        ease: 'power2.inOut',
      }, 0)
      .to(cardChassisRef.current, {
        width: expandedWidth,
        height: expandedHeight,
        duration: 0.65,
        ease: 'power2.inOut',
      }, 0);

      // 2. Stagger reveal back-side details
      if (backContentRef.current) {
        const staggerItems = backContentRef.current.querySelectorAll('.card-stagger-item');
        tl.fromTo(
          staggerItems,
          { opacity: 0, y: 6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.04,
            ease: 'power2.out',
          },
          0.3
        );
      }
    } else {
      // Return to Front & Shrink to Square
      tl.to(cardInnerRef.current, {
        rotationY: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      }, 0)
      .to(cardChassisRef.current, {
        width: squareSize,
        height: squareSize,
        duration: 0.6,
        ease: 'power2.inOut',
      }, 0);
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

  // Keep dimensions responsive on window resize when flipped
  useEffect(() => {
    const onResize = () => {
      if (cardChassisRef.current && isFlipped) {
        const { expandedWidth, expandedHeight } = getDimensions();
        gsap.set(cardChassisRef.current, {
          width: expandedWidth,
          height: expandedHeight,
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
        aria-label={isFlipped ? 'Click to flip back to portrait photo' : 'Click to flip and expand landscape digital visiting card'}
        className={`relative cursor-pointer select-none transition-shadow ${
          !isFlipped ? 'w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56' : ''
        } ${
          isFlipped
            ? 'shadow-[10px_10px_0px_0px_var(--border-color)]'
            : 'shadow-[6px_6px_0px_0px_var(--border-color)] hover:shadow-[8px_8px_0px_0px_var(--border-color)]'
        }`}
        style={{
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        <div
          ref={cardInnerRef}
          className="relative w-full h-full"
          style={{ 
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center'
          }}
        >
          {/* ========================================================================= */}
          {/* FRONT FACE: Original Square Profile Portrait */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 w-full h-full bg-[var(--bg-surface)] border-4 border-[var(--border-color)] overflow-hidden group"
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)' 
            }}
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
          {/* BACK FACE: Polished Landscape Digital Visiting Card (No Truncation) */}
          {/* ========================================================================= */}
          <div
            ref={backContentRef}
            className="absolute inset-0 w-full h-full bg-[#0E0E12] text-[#FAFAFA] border-3 border-[var(--border-color)] p-3 sm:p-3.5 flex flex-col justify-between overflow-hidden bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:12px_12px]"
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)' 
            }}
          >
            {/* Top Header Bar */}
            <div className="card-stagger-item flex items-center justify-between border-b border-white/15 pb-1.5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse"></span>
                <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/85">
                  DIGITAL VISITING CARD
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                type="button"
                className="flex items-center gap-1 px-1.5 py-0.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                title="Flip back to square portrait"
                aria-label="Flip back to square portrait"
              >
                <RotateCcw className="w-3 h-3 text-[#E11D48]" />
                <span className="hidden sm:inline font-mono text-[8px] uppercase tracking-wider text-white/70">Flip</span>
              </button>
            </div>

            {/* Main Content: Two-Column Responsive Layout */}
            <div className="grid grid-cols-12 gap-2.5 sm:gap-3 flex-1 items-stretch py-1.5 min-h-0">
              {/* Left Column: Identity & Qualifications (col-span-5) */}
              <div className="col-span-5 flex flex-col justify-between border-r border-white/10 pr-2 sm:pr-2.5 min-w-0">
                <div className="flex flex-col">
                  {/* Avatar + Full Name + Title */}
                  <div className="card-stagger-item flex items-start gap-2 mb-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded border border-white/25 overflow-hidden shrink-0 shadow-xs bg-black mt-0.5">
                      <img
                        src="/assets/aistudio/favicon_507da8ac.png"
                        alt="Yogananth J"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-sm sm:text-[15px] md:text-base font-bold text-white tracking-tight leading-tight">
                        Yogananth J
                      </h3>
                      <div className="flex items-center gap-1 font-mono text-[8.5px] sm:text-[9.5px] font-bold text-[#E11D48] uppercase mt-0.5">
                        <Cpu className="w-3 h-3 shrink-0" />
                        <span className="whitespace-nowrap">AI / ML ENGINEER</span>
                      </div>
                    </div>
                  </div>

                  {/* Qualification */}
                  <div className="card-stagger-item font-mono text-[8.5px] sm:text-[9.5px] text-white/80 leading-snug border-l-2 border-[#E11D48] pl-2 py-0.5 mt-1">
                    <span className="block text-[7.5px] uppercase font-bold tracking-wider text-white/40 mb-0.5">
                      Qualification
                    </span>
                    B.Tech in Artificial Intelligence and Machine Learning
                  </div>
                </div>

                {/* Status indicator */}
                <div className="card-stagger-item inline-flex items-center gap-1.5 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs self-start mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-[7.5px] sm:text-[8px] uppercase tracking-wider text-emerald-300 font-semibold">
                    Open to Opportunities
                  </span>
                </div>
              </div>

              {/* Right Column: Contact Channels & Links (col-span-7) */}
              <div className="col-span-7 flex flex-col justify-between min-w-0">
                <div className="card-stagger-item font-mono text-[8px] sm:text-[8.5px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1 mb-1 shrink-0">
                  <span className="w-1 h-1 bg-[#E11D48]"></span>
                  <span>DIRECT CHANNELS &amp; LINKS</span>
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5 flex-1 justify-center">
                  {/* 1. Email */}
                  <div className="card-stagger-item flex items-center justify-between px-2 py-1 bg-white/5 border border-white/10 hover:border-[#E11D48]/60 transition-colors rounded-xs group/item">
                    <a
                      href="mailto:mjyogananth@gmail.com"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 sm:gap-2 font-mono text-[9.5px] sm:text-[10.5px] text-white/95 group-hover/item:text-[#E11D48] transition-colors min-w-0"
                      title="Send email to mjyogananth@gmail.com"
                    >
                      <Mail className="w-3 h-3 text-[#E11D48] shrink-0" />
                      <span className="whitespace-nowrap">mjyogananth@gmail.com</span>
                    </a>
                    <button
                      onClick={handleCopyEmail}
                      type="button"
                      className="p-0.5 hover:text-[#E11D48] text-white/50 hover:bg-white/10 rounded-xs transition-colors shrink-0 ml-1 cursor-pointer"
                      title="Copy email address"
                      aria-label="Copy email"
                    >
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* 2. LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/yogananth-j-653400307/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="card-stagger-item flex items-center justify-between px-2 py-1 bg-white/5 border border-white/10 hover:border-[#E11D48]/60 transition-colors rounded-xs group/item"
                    title="Open LinkedIn profile: https://www.linkedin.com/in/yogananth-j-653400307/"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[9.5px] sm:text-[10.5px] text-white/95 group-hover/item:text-[#E11D48] transition-colors min-w-0">
                      <Linkedin className="w-3 h-3 text-sky-400 shrink-0" />
                      <span className="whitespace-nowrap">linkedin.com/in/yogananth-j</span>
                    </div>
                    <ExternalLink className="w-2.5 h-2.5 text-white/40 group-hover/item:text-white/80 shrink-0 ml-1" />
                  </a>

                  {/* 3. Portfolio */}
                  <a
                    href="https://iam-mjyogananth.pages.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="card-stagger-item flex items-center justify-between px-2 py-1 bg-white/5 border border-white/10 hover:border-[#E11D48]/60 transition-colors rounded-xs group/item"
                    title="Visit portfolio at iam-mjyogananth.pages.dev"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[9.5px] sm:text-[10.5px] text-white/95 group-hover/item:text-[#E11D48] transition-colors min-w-0">
                      <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="whitespace-nowrap">iam-mjyogananth.pages.dev</span>
                    </div>
                    <ExternalLink className="w-2.5 h-2.5 text-white/40 group-hover/item:text-white/80 shrink-0 ml-1" />
                  </a>

                  {/* 4. Location (No Truncation - Full Address Displayed) */}
                  <div className="card-stagger-item flex items-start gap-1.5 sm:gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-xs">
                    <MapPin className="w-3 h-3 text-[#E11D48] shrink-0 mt-0.5" />
                    <span className="font-mono text-[9px] sm:text-[9.5px] text-white/90 leading-tight">
                      Gobichettipalayam, Erode, Tamil Nadu
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="card-stagger-item pt-1.5 border-t border-white/15 flex items-center justify-between font-mono text-[8px] sm:text-[8.5px] text-white/60 shrink-0">
              <span className="tracking-wider">CARD ID: YJ-2026-AIML</span>
              <span className="text-[#E11D48] font-bold tracking-wider flex items-center gap-1">
                CLICK TO FLIP BACK <ArrowRight className="w-2.5 h-2.5 rotate-180" />
              </span>
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

