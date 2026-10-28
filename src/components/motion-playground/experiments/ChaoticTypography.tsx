import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, RotateCcw, Shuffle, Flame, Wind, Magnet, ArrowUp } from 'lucide-react';
import gsap from 'gsap';

interface ChaoticTypographyProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
  className?: string;
}

type TypoMode = 'bounce' | 'explosion' | 'elastic' | 'vortex';

interface LetterPhysics {
  char: string;
  index: number;
  // Current transform offsets
  x: number;
  y: number;
  z: number;
  rotation: number;
  scaleX: number;
  scaleY: number;

  // Velocity
  vx: number;
  vy: number;
  vRot: number;

  // Bounce cycle phase
  phase: number;
  bounceFreq: number;
  bounceAmp: number;

  // Dragging
  isDragging: boolean;
}

export const ChaoticTypography: React.FC<ChaoticTypographyProps> = ({
  onRegisterControls,
  className = '',
}) => {
  const [text, setText] = useState<string>('MOTION LAB');
  const [mode, setMode] = useState<TypoMode>('bounce');
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const physicsRef = useRef({
    letters: [] as LetterPhysics[],
    mode: 'bounce' as TypoMode,
    isAnimating: true,
    time: 0,
    dragIndex: -1,
    dragStartX: 0,
    dragStartY: 0,
  });

  physicsRef.current.mode = mode;
  physicsRef.current.isAnimating = isAnimating;

  // Initialize letters
  const initLetters = useCallback((phrase: string) => {
    const letters: LetterPhysics[] = [];
    const chars = phrase.split('');

    for (let i = 0; i < chars.length; i++) {
      letters.push({
        char: chars[i],
        index: i,
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        vx: 0,
        vy: 0,
        vRot: 0,
        phase: i * 0.45,
        bounceFreq: 2.8 + (i % 3) * 0.4,
        bounceAmp: 16 + (i % 4) * 6,
        isDragging: false,
      });
    }

    physicsRef.current.letters = letters;
  }, []);

  useEffect(() => {
    initLetters(text);
  }, [text, initLetters]);

  // Mode: Trigger Explosion
  const triggerExplosion = useCallback(() => {
    const letters = physicsRef.current.letters;
    for (let i = 0; i < letters.length; i++) {
      const l = letters[i];
      const angle = (Math.PI * 2 * (i / letters.length)) + (Math.random() - 0.5) * 0.8;
      const speed = 180 + Math.random() * 160;
      l.vx = Math.cos(angle) * speed;
      l.vy = Math.sin(angle) * speed;
      l.vRot = (Math.random() - 0.5) * 45;
    }
  }, []);

  // Mode: Trigger Vortex
  const triggerVortex = useCallback(() => {
    const letters = physicsRef.current.letters;
    for (let i = 0; i < letters.length; i++) {
      const l = letters[i];
      const theta = (i / letters.length) * Math.PI * 2;
      l.vx = -Math.sin(theta) * 220;
      l.vy = Math.cos(theta) * 220;
      l.vRot = 30;
    }
  }, []);

  // Launch single letter on click
  const launchLetter = (idx: number) => {
    const letters = physicsRef.current.letters;
    if (letters[idx]) {
      letters[idx].vy = -260;
      letters[idx].vx = (Math.random() - 0.5) * 80;
      letters[idx].vRot = (Math.random() - 0.5) * 25;
      letters[idx].scaleY = 1.35;
      letters[idx].scaleX = 0.8;
    }
  };

  // Reset baseline smoothly
  const handleReset = useCallback(() => {
    const letters = physicsRef.current.letters;
    for (let i = 0; i < letters.length; i++) {
      const l = letters[i];
      l.vx = 0;
      l.vy = 0;
      l.vRot = 0;
      l.x = 0;
      l.y = 0;
      l.rotation = 0;
      l.scaleX = 1;
      l.scaleY = 1;
    }
  }, []);

  // Register parent controls
  useEffect(() => {
    if (onRegisterControls) {
      onRegisterControls({
        reset: handleReset,
        replay: () => {
          if (mode === 'explosion') triggerExplosion();
          else if (mode === 'vortex') triggerVortex();
          else {
            const letters = physicsRef.current.letters;
            letters.forEach((l, i) => setTimeout(() => launchLetter(i), i * 60));
          }
        },
      });
    }
  }, [onRegisterControls, handleReset, mode, triggerExplosion, triggerVortex]);

  // Main 60fps physics simulation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const p = physicsRef.current;
      p.time += dt;

      const letters = p.letters;
      const springK = 14;  // Return to baseline spring force
      const damping = 0.88; // Friction damping

      for (let i = 0; i < letters.length; i++) {
        const l = letters[i];
        const el = letterRefs.current[i];
        if (!el) continue;

        if (p.isAnimating) {
          if (p.mode === 'bounce' && !l.isDragging) {
            // Independent cyclic harmonic bounce with squash & stretch landing
            const cycle = (p.time * l.bounceFreq + l.phase) % (Math.PI * 2);
            const rawY = -Math.abs(Math.sin(cycle)) * l.bounceAmp;

            // Landing squash
            if (rawY > -2) {
              l.scaleY = 0.88;
              l.scaleX = 1.14;
            } else {
              l.scaleY += (1.0 - l.scaleY) * 10 * dt;
              l.scaleX += (1.0 - l.scaleX) * 10 * dt;
            }

            // Spring return if kicked
            const fx = -springK * l.x;
            const fy = -springK * (l.y - rawY);
            l.vx += fx * dt;
            l.vy += fy * dt;
            l.vx *= damping;
            l.vy *= damping;
            l.x += l.vx * dt;
            l.y += l.vy * dt;

            l.vRot += -10 * l.rotation * dt;
            l.vRot *= damping;
            l.rotation += l.vRot * dt;

          } else if (p.mode === 'explosion' || p.mode === 'elastic' || p.mode === 'vortex') {
            // Free physics with Hooke's return to baseline (0,0)
            if (!l.isDragging) {
              const fx = -springK * l.x;
              const fy = -springK * l.y;
              l.vx += fx * dt;
              l.vy += fy * dt;
              l.vx *= damping;
              l.vy *= damping;
              l.x += l.vx * dt;
              l.y += l.vy * dt;

              l.vRot += -8 * l.rotation * dt;
              l.vRot *= damping;
              l.rotation += l.vRot * dt;

              l.scaleX += (1.0 - l.scaleX) * 10 * dt;
              l.scaleY += (1.0 - l.scaleY) * 10 * dt;
            }
          }
        }

        // Apply DOM transform
        el.style.transform = `translate3d(${l.x.toFixed(2)}px, ${l.y.toFixed(2)}px, 0px) rotate(${l.rotation.toFixed(2)}deg) scale(${l.scaleX.toFixed(2)}, ${l.scaleY.toFixed(2)})`;
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[320px] bg-[#FDFBF7] dark:bg-[#0A0D14] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between p-4 ${className}`}
    >
      {/* Top Status & Text Input */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded text-[10px] font-mono text-[var(--text-main)]">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span>DOM_PHYSICS // VERLET LETTERS</span>
        </div>

        {/* Custom text input */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">TEXT:</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase().slice(0, 16))}
            maxLength={16}
            className="px-2 py-0.5 text-xs font-mono font-bold bg-white dark:bg-black/40 border border-[var(--border-color)] text-[var(--text-main)] rounded w-28 uppercase"
          />
        </div>
      </div>

      {/* Main Interactive Stage: Characters */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden py-6">
        <div className="flex items-center justify-center flex-wrap gap-1 md:gap-2">
          {physicsRef.current.letters.map((letter, idx) => (
            <span
              key={`${letter.char}-${idx}`}
              ref={(el) => {
                letterRefs.current[idx] = el;
              }}
              onClick={() => launchLetter(idx)}
              onMouseEnter={() => {
                if (mode === 'bounce') {
                  const l = physicsRef.current.letters[idx];
                  if (l) l.vy = -120;
                }
              }}
              className="inline-block font-display text-4xl sm:text-5xl md:text-6xl font-black text-[var(--text-main)] cursor-pointer hover:text-[var(--accent)] transition-colors select-none transform-gpu origin-bottom will-change-transform"
              title="Click to launch letter"
            >
              {letter.char === ' ' ? '\u00A0' : letter.char}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10 pt-2 border-t border-[var(--border-color)]/20">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Mode Tabs */}
          {(['bounce', 'explosion', 'elastic', 'vortex'] as TypoMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                if (m === 'explosion') triggerExplosion();
                if (m === 'vortex') triggerVortex();
              }}
              type="button"
              className={`px-2 py-1 text-[10px] font-mono font-bold uppercase transition-colors rounded cursor-pointer ${
                mode === m
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-black/5 dark:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {m}
            </button>
          ))}

          {/* Trigger action button */}
          <button
            onClick={() => {
              if (mode === 'explosion') triggerExplosion();
              else if (mode === 'vortex') triggerVortex();
              else {
                const letters = physicsRef.current.letters;
                letters.forEach((l, i) => setTimeout(() => launchLetter(i), i * 50));
              }
            }}
            type="button"
            className="px-2 py-1 bg-black text-white dark:bg-white dark:text-black hover:bg-[var(--accent)] hover:text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded ml-1"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Launch</span>
          </button>

          {/* Reset Baseline */}
          <button
            onClick={handleReset}
            type="button"
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] transition-colors cursor-pointer rounded"
            title="Restore baseline layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] font-mono text-[var(--text-muted)] hidden sm:block">
          HOVER OR CLICK LETTERS TO DISRUPT
        </div>
      </div>
    </div>
  );
};
