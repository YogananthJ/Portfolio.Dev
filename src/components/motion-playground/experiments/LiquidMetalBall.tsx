import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Droplet, RotateCcw, Sparkles, Activity, Shield } from 'lucide-react';

interface LiquidMetalBallProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
  className?: string;
}

export const LiquidMetalBall: React.FC<LiquidMetalBallProps> = ({
  onRegisterControls,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [viscosity, setViscosity] = useState<'chrome' | 'mercury' | 'molten'>('mercury');
  const [statusMessage, setStatusMessage] = useState<string>('SURFACE TENSION IDLE');

  const stateRef = useRef({
    // Central sphere position
    cx: 0,
    cy: 0,
    baseRadius: 65,

    // Liquid surface vertex points for deformable organic shape
    numVertices: 64,
    vertices: [] as { baseAngle: number; r: number; targetR: number; vr: number }[],

    // Viscosity parameters
    viscosityMode: 'mercury' as 'chrome' | 'mercury' | 'molten',
    surfaceTension: 35.0,
    damping: 0.88,

    // Pointer interaction
    isDragging: false,
    dragOffsetR: 0,
    dragAngle: 0,
    pointerX: -9999,
    pointerY: -9999,
    pointerActive: false,

    time: 0,
    lightAngle: 0.8,
  });

  stateRef.current.viscosityMode = viscosity;
  if (viscosity === 'chrome') {
    stateRef.current.surfaceTension = 65.0; // Stiff chrome
    stateRef.current.damping = 0.82;
  } else if (viscosity === 'mercury') {
    stateRef.current.surfaceTension = 32.0; // Bouncy liquid mercury
    stateRef.current.damping = 0.89;
  } else {
    stateRef.current.surfaceTension = 15.0; // Molten fluid
    stateRef.current.damping = 0.93;
  }

  // Initialize liquid vertex ring
  const initVertices = useCallback((width: number, height: number) => {
    const s = stateRef.current;
    s.cx = width / 2;
    s.cy = height / 2;
    s.baseRadius = Math.min(width, height) * 0.24;

    const vertices = [];
    const count = s.numVertices;
    for (let i = 0; i < count; i++) {
      const baseAngle = (i / count) * Math.PI * 2;
      vertices.push({
        baseAngle,
        r: s.baseRadius,
        targetR: s.baseRadius,
        vr: 0,
      });
    }
    s.vertices = vertices;
  }, []);

  // Agitate liquid / ripple impulse
  const agitateLiquid = useCallback(() => {
    const s = stateRef.current;
    for (let i = 0; i < s.vertices.length; i++) {
      const v = s.vertices[i];
      const impulse = Math.sin(v.baseAngle * 3 + Math.PI * 0.2) * 28 + (Math.random() - 0.5) * 20;
      v.vr += impulse * 12;
    }
    setStatusMessage('FLUID AGITATED');
    setTimeout(() => setStatusMessage('SURFACE TENSION IDLE'), 1400);
  }, []);

  // Melt & Reform animation
  const meltAndReform = useCallback(() => {
    const s = stateRef.current;
    for (let i = 0; i < s.vertices.length; i++) {
      const v = s.vertices[i];
      // Elongate into liquid teardrop dripping downwards
      const downFactor = Math.sin(v.baseAngle);
      v.vr += (downFactor > 0 ? downFactor * 55 : -25) * 8;
    }
    setStatusMessage('LIQUEFYING & REFORMING');
    setTimeout(() => setStatusMessage('SURFACE TENSION IDLE'), 1800);
  }, []);

  // Reset sphere to perfect equilibrium
  const handleReset = useCallback(() => {
    const s = stateRef.current;
    for (let i = 0; i < s.vertices.length; i++) {
      s.vertices[i].r = s.baseRadius;
      s.vertices[i].targetR = s.baseRadius;
      s.vertices[i].vr = 0;
    }
    setStatusMessage('SPHERICAL RESTORE');
    setTimeout(() => setStatusMessage('SURFACE TENSION IDLE'), 1200);
  }, []);

  // Register parent controls
  useEffect(() => {
    if (onRegisterControls) {
      onRegisterControls({
        reset: handleReset,
        replay: () => {
          meltAndReform();
          setTimeout(agitateLiquid, 500);
        },
      });
    }
  }, [onRegisterControls, handleReset, meltAndReform, agitateLiquid]);

  // Main rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initVertices(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const s = stateRef.current;
      s.time += dt;
      s.lightAngle += 0.2 * dt; // slow studio lighting rotation

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const vertices = s.vertices;

      // Physics: Update deformable liquid vertices
      for (let i = 0; i < vertices.length; i++) {
        const v = vertices[i];

        // 1. Idle organic harmonic standing waves (fluid surface tension)
        const idleWave = Math.sin(s.time * 2.2 + v.baseAngle * 3) * 2.5 +
                         Math.cos(s.time * 1.4 + v.baseAngle * 2) * 1.8;
        const targetRadius = s.baseRadius + idleWave;

        // 2. Cursor deformation (dimpling or dragging)
        if (s.pointerActive) {
          const curX = s.cx + Math.cos(v.baseAngle) * v.r;
          const curY = s.cy + Math.sin(v.baseAngle) * v.r;
          const distToCursor = Math.hypot(curX - s.pointerX, curY - s.pointerY);

          if (s.isDragging) {
            // Drag pulls closest vertices towards pointer
            const angleDiff = Math.abs(Math.atan2(Math.sin(v.baseAngle - s.dragAngle), Math.cos(v.baseAngle - s.dragAngle)));
            if (angleDiff < Math.PI * 0.45) {
              const pullFactor = Math.cos(angleDiff / 0.45 * (Math.PI * 0.5));
              v.vr += pullFactor * (s.dragOffsetR - v.r) * 12 * dt;
            }
          } else if (distToCursor < 65) {
            // Hover indentation / surface dimple
            const push = (1 - distToCursor / 65) * 45;
            v.vr -= push * dt * 10;
          }
        }

        // 3. Surface Tension Spring Force (Hooke's return to spherical radius)
        // F = -k * (r - targetR) - c * vr
        const springForce = -s.surfaceTension * (v.r - targetRadius);
        v.vr += springForce * dt;
        v.vr *= s.damping;
        v.r += v.vr * dt;
      }

      // Smooth neighbor tension diffusion (fluid cohesion)
      for (let i = 0; i < vertices.length; i++) {
        const prev = vertices[(i - 1 + vertices.length) % vertices.length];
        const next = vertices[(i + 1) % vertices.length];
        const avg = (prev.r + next.r) * 0.5;
        vertices[i].r += (avg - vertices[i].r) * 0.14;
      }

      // --- Rendering ---
      ctx.fillStyle = '#090B10'; // Dark elegant luxury studio background
      ctx.fillRect(0, 0, width, height);

      // Studio floor soft shadow
      ctx.beginPath();
      ctx.ellipse(s.cx, s.cy + s.baseRadius * 1.25, s.baseRadius * 1.1, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.filter = 'blur(6px)';
      ctx.fill();
      ctx.filter = 'none';

      if (vertices.length > 2) {
        // Construct smooth liquid metallic contour path using cardinal splines
        ctx.save();
        ctx.beginPath();
        const firstX = s.cx + Math.cos(vertices[0].baseAngle) * vertices[0].r;
        const firstY = s.cy + Math.sin(vertices[0].baseAngle) * vertices[0].r;
        ctx.moveTo(firstX, firstY);

        for (let i = 0; i < vertices.length; i++) {
          const next = vertices[(i + 1) % vertices.length];
          const curr = vertices[i];
          const cx1 = s.cx + Math.cos(curr.baseAngle) * curr.r;
          const cy1 = s.cy + Math.sin(curr.baseAngle) * curr.r;
          const cx2 = s.cx + Math.cos(next.baseAngle) * next.r;
          const cy2 = s.cy + Math.sin(next.baseAngle) * next.r;
          const midX = (cx1 + cx2) / 2;
          const midY = (cy1 + cy2) / 2;
          ctx.quadraticCurveTo(cx1, cy1, midX, midY);
        }
        ctx.closePath();

        // Fluid Chrome Metallic Material Gradient
        const chromeGrad = ctx.createRadialGradient(
          s.cx - s.baseRadius * 0.35, s.cy - s.baseRadius * 0.35, s.baseRadius * 0.1,
          s.cx, s.cy, s.baseRadius * 1.25
        );
        chromeGrad.addColorStop(0, '#FFFFFF'); // Pure white specular core
        chromeGrad.addColorStop(0.18, '#E2E8F0');
        chromeGrad.addColorStop(0.42, '#94A3B8');
        chromeGrad.addColorStop(0.68, '#475569');
        chromeGrad.addColorStop(0.92, '#1E293B');
        chromeGrad.addColorStop(1, '#0F172A'); // Deep dark rim

        ctx.fillStyle = chromeGrad;
        ctx.fill();

        // Chrome Surface Reflection Streaks & Horizon Band (Simulates HDRI studio reflection)
        ctx.clip(); // Clip inside metallic ball

        // Curved chrome horizon reflection band
        ctx.beginPath();
        ctx.ellipse(s.cx, s.cy + s.baseRadius * 0.15, s.baseRadius * 1.2, s.baseRadius * 0.45, s.lightAngle, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.fill();

        // Primary Specular Hotspot Highlight
        const specX = s.cx - s.baseRadius * 0.42;
        const specY = s.cy - s.baseRadius * 0.42;
        const specGrad = ctx.createRadialGradient(specX, specY, 2, specX, specY, s.baseRadius * 0.55);
        specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        specGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.45)');
        specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = specGrad;
        ctx.beginPath();
        ctx.arc(specX, specY, s.baseRadius * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // Secondary bottom bounce light (Ground reflection)
        const bounceGrad = ctx.createRadialGradient(
          s.cx, s.cy + s.baseRadius * 0.8, 4,
          s.cx, s.cy + s.baseRadius * 0.8, s.baseRadius * 0.5
        );
        bounceGrad.addColorStop(0, 'rgba(148, 163, 184, 0.45)');
        bounceGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = bounceGrad;
        ctx.fillRect(s.cx - s.baseRadius, s.cy, s.baseRadius * 2, s.baseRadius);

        ctx.restore();

        // Crisp metallic rim outline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [initVertices]);

  // Pointer interactions for stretching & deforming
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    canvas.setPointerCapture(e.pointerId);
    const s = stateRef.current;
    const dx = x - s.cx;
    const dy = y - s.cy;
    const dist = Math.hypot(dx, dy);

    s.pointerX = x;
    s.pointerY = y;
    s.pointerActive = true;

    if (dist < s.baseRadius * 1.35) {
      s.isDragging = true;
      s.dragAngle = Math.atan2(dy, dx);
      s.dragOffsetR = dist;
      setStatusMessage('STRETCHING LIQUID METAL');
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const s = stateRef.current;
    s.pointerX = x;
    s.pointerY = y;
    s.pointerActive = true;

    if (s.isDragging) {
      const dx = x - s.cx;
      const dy = y - s.cy;
      s.dragAngle = Math.atan2(dy, dx);
      s.dragOffsetR = Math.min(s.baseRadius * 2.2, Math.hypot(dx, dy));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = stateRef.current;
    s.isDragging = false;
    s.pointerActive = false;
    s.pointerX = -9999;
    s.pointerY = -9999;

    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // Safe catch
    }

    setStatusMessage('SURFACE TENSION SNAP');
    setTimeout(() => setStatusMessage('SURFACE TENSION IDLE'), 1200);
  };

  return (
    <div
      className={`relative w-full h-[320px] bg-[#090B10] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Status Bar */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 backdrop-blur-xs text-white rounded text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse"></span>
          <span>FLUID_CHROME // SURFACE TENSION HARMONICS</span>
        </div>

        <div className="text-[10px] font-mono font-bold text-slate-300 bg-black/60 border border-white/15 px-2 py-0.5 rounded">
          {statusMessage}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => {
          stateRef.current.pointerActive = false;
        }}
        className="w-full h-full block touch-none cursor-pointer"
      />

      {/* Bottom Controls */}
      <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-xs p-1 border border-white/15 rounded shadow-xs">
          {/* Viscosity Presets */}
          {(['chrome', 'mercury', 'molten'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViscosity(v)}
              type="button"
              className={`px-2 py-1 text-[10px] font-mono font-bold uppercase transition-colors rounded cursor-pointer ${
                viscosity === v
                  ? 'bg-slate-200 text-black shadow-xs'
                  : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}

          {/* Agitate */}
          <button
            onClick={agitateLiquid}
            type="button"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
            title="Agitate liquid surface"
          >
            <Activity className="w-3 h-3 text-cyan-300" />
            <span>Agitate</span>
          </button>

          {/* Melt & Reform */}
          <button
            onClick={meltAndReform}
            type="button"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
            title="Melt and reform"
          >
            <Droplet className="w-3 h-3 text-amber-300" />
            <span>Melt</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            type="button"
            className="p-1 hover:bg-white/20 text-white/80 transition-colors cursor-pointer rounded"
            title="Reset sphere"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] font-mono text-white/50 bg-black/60 px-2 py-1 rounded border border-white/10 hidden sm:block">
          DRAG TO STRETCH FLUID · HOVER TO INDENT
        </div>
      </div>
    </div>
  );
};
