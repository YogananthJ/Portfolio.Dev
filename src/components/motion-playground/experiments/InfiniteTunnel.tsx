import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

interface InfiniteTunnelProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
  className?: string;
}

export const InfiniteTunnel: React.FC<InfiniteTunnelProps> = ({
  onRegisterControls,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedTier, setSpeedTier] = useState<'relaxing' | 'cruise' | 'warp'>('relaxing');
  const [geometryType, setGeometryType] = useState<'octagon' | 'hexagon' | 'circle'>('octagon');
  const [colorTheme, setColorTheme] = useState<'silver' | 'slate' | 'charcoal'>('silver');

  const stateRef = useRef({
    isPlaying: true,
    speed: 65, // gentle relaxing default speed
    geometryType: 'octagon' as 'octagon' | 'hexagon' | 'circle',
    colorTheme: 'silver' as 'silver' | 'slate' | 'charcoal',

    // Continuous modulo depth
    travelDistance: 0,
    totalRingCount: 30,
    ringSpacing: 42,

    // Pointer-controlled camera parallax with damped spring return
    camX: 0,
    camY: 0,
    targetCamX: 0,
    targetCamY: 0,
    camVx: 0,
    camVy: 0,

    time: 0,
  });

  stateRef.current.isPlaying = isPlaying;
  stateRef.current.geometryType = geometryType;
  stateRef.current.colorTheme = colorTheme;
  stateRef.current.speed = speedTier === 'relaxing' ? 65 : speedTier === 'cruise' ? 140 : 250;

  // Reset function
  const handleReset = useCallback(() => {
    stateRef.current.travelDistance = 0;
    stateRef.current.targetCamX = 0;
    stateRef.current.targetCamY = 0;
    stateRef.current.camX = 0;
    stateRef.current.camY = 0;
    stateRef.current.camVx = 0;
    stateRef.current.camVy = 0;
  }, []);

  // Register parent controls
  useEffect(() => {
    if (onRegisterControls) {
      onRegisterControls({
        reset: handleReset,
        replay: () => {
          setIsPlaying(true);
          handleReset();
        },
      });
    }
  }, [onRegisterControls, handleReset]);

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
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.045);
      lastTime = now;

      const s = stateRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (s.isPlaying) {
        s.time += dt;
        s.travelDistance += s.speed * dt;
      }

      // Camera parallax spring-damping back to exact center (0, 0)
      const camSpringK = 18.0;
      const camDamping = 0.84;
      const forceCamX = -camSpringK * (s.camX - s.targetCamX);
      const forceCamY = -camSpringK * (s.camY - s.targetCamY);
      s.camVx += forceCamX * dt;
      s.camVy += forceCamY * dt;
      s.camVx *= camDamping;
      s.camVy *= camDamping;
      s.camX += s.camVx * dt;
      s.camY += s.camVy * dt;

      const centerX = width / 2 + s.camX;
      const centerY = height / 2 + s.camY;
      const focalLength = 310;

      // Deep dark background
      ctx.fillStyle = '#06080D'; // Deep charcoal/obsidian
      ctx.fillRect(0, 0, width, height);

      // Distant horizon vanishing point glow
      const horizonGrad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, 130);
      if (s.colorTheme === 'silver') {
        horizonGrad.addColorStop(0, 'rgba(241, 245, 249, 0.16)');
        horizonGrad.addColorStop(0.5, 'rgba(148, 163, 184, 0.06)');
        horizonGrad.addColorStop(1, 'rgba(6, 8, 13, 0)');
      } else if (s.colorTheme === 'slate') {
        horizonGrad.addColorStop(0, 'rgba(125, 211, 252, 0.18)');
        horizonGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.06)');
        horizonGrad.addColorStop(1, 'rgba(6, 8, 13, 0)');
      } else {
        horizonGrad.addColorStop(0, 'rgba(148, 163, 184, 0.14)');
        horizonGrad.addColorStop(0.5, 'rgba(71, 85, 105, 0.05)');
        horizonGrad.addColorStop(1, 'rgba(6, 8, 13, 0)');
      }
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, 0, width, height);

      // Perspective rings with seamless modulo recycling
      const numRings = s.totalRingCount;
      const spacing = s.ringSpacing;
      const maxZ = numRings * spacing;
      const offset = s.travelDistance % maxZ;

      // Color palette definitions
      let r = 226, g = 232, b = 240; // Silver
      if (s.colorTheme === 'slate') {
        r = 148; g = 197; b = 230; // Muted blue-gray
      } else if (s.colorTheme === 'charcoal') {
        r = 160; g = 174; b = 192; // Charcoal
      }

      // Collect ring depths and sort from back to front
      const ringDepths: { z: number; ringIndex: number }[] = [];
      for (let i = 0; i < numRings; i++) {
        // Continuous depth coordinate with modulo recycling
        let z = maxZ - ((i * spacing + offset) % maxZ);
        if (z < 16) z += maxZ;
        ringDepths.push({ z, ringIndex: i });
      }
      ringDepths.sort((a, b) => b.z - a.z); // Render from furthest to nearest

      for (let idx = 0; idx < ringDepths.length; idx++) {
        const { z, ringIndex } = ringDepths[idx];
        if (z < 18) continue;

        const scale = focalLength / z;
        const ringRadius = 260 * scale;

        // Smooth depth fog: fades in at maxZ, fades out before clipping at near plane
        let alpha = Math.min(1.0, (1 - z / maxZ) * 1.3);
        if (z > maxZ - 120) {
          // Smooth fade-in at the far horizon (prevents pop-in)
          alpha *= Math.max(0, (maxZ - z) / 120);
        }
        if (z < 60) {
          // Smooth fade-out near the eye (prevents sudden pop-out)
          alpha *= Math.max(0, (z - 18) / 42);
        }

        if (alpha <= 0.005) continue;

        // Subtle twist along depth
        const ringTwist = ringIndex * 0.045 + s.time * 0.15;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(ringTwist);

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.75})`;
        ctx.lineWidth = Math.max(0.8, 2.2 * scale);

        ctx.beginPath();
        if (s.geometryType === 'octagon') {
          const sides = 8;
          for (let k = 0; k < sides; k++) {
            const angle = (k / sides) * Math.PI * 2;
            const px = Math.cos(angle) * ringRadius;
            const py = Math.sin(angle) * ringRadius;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
        } else if (s.geometryType === 'hexagon') {
          const sides = 6;
          for (let k = 0; k < sides; k++) {
            const angle = (k / sides) * Math.PI * 2;
            const px = Math.cos(angle) * ringRadius;
            const py = Math.sin(angle) * ringRadius;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
        } else {
          // Circle
          ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        }
        ctx.stroke();

        // Longitudinal guide rails / grid connectors on selected rings
        if (ringIndex % 4 === 0) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.9})`;
          const numDots = s.geometryType === 'hexagon' ? 6 : 8;
          for (let k = 0; k < numDots; k++) {
            const angle = (k / numDots) * Math.PI * 2;
            const px = Math.cos(angle) * ringRadius;
            const py = Math.sin(angle) * ringRadius;
            ctx.beginPath();
            ctx.arc(px, py, Math.max(0.6, 2.0 * scale), 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Subtle pointer camera parallax
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    // Subtle parallax offset
    stateRef.current.targetCamX = nx * 38;
    stateRef.current.targetCamY = ny * 38;
  };

  const handlePointerLeave = () => {
    // Return to exact center with damped spring
    stateRef.current.targetCamX = 0;
    stateRef.current.targetCamY = 0;
  };

  return (
    <div
      className={`relative w-full h-[320px] bg-[#06080D] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Status */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 backdrop-blur-xs text-white rounded text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse"></span>
          <span>INFINITE_TUNNEL // MODULO DEPTH RECYCLING</span>
        </div>

        <div className="text-[10px] font-mono font-bold text-slate-300 bg-black/60 border border-white/15 px-2 py-0.5 rounded">
          {speedTier.toUpperCase()} // {geometryType.toUpperCase()}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full block touch-none cursor-pointer"
      />

      {/* Bottom Controls */}
      <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-xs p-1 border border-white/15 rounded shadow-xs">
          {/* Speed Presets */}
          {(['relaxing', 'cruise', 'warp'] as const).map((sp) => (
            <button
              key={sp}
              onClick={() => setSpeedTier(sp)}
              type="button"
              className={`px-2 py-1 text-[10px] font-mono font-bold uppercase transition-colors rounded cursor-pointer ${
                speedTier === sp
                  ? 'bg-slate-200 text-black shadow-xs'
                  : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {sp}
            </button>
          ))}

          {/* Geometry Presets */}
          {(['octagon', 'hexagon', 'circle'] as const).map((geo) => (
            <button
              key={geo}
              onClick={() => setGeometryType(geo)}
              type="button"
              className={`px-2 py-1 text-[10px] font-mono font-bold uppercase transition-colors rounded cursor-pointer ${
                geometryType === geo
                  ? 'bg-slate-400 text-black'
                  : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {geo}
            </button>
          ))}

          {/* Color Presets */}
          {(['silver', 'slate', 'charcoal'] as const).map((col) => (
            <button
              key={col}
              onClick={() => setColorTheme(col)}
              type="button"
              className={`px-2 py-1 text-[10px] font-mono font-bold uppercase transition-colors rounded cursor-pointer ${
                colorTheme === col
                  ? 'bg-slate-300 text-black'
                  : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {col}
            </button>
          ))}

          {/* Reset */}
          <button
            onClick={handleReset}
            type="button"
            className="p-1 hover:bg-white/20 text-white/80 transition-colors cursor-pointer rounded"
            title="Reset tunnel view"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] font-mono text-white/50 bg-black/60 px-2 py-1 rounded border border-white/10 hidden sm:block">
          MOVE MOUSE FOR CAMERA PARALLAX
        </div>
      </div>
    </div>
  );
};
