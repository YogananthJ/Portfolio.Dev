export const LIQUID_METAL_BALL_DETAIL = {
  id: 'liquid-metal-ball',
  number: '01',
  title: 'Liquid Metal Ball',
  subtitle: 'Fluid Chrome Surface Tension & Viscous Organic Deformation',
  description:
    'A reflective chrome sphere that behaves like a fluid material, continuously floating in a dark, elegant rendering environment with realistic specular highlights and spring-damped surface tension reform.',
  category: '3d',
  categoryLabel: '3D & Fluid Dynamics',
  technologies: ['Canvas 2D', 'Surface Tension', 'Ray Shading', 'Spring Dynamics'],
  about: {
    whatItIs:
      'A continuous organic liquid metal sphere constructed with 64 radial harmonic vertices connected through Hooke surface tension springs, rendered with multi-band chrome reflections.',
    whatItIsUsedFor:
      'Used in premium luxury landing pages, high-end creative agency hero sections, interactive 3D product configurators, and modern spatial audio visualization interfaces.',
    howItWorks:
      'Each vertex oscillates along its radial vector. When the pointer interacts, vertices stretch outward; upon release, Hooke surface tension forces (F = -k * Δr - c * vr) pull the liquid back to its equilibrium spherical shape with diminishing fluid oscillations.',
    whatToExplore:
      'Click and drag the chrome sphere to stretch out fluid tendrils. Hover over its boundary to create local dimples. Switch between Chrome, Mercury, and Molten viscosity presets.',
  },
  howItWorksPoints: [
    {
      title: 'Radial Harmonic Oscillator Ring',
      description:
        'The surface is modeled as 64 radial vertices that oscillate harmonically with standing wave equations to create organic fluid breathing motion during idle mode.',
    },
    {
      title: 'Hooke Surface Tension & Fluid Cohesion',
      description:
        'Hooke spring forces pull displaced vertices back toward equilibrium while neighbor-diffusion averaging spreads localized deformation across adjacent vertices, replicating real fluid cohesion.',
    },
    {
      title: 'Multi-Band Studio HDRI Reflection Gradient',
      description:
        'A multi-tier radial gradient combined with specular highlights, rotating studio lighting, and ground bounce simulates photorealistic studio chrome reflections directly in Canvas 2D.',
    },
    {
      title: 'Restorative Spring Damping',
      description:
        'When drag forces cease, viscous damping (0.88) smoothly settles the liquid sphere back into its perfect circular silhouette without jarring cuts or sudden position resets.',
    },
  ],
  files: [
    {
      name: 'LiquidMetalBall.tsx',
      language: 'typescript',
      isPrimary: true,
      code: `import React, { useEffect, useRef, useState } from 'react';

export const LiquidMetalBall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // 64 deformable surface vertices with Hooke surface tension
  return <canvas ref={canvasRef} className="w-full h-full" />;
};`,
    },
  ],
  ideConfig: {
    title: 'Liquid Metal Ball — Motion Lab',
    description: 'Interactive fluid chrome sphere with surface tension physics',
    files: {
      'src/App.tsx': `export default function App() { return <div>Liquid Metal Ball</div>; }`,
    },
    dependencies: {
      react: '^19.0.0',
    },
  },
};
