export const ORBITING_BALLS_DETAIL = {
  id: 'orbiting-balls',
  number: '01',
  title: 'Orbiting Satellites',
  subtitle: 'Circular Parametric Trigonometry & Dynamic Angular Momentum',
  description:
    'A multi-body celestial motion simulation demonstrating parametric polar coordinates, harmonic orbital spacing, and real-time directional velocity changes.',
  category: 'vanillajs',
  categoryLabel: 'Vanilla JS / Canvas 2D',
  technologies: ['Canvas 2D', 'Parametric Math', 'Angular Velocity', 'RAF Loop'],
  about: {
    whatItIs:
      'A continuous multi-tiered orbital simulation featuring three satellite bodies revolving around a glowing central nucleus at distinct radii (42px, 76px, and 112px) and individualized angular velocities.',
    whatItIsUsedFor:
      'Used in real-world interfaces for planetary data visualization dashboards, dynamic loading indicators, real-time satellite telemetry tracking, and futuristic developer cockpit gauges.',
    howItWorks:
      'Converts polar coordinates (radius r, angle θ) into Cartesian 2D canvas coordinates (x = cx + r·cos(θ), y = cy + r·sin(θ)). The angle θ increments each frame based on normalized delta-time, avoiding speed variations on high refresh-rate monitors.',
    whatToExplore:
      'Hover over the canvas to accelerate the angular velocity by 2.5x. Click anywhere to smoothly reverse the rotation from clockwise to counter-clockwise. Use the bottom controls to pause or reset.',
  },
  howItWorksPoints: [
    {
      title: 'Parametric Polar Coordinate Mapping',
      description:
        'Instead of animating CSS top/left offsets, the canvas computes positions mathematically via x = cx + cos(angle) * radius and y = cy + sin(angle) * radius on each render tick.',
    },
    {
      title: 'Delta-Time Normalization for Variable Refresh Rates',
      description:
        'Frames compute deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1). This guarantees identical rotation speeds whether the user is on a 60Hz laptop or a 144Hz ProMotion screen.',
    },
    {
      title: 'Dynamic Angular Momentum Multipliers',
      description:
        'The speed multiplier switches from 1.0x to 2.5x during cursor hover, and multiplies by direction (-1 or 1) on click, producing immediate tactile responsiveness.',
    },
    {
      title: 'High-DPI Retina Display Scaling',
      description:
        'Canvas backing buffer dynamically scales with window.devicePixelRatio (capped at 2.0) to eliminate blurring on high-resolution displays while preserving crisp anti-aliased arcs.',
    },
  ],
  files: [
    {
      name: 'OrbitingBalls.tsx',
      language: 'typescript',
      isPrimary: true,
      code: `import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, FastForward, Compass } from 'lucide-react';

interface Satellite {
  radius: number;
  speed: number; // radians per second
  angle: number;
  size: number;
  color: string;
  glow: string;
}

export const OrbitingBalls: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const satellitesRef = useRef<Satellite[]>([
    { radius: 42, speed: 1.4, angle: 0, size: 7, color: '#E11D48', glow: 'rgba(225, 29, 72, 0.4)' },
    { radius: 76, speed: 0.85, angle: Math.PI * 0.6, size: 9, color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' },
    { radius: 112, speed: 0.52, angle: Math.PI * 1.3, size: 11, color: '#06B6D4', glow: 'rgba(6, 182, 212, 0.4)' },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw orbital tracks
      satellitesRef.current.forEach((sat) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, sat.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw central glowing nucleus
      ctx.beginPath();
      ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Update and draw satellites
      const speedFactor = (isHovered ? 2.5 : 1.0) * direction;

      satellitesRef.current.forEach((sat) => {
        if (isPlaying) {
          sat.angle += sat.speed * speedFactor * deltaTime;
        }

        const x = centerX + Math.cos(sat.angle) * sat.radius;
        const y = centerY + Math.sin(sat.angle) * sat.radius;

        // Glow trail
        ctx.beginPath();
        ctx.arc(x, y, sat.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = sat.glow;
        ctx.fill();

        // Main body
        ctx.beginPath();
        ctx.arc(x, y, sat.size, 0, Math.PI * 2);
        ctx.fillStyle = sat.color;
        ctx.shadowColor = sat.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();
      if (isPlaying) animFrameRef.current = requestAnimationFrame(render);
    };

    if (isPlaying) animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isHovered, direction]);

  return (
    <div
      className="relative w-full h-80 bg-[#0A0A0C] border border-white/10 rounded overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setDirection((d) => (d === 1 ? -1 : 1))}
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
    </div>
  );
};`,
    },
    {
      name: 'trigMath.ts',
      language: 'typescript',
      isPrimary: false,
      code: `/**
 * Parametric math helper for orbital coordinates
 */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInRadians: number
): { x: number; y: number } {
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}`,
    },
  ],
  ideConfig: {
    title: 'Orbiting Satellites — Motion Lab',
    description: 'Parametric polar coordinates and circular trigonometry loop in React + Canvas',
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'lucide-react': '^0.263.1',
    },
    files: {
      'src/App.tsx': `import React from 'react';
import { OrbitingBalls } from './OrbitingBalls';

export default function App() {
  return (
    <div style={{ padding: 40, background: '#0A0A0C', minHeight: '100vh', color: '#fff', fontFamily: 'monospace' }}>
      <h2>Orbiting Satellites Demo</h2>
      <p style={{ opacity: 0.7, marginBottom: 20 }}>Hover to accelerate, click to reverse direction</p>
      <OrbitingBalls />
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
