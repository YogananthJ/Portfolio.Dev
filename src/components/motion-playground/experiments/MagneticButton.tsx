import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Magnet, RotateCcw, Check, MousePointer, Sparkles } from 'lucide-react';

interface MagneticButtonProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ onRegisterControls }) => {
  const boundingZoneRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isEngaged, setIsEngaged] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);

  const resetToCenter = useCallback(() => {
    if (!buttonRef.current || !textRef.current || !iconRef.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
    });
    gsap.to(textRef.current, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
    gsap.to(iconRef.current, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
    setCoords({ x: 0, y: 0 });
  }, []);

  const replayAnimation = useCallback(() => {
    resetToCenter();
    // Simulate attractive pulse
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.9 },
        { scale: 1, duration: 0.5, ease: 'back.out(2)' }
      );
    }
  }, [resetToCenter]);

  useEffect(() => {
    onRegisterControls?.({ reset: resetToCenter, replay: replayAnimation });
  }, [onRegisterControls, resetToCenter, replayAnimation]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!boundingZoneRef.current || !buttonRef.current) return;

    const rect = boundingZoneRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Magnetic pull strength: button moves ~40% of the pointer distance, clamped to maximum displacement
    const maxDistance = 55;
    const pullX = Math.max(-maxDistance, Math.min(maxDistance, deltaX * 0.42));
    const pullY = Math.max(-maxDistance, Math.min(maxDistance, deltaY * 0.42));

    setCoords({ x: Math.round(pullX), y: Math.round(pullY) });

    // Animate button chassis
    gsap.to(buttonRef.current, {
      x: pullX,
      y: pullY,
      rotateX: -pullY * 0.15,
      rotateY: pullX * 0.15,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    // Parallax displacement on inner text and icon (layered depth)
    if (textRef.current) {
      gsap.to(textRef.current, {
        x: pullX * 0.25,
        y: pullY * 0.25,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        x: pullX * 0.4,
        y: pullY * 0.4,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = () => {
    resetToCenter();
  };

  const handleClick = () => {
    setIsEngaged(true);
    setClickCount((c) => c + 1);

    if (buttonRef.current) {
      const tl = gsap.timeline();
      tl.to(buttonRef.current, {
        scale: 0.92,
        duration: 0.1,
        ease: 'power2.in',
      })
      .to(buttonRef.current, {
        scale: 1.05,
        duration: 0.2,
        ease: 'back.out(2.5)',
      })
      .to(buttonRef.current, {
        scale: 1,
        duration: 0.2,
        ease: 'power1.out',
        onComplete: () => {
          setTimeout(() => setIsEngaged(false), 800);
        },
      });
    }
  };

  return (
    <div
      ref={boundingZoneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-64 bg-[#0A0A0C] border border-white/10 rounded overflow-hidden select-none flex flex-col justify-between p-3"
      role="region"
      aria-label="Magnetic interactive button with spring damping"
    >
      {/* Top Telemetry */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-white/80">
          <Magnet className="w-3 h-3 text-[#E11D48]" />
          <span>PULL: ΔX: {coords.x}px · ΔY: {coords.y}px</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-white/80">
          <span className="text-emerald-400 font-bold">DAMPING: elastic.out</span>
        </div>
      </div>

      {/* Main Magnetic Interaction Field */}
      <div className="flex-1 flex flex-col items-center justify-center relative cursor-crosshair">
        {/* Radial proximity field rings */}
        <div className="absolute w-44 h-44 rounded-full border border-dashed border-white/10 pointer-events-none animate-spin-slow" />
        <div className="absolute w-28 h-28 rounded-full border border-white/5 pointer-events-none" />

        {/* The Magnetic Button */}
        <button
          ref={buttonRef}
          onClick={handleClick}
          type="button"
          className={`relative z-20 px-6 py-3.5 bg-[var(--accent)] hover:bg-[#BE123C] text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-white/40 shadow-[4px_4px_0px_0px_#FFFFFF] cursor-pointer transition-shadow active:shadow-none flex items-center gap-2.5 will-change-transform ${
            isEngaged ? 'bg-emerald-600 border-emerald-400' : ''
          }`}
          title="Move your cursor around the zone or click to test"
        >
          <span ref={iconRef} className="inline-block">
            {isEngaged ? <Check className="w-4 h-4 text-white" /> : <Magnet className="w-4 h-4 text-white" />}
          </span>
          <span ref={textRef} className="inline-block">
            {isEngaged ? 'MAGNET ACTIVATED' : 'MAGNETIC CORE'}
          </span>
        </button>

        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-white/40 font-mono pointer-events-none">
          <MousePointer className="w-3 h-3 text-cyan-400" />
          <span>Proximity zone pulls button chassis with parallax depth</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5">
        <div className="text-[10px] text-white/60 bg-black/60 px-2 py-1 border border-white/10">
          Clicks: <strong className="text-emerald-400">{clickCount}</strong> · Zone: <strong className="text-amber-400">Active</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={resetToCenter}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors"
            title="Snap to center"
            aria-label="Snap to center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
