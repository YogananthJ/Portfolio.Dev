export const PARTICLE_FIELD_DETAIL = {
  id: 'particle-field',
  number: '06',
  title: 'Reactive Particle Constellation',
  subtitle: 'Canvas 2D Filament Proximity Graphs & Kinetic Shockwave Impulses',
  description:
    'A high-performance HTML5 Canvas particle network calculating real-time Euclidean distance filaments, cursor repulsion vectors, and radial blast impulses.',
  category: 'canvas',
  categoryLabel: 'HTML5 Canvas',
  technologies: ['HTML5 Canvas 2D', 'Vector Physics', 'Proximity Filaments', 'Impulse Waves'],
  about: {
    whatItIs:
      'A particle physics simulation rendered on a 2D Canvas context. Dozens of floating nodes drift with randomized velocities. When nodes pass within 72px of one another, connecting alpha-blended lines form. Moving the pointer creates a repulsive vector force field, and clicking discharges a shockwave impulse.',
    whatItIsUsedFor:
      'Interactive website hero backgrounds, data network topology graphs, creative code sandboxes, and immersive interactive portfolio canvases.',
    howItWorks:
      'Iterates through particle arrays in a single RAF tick, computing Euclidean distances (Math.hypot(dx, dy)) for connecting filaments. Repulsion applies inverse distance scaling to particle velocities. Shockwave rings propagate outward radially, displacing nearby particles with vector acceleration.',
    whatToExplore:
      'Glide your mouse across the canvas to disperse the constellation. Click anywhere to trigger an explosive shockwave burst that radiates outwards. Reset the field or trigger center blasts using the bottom controls.',
  },
  howItWorksPoints: [
    {
      title: 'O(N²/2) Pairwise Proximity Graph Detection',
      description:
        'Uses an optimized nested loop starting at j = i + 1 to avoid redundant duplicate checks. When distance < 72px, the line alpha is mapped via alpha = (1 - dist / 72) * 0.22 for smooth fade-outs.',
    },
    {
      title: 'Vector Pointer Repulsion with Velocity Damping',
      description:
        'When the cursor enters the canvas, particles within 90px calculate directional unit vectors (dx/dist, dy/dist). Velocity increases proportionally and is subjected to a 0.96 friction multiplier on every tick.',
    },
    {
      title: 'Expanding Radial Impulse Waves',
      description:
        'Clicks create shockwave objects with expanding radii (radius += 3.5px/frame). Any particle within the shockwave boundary receives an outward velocity kick based on distance attenuation.',
    },
    {
      title: 'Device-Responsive Density Management',
      description:
        'Particle counts dynamically adjust between mobile (38 nodes) and desktop (65 nodes) to guarantee smooth 60 FPS drawing without overheating mobile GPUs.',
    },
  ],
  files: [
    {
      name: 'ParticleField.tsx',
      language: 'typescript',
      isPrimary: true,
      code: `import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

      // 1. Proximity filaments
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 72) {
            ctx.strokeStyle = \`rgba(255, 255, 255, \${(1 - dist / 72) * 0.25})\`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 2. Update & render particles
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

  return <canvas ref={canvasRef} width={400} height={260} />;
};`,
    },
  ],
  ideConfig: {
    title: 'Reactive Particle Constellation — Motion Lab',
    description: 'Canvas 2D proximity network with mouse repulsion & shockwave bursts',
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
    },
    files: {
      'src/App.tsx': `import React from 'react';
import { ParticleField } from './ParticleField';

export default function App() {
  return (
    <div style={{ padding: 40, background: '#0A0A0C', minHeight: '100vh', color: '#fff', textAlign: 'center' }}>
      <h2>Canvas 2D Particle Constellation</h2>
      <p style={{ opacity: 0.7 }}>Move pointer to repel · Click to trigger shockwave</p>
      <ParticleField />
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
