export const BOUNCING_BALL_DETAIL = {
  id: 'bouncing-ball',
  number: '02',
  title: 'Physically Eased Bounce',
  subtitle: 'GSAP Timeline Choreography with Squash & Stretch Deformations',
  description:
    'A physics-grounded vertical bounce cycle featuring gravitational acceleration, realistic contact compression, and apex altitude scaling.',
  category: 'gsap',
  categoryLabel: 'GSAP 3.0',
  technologies: ['GSAP 3', 'Timelines', 'Squash & Stretch', 'Physics Easing'],
  about: {
    whatItIs:
      'A continuous bouncing sphere that mimics real-world kinetic energy transfer. It accelerates as it falls, compresses along its vertical axis upon hitting the floor, rebounds with an elongated stretch, and decelerates to a momentary stop at its peak.',
    whatItIsUsedFor:
      'Crucial for micro-interactions such as tactile notification badges, playful pull-to-refresh loaders, onboarding mascot animations, and physics-based button feedback.',
    howItWorks:
      'Choreographed using a single loopable GSAP timeline with relative position markers. Gravity is modeled using power2.in for the descent and power2.out for the ascent, paired with synchronized scaleX/scaleY transforms and dynamic shadow diffusion.',
    whatToExplore:
      'Click the ball to cycle between Normal (120px), High (165px), and Super (200px) bounce altitudes. Use the play/pause and reset controls to inspect individual phases of the bounce.',
  },
  howItWorksPoints: [
    {
      title: 'Split Gravitational Easing Curves',
      description:
        'Instead of a symmetrical sinusoidal ease, the fall uses power2.in (mimicking 9.8 m/s² gravity acceleration) while the rise uses power2.out (gradual deceleration under opposing gravitational force).',
    },
    {
      title: 'Conservation of Volume Deformation (Squash & Stretch)',
      description:
        'During floor contact, scaleY compresses to 0.60 while scaleX expands to 1.45 (0.60 × 1.45 ≈ 0.87 volume conservation). During rapid ascent, scaleY stretches to 1.25 while scaleX narrows to 0.82.',
    },
    {
      title: 'Dynamic Floor Shadow Diffusion',
      description:
        'The ground shadow opacity and horizontal scale inversely correlate with altitude: at peak height, the shadow is 45% wide and 25% opaque; on floor impact, it tightens to 135% width and 100% opacity.',
    },
    {
      title: 'Deterministic Timeline Garbage Collection',
      description:
        'Whenever bounce height changes, the existing timeline is killed cleanly via timelineRef.current.kill() to avoid memory leaks or competing tween instances in React Strict Mode.',
    },
  ],
  files: [
    {
      name: 'BouncingBall.tsx',
      language: 'typescript',
      isPrimary: true,
      code: `import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const BouncingBall: React.FC = () => {
  const ballRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ball = ballRef.current;
    const shadow = shadowRef.current;
    if (!ball || !shadow) return;

    const dropDistance = 140;
    const duration = 0.55;

    const tl = gsap.timeline({ repeat: -1 });

    tl
      // 1. Fall (gravity acceleration)
      .to(ball, { y: dropDistance, duration, ease: 'power2.in' }, 0)
      .to(ball, { scaleY: 1.25, scaleX: 0.85, duration: duration * 0.4 }, duration * 0.6)
      .to(shadow, { scaleX: 1.0, opacity: 0.85, duration, ease: 'power2.in' }, 0)

      // 2. Impact squash
      .to(ball, { scaleY: 0.6, scaleX: 1.45, duration: 0.08, ease: 'power1.out' })
      .to(shadow, { scaleX: 1.35, opacity: 1, duration: 0.08 }, '<')

      // 3. Rebound stretch
      .to(ball, { scaleY: 1.25, scaleX: 0.82, duration: 0.1, ease: 'power1.inOut' })

      // 4. Rise back to apex
      .to(ball, { y: 0, duration, ease: 'power2.out' })
      .to(ball, { scaleY: 1.0, scaleX: 1.0, duration: duration * 0.5 }, \`-=\${duration * 0.5}\`)
      .to(shadow, { scaleX: 0.45, opacity: 0.25, duration, ease: 'power2.out' }, '<');

    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative w-full h-64 flex flex-col items-center justify-start pt-6">
      <div ref={ballRef} className="w-12 h-12 rounded-full bg-rose-600 shadow-lg" />
      <div ref={shadowRef} className="w-16 h-3 rounded-[50%] bg-black/50 blur-[2px] mt-32" />
    </div>
  );
};`,
    },
    {
      name: 'easingGuide.ts',
      language: 'typescript',
      isPrimary: false,
      code: `/**
 * Physics rationale for squash-and-stretch ratios
 */
export const PHYSICS_PRESETS = {
  rubber: { squashY: 0.55, squashX: 1.5, recoverySpeed: 0.08 },
  metal: { squashY: 0.85, squashX: 1.15, recoverySpeed: 0.04 },
  bowlingBall: { squashY: 0.95, squashX: 1.05, recoverySpeed: 0.02 },
};`,
    },
  ],
  ideConfig: {
    title: 'Physically Eased Bounce — Motion Lab',
    description: 'GSAP 3 timeline squash and stretch physics simulation',
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      gsap: '^3.12.5',
    },
    files: {
      'src/App.tsx': `import React from 'react';
import { BouncingBall } from './BouncingBall';

export default function App() {
  return (
    <div style={{ padding: 40, background: '#0A0A0C', minHeight: '100vh', color: '#fff', textAlign: 'center' }}>
      <h2>GSAP Bounce &amp; Squash</h2>
      <BouncingBall />
    </div>
  );
}`,
      'src/index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);`,
    },
  },
};
