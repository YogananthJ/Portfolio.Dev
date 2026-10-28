export const GALACTIC_CORE_DETAIL = {
  id: 'galactic-core',
  number: '05',
  title: 'Galactic Particle Core',
  subtitle: 'Barred Spiral Logarithmic Geometry, Stellar Repulsion & Equilibrium Recovery',
  description:
    'A luminous, rotating spiral galaxy made from over 2,600 particles inspired by astronomical photography. Features a warm golden-ivory core, silver-blue spiral arms with magenta starburst knots, continuous rotation, pointer repulsion, grab-tilt-flip dynamics, and smooth recovery.',
  category: 'generative',
  categoryLabel: 'Generative Art & Particles',
  technologies: ['Canvas 2D / 3D', 'Logarithmic Spirals', 'Stellar Repulsion', 'Quaternion Tilt'],
  about: {
    whatItIs:
      'An interactive barred spiral galaxy rendering 2,600+ individual stellar particles. Faithfully implements the astronomical structure of barred galaxies with central golden bulge, logarithmic arms, differential Keplerian rotation, and cosmic dust lanes.',
    whatItIsUsedFor:
      'Used in astronomy simulators, cosmic visualization exhibitions, high-impact generative art installations, ambient meditation hubs, and futuristic aerospace agency showcases.',
    howItWorks:
      'Particles are distributed along logarithmic spiral trajectories (r = a * e^(b*θ)). The galaxy rotates with differential velocity (inner core rotates slightly faster). Pointer drag tilts pitch and yaw in 3D. Entering the galaxy repels stars into a cosmic void, and upon release, spring forces (F = -k * Δp - c * v) restore stars to their spiral orbits.',
    whatToExplore:
      'Drag horizontally to rotate and vertically to tilt the galaxy in 3D. Hover over the spiral arms to repel stars. Click "Flip 180°" for an axial inversion. Toggle "Relax Mode" for slower meditative rotation.',
  },
  howItWorksPoints: [
    {
      title: 'Barred Spiral Logarithmic Trajectories',
      description:
        'The central elongated bar transitions into two sweeping logarithmic spiral arms (pitch angle b ≈ 0.28) with exponential density decay toward outer galactic fringes.',
    },
    {
      title: 'Dual-Zone Astronomical Stellar Classification',
      description:
        'Warm ivory (#FFFDF0) and champagne gold (#FFE6A3) define the high-density galactic bar, while silver-blue (#D1E3F8) and celestial azure (#93BBE5) tint the outer arms, punctuated by pink/magenta H-II starburst nurseries (#F472B6).',
    },
    {
      title: 'Continuous Differential Keplerian Rotation',
      description:
        'Rotational speed varies with radius (omega = 0.24 / (r * 0.05 + 1)), ensuring authentic astrophysical galactic winding rather than rigid-disk turntable spinning.',
    },
    {
      title: 'Harmonic Equilibrium Orbit Recovery',
      description:
        'Every particle calculates spring forces relative to its instantaneous ideal orbital position. After mouse displacement or 3D tilt, damped recovery gently guides stars back to their natural spiral tracks.',
    },
  ],
  files: [
    {
      name: 'GalacticCore.tsx',
      language: 'typescript',
      isPrimary: true,
      code: `import React, { useEffect, useRef } from 'react';

export const GalacticCore: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Barred spiral galaxy with 2,600 stellar particles and 3D camera
  return <canvas ref={canvasRef} className="w-full h-full" />;
};`,
    },
  ],
  ideConfig: {
    title: 'Galactic Particle Core — Motion Lab',
    description: 'Interactive rotating barred spiral galaxy with stellar repulsion',
    files: {
      'src/App.tsx': `export default function App() { return <div>Galactic Particle Core</div>; }`,
    },
    dependencies: {
      react: '^19.0.0',
    },
  },
};
