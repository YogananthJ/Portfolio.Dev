import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Zap, Magnet } from 'lucide-react';

interface AtomicNetworkProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
  className?: string;
}

interface AtomNeighbor {
  index: number;
  restDist: number;
}

interface AtomNode {
  // Home position (equilibrium lattice point - 100% stable baseline)
  homeX: number;
  homeY: number;

  // Dynamic simulation coordinate
  x: number;
  y: number;
  vx: number;
  vy: number;

  // Lattice connectivity
  neighbors: AtomNeighbor[];

  // Visual properties
  radius: number;
  depth: number; // 0 to 1
  color: string;
  isIsotope: boolean; // occasional rose/amber isotope accent
}

interface Shockwave {
  x: number;
  y: number;
  r: number;
  maxR: number;
  strength: number;
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
    forceRadius: 105,

    pointerX: -9999,
    pointerY: -9999,
    pointerActive: false,

    shockwaves: [] as Shockwave[],
    time: 0,
  });

  stateRef.current.mode = mode;
  stateRef.current.forceRadius = forceRadiusTier === 'wide' ? 145 : 105;

  // Initialize equilibrium atomic lattice with coupled neighbor springs
  const initNetwork = useCallback((width: number, height: number) => {
    const nodes: AtomNode[] = [];
    const cols = Math.floor(width / 44);
    const rows = Math.floor(height / 40);
    const stepX = width / (cols + 1);
    const stepY = height / (rows + 1);

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        // Hexagonal / staggered lattice offset
        const stagger = (r % 2) * (stepX * 0.5);
        const homeX = c * stepX + stagger - (stepX * 0.25);
        const homeY = r * stepY;

        if (homeX < 15 || homeX > width - 15 || homeY < 15 || homeY > height - 15) continue;

        const isIsotope = Math.random() < 0.09;
        const depth = Math.random();

        let color = '#38BDF8'; // Sky cyan
        if (isIsotope) {
          color = '#F43F5E'; // Rose isotope accent
        } else if (depth < 0.3) {
          color = '#F8FAFC'; // Silver-white
        } else if (depth > 0.7) {
          color = '#0284C7'; // Deep cyan
        }

        nodes.push({
          homeX,
          homeY,
          x: homeX,
          y: homeY,
          vx: 0,
          vy: 0,
          neighbors: [],
          radius: isIsotope ? 3.8 : (depth * 1.8 + 2.0),
          depth,
          color,
          isIsotope,
        });
      }
    }

    // Precompute neighboring atom bonds (couples adjacent nodes for true wave propagation)
    const maxBondDist = stepX * 1.35;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dist = Math.hypot(b.homeX - a.homeX, b.homeY - a.homeY);
        if (dist <= maxBondDist) {
          a.neighbors.push({ index: j, restDist: dist });
          b.neighbors.push({ index: i, restDist: dist });
        }
      }
    }

    stateRef.current.nodes = nodes;
  }, []);

  // Trigger Shockwave ripple that travels outward and kicks intersecting nodes
  const triggerShockwave = useCallback((cx?: number, cy?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const x = cx ?? canvas.clientWidth / 2;
    const y = cy ?? canvas.clientHeight / 2;

    stateRef.current.shockwaves.push({
      x,
      y,
      r: 4,
      maxR: Math.hypot(canvas.clientWidth, canvas.clientHeight) * 0.75,
      strength: 160,
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
      const dt = Math.min((now - lastTime) / 1000, 0.045);
      lastTime = now;

      const s = stateRef.current;
      s.time += dt;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const nodes = s.nodes;

      // Update shockwaves
      for (let w = s.shockwaves.length - 1; w >= 0; w--) {
        const sw = s.shockwaves[w];
        sw.r += 340 * dt;
        sw.strength *= 0.945;
        if (sw.r >= sw.maxR || sw.strength < 0.6) {
          s.shockwaves.splice(w, 1);
        }
      }

      // Physics parameters
      const homeK = 22.0;    // Restorative anchor spring pulling back to (homeX, homeY)
      const bondK = 14.0;    // Elastic coupling spring between adjacent neighbor atoms
      const damping = 0.88;  // Viscous damping to prevent endless jitter

      // 1. Neighbor coupled spring forces: F = -k * (dist - restDist)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let k = 0; k < a.neighbors.length; k++) {
          const nb = a.neighbors[k];
          if (nb.index <= i) continue; // calculate each bond once
          const b = nodes[nb.index];

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const strain = dist - nb.restDist;
          const force = strain * bondK;

          const nx = dx / dist;
          const ny = dy / dist;

          // Pull/push connected atoms mutually
          a.vx += nx * force * dt;
          a.vy += ny * force * dt;
          b.vx -= nx * force * dt;
          b.vy -= ny * force * dt;
        }
      }

      // 2. Node dynamics: anchor to home + pointer forces + shockwaves
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Idle thermal Brownian drift
        const driftX = Math.sin(s.time * 1.6 + n.homeY * 0.08) * 0.6;
        const driftY = Math.cos(s.time * 1.4 + n.homeX * 0.08) * 0.6;

        // Return-to-home Hooke's Spring Force: F = -k * (x - home)
        const fxHome = -homeK * (n.x - (n.homeX + driftX));
        const fyHome = -homeK * (n.y - (n.homeY + driftY));
        n.vx += fxHome * dt;
        n.vy += fyHome * dt;

        // Pointer Force (Repulsion or Attraction)
        if (s.pointerActive) {
          const dx = n.x - s.pointerX;
          const dy = n.y - s.pointerY;
          const dist = Math.hypot(dx, dy);

          if (dist < s.forceRadius && dist > 1) {
            const factor = 1 - dist / s.forceRadius;
            const forceMag = factor * factor * (s.mode === 'repulsion' ? 560 : -380);
            const nx = dx / dist;
            const ny = dy / dist;
            n.vx += nx * forceMag * dt;
            n.vy += ny * forceMag * dt;
          }
        }

        // Shockwave displacement: kick nodes outward as the circular shockwave sweeps past
        for (let w = 0; w < s.shockwaves.length; w++) {
          const sw = s.shockwaves[w];
          const dist = Math.hypot(n.x - sw.x, n.y - sw.y);
          const diff = Math.abs(dist - sw.r);

          if (diff < 32) {
            const push = (1 - diff / 32) * sw.strength;
            const nx = (n.x - sw.x) / (dist || 1);
            const ny = (n.y - sw.y) / (dist || 1);
            n.vx += nx * push * dt * 9;
            n.vy += ny * push * dt * 9;
          }
        }

        // Apply damping and integrate position
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx * dt;
        n.y += n.vy * dt;
      }

      // --- Rendering ---
      ctx.fillStyle = '#070A12'; // Dark scientific slate
      ctx.fillRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridGap = 36;
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

      // Draw active circular shockwave rings
      for (let w = 0; w < s.shockwaves.length; w++) {
        const sw = s.shockwaves[w];
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.7, sw.strength / 130)})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }

      // Draw elastic covalent bonds between neighbors
      ctx.lineWidth = 1.2;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let k = 0; k < a.neighbors.length; k++) {
          const nb = a.neighbors[k];
          if (nb.index <= i) continue;
          const b = nodes[nb.index];

          const dist = Math.hypot(b.x - a.x, b.y - a.y);
          const strain = Math.abs(dist - nb.restDist) / nb.restDist;
          const alpha = Math.max(0.08, Math.min(0.75, 0.28 + strain * 0.8));

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          if (strain > 0.3) {
            ctx.strokeStyle = `rgba(244, 63, 94, ${alpha})`; // Strained rose bond
          } else {
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`; // Equilibrium cyan bond
          }
          ctx.stroke();
        }
      }

      // Draw atoms
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Outer soft glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = n.isIsotope ? 'rgba(244, 63, 94, 0.18)' : 'rgba(56, 189, 248, 0.14)';
        ctx.fill();

        // Solid atom nucleus
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        // White core highlight
        ctx.beginPath();
        ctx.arc(n.x - n.radius * 0.3, n.y - n.radius * 0.3, n.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
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

  // Pointer interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    stateRef.current.pointerX = x;
    stateRef.current.pointerY = y;
    stateRef.current.pointerActive = true;

    // Click triggers circular shockwave
    triggerShockwave(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    stateRef.current.pointerX = e.clientX - rect.left;
    stateRef.current.pointerY = e.clientY - rect.top;
    stateRef.current.pointerActive = true;
  };

  const handlePointerLeave = () => {
    stateRef.current.pointerActive = false;
    stateRef.current.pointerX = -9999;
    stateRef.current.pointerY = -9999;
  };

  return (
    <div
      className={`relative w-full h-[320px] bg-[#070A12] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Status */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 backdrop-blur-xs text-white rounded text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>ELASTIC_LATTICE // 2D COVALENT MESH</span>
        </div>

        <div className="text-[10px] font-mono font-bold text-cyan-300 bg-black/60 border border-white/15 px-2 py-0.5 rounded">
          {statusMessage}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerLeave}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full block touch-none cursor-crosshair"
      />

      {/* Bottom Controls */}
      <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-xs p-1 border border-white/15 rounded shadow-xs">
          {/* Mode */}
          <button
            onClick={() => setMode(mode === 'repulsion' ? 'attraction' : 'repulsion')}
            type="button"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
          >
            <Magnet className="w-3 h-3 text-cyan-400" />
            <span>{mode}</span>
          </button>

          {/* Radius Tier */}
          <button
            onClick={() => setForceRadiusTier(forceRadiusTier === 'normal' ? 'wide' : 'normal')}
            type="button"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
          >
            <Zap className="w-3 h-3 text-amber-300" />
            <span>Radius: {forceRadiusTier}</span>
          </button>

          {/* Trigger shockwave button */}
          <button
            onClick={() => triggerShockwave()}
            type="button"
            className="px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
          >
            <span>Shockwave</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            type="button"
            className="p-1 hover:bg-white/20 text-white/80 transition-colors cursor-pointer rounded"
            title="Reset lattice equilibrium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] font-mono text-cyan-300/60 bg-black/60 px-2 py-1 rounded border border-white/10 hidden sm:block">
          CLICK FOR SHOCKWAVE · HOVER TO REPEL
        </div>
      </div>
    </div>
  );
};
