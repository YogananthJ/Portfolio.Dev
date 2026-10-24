import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Box, Eye, Layers } from 'lucide-react';

interface FloatingSphere3DProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
}

export const FloatingSphere3D: React.FC<FloatingSphere3DProps> = ({ onRegisterControls }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // References to Three.js instances for interaction & disposal
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereGroupRef = useRef<THREE.Group | null>(null);
  const innerMeshRef = useRef<THREE.Mesh | null>(null);
  const outerWireframeRef = useRef<THREE.Mesh | null>(null);

  // State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isWireframe, setIsWireframe] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Drag coordinates
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0.2, y: 0 });
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0.2, y: 0 });
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  const resetOrientation = useCallback(() => {
    targetRotation.current = { x: 0.2, y: 0 };
    currentRotation.current = { x: 0.2, y: 0 };
    if (sphereGroupRef.current) {
      sphereGroupRef.current.position.y = 0;
      sphereGroupRef.current.rotation.x = 0.2;
      sphereGroupRef.current.rotation.y = 0;
    }
  }, []);

  const replayAnimation = useCallback(() => {
    resetOrientation();
    setIsPlaying(true);
  }, [resetOrientation]);

  useEffect(() => {
    onRegisterControls?.({ reset: resetOrientation, replay: replayAnimation });
  }, [onRegisterControls, resetOrientation, replayAnimation]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe11d48, 4.5); // Crimson key light
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 3.5); // Cyan rim light
    dirLight2.position.set(-3, -2, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x10b981, 2, 8); // Emerald accent fill
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // 4. Composite 3D Sphere Group
    const sphereGroup = new THREE.Group();
    sphereGroupRef.current = sphereGroup;
    scene.add(sphereGroup);

    // (a) Inner Core Mesh (Glossy metallic dark facet)
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 4);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.15,
      metalness: 0.85,
      flatShading: true,
    });
    const innerMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    innerMeshRef.current = innerMesh;
    sphereGroup.add(innerMesh);

    // (b) Outer Geodesic Wireframe Lattice Cage
    const wireGeometry = new THREE.IcosahedronGeometry(1.32, 2);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xe11d48,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const outerWireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    outerWireframeRef.current = outerWireframe;
    sphereGroup.add(outerWireframe);

    // (c) Orbital Equator Ring
    const ringGeometry = new THREE.TorusGeometry(1.65, 0.02, 16, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
    });
    const equatorRing = new THREE.Mesh(ringGeometry, ringMaterial);
    equatorRing.rotation.x = Math.PI / 2.3;
    sphereGroup.add(equatorRing);

    // 5. Visibility observer (pause when off-screen)
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(container);

    // 6. Animation Loop
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const delta = clockRef.current.getDelta();
      const elapsedTime = clockRef.current.getElapsedTime();

      // Smooth interpolation (damping) for drag/mouse rotation
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      if (isPlaying) {
        // Continuous auto-spin
        targetRotation.current.y += delta * 0.45;

        // Counter-rotation on wireframe cage
        if (outerWireframeRef.current) {
          outerWireframeRef.current.rotation.y -= delta * 0.2;
          outerWireframeRef.current.rotation.x += delta * 0.1;
        }

        // Gentle floating sine bob
        if (sphereGroupRef.current) {
          sphereGroupRef.current.position.y = Math.sin(elapsedTime * 1.8) * 0.12;
        }
      }

      if (sphereGroupRef.current) {
        sphereGroupRef.current.rotation.x = currentRotation.current.x;
        sphereGroupRef.current.rotation.y = currentRotation.current.y;
      }

      renderer.render(scene, camera);
    };

    animFrameId.current = requestAnimationFrame(animate);

    // 7. Resize handling
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      // Dispose Three.js resources
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isPlaying]);

  // Mouse & Touch Drag Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    targetRotation.current.y += deltaX * 0.01;
    targetRotation.current.x += deltaY * 0.01;

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Toggle wireframe cage
  const toggleWireframe = () => {
    if (outerWireframeRef.current) {
      outerWireframeRef.current.visible = !isWireframe;
      setIsWireframe(!isWireframe);
    }
  };

  return (
    <div
      className="relative w-full h-64 bg-[#0A0A0C] border border-white/10 rounded overflow-hidden select-none flex flex-col justify-between p-3"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      role="region"
      aria-label="Three.js genuine 3D floating sphere simulation"
    >
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className={`absolute inset-0 w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        title="Click and drag to rotate in 3D space"
      />

      {/* Top Telemetry */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-white/80">
          <Box className="w-3 h-3 text-cyan-400" />
          <span>WEBGL 2.0 · PBR SHADER + WIREFRAME</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-white/80">
          <span className="text-emerald-400 font-bold">DRAG: INTERACTIVE 3D</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div
        className="relative z-10 flex items-center justify-between pointer-events-auto text-xs font-mono pt-2 border-t border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[10px] text-white/60 bg-black/60 px-2 py-1 border border-white/10">
          Tip: <span className="text-cyan-400 font-bold">Drag</span> to orbit · <span className="text-amber-400 font-bold">Float:</span> Sine wave
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors"
            title={isPlaying ? 'Pause rotation' : 'Resume rotation'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleWireframe}
            type="button"
            className={`p-1.5 text-white border rounded transition-colors ${
              isWireframe ? 'bg-[#E11D48] border-[#E11D48]' : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
            title="Toggle geodesic wireframe cage"
            aria-label="Toggle wireframe"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetOrientation}
            type="button"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors"
            title="Reset 3D orientation"
            aria-label="Reset orientation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
