import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Wind, RotateCcw, Palette, CheckCircle2 } from 'lucide-react';
import { useAnimationLoop } from '../animationRegistry';
import { NormalizedPointerController } from '../normalizedPointer';

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
  const [activeHandle, setActiveHandle] = useState<'tag' | 'balloon' | 'none'>('none');

  const pointerControllerRef = useRef<NormalizedPointerController | null>(null);

  const physicsRef = useRef({
    // Ceiling plane
    ceilingY: 22,

    // Balloon Body
    balloonX: 200,
    balloonY: 70,
    balloonVx: 0,
    balloonVy: 0,
    balloonRadius: 48,
    balloonTilt: 0,
    balloonTiltVel: 0,
    squashX: 1,
    squashY: 1,

    // Buoyancy & Aerodynamic Parameters
    // In canvas coordinates: Y increases DOWNWARDS.
    // Therefore upward buoyancy is NEGATIVE acceleration. Downward gravity is POSITIVE acceleration.
    buoyancy: -580,     // Upward buoyant lift
    airDamping: 0.94,   // Air resistance
    balloonMass: 1.0,

    // Cardboard Tag (Primary Drag Handle)
    tagX: 200,
    tagY: 245,
    tagVx: 0,
    tagVy: 0,
    tagWidth: 44,
    tagHeight: 44,
    tagAngle: 0,
    tagAngularVel: 0,
    tagMass: 1.4,
    tagGravity: 340,    // Downward gravity on tag

    // 12-Segment Flexible Verlet Ribbon String
    stringSegments: [] as VerletNode[],
    numSegments: 12,
    segmentLength: 13.5, // Total rest length = ~162px

    // Drag Interaction State
    dragTarget: 'none' as 'tag' | 'balloon' | 'none',
    dragOffsetX: 0,
    dragOffsetY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    pointerVx: 0,
    pointerVy: 0,

    time: 0,
  });

  // Color profiles
  const colorThemes = {
    blue: {
      label: 'Sky Blue',
      balloonGrad: ['#3B82F6', '#1D4ED8', '#172554'],
      highlight: 'rgba(255, 255, 255, 0.75)',
      rimLight: 'rgba(191, 219, 254, 0.5)',
      knotColor: '#1E40AF',
    },
    red: {
      label: 'Crimson',
      balloonGrad: ['#EF4444', '#B91C1C', '#450A0A'],
      highlight: 'rgba(255, 255, 255, 0.72)',
      rimLight: 'rgba(254, 202, 202, 0.5)',
      knotColor: '#991B1B',
    },
    gold: {
      label: 'Champagne Gold',
      balloonGrad: ['#F59E0B', '#B45309', '#451A03'],
      highlight: 'rgba(255, 255, 255, 0.78)',
      rimLight: 'rgba(254, 243, 199, 0.55)',
      knotColor: '#92400E',
    },
  };

  // Initialize Physics Equilibrium
  const initPhysics = useCallback((width: number, _height: number) => {
    const p = physicsRef.current;
    const centerX = width / 2;

    p.balloonX = centerX;
    p.balloonY = p.ceilingY + p.balloonRadius * 0.88; // Rest touching ceiling
    p.balloonVx = 0;
    p.balloonVy = 0;
    p.balloonTilt = 0;
    p.balloonTiltVel = 0;
    p.squashX = 1.08;
    p.squashY = 0.92;

    const stringRestLen = p.numSegments * p.segmentLength;
    p.tagX = centerX;
    p.tagY = p.balloonY + p.balloonRadius * 1.15 + stringRestLen;
    p.tagVx = 0;
    p.tagVy = 0;
    p.tagAngle = 0;
    p.tagAngularVel = 0;

    // Initialize Verlet nodes in straight vertical line
    p.stringSegments = [];
    const startY = p.balloonY + p.balloonRadius * 1.15;
    for (let i = 0; i <= p.numSegments; i++) {
      const y = startY + i * p.segmentLength;
      p.stringSegments.push({
        x: centerX,
        y,
        oldX: centerX,
        oldY: y,
      });
    }
  }, []);

  // Reset to default floating state
  const handleReset = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initPhysics(canvas.clientWidth, canvas.clientHeight);
    }
    setActiveHandle('none');
    setStatusMessage('BUOYANT AT CEILING');
  }, [initPhysics]);

  // Gentle wind breeze impulse
  const handleBreeze = useCallback(() => {
    const p = physicsRef.current;
    const dir = Math.random() > 0.5 ? 1 : -1;
    p.balloonVx += dir * 90;
    p.balloonTiltVel += dir * 0.35;
    p.tagVx += dir * 65;
    p.tagAngularVel += dir * 0.45;
    setStatusMessage('BREEZE OSCILLATION');
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

  // Handle Resize
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

      initPhysics(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initPhysics]);

  // Unified Pointer Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = new NormalizedPointerController({
      onPointerDown: (state) => {
        const p = physicsRef.current;
        const x = state.x;
        const y = state.y;

        // Check if user clicked the cardboard tag (primary handle)
        const distToTag = Math.hypot(x - p.tagX, y - p.tagY);
        // Check if user clicked balloon body
        const distToBalloon = Math.hypot(x - p.balloonX, y - p.balloonY);

        if (distToTag < 52) {
          p.dragTarget = 'tag';
          p.dragOffsetX = x - p.tagX;
          p.dragOffsetY = y - p.tagY;
          p.lastPointerX = x;
          p.lastPointerY = y;
          p.pointerVx = 0;
          p.pointerVy = 0;
          setActiveHandle('tag');
          setStatusMessage('PULLING CARDBOARD TAG');
        } else if (distToBalloon < p.balloonRadius * 1.1) {
          p.dragTarget = 'balloon';
          p.dragOffsetX = x - p.balloonX;
          p.dragOffsetY = y - p.balloonY;
          p.lastPointerX = x;
          p.lastPointerY = y;
          p.pointerVx = 0;
          p.pointerVy = 0;
          setActiveHandle('balloon');
          setStatusMessage('DRAGGING HELIUM BALLOON');
        }
      },
      onPointerMove: (state) => {
        const p = physicsRef.current;
        if (p.dragTarget === 'none') return;

        const x = state.x;
        const y = state.y;

        p.pointerVx = state.vx;
        p.pointerVy = state.vy;
        p.lastPointerX = x;
        p.lastPointerY = y;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        if (p.dragTarget === 'tag') {
          // When pulling tag DOWN, pointer Y increases. Tag Y MUST increase!
          // Maintain drag offset so there is zero jumping
          const targetTagX = x - p.dragOffsetX;
          const targetTagY = y - p.dragOffsetY;

          // Clamped within canvas boundaries
          p.tagX = Math.max(24, Math.min(width - 24, targetTagX));
          p.tagY = Math.max(p.ceilingY + 65, Math.min(height - 24, targetTagY));

          // Tag tilts in response to horizontal motion velocity
          p.tagAngle = Math.max(-0.65, Math.min(0.65, p.pointerVx * 0.0035));
        } else if (p.dragTarget === 'balloon') {
          // Direct balloon dragging
          const minBalloonY = p.ceilingY + p.balloonRadius * 0.88;
          p.balloonX = Math.max(p.balloonRadius + 15, Math.min(width - p.balloonRadius - 15, x - p.dragOffsetX));
          p.balloonY = Math.max(minBalloonY, Math.min(height - 80, y - p.dragOffsetY));
          p.balloonVx = p.pointerVx * 0.5;
          p.balloonVy = p.pointerVy * 0.5;
        }
      },
      onPointerUp: () => {
        const p = physicsRef.current;
        if (p.dragTarget !== 'none') {
          if (p.dragTarget === 'tag') {
            p.tagVx = Math.max(-400, Math.min(400, p.pointerVx * 0.65));
            p.tagVy = Math.max(-400, Math.min(400, p.pointerVy * 0.65));
            p.tagAngularVel = Math.max(-12, Math.min(12, p.pointerVx * 0.025));
          }
          p.dragTarget = 'none';
          setActiveHandle('none');
          setStatusMessage('RISING VIA BUOYANCY');
          setTimeout(() => {
            if (physicsRef.current.dragTarget === 'none') {
              setStatusMessage('BUOYANT AT CEILING');
            }
          }, 1800);
        }
      },
      onPointerCancel: () => {
        const p = physicsRef.current;
        p.dragTarget = 'none';
        setActiveHandle('none');
        setStatusMessage('BUOYANT AT CEILING');
      },
    });

    controller.attach(canvas);
    pointerControllerRef.current = controller;

    return () => {
      controller.detach();
    };
  }, []);

  // Main 60fps Physics & Render Loop via unified animationRegistry
  const handleRenderFrame = useCallback((_timestamp: number, dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const p = physicsRef.current;
    p.time += dt;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;

    const segments = p.stringSegments;
    const numSegs = p.numSegments;
    const segLen = p.segmentLength;
    const totalMaxStringLength = numSegs * segLen;

    // --- 1. Balloon Aerodynamics & Buoyancy ---
    if (p.dragTarget !== 'balloon') {
      // Gentle ambient room thermal draft
      const ambientDraftX = Math.sin(p.time * 1.5) * 8;
      p.balloonVx += ambientDraftX * dt;

      // Upward Archimedean buoyancy force (NEGATIVE acceleration in canvas coordinates)
      p.balloonVy += p.buoyancy * dt;

      // Air resistance damping
      p.balloonVx *= p.airDamping;
      p.balloonVy *= p.airDamping;

      // Integrate balloon position
      p.balloonX += p.balloonVx * dt;
      p.balloonY += p.balloonVy * dt;

      // Ceiling Collision & Squash
      const minBalloonY = p.ceilingY + p.balloonRadius * 0.88;
      if (p.balloonY < minBalloonY) {
        const penetration = minBalloonY - p.balloonY;
        p.balloonY = minBalloonY;
        // Soft elastic bounce against ceiling
        if (p.balloonVy < -15) {
          p.balloonVy = -p.balloonVy * 0.22;
        } else {
          p.balloonVy = 0;
        }

        // Realistic latex ceiling contact flattening squash
        p.squashY = Math.max(0.82, 1.0 - penetration * 0.022);
        p.squashX = Math.min(1.18, 1.0 + penetration * 0.025);
      } else {
        // Smooth recovery back to spherical/egg shape
        p.squashX += (1.0 - p.squashX) * 7.0 * dt;
        p.squashY += (1.0 - p.squashY) * 7.0 * dt;
      }
    }

    // Horizontal boundary collision for balloon
    const minX = p.balloonRadius + 14;
    const maxX = width - p.balloonRadius - 14;
    if (p.balloonX < minX) {
      p.balloonX = minX;
      p.balloonVx *= -0.3;
    } else if (p.balloonX > maxX) {
      p.balloonX = maxX;
      p.balloonVx *= -0.3;
    }

    // --- 2. String & Tag Pulling Mechanics ---
    const tagHoleX = p.tagX;
    const tagHoleY = p.tagY - p.tagHeight * 0.38;

    // Calculate balloon neck position where ribbon is tied
    const neckYOffset = p.balloonRadius * 1.15;
    const neckX = p.balloonX + Math.sin(p.balloonTilt) * neckYOffset;
    const neckY = p.balloonY + Math.cos(p.balloonTilt) * neckYOffset;

    // Vector from balloon neck to tag hole
    const distNeckToTag = Math.hypot(tagHoleX - neckX, tagHoleY - neckY) || 0.001;
    const dirX = (tagHoleX - neckX) / distNeckToTag;
    const dirY = (tagHoleY - neckY) / distNeckToTag;

    // CRITICAL FIX: If string is pulled taut (dist > totalMaxStringLength),
    // tension force DIRECTLY pulls balloon neck towards the tag!
    if (distNeckToTag > totalMaxStringLength) {
      const stretch = distNeckToTag - totalMaxStringLength;

      if (p.dragTarget === 'tag') {
        // Tag is being pulled by user: tension acts strongly downwards and sideways on balloon
        const tensionForce = stretch * 65.0; // Proportional string tension
        p.balloonVx += dirX * tensionForce * dt;
        p.balloonVy += dirY * tensionForce * dt;

        // Position constraint assist: ensures balloon cannot lag infinitely far behind tag
        if (stretch > 18) {
          const excess = stretch - 18;
          p.balloonX += dirX * excess * 0.85;
          p.balloonY += dirY * excess * 0.85;
        }

        // Dynamic squash-and-stretch during downward pull
        const stretchRatio = Math.min(1.22, 1.0 + stretch * 0.0035);
        p.squashY = Math.max(p.squashY, stretchRatio);
        p.squashX = Math.min(p.squashX, 1.0 / Math.sqrt(stretchRatio));
      }
    }

    // Balloon tilt: tilts with aerodynamic drag and string tension direction
    const targetTilt = Math.max(-0.48, Math.min(0.48, (p.balloonVx * 0.004) + (dirX * 0.28)));
    p.balloonTiltVel += (targetTilt - p.balloonTilt) * 22.0 * dt;
    p.balloonTiltVel *= 0.86;
    p.balloonTilt += p.balloonTiltVel;

    // Recalculate neck after tilt update
    const currentNeckX = p.balloonX + Math.sin(p.balloonTilt) * neckYOffset;
    const currentNeckY = p.balloonY + Math.cos(p.balloonTilt) * neckYOffset;

    // --- 3. Cardboard Tag Physics (when not dragged) ---
    if (p.dragTarget !== 'tag') {
      // Downward gravity on tag (positive acceleration)
      p.tagVy += p.tagGravity * dt;

      // Air resistance
      p.tagVx *= 0.95;
      p.tagVy *= 0.95;

      p.tagX += p.tagVx * dt;
      p.tagY += p.tagVy * dt;

      // If string is taut while tag is swinging, tension pulls tag towards balloon
      if (distNeckToTag > totalMaxStringLength) {
        const stretch = distNeckToTag - totalMaxStringLength;
        const tagTension = stretch * 55.0;
        p.tagVx -= dirX * tagTension * dt;
        p.tagVy -= dirY * tagTension * dt;
      }

      // Restoring pendular torque on tag angle
      const stringAngle = Math.atan2(tagHoleX - currentNeckX, tagHoleY - currentNeckY);
      p.tagAngularVel += (-(p.tagAngle - stringAngle) * 22.0 + (p.tagVx * 0.005)) * dt;
      p.tagAngularVel *= 0.88;
      p.tagAngle += p.tagAngularVel;

      // Floor boundary for tag
      if (p.tagY > height - 20) {
        p.tagY = height - 20;
        p.tagVy = -p.tagVy * 0.2;
      }
    }

    // --- 4. Multi-Segment Verlet String Chain Integration ---
    if (segments.length > 1) {
      const lastIdx = segments.length - 1;

      // Pin ends: node 0 at balloon neck, node last at tag hole
      segments[0].x = currentNeckX;
      segments[0].y = currentNeckY;
      segments[0].oldX = currentNeckX;
      segments[0].oldY = currentNeckY;

      segments[lastIdx].x = tagHoleX;
      segments[lastIdx].y = tagHoleY;
      segments[lastIdx].oldX = tagHoleX;
      segments[lastIdx].oldY = tagHoleY;

      // Verlet update for intermediate string nodes
      for (let i = 1; i < lastIdx; i++) {
        const seg = segments[i];
        const vx = (seg.x - seg.oldX) * 0.96;
        const vy = (seg.y - seg.oldY) * 0.96;
        seg.oldX = seg.x;
        seg.oldY = seg.y;

        // Subtle ribbon gravity & ambient wave
        seg.x += vx;
        seg.y += vy + 8.5 * dt;
      }

      // Relaxation iterations for smooth curved ribbon physics
      const iterations = 6;
      for (let iter = 0; iter < iterations; iter++) {
        for (let i = 0; i < lastIdx; i++) {
          const n1 = segments[i];
          const n2 = segments[i + 1];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const diff = (dist - segLen) / dist;

          if (i === 0) {
            // n1 is pinned to balloon neck
            n2.x -= dx * diff * 0.88;
            n2.y -= dy * diff * 0.88;
          } else if (i === lastIdx - 1) {
            // n2 is pinned to tag
            n1.x += dx * diff * 0.88;
            n1.y += dy * diff * 0.88;
          } else {
            n1.x += dx * diff * 0.48;
            n1.y += dy * diff * 0.48;
            n2.x -= dx * diff * 0.48;
            n2.y -= dy * diff * 0.48;
          }
        }
      }
    }

    // --- 5. Rendering Scene ---
    ctx.clearRect(0, 0, width, height);

    // Warm architectural off-white room environment gradient (as in photo)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#F5F2EB');
    bgGrad.addColorStop(0.18, '#ECE7DE');
    bgGrad.addColorStop(1, '#E1DBD0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Ceiling architectural line & soft contact shadow
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, p.ceilingY);
    ctx.lineTo(width, p.ceilingY);
    ctx.stroke();

    // Soft ceiling shadow directly above the balloon
    const shadowDist = Math.max(0, p.balloonY - (p.ceilingY + p.balloonRadius * 0.88));
    const shadowAlpha = Math.max(0.04, 0.32 - shadowDist * 0.003);
    const shadowRadius = Math.max(22, p.balloonRadius * 0.92 - shadowDist * 0.15);

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(p.balloonX, p.ceilingY, shadowRadius, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
    ctx.filter = 'blur(6px)';
    ctx.fill();
    ctx.restore();

    // --- DRAW RIBBON STRING ---
    if (segments.length > 1) {
      // String shadow
      ctx.beginPath();
      ctx.moveTo(segments[0].x + 3, segments[0].y + 3);
      for (let i = 1; i < segments.length - 1; i++) {
        const xc = (segments[i].x + segments[i + 1].x) / 2 + 3;
        const yc = (segments[i].y + segments[i + 1].y) / 2 + 3;
        ctx.quadraticCurveTo(segments[i].x + 3, segments[i].y + 3, xc, yc);
      }
      ctx.lineTo(segments[segments.length - 1].x + 3, segments[segments.length - 1].y + 3);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // Main crisp white ribbon
      ctx.beginPath();
      ctx.moveTo(segments[0].x, segments[0].y);
      for (let i = 1; i < segments.length - 1; i++) {
        const xc = (segments[i].x + segments[i + 1].x) / 2;
        const yc = (segments[i].y + segments[i + 1].y) / 2;
        ctx.quadraticCurveTo(segments[i].x, segments[i].y, xc, yc);
      }
      ctx.lineTo(segments[segments.length - 1].x, segments[segments.length - 1].y);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Subtle ribbon highlight edge
      ctx.strokeStyle = 'rgba(235, 235, 235, 0.8)';
      ctx.lineWidth = 1.0;
      ctx.stroke();
    }

    // --- DRAW CARDBOARD TAG (PRIMARY DRAG HANDLE) ---
    ctx.save();
    ctx.translate(p.tagX, p.tagY);
    ctx.rotate(p.tagAngle);

    // Drop shadow under tag
    ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 4;

    const tw = p.tagWidth;
    const th = p.tagHeight;

    // Kraft paper cardboard fill
    const tagGrad = ctx.createLinearGradient(-tw / 2, -th / 2, tw / 2, th / 2);
    tagGrad.addColorStop(0, '#D4B892');
    tagGrad.addColorStop(0.5, '#C6A77D');
    tagGrad.addColorStop(1, '#B8966B');
    ctx.fillStyle = tagGrad;
    ctx.fillRect(-tw / 2, -th / 2, tw, th);

    // Subtle cardboard fiber texture border
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#9E7E56';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-tw / 2, -th / 2, tw, th);

    // Punched hole at top
    const holeY = -th * 0.35;
    ctx.beginPath();
    ctx.arc(0, holeY, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#6E553A';
    ctx.fill();
    ctx.strokeStyle = '#E7D5C0';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Clean embossed label on tag
    ctx.fillStyle = 'rgba(80, 55, 30, 0.65)';
    ctx.font = '600 7.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PULL ME', 0, 8);

    ctx.restore();

    // --- DRAW HELIUM BALLOON ---
    const theme = colorThemes[balloonColor];
    ctx.save();
    ctx.translate(p.balloonX, p.balloonY);
    ctx.rotate(p.balloonTilt);
    ctx.scale(p.squashX, p.squashY);

    const r = p.balloonRadius;

    // Tied neck nozzle & knot at bottom of balloon
    ctx.save();
    ctx.translate(0, r * 1.08);

    // Tied latex nozzle
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, 0);
    ctx.lineTo(8, 8);
    ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.fillStyle = theme.knotColor;
    ctx.fill();

    // Small white ribbon knot band
    ctx.beginPath();
    ctx.rect(-4, 5, 8, 3.5);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    // Balloon Body Shape (egg-like aerodynamic teardrop curve)
    ctx.beginPath();
    // Top dome
    ctx.arc(0, -r * 0.12, r * 0.98, Math.PI, 0, false);
    // Right lower curve to neck
    ctx.bezierCurveTo(r * 0.98, r * 0.45, r * 0.45, r * 1.06, 0, r * 1.12);
    // Left lower curve to neck
    ctx.bezierCurveTo(-r * 0.45, r * 1.06, -r * 0.98, r * 0.45, -r * 0.98, -r * 0.12);
    ctx.closePath();

    // Volumetric 3D spherical gradient
    const balloonGrad = ctx.createRadialGradient(
      -r * 0.32, -r * 0.36, r * 0.15,
      0, 0, r * 1.15
    );
    balloonGrad.addColorStop(0, theme.balloonGrad[0]);
    balloonGrad.addColorStop(0.68, theme.balloonGrad[1]);
    balloonGrad.addColorStop(1, theme.balloonGrad[2]);
    ctx.fillStyle = balloonGrad;
    ctx.fill();

    // Specular Window Reflection Highlight (matching reference photo)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(-r * 0.38, -r * 0.38, r * 0.28, r * 0.42, -0.4, 0, Math.PI * 2);
    const specGrad = ctx.createLinearGradient(-r * 0.52, -r * 0.62, -r * 0.2, -r * 0.2);
    specGrad.addColorStop(0, theme.highlight);
    specGrad.addColorStop(0.38, 'rgba(255, 255, 255, 0.36)');
    specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = specGrad;
    ctx.fill();

    // Window pane line detail
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-r * 0.52, -r * 0.38);
    ctx.lineTo(-r * 0.26, -r * 0.38);
    ctx.stroke();

    // Rim light on opposite edge
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.96, -0.2, 1.2);
    ctx.strokeStyle = theme.rimLight;
    ctx.lineWidth = 2.4;
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }, [balloonColor, colorThemes]);

  // Register in unified animation loop
  useAnimationLoop('helium-balloon', handleRenderFrame, true, 10);

  return (
    <div
      className={`relative w-full h-[320px] bg-[#ECE7DE] border border-[var(--border-color)] overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Status & Controls */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/75 backdrop-blur-xs text-white rounded text-[10px] font-mono border border-black/10">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              activeHandle !== 'none'
                ? 'bg-rose-400'
                : 'bg-emerald-400 animate-pulse'
            }`}
          ></span>
          <span>HELIUM_BUOYANCY // ARCHIMEDES</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Color Switcher */}
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur-xs border border-black/15 p-0.5 rounded shadow-xs">
            {(['blue', 'red', 'gold'] as const).map((colorKey) => (
              <button
                key={colorKey}
                onClick={() => setBalloonColor(colorKey)}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  balloonColor === colorKey
                    ? 'scale-110 border-black ring-1 ring-black/40'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
                style={{
                  backgroundColor:
                    colorKey === 'blue'
                      ? '#2563EB'
                      : colorKey === 'red'
                      ? '#DC2626'
                      : '#D97706',
                }}
                title={colorThemes[colorKey].label}
              />
            ))}
          </div>

          <div
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shadow-xs transition-colors ${
              activeHandle !== 'none'
                ? 'text-rose-900 bg-rose-100/90 border-rose-300'
                : 'text-zinc-800 bg-white/80 border-black/15'
            }`}
          >
            {statusMessage}
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
      />

      {/* Bottom Hint and Controls */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <div className="px-2 py-1 bg-white/80 backdrop-blur-xs text-zinc-700 border border-black/15 rounded text-[10px] font-mono shadow-xs">
            HANDLE: <span className="font-bold text-amber-900">KRAFT TAG</span>
          </div>

          <button
            onClick={handleBreeze}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/85 hover:bg-white text-zinc-800 border border-black/15 rounded text-[10px] font-mono shadow-xs transition-colors"
            title="Trigger gentle room wind impulse"
          >
            <Wind className="w-3 h-3 text-blue-600" />
            <span>BREEZE</span>
          </button>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1 bg-white/85 hover:bg-white text-zinc-800 border border-black/15 rounded text-[10px] font-mono shadow-xs transition-colors"
          title="Reset to ceiling resting position"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET</span>
        </button>
      </div>
    </div>
  );
};
