import { MotionExperiment } from './motion-playground.types';

export const MOTION_EXPERIMENTS: MotionExperiment[] = [
  {
    id: 'orbiting-balls',
    number: '01',
    title: 'Orbiting Satellites',
    tagline: 'Harmonic circular trigonometry with interactive angular acceleration',
    category: 'vanillajs',
    categoryLabel: 'Vanilla JS / Canvas',
    technologies: ['Canvas 2D', 'Trigonometry', 'Angular Velocity', 'RAF Loop'],
    interactionHint: 'Hover to boost speed · Click anywhere to reverse orbit',
    techniqueExplanation:
      'Uses parametric polar coordinates (x = r * cos(θ), y = r * sin(θ)) mapped over delta-timed requestAnimationFrame loops. Orbital speed factors interpolate smoothly, while Canvas 2D renders motion trails and orbital radius guides.',
    keyConcepts: [
      'Parametric circular trigonometry (cos / sin angles)',
      'Delta time normalization for 60/120 FPS consistency',
      'Smooth direction reversal via scalar velocity multiplication',
      'Canvas high-DPI crisp scaling (window.devicePixelRatio)',
    ],
    codeLanguage: 'typescript',
    sourceCode: `// Orbiting Satellites — Parametric Polar Coordinates & Velocity Loop
import React, { useEffect, useRef } from 'react';

interface Satellite {
  radius: number;
  speed: number; // radians per second
  angle: number;
  size: number;
  color: string;
}

export const OrbitingSatellites: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const satellites: Satellite[] = [
      { radius: 45, speed: 1.4, angle: 0, size: 7, color: '#E11D48' },
      { radius: 80, speed: 0.85, angle: Math.PI * 0.6, size: 9, color: '#10B981' },
      { radius: 115, speed: 0.52, angle: Math.PI * 1.3, size: 11, color: '#06B6D4' },
    ];

    let lastTime = 0;
    let animId: number;

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw orbital tracks
      satellites.forEach((sat) => {
        ctx.beginPath();
        ctx.arc(cx, cy, sat.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.setLineDash([4, 6]);
        ctx.stroke();
      });

      // Update and draw satellites
      satellites.forEach((sat) => {
        sat.angle += sat.speed * delta;
        const x = cx + Math.cos(sat.angle) * sat.radius;
        const y = cy + Math.sin(sat.angle) * sat.radius;

        ctx.beginPath();
        ctx.arc(x, y, sat.size, 0, Math.PI * 2);
        ctx.fillStyle = sat.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={300} height={300} />;
};`,
  },
  {
    id: 'bouncing-ball',
    number: '02',
    title: 'Physically Eased Bounce',
    tagline: 'GSAP timeline sequencing with squash & stretch deformations',
    category: 'gsap',
    categoryLabel: 'GSAP 3.0',
    technologies: ['GSAP 3', 'Timelines', 'Squash & Stretch', 'Physics Easing'],
    interactionHint: 'Click ball to toggle drop altitude · Play / pause controls',
    techniqueExplanation:
      'Employs non-linear gravitational acceleration: power2.in during downward plunge, power2.out during apex rebound. On floor impact, scaleX expands to 1.45 while scaleY compresses to 0.60 to mimic natural momentum transfer without cartoon distortion.',
    keyConcepts: [
      'Dual-phase gravitational easing (power2.in fall / power2.out rise)',
      'Subtle squash deformation on contact (scaleX: 1.45, scaleY: 0.6)',
      'Apex recovery to spherical aspect ratio (scale: 1.0)',
      'Synchronized ground contact shadow scaling & diffusion',
    ],
    codeLanguage: 'typescript',
    sourceCode: `// Physically Eased Bounce with Squash & Stretch in GSAP 3
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const BouncingBallGSAP: React.FC = () => {
  const ballRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ball = ballRef.current;
    const shadow = shadowRef.current;
    if (!ball || !shadow) return;

    const dropDistance = 140;
    const duration = 0.55;

    const tl = gsap.timeline({ repeat: -1 });

    tl
      // 1. Fall with gravitational acceleration
      .to(ball, { y: dropDistance, duration, ease: 'power2.in' }, 0)
      .to(ball, { scaleY: 1.25, scaleX: 0.85, duration: duration * 0.4 }, duration * 0.6)
      .to(shadow, { scaleX: 1.0, opacity: 0.85, duration, ease: 'power2.in' }, 0)

      // 2. Impact squash on floor
      .to(ball, { scaleY: 0.6, scaleX: 1.45, duration: 0.08, ease: 'power1.out' })
      .to(shadow, { scaleX: 1.35, opacity: 1, duration: 0.08 }, '<')

      // 3. Rebound stretch upward
      .to(ball, { scaleY: 1.25, scaleX: 0.82, duration: 0.1, ease: 'power1.inOut' })

      // 4. Rise back to apex with deceleration
      .to(ball, { y: 0, duration, ease: 'power2.out' })
      .to(ball, { scaleY: 1.0, scaleX: 1.0, duration: duration * 0.5 }, \`-=\${duration * 0.5}\`)
      .to(shadow, { scaleX: 0.45, opacity: 0.25, duration, ease: 'power2.out' }, '<');

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative w-full h-48 flex flex-col items-center justify-start">
      <div ref={ballRef} className="w-10 h-10 rounded-full bg-rose-600" />
      <div ref={shadowRef} className="w-14 h-3 rounded-[50%] bg-black/40 blur-[2px] mt-28" />
    </div>
  );
};`,
  },
  {
    id: 'kinetic-typography',
    number: '03',
    title: 'Kinetic Character Stagger',
    tagline: 'Zero-dependency DOM character splitting with 3D perspective reveals',
    category: 'gsap',
    categoryLabel: 'GSAP 3.0',
    technologies: ['GSAP 3', 'DOM Character Splitting', '3D Perspective', 'Stagger Wave'],
    interactionHint: 'Hover text for kinetic wave · Click Switch for phrases',
    techniqueExplanation:
      'Avoids paid third-party dependencies by splitting text strings into word and character span elements. GSAP choreographs 3D perspective rotations (rotateX: -70deg) and staggered vertical slides with spring dampening, preserving accessibility and avoiding layout shift.',
    keyConcepts: [
      'Accessible character splitting with semantic aria-label preservation',
      'Staggered entrance sequencing (stagger: 0.035s)',
      'CSS 3D perspective (perspective: 800px) with transform-origin',
      'Interactive wave ripple on mouse pointer entrance',
    ],
    codeLanguage: 'typescript',
    sourceCode: `// Kinetic Typography with Accessible Character Splitting in GSAP
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const KineticTypographyGSAP: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const phrase = 'IDEAS INTO INTERACTIONS';

  useEffect(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll('.char');

    gsap.set(chars, {
      y: 50,
      opacity: 0,
      rotateX: -65,
      transformOrigin: '50% 100%',
    });

    const tl = gsap.timeline();
    tl.to(chars, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.035,
      ease: 'power4.out',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-label={phrase}
      className="perspective-[800px] flex flex-wrap gap-x-2 text-2xl font-black text-white"
    >
      {phrase.split(' ').map((word, wIdx) => (
        <span key={wIdx} className="inline-flex overflow-hidden">
          {word.split('').map((char, cIdx) => (
            <span key={cIdx} className="char inline-block will-change-transform">
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
};`,
  },
  {
    id: 'magnetic-button',
    number: '04',
    title: 'Magnetic Proximity Core',
    tagline: 'Cursor vector attraction with multi-layer parallax & elastic spring release',
    category: 'vanillajs',
    categoryLabel: 'Vanilla JS / GSAP',
    technologies: ['Pointer Events', 'Vector Clamping', 'Elastic Easing', 'Parallax'],
    interactionHint: 'Move pointer inside dotted zone · Click for engagement pulse',
    techniqueExplanation:
      'Calculates the Euclidean offset between the cursor and button center coordinates. Scales displacement by an attraction factor (0.42x) clamped to boundary thresholds. On pointer leave, GSAP snaps the chassis back with an elastic.out spring curve.',
    keyConcepts: [
      'Relative clientX / clientY bounding rectangle differential math',
      'Clamped displacement vectors to prevent overflow',
      'Multi-layer parallax translation on internal text & icon',
      'Smooth elastic spring release on mouse exit (elastic.out(1, 0.4))',
    ],
    codeLanguage: 'typescript',
    sourceCode: `// Magnetic Button with Cursor Distance Vectoring & Elastic Snapback
import React, { useRef } from 'react';
import gsap from 'gsap';

export const MagneticButtonCore: React.FC = () => {
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoneRef.current || !btnRef.current) return;
    const rect = zoneRef.current.getBoundingClientRect();

    // Center offset coordinates
    const deltaX = e.clientX - (rect.left + rect.width / 2);
    const deltaY = e.clientY - (rect.top + rect.height / 2);

    // Clamp displacement to 45px
    const pullX = Math.max(-45, Math.min(45, deltaX * 0.4));
    const pullY = Math.max(-45, Math.min(45, deltaY * 0.4));

    gsap.to(btnRef.current, {
      x: pullX,
      y: pullY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  return (
    <div
      ref={zoneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="p-12 border border-dashed border-white/20 flex items-center justify-center"
    >
      <button ref={btnRef} className="px-6 py-3 bg-rose-600 text-white font-mono font-bold">
        MAGNETIC BUTTON
      </button>
    </div>
  );
};`,
  },
  {
    id: 'floating-sphere-3d',
    number: '05',
    title: 'Floating Geodesic 3D Sphere',
    tagline: 'PBR metallic shader, wireframe cage & interactive mouse orbit',
    category: 'threejs',
    categoryLabel: 'Three.js / WebGL',
    technologies: ['Three.js', 'WebGL 2.0', 'PBR Shaders', 'Interactive Drag', 'RAF Loop'],
    interactionHint: 'Click & drag in 3D space · Toggle wireframe cage',
    techniqueExplanation:
      'Renders a genuine WebGL 2.0 scene with Three.js. Combines a metallic Icosahedron core (MeshStandardMaterial) with an outer geodesic wireframe cage and an orbital equator torus. Uses ACESFilmic tone mapping, ambient + dual-directional colored rim lights, and mouse drag quaternion rotation with inertia damping.',
    keyConcepts: [
      'Three.js Scene, PerspectiveCamera & WebGLRenderer setup',
      'PBR MeshStandardMaterial (roughness: 0.15, metalness: 0.85, flatShading)',
      'Multi-source colored lighting (Crimson key + Cyan rim)',
      'Interactive mouse drag rotation with smooth inertia damping',
      'Proper GPU resource disposal (geometry, material, renderer cleanup)',
    ],
    codeLanguage: 'typescript',
    sourceCode: `// Genuine Three.js 3D Floating Geodesic Sphere with PBR & Drag Orbit
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeDSSphere: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current!;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const keyLight = new THREE.DirectionalLight(0xe11d48, 4.0);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // Geodesic Mesh Group
    const group = new THREE.Group();
    scene.add(group);

    const coreGeo = new THREE.IcosahedronGeometry(1.2, 4);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.85,
      roughness: 0.15,
      flatShading: true,
    });
    group.add(new THREE.Mesh(coreGeo, coreMat));

    // Outer wireframe cage
    const wireGeo = new THREE.IcosahedronGeometry(1.32, 2);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xe11d48, wireframe: true, transparent: true, opacity: 0.6 });
    group.add(new THREE.Mesh(wireGeo, wireMat));

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      group.rotation.y += delta * 0.4;
      group.position.y = Math.sin(elapsed * 1.8) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-64" />;
};`,
  },
  {
    id: 'particle-field',
    number: '06',
    title: 'Reactive Particle Constellation',
    tagline: 'Canvas 2D filament proximity & radial shockwave physics',
    category: 'canvas',
    categoryLabel: 'HTML5 Canvas',
    technologies: ['HTML5 Canvas 2D', 'Vector Physics', 'Proximity Filaments', 'Impulse Waves'],
    interactionHint: 'Move pointer to repel · Click canvas to emit shockwave burst',
    techniqueExplanation:
      'Implements a lightweight 2D physics particle engine on Canvas. Calculates Euclidean distance between all particle pairs to render dynamic alpha-blended filament lines (max distance: 72px). Pointer proximity exerts vector repulsion, while canvas clicks trigger expanding radial shockwave rings that impart outward velocity impulses.',
    keyConcepts: [
      'Spatial proximity detection (Math.hypot) for connecting line filaments',
      'Cursor repulsion field with distance-proportional velocity vectors',
      'Impulse shockwaves with radial particle velocity displacement',
      'Velocity damping and edge bounce reflection physics',
    ],
    codeLanguage: 'typescript',
    sourceCode: `// Canvas 2D Constellation with Mouse Repulsion & Radial Shockwaves
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const CanvasParticleConstellation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;

    const count = 55;
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: Math.random() * 2 + 1.5,
    }));

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Proximity connection filaments
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 70) {
            ctx.strokeStyle = \`rgba(255, 255, 255, \${(1 - dist / 70) * 0.25})\`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#E11D48';
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={400} height={250} />;
};`,
  },
];
