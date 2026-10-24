import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Zap, Sparkles } from 'lucide-react';

interface ParticleFieldProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  color: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ onRegisterControls }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const mouseRef = useRef<{ x: number; y: number; isInside: boolean }>({ x: -1000, y: -1000, isInside: false });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [particleCount, setParticleCount] = useState<number>(65);

  const initParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 500;
    const count = isMobile ? 38 : 65;
    setParticleCount(count);

    const colors = ['#E11D48', '#10B981', '#06B6D4', '#F5F2EB'];
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        baseRadius: Math.random() * 2 + 1.5,
        radius: Math.random() * 2 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    particlesRef.current = particles;
    shockwavesRef.current = [];
  }, []);

  const resetField = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initParticles(canvas.clientWidth, canvas.clientHeight);
    }
  }, [initParticles]);

  const replayAnimation = useCallback(() => {
    resetField();
  }, [resetField]);

  useEffect(() => {
    onRegisterControls?.({ reset: resetField, replay: replayAnimation });
  }, [onRegisterControls, resetField, replayAnimation]);

  const triggerShockwave = (x: number, y: number) => {
    shockwavesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: 110,
      opacity: 0.9,
    });

    // Impart radial impulse to all nearby particles
    particlesRef.current.forEach((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist < 110 && dist > 1) {
        const force = (110 - dist) / 110;
        p.vx += (dx / dist) * force * 7;
        p.vy += (dy / dist) * force * 7;
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    initParticles(canvas.clientWidth, canvas.clientHeight);

    // Pause rendering when off-screen
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = () => {
      if (!isVisibleRef.current || !isPlaying) {
        animFrameId.current = requestAnimationFrame(render);
        return;
      }

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

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // 1. Draw proximity connection filaments
      ctx.lineWidth = 0.75;
      const maxConnectDist = 72;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.22;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 2. Update and draw particles
      particles.forEach((p) => {
        // Pointer repulsion / attraction
        if (mouse.isInside) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          const maxRepelDist = 90;

          if (dist < maxRepelDist && dist > 1) {
            const force = (maxRepelDist - dist) / maxRepelDist;
            p.vx -= (dx / dist) * force * 0.6;
            p.vy -= (dy / dist) * force * 0.6;
            p.radius = p.baseRadius * 1.5;
          } else {
            p.radius += (p.baseRadius - p.radius) * 0.1;
          }
        }

        // Apply friction / drag to normalize velocity
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Apply base velocity
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off canvas boundaries
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // 3. Update and draw shockwaves
      for (let sIdx = shockwavesRef.current.length - 1; sIdx >= 0; sIdx--) {
        const sw = shockwavesRef.current[sIdx];
        sw.radius += 3.5;
        sw.opacity *= 0.94;

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(225, 29, 72, ${sw.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (sw.opacity < 0.02 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(sIdx, 1);
        }
      }

      ctx.restore();
      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    const handleResize = () => {
      initParticles(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [isPlaying, initParticles]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isInside: true,
    };
  };

  const handlePointerLeave = () => {
    mouseRef.current.isInside = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    triggerShockwave(x, y);
  };

  return (
    <div
      className="relative w-full h-64 bg-[#0A0A0C] border border-white/10 rounded overflow-hidden select-none flex flex-col justify-between p-3"
      role="region"
      aria-label="HTML5 Canvas particle field simulation"
    >
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        className="absolute inset-0 w-full h-full cursor-pointer"
        title="Move pointer to disperse particles, click to trigger shockwave burst"
      />

      {/* Top Telemetry */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-white/80">
          <Zap className="w-3 h-3 text-emerald-400" />
          <span>PARTICLES: {particleCount} · FILAMENTS: 72px</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-white/80">
          <span className="text-[#E11D48] font-bold">CLICK: SHOCKWAVE BURST</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div
        className="relative z-10 flex items-center justify-between pointer-events-auto text-xs font-mono pt-2 border-t border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[10px] text-white/60 bg-black/60 px-2 py-1 border border-white/10">
          Tip: <span className="text-emerald-400 font-bold">Hover</span> to repel · <span className="text-[#E11D48] font-bold">Click</span> for impulse wave
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors"
            title={isPlaying ? 'Pause simulation' : 'Resume simulation'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              const canvas = canvasRef.current;
              if (canvas) triggerShockwave(canvas.clientWidth / 2, canvas.clientHeight / 2);
            }}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-[#E11D48] text-white border border-white/20 rounded transition-colors"
            title="Trigger center shockwave"
            aria-label="Center shockwave"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetField}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors"
            title="Reset particles"
            aria-label="Reset particles"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
