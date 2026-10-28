import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Droplet, RotateCcw, Activity } from 'lucide-react';

interface LiquidMetalBallProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
  className?: string;
}

interface FluidVertex {
  baseAngle: number;
  r: number;        // current radial distance
  targetR: number;  // baseline resting radius
  vr: number;       // radial velocity
  tangentV: number; // transverse ripple velocity
}

export const LiquidMetalBall: React.FC<LiquidMetalBallProps> = ({
  onRegisterControls,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [viscosity, setViscosity] = useState<'chrome' | 'mercury' | 'molten'>('mercury');
  const [statusMessage, setStatusMessage] = useState<string>('SURFACE TENSION IDLE');

  const stateRef = useRef({
    // Central fluid droplet center
    cx: 0,
    cy: 0,
    baseRadius: 65,

    // Liquid surface vertices
    numVertices: 72,
    vertices: [] as FluidVertex[],

    // Viscosity parameters
    viscosityMode: 'mercury' as 'chrome' | 'mercury' | 'molten',
    surfaceTension: 38.0,
    damping: 0.90,

    // Pointer interaction
    isDragging: false,
    dragDistance: 0,
    dragAngle: 0,
    dragStartX: 0,
    dragStartY: 0,
    pointerX: -9999,
    pointerY: -9999,
    pointerActive: false,

    time: 0,
    lightAngle: 0.8,
  });

  stateRef.current.viscosityMode = viscosity;
  if (viscosity === 'chrome') {
    stateRef.current.surfaceTension = 70.0; // Stiff chrome
    stateRef.current.damping = 0.84;
  } else if (viscosity === 'mercury') {
    stateRef.current.surfaceTension = 36.0; // Bouncy fluid mercury
    stateRef.current.damping = 0.90;
  } else {
    stateRef.current.surfaceTension = 18.0; // Molten fluid
    stateRef.current.damping = 0.93;
  }

  // Initialize liquid vertex ring
  const initVertices = useCallback((width: number, height: number) => {
    const s = stateRef.current;
    s.cx = width / 2;
    s.cy = height / 2;
    s.baseRadius = Math.min(width, height) * 0.23;

    const vertices: FluidVertex[] = [];
    const count = s.numVertices;
    for (let i = 0; i < count; i++) {
      const baseAngle = (i / count) * Math.PI * 2;
      vertices.push({
        baseAngle,
        r: s.baseRadius,
        targetR: s.baseRadius,
        vr: 0,
        tangentV: 0,
      });
    }
    s.vertices = vertices;
  }, []);

  // Agitate liquid / ripple impulse
  const agitateLiquid = useCallback(() => {
    const s = stateRef.current;
    for (let i = 0; i < s.vertices.length; i++) {
      const v = s.vertices[i];
      const impulse = Math.sin(v.baseAngle * 4 + s.time * 2) * 32 + (Math.random() - 0.5) * 24;
      v.vr += impulse * 14;
    }
    setStatusMessage('FLUID AGITATED');
    setTimeout(() => setStatusMessage('SURFACE TENSION IDLE'), 1400);
  }, []);

  // Melt & Reform animation
  const meltAndReform = useCallback(() => {
    const s = stateRef.current;
    for (let i = 0; i < s.vertices.length; i++) {
      const v = s.vertices[i];
      // Elongate into liquid teardrop dripping downwards with lateral squeeze
      const downFactor = Math.sin(v.baseAngle);
      const impulse = downFactor > 0 ? downFactor * 70 : -35;
      v.vr += impulse * 9;
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
      s.vertices[i].tangentV = 0;
    }
    s.isDragging = false;
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

  // Main rendering & physics loop
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
      s.lightAngle += 0.25 * dt; // slow studio HDRI rotation

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const vertices = s.vertices;

      // 1. Physics: Deformable fluid mesh simulation
      for (let i = 0; i < vertices.length; i++) {
        const v = vertices[i];

        // Idle organic harmonic surface standing waves (continuous fluid shimmer)
        const idleWave = Math.sin(s.time * 2.4 + v.baseAngle * 3) * 2.4 +
                         Math.cos(s.time * 1.6 + v.baseAngle * 2) * 1.8 +
                         Math.sin(s.time * 3.8 + v.baseAngle * 5) * 0.8;
        let dynamicTargetR = s.baseRadius + idleWave;

        // Hover dimple / indentation
        if (s.pointerActive && !s.isDragging) {
          const curX = s.cx + Math.cos(v.baseAngle) * v.r;
          const curY = s.cy + Math.sin(v.baseAngle) * v.r;
          const distToCursor = Math.hypot(curX - s.pointerX, curY - s.pointerY);

          if (distToCursor < 75) {
            // Depress surface inwards when cursor is near
            const push = (1 - distToCursor / 75) * 38;
            v.vr -= push * dt * 14;
          }
        }

        // Dragging deformation: stretch fluid into elongated droplet tendril along drag vector
        if (s.isDragging) {
          let angleDiff = v.baseAngle - s.dragAngle;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

          const absDiff = Math.abs(angleDiff);
          // Facing drag direction -> pull out into tendril
          if (absDiff < Math.PI * 0.42) {
            const pullFactor = Math.pow(Math.cos((absDiff / 0.42) * (Math.PI * 0.5)), 1.4);
            const stretchAmount = (s.dragDistance - s.baseRadius);
            if (stretchAmount > 0) {
              const targetStretch = s.baseRadius + stretchAmount * pullFactor * 1.15;
              dynamicTargetR = Math.max(dynamicTargetR, targetStretch);
            }
          } else if (absDiff > Math.PI * 0.55 && absDiff < Math.PI * 0.9) {
            // Lateral volume preservation pinch: fluid squeezes in perpendicularly
            const pinchFactor = Math.sin((absDiff - Math.PI * 0.55) / (Math.PI * 0.35) * Math.PI);
            const pinchAmount = Math.min(22, (s.dragDistance - s.baseRadius) * 0.25);
            dynamicTargetR -= pinchFactor * pinchAmount;
          }
        }

        // Restorative spring force: Hooke's return to target radius
        // F = -k * (r - targetR) - c * vr
        const springForce = -s.surfaceTension * (v.r - dynamicTargetR);
        v.vr += springForce * dt;
        v.vr *= s.damping;
        v.r += v.vr * dt;
      }

      // 2. Neighbor surface tension diffusion (fluid cohesion / wave propagation)
      const len = vertices.length;
      for (let i = 0; i < len; i++) {
        const prev = vertices[(i - 1 + len) % len];
        const next = vertices[(i + 1) % len];
        const avgR = (prev.r + next.r) * 0.5;
        vertices[i].r += (avgR - vertices[i].r) * 0.16;
        vertices[i].vr += (prev.vr + next.vr - 2 * vertices[i].vr) * 0.08;
      }

      // --- 3. Rendering ---
      ctx.fillStyle = '#080A10'; // Deep dark luxury studio obsidian
      ctx.fillRect(0, 0, width, height);

      // Studio floor soft shadow (warps as liquid deforms)
      let avgBottomRadius = s.baseRadius;
      if (vertices.length > 0) {
        avgBottomRadius = (vertices[Math.floor(len * 0.25)].r + vertices[Math.floor(len * 0.3)].r) * 0.5;
      }
      ctx.beginPath();
      ctx.ellipse(s.cx, s.cy + avgBottomRadius * 1.25, avgBottomRadius * 1.05, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.filter = 'blur(8px)';
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
          s.cx - s.baseRadius * 0.35, s.cy - s.baseRadius * 0.35, s.baseRadius * 0.08,
          s.cx, s.cy, s.baseRadius * 1.35
        );
        chromeGrad.addColorStop(0, '#FFFFFF'); // Pure white specular core
        chromeGrad.addColorStop(0.16, '#F1F5F9');
        chromeGrad.addColorStop(0.38, '#94A3B8');
        chromeGrad.addColorStop(0.65, '#475569');
        chromeGrad.addColorStop(0.88, '#1E293B');
        chromeGrad.addColorStop(1, '#090D16'); // Deep dark metallic rim

        ctx.fillStyle = chromeGrad;
        ctx.fill();

        // Chrome Surface Reflection Streaks & Horizon Band (Simulates studio HDRI reflections)
        ctx.clip(); // Clip inside metallic ball

        // Curved chrome horizon reflection band that warps with studio light
        ctx.beginPath();
        ctx.ellipse(s.cx, s.cy + s.baseRadius * 0.12, s.baseRadius * 1.3, s.baseRadius * 0.45, s.lightAngle, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.fill();

        // Primary Specular Hotspot Highlight
        const specX = s.cx - s.baseRadius * 0.42;
        const specY = s.cy - s.baseRadius * 0.42;
        const specGrad = ctx.createRadialGradient(specX, specY, 2, specX, specY, s.baseRadius * 0.55);
        specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        specGrad.addColorStop(0.32, 'rgba(255, 255, 255, 0.55)');
        specGrad.addColorStop(0.65, 'rgba(226, 232, 240, 0.2)');
        specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = specGrad;
        ctx.beginPath();
        ctx.arc(specX, specY, s.baseRadius * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // Secondary bottom bounce light (Ground reflection)
        const bounceGrad = ctx.createRadialGradient(
          s.cx, s.cy + s.baseRadius * 0.82, 4,
          s.cx, s.cy + s.baseRadius * 0.82, s.baseRadius * 0.55
        );
        bounceGrad.addColorStop(0, 'rgba(148, 163, 184, 0.42)');
        bounceGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = bounceGrad;
        ctx.fillRect(s.cx - s.baseRadius * 1.2, s.cy, s.baseRadius * 2.4, s.baseRadius * 1.2);

        // Fluid tendril highlight when dragged
        if (s.isDragging && s.dragDistance > s.baseRadius * 1.2) {
          const tendrilTipX = s.cx + Math.cos(s.dragAngle) * (s.dragDistance * 0.85);
          const tendrilTipY = s.cy + Math.sin(s.dragAngle) * (s.dragDistance * 0.85);
          const tendrilGrad = ctx.createRadialGradient(tendrilTipX, tendrilTipY, 2, tendrilTipX, tendrilTipY, 30);
          tendrilGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
          tendrilGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = tendrilGrad;
          ctx.beginPath();
          ctx.arc(tendrilTipX, tendrilTipY, 30, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Crisp metallic fresnel rim outline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
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

  // Pointer interactions with global window listeners to prevent getting stuck
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const s = stateRef.current;
    const dx = x - s.cx;
    const dy = y - s.cy;
    const dist = Math.hypot(dx, dy);

    s.pointerX = x;
    s.pointerY = y;
    s.pointerActive = true;

    if (dist < s.baseRadius * 1.4) {
      s.isDragging = true;
      s.dragStartX = x;
      s.dragStartY = y;
      s.dragAngle = Math.atan2(dy, dx);
      s.dragDistance = dist;
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
      // Cap maximum elongation for natural fluid surface tension
      s.dragDistance = Math.min(s.baseRadius * 2.3, Math.hypot(dx, dy));
    }
  };

  const handlePointerUp = () => {
    const s = stateRef.current;
    if (s.isDragging) {
      s.isDragging = false;
      setStatusMessage('SURFACE TENSION SNAP');
      setTimeout(() => setStatusMessage('SURFACE TENSION IDLE'), 1200);
    }
    s.pointerActive = false;
    s.pointerX = -9999;
    s.pointerY = -9999;
  };

  // Add global window pointerup so release is never missed
  useEffect(() => {
    const onWindowPointerUp = () => {
      const s = stateRef.current;
      if (s.isDragging) {
        s.isDragging = false;
        setStatusMessage('SURFACE TENSION SNAP');
        setTimeout(() => setStatusMessage('SURFACE TENSION IDLE'), 1200);
      }
    };
    window.addEventListener('pointerup', onWindowPointerUp);
    return () => window.removeEventListener('pointerup', onWindowPointerUp);
  }, []);

  return (
    <div
      className={`relative w-full h-[320px] bg-[#080A10] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between ${className}`}
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
          if (!stateRef.current.isDragging) {
            stateRef.current.pointerActive = false;
          }
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
