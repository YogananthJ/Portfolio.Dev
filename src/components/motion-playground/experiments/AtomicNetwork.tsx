import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Radio, Zap, RotateCcw, Magnet, ShieldAlert } from 'lucide-react';

interface AtomicNetworkProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
  className?: string;
}

interface AtomNode {
  // Home position (equilibrium lattice point)
  homeX: number;
  homeY: number;

  // Dynamic simulation coordinate
  x: number;
  y: number;
  vx: number;
  vy: number;

  // Visual properties
  radius: number;
  depth: number; // 0 to 1
  color: string;
  isIsotope: boolean; // occasional red/amber isotope accent
}

export const AtomicNetwork: React.FC<AtomicNetworkProps> = ({
  onRegisterControls,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // User Interactive Modes
  const [mode, setMode] = useState<'repulsion' | 'attraction'>('repulsion');
  const [forceRadiusTier, setForceRadiusTier] = useState<'normal' | 'wide'>('normal');
  const [statusMessage, setStatusMessage] = useState<string>('LATTICE EQUILIBRIUM');

  const stateRef = useRef({
    nodes: [] as AtomNode[],
    mode: 'repulsion' as 'repulsion' | 'attraction',
    forceRadius: 100,

    pointerX: -9999,
    pointerY: -9999,
    pointerActive: false,

    shockwaves: [] as { x: number; y: number; r: number; maxR: number; strength: number }[],
    time: 0,
  });

  stateRef.current.mode = mode;
  stateRef.current.forceRadius = forceRadiusTier === 'wide' ? 140 : 95;

  // Initialize equilibrium atomic lattice
  const initNetwork = useCallback((width: number, height: number) => {
    const nodes: AtomNode[] = [];
    const cols = Math.floor(width / 42);
    const rows = Math.floor(height / 38);
    const stepX = width / (cols + 1);
    const stepY = height / (rows + 1);

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        // Hexagonal / staggered lattice offset
        const stagger = (r % 2) * (stepX * 0.5);
        // Base home coordinates with slight natural organic jitter
        const homeX = c * stepX + stagger - (stepX * 0.25) + (Math.random() - 0.5) * 10;
        const homeY = r * stepY + (Math.random() - 0.5) * 8;

        if (homeX < 15 || homeX > width - 15 || homeY < 15 || homeY > height - 15) continue;

        const isIsotope = Math.random() < 0.08;
        const depth = Math.random();

        let color = '#38BDF8'; // Sky cyan
        if (isIsotope) {
          color = '#F43F5E'; // Rose isotope accent
        } else if (depth < 0.3) {
          color = '#E2E8F0'; // Silver-white
        } else if (depth > 0.7) {
          color = '#0EA5E9'; // Deep cyan
        }

        nodes.push({
          homeX,
          homeY,
          x: homeX,
          y: homeY,
          vx: 0,
          vy: 0,
          radius: isIsotope ? 3.5 : (depth * 1.8 + 1.8),
          depth,
          color,
          isIsotope,
        });
      }
    }

    stateRef.current.nodes = nodes;
  }, []);

  // Trigger Shockwave ripple
  const triggerShockwave = useCallback((cx?: number, cy?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const x = cx ?? canvas.clientWidth / 2;
    const y = cy ?? canvas.clientHeight / 2;

    stateRef.current.shockwaves.push({
      x,
      y,
      r: 0,
      maxR: Math.hypot(canvas.clientWidth, canvas.clientHeight) * 0.7,
      strength: 140,
    });

    setStatusMessage('SHOCKWAVE PROPAGATING');
    setTimeout(() => setStatusMessage('LATTICE EQUILIBRIUM'), 1500);
  }, []);

  // Reset Network back to exact home lattice positions
  const handleReset = useCallback(() => {
    const nodes = stateRef.current.nodes;
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].x = nodes[i].homeX;
      nodes[i].y = nodes[i].homeY;
      nodes[i].vx = 0;
      nodes[i].vy = 0;
    }
    stateRef.current.shockwaves = [];
    setStatusMessage('LATTICE RESTORED');
    setTimeout(() => setStatusMessage('LATTICE EQUILIBRIUM'), 1200);
  }, []);

  // Register parent controls
  useEffect(() => {
    if (onRegisterControls) {
      onRegisterControls({
        reset: handleReset,
        replay: () => {
          triggerShockwave();
        },
      });
    }
  }, [onRegisterControls, handleReset, triggerShockwave]);

  // Main animation loop
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

      initNetwork(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const s = stateRef.current;
      s.time += dt;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const nodes = s.nodes;

      // Update shockwaves
      for (let w = s.shockwaves.length - 1; w >= 0; w--) {
        const sw = s.shockwaves[w];
        sw.r += 320 * dt;
        sw.strength *= 0.94;
        if (sw.r >= sw.maxR || sw.strength < 0.5) {
          s.shockwaves.splice(w, 1);
        }
      }

      // Physics parameters
      const springK = 18.0; // Hooke's return to home
      const damping = 0.86;  // Kinetic damping
      const maxConnectDist = 62; // Distance threshold for drawing elastic covalent bonds

      // Update node physics
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // 1. Idle thermal Brownian drift
        const driftX = Math.sin(s.time * 1.5 + n.homeY * 0.1) * 0.8;
        const driftY = Math.cos(s.time * 1.3 + n.homeX * 0.1) * 0.8;

        // 2. Return-to-home Hooke's Spring Force: F = -k * (x - home)
        const fxHome = -springK * (n.x - (n.homeX + driftX));
        const fyHome = -springK * (n.y - (n.homeY + driftY));
        n.vx += fxHome * dt;
        n.vy += fyHome * dt;

        // 3. Pointer Force (Repulsion or Attraction)
        if (s.pointerActive) {
          const dx = n.x - s.pointerX;
          const dy = n.y - s.pointerY;
          const dist = Math.hypot(dx, dy);

          if (dist < s.forceRadius && dist > 1) {
            const factor = (1 - dist / s.forceRadius);
            const forceMag = factor * factor * (s.mode === 'repulsion' ? 520 : -360);
            const nx = dx / dist;
            const ny = dy / dist;
            n.vx += nx * forceMag * dt;
            n.vy += ny * forceMag * dt;
          }
        }

        // 4. Shockwave displacement
        for (let w = 0; w < s.shockwaves.length; w++) {
          const sw = s.shockwaves[w];
          const dist = Math.hypot(n.x - sw.x, n.y - sw.y);
          const diff = Math.abs(dist - sw.r);

          if (diff < 30) {
            const push = (1 - diff / 30) * sw.strength;
            const nx = (n.x - sw.x) / (dist || 1);
            const ny = (n.y - sw.y) / (dist || 1);
            n.vx += nx * push * dt * 10;
            n.vy += ny * push * dt * 10;
          }
        }

        // Apply damping and integrate position
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx * dt;
        n.y += n.vy * dt;
      }

      // --- Rendering ---
      ctx.fillStyle = '#080C14'; // Dark scientific slate
      ctx.fillRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridGap = 35;
      for (let x = 0; x < width; x += gridGap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridGap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw active shockwaves
      for (let w = 0; w < s.shockwaves.length; w++) {
        const sw = s.shockwaves[w];
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.6, sw.strength / 140)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw Elastic Covalent Bonds between neighboring nodes
      ctx.lineWidth = 0.9;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectDist) {
            // Bond stretch calculation
            const alpha = (1 - dist / maxConnectDist) * 0.45;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw Pointer Force Field Indicator
      if (s.pointerActive) {
        ctx.beginPath();
        ctx.arc(s.pointerX, s.pointerY, s.forceRadius, 0, Math.PI * 2);
        ctx.strokeStyle = s.mode === 'repulsion' ? 'rgba(244, 63, 94, 0.28)' : 'rgba(56, 189, 248, 0.28)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Atom Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Glow halo
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = n.isIsotope ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.12)';
        ctx.fill();

        // Solid atom core
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [initNetwork]);

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    triggerShockwave(x, y);
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
    setStatusMessage(s.mode === 'repulsion' ? 'REPELLING NODES' : 'ATTRACTING NODES');
  };

  const handlePointerLeave = () => {
    stateRef.current.pointerActive = false;
    stateRef.current.pointerX = -9999;
    stateRef.current.pointerY = -9999;
    setStatusMessage('SPRING HOME RESTORE');
    setTimeout(() => setStatusMessage('LATTICE EQUILIBRIUM'), 1200);
  };

  return (
    <div
      className={`relative w-full h-[320px] bg-[#080C14] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Status Bar */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 backdrop-blur-xs text-white rounded text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>ATOMIC_LATTICE // SPRING-DAMPED NETWORK</span>
        </div>

        <div className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
          {statusMessage}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full block touch-none cursor-crosshair"
      />

      {/* Bottom Controls */}
      <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-xs p-1 border border-white/15 rounded shadow-xs">
          {/* Mode Switch: Repulsion vs Attraction */}
          <button
            onClick={() => setMode(mode === 'repulsion' ? 'attraction' : 'repulsion')}
            type="button"
            className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded ${
              mode === 'repulsion'
                ? 'bg-rose-500 text-white'
                : 'bg-cyan-500 text-black'
            }`}
            title="Toggle cursor physics: Repel vs Attract"
          >
            {mode === 'repulsion' ? <ShieldAlert className="w-3 h-3" /> : <Magnet className="w-3 h-3" />}
            <span>{mode === 'repulsion' ? 'Repulsion Mode' : 'Attraction Mode'}</span>
          </button>

          {/* Force Radius Tier */}
          <button
            onClick={() => setForceRadiusTier(forceRadiusTier === 'normal' ? 'wide' : 'normal')}
            type="button"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
            title="Change force field radius"
          >
            <Radio className="w-3 h-3 text-cyan-300" />
            <span>{forceRadiusTier === 'normal' ? 'Radius: 100px' : 'Radius: 140px'}</span>
          </button>

          {/* Trigger Shockwave */}
          <button
            onClick={() => triggerShockwave()}
            type="button"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
            title="Trigger circular shockwave"
          >
            <Zap className="w-3 h-3 text-amber-300" />
            <span>Shockwave</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            type="button"
            className="p-1 hover:bg-white/20 text-white/80 transition-colors cursor-pointer rounded"
            title="Reset lattice"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] font-mono text-white/50 bg-black/60 px-2 py-1 rounded border border-white/10 hidden sm:block">
          HOVER TO DISPLACE · CLICK TO SHOCKWAVE
        </div>
      </div>
    </div>
  );
};
