import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, FastForward, Compass } from 'lucide-react';

interface OrbitingBallsProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
}

interface Satellite {
  radius: number;
  speed: number; // radians per second
  angle: number;
  size: number;
  color: string;
  glow: string;
  label: string;
}

export const OrbitingBalls: React.FC<OrbitingBallsProps> = ({ onRegisterControls }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  // Satellites config
  const satellitesRef = useRef<Satellite[]>([
    { radius: 42, speed: 1.4, angle: 0, size: 7, color: '#E11D48', glow: 'rgba(225, 29, 72, 0.4)', label: 'α' },
    { radius: 76, speed: 0.85, angle: Math.PI * 0.6, size: 9, color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', label: 'β' },
    { radius: 112, speed: 0.52, angle: Math.PI * 1.3, size: 11, color: '#06B6D4', glow: 'rgba(6, 182, 212, 0.4)', label: 'γ' },
  ]);

  const resetAnimation = useCallback(() => {
    setDirection(1);
    setSpeedMultiplier(1);
    satellitesRef.current[0].angle = 0;
    satellitesRef.current[1].angle = Math.PI * 0.6;
    satellitesRef.current[2].angle = Math.PI * 1.3;
    setIsPlaying(true);
  }, []);

  const replayAnimation = useCallback(() => {
    resetAnimation();
  }, [resetAnimation]);

  useEffect(() => {
    onRegisterControls?.({ reset: resetAnimation, replay: replayAnimation });
  }, [onRegisterControls, resetAnimation, replayAnimation]);

  const toggleDirection = () => {
    setDirection((prev) => (prev === 1 ? -1 : 1));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw subtle orbital rings
      satellitesRef.current.forEach((sat) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, sat.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw central nucleus
      ctx.beginPath();
      ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Core nucleus inner dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#121212';
      ctx.fill();

      // Update and draw satellites
      const currentSpeedFactor = (isHovered ? 2.5 : 1.0) * speedMultiplier * direction;

      satellitesRef.current.forEach((sat) => {
        if (isPlaying && isVisible) {
          sat.angle += sat.speed * currentSpeedFactor * deltaTime;
        }

        const x = centerX + Math.cos(sat.angle) * sat.radius;
        const y = centerY + Math.sin(sat.angle) * sat.radius;

        // Subtle motion trail
        ctx.beginPath();
        ctx.arc(x, y, sat.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = sat.glow;
        ctx.fill();

        // Main satellite sphere
        ctx.beginPath();
        ctx.arc(x, y, sat.size, 0, Math.PI * 2);
        ctx.fillStyle = sat.color;
        ctx.shadowColor = sat.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Specular highlight
        ctx.beginPath();
        ctx.arc(x - sat.size * 0.3, y - sat.size * 0.3, sat.size * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      });

      ctx.restore();

      if (isPlaying && isVisible) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
    };
  }, [isPlaying, isHovered, speedMultiplier, direction]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 bg-[#0A0A0C] border border-white/10 rounded overflow-hidden select-none flex flex-col justify-between p-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={toggleDirection}
      role="region"
      aria-label="Orbiting balls interactive simulation"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
        title="Click to reverse direction, hover to accelerate"
      />

      {/* Top Telemetry Overlay */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-white/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SPEED: {isHovered ? '2.5x (BOOSTED)' : '1.0x'}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-white/80">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>DIR: {direction === 1 ? 'CW (CLOCKWISE)' : 'CCW (REVERSED)'}</span>
        </div>
      </div>

      {/* Bottom Controls Overlay */}
      <div
        className="relative z-10 flex items-center justify-between pointer-events-auto text-xs font-mono pt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[10px] text-white/60 bg-black/60 px-2 py-1 border border-white/10">
          Tip: <span className="text-emerald-400 font-bold">Hover</span> = 2.5x · <span className="text-amber-400 font-bold">Click</span> = Reverse
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors"
            title={isPlaying ? 'Pause simulation' : 'Play simulation'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleDirection}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-[#E11D48] text-white border border-white/20 rounded transition-colors"
            title="Reverse direction"
            aria-label="Reverse direction"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetAnimation}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors"
            title="Reset simulation"
            aria-label="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
