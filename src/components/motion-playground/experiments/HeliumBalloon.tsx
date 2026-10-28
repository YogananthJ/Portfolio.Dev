import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Wind, RotateCcw, Palette, ArrowDown } from 'lucide-react';

interface HeliumBalloonProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
  className?: string;
}

interface StringNode {
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Color option: 'red' (prompt default) or 'blue' (photo reference)
  const [balloonColor, setBalloonColor] = useState<'red' | 'blue' | 'gold'>('red');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Physics state refs to avoid state rerenders in 60fps loop
  const physicsRef = useRef({
    // Balloon position & dynamics
    balloonX: 200,
    balloonY: 90,
    balloonVx: 0,
    balloonVy: 0,
    balloonRadius: 46,
    balloonTilt: 0,
    balloonSquashX: 1,
    balloonSquashY: 1,

    // Ceilings and bounds
    ceilingY: 28,

    // Cardboard tag
    tagX: 200,
    tagY: 240,
    tagVx: 0,
    tagVy: 0,
    tagWidth: 38,
    tagHeight: 38,
    tagAngle: 0,
    tagAngularVel: 0,

    // String segments (Verlet chain)
    stringSegments: [] as StringNode[],
    segmentLength: 16,
    numSegments: 10,

    // Drag interaction
    isDragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    pointerVx: 0,
    pointerVy: 0,

    // Rest/target coordinates for natural recovery
    restBalloonX: 200,
    restBalloonY: 65,

    // Idle breeze timer
    time: 0,
  });

  // Initialize or re-center physics
  const initPhysics = useCallback((width: number, height: number) => {
    const p = physicsRef.current;
    p.restBalloonX = width / 2;
    p.restBalloonY = 64;
    p.balloonX = width / 2;
    p.balloonY = 64;
    p.balloonVx = 0;
    p.balloonVy = 0;
    p.balloonTilt = 0;
    p.balloonSquashX = 1;
    p.balloonSquashY = 1;

    p.tagX = width / 2;
    p.tagY = 64 + p.balloonRadius + p.numSegments * p.segmentLength;
    p.tagVx = 0;
    p.tagVy = 0;
    p.tagAngle = 0;
    p.tagAngularVel = 0;

    p.stringSegments = [];
    const startY = p.balloonY + p.balloonRadius;
    const endY = p.tagY;
    const dy = (endY - startY) / p.numSegments;

    for (let i = 0; i <= p.numSegments; i++) {
      const y = startY + i * dy;
      p.stringSegments.push({
        x: width / 2,
        y: y,
        oldX: width / 2,
        oldY: y,
      });
    }
  }, []);

  // Reset function
  const handleReset = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initPhysics(canvas.clientWidth, canvas.clientHeight);
    }
  }, [initPhysics]);

  // Pull down impulse
  const handlePullDown = useCallback(() => {
    const p = physicsRef.current;
    p.tagVy += 140;
    p.balloonVy += 40;
    p.tagAngularVel += 0.25;
  }, []);

  // Wind breeze impulse
  const handleBreeze = useCallback(() => {
    const p = physicsRef.current;
    const dir = Math.random() > 0.5 ? 1 : -1;
    p.balloonVx += dir * (70 + Math.random() * 40);
    p.tagVx += dir * (40 + Math.random() * 30);
    p.tagAngularVel += dir * 0.35;
  }, []);

  // Register parent controls
  useEffect(() => {
    if (onRegisterControls) {
      onRegisterControls({
        reset: handleReset,
        replay: () => {
          handlePullDown();
          setTimeout(handleBreeze, 300);
        },
      });
    }
  }, [onRegisterControls, handleReset, handlePullDown, handleBreeze]);

  // Main animation and physics simulation loop
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

      if (physicsRef.current.stringSegments.length === 0) {
        initPhysics(width, height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // Cap delta time
      lastTime = now;
      const p = physicsRef.current;
      p.time += dt;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // --- 1. Natural Buoyancy and Resting Physics ---
      const buoyancy = -140; // upward acceleration
      const gravity = 80;    // downward gravity for tag
      const damping = 0.94;

      // Subtle idle ambient air sway
      const airCurrent = Math.sin(p.time * 1.8) * 4 + Math.cos(p.time * 0.9) * 3;

      if (!p.isDragging) {
        // Tag physics (gravity + spring pull from string bottom)
        p.tagVy += gravity * dt;
        p.tagVx *= damping;
        p.tagVy *= damping;
        p.tagX += p.tagVx * dt;
        p.tagY += p.tagVy * dt;

        // Tag rotation damping towards hanging straight down
        p.tagAngularVel += -p.tagAngle * 8 * dt; // spring to angle 0
        p.tagAngularVel *= 0.92;
        p.tagAngle += p.tagAngularVel * dt;
      }

      // Balloon buoyancy & idle spring to rest center
      p.balloonVy += buoyancy * dt;
      p.balloonVx += airCurrent * dt;

      // Spring to rest X
      const springX = (p.restBalloonX - p.balloonX) * 2.5;
      p.balloonVx += springX * dt;
      p.balloonVx *= damping;
      p.balloonVy *= damping;

      p.balloonX += p.balloonVx * dt;
      p.balloonY += p.balloonVy * dt;

      // Ceiling collision (soft squash against ceiling like in reference photo!)
      const topCeiling = p.ceilingY + p.balloonRadius * 0.65;
      if (p.balloonY < topCeiling) {
        const penetration = topCeiling - p.balloonY;
        p.balloonY = topCeiling;
        p.balloonVy = Math.max(0, p.balloonVy * 0.1);
        // Squash against ceiling
        p.balloonSquashY = Math.max(0.75, 1 - penetration * 0.02);
        p.balloonSquashX = Math.min(1.2, 1 + penetration * 0.015);
      } else {
        // Recover natural proportions smoothly
        p.balloonSquashX += (1 - p.balloonSquashX) * 8 * dt;
        p.balloonSquashY += (1 - p.balloonSquashY) * 8 * dt;
      }

      // Tilt based on horizontal velocity and string pull
      const targetTilt = (p.balloonVx * 0.003) + (p.tagX - p.balloonX) * 0.002;
      p.balloonTilt += (targetTilt - p.balloonTilt) * 6 * dt;

      // Boundary constraints
      const margin = p.balloonRadius + 5;
      if (p.balloonX < margin) {
        p.balloonX = margin;
        p.balloonVx = 0;
      }
      if (p.balloonX > width - margin) {
        p.balloonX = width - margin;
        p.balloonVx = 0;
      }

      // --- 2. String Verlet Simulation ---
      const segments = p.stringSegments;
      if (segments.length > 0) {
        // Pin top segment to balloon tied neck
        const neckX = p.balloonX + Math.sin(p.balloonTilt) * (p.balloonRadius * 1.05);
        const neckY = p.balloonY + Math.cos(p.balloonTilt) * (p.balloonRadius * 1.05);
        segments[0].x = neckX;
        segments[0].y = neckY;

        // Pin bottom segment to tag hole
        const tagHoleX = p.tagX;
        const tagHoleY = p.tagY - p.tagHeight * 0.35;
        const lastIdx = segments.length - 1;

        if (p.isDragging) {
          segments[lastIdx].x = tagHoleX;
          segments[lastIdx].y = tagHoleY;
        }

        // Verlet integration for internal nodes
        for (let i = 1; i < lastIdx; i++) {
          const seg = segments[i];
          const vx = (seg.x - seg.oldX) * 0.95;
          const vy = (seg.y - seg.oldY) * 0.95;
          seg.oldX = seg.x;
          seg.oldY = seg.y;
          seg.x += vx;
          seg.y += vy + 12 * dt; // slight string gravity
        }

        // Solve distance constraints (relaxation iterations)
        for (let iter = 0; iter < 4; iter++) {
          for (let i = 0; i < lastIdx; i++) {
            const n1 = segments[i];
            const n2 = segments[i + 1];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.hypot(dx, dy) || 1;
            const diff = (dist - p.segmentLength) / dist;

            if (i === 0) {
              // n1 is fixed at balloon neck
              n2.x -= dx * diff * 0.9;
              n2.y -= dy * diff * 0.9;
            } else if (i + 1 === lastIdx && p.isDragging) {
              // n2 is fixed at dragged tag
              n1.x += dx * diff * 0.9;
              n1.y += dy * diff * 0.9;
            } else {
              n1.x += dx * diff * 0.45;
              n1.y += dy * diff * 0.45;
              n2.x -= dx * diff * 0.45;
              n2.y -= dy * diff * 0.45;
            }
          }
        }

        // String tension feedback to balloon
        // If string is taut (pulled down by tag), pull balloon towards tag
        const totalStringDy = tagHoleY - neckY;
        const maxStringLen = (segments.length - 1) * p.segmentLength;
        if (totalStringDy > maxStringLen) {
          const excess = totalStringDy - maxStringLen;
          p.balloonVy += excess * 18 * dt; // pull balloon down
          p.balloonVx += (p.tagX - p.balloonX) * 8 * dt;
        }

        // When not dragging, string pulls tag towards bottom segment
        if (!p.isDragging) {
          const lastSeg = segments[lastIdx];
          p.tagX += (lastSeg.x - p.tagX) * 0.5;
          p.tagY += (lastSeg.y - (p.tagY - p.tagHeight * 0.35)) * 0.5;
        }
      }

      // --- 3. Render Scene ---
      ctx.clearRect(0, 0, width, height);

      // Environment backdrop: warm neutral ceiling line & soft gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#F5F2EB');
      bgGrad.addColorStop(0.12, '#EFECE3');
      bgGrad.addColorStop(1, '#E9E5DC');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ceiling seam line & subtle cornice shadow
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, p.ceilingY);
      ctx.lineTo(width, p.ceilingY);
      ctx.stroke();

      const corniceGrad = ctx.createLinearGradient(0, p.ceilingY, 0, p.ceilingY + 18);
      corniceGrad.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
      corniceGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
      ctx.fillStyle = corniceGrad;
      ctx.fillRect(0, p.ceilingY, width, 18);

      // Ceiling contact shadow if near ceiling
      if (p.balloonY - p.ceilingY < p.balloonRadius * 1.4) {
        const shadowDist = Math.max(0, p.balloonY - p.ceilingY);
        const shadowAlpha = Math.max(0, 0.28 - shadowDist * 0.0035);
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(p.balloonX, p.ceilingY + 2, p.balloonRadius * 0.75, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30, 20, 20, ${shadowAlpha})`;
        ctx.filter = 'blur(4px)';
        ctx.fill();
        ctx.restore();
      }

      // Draw Multi-segment Flexible String
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

        // Crisp white/cream ribbon string
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // Draw Brown Kraft Cardboard Tag (Square with punched hole & knot)
      ctx.save();
      ctx.translate(p.tagX, p.tagY);
      ctx.rotate(p.tagAngle);

      // Cardboard drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 6;

      const halfW = p.tagWidth / 2;
      const halfH = p.tagHeight / 2;

      // Brown kraft tag body
      const tagGrad = ctx.createLinearGradient(-halfW, -halfH, halfW, halfH);
      tagGrad.addColorStop(0, '#C9A375');
      tagGrad.addColorStop(0.5, '#BD9464');
      tagGrad.addColorStop(1, '#A98154');
      ctx.fillStyle = tagGrad;
      ctx.fillRect(-halfW, -halfH, p.tagWidth, p.tagHeight);

      // Reset shadow for crisp border and hole
      ctx.shadowColor = 'transparent';

      // Cardboard subtle bevel border
      ctx.strokeStyle = 'rgba(90, 60, 30, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-halfW, -halfH, p.tagWidth, p.tagHeight);

      // Punched circular hole near top edge
      const holeY = -halfH + 7;
      ctx.beginPath();
      ctx.arc(0, holeY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#E9E5DC'; // reveal background wall
      ctx.fill();
      ctx.strokeStyle = 'rgba(60, 40, 20, 0.6)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // String loop through hole
      ctx.beginPath();
      ctx.arc(0, holeY - 1, 3.5, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Drag affordance icon / subtle text on tag
      ctx.fillStyle = 'rgba(70, 45, 20, 0.55)';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GRAB', 0, 6);
      ctx.fillText('ME', 0, 14);

      ctx.restore();

      // Draw Realistic Glossy Balloon
      ctx.save();
      ctx.translate(p.balloonX, p.balloonY);
      ctx.rotate(p.balloonTilt);
      ctx.scale(p.balloonSquashX, p.balloonSquashY);

      const r = p.balloonRadius;

      // Color Palette definition
      let mainGradColor1 = '#FF3B30';
      let mainGradColor2 = '#C41C16';
      let mainGradColor3 = '#7A0A06';

      if (balloonColor === 'blue') {
        // Sky blue matching reference photo
        mainGradColor1 = '#2F80ED';
        mainGradColor2 = '#0051C6';
        mainGradColor3 = '#002B73';
      } else if (balloonColor === 'gold') {
        mainGradColor1 = '#F2C94C';
        mainGradColor2 = '#D49B1E';
        mainGradColor3 = '#7A5200';
      }

      // Balloon Outline Path (Classic egg-shaped pear balloon)
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.95);
      // Top hemisphere
      ctx.bezierCurveTo(r * 0.85, -r * 0.95, r * 1.05, -r * 0.2, r * 0.95, r * 0.35);
      // Lower taper to neck
      ctx.bezierCurveTo(r * 0.85, r * 0.8, r * 0.35, r * 1.05, 0, r * 1.08);
      ctx.bezierCurveTo(-r * 0.35, r * 1.05, -r * 0.85, r * 0.8, -r * 0.95, r * 0.35);
      ctx.bezierCurveTo(-r * 1.05, -r * 0.2, -r * 0.85, -r * 0.95, 0, -r * 0.95);
      ctx.closePath();

      // Balloon volumetric gradient
      const ballGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.08, 0, 0, r * 1.15);
      ballGrad.addColorStop(0, mainGradColor1);
      ballGrad.addColorStop(0.65, mainGradColor2);
      ballGrad.addColorStop(1, mainGradColor3);
      ctx.fillStyle = ballGrad;
      ctx.fill();

      // Tied neck / knot at bottom
      ctx.beginPath();
      ctx.moveTo(-4, r * 1.08);
      ctx.lineTo(4, r * 1.08);
      ctx.lineTo(6, r * 1.18);
      ctx.lineTo(-6, r * 1.18);
      ctx.closePath();
      ctx.fillStyle = mainGradColor3;
      ctx.fill();

      // Realistic Window Specular Reflection on upper-left shoulder (as in photo)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(-r * 0.38, -r * 0.38, r * 0.28, r * 0.42, -0.4, 0, Math.PI * 2);
      const specGrad = ctx.createLinearGradient(-r * 0.5, -r * 0.6, -r * 0.2, -r * 0.2);
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.72)');
      specGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.35)');
      specGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = specGrad;
      ctx.fill();

      // Secondary window pane line (creates distinct glass/window reflection)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, -r * 0.38);
      ctx.lineTo(-r * 0.25, -r * 0.38);
      ctx.stroke();

      // Subtle edge rim light on right side
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.98, -0.2, 1.2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 2.5;
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

  // Pointer interaction on draggable tag
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const p = physicsRef.current;
    const dx = x - p.tagX;
    const dy = y - p.tagY;
    const distToTag = Math.hypot(dx, dy);

    // Clicked on or near cardboard tag (with generous 45px radius for mobile touch)
    if (distToTag < 45) {
      canvas.setPointerCapture(e.pointerId);
      p.isDragging = true;
      setIsDragging(true);
      p.dragOffsetX = dx;
      p.dragOffsetY = dy;
      p.lastPointerX = x;
      p.lastPointerY = y;
      p.pointerVx = 0;
      p.pointerVy = 0;
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

    // Move tag with pointer
    p.tagX = Math.max(20, Math.min(canvas.clientWidth - 20, x - p.dragOffsetX));
    p.tagY = Math.max(p.ceilingY + 60, Math.min(canvas.clientHeight - 20, y - p.dragOffsetY));

    // Tilt tag with horizontal velocity
    p.tagAngle = Math.max(-0.6, Math.min(0.6, p.pointerVx * 0.005));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = physicsRef.current;
    if (p.isDragging) {
      p.isDragging = false;
      setIsDragging(false);
      p.tagVx = p.pointerVx * 0.6;
      p.tagVy = p.pointerVy * 0.6;
      p.tagAngularVel = p.pointerVx * 0.02;
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // Safe catch
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[320px] bg-[#F5F2EB] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Status Bar */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 text-white rounded text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>HELIOS_PHYSICS // TENSION & BUOYANCY</span>
        </div>

        <div className="text-[10px] font-mono font-bold text-black/60 bg-white/70 px-2 py-0.5 rounded shadow-xs">
          {isDragging ? 'DRAGGING TAG' : 'DRAG CARDBOARD TAG'}
        </div>
      </div>

      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full h-full block touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      />

      {/* Floating Action Bar */}
      <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1 border border-black/15 shadow-xs rounded">
          <button
            onClick={handlePullDown}
            type="button"
            className="px-2 py-1 bg-black text-white hover:bg-[#BE123C] text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
            title="Pull string downward"
          >
            <ArrowDown className="w-3 h-3" />
            <span>Pull Tag</span>
          </button>

          <button
            onClick={handleBreeze}
            type="button"
            className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
            title="Apply breeze gust"
          >
            <Wind className="w-3 h-3 text-cyan-600" />
            <span>Breeze</span>
          </button>

          <button
            onClick={handleReset}
            type="button"
            className="p-1 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
            title="Reset to ceiling"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Color Switcher */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 border border-black/15 shadow-xs rounded">
          <Palette className="w-3 h-3 text-neutral-500 ml-1" />
          <button
            onClick={() => setBalloonColor('red')}
            type="button"
            className={`w-4 h-4 rounded-full border transition-transform ${balloonColor === 'red' ? 'scale-125 border-black ring-1 ring-black' : 'border-neutral-300'}`}
            style={{ backgroundColor: '#FF3B30' }}
            title="Crimson Red"
          />
          <button
            onClick={() => setBalloonColor('blue')}
            type="button"
            className={`w-4 h-4 rounded-full border transition-transform ${balloonColor === 'blue' ? 'scale-125 border-black ring-1 ring-black' : 'border-neutral-300'}`}
            style={{ backgroundColor: '#2F80ED' }}
            title="Sky Blue (Photo Ref)"
          />
          <button
            onClick={() => setBalloonColor('gold')}
            type="button"
            className={`w-4 h-4 rounded-full border transition-transform ${balloonColor === 'gold' ? 'scale-125 border-black ring-1 ring-black' : 'border-neutral-300'}`}
            style={{ backgroundColor: '#F2C94C' }}
            title="Champagne Gold"
          />
        </div>
      </div>
    </div>
  );
};
