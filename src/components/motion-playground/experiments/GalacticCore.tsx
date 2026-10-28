import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Compass, Sparkles, RefreshCw, Moon, Zap, Rotate3d } from 'lucide-react';

interface GalacticCoreProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
  className?: string;
}

interface GalacticParticle {
  // Base orbital parameters
  armIndex: number; // -1 for core bar, 0 or 1 for spiral arms
  r: number;        // radial distance from galactic nucleus
  theta: number;    // base polar angle
  z: number;        // vertical thickness of galactic disk
  size: number;
  color: string;
  isCore: boolean;
  isHII: boolean;   // pink/magenta star-forming nursery knot
  isDustLane: boolean; // dark dust lane accent

  // Current dynamic 3D coordinates
  x: number;
  y: number;
  currentZ: number;

  // Displacement physics (repulsion & shockwaves)
  dispX: number;
  dispY: number;
  vx: number;
  vy: number;
}

export const GalacticCore: React.FC<GalacticCoreProps> = ({
  onRegisterControls,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRelaxMode, setIsRelaxMode] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [interactionStatus, setInteractionStatus] = useState<string>('KEPLERIAN ORBIT');

  const galaxyStateRef = useRef({
    particles: [] as GalacticParticle[],
    rotationAngle: 0,
    baseSpeed: 0.0032,
    relaxMode: false,

    // 3D camera / orientation
    tiltX: 0.48,      // default viewing inclination ~28 degrees
    tiltY: 0,         // yaw
    flipAngle: 0,     // flip 180 transition
    targetTiltX: 0.48,
    targetTiltY: 0,
    targetFlipAngle: 0,

    // Center coordinates
    centerX: 0,
    centerY: 0,

    // Pointer state
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    pointerX: -9999,
    pointerY: -9999,
    pointerActive: false,
    dragVx: 0,
    dragVy: 0,

    // Gravitational shockwave
    shockwaves: [] as { x: number; y: number; radius: number; maxRadius: number; strength: number }[],
    time: 0,
  });

  galaxyStateRef.current.relaxMode = isRelaxMode;

  // Generate 3,200+ particles matching photographic reference image (Barred Spiral Galaxy)
  const initGalaxy = useCallback((width: number, height: number) => {
    const particles: GalacticParticle[] = [];
    const count = 3200; // Dense, fluid, high-fidelity particle field
    const maxRadius = Math.min(width, height) * 0.45;

    galaxyStateRef.current.centerX = width / 2;
    galaxyStateRef.current.centerY = height / 2;

    // 1. Central Bar & Bulge: Dense golden-ivory nucleus with preserved inner detail
    const coreCount = 950;
    const barLength = maxRadius * 0.28;
    const barWidth = maxRadius * 0.12;

    for (let i = 0; i < coreCount; i++) {
      // Elongated barred ellipsoid distribution
      const u = (Math.random() - 0.5) * 2;
      const bx = u * barLength + (Math.random() - 0.5) * 14;
      const by = (Math.random() - 0.5) * barWidth * Math.sqrt(Math.max(0, 1 - (u * 0.88) ** 2));
      const r = Math.hypot(bx, by);
      const theta = Math.atan2(by, bx);
      const z = (Math.random() - 0.5) * 16 * (1 - r / (barLength * 1.3));

      // Color gradation: pure warm white/gold in nucleus to golden ivory
      const coreRatio = Math.min(1, r / (barLength * 0.85));
      let color = '#FFFDF0'; // Pure luminous core
      if (coreRatio > 0.65) {
        color = '#FDE68A'; // Warm champagne amber
      } else if (coreRatio > 0.3) {
        color = '#FEF3C7'; // Golden ivory
      }

      particles.push({
        armIndex: -1,
        r,
        theta,
        z,
        size: Math.random() * 2.1 + 0.8,
        color,
        isCore: true,
        isHII: false,
        isDustLane: false,
        x: 0,
        y: 0,
        currentZ: 0,
        dispX: 0,
        dispY: 0,
        vx: 0,
        vy: 0,
      });
    }

    // 2. Sweeping Logarithmic Spiral Arms & Dust Lanes (silver-blue + pink/magenta H-II knots)
    const armCount = count - coreCount;
    const numArms = 2; // Two main barred spiral arms sweeping outward from bar tips
    const b = 0.26;    // Logarithmic spiral pitch factor

    for (let i = 0; i < armCount; i++) {
      const arm = i % numArms;
      const armOffset = (arm * Math.PI) + (Math.PI * 0.14); // Connect to bar ends
      const t = Math.pow(Math.random(), 0.72); // Dense along inner arms, tapering outwards
      const r = maxRadius * 0.22 + t * (maxRadius * 0.78);

      // Logarithmic spiral angle + natural stellar scatter
      const spiralTheta = Math.log(r / (maxRadius * 0.22)) / b + armOffset;
      const scatter = (Math.random() - 0.5) * (0.24 + (r / maxRadius) * 0.20);
      const theta = spiralTheta + scatter;

      // Disk thickness decreases with radius
      const z = (Math.random() - 0.5) * 16 * Math.exp(-r / (maxRadius * 0.65));

      // Pink/magenta H-II nebula region chance (~6% along spiral arms, matching photo)
      const isHII = Math.random() < 0.065 && r > maxRadius * 0.28;
      // Dark dust lane accent (~4% framing inner curve of arms)
      const isDustLane = Math.random() < 0.045 && r > maxRadius * 0.25;

      let color = '#D1E3F8'; // Silver-blue stellar dust
      let size = Math.random() * 1.8 + 0.8;

      if (isHII) {
        color = '#F472B6'; // Pink/magenta starburst knot
        size = Math.random() * 2.2 + 1.2;
      } else if (isDustLane) {
        color = '#334155'; // Dark dust silhouette
        size = Math.random() * 1.5 + 0.7;
      } else {
        const normR = r / maxRadius;
        if (normR < 0.45) {
          color = '#E2E8F0'; // Silver-white inner arm stars
        } else if (normR < 0.75) {
          color = '#93BBE5'; // Classical blue stellar population
        } else {
          color = '#64748B'; // Muted outer halo
        }
      }

      particles.push({
        armIndex: arm,
        r,
        theta,
        z,
        size,
        color,
        isCore: false,
        isHII,
        isDustLane,
        x: 0,
        y: 0,
        currentZ: 0,
        dispX: 0,
        dispY: 0,
        vx: 0,
        vy: 0,
      });
    }

    galaxyStateRef.current.particles = particles;
  }, []);

  // 180-Degree 3D Flip Transition
  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => {
      const next = !prev;
      galaxyStateRef.current.targetFlipAngle = next ? Math.PI : 0;
      setInteractionStatus(next ? 'FLIPPED 180°' : 'STANDARD VIEW');
      setTimeout(() => setInteractionStatus('KEPLERIAN ORBIT'), 1400);
      return next;
    });
  }, []);

  // Shake / Gravitational Shockwave impulse
  const triggerShake = useCallback(() => {
    const g = galaxyStateRef.current;
    for (let i = 0; i < g.particles.length; i++) {
      const p = g.particles[i];
      const angle = Math.random() * Math.PI * 2;
      const speed = 75 + Math.random() * 110;
      p.vx += Math.cos(angle) * speed;
      p.vy += Math.sin(angle) * speed;
    }

    g.shockwaves.push({
      x: g.centerX,
      y: g.centerY,
      radius: 5,
      maxRadius: 280,
      strength: 120,
    });

    setInteractionStatus('GRAVITATIONAL DISRUPTION');
    setTimeout(() => setInteractionStatus('RECOVERING SPIRAL ORBIT'), 1200);
    setTimeout(() => setInteractionStatus('KEPLERIAN ORBIT'), 2800);
  }, []);

  // Reset to equilibrium
  const handleReset = useCallback(() => {
    const g = galaxyStateRef.current;
    g.targetTiltX = 0.48;
    g.targetTiltY = 0;
    g.targetFlipAngle = 0;
    setIsFlipped(false);
    g.shockwaves = [];

    for (let i = 0; i < g.particles.length; i++) {
      const p = g.particles[i];
      p.dispX = 0;
      p.dispY = 0;
      p.vx = 0;
      p.vy = 0;
    }

    setInteractionStatus('KEPLERIAN ORBIT');
  }, []);

  // Register parent controls
  useEffect(() => {
    if (onRegisterControls) {
      onRegisterControls({
        reset: handleReset,
        replay: () => {
          triggerShake();
        },
      });
    }
  }, [onRegisterControls, handleReset, triggerShake]);

  // Main 60fps simulation & rendering loop
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

      initGalaxy(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.045);
      lastTime = now;

      const g = galaxyStateRef.current;
      g.time += dt;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const speedMultiplier = isRelaxMode ? 0.35 : 1.0;

      // Continuous differential orbital rotation
      g.rotationAngle += g.baseSpeed * speedMultiplier;

      // Smooth camera tilt & 180° flip interpolation
      g.tiltX += (g.targetTiltX - g.tiltX) * 4.5 * dt;
      g.tiltY += (g.targetTiltY - g.tiltY) * 4.5 * dt;
      g.flipAngle += (g.targetFlipAngle - g.flipAngle) * 4.5 * dt;

      // Update shockwaves
      for (let w = g.shockwaves.length - 1; w >= 0; w--) {
        const sw = g.shockwaves[w];
        sw.radius += 240 * dt;
        sw.strength *= 0.95;
        if (sw.radius >= sw.maxRadius || sw.strength < 0.6) {
          g.shockwaves.splice(w, 1);
        }
      }

      // Physics parameters
      const repelRadius = isRelaxMode ? 65 : 100;
      const repelForce = isRelaxMode ? 90 : 190;
      const springK = 8.5;  // Hooke's return to dynamic orbital coordinates
      const damping = 0.88; // Viscous decay

      // 3D rotation transform trigonometry
      const cosPitch = Math.cos(g.tiltX);
      const sinPitch = Math.sin(g.tiltX);
      const cosYaw = Math.cos(g.tiltY + g.flipAngle);
      const sinYaw = Math.sin(g.tiltY + g.flipAngle);

      const particles = g.particles;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Keplerian differential rotation: inner stars orbit slightly faster than outer arms
        const keplerFactor = (0.28 / (p.r * 0.04 + 1)) * speedMultiplier;
        const currentTheta = p.theta + g.rotationAngle * (1 + keplerFactor * 0.4);

        // Theoretical undisturbed orbital coordinate on galaxy disk
        const diskX = Math.cos(currentTheta) * p.r;
        const diskY = Math.sin(currentTheta) * p.r;
        const diskZ = p.z;

        // 3D rotation transform (Yaw then Pitch)
        const rotY_X = diskX * cosYaw - diskZ * sinYaw;
        const rotY_Z = diskX * sinYaw + diskZ * cosYaw;
        const rotX_Y = diskY * cosPitch - rotY_Z * sinPitch;
        const rotX_Z = diskY * sinPitch + rotY_Z * cosPitch;

        // Screen base coordinates
        const screenBaseX = g.centerX + rotY_X;
        const screenBaseY = g.centerY + rotX_Y;

        // Pointer Repulsion Physics (creates an authentic clearing void)
        if (g.pointerActive) {
          const curX = screenBaseX + p.dispX;
          const curY = screenBaseY + p.dispY;
          const dx = curX - g.pointerX;
          const dy = curY - g.pointerY;
          const dist = Math.hypot(dx, dy);

          if (dist < repelRadius && dist > 1) {
            const factor = 1 - dist / repelRadius;
            const force = factor * factor * repelForce;
            const nx = dx / dist;
            const ny = dy / dist;
            p.vx += nx * force * dt;
            p.vy += ny * force * dt;
          }
        }

        // Gravitational shockwave displacement
        for (let s = 0; s < g.shockwaves.length; s++) {
          const sw = g.shockwaves[s];
          const curX = screenBaseX + p.dispX;
          const curY = screenBaseY + p.dispY;
          const distToCenter = Math.hypot(curX - sw.x, curY - sw.y);
          const waveDist = Math.abs(distToCenter - sw.radius);

          if (waveDist < 26) {
            const push = (1 - waveDist / 26) * sw.strength;
            const nx = (curX - sw.x) / (distToCenter || 1);
            const ny = (curY - sw.y) / (distToCenter || 1);
            p.vx += nx * push * dt * 9;
            p.vy += ny * push * dt * 9;
          }
        }

        // Hooke's spring-damped return to dynamic spiral positions
        const springFx = -springK * p.dispX;
        const springFy = -springK * p.dispY;

        p.vx += springFx * dt;
        p.vy += springFy * dt;
        p.vx *= damping;
        p.vy *= damping;

        p.dispX += p.vx * dt;
        p.dispY += p.vy * dt;

        p.x = screenBaseX + p.dispX;
        p.y = screenBaseY + p.dispY;
        p.currentZ = rotX_Z;
      }

      // --- Rendering ---
      ctx.fillStyle = '#05070D'; // Deep cosmic indigo-black
      ctx.fillRect(0, 0, width, height);

      // Ambient galactic glow behind the barred core
      const glowGrad = ctx.createRadialGradient(
        g.centerX, g.centerY, 4,
        g.centerX, g.centerY, Math.min(width, height) * 0.42
      );
      glowGrad.addColorStop(0, isRelaxMode ? 'rgba(255, 235, 175, 0.22)' : 'rgba(255, 238, 185, 0.32)');
      glowGrad.addColorStop(0.24, 'rgba(147, 187, 229, 0.15)');
      glowGrad.addColorStop(0.65, 'rgba(45, 65, 105, 0.05)');
      glowGrad.addColorStop(1, 'rgba(5, 7, 13, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw all galaxy particles with additive blending
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) continue;

        const depthAlpha = Math.max(0.3, Math.min(1.0, 0.7 + (p.currentZ / 130)));
        ctx.globalAlpha = depthAlpha * (isRelaxMode ? 0.72 : 0.95);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra soft atmospheric glow for prominent core nucleus particles
        if (p.isCore && p.r < 25) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 248, 220, 0.16)';
          ctx.fill();
        }
      }

      // Reset composite mode
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [initGalaxy, isRelaxMode]);

  // Pointer drag to rotate 3D view
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const g = galaxyStateRef.current;
    g.isDragging = true;
    g.lastPointerX = x;
    g.lastPointerY = y;
    g.pointerX = x;
    g.pointerY = y;
    g.pointerActive = true;
    canvas.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const g = galaxyStateRef.current;
    g.pointerX = x;
    g.pointerY = y;
    g.pointerActive = true;

    if (g.isDragging) {
      const dx = x - g.lastPointerX;
      const dy = y - g.lastPointerY;
      g.lastPointerX = x;
      g.lastPointerY = y;

      // Adjust camera tilt & yaw
      g.targetTiltY += dx * 0.008;
      g.targetTiltX = Math.max(0.1, Math.min(1.3, g.targetTiltX + dy * 0.006));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = galaxyStateRef.current;
    g.isDragging = false;
    g.pointerActive = false;
    g.pointerX = -9999;
    g.pointerY = -9999;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // Safe catch
    }
  };

  return (
    <div
      className={`relative w-full h-[320px] bg-[#05070D] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Status */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 backdrop-blur-xs text-white rounded text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse"></span>
          <span>BARRED_SPIRAL // 3,200+ STELLAR BODIES</span>
        </div>

        <div className="text-[10px] font-mono font-bold text-amber-200 bg-black/60 border border-white/15 px-2 py-0.5 rounded">
          {interactionStatus}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
      />

      {/* Bottom Controls */}
      <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-xs p-1 border border-white/15 rounded shadow-xs">
          {/* Relaxation Mode Toggle */}
          <button
            onClick={() => setIsRelaxMode(!isRelaxMode)}
            type="button"
            className={`px-2 py-1 text-[10px] font-mono font-bold uppercase transition-colors rounded cursor-pointer flex items-center gap-1 ${
              isRelaxMode
                ? 'bg-amber-400 text-black shadow-xs'
                : 'bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Moon className="w-3 h-3" />
            <span>Relax Mode: {isRelaxMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* 180° Flip View */}
          <button
            onClick={toggleFlip}
            type="button"
            className={`px-2 py-1 text-[10px] font-mono font-bold uppercase transition-colors rounded cursor-pointer flex items-center gap-1 ${
              isFlipped
                ? 'bg-cyan-400 text-black'
                : 'bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Rotate3d className="w-3 h-3" />
            <span>180° Flip</span>
          </button>

          {/* Shake Disruption */}
          <button
            onClick={triggerShake}
            type="button"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
          >
            <Zap className="w-3 h-3 text-amber-300" />
            <span>Shake</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            type="button"
            className="p-1 hover:bg-white/20 text-white/80 transition-colors cursor-pointer rounded"
            title="Reset galactic core view"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] font-mono text-white/50 bg-black/60 px-2 py-1 rounded border border-white/10 hidden sm:block">
          DRAG TO TILT 3D · HOVER TO REPEL STARS
        </div>
      </div>
    </div>
  );
};
