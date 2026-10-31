import React, { useEffect, useState, useRef } from 'react';

export const FuturisticSpotlight: React.FC = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isPointerDevice, setIsPointerDevice] = useState<boolean>(false);
  const [targetMode, setTargetMode] = useState<'card' | 'canvas' | 'action' | 'none'>('none');
  const [targetLabel, setTargetLabel] = useState<string>('');
  const [isClicking, setIsClicking] = useState<boolean>(false);

  useEffect(() => {
    // Check if device has a fine pointer (mouse/trackpad), disable on touch/mobile
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    setIsPointerDevice(hasFinePointer);
    if (!hasFinePointer) return;

    let rafId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      // Detect interactive element under cursor
      const el = e.target as HTMLElement | null;
      if (!el) {
        setTargetMode('none');
        setTargetLabel('');
        return;
      }

      if (el.closest('.project-card-item')) {
        setTargetMode('card');
        setTargetLabel('SYSTEM // SCHEMATIC');
      } else if (el.closest('canvas')) {
        setTargetMode('canvas');
        setTargetLabel('PHYSICS // DRAG');
      } else if (el.closest('button, a, [role="button"], input, select, textarea')) {
        setTargetMode('action');
        const text = el.closest('button, a, [role="button"]')?.getAttribute('title') || 'INTERACT';
        setTargetLabel(text.slice(0, 16).toUpperCase());
      } else {
        setTargetMode('none');
        setTargetLabel('');
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 240);
    };

    const updateLoop = () => {
      // Smooth lerp interpolation for silky motion
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setMousePos({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isPointerDevice || !mousePos) return null;

  const isTargeting = targetMode !== 'none';

  return (
    <>
      {/* Ambient Radial Spotlight Illumination */}
      <div
        className="fixed inset-0 pointer-events-none z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(225, 29, 72, 0.045), rgba(56, 189, 248, 0.02), transparent 75%)`,
        }}
      />

      {/* Kinetic Precision Reticle Cursor HUD */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 select-none hidden md:block"
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Reticle Chassis */}
        <div className="relative -top-1/2 -left-1/2 flex items-center justify-center">
          {/* Outer Rotating Targeting Ring / Bracket */}
          <div
            className={`rounded-full border transition-all duration-200 flex items-center justify-center ${
              isClicking
                ? 'scale-75 border-[var(--accent)] bg-[var(--accent)]/20'
                : isTargeting
                ? 'w-10 h-10 border-[var(--accent)]/80 scale-110 shadow-[0_0_12px_rgba(225,29,72,0.4)]'
                : 'w-6 h-6 border-white/25 scale-100'
            }`}
          >
            {/* Center Core Dot */}
            <div
              className={`rounded-full transition-all duration-150 ${
                isTargeting
                  ? 'w-1.5 h-1.5 bg-[var(--accent)]'
                  : 'w-1 h-1 bg-white/70'
              }`}
            />
          </div>

          {/* Contextual Micro-Label Tag */}
          {isTargeting && targetLabel && (
            <div className="absolute top-6 left-6 whitespace-nowrap bg-black/85 border border-white/20 text-white font-mono text-[8.5px] px-1.5 py-0.5 rounded-xs tracking-wider shadow-lg flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse"></span>
              <span>{targetLabel}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
