import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Wind, RotateCcw } from 'lucide-react';

interface HeliumBalloonProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
  className?: string;
}

interface VerletNode {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
}

export const HeliumBalloon: React.FC<HeliumBalloonProps> = ({
  onRegisterControls,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Default to Sky Blue matching the photographic reference image
  const [balloonColor, setBalloonColor] = useState<'blue' | 'red' | 'gold'>('blue');
  const [statusMessage, setStatusMessage] = useState<string>('BUOYANT AT CEILING');

  const physicsRef = useRef({
    // Ceiling line
    ceilingY: 24,

    // Balloon body
    balloonX: 200,
    balloonY: 72,
    balloonVx: 0,
    balloonVy: 0,
    balloonRadius: 48,
    balloonTilt: 0,
    balloonTiltVel: 0,
    squashX: 1,
    squashY: 1,

    // Buoyancy & Aerodynamics
    buoyancy: -240,     // Archimedean upward float acceleration
    airDamping: 0.94,
    gravity: 120,

    // Brown kraft cardboard tag (Primary drag handle)
    tagX: 200,
    tagY: 245,
    tagVx: 0,
    tagVy: 0,
    tagWidth: 42,
    tagHeight: 42,
    tagAngle: 0,
    tagAngularVel: 0,

    // Multi-segment Verlet ribbon string (12 nodes)
    stringSegments: [] as VerletNode[],
    numSegments: 12,
    segmentLength: 14,

    // Drag tracking
    isDragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    pointerVx: 0,
    pointerVy: 0,

    time: 0,
  });

  // Initialize physics and center positioning
  const initPhysics = useCallback((width: number, height: number) => {
    const p = physicsRef.current;
    const centerX = width / 2;
    p.balloonX = centerX;
    p.balloonY = p.ceilingY + p.balloonRadius * 0.88; // Rest touching ceiling
    p.balloonVx = 0;
    p.balloonVy = 0;
    p.balloonTilt = 0;
    p.balloonTiltVel = 0;
    p.squashX = 1.08;
    p.squashY = 0.92; // Slightly flattened on ceiling

    p.tagX = centerX;
    p.tagY = p.balloonY + p.balloonRadius * 1.15 + p.numSegments * p.segmentLength;
    p.tagVx = 0;
    p.tagVy = 0;
    p.tagAngle = 0;
    p.tagAngularVel = 0;

    // Build Verlet ribbon string nodes
    p.stringSegments = [];
    const startY = p.balloonY + p.balloonRadius * 1.15;
    const endY = p.tagY - p.tagHeight * 0.35;
    const dy = (endY - startY) / p.numSegments;

    for (let i = 0; i <= p.numSegments; i++) {
      const y = startY + i * dy;
      p.stringSegments.push({
        x: centerX,
        y,
        oldX: centerX,
        oldY: y,
      });
    }
  }, []);

  // Reset to equilibrium
  const handleReset = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initPhysics(canvas.clientWidth, canvas.clientHeight);
    }
    setStatusMessage('BUOYANT AT CEILING');
  }, [initPhysics]);

  // Wind breeze impulse
  const handleBreeze = useCallback(() => {
    const p = physicsRef.current;
    const dir = Math.random() > 0.5 ? 1 : -1;
    p.balloonVx += dir * (80 + Math.random() * 40);
    p.balloonTiltVel += dir * 0.22;
    p.tagVx += dir * (55 + Math.random() * 30);
    p.tagAngularVel += dir * 0.32;
    setStatusMessage('BREEZE IMPULSE');
    setTimeout(() => setStatusMessage('BUOYANT AT CEILING'), 1600);
  }, []);

  // Register parent controls
  useEffect(() => {
    if (onRegisterControls) {
      onRegisterControls({
        reset: handleReset,
        replay: () => {
          handleBreeze();
        },
      });
    }
  }, [onRegisterControls, handleReset, handleBreeze]);

  // Main 60fps physics simulation & rendering loop
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

      initPhysics(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.045);
      lastTime = now;

      const p = physicsRef.current;
      p.time += dt;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const segments = p.stringSegments;

      // --- 1. Balloon Physics ---
      // Idle room draft / ambient thermal current
      const ambientDraftX = Math.sin(p.time * 1.8) * 6;
      p.balloonVx += ambientDraftX * dt;

      // Buoyancy force upward
      p.balloonVy += p.buoyancy * dt;

      // Air resistance damping
      p.balloonVx *= p.airDamping;
      p.balloonVy *= p.airDamping;

      p.balloonX += p.balloonVx * dt;
      p.balloonY += p.balloonVy * dt;

      // Ceiling Collision & Squash
      const minBalloonY = p.ceilingY + p.balloonRadius * 0.88;
      if (p.balloonY < minBalloonY) {
        const penetration = minBalloonY - p.balloonY;
        p.balloonY = minBalloonY;
        p.balloonVy = 0;

        // Ceiling contact flattening squash
        p.squashY = Math.max(0.82, 1.0 - penetration * 0.02);
        p.squashX = Math.min(1.18, 1.0 + penetration * 0.025);
      } else {
        // Recover from squash when pulled down
        p.squashX += (1.0 - p.squashX) * 8 * dt;
        p.squashY += (1.0 - p.squashY) * 8 * dt;
      }

      // Horizontal canvas wall boundaries
      const minX = p.balloonRadius + 12;
      const maxX = width - p.balloonRadius - 12;
      if (p.balloonX < minX) {
        p.balloonX = minX;
        p.balloonVx *= -0.3;
      } else if (p.balloonX > maxX) {
        p.balloonX = maxX;
        p.balloonVx *= -0.3;
      }

      // Tilt dynamics: balloon tilts with aerodynamic drag and string pull
      const targetTilt = Math.max(-0.4, Math.min(0.4, p.balloonVx * 0.0035 + (p.tagX - p.balloonX) * 0.002));
      p.balloonTiltVel += (targetTilt - p.balloonTilt) * 20 * dt;
      p.balloonTiltVel *= 0.86;
      p.balloonTilt += p.balloonTiltVel;

      // Balloon neck coordinate where string is tied
      const neckX = p.balloonX + Math.sin(p.balloonTilt) * (p.balloonRadius * 1.15);
      const neckY = p.balloonY + Math.cos(p.balloonTilt) * (p.balloonRadius * 1.15);

      // --- 2. Cardboard Tag Physics ---
      if (!p.isDragging) {
        // Tag pendular gravity + string pull
        p.tagVy += p.gravity * dt;
        p.tagVx *= 0.94;
        p.tagVy *= 0.94;

        p.tagX += p.tagVx * dt;
        p.tagY += p.tagVy * dt;

        // Tag rotation damping towards neutral
        p.tagAngularVel += (-p.tagAngle * 14.0 + (p.tagVx * 0.004)) * dt;
        p.tagAngularVel *= 0.88;
        p.tagAngle += p.tagAngularVel;
      }

      const tagHoleX = p.tagX;
      const tagHoleY = p.tagY - p.tagHeight * 0.35;

      // --- 3. Multi-Segment Verlet String Chain ---
      if (segments.length > 1) {
        // Pin ends: node 0 at balloon neck, node last at tag hole
        segments[0].x = neckX;
        segments[0].y = neckY;
        segments[0].oldX = neckX;
        segments[0].oldY = neckY;

        const lastIdx = segments.length - 1;
        segments[lastIdx].x = tagHoleX;
        segments[lastIdx].y = tagHoleY;
        segments[lastIdx].oldX = tagHoleX;
        segments[lastIdx].oldY = tagHoleY;

        // Verlet integration for middle nodes
        for (let i = 1; i < lastIdx; i++) {
          const seg = segments[i];
          const vx = (seg.x - seg.oldX) * 0.95;
          const vy = (seg.y - seg.oldY) * 0.95;
          seg.oldX = seg.x;
          seg.oldY = seg.y;

          // Light string gravity
          seg.x += vx;
          seg.y += vy + 4.5 * dt;
        }

        // Distance constraint relaxation (5 iterations for taut ribbon feel)
        for (let iter = 0; iter < 5; iter++) {
          for (let i = 0; i < lastIdx; i++) {
            const n1 = segments[i];
            const n2 = segments[i + 1];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            const diff = (dist - p.segmentLength) / dist;

            if (i === 0) {
              // n1 is pinned to balloon neck
              n2.x -= dx * diff * 0.85;
              n2.y -= dy * diff * 0.85;
            } else if (i === lastIdx - 1) {
              // n2 is pinned to tag
              n1.x += dx * diff * 0.85;
              n1.y += dy * diff * 0.85;
            } else {
              n1.x += dx * diff * 0.45;
              n1.y += dy * diff * 0.45;
              n2.x -= dx * diff * 0.45;
              n2.y -= dy * diff * 0.45;
            }
          }
        }

        // String tension pulling balloon down when tag is dragged
        const totalDist = Math.hypot(tagHoleX - neckX, tagHoleY - neckY);
        const maxStringLen = (segments.length - 1) * p.segmentLength;
        if (totalDist > maxStringLen) {
          const excess = totalDist - maxStringLen;
          const nx = (tagHoleX - neckX) / totalDist;
          const ny = (tagHoleY - neckY) / totalDist;
          // Pull balloon towards tag
          p.balloonVx += nx * excess * 22 * dt;
          p.balloonVy += ny * excess * 24 * dt;
        }

        if (!p.isDragging) {
          // Tension pulling tag back towards balloon string
          const bottomSeg = segments[lastIdx - 1];
          const pullX = (bottomSeg.x - tagHoleX) * 28;
          const pullY = (bottomSeg.y - tagHoleY + p.segmentLength) * 28;
          p.tagVx += pullX * dt;
          p.tagVy += pullY * dt;
        }
      }

      // --- 4. Render Scene ---
      ctx.clearRect(0, 0, width, height);

      // Warm off-white room environment gradient (as in photo)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#F5F2EB');
      bgGrad.addColorStop(0.14, '#ECE8DF');
      bgGrad.addColorStop(1, '#E4DFD5');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ceiling line & soft architectural shadow
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.09)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, p.ceilingY);
      ctx.lineTo(width, p.ceilingY);
      ctx.stroke();

      const corniceGrad = ctx.createLinearGradient(0, p.ceilingY, 0, p.ceilingY + 16);
      corniceGrad.addColorStop(0, 'rgba(0, 0, 0, 0.06)');
      corniceGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = corniceGrad;
      ctx.fillRect(0, p.ceilingY, width, 16);

      // Ceiling contact shadow when balloon touches ceiling
      if (p.balloonY - p.ceilingY < p.balloonRadius * 1.3) {
        const shadowDist = Math.max(0, p.balloonY - p.ceilingY);
        const shadowAlpha = Math.max(0, 0.32 - shadowDist * 0.004);
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(p.balloonX, p.ceilingY + 2, p.balloonRadius * 0.76, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(35, 25, 25, ${shadowAlpha})`;
        ctx.filter = 'blur(5px)';
        ctx.fill();
        ctx.restore();
      }

      // Multi-segment Flexible String
      if (segments.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(segments[0].x, segments[0].y);
        for (let i = 1; i < segments.length - 1; i++) {
          const xc = (segments[i].x + segments[i + 1].x) / 2;
          const yc = (segments[i].y + segments[i + 1].y) / 2;
          ctx.quadraticCurveTo(segments[i].x, segments[i].y, xc, yc);
        }
        ctx.lineTo(segments[segments.length - 1].x, segments[segments.length - 1].y);

        // String shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // White silk ribbon string (as in photo)
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.restore();
      }

      // Draw Brown Kraft Cardboard Tag (Square with punched hole & knot)
      ctx.save();
      ctx.translate(p.tagX, p.tagY);
      ctx.rotate(p.tagAngle);

      // Cardboard drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.24)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 6;

      const halfW = p.tagWidth / 2;
      const halfH = p.tagHeight / 2;

      // Brown kraft tag body (#8B5A2B / #A06A38 palette as specified)
      const tagGrad = ctx.createLinearGradient(-halfW, -halfH, halfW, halfH);
      tagGrad.addColorStop(0, '#A06A38');
      tagGrad.addColorStop(0.5, '#8B5A2B');
      tagGrad.addColorStop(1, '#74481F');
      ctx.fillStyle = tagGrad;
      ctx.fillRect(-halfW, -halfH, p.tagWidth, p.tagHeight);

      // Reset shadow for crisp border and hole
      ctx.shadowColor = 'transparent';

      // Cardboard subtle bevel border
      ctx.strokeStyle = 'rgba(60, 35, 15, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-halfW, -halfH, p.tagWidth, p.tagHeight);

      // Punched circular hole near top edge
      const holeY = -halfH + 8;
      ctx.beginPath();
      ctx.arc(0, holeY, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = '#E4DFD5'; // reveal background room wall
      ctx.fill();
      ctx.strokeStyle = 'rgba(50, 30, 10, 0.7)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // String loop through hole
      ctx.beginPath();
      ctx.arc(0, holeY - 1, 3.5, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Drag affordance text on cardboard tag
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DRAG', 0, 6);
      ctx.fillText('TAG', 0, 15);

      ctx.restore();

      // Draw Realistic Latex Balloon matching photo
      ctx.save();
      ctx.translate(p.balloonX, p.balloonY);
      ctx.rotate(p.balloonTilt);
      ctx.scale(p.squashX, p.squashY);

      const r = p.balloonRadius;

      // Color Palette definition: Default is rich Sky Blue matching the photo
      let color1 = '#388BFD';
      let color2 = '#005CE6';
      let color3 = '#003399';

      if (balloonColor === 'red') {
        color1 = '#FF3B30';
        color2 = '#C41C16';
        color3 = '#7A0A06';
      } else if (balloonColor === 'gold') {
        color1 = '#FBBF24';
        color2 = '#D97706';
        color3 = '#92400E';
      }

      // Elongated egg-shaped latex silhouette
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.96);
      // Top hemisphere
      ctx.bezierCurveTo(r * 0.86, -r * 0.96, r * 1.05, -r * 0.18, r * 0.94, r * 0.38);
      // Taper down to neck
      ctx.bezierCurveTo(r * 0.84, r * 0.82, r * 0.35, r * 1.06, 0, r * 1.09);
      ctx.bezierCurveTo(-r * 0.35, r * 1.06, -r * 0.84, r * 0.82, -r * 0.94, r * 0.38);
      ctx.bezierCurveTo(-r * 1.05, -r * 0.18, -r * 0.86, -r * 0.96, 0, -r * 0.96);
      ctx.closePath();

      // Volumetric sphere gradient
      const ballGrad = ctx.createRadialGradient(-r * 0.32, -r * 0.32, r * 0.08, 0, 0, r * 1.18);
      ballGrad.addColorStop(0, color1);
      ballGrad.addColorStop(0.65, color2);
      ballGrad.addColorStop(1, color3);
      ctx.fillStyle = ballGrad;
      ctx.fill();

      // Tied neck / knot at bottom
      ctx.beginPath();
      ctx.moveTo(-4, r * 1.09);
      ctx.lineTo(4, r * 1.09);
      ctx.lineTo(6, r * 1.20);
      ctx.lineTo(-6, r * 1.20);
      ctx.closePath();
      ctx.fillStyle = color3;
      ctx.fill();

      // Soft curved window specular reflection highlight on upper-left shoulder (as in photo)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(-r * 0.40, -r * 0.40, r * 0.28, r * 0.42, -0.4, 0, Math.PI * 2);
      const specGrad = ctx.createLinearGradient(-r * 0.52, -r * 0.62, -r * 0.2, -r * 0.2);
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.78)');
      specGrad.addColorStop(0.38, 'rgba(255, 255, 255, 0.36)');
      specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = specGrad;
      ctx.fill();

      // Window reflection pane bar
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-r * 0.52, -r * 0.40);
      ctx.lineTo(-r * 0.26, -r * 0.40);
      ctx.stroke();

      // Soft rim glow on right edge
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.98, -0.2, 1.2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      ctx.restore();

      ctx.restore();

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [initPhysics, balloonColor]);

  // Pointer interaction on draggable kraft cardboard tag
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const p = physicsRef.current;
    const distToTag = Math.hypot(x - p.tagX, y - p.tagY);

    // Clicked on or near tag
    if (distToTag < 48) {
      canvas.setPointerCapture(e.pointerId);
      p.isDragging = true;
      p.dragOffsetX = x - p.tagX;
      p.dragOffsetY = y - p.tagY;
      p.lastPointerX = x;
      p.lastPointerY = y;
      p.pointerVx = 0;
      p.pointerVy = 0;
      setStatusMessage('PULLING CARDBOARD TAG');
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = physicsRef.current;
    if (!p.isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    p.pointerVx = (x - p.lastPointerX) * 20;
    p.pointerVy = (y - p.lastPointerY) * 20;
    p.lastPointerX = x;
    p.lastPointerY = y;

    // Move tag with cursor
    p.tagX = Math.max(20, Math.min(canvas.clientWidth - 20, x - p.dragOffsetX));
    p.tagY = Math.max(p.ceilingY + 60, Math.min(canvas.clientHeight - 20, y - p.dragOffsetY));

    // Dynamic tilt based on horizontal drag velocity
    p.tagAngle = Math.max(-0.6, Math.min(0.6, p.pointerVx * 0.005));
  };

  const handlePointerUp = () => {
    const p = physicsRef.current;
    if (p.isDragging) {
      p.isDragging = false;
      p.tagVx = p.pointerVx * 0.6;
      p.tagVy = p.pointerVy * 0.6;
      p.tagAngularVel = p.pointerVx * 0.02;
      setStatusMessage('RISING & OSCILLATING');
      setTimeout(() => setStatusMessage('BUOYANT AT CEILING'), 1600);
    }
  };

  // Add global window pointerup listeners so tag release is never stuck if cursor leaves canvas
  useEffect(() => {
    const onWindowPointerUp = () => {
      const p = physicsRef.current;
      if (p.isDragging) {
        p.isDragging = false;
        p.tagVx = p.pointerVx * 0.6;
        p.tagVy = p.pointerVy * 0.6;
        p.tagAngularVel = p.pointerVx * 0.02;
        setStatusMessage('RISING & OSCILLATING');
        setTimeout(() => setStatusMessage('BUOYANT AT CEILING'), 1600);
      }
    };
    window.addEventListener('pointerup', onWindowPointerUp);
    return () => window.removeEventListener('pointerup', onWindowPointerUp);
  }, []);

  return (
    <div
      className={`relative w-full h-[320px] bg-[#ECE8DF] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Status */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white rounded text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
          <span>ARCHIMEDEAN_HELIUM // VERLET TAG SUSPENSION</span>
        </div>

        <div className="text-[10px] font-mono font-bold text-slate-800 bg-white/80 border border-black/10 px-2 py-0.5 rounded shadow-xs">
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
        className="w-full h-full block touch-none cursor-pointer"
      />

      {/* Bottom Controls */}
      <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1 border border-black/15 rounded shadow-xs">
          {/* Color Presets */}
          {(['blue', 'red', 'gold'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setBalloonColor(c)}
              type="button"
              className={`px-2 py-1 text-[10px] font-mono font-bold uppercase transition-colors rounded cursor-pointer ${
                balloonColor === c
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-black/5 text-slate-700 hover:text-black'
              }`}
            >
              {c}
            </button>
          ))}

          {/* Breeze Impulse */}
          <button
            onClick={handleBreeze}
            type="button"
            className="px-2 py-1 bg-black/5 hover:bg-black/10 text-slate-800 text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer rounded"
          >
            <Wind className="w-3 h-3 text-blue-600" />
            <span>Breeze</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            type="button"
            className="p-1 hover:bg-black/10 text-slate-700 transition-colors cursor-pointer rounded"
            title="Reset balloon position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-700 bg-white/80 px-2 py-1 rounded border border-black/10 hidden sm:block">
          PULL CARDBOARD TAG DOWN OR SHAKE
        </div>
      </div>
    </div>
  );
};
