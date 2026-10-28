import { MotionExperiment } from './motion-playground.types';

export const MOTION_EXPERIMENTS: MotionExperiment[] = [
  {
    id: 'liquid-metal-ball',
    number: '01',
    title: 'Liquid Metal Ball',
    tagline: 'Reflective chrome fluid sphere with dynamic surface tension & liquid deformation',
    category: '3d',
    categoryLabel: '3D & Fluid Dynamics',
    technologies: ['Canvas 2D', 'Surface Tension', 'Ray Shading', 'Spring Dynamics'],
    interactionHint: 'Drag to stretch tendril · Hover to indent · Melt to liquefy',
    techniqueExplanation:
      'Models a continuous fluid chrome sphere using radial harmonic oscillators and surface tension Hooke springs. Radial splines generate smooth metallic contour gradients with simulated HDRI specular reflection bands and viscous fluid damping.',
    keyConcepts: [
      'Deformable radial harmonic vertex ring (64 oscillators)',
      'Surface tension Hooke forces (F = -k * Δr - c * vr)',
      'Specular chrome reflection mapping and diffuse falloff',
      'Fluid cohesion neighbor diffusion and teardrop elongation',
    ],
    codeLanguage: 'typescript',
    sourceCode: `// Liquid Metal Ball — Surface Tension & Fluid Chrome Dynamics
import React, { useEffect, useRef } from 'react';

export const LiquidMetalBall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const numVertices = 64;
    const baseR = 70;
    const vertices = Array.from({ length: numVertices }, (_, i) => ({
      angle: (i / numVertices) * Math.PI * 2,
      r: baseR,
      vr: 0,
    }));

    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spring surface tension towards baseR
      const k = 32.0;
      const damping = 0.89;
      for (const v of vertices) {
        const f = -k * (v.r - baseR);
        v.vr += f * dt;
        v.vr *= damping;
        v.r += v.vr * dt;
      }

      // Render smooth spline and metallic gradient
      ctx.beginPath();
      // ... cardinal spline contour and radial chrome gradient
      ctx.fill();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};`,
  },
  {
    id: 'atomic-network',
    number: '02',
    title: 'Atomic Network',
    tagline: 'Interconnected molecular lattice with shockwave propagation & elastic bond physics',
    category: 'particles',
    categoryLabel: 'Particle Systems',
    technologies: ['Canvas 2D', 'Verlet Dynamics', 'Spatial Bonds', 'Shockwaves'],
    interactionHint: 'Hover to repel/attract atoms · Click for expanding shockwave',
    techniqueExplanation:
      'Simulates an interconnected molecular lattice where each atom maintains an equilibrium home coordinate. Cursor entry applies 1/r² electrostatic forces, while elastic Hooke spring bonds transfer displacement and shockwaves across neighboring nodes.',
    keyConcepts: [
      'Equilibrium home lattice retention with spring return',
      'Configurable Coulomb electrostatic repulsion / magnetic attraction',
      'Dynamic covalent bond rendering based on Euclidean distance threshold',
      'Circular radial shockwave wave-packet propagation',
    ],
    codeLanguage: 'typescript',
    sourceCode: `// Atomic Network — Electrostatic Forces & Molecular Spring Lattice
import React, { useEffect, useRef } from 'react';

export const AtomicNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    // Initialize lattice nodes with home coordinates
    const nodes = []; // { x, y, homeX, homeY, vx, vy }
    
    // Spring physics: F = -k * (x - homeX) - c * vx
    // Repulsion physics: F = (1 - dist / radius) * force
    // Render dynamic covalent bonds for dist < maxDist
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};`,
  },
  {
    id: 'chaotic-typography',
    number: '03',
    title: 'Chaotic Typography',
    tagline: 'Independent letter physics with bounce, explosion, elastic stretch & vortex modes',
    category: 'typography',
    categoryLabel: 'Typography & Physics',
    technologies: ['DOM Elements', 'GSAP 3', 'Verlet Physics', 'Layout Baseline'],
    interactionHint: 'Click to launch into air · Switch modes · Type custom phrase',
    techniqueExplanation:
      'Deconstructs textual strings into accessible DOM elements managed by an independent physics solver. Features harmonic bouncing with squash-and-stretch landing, explosive scattering, and elastic tethering, with guaranteed smooth baseline reconstruction.',
    keyConcepts: [
      'Per-character independent kinematic state (x, y, rotation, scale)',
      'Squash and stretch landing phase calculation',
      'Reconstructive spring forces returning letters to layout baseline',
      'Zero layout shift or text clipping across responsive screens',
    ],
    codeLanguage: 'typescript',
    sourceCode: `// Chaotic Typography — Independent Letter Kinematics & Baseline Recovery
import React, { useRef } from 'react';

export const ChaoticTypography: React.FC = () => {
  // Letters maintain independent physics state and return to baseline (0, 0)
  return <div>Interactive Typography Playground</div>;
};`,
  },
  {
    id: 'infinite-tunnel',
    number: '04',
    title: 'Infinite Tunnel',
    tagline: 'Continuous, seamless infinite-loop geometric depth voyage with mouse parallax',
    category: 'relaxation',
    categoryLabel: 'Relaxation & Generative',
    technologies: ['Procedural Geometry', 'Modulo Looping', 'Camera Parallax', 'Depth Fading'],
    interactionHint: 'Move cursor to steer camera · Change shape & color palette',
    techniqueExplanation:
      'Implements an infinite geometric perspective tunnel using continuous modulo depth mathematics: z = maxZ - ((i * spacing + offset) % maxZ). Perspective projection scale = focal / z ensures 100% seamless continuity with zero jump restarts.',
    keyConcepts: [
      'Continuous modulo depth looping (zero discontinuity)',
      'Perspective projection matrix and geometric ring dilation',
      'Damped camera focal tilt responding to pointer coordinates',
      'Depth fog and geometric vertex illumination',
    ],
    codeLanguage: 'typescript',
    sourceCode: `// Infinite Tunnel — Seamless Modulo Depth Mathematics
import React, { useEffect, useRef } from 'react';

export const InfiniteTunnel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // z = maxZ - ((i * spacing + travelDistance) % maxZ)
    // scale = focalLength / z
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};`,
  },
  {
    id: 'galactic-core',
    number: '05',
    title: 'Galactic Particle Core',
    tagline: 'Luminous rotating spiral galaxy with warm golden core, stellar repulsion & grab-tilt-flip dynamics',
    category: 'generative',
    categoryLabel: 'Generative Art & Particles',
    technologies: ['Canvas 2D / 3D', 'Logarithmic Spirals', 'Stellar Repulsion', 'Quaternion Tilt'],
    interactionHint: 'Drag to tilt & rotate · Hover to open cosmic void · Flip 180°',
    techniqueExplanation:
      'Procedurally constructs a barred spiral galaxy of 2,600+ stellar particles matching astronomical references. Features differential Keplerian rotation, 3D pitch/yaw camera controls, cursor stellar repulsion, and damped cosmic equilibrium recovery.',
    keyConcepts: [
      'Barred spiral geometry using logarithmic spiral arms r = a * e^(b*θ)',
      'Dual-zone stellar classification: golden-ivory bar core & silver-blue arms',
      'Pink/magenta H-II starburst nebular clusters matching reference photography',
      'Spring-damped harmonic orbital return after pointer repulsion',
    ],
    codeLanguage: 'typescript',
    sourceCode: `// Galactic Particle Core — Barred Spiral Logarithmic Equations & Repulsion
import React, { useEffect, useRef } from 'react';

export const GalacticCore: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // 2,600 particles generated with logarithmic spiral arm equations:
  // r = maxRadius * 0.22 + t * maxRadius * 0.78
  // theta = ln(r / r0) / b + armOffset
  // Differential Keplerian rotation: omega = 0.24 / (r * 0.05 + 1)
  return <canvas ref={canvasRef} className="w-full h-full" />;
};`,
  },
  {
    id: 'helium-balloon',
    number: '06',
    title: 'Helium Balloon Playground',
    tagline: 'Realistic glossy helium balloon with hanging string & draggable kraft tag reference',
    category: 'physics',
    categoryLabel: 'Realistic Physics',
    technologies: ['Verlet String Chain', 'Buoyancy & Lag', 'Soft Latex Squash', 'Ceiling Collision'],
    interactionHint: 'Grab & drag brown cardboard tag · Pull string taut · Feel inertia lag',
    techniqueExplanation:
      'Faithfully replicates real-world balloon physics inspired by photo reference. Incorporates Archimedean buoyancy, ceiling collision with flattening squash, multi-segment Verlet string tension, draggable brown kraft cardboard tag with punched hole, and natural damped recovery.',
    keyConcepts: [
      'Archimedean buoyant upward force balancing downward gravitational tag pull',
      'Multi-node Verlet string distance constraint solver (10 segments)',
      'Cardboard tag draggable physics handle with punched hole and string knot',
      'Ceiling collision with soft latex flattening and window specular highlights',
    ],
    codeLanguage: 'typescript',
    sourceCode: `// Helium Balloon Playground — Verlet String & Buoyancy Simulation
import React, { useEffect, useRef } from 'react';

export const HeliumBalloon: React.FC = () => {
  // Verlet string chain with distance constraint relaxation
  // Buoyancy acceleration: balloonVy += buoyancy * dt
  // Cardboard tag drag handle with inertia and swinging oscillation
  return <canvas className="w-full h-full" />;
};`,
  },
];
