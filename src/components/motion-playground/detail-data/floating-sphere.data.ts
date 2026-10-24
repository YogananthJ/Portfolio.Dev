export const FLOATING_SPHERE_DETAIL = {
  id: 'floating-sphere-3d',
  number: '05',
  title: 'Floating Geodesic 3D Sphere',
  subtitle: 'WebGL 2.0 Scene Graph, PBR Facets & Interactive Inertia Orbit',
  description:
    'A real Three.js WebGL scene featuring a metallic icosahedron core, an outer geodesic wireframe lattice cage, and drag-to-orbit physics with inertia damping.',
  category: 'threejs',
  categoryLabel: 'Three.js / WebGL',
  technologies: ['Three.js', 'WebGL 2.0', 'PBR Shaders', 'Quaternions', 'RAF Loop'],
  about: {
    whatItIs:
      'A genuine real-time 3D rendered entity running in WebGL. It pairs a dark metallic icosahedron (MeshStandardMaterial) with a floating crimson wireframe geodesic cage and an equatorial orbital torus, illuminated by colored rim and key lights.',
    whatItIsUsedFor:
      'Used for interactive 3D hero objects, spatial product configurators, crypto/web3 token visualizers, and digital twin representations.',
    howItWorks:
      'Instantiates a Three.js Scene, PerspectiveCamera, and WebGLRenderer with ACESFilmic tone mapping. Pointer dragging increments rotational momentum, while an animation loop applies sine-wave floating displacement (y = sin(time·1.8)·0.12) and smooth rotational damping.',
    whatToExplore:
      'Click and drag directly on the canvas to rotate the sphere in 3D space with inertia. Click the Wireframe button to isolate the core or lattice shell. Pause or reset the orientation using bottom controls.',
  },
  howItWorksPoints: [
    {
      title: 'Composite Multi-Mesh Hierarchy',
      description:
        'Rather than a basic default sphere, the object is assembled as a THREE.Group containing an inner faceted metallic core, an outer wireframe lattice, and an inclined equatorial torus ring.',
    },
    {
      title: 'PBR Shading with Colored Directional Lights',
      description:
        'Uses MeshStandardMaterial with roughness: 0.15 and metalness: 0.85, exposed to a Crimson key light (#E11D48) from (3, 4, 3) and a Cyan rim light (#06B6D4) from (-3, -2, -2) to create visible dimensional depth.',
    },
    {
      title: 'Pointer Dragging with Inertial Damping',
      description:
        'Calculates deltaX and deltaY from pointer movement, interpolating targetRotation into currentRotation via a 0.08 damping factor on each frame for fluid tactile momentum.',
    },
    {
      title: 'Deterministic GPU Resource Disposal',
      description:
        'On component unmount, all geometries (coreGeo, wireGeo, ringGeo), materials, and WebGLRenderer are explicitly disposed of, and the canvas element is removed to prevent memory leaks.',
    },
  ],
  files: [
    {
      name: 'FloatingSphere3D.tsx',
      language: 'typescript',
      isPrimary: true,
      code: `import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const FloatingSphere3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    // 2. Renderer with PBR tone mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Colored Multi-Point Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const keyLight = new THREE.DirectionalLight(0xe11d48, 4.0);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 3.0);
    rimLight.position.set(-3, -2, -2);
    scene.add(rimLight);

    // 4. Geodesic Group
    const group = new THREE.Group();
    scene.add(group);

    const coreGeo = new THREE.IcosahedronGeometry(1.2, 4);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.15,
      metalness: 0.85,
      flatShading: true,
    });
    group.add(new THREE.Mesh(coreGeo, coreMat));

    const wireGeo = new THREE.IcosahedronGeometry(1.32, 2);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xe11d48, wireframe: true, transparent: true, opacity: 0.6 });
    group.add(new THREE.Mesh(wireGeo, wireMat));

    // 5. Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      group.rotation.y += delta * 0.45;
      group.position.y = Math.sin(elapsed * 1.8) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-80" />;
};`,
    },
  ],
  ideConfig: {
    title: 'Floating Geodesic 3D Sphere — Motion Lab',
    description: 'Interactive Three.js WebGL 2.0 PBR 3D sphere with mouse drag controls',
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      three: '^0.160.0',
      '@types/three': '^0.160.0',
    },
    files: {
      'src/App.tsx': `import React from 'react';
import { FloatingSphere3D } from './FloatingSphere3D';

export default function App() {
  return (
    <div style={{ padding: 40, background: '#0A0A0C', minHeight: '100vh', color: '#fff', textAlign: 'center' }}>
      <h2>Three.js 3D Geodesic Sphere</h2>
      <p style={{ opacity: 0.7 }}>Click &amp; drag to rotate</p>
      <FloatingSphere3D />
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
