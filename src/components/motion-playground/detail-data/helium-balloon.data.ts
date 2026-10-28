export const HELIUM_BALLOON_DETAIL = {
  id: 'helium-balloon',
  number: '06',
  title: 'Helium Balloon Playground',
  subtitle: 'Buoyancy, Multi-Segment Verlet String Chain & Cardboard Tag Reference',
  description:
    'A realistic, glossy helium balloon floating in a soft, neutral indoor environment. A flexible string connects the balloon to a small square brown cardboard tag underneath. Visitors can grab the tag, pull downward, drag sideways, swing it, and release it with realistic inertia lag and natural recovery.',
  category: 'physics',
  categoryLabel: 'Realistic Physics & Simulation',
  technologies: ['Verlet String Chain', 'Buoyancy & Lag', 'Soft Latex Squash', 'Ceiling Collision'],
  about: {
    whatItIs:
      'A physics playground accurately modeling a helium balloon connected via a 10-node Verlet string chain to a square brown kraft paper tag with a punched hole, inspired directly by real-world photographic references.',
    whatItIsUsedFor:
      'Used in tactile interactive web games, physics educational engines, playful e-commerce anniversary celebrations, brand storytelling narratives, and tactile creative showcases.',
    howItWorks:
      'Simulates Archimedean buoyancy accelerating the balloon toward the ceiling. The cardboard tag serves as an interactive drag handle. Pulling the tag draws the Verlet string taut, applying tension that pulls down and tilts the balloon with realistic mass inertia. Releasing allows harmonic spring recovery as the balloon bobs and settles against the ceiling.',
    whatToExplore:
      'Grab the square brown cardboard tag directly with your mouse or finger. Pull it downward and drag it sideways. Release it to observe the string oscillations diminish naturally. Switch between Crimson Red, Sky Blue (photo ref), and Champagne Gold.',
  },
  howItWorksPoints: [
    {
      title: 'Archimedean Buoyancy & Ceiling Collision',
      description:
        'Calculates continuous upward buoyant acceleration. When contacting the ceiling, collision logic caps position and squashes the balloon horizontally (scaleX > 1.0, scaleY < 1.0) exactly like real inflated latex.',
    },
    {
      title: '10-Node Verlet Distance Constraint Solver',
      description:
        'The ribbon string consists of 10 interlinked nodes resolved through multiple relaxation iterations. The top node is anchored to the balloon neck while the bottom node loops through the punched hole in the cardboard tag.',
    },
    {
      title: 'Inertia Lag & Rotational Tilt Dynamics',
      description:
        'Because the balloon possesses virtual mass, dragging the tag rapidly causes the balloon to tilt and lag behind the motion path, preventing stiff rod-like movement.',
    },
    {
      title: 'Natural Harmonic Decay & Idle Floating',
      description:
        'Upon pointer release, kinetic damping smoothly dissipates string oscillations while subtle ambient breeze currents keep the balloon floating and swaying naturally indefinitely.',
    },
  ],
  files: [
    {
      name: 'HeliumBalloon.tsx',
      language: 'typescript',
      isPrimary: true,
      code: `import React, { useEffect, useRef, useState } from 'react';

export const HeliumBalloon: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Realistic helium balloon with buoyancy, Verlet string, and draggable tag
  return <canvas ref={canvasRef} className="w-full h-full" />;
};`,
    },
  ],
  ideConfig: {
    title: 'Helium Balloon Playground — Motion Lab',
    description: 'Realistic helium balloon with string tension and draggable tag',
    files: {
      'src/App.tsx': `export default function App() { return <div>Helium Balloon Playground</div>; }`,
    },
    dependencies: {
      react: '^19.0.0',
    },
  },
};
