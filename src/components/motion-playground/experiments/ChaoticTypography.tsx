import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

interface ChaoticTypographyProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
  className?: string;
}

type TypoMode = 'bounce' | 'explosion' | 'elastic' | 'vortex';

interface LetterPhysics {
  char: string;
  index: number;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;

  vx: number;
  vy: number;
  vRot: number;

  // Stagger phase
  phase: number;
  isDragging: boolean;
}

export const ChaoticTypography: React.FC<ChaoticTypographyProps> = ({
  onRegisterControls,
  className = '',
}) => {
  const [text, setText] = useState<string>('MOTION LAB');
  const [mode, setMode] = useState<TypoMode>('bounce');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const physicsRef = useRef({
    letters: [] as LetterPhysics[],
    mode: 'bounce' as TypoMode,
    time: 0,
    activeDragIndex: -1,
    dragStartX: 0,
    dragStartY: 0,
    pointerX: 0,
    pointerY: 0,
  });

  physicsRef.current.mode = mode;

  // Initialize letters with independent physics states
  const initLetters = useCallback((phrase: string) => {
    const letters: LetterPhysics[] = [];
    const chars = phrase.split('');

    for (let i = 0; i < chars.length; i++) {
      letters.push({
        char: chars[i],
        index: i,
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        vx: 0,
        vy: 0,
        vRot: 0,
        phase: i * 0.42,
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
      const angle = (Math.PI * 2 * (i / Math.max(1, letters.length))) + (Math.random() - 0.5) * 0.9;
      const speed = 220 + Math.random() * 180;
      l.vx = Math.cos(angle) * speed;
      l.vy = Math.sin(angle) * speed - 60; // slight upward bias
      l.vRot = (Math.random() - 0.5) * 55;
      l.scaleX = 1.2;
      l.scaleY = 0.8;
    }
  }, []);

  // Mode: Trigger Vortex
  const triggerVortex = useCallback(() => {
    const letters = physicsRef.current.letters;
    for (let i = 0; i < letters.length; i++) {
      const l = letters[i];
      const theta = (i / Math.max(1, letters.length)) * Math.PI * 2;
      const speed = 240 + Math.random() * 100;
      l.vx = -Math.sin(theta) * speed;
      l.vy = Math.cos(theta) * speed;
      l.vRot = 35;
    }
  }, []);

  // Launch single letter on click
  const launchLetter = (idx: number) => {
    const letters = physicsRef.current.letters;
    if (letters[idx]) {
      letters[idx].vy = -280;
      letters[idx].vx = (Math.random() - 0.5) * 90;
      letters[idx].vRot = (Math.random() - 0.5) * 35;
      letters[idx].scaleY = 1.35;
      letters[idx].scaleX = 0.78;
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
      l.isDragging = false;
    }
    physicsRef.current.activeDragIndex = -1;
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
            letters.forEach((l, i) => setTimeout(() => launchLetter(i), i * 55));
          }
        },
      });
    }
  }, [onRegisterControls, handleReset, triggerExplosion, triggerVortex, mode]);

  // Main 60fps physics simulation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.045);
      lastTime = now;

      const p = physicsRef.current;
      p.time += dt;

      const letters = p.letters;
      const currentMode = p.mode;

      for (let i = 0; i < letters.length; i++) {
        const l = letters[i];

        if (l.isDragging) {
          // Tether to cursor while dragging
          continue;
        }

        if (currentMode === 'bounce') {
          // Rhythmic staggered sinusoidal bounce with squash and stretch on baseline contact
          const cycle = Math.sin(p.time * 3.4 + l.phase);
          if (cycle < 0) {
            // In the air (upward stretch)
            l.y = cycle * 32;
            l.scaleY = 1 + Math.abs(cycle) * 0.18;
            l.scaleX = 1 - Math.abs(cycle) * 0.12;
            l.rotation = Math.sin(p.time * 2 + l.phase) * 6;
          } else {
            // Touching baseline (compression squash)
            l.y = 0;
            l.scaleY = 1 - cycle * 0.28;
            l.scaleX = 1 + cycle * 0.22;
            l.rotation = 0;
          }
          // Smooth decay of any residual explosion velocity
          l.x += (0 - l.x) * 6 * dt;
        } else if (currentMode === 'explosion') {
          // Hooke's spring tether pulling exploded letter back to baseline (0,0)
          const springK = 18.0;
          const damping = 0.88;

          const fx = -springK * l.x;
          const fy = -springK * l.y;
          const fRot = -12.0 * l.rotation;

          l.vx += fx * dt;
          l.vy += fy * dt;
          l.vRot += fRot * dt;

          l.vx *= damping;
          l.vy *= damping;
          l.vRot *= damping;

          l.x += l.vx * dt;
          l.y += l.vy * dt;
          l.rotation += l.vRot * dt;

          // Squash and stretch recovers to 1
          l.scaleX += (1 - l.scaleX) * 8 * dt;
          l.scaleY += (1 - l.scaleY) * 8 * dt;
        } else if (currentMode === 'elastic') {
          // Elastic spring cord
          const springK = 26.0;
          const damping = 0.86;

          const fx = -springK * l.x;
          const fy = -springK * l.y;

          l.vx += fx * dt;
          l.vy += fy * dt;
          l.vx *= damping;
          l.vy *= damping;

          l.x += l.vx * dt;
          l.y += l.vy * dt;
          l.rotation += (0 - l.rotation) * 10 * dt;

          // Velocity-driven stretch along movement axis
          const speed = Math.hypot(l.vx, l.vy);
          const stretch = Math.min(0.4, speed * 0.0015);
          l.scaleY = 1 + stretch;
          l.scaleX = 1 - stretch * 0.5;
        } else if (currentMode === 'vortex') {
          // Swirling vortex: centripetal acceleration + tangential swirl + decay to center
          const dist = Math.hypot(l.x, l.y) || 1;
          const angle = Math.atan2(l.y, l.x);

          // Inward pull + tangential swirl
          const inwardK = 35.0;
          const swirlSpeed = 220;

          l.vx += (-Math.cos(angle) * inwardK - Math.sin(angle) * swirlSpeed) * dt;
          l.vy += (-Math.sin(angle) * inwardK + Math.cos(angle) * swirlSpeed) * dt;

          // Strong damping to reconstruct baseline
          l.vx *= 0.92;
          l.vy *= 0.92;

          l.x += l.vx * dt;
          l.y += l.vy * dt;
          l.rotation += l.vRot * dt;
          l.vRot *= 0.94;

          // Return to resting scale
          l.scaleX += (1 - l.scaleX) * 8 * dt;
          l.scaleY += (1 - l.scaleY) * 8 * dt;
        }

        // Apply transforms to DOM elements
        const el = letterRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${l.x.toFixed(2)}px, ${l.y.toFixed(2)}px, 0px) rotate(${l.rotation.toFixed(2)}deg) scale(${l.scaleX.toFixed(3)}, ${l.scaleY.toFixed(3)})`;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pointer drag for Elastic mode
  const handlePointerDownLetter = (idx: number, e: React.PointerEvent) => {
    e.stopPropagation();
    const l = physicsRef.current.letters[idx];
    if (!l) return;

    l.isDragging = true;
    physicsRef.current.activeDragIndex = idx;
    physicsRef.current.dragStartX = e.clientX - l.x;
    physicsRef.current.dragStartY = e.clientY - l.y;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const idx = physicsRef.current.activeDragIndex;
    if (idx === -1) return;
    const l = physicsRef.current.letters[idx];
    if (!l || !l.isDragging) return;

    l.x = e.clientX - physicsRef.current.dragStartX;
    l.y = e.clientY - physicsRef.current.dragStartY;
    l.rotation = Math.max(-30, Math.min(30, l.x * 0.25));
  };

  const handlePointerUp = () => {
    const idx = physicsRef.current.activeDragIndex;
    if (idx !== -1) {
      const l = physicsRef.current.letters[idx];
      if (l) {
        l.isDragging = false;
        // Snap back with initial velocity
        l.vx = -l.x * 12;
        l.vy = -l.y * 12;
      }
    }
    physicsRef.current.activeDragIndex = -1;
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative w-full h-[320px] bg-[#0A0D16] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between p-4 ${className}`}
    >
      {/* Top Status & High-Contrast Text Input */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/10 rounded text-[10px] font-mono text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse"></span>
          <span>DOM_PHYSICS // VERLET GLYPH PARTICLES</span>
        </div>

        {/* High-Contrast Custom text input */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">TEXT:</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase().slice(0, 14))}
            maxLength={14}
            className="px-2.5 py-1 text-xs font-mono font-bold bg-[#161D2B] border border-white/20 text-white rounded w-32 uppercase focus:outline-none focus:border-[#EF4444] transition-colors"
          />
        </div>
      </div>

      {/* Main High-Contrast Stage: Characters */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden py-4">
        <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-1.5 md:gap-2">
          {physicsRef.current.letters.map((letter, idx) => (
            <span
              key={`${letter.char}-${idx}`}
              ref={(el) => {
                letterRefs.current[idx] = el;
              }}
              onPointerDown={(e) => handlePointerDownLetter(idx, e)}
              onClick={() => launchLetter(idx)}
              onMouseEnter={() => {
                if (mode === 'bounce') {
                  const l = physicsRef.current.letters[idx];
                  if (l) l.vy = -140;
                }
              }}
              className="inline-block font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#FFFFFF] drop-shadow-sm cursor-grab active:cursor-grabbing hover:text-[#EF4444] transition-colors select-none transform-gpu origin-bottom will-change-transform"
              title="Click or drag letter"
            >
              {letter.char === ' ' ? '\u00A0' : letter.char}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Controls with High Contrast and Red Accents */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10 pt-2 border-t border-white/10">
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
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase transition-all rounded cursor-pointer ${
                mode === m
                  ? 'bg-[#DC2626] text-white shadow-md'
                  : 'bg-white/10 text-slate-300 hover:text-white hover:bg-white/15'
              }`}
            >
              {m}
            </button>
          ))}

          {/* Punchy Launch Button */}
          <button
            onClick={() => {
              if (mode === 'explosion') triggerExplosion();
              else if (mode === 'vortex') triggerVortex();
              else {
                const letters = physicsRef.current.letters;
                letters.forEach((l, i) => setTimeout(() => launchLetter(i), i * 45));
              }
            }}
            type="button"
            className="px-2.5 py-1 bg-white text-black hover:bg-[#EF4444] hover:text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded ml-1 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-amber-500 hover:text-white" />
            <span>Launch</span>
          </button>

          {/* Reset Baseline */}
          <button
            onClick={handleReset}
            type="button"
            className="p-1.5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer rounded"
            title="Restore baseline layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-400 hidden sm:block">
          HOVER, CLICK OR DRAG LETTERS
        </div>
      </div>
    </div>
  );
};
