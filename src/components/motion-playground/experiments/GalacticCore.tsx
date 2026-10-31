import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, RefreshCw, Zap, Rotate3d, Sliders, CheckCircle2 } from 'lucide-react';
import { useAnimationLoop } from '../animationRegistry';
import { NormalizedPointerController, NormalizedPointerState } from '../normalizedPointer';

interface GalacticCoreProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
  className?: string;
}

interface GalacticParticle {
  // Immutable Home Reference Parameters (Never modified after generation)
  readonly id: number;
  readonly armIndex: number; // -1 for core bar, 0 or 1 for spiral arms
  readonly baseR: number;    // Immutable radial distance from nucleus
  readonly baseTheta: number;// Immutable base polar angle
  readonly baseZ: number;    // Immutable vertical disk thickness
  readonly size: number;
  readonly color: string;
  readonly isCore: boolean;
  readonly isHII: boolean;   // pink/magenta star-forming nursery knot
  readonly isDustLane: boolean;

  // Dynamic state & displacement (Spring-damper physics relative to dynamic orbit)
  dispX: number;
  dispY: number;
  vx: number;
  vy: number;

  // Final rendered coordinates
  x: number;
  y: number;
  currentZ: number;
}

export const GalacticCore: React.FC<GalacticCoreProps> = ({
  onRegisterControls,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // User configurable parameters
  const [repelRadius, setRepelRadius] = useState<number>(135);
  const [repelStrength, setRepelStrength] = useState<number>(3400);
  const [dampingFactor, setDampingFactor] = useState<number>(0.88);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [interactionState, setInteractionState] = useState<'NORMAL' | 'INTERACTING' | 'RECOVERING'>('NORMAL');
  const [statusMessage, setStatusMessage] = useState<string>('KEPLERIAN ORBIT');

  const pointerControllerRef = useRef<NormalizedPointerController | null>(null);

  // Default resting transforms (Immutable targets for recovery)
  const DEFAULT_TILT_X = 0.48; // ~27.5 degrees pitch
  const DEFAULT_TILT_Y = 0;    // 0 degrees yaw
  const DEFAULT_FLIP = 0;

  const galaxyStateRef = useRef({
    particles: [] as GalacticParticle[],
    rotationAngle: 0,
    baseSpeed: 0.0034,

    // Center coordinates
    centerX: 0,
    centerY: 0,
    defaultCenterX: 0,
    defaultCenterY: 0,

    // Orientation angles
    tiltX: DEFAULT_TILT_X,
    tiltY: DEFAULT_TILT_Y,
    flipAngle: DEFAULT_FLIP,
    targetTiltX: DEFAULT_TILT_X,
    targetTiltY: DEFAULT_TILT_Y,
    targetFlipAngle: DEFAULT_FLIP,

    // Dynamic recovery flags
    isDragging: false,
    dragStartPointerX: 0,
    dragStartPointerY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    pointerActive: false,
    pointerX: -9999,
    pointerY: -9999,
    recoveryTimeLeft: 0, // When user releases, smooth recovery timer runs

    // Shockwaves
    shockwaves: [] as { x: number; y: number; radius: number; maxRadius: number; strength: number }[],
    time: 0,

    // Config params
    repelRadius: 135,
    repelStrength: 3400,
    damping: 0.88,
  });

  // Sync state refs
  galaxyStateRef.current.repelRadius = repelRadius;
  galaxyStateRef.current.repelStrength = repelStrength;
  galaxyStateRef.current.damping = dampingFactor;

  // Initialize Barred Spiral Galaxy particles matching photographic reference
  const initGalaxy = useCallback((width: number, height: number) => {
    const particles: GalacticParticle[] = [];
    const count = 3300; // Dense stellar population
    const maxRadius = Math.min(width, height) * 0.46;

    const centerX = width / 2;
    const centerY = height / 2;

    galaxyStateRef.current.centerX = centerX;
    galaxyStateRef.current.centerY = centerY;
    galaxyStateRef.current.defaultCenterX = centerX;
    galaxyStateRef.current.defaultCenterY = centerY;

    // 1. Central Bar & Bulge: Dense golden-ivory nucleus
    const coreCount = 1000;
    const barLength = maxRadius * 0.28;
    const barWidth = maxRadius * 0.12;

    for (let i = 0; i < coreCount; i++) {
      const u = (Math.random() - 0.5) * 2;
      const bx = u * barLength + (Math.random() - 0.5) * 14;
      const by = (Math.random() - 0.5) * barWidth * Math.sqrt(Math.max(0, 1 - (u * 0.88) ** 2));
      const baseR = Math.hypot(bx, by);
      const baseTheta = Math.atan2(by, bx);
      const baseZ = (Math.random() - 0.5) * 16 * (1 - baseR / (barLength * 1.3));

      // Color gradation
      const coreRatio = Math.min(1, baseR / (barLength * 0.85));
      let color = '#FFFDF0';
      if (coreRatio > 0.65) {
        color = '#FDE68A';
      } else if (coreRatio > 0.3) {
        color = '#FEF3C7';
      }

      particles.push({
        id: i,
        armIndex: -1,
        baseR,
        baseTheta,
        baseZ,
        size: Math.random() * 2.2 + 0.8,
        color,
        isCore: true,
        isHII: false,
        isDustLane: false,
        dispX: 0,
        dispY: 0,
        vx: 0,
        vy: 0,
        x: 0,
        y: 0,
        currentZ: 0,
      });
    }

    // 2. Sweeping Logarithmic Spiral Arms & Dust Lanes (silver-blue + pink/magenta knots)
    const armCount = count - coreCount;
    const numArms = 2;
    const b = 0.26;

    for (let i = 0; i < armCount; i++) {
      const arm = i % numArms;
      const armOffset = (arm * Math.PI) + (Math.PI * 0.14);
      const t = Math.pow(Math.random(), 0.72);
      const baseR = maxRadius * 0.22 + t * (maxRadius * 0.78);

      const spiralTheta = Math.log(baseR / (maxRadius * 0.22)) / b + armOffset;
      const scatter = (Math.random() - 0.5) * (0.24 + (baseR / maxRadius) * 0.20);
      const baseTheta = spiralTheta + scatter;

      const baseZ = (Math.random() - 0.5) * 16 * Math.exp(-baseR / (maxRadius * 0.65));

      const isHII = Math.random() < 0.065 && baseR > maxRadius * 0.28;
      const isDustLane = Math.random() < 0.045 && baseR > maxRadius * 0.25;

      let color = '#D1E3F8';
      let size = Math.random() * 1.8 + 0.8;

      if (isHII) {
        color = '#F472B6'; // Pink/magenta starburst knot
        size = Math.random() * 2.3 + 1.2;
      } else if (isDustLane) {
        color = '#334155'; // Dark dust accent
        size = Math.random() * 1.5 + 0.7;
      } else {
        const normR = baseR / maxRadius;
        if (normR < 0.45) {
          color = '#E2E8F0';
        } else if (normR < 0.75) {
          color = '#93BBE5';
        } else {
          color = '#64748B';
        }
      }

      particles.push({
        id: coreCount + i,
        armIndex: arm,
        baseR,
        baseTheta,
        baseZ,
        size,
        color,
        isCore: false,
        isHII,
        isDustLane,
        dispX: 0,
        dispY: 0,
        vx: 0,
        vy: 0,
        x: 0,
        y: 0,
        currentZ: 0,
      });
    }

    galaxyStateRef.current.particles = particles;
  }, []);

  // 180° Flip Interaction
  const triggerFlip = useCallback(() => {
    const g = galaxyStateRef.current;
    const isCurrentlyFlipped = Math.abs(g.targetFlipAngle - Math.PI) < 0.1;
    g.targetFlipAngle = isCurrentlyFlipped ? 0 : Math.PI;

    setInteractionState('INTERACTING');
    setStatusMessage(isCurrentlyFlipped ? 'RETURNING 180°' : 'FLIPPING 180°');

    // Auto recover back to standard view after 2.8s
    setTimeout(() => {
      g.targetFlipAngle = 0;
      setInteractionState('RECOVERING');
      setStatusMessage('RECOVERING SPIRAL ORBIT');
      setTimeout(() => {
        setInteractionState('NORMAL');
        setStatusMessage('KEPLERIAN ORBIT');
      }, 1400);
    }, 2800);
  }, []);

  // Gravitational Disruption Impulse
  const triggerShake = useCallback(() => {
    const g = galaxyStateRef.current;
    for (let i = 0; i < g.particles.length; i++) {
      const p = g.particles[i];
      const angle = Math.random() * Math.PI * 2;
      const speed = 110 + Math.random() * 160;
      p.vx += Math.cos(angle) * speed;
      p.vy += Math.sin(angle) * speed;
    }

    g.shockwaves.push({
      x: g.centerX,
      y: g.centerY,
      radius: 4,
      maxRadius: Math.min(g.centerX, g.centerY) * 1.3,
      strength: 180,
    });

    setInteractionState('INTERACTING');
    setStatusMessage('GRAVITATIONAL DISRUPTION');

    setTimeout(() => {
      setInteractionState('RECOVERING');
      setStatusMessage('RECOVERING SPIRAL ORBIT');
    }, 800);

    setTimeout(() => {
      setInteractionState('NORMAL');
      setStatusMessage('KEPLERIAN ORBIT');
    }, 2400);
  }, []);

  // Reset to original normal baseline
  const handleReset = useCallback(() => {
    const g = galaxyStateRef.current;
    g.targetTiltX = DEFAULT_TILT_X;
    g.targetTiltY = DEFAULT_TILT_Y;
    g.targetFlipAngle = DEFAULT_FLIP;
    g.tiltX = DEFAULT_TILT_X;
    g.tiltY = DEFAULT_TILT_Y;
    g.flipAngle = DEFAULT_FLIP;
    g.centerX = g.defaultCenterX;
    g.centerY = g.defaultCenterY;
    g.shockwaves = [];
    g.recoveryTimeLeft = 0;

    for (let i = 0; i < g.particles.length; i++) {
      const p = g.particles[i];
      p.dispX = 0;
      p.dispY = 0;
      p.vx = 0;
      p.vy = 0;
    }

    setInteractionState('NORMAL');
    setStatusMessage('KEPLERIAN ORBIT');
  }, [DEFAULT_TILT_X, DEFAULT_TILT_Y, DEFAULT_FLIP]);

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

  // Canvas Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
    return () => window.removeEventListener('resize', handleResize);
  }, [initGalaxy]);

  // Setup Normalized Pointer Controller
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = new NormalizedPointerController({
      onPointerDown: (state) => {
        const g = galaxyStateRef.current;
        g.isDragging = true;
        g.lastPointerX = state.x;
        g.lastPointerY = state.y;
        g.pointerX = state.x;
        g.pointerY = state.y;
        g.pointerActive = true;
        g.recoveryTimeLeft = 0;

        setInteractionState('INTERACTING');
        setStatusMessage('DRAGGING 3D PERSPECTIVE');
      },
      onPointerMove: (state) => {
        const g = galaxyStateRef.current;
        g.pointerX = state.x;
        g.pointerY = state.y;
        g.pointerActive = state.isInside;

        if (g.isDragging) {
          const dx = state.x - g.lastPointerX;
          const dy = state.y - g.lastPointerY;
          g.lastPointerX = state.x;
          g.lastPointerY = state.y;

          // Drag tilts orientation
          g.targetTiltY += dx * 0.007;
          g.targetTiltX = Math.max(0.12, Math.min(1.35, g.targetTiltX + dy * 0.005));
        }
      },
      onPointerUp: () => {
        const g = galaxyStateRef.current;
        g.isDragging = false;
        g.pointerActive = false;
        g.pointerX = -9999;
        g.pointerY = -9999;

        // Initiate smooth recovery back to default resting orientation
        g.targetTiltX = DEFAULT_TILT_X;
        g.targetTiltY = DEFAULT_TILT_Y;
        g.targetFlipAngle = DEFAULT_FLIP;
        g.recoveryTimeLeft = 1.8;

        setInteractionState('RECOVERING');
        setStatusMessage('RECOVERING TO EQUILIBRIUM');
      },
      onPointerLeave: () => {
        const g = galaxyStateRef.current;
        g.pointerActive = false;
        g.pointerX = -9999;
        g.pointerY = -9999;

        if (!g.isDragging) {
          g.targetTiltX = DEFAULT_TILT_X;
          g.targetTiltY = DEFAULT_TILT_Y;
          g.targetFlipAngle = DEFAULT_FLIP;
          g.recoveryTimeLeft = 1.8;
          setInteractionState('RECOVERING');
          setStatusMessage('RECOVERING TO EQUILIBRIUM');
        }
      },
      onPointerCancel: () => {
        const g = galaxyStateRef.current;
        g.isDragging = false;
        g.pointerActive = false;
        g.pointerX = -9999;
        g.pointerY = -9999;
        g.targetTiltX = DEFAULT_TILT_X;
        g.targetTiltY = DEFAULT_TILT_Y;
        g.targetFlipAngle = DEFAULT_FLIP;
        g.recoveryTimeLeft = 1.8;
        setInteractionState('RECOVERING');
        setStatusMessage('RECOVERING TO EQUILIBRIUM');
      },
    });

    controller.attach(canvas);
    pointerControllerRef.current = controller;

    return () => {
      controller.detach();
    };
  }, [DEFAULT_TILT_X, DEFAULT_TILT_Y, DEFAULT_FLIP]);

  // Unified 60fps Loop via animationRegistry
  const handleRenderFrame = useCallback((_timestamp: number, dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const g = galaxyStateRef.current;
    g.time += dt;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;

    // 1. Uninterrupted continuous Keplerian idle rotation
    // Idle rotation of stars around galactic core is separate from camera orientation
    g.rotationAngle += g.baseSpeed;

    // 2. Smooth Spring-Damper / Lerp Return to Default Orientation
    // When dragging ends, tilt angles smoothly glide back to default without stopping rotation
    const tiltRecoverySpeed = g.isDragging ? 8.0 : 3.8;
    g.tiltX += (g.targetTiltX - g.tiltX) * tiltRecoverySpeed * dt;
    g.tiltY += (g.targetTiltY - g.tiltY) * tiltRecoverySpeed * dt;
    g.flipAngle += (g.targetFlipAngle - g.flipAngle) * 4.5 * dt;

    // Center recovery
    g.centerX += (g.defaultCenterX - g.centerX) * 4.0 * dt;
    g.centerY += (g.defaultCenterY - g.centerY) * 4.0 * dt;

    // Track recovery completion
    if (g.recoveryTimeLeft > 0) {
      g.recoveryTimeLeft -= dt;
      if (g.recoveryTimeLeft <= 0) {
        g.recoveryTimeLeft = 0;
        if (!g.isDragging && !g.pointerActive) {
          setInteractionState('NORMAL');
          setStatusMessage('KEPLERIAN ORBIT');
        }
      }
    }

    // Update shockwaves
    for (let w = g.shockwaves.length - 1; w >= 0; w--) {
      const sw = g.shockwaves[w];
      sw.radius += 280 * dt;
      sw.strength *= 0.94;
      if (sw.radius >= sw.maxRadius || sw.strength < 0.6) {
        g.shockwaves.splice(w, 1);
      }
    }

    // 3D camera projection trigonometry
    const cosPitch = Math.cos(g.tiltX);
    const sinPitch = Math.sin(g.tiltX);
    const cosYaw = Math.cos(g.tiltY + g.flipAngle);
    const sinYaw = Math.sin(g.tiltY + g.flipAngle);

    // Physics parameters
    const rRadius = g.repelRadius;
    const rStrength = g.repelStrength;
    const springK = 9.8;    // Hooke's return stiffness to undisturbed orbit
    const damping = g.damping; // Viscous decay

    const particles = g.particles;
    let maxDisplacement = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Keplerian differential rotation: inner stars orbit slightly faster
      const keplerFactor = 0.28 / (p.baseR * 0.038 + 1);
      const currentTheta = p.baseTheta + g.rotationAngle * (1 + keplerFactor * 0.4);

      // Undisturbed polar coordinate on galaxy disk
      const diskX = Math.cos(currentTheta) * p.baseR;
      const diskY = Math.sin(currentTheta) * p.baseR;
      const diskZ = p.baseZ;

      // 3D Rotation Transform (Yaw followed by Pitch)
      const rotY_X = diskX * cosYaw - diskZ * sinYaw;
      const rotY_Z = diskX * sinYaw + diskZ * cosYaw;
      const rotX_Y = diskY * cosPitch - rotY_Z * sinPitch;
      const rotX_Z = diskY * sinPitch + rotY_Z * cosPitch;

      // Base home screen coordinates for this frame
      const homeX = g.centerX + rotY_X;
      const homeY = g.centerY + rotX_Y;

      // Current particle position including dynamic displacement
      const curX = homeX + p.dispX;
      const curY = homeY + p.dispY;

      // --- MOUSE REPULSION PHYSICS (Decisive clearing void with non-linear distance falloff) ---
      if (g.pointerActive && g.pointerX > -1000) {
        const dx = curX - g.pointerX;
        const dy = curY - g.pointerY;
        const distSq = dx * dx + dy * dy;
        const rRadiusSq = rRadius * rRadius;

        if (distSq < rRadiusSq && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;

          // Strong non-linear quadratic-like falloff: maximum punch at center, clean dropoff at edge
          const proximity = 1 - dist / rRadius;
          const force = Math.pow(proximity, 1.8) * (rStrength * 3.6);

          // Apply velocity impulse
          p.vx += nx * force * dt;
          p.vy += ny * force * dt;

          // Immediate displacement kick to create an instantaneous crisp void
          const kick = proximity * 28.0 * Math.min(1.0, dt * 60);
          p.dispX += nx * kick;
          p.dispY += ny * kick;
        }
      }

      // --- GRAVITATIONAL SHOCKWAVE ---
      for (let s = 0; s < g.shockwaves.length; s++) {
        const sw = g.shockwaves[s];
        const dxCenter = curX - sw.x;
        const dyCenter = curY - sw.y;
        const distToCenter = Math.hypot(dxCenter, dyCenter) || 0.001;
        const waveDist = Math.abs(distToCenter - sw.radius);

        if (waveDist < 30) {
          const push = (1 - waveDist / 30) * sw.strength;
          const nx = dxCenter / distToCenter;
          const ny = dyCenter / distToCenter;
          p.vx += nx * push * 9 * dt;
          p.vy += ny * push * 9 * dt;
        }
      }

      // --- ANALYTICAL SPRING-DAMPER RECOVERY TO BASELINE ORBIT ---
      // F = -k*x - c*v (Hooke's restoring spring force + viscous velocity damping)
      const springK = 22.0;               // Restoring spring stiffness to exact orbital coordinate
      const dampingC = g.damping * 5.4;   // Viscous damping coefficient

      const accelX = -springK * p.dispX - dampingC * p.vx;
      const accelY = -springK * p.dispY - dampingC * p.vy;

      p.vx += accelX * dt;
      p.vy += accelY * dt;

      // Exponential time-step normalized drag to avoid numerical divergence
      const decay = Math.exp(-dampingC * dt);
      p.vx *= decay;
      p.vy *= decay;

      // Velocity clamping to prevent any runaway explosions
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > 750) {
        p.vx = (p.vx / speed) * 750;
        p.vy = (p.vy / speed) * 750;
      }

      p.dispX += p.vx * dt;
      p.dispY += p.vy * dt;

      // Clamping displacement to prevent flying off canvas
      const currentDisp = Math.hypot(p.dispX, p.dispY);
      if (currentDisp > 260) {
        p.dispX = (p.dispX / currentDisp) * 260;
        p.dispY = (p.dispY / currentDisp) * 260;
      }

      // Snap micro-displacement to 0 when near rest to eliminate jitter
      if (currentDisp < 0.08 && speed < 0.12) {
        p.dispX = 0;
        p.dispY = 0;
        p.vx = 0;
        p.vy = 0;
      }

      if (currentDisp > maxDisplacement) {
        maxDisplacement = currentDisp;
      }

      p.x = homeX + p.dispX;
      p.y = homeY + p.dispY;
      p.currentZ = rotX_Z;
    }

    // --- RENDERING PASS ---
    ctx.fillStyle = '#05070D'; // Deep cosmic black
    ctx.fillRect(0, 0, width, height);

    // Ambient galactic core radiance
    const glowGrad = ctx.createRadialGradient(
      g.centerX, g.centerY, 4,
      g.centerX, g.centerY, Math.min(width, height) * 0.44
    );
    glowGrad.addColorStop(0, 'rgba(255, 238, 185, 0.35)');
    glowGrad.addColorStop(0.25, 'rgba(147, 187, 229, 0.16)');
    glowGrad.addColorStop(0.68, 'rgba(45, 65, 105, 0.05)');
    glowGrad.addColorStop(1, 'rgba(5, 7, 13, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, height);

    // Pointer repulsion radius field ring indicator when pointer is active
    if (g.pointerActive && g.pointerX > -1000) {
      ctx.beginPath();
      ctx.arc(g.pointerX, g.pointerY, rRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(253, 230, 138, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(g.pointerX, g.pointerY, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(253, 230, 138, 0.7)';
      ctx.fill();
    }

    // Draw all particles with additive blending
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.x < -15 || p.x > width + 15 || p.y < -15 || p.y > height + 15) continue;

      const depthAlpha = Math.max(0.28, Math.min(1.0, 0.72 + (p.currentZ / 135)));
      ctx.globalAlpha = depthAlpha * 0.95;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Core bloom
      if (p.isCore && p.baseR < 24) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 248, 220, 0.15)';
        ctx.fill();
      }
    }

    // Reset composite mode
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
  }, []);

  // Register in unified animation loop
  useAnimationLoop('galactic-core', handleRenderFrame, true, 20);

  return (
    <div
      className={`relative w-full h-[320px] bg-[#05070D] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Status & Controls */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white border border-white/10 rounded text-[10px] font-mono">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              interactionState === 'NORMAL'
                ? 'bg-amber-400 animate-pulse'
                : interactionState === 'INTERACTING'
                ? 'bg-rose-400'
                : 'bg-emerald-400'
            }`}
          ></span>
          <span>BARRED_SPIRAL // 3,300 BODIES</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowControls((prev) => !prev)}
            className={`p-1 rounded text-[10px] font-mono flex items-center gap-1 transition-colors border ${
              showControls
                ? 'bg-amber-400 text-black border-amber-400'
                : 'bg-black/70 text-zinc-300 border-white/15 hover:border-amber-400/50'
            }`}
            title="Toggle physics parameters tuning"
          >
            <Sliders className="w-3 h-3" />
            <span>TUNING</span>
          </button>

          <div
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-colors ${
              interactionState === 'NORMAL'
                ? 'text-amber-200 bg-black/60 border-amber-400/30'
                : interactionState === 'INTERACTING'
                ? 'text-rose-300 bg-black/70 border-rose-500/40'
                : 'text-emerald-300 bg-black/70 border-emerald-500/40'
            }`}
          >
            {statusMessage}
          </div>
        </div>
      </div>

      {/* Physics Tuning Panel Drawer */}
      {showControls && (
        <div className="absolute top-10 right-3 z-20 w-64 bg-black/85 backdrop-blur-md border border-white/20 p-3 rounded text-[11px] font-mono text-zinc-200 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              PHYSICS PARAMETERS
            </span>
            <button
              onClick={() => setShowControls(false)}
              className="text-zinc-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-zinc-400">Repulsion Force:</span>
              <span className="text-amber-300">{repelStrength} px/s²</span>
            </div>
            <input
              type="range"
              min="1000"
              max="6000"
              step="200"
              value={repelStrength}
              onChange={(e) => setRepelStrength(Number(e.target.value))}
              className="w-full h-1 bg-zinc-700 accent-amber-400 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-zinc-400">Repulsion Radius:</span>
              <span className="text-amber-300">{repelRadius} px</span>
            </div>
            <input
              type="range"
              min="70"
              max="200"
              step="5"
              value={repelRadius}
              onChange={(e) => setRepelRadius(Number(e.target.value))}
              className="w-full h-1 bg-zinc-700 accent-amber-400 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-zinc-400">Recovery Damping:</span>
              <span className="text-amber-300">{dampingFactor.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="0.95"
              step="0.01"
              value={dampingFactor}
              onChange={(e) => setDampingFactor(Number(e.target.value))}
              className="w-full h-1 bg-zinc-700 accent-amber-400 rounded cursor-pointer"
            />
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400 border-t border-white/10">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              Auto Home Return Active
            </span>
          </div>
        </div>
      )}

      {/* Main Simulation Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
      />

      {/* Bottom Interactive Controls */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <button
            onClick={triggerFlip}
            className="flex items-center gap-1 px-2.5 py-1 bg-black/75 hover:bg-black/90 text-amber-200 hover:text-white border border-white/15 rounded text-[10px] font-mono transition-colors"
            title="Smooth 180° flip with auto-return"
          >
            <Rotate3d className="w-3 h-3" />
            <span>FLIP 180°</span>
          </button>

          <button
            onClick={triggerShake}
            className="flex items-center gap-1 px-2.5 py-1 bg-black/75 hover:bg-black/90 text-rose-300 hover:text-rose-100 border border-white/15 rounded text-[10px] font-mono transition-colors"
            title="Trigger gravitational disruption wave"
          >
            <Zap className="w-3 h-3" />
            <span>SHOCKWAVE</span>
          </button>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1 bg-black/75 hover:bg-black/90 text-zinc-300 hover:text-white border border-white/15 rounded text-[10px] font-mono transition-colors"
          title="Reset to baseline equilibrium"
        >
          <RefreshCw className="w-3 h-3" />
          <span>RESET HOME</span>
        </button>
      </div>
    </div>
  );
};
