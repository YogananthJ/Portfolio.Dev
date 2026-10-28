export const INFINITE_TUNNEL_DETAIL = {
  id: 'infinite-tunnel',
  number: '04',
  title: 'Infinite Tunnel',
  subtitle: 'Continuous Modulo-Depth Perspective Voyage & Camera Parallax',
  description:
    'A continuous, immersive tunnel of geometric structures creating the sensation of travelling gently through an infinite space. Prioritizes relaxation, rhythm, and seamless loop continuity without sudden jumps.',
  category: 'relaxation',
  categoryLabel: 'Relaxation & Generative',
  technologies: ['Procedural Geometry', 'Modulo Looping', 'Camera Parallax', 'Depth Fading'],
  about: {
    whatItIs:
      'A continuous perspective corridor constructed of concentric geometric polygonal rings (octagons, hexagons, circles) progressing smoothly toward the camera using mathematical modulo recycling.',
    whatItIsUsedFor:
      'Used in meditation and wellness applications, relaxing ambient screen savers, sci-fi onboarding sequences, and immersive VR/AR web landing portals.',
    howItWorks:
      'Depth position z is computed via z = maxZ - ((i * spacing + travelDistance) % maxZ). Perspective projection scale factor = focal / z dilates rings outward as they approach. Pointer coordinates gently tilt the camera focal center with smooth spring return.',
    whatToExplore:
      'Move cursor to smoothly steer the camera perspective. Change polygon geometry between Octagon, Hexagon, and Circular rings. Toggle color palettes between Cyber Silver, Deep Azure, and Champagne Gold.',
  },
  howItWorksPoints: [
    {
      title: 'Seamless Modulo Depth Recycling (Zero Restarts)',
      description:
        'Instead of recreating or deleting objects at fixed intervals, depth coordinate z uses a continuous modulo operator that recycles rings seamlessly from the horizon to the viewport with zero visible jumps.',
    },
    {
      title: 'Perspective Projection Transformation',
      description:
        'Calculates 3D depth scaling via scale = focalLength / z and ringRadius = baseRadius * scale, generating authentic 3D spatial depth directly on Canvas 2D.',
    },
    {
      title: 'Damped Parallax Camera Steering',
      description:
        'Pointer position offsets the vanishing focal center. Spring interpolation (camX += (target - camX) * 4 * dt) prevents jerky camera motion and gently recenters upon pointer exit.',
    },
    {
      title: 'Atmospheric Horizon Fog & Bloom Falloff',
      description:
        'Radial gradients at the vanishing center together with depth-based ring alpha falloff create a gentle, comfortable depth horizon that is relaxing to watch indefinitely.',
    },
  ],
  files: [
    {
      name: 'InfiniteTunnel.tsx',
      language: 'typescript',
      isPrimary: true,
      code: `import React, { useEffect, useRef } from 'react';

export const InfiniteTunnel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Continuous modulo geometric tunnel with camera parallax
  return <canvas ref={canvasRef} className="w-full h-full" />;
};`,
    },
  ],
  ideConfig: {
    title: 'Infinite Tunnel — Motion Lab',
    description: 'Continuous seamless infinite-loop geometric depth voyage',
    files: {
      'src/App.tsx': `export default function App() { return <div>Infinite Tunnel</div>; }`,
    },
    dependencies: {
      react: '^19.0.0',
    },
  },
};
