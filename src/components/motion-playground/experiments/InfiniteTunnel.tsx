import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Compass, Palette, FastForward } from 'lucide-react';

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
  const [speedTier, setSpeedTier] = useState<'relax' | 'cruise' | 'flow'>('relax');
  const [geometryType, setGeometryType] = useState<'octagon' | 'hexagon' | 'circle'>('octagon');
  const [colorTheme, setColorTheme] = useState<'silver' | 'azure' | 'warm'>('silver');

  const stateRef = useRef({
    isPlaying: true,
    speed: 120, // speed units / sec
    geometryType: 'octagon' as 'octagon' | 'hexagon' | 'circle',
    colorTheme: 'silver' as 'silver' | 'azure' | 'warm',

    // Continuous modulo depth
    travelDistance: 0,
    totalRingCount: 28,
    ringSpacing: 40,
    maxDepth: 1120,

    // Parallax camera tilt
    camX: 0,
    camY: 0,
    targetCamX: 0,
    targetCamY: 0,

    time: 0,
  });

  stateRef.current.isPlaying = isPlaying;
  stateRef.current.geometryType = geometryType;
  stateRef.current.colorTheme = colorTheme;
  stateRef.current.speed = speedTier === 'relax' ? 90 : speedTier === 'cruise' ? 170 : 260;

  // Reset function
  const handleReset = useCallback(() => {
    stateRef.current.travelDistance = 0;
    stateRef.current.targetCamX = 0;
    stateRef.current.targetCamY = 0;
    stateRef.current.camX = 0;
    stateRef.current.camY = 0;
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
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const s = stateRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (s.isPlaying) {
        s.time += dt;
        s.travelDistance += s.speed * dt;
      }

      // Smooth camera tilt recentering
      s.camX += (s.targetCamX - s.camX) * 4.0 * dt;
      s.camY += (s.targetCamY - s.camY) * 4.0 * dt;

      const centerX = width / 2 + s.camX;
      const centerY = height / 2 + s.camY;
      const focalLength = 320;

      // Clear dark background
      ctx.fillStyle = '#07090E'; // Hypnotic deep obsidian
      ctx.fillRect(0, 0, width, height);

      // Distant horizon vanishing glow
      const horizonGrad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, 140);
      if (s.colorTheme === 'silver') {
        horizonGrad.addColorStop(0, 'rgba(226, 232, 240, 0.18)');
        horizonGrad.addColorStop(1, 'rgba(7, 9, 14, 0)');
      } else if (s.colorTheme === 'azure') {
        horizonGrad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
        horizonGrad.addColorStop(1, 'rgba(7, 9, 14, 0)');
      } else {
        horizonGrad.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
        horizonGrad.addColorStop(1, 'rgba(7, 9, 14, 0)');
      }
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, 0, width, height);

      // Loop rings using mathematical modulo for 100% seamless infinite continuity
      // Rings travel from maxDepth (deep horizon) towards viewer (z = 0)
      const numRings = s.totalRingCount;
      const ringSpacing = s.ringSpacing;
      const maxZ = numRings * ringSpacing;
      const currentOffset = s.travelDistance % ringSpacing;

      // Color palette definitions
      let primaryColor = '226, 232, 240'; // silver
      let accentColor = '148, 163, 184';
      if (s.colorTheme === 'azure') {
        primaryColor = '56, 189, 248';
        accentColor = '14, 165, 233';
      } else if (s.colorTheme === 'warm') {
        primaryColor = '251, 191, 36';
        accentColor = '245, 158, 11';
      }

      // Draw perspective tunnel rings from back to front
      for (let i = numRings - 1; i >= 0; i--) {
        // Continuous z coordinate
        const z = maxZ - (i * ringSpacing + currentOffset);
        if (z <= 12) continue; // Clip near viewer

        // Perspective scale factor
        const scale = focalLength / z;
        const ringRadius = 260 * scale;

        // Depth fog / alpha
        const depthNorm = Math.max(0, Math.min(1, 1 - (z / maxZ)));
        const alpha = Math.pow(depthNorm, 1.4) * 0.85;

        // Subtle geometric twist along tunnel depth
        const twistAngle = (z * 0.0018) + (s.time * 0.12);

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(twistAngle);

        ctx.strokeStyle = `rgba(${primaryColor}, ${alpha})`;
        ctx.lineWidth = Math.max(1, 2.5 * scale);

        // Draw geometric shape
        if (s.geometryType === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          const sides = s.geometryType === 'octagon' ? 8 : 6;
          ctx.beginPath();
          for (let pt = 0; pt < sides; pt++) {
            const angle = (pt / sides) * Math.PI * 2;
            const px = Math.cos(angle) * ringRadius;
            const py = Math.sin(angle) * ringRadius;
            if (pt === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();

          // Small vertex nodes on front rings
          if (z < 350) {
            ctx.fillStyle = `rgba(${accentColor}, ${alpha * 1.2})`;
            for (let pt = 0; pt < sides; pt++) {
              const angle = (pt / sides) * Math.PI * 2;
              const px = Math.cos(angle) * ringRadius;
              const py = Math.sin(angle) * ringRadius;
              ctx.beginPath();
              ctx.arc(px, py, Math.max(1.5, 3.5 * scale), 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        ctx.restore();
      }

      // 4 Longitudinal perspective guide lines towards vanishing center
      const guideSides = s.geometryType === 'octagon' ? 8 : s.geometryType === 'hexagon' ? 6 : 4;
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${accentColor}, 0.15)`;
      for (let g = 0; g < guideSides; g++) {
        const angle = (g / guideSides) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * (width * 0.9),
          centerY + Math.sin(angle) * (height * 0.9)
        );
        ctx.stroke();
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Pointer parallax interaction
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / canvas.clientWidth - 0.5) * 2;
    const normY = (y / canvas.clientHeight - 0.5) * 2;

    stateRef.current.targetCamX = normX * 42;
    stateRef.current.targetCamY = normY * 32;
  };

  const handlePointerLeave = () => {
    stateRef.current.targetCamX = 0;
    stateRef.current.targetCamY = 0;
  };

  return (
    <div
      className={`relative w-full h-[320px] bg-[#07090E] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Status Bar */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 backdrop-blur-xs text-white rounded text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>MODULO_DEPTH // SEAMLESS INFINITE VOYAGE</span>
        </div>

        <div className="text-[10px] font-mono font-bold text-slate-300 bg-black/60 border border-white/15 px-2 py-0.5 rounded">
          {isPlaying ? 'CONTINUOUS LOOP' : 'PAUSED'}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full block touch-none cursor-move"
      />

      {/* Bottom Controls */}
      <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-xs p-1 border border-white/15 rounded shadow-xs">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            type="button"
            className="p-1 hover:bg-white/20 text-white transition-colors cursor-pointer rounded"
            title={isPlaying ? 'Pause infinite tunnel' : 'Resume'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-300" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Speed Tier */}
          <button
            onClick={() => {
              if (speedTier === 'relax') setSpeedTier('cruise');
              else if (speedTier === 'cruise') setSpeedTier('flow');
              else setSpeedTier('relax');
            }}
            type="button"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
            title="Adjust voyage speed"
          >
            <FastForward className="w-3 h-3 text-cyan-300" />
            <span>Speed: {speedTier}</span>
          </button>

          {/* Geometry Shape */}
          <button
            onClick={() => {
              if (geometryType === 'octagon') setGeometryType('hexagon');
              else if (geometryType === 'hexagon') setGeometryType('circle');
              else setGeometryType('octagon');
            }}
            type="button"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
            title="Change polygon geometry"
          >
            <Compass className="w-3 h-3 text-amber-300" />
            <span className="capitalize">{geometryType}</span>
          </button>

          {/* Color Palette */}
          <button
            onClick={() => {
              if (colorTheme === 'silver') setColorTheme('azure');
              else if (colorTheme === 'azure') setColorTheme('warm');
              else setColorTheme('silver');
            }}
            type="button"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
            title="Switch color palette"
          >
            <Palette className="w-3 h-3 text-emerald-300" />
            <span className="capitalize">{colorTheme}</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            type="button"
            className="p-1 hover:bg-white/20 text-white/80 transition-colors cursor-pointer rounded"
            title="Reset position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] font-mono text-white/50 bg-black/60 px-2 py-1 rounded border border-white/10 hidden sm:block">
          MOVE CURSOR TO STEER PERSPECTIVE
        </div>
      </div>
    </div>
  );
};
