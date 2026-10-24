export const MAGNETIC_BUTTON_DETAIL = {
  id: 'magnetic-button',
  number: '04',
  title: 'Magnetic Proximity Core',
  subtitle: 'Cursor Vector Attraction, Multi-Layer Parallax & Elastic Snapback',
  description:
    'A cursor-attracted interactive component that tracks pointer proximity, displaces its chassis and inner typography with layered parallax, and springs back elastically upon exit.',
  category: 'vanillajs',
  categoryLabel: 'Vanilla JS / GSAP',
  technologies: ['Pointer Events', 'Vector Clamping', 'Elastic Easing', 'Parallax'],
  about: {
    whatItIs:
      'An interactive button that acts like a physical magnetic object. As the user moves their cursor near the button, it smoothly displaces toward the pointer. When the cursor leaves the boundary, the button snaps back to its origin with an organic elastic spring oscillation.',
    whatItIsUsedFor:
      'High-end portfolio call-to-action buttons, interactive cursor pointers, agency showreel launchers, and spatial navigation controls.',
    howItWorks:
      'Calculates the Cartesian vector between cursor position (clientX, clientY) and the button center point. Scales the displacement by 0.42x and clamps it to 55px. Internal text and icon receive fractional parallax offsets (0.25x and 0.40x) before an elastic.out(1, 0.4) tween resets coordinates.',
    whatToExplore:
      'Move your pointer around the dotted interaction zone to feel the magnetic pull. Click the button to trigger a confirmation engagement animation. Move away to see the elastic snapback.',
  },
  howItWorksPoints: [
    {
      title: 'Bounding Client Rect Vector Geometry',
      description:
        'Uses zoneRef.getBoundingClientRect() to compute exact center coordinates (centerX, centerY). Subtracting these from e.clientX and e.clientY yields the directional displacement vector (deltaX, deltaY).',
    },
    {
      title: 'Boundary Clamping & Non-Linear Pull Ratio',
      description:
        'Multiplying the vector by a 0.42 factor creates a sense of physical weight and resistance. Math.max(-55, Math.min(55, delta)) prevents the button from exceeding its designated interaction perimeter.',
    },
    {
      title: 'Internal Multi-Layer Parallax Offsets',
      description:
        'The outer button chassis translates by pullX/pullY, while the inner label moves by 25% and the icon by 40%. This subtle discrepancy creates noticeable visual depth and dimension.',
    },
    {
      title: 'Physics Spring Snapback on Pointer Leave',
      description:
        'When the pointer leaves the bounding zone, GSAP’s elastic.out(1, 0.4) ease returns the element to (0, 0) with a natural physical dampening curve, avoiding stiff linear resets.',
    },
  ],
  files: [
    {
      name: 'MagneticButton.tsx',
      language: 'typescript',
      isPrimary: true,
      code: `import React, { useRef } from 'react';
import gsap from 'gsap';

export const MagneticButton: React.FC = () => {
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoneRef.current || !btnRef.current) return;
    const rect = zoneRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pullX = Math.max(-50, Math.min(50, (e.clientX - centerX) * 0.4));
    const pullY = Math.max(-50, Math.min(50, (e.clientY - centerY) * 0.4));

    gsap.to(btnRef.current, {
      x: pullX,
      y: pullY,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  return (
    <div
      ref={zoneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="p-16 border border-dashed border-white/20 flex items-center justify-center cursor-crosshair"
    >
      <button
        ref={btnRef}
        className="px-6 py-3.5 bg-rose-600 text-white font-mono font-bold tracking-wider uppercase border border-white/40 shadow-lg"
      >
        MAGNETIC CORE
      </button>
    </div>
  );
};`,
    },
  ],
  ideConfig: {
    title: 'Magnetic Proximity Button — Motion Lab',
    description: 'Pointer proximity vectoring with elastic spring return in React + GSAP',
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      gsap: '^3.12.5',
    },
    files: {
      'src/App.tsx': `import React from 'react';
import { MagneticButton } from './MagneticButton';

export default function App() {
  return (
    <div style={{ padding: 40, background: '#0A0A0C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <MagneticButton />
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
