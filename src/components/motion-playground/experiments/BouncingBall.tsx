import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Play, Pause, RotateCcw, ArrowUp, Activity } from 'lucide-react';

interface BouncingBallProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
}

export const BouncingBall: React.FC<BouncingBallProps> = ({ onRegisterControls }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [bounceHeight, setBounceHeight] = useState<'normal' | 'high' | 'super'>('normal');

  const buildTimeline = useCallback((heightMode: 'normal' | 'high' | 'super') => {
    if (!ballRef.current || !shadowRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const dropDistance = heightMode === 'normal' ? 120 : heightMode === 'high' ? 165 : 200;
    const duration = heightMode === 'normal' ? 0.5 : heightMode === 'high' ? 0.62 : 0.75;

    // Reset initial positions
    gsap.set(ballRef.current, { y: 0, scaleX: 1, scaleY: 1 });
    gsap.set(shadowRef.current, { scaleX: 0.45, opacity: 0.25 });

    const tl = gsap.timeline({ repeat: -1 });

    // 1. Fall down (gravity acceleration)
    tl.to(ballRef.current, {
      y: dropDistance,
      duration: duration,
      ease: 'power2.in',
    }, 0)
    // Stretch while plunging
    .to(ballRef.current, {
      scaleY: 1.25,
      scaleX: 0.82,
      duration: duration * 0.4,
      ease: 'power1.in',
    }, duration * 0.6)
    // Shadow gets larger and darker as ball nears ground
    .to(shadowRef.current, {
      scaleX: 1.0,
      opacity: 0.85,
      duration: duration,
      ease: 'power2.in',
    }, 0)

    // 2. Impact: Squash on the floor
    .to(ballRef.current, {
      scaleY: 0.6,
      scaleX: 1.45,
      duration: 0.08,
      ease: 'power1.out',
    })
    .to(shadowRef.current, {
      scaleX: 1.35,
      opacity: 1,
      duration: 0.08,
    }, '<')

    // 3. Rebound & Stretch upwards
    .to(ballRef.current, {
      scaleY: 1.28,
      scaleX: 0.8,
      duration: 0.1,
      ease: 'power1.inOut',
    })
    .to(shadowRef.current, {
      scaleX: 1.0,
      opacity: 0.75,
      duration: 0.1,
    }, '<')

    // 4. Rise back to apex (gravity deceleration)
    .to(ballRef.current, {
      y: 0,
      duration: duration,
      ease: 'power2.out',
    })
    // Recover to perfect sphere at peak
    .to(ballRef.current, {
      scaleY: 1.0,
      scaleX: 1.0,
      duration: duration * 0.6,
      ease: 'power1.out',
    }, `-=${duration * 0.5}`)
    // Shadow shrinks and diffuses
    .to(shadowRef.current, {
      scaleX: 0.45,
      opacity: 0.25,
      duration: duration,
      ease: 'power2.out',
    }, `<`);

    timelineRef.current = tl;
    if (!isPlaying) {
      tl.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    buildTimeline(bounceHeight);
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [bounceHeight, buildTimeline]);

  const resetAnimation = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.seek(0);
      timelineRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const replayAnimation = useCallback(() => {
    resetAnimation();
  }, [resetAnimation]);

  useEffect(() => {
    onRegisterControls?.({ reset: resetAnimation, replay: replayAnimation });
  }, [onRegisterControls, resetAnimation, replayAnimation]);

  const togglePlay = () => {
    if (!timelineRef.current) return;
    if (isPlaying) {
      timelineRef.current.pause();
      setIsPlaying(false);
    } else {
      timelineRef.current.play();
      setIsPlaying(true);
    }
  };

  const cycleHeight = () => {
    setBounceHeight((prev) => {
      if (prev === 'normal') return 'high';
      if (prev === 'high') return 'super';
      return 'normal';
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 bg-[#0A0A0C] border border-white/10 rounded overflow-hidden select-none flex flex-col justify-between p-3"
      role="region"
      aria-label="GSAP Bouncing ball with squash and stretch"
    >
      {/* Top Telemetry */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-white/80">
          <Activity className="w-3 h-3 text-[#E11D48]" />
          <span>EASING: power2.in / out + squash</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-amber-300 font-bold">
          <span>HEIGHT: {bounceHeight.toUpperCase()} ({bounceHeight === 'normal' ? '120px' : bounceHeight === 'high' ? '165px' : '200px'})</span>
        </div>
      </div>

      {/* Physics Chamber Display */}
      <div className="relative flex-1 flex flex-col items-center justify-start pt-4 cursor-pointer" onClick={cycleHeight}>
        {/* Metric Altitude ruler lines */}
        <div className="absolute left-6 top-8 bottom-12 w-px bg-white/10 flex flex-col justify-between text-[9px] text-white/40 font-mono select-none">
          <span>APEX</span>
          <span>-50%</span>
          <span>FLOOR</span>
        </div>

        {/* The Bouncing Ball Element */}
        <div
          ref={ballRef}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#BE123C] via-[#E11D48] to-[#FDA4AF] shadow-[0_0_20px_rgba(225,29,72,0.6)] flex items-center justify-center cursor-pointer relative z-20"
          title="Click to change bounce height"
        >
          {/* Subtle 3D specular sheen */}
          <div className="w-3.5 h-3.5 rounded-full bg-white/70 absolute top-2 left-2 blur-[1px]"></div>
          <span className="text-[10px] text-white font-mono font-bold tracking-tighter opacity-80">GSAP</span>
        </div>

        {/* Floor Contact Line & Ground Shadow */}
        <div className="absolute bottom-6 flex flex-col items-center w-full px-8">
          <div
            ref={shadowRef}
            className="w-16 h-3.5 rounded-[50%] bg-[#E11D48]/30 blur-[4px] border border-[#E11D48]/20 transition-transform origin-center"
          />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-1" />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5">
        <div className="text-[10px] text-white/60 bg-black/60 px-2 py-1 border border-white/10">
          Tip: <button onClick={cycleHeight} className="text-amber-400 font-bold underline cursor-pointer">Click ball</button> to toggle bounce altitude
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={togglePlay}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors"
            title={isPlaying ? 'Pause timeline' : 'Play timeline'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={cycleHeight}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-[#E11D48] text-white border border-white/20 rounded transition-colors"
            title="Increase bounce height"
            aria-label="Increase bounce height"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetAnimation}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors"
            title="Reset to apex"
            aria-label="Reset to apex"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
