import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Compass, Sparkles, RefreshCw, Moon, Zap, Rotate3d } from 'lucide-react';

interface GalacticCoreProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
  className?: string;
}

interface GalacticParticle {
  // Base orbital parameters
  armIndex: number;
  r: number;        // radial distance from galactic center
  theta: number;    // orbital angle in radians
  z: number;        // vertical thickness of galactic disk
  size: number;
  color: string;
  isCore: boolean;
  isHII: boolean;   // pink/magenta stellar nursery accent

  // Current dynamic 3D coordinates
  x: number;
  y: number;
  currentZ: number;

  // Displacement physics (mouse repulsion & shockwaves)
  dispX: number;
  dispY: number;
  dispZ: number;
  vx: number;
  vy: number;
  vz: number;
}

export const GalacticCore: React.FC<GalacticCoreProps> = ({
  onRegisterControls,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRelaxMode, setIsRelaxMode] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [interactionStatus, setInteractionStatus] = useState<string>('CONTINUOUS ORBIT');

  const galaxyStateRef = useRef({
    particles: [] as GalacticParticle[],
    rotationAngle: 0,
    baseSpeed: 0.0035,
    relaxMode: false,

    // 3D camera / orientation
    tiltX: 0.52,      // default viewing inclination ~30 degrees
    tiltY: 0,         // yaw
    flipAngle: 0,     // flip 180 transition
    targetTiltX: 0.52,
    targetTiltY: 0,
    targetFlipAngle: 0,

    // Center panning
    centerX: 0,
    centerY: 0,
    targetCenterX: 0,
    targetCenterY: 0,

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
  });

  // Generate galaxy particles procedurally matching reference image
  const initGalaxy = useCallback((width: number, height: number) => {
    const particles: GalacticParticle[] = [];
    const count = 2600; // Optimal density & high performance
    const maxRadius = Math.min(width, height) * 0.44;

    galaxyStateRef.current.centerX = width / 2;
    galaxyStateRef.current.centerY = height / 2;
    galaxyStateRef.current.targetCenterX = width / 2;
    galaxyStateRef.current.targetCenterY = height / 2;

    // 1. Central Bar & Bulge (warm ivory & golden champagne)
    const coreCount = 700;
    for (let i = 0; i < coreCount; i++) {
      // Elongated bar distribution (as in reference image image_06d9839a.png)
      const u = (Math.random() - 0.5) * 2;
      const barLength = maxRadius * 0.28;
      const barWidth = maxRadius * 0.12;
      const bx = u * barLength + (Math.random() - 0.5) * 12;
      const by = (Math.random() - 0.5) * barWidth * Math.sqrt(Math.max(0, 1 - (u * 0.9) ** 2));
      const r = Math.hypot(bx, by);
      const theta = Math.atan2(by, bx);
      const z = (Math.random() - 0.5) * 16 * (1 - r / (barLength * 1.2));

      // Color gradation: pure warm white/gold in very center to golden ivory
      const coreRatio = Math.min(1, r / (barLength * 0.8));
      const color = coreRatio < 0.35 
        ? '#FFFDF0' 
        : coreRatio < 0.7 
          ? '#FFE6A3' 
          : '#F7D08A';

      particles.push({
        armIndex: -1,
        r,
        theta,
        z,
        size: Math.random() * 2.2 + 0.8,
        color,
        isCore: true,
        isHII: false,
        x: 0,
        y: 0,
        currentZ: 0,
        dispX: 0,
        dispY: 0,
        dispZ: 0,
        vx: 0,
        vy: 0,
        vz: 0,
      });
    }

    // 2. Spiral Arms (Silver-blue, blue-gray, with pink/magenta H-II starburst knots)
    const armCount = count - coreCount;
    const numArms = 2; // Two main barred spiral arms sweeping outwards
    const b = 0.28;    // Logarithmic spiral pitch angle

    for (let i = 0; i < armCount; i++) {
      const arm = i % numArms;
      const armOffset = (arm * Math.PI) + (Math.PI * 0.12); // Start at bar tips
      // Radial distance distributed outward
      const t = Math.pow(Math.random(), 0.75); // denser near inner arms
      const r = maxRadius * 0.22 + t * (maxRadius * 0.78);
      
      // Logarithmic spiral angle + natural stellar scatter
      const spiralTheta = Math.log(r / (maxRadius * 0.22)) / b + armOffset;
      const scatter = (Math.random() - 0.5) * (0.28 + (r / maxRadius) * 0.22);
      const theta = spiralTheta + scatter;

      // Disk thickness decreases with radius
      const z = (Math.random() - 0.5) * 18 * Math.exp(-r / (maxRadius * 0.6));

      // Pink/magenta H-II nebula region chance (5% along arms, like photo!)
      const isHII = Math.random() < 0.055 && r > maxRadius * 0.3;
      
      // Color grading: silver-blue near inner arms, misty blue outer arms
      let color: string;
      if (isHII) {
        color = '#F472B6'; // Pink/magenta nebular cluster
      } else {
        const normR = r / maxRadius;
        if (normR < 0.45) {
          color = '#D1E3F8'; // Silver-blue highlight
        } else if (normR < 0.75) {
          color = '#93BBE5'; // Celestial blue
        } else {
          color = '#6488B4'; // Muted outer blue
        }
      }

      particles.push({
        armIndex: arm,
        r,
        theta,
        z,
        size: isHII ? (Math.random() * 2.2 + 1.2) : (Math.random() * 1.8 + 0.6),
        color,
        isCore: false,
        isHII,
        x: 0,
        y: 0,
        currentZ: 0,
        dispX: 0,
        dispY: 0,
        dispZ: 0,
        vx: 0,
        vy: 0,
        vz: 0,
      });
    }

    galaxyStateRef.current.particles = particles;
  }, []);

  // Trigger Gravitational Pulse (Shockwave disturbance)
  const triggerShockwave = useCallback(() => {
    const g = galaxyStateRef.current;
    g.shockwaves.push({
      x: g.centerX,
      y: g.centerY,
      radius: 0,
      maxRadius: 280,
      strength: 75,
    });
    setInteractionStatus('GRAVITATIONAL PULSE');
    setTimeout(() => setInteractionStatus('CONTINUOUS ORBIT'), 1800);
  }, []);

  // Flip Galaxy 180 degrees
  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => {
      const next = !prev;
      galaxyStateRef.current.targetFlipAngle = next ? Math.PI : 0;
      return next;
    });
    setInteractionStatus('AXIAL FLIP');
    setTimeout(() => setInteractionStatus('CONTINUOUS ORBIT'), 1600);
  }, []);

  // Reset View to Equilibrium Resting state
  const resetGalaxy = useCallback(() => {
    const g = galaxyStateRef.current;
    g.targetTiltX = 0.52;
    g.targetTiltY = 0;
    g.targetFlipAngle = 0;
    setIsFlipped(false);
    const canvas = canvasRef.current;
    if (canvas) {
      g.targetCenterX = canvas.clientWidth / 2;
      g.targetCenterY = canvas.clientHeight / 2;
    }
    setInteractionStatus('RESTORED TO EQUILIBRIUM');
    setTimeout(() => setInteractionStatus('CONTINUOUS ORBIT'), 1500);
  }, []);

  // Register parent controls
  useEffect(() => {
    if (onRegisterControls) {
      onRegisterControls({
        reset: resetGalaxy,
        replay: () => {
          triggerShockwave();
          setTimeout(toggleFlip, 400);
        },
      });
    }
  }, [onRegisterControls, resetGalaxy, triggerShockwave, toggleFlip]);

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

      initGalaxy(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const g = galaxyStateRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // 1. Continuous differential rotation
      const speedMultiplier = isRelaxMode ? 0.38 : 1.0;
      g.rotationAngle += g.baseSpeed * speedMultiplier;

      // Smooth camera recovery to target tilt/orientation via spring interpolation
      g.tiltX += (g.targetTiltX - g.tiltX) * 4.5 * dt;
      g.tiltY += (g.targetTiltY - g.tiltY) * 4.5 * dt;
      g.flipAngle += (g.targetFlipAngle - g.flipAngle) * 4.0 * dt;
      g.centerX += (g.targetCenterX - g.centerX) * 5.0 * dt;
      g.centerY += (g.targetCenterY - g.centerY) * 5.0 * dt;

      // Update shockwaves
      for (let s = g.shockwaves.length - 1; s >= 0; s--) {
        const sw = g.shockwaves[s];
        sw.radius += 240 * dt;
        sw.strength *= 0.94;
        if (sw.radius >= sw.maxRadius || sw.strength < 0.5) {
          g.shockwaves.splice(s, 1);
        }
      }

      // Repulsion radius and force parameters
      const repelRadius = isRelaxMode ? 65 : 95;
      const repelForce = isRelaxMode ? 85 : 170;
      const springK = 8.5;  // Hooke's constant pulling back to orbital home
      const damping = 0.88; // Viscous damping

      // 2. Physics & Projection for all particles
      const particles = g.particles;
      const cosPitch = Math.cos(g.tiltX);
      const sinPitch = Math.sin(g.tiltX);
      const cosYaw = Math.cos(g.tiltY + g.flipAngle);
      const sinYaw = Math.sin(g.tiltY + g.flipAngle);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Differential orbital angular velocity: core rotates slightly faster
        const omega = (0.24 / (p.r * 0.05 + 1)) * speedMultiplier;
        const currentTheta = p.theta + g.rotationAngle * (1 + omega * 0.35);

        // Theoretical undisturbed home 3D coordinate on rotating galaxy disk
        const homeDiskX = Math.cos(currentTheta) * p.r;
        const homeDiskY = Math.sin(currentTheta) * p.r;
        const homeDiskZ = p.z;

        // 3D rotation transform (Pitch & Yaw)
        // Rotate around Y axis (Yaw)
        const rotY_X = homeDiskX * cosYaw - homeDiskZ * sinYaw;
        const rotY_Z = homeDiskX * sinYaw + homeDiskZ * cosYaw;
        // Rotate around X axis (Pitch)
        const rotX_Y = homeDiskY * cosPitch - rotY_Z * sinPitch;
        const rotX_Z = homeDiskY * sinPitch + rotY_Z * cosPitch;

        // Base screen projected position
        const screenBaseX = g.centerX + rotY_X;
        const screenBaseY = g.centerY + rotX_Y;

        // Cursor Repulsion Physics
        if (g.pointerActive) {
          const dx = (screenBaseX + p.dispX) - g.pointerX;
          const dy = (screenBaseY + p.dispY) - g.pointerY;
          const dist = Math.hypot(dx, dy);

          if (dist < repelRadius && dist > 1) {
            const force = (1 - dist / repelRadius) * repelForce;
            const nx = dx / dist;
            const ny = dy / dist;
            p.vx += nx * force * dt;
            p.vy += ny * force * dt;
          }
        }

        // Gravitational Shockwave Physics
        for (let s = 0; s < g.shockwaves.length; s++) {
          const sw = g.shockwaves[s];
          const curX = screenBaseX + p.dispX;
          const curY = screenBaseY + p.dispY;
          const distToCenter = Math.hypot(curX - sw.x, curY - sw.y);
          const waveDist = Math.abs(distToCenter - sw.radius);

          if (waveDist < 25) {
            const push = (1 - waveDist / 25) * sw.strength;
            const nx = (curX - sw.x) / (distToCenter || 1);
            const ny = (curY - sw.y) / (distToCenter || 1);
            p.vx += nx * push * dt * 10;
            p.vy += ny * push * dt * 10;
          }
        }

        // Spring-Damped Harmonic Recovery to exact home orbital position
        // F = -k * displacement - damping * v
        const springForceX = -springK * p.dispX;
        const springForceY = -springK * p.dispY;

        p.vx += springForceX * dt;
        p.vy += springForceY * dt;
        p.vx *= damping;
        p.vy *= damping;

        p.dispX += p.vx * dt;
        p.dispY += p.vy * dt;

        // Final screen coordinates
        p.x = screenBaseX + p.dispX;
        p.y = screenBaseY + p.dispY;
        p.currentZ = rotX_Z;
      }

      // 3. Clear canvas & render celestial deep space
      ctx.fillStyle = '#06080D'; // Deep cosmic indigo-black
      ctx.fillRect(0, 0, width, height);

      // Render subtle background stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(width * 0.15, height * 0.2, 1, 1);
      ctx.fillRect(width * 0.85, height * 0.28, 1.2, 1.2);
      ctx.fillRect(width * 0.22, height * 0.8, 0.8, 0.8);
      ctx.fillRect(width * 0.78, height * 0.82, 1, 1);

      // Ambient galactic glow behind core
      const glowGrad = ctx.createRadialGradient(
        g.centerX, g.centerY, 4,
        g.centerX, g.centerY, Math.min(width, height) * 0.38
      );
      glowGrad.addColorStop(0, isRelaxMode ? 'rgba(255, 235, 175, 0.22)' : 'rgba(255, 235, 175, 0.32)');
      glowGrad.addColorStop(0.25, 'rgba(147, 187, 229, 0.14)');
      glowGrad.addColorStop(0.65, 'rgba(50, 75, 120, 0.05)');
      glowGrad.addColorStop(1, 'rgba(6, 8, 13, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw all galaxy particles
      // Use 'lighter' composite mode for radiant celestial additive blending
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) continue;

        // Depth perspective scale & alpha
        const depthAlpha = Math.max(0.3, Math.min(1.0, 0.7 + (p.currentZ / 120)));
        ctx.globalAlpha = depthAlpha * (isRelaxMode ? 0.75 : 0.95);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra soft glow for prominent core or H-II particles
        if (p.isCore && p.r < 30) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 248, 220, 0.15)';
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

  // Pointer event handlers for Grab, Drag, Tilt, Repulsion
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    canvas.setPointerCapture(e.pointerId);
    const g = galaxyStateRef.current;
    g.isDragging = true;
    g.lastPointerX = x;
    g.lastPointerY = y;
    g.pointerX = x;
    g.pointerY = y;
    g.pointerActive = true;
    setInteractionStatus('DRAGGING & ROTATING');
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

      // Drag horizontally to rotate azimuth (Yaw)
      g.tiltY += dx * 0.008;
      // Drag vertically to tilt inclination (Pitch)
      g.tiltX = Math.max(-0.2, Math.min(1.2, g.tiltX + dy * 0.006));

      // Drag velocity for momentum
      g.dragVx = dx;
      g.dragVy = dy;
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

    // Natural recovery: smoothly spring back to default comfortable angle (30 deg pitch, 0 yaw)
    g.targetTiltX = 0.52;
    g.targetTiltY = 0;
    setInteractionStatus('RECOVERING TO EQUILIBRIUM');
    setTimeout(() => setInteractionStatus('CONTINUOUS ORBIT'), 1400);
  };

  return (
    <div
      className={`relative w-full h-[320px] bg-[#06080D] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Status Bar */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 backdrop-blur-xs text-white rounded text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse"></span>
          <span>BARRED_SPIRAL // 2,600 STELLAR PARTICLES</span>
        </div>

        <div className="text-[10px] font-mono font-bold text-amber-200 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
          {interactionStatus}
        </div>
      </div>

      {/* Galaxy Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => {
          galaxyStateRef.current.pointerActive = false;
        }}
        className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
      />

      {/* Floating Action Controls */}
      <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-xs p-1 border border-white/15 rounded shadow-xs">
          {/* Relaxation Mode Toggle */}
          <button
            onClick={() => setIsRelaxMode(!isRelaxMode)}
            type="button"
            className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded ${
              isRelaxMode
                ? 'bg-amber-400 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Toggle calming relaxation mode"
          >
            <Moon className="w-3 h-3 text-amber-300" />
            <span>{isRelaxMode ? 'Relaxing On' : 'Relax Mode'}</span>
          </button>

          {/* 180 Flip */}
          <button
            onClick={toggleFlip}
            type="button"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
            title="Flip galaxy 180 degrees"
          >
            <Rotate3d className="w-3 h-3 text-cyan-400" />
            <span>Flip 180°</span>
          </button>

          {/* Gravitational Shockwave Pulse */}
          <button
            onClick={triggerShockwave}
            type="button"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
            title="Create gravitational shockwave ripple"
          >
            <Zap className="w-3 h-3 text-amber-300" />
            <span>Grav Pulse</span>
          </button>

          {/* Reset View */}
          <button
            onClick={resetGalaxy}
            type="button"
            className="p-1 hover:bg-white/20 text-white/80 transition-colors cursor-pointer rounded"
            title="Reset to default resting orientation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] font-mono text-white/50 bg-black/60 px-2 py-1 rounded border border-white/10 hidden sm:block">
          HOVER TO REPEL · DRAG TO TILT & ROTATE
        </div>
      </div>
    </div>
  );
};
