import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Play, RotateCcw, RefreshCw, Type, Sparkles } from 'lucide-react';

interface KineticTypographyProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
}

const PHRASES = [
  'IDEAS INTO INTERACTIONS',
  'CODE AS CHOREOGRAPHY',
  'DIGITAL CRAFT & RIGOR',
];

export const KineticTypography: React.FC<KineticTypographyProps> = ({ onRegisterControls }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const currentPhrase = PHRASES[phraseIndex];

  const animateEntrance = useCallback(() => {
    if (!textContainerRef.current) return;
    const chars = textContainerRef.current.querySelectorAll('.kinetic-char');
    const wordWrappers = textContainerRef.current.querySelectorAll('.kinetic-word');

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Initial state: masked down with slight tilt and blur
    gsap.set(chars, {
      y: 60,
      opacity: 0,
      rotateX: -70,
      scale: 0.8,
      transformOrigin: '50% 100%',
    });

    // Staggered reveal
    tl.to(chars, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      duration: 0.85,
      stagger: {
        each: 0.035,
        from: 'start',
      },
    })
    // Subtle secondary wave overshoot
    .to(wordWrappers, {
      y: -4,
      duration: 0.25,
      stagger: 0.08,
      ease: 'power2.out',
    }, '-=0.3')
    .to(wordWrappers, {
      y: 0,
      duration: 0.35,
      stagger: 0.08,
      ease: 'bounce.out',
    }, '-=0.15');

    timelineRef.current = tl;
  }, []);

  useEffect(() => {
    animateEntrance();
    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [phraseIndex, animateEntrance]);

  const replayAnimation = useCallback(() => {
    animateEntrance();
  }, [animateEntrance]);

  const resetAnimation = useCallback(() => {
    setPhraseIndex(0);
    animateEntrance();
  }, [animateEntrance]);

  useEffect(() => {
    onRegisterControls?.({ reset: resetAnimation, replay: replayAnimation });
  }, [onRegisterControls, resetAnimation, replayAnimation]);

  const triggerHoverWave = () => {
    if (!textContainerRef.current) return;
    const chars = textContainerRef.current.querySelectorAll('.kinetic-char');
    gsap.to(chars, {
      y: -14,
      color: '#E11D48',
      duration: 0.2,
      stagger: {
        each: 0.025,
        yoyo: true,
        repeat: 1,
      },
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(chars, { color: '#FFFFFF', duration: 0.3 });
      },
    });
  };

  const nextPhrase = () => {
    setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 bg-[#0A0A0C] border border-white/10 rounded overflow-hidden select-none flex flex-col justify-between p-3"
      onMouseEnter={triggerHoverWave}
      role="region"
      aria-label="Kinetic typography character stagger animation"
    >
      {/* Top Telemetry */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-white/80">
          <Type className="w-3 h-3 text-cyan-400" />
          <span>STAGGER: 35ms · 3D ROTATION: -70°</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-white/80">
          <span className="text-[#E11D48] font-bold">PHRASE {phraseIndex + 1}/{PHRASES.length}</span>
        </div>
      </div>

      {/* Main Kinetic Display Area */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-4 cursor-pointer text-center"
        onClick={triggerHoverWave}
        title="Hover or click to trigger kinetic wave"
      >
        <div
          ref={textContainerRef}
          aria-label={currentPhrase}
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-display text-xl sm:text-2xl font-black tracking-tight text-white perspective-[800px]"
        >
          {currentPhrase.split(' ').map((word, wordIdx) => (
            <span key={wordIdx} className="kinetic-word inline-flex overflow-hidden py-1">
              {word.split('').map((char, charIdx) => (
                <span
                  key={charIdx}
                  className="kinetic-char inline-block will-change-transform text-white hover:text-[#E11D48] transition-colors"
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Per-character DOM splitting + CSS 3D perspective masking</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5">
        <div className="text-[10px] text-white/60 bg-black/60 px-2 py-1 border border-white/10">
          Tip: <button onClick={triggerHoverWave} className="text-cyan-400 font-bold underline cursor-pointer">Hover text</button> for wave ripple
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={nextPhrase}
            type="button"
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors text-[11px] font-bold flex items-center gap-1"
            title="Switch Phrase"
          >
            <RefreshCw className="w-3 h-3 text-emerald-400" />
            <span>Switch</span>
          </button>

          <button
            onClick={replayAnimation}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors"
            title="Replay Entrance"
            aria-label="Replay Entrance"
          >
            <Play className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetAnimation}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors"
            title="Reset to default"
            aria-label="Reset to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
