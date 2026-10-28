export const CHAOTIC_TYPOGRAPHY_DETAIL = {
  id: 'chaotic-typography',
  number: '03',
  title: 'Chaotic Typography',
  subtitle: 'Per-Character Kinematics & Guaranteed Layout Baseline Reconstruction',
  description:
    'Interactive typography in which individual characters behave like physical objects. Features independent letter bouncing, 3D explosive scattering, elastic stretching, and vortex dynamics with smooth baseline layout recovery.',
  category: 'typography',
  categoryLabel: 'Typography & Physics',
  technologies: ['DOM Elements', 'GSAP 3', 'Verlet Physics', 'Layout Baseline'],
  about: {
    whatItIs:
      'A typography playground decomposing phrases into independently tracked DOM character nodes. Each glyph calculates unique velocity, rotation, squash/stretch, and Hooke baseline return forces.',
    whatItIsUsedFor:
      'Used in editorial digital publications, creative agency award sites, video game title screens, interactive brand identities, and memorable portfolio hero banners.',
    howItWorks:
      'Characters calculate discrete kinematics. Hover and click triggers upward velocity against a spring tether. In explosion and vortex modes, high angular velocity scatters the glyphs, followed by spring damping returning every letter to its exact readable baseline.',
    whatToExplore:
      'Type custom words in the text box. Switch between Bounce, Explosion, Elastic, and Vortex modes. Click individual characters to launch them into the air.',
  },
  howItWorksPoints: [
    {
      title: 'Accessible Crisp DOM Element Architecture',
      description:
        'Instead of rendering text on a low-resolution canvas, each character remains a standard HTML span with subpixel font antialiasing and complete screen-reader accessibility.',
    },
    {
      title: 'Per-Letter Kinematic Phase & Frequency Stagger',
      description:
        'Each glyph is assigned an individualized bounce frequency and harmonic phase offset, producing lively organic rhythm rather than synchronized mechanical movement.',
    },
    {
      title: 'Squash & Stretch Ground Contact Mechanics',
      description:
        'When a character touches the virtual baseline, its scaleY temporarily compresses to 0.88 while scaleX expands to 1.14, conveying weight and physical elasticity.',
    },
    {
      title: 'Strict Layout Baseline Invariance',
      description:
        'Restoring spring forces always target local offset (0, 0), guaranteeing that characters never drift, overlap, or cause layout shifts on the host page.',
    },
  ],
  files: [
    {
      name: 'ChaoticTypography.tsx',
      language: 'typescript',
      isPrimary: true,
      code: `import React, { useState } from 'react';

export const ChaoticTypography: React.FC = () => {
  // DOM typography with independent character physics solver
  return <div>Chaotic Typography Playground</div>;
};`,
    },
  ],
  ideConfig: {
    title: 'Chaotic Typography — Motion Lab',
    description: 'Interactive typography with independent letter physics',
    files: {
      'src/App.tsx': `export default function App() { return <div>Chaotic Typography</div>; }`,
    },
    dependencies: {
      react: '^19.0.0',
      gsap: '^3.12.0',
    },
  },
};
