export const KINETIC_TYPOGRAPHY_DETAIL = {
  id: 'kinetic-typography',
  number: '03',
  title: 'Kinetic Character Stagger',
  subtitle: 'Zero-Dependency DOM Character Splitting & 3D Perspective Reveals',
  description:
    'An expressive typography reveal pipeline utilizing custom DOM span segmentation, 3D perspective tilts, and staggered spring waves without commercial dependencies.',
  category: 'gsap',
  categoryLabel: 'GSAP 3.0',
  technologies: ['GSAP 3', 'DOM Splitting', '3D Perspective', 'Stagger Wave'],
  about: {
    whatItIs:
      'A typographical animation system that splits headline copy into individual characters and words. Characters enter with a masked vertical slide, -70° 3D X-axis tilt, and an exponential stagger, finishing with a bounce overshoot.',
    whatItIsUsedFor:
      'Ideal for editorial hero headlines, high-impact landing page statements, product launch reveal titles, and interactive agency showcase banners.',
    howItWorks:
      'Splits phrases via string.split(" ") and word.split(""), preserving semantic aria-label tags on the parent container for screen reader accessibility. GSAP animates the resulting .kinetic-char spans using rotateX, y, opacity, and stagger configurations.',
    whatToExplore:
      'Hover over the text to trigger an interactive color and vertical ripple wave. Click the Switch button to transition between three distinct editorial statements. Replay the full entrance animation anytime.',
  },
  howItWorksPoints: [
    {
      title: 'Zero-Dependency Accessible DOM Splitting',
      description:
        'Avoids paid proprietary plugins (like SplitText) by cleanly structuring text into words and character spans while retaining the full text in the parent container’s aria-label to prevent screen-reader fragmentation.',
    },
    {
      title: 'CSS 3D Perspective & Transform Origin',
      description:
        'The container applies perspective: 800px while individual characters declare transform-origin: 50% 100%. This makes characters appear as though they are swinging upward from a flat table surface into a vertical orientation.',
    },
    {
      title: 'Staggered Wave Choreography',
      description:
        'GSAP’s stagger: { each: 0.035, from: "start" } generates a smooth cascading entrance. A secondary tween slightly lifts word wrappers (y: -4) with a tiny bounce overshoot for a tactile organic feel.',
    },
    {
      title: 'Interactive Pointer Wave Ripple',
      description:
        'Hovering triggers a dynamic quick tween with y: -14, repeat: 1, yoyo: true, and color shifting to crimson, creating an engaging tactile interaction without causing DOM layout shifts.',
    },
  ],
  files: [
    {
      name: 'KineticTypography.tsx',
      language: 'typescript',
      isPrimary: true,
      code: `import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const PHRASES = [
  'IDEAS INTO INTERACTIONS',
  'CODE AS CHOREOGRAPHY',
  'DIGITAL CRAFT & RIGOR',
];

export const KineticTypography: React.FC = () => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const phrase = PHRASES[index];

  const animate = useCallback(() => {
    if (!textRef.current) return;
    const chars = textRef.current.querySelectorAll('.char');

    gsap.set(chars, {
      y: 60,
      opacity: 0,
      rotateX: -70,
      scale: 0.8,
      transformOrigin: '50% 100%',
    });

    gsap.to(chars, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      duration: 0.85,
      stagger: 0.035,
      ease: 'power4.out',
    });
  }, []);

  useEffect(() => {
    animate();
  }, [index, animate]);

  return (
    <div
      ref={textRef}
      aria-label={phrase}
      className="perspective-[800px] flex flex-wrap gap-x-3 text-2xl sm:text-3xl font-black text-white"
    >
      {phrase.split(' ').map((word, wIdx) => (
        <span key={wIdx} className="inline-flex overflow-hidden py-1">
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
  ],
  ideConfig: {
    title: 'Kinetic Character Stagger — Motion Lab',
    description: 'Accessible DOM character splitting with 3D perspective in GSAP 3',
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      gsap: '^3.12.5',
    },
    files: {
      'src/App.tsx': `import React from 'react';
import { KineticTypography } from './KineticTypography';

export default function App() {
  return (
    <div style={{ padding: 40, background: '#0A0A0C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <KineticTypography />
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
