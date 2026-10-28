export const ATOMIC_NETWORK_DETAIL = {
  id: 'atomic-network',
  number: '02',
  title: 'Atomic Network',
  subtitle: 'Electrostatic Cursor Forces & Interconnected Elastic Lattice Bonds',
  description:
    'An interconnected network of hundreds of molecular atoms connected by delicate elastic bonds. Demonstrates responsive cursor repulsion, shockwave propagation, and spring-damping return to stored home positions.',
  category: 'particles',
  categoryLabel: 'Particle Systems & Physics',
  technologies: ['Canvas 2D', 'Verlet Dynamics', 'Spatial Bonds', 'Shockwaves'],
  about: {
    whatItIs:
      'A responsive molecular lattice containing over 80 atom nodes connected by dynamic covalent bonds. Every node retains a stored equilibrium home coordinate and reacts dynamically to cursor presence and shockwaves.',
    whatItIsUsedFor:
      'Used in scientific dashboards, biotech data visualization platforms, interactive hero backdrops for AI research labs, and cybersecurity network topology maps.',
    howItWorks:
      'Each node runs a Hooke spring loop pulling it towards (homeX, homeY). When the pointer is within the force radius, an electrostatic force vector accelerates the atom outward. Nearby connections stretch dynamically and propagate kinetic energy.',
    whatToExplore:
      'Move cursor across the lattice to disperse atoms into a clear void. Click anywhere to trigger an expanding circular shockwave. Toggle between Repulsion and Attraction modes.',
  },
  howItWorksPoints: [
    {
      title: 'Stored Equilibrium Home Lattice Points',
      description:
        'Every node preserves its home coordinates. When user disturbance ceases, restoring spring forces (F = -k * Δx) smoothly guide each atom back to its exact grid coordinate.',
    },
    {
      title: 'Inverse-Distance Vector Force Field',
      description:
        'Atoms inside the interaction radius calculate normalized directional vectors (nx, ny) and receive velocity impulses scaled inversely by their distance from the pointer.',
    },
    {
      title: 'Dynamic Covalent Bond Distance Solver',
      description:
        'Bonds between nodes are computed each frame: pairs with distance less than 62px render an elastic line whose opacity and stroke reflect physical bond tension.',
    },
    {
      title: 'Expanding Radial Shockwave Wave-Packets',
      description:
        'Click impulses create expanding circular wave rings that apply temporary outward velocity boosts to all atoms intersecting the expanding wave boundary.',
    },
  ],
  files: [
    {
      name: 'AtomicNetwork.tsx',
      language: 'typescript',
      isPrimary: true,
      code: `import React, { useEffect, useRef, useState } from 'react';

export const AtomicNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Atomic network with Hooke home springs and electrostatic repulsion
  return <canvas ref={canvasRef} className="w-full h-full" />;
};`,
    },
  ],
  ideConfig: {
    title: 'Atomic Network — Motion Lab',
    description: 'Interconnected molecular lattice with shockwave propagation',
    files: {
      'src/App.tsx': `export default function App() { return <div>Atomic Network</div>; }`,
    },
    dependencies: {
      react: '^19.0.0',
    },
  },
};
