import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Box, Layers } from 'lucide-react';

interface FloatingSphere3DProps {
  onRegisterControls?: (controls: { reset: () => void; replay: () => void }) => void;
}

// 12 base icosahedron vertices normalized to unit sphere
const PHI = (1 + Math.sqrt(5)) / 2;
const RAW_ICO_VERTICES: [number, number, number][] = [
  [-1,  PHI, 0],
  [ 1,  PHI, 0],
  [-1, -PHI, 0],
  [ 1, -PHI, 0],
  [ 0, -1,  PHI],
  [ 0,  1,  PHI],
  [ 0, -1, -PHI],
  [ 0,  1, -PHI],
  [ PHI, 0, -1],
  [ PHI, 0,  1],
  [-PHI, 0, -1],
  [-PHI, 0,  1],
];

const ICO_VERTICES: [number, number, number][] = RAW_ICO_VERTICES.map(([x, y, z]) => {
  const len = Math.hypot(x, y, z);
  return [x / len, y / len, z / len];
});

// 20 triangular faces
const ICO_FACES: [number, number, number][] = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
];

// Geodesic edges (unique pairs of vertex indices)
const ICO_EDGES: [number, number][] = [];
const edgeSet = new Set<string>();
ICO_FACES.forEach(([a, b, c]) => {
  const pairs: [number, number][] = [[a, b], [b, c], [c, a]];
  pairs.forEach(([p1, p2]) => {
    const key = p1 < p2 ? `${p1}-${p2}` : `${p2}-${p1}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      ICO_EDGES.push([p1, p2]);
    }
  });
});

// Safe WebGL support detection
function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const FloatingSphere3D: React.FC<FloatingSphere3DProps> = ({ onRegisterControls }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // References to Three.js instances for interaction & disposal
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereGroupRef = useRef<THREE.Group | null>(null);
  const outerWireframeRef = useRef<THREE.Mesh | null>(null);

  // State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isWireframe, setIsWireframe] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);

  // Drag coordinates & rotation state (shared between WebGL and Fallback)
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0.2, y: 0 });
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0.2, y: 0 });
  const clockRef = useRef<number>(0);

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

    // Check if WebGL is supported
    let useFallback = !isWebGLAvailable();
    let renderer: THREE.WebGLRenderer | null = null;

    if (!useFallback) {
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        });
      } catch (e) {
        console.warn('WebGL context initialization failed; using Canvas 2D 3D fallback:', e);
        useFallback = true;
      }
    }

    setIsFallbackMode(useFallback);

    // =========================================================================
    // FALLBACK ENGINE: High-Performance 2D Canvas 3D Projection (Software 3D)
    // =========================================================================
    if (useFallback || !renderer) {
      const canvas = document.createElement('canvas');
      canvas.className = 'w-full h-full block';
      container.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let lastTime = performance.now();
      let wireRotY = 0;

      const updateSize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = container.clientWidth || 300;
        const h = container.clientHeight || 250;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      updateSize();

      const observer = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      observer.observe(container);

      const renderFallback = (time: number) => {
        animFrameId.current = requestAnimationFrame(renderFallback);
        if (!isVisibleRef.current) return;

        const delta = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;
        clockRef.current += delta;

        // Smooth rotation damping
        currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
        currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

        if (isPlaying) {
          targetRotation.current.y += delta * 0.45;
          wireRotY -= delta * 0.2;
        }

        const width = container.clientWidth;
        const height = container.clientHeight;
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) * 0.28;
        const floatY = isPlaying ? Math.sin(clockRef.current * 1.8) * 10 : 0;

        const rx = currentRotation.current.x;
        const ry = currentRotation.current.y;
        const cosY = Math.cos(ry);
        const sinY = Math.sin(ry);
        const cosX = Math.cos(rx);
        const sinX = Math.sin(rx);

        // 3D vector rotation helper
        const rotate3D = (vx: number, vy: number, vz: number, customRy = ry, customRx = rx) => {
          const cy1 = Math.cos(customRy);
          const sy1 = Math.sin(customRy);
          const cx1 = Math.cos(customRx);
          const sx1 = Math.sin(customRx);

          const x1 = vx * cy1 + vz * sy1;
          const y1 = vy;
          const z1 = -vx * sy1 + vz * cy1;

          const x2 = x1;
          const y2 = y1 * cx1 - z1 * sx1;
          const z2 = y1 * sx1 + z1 * cx1;

          // Perspective projection (camera at z = 3.8)
          const camDist = 3.8;
          const scale = camDist / (camDist + z2);
          const px = cx + x2 * radius * scale;
          const py = cy - (y2 * radius + floatY) * scale;

          return { px, py, z: z2, x: x2, y: y2 };
        };

        // Project Core Vertices
        const projectedCore = ICO_VERTICES.map(([x, y, z]) => rotate3D(x, y, z));

        // Draw Shaded Facets (Sorted back-to-front)
        const sortedFaces = ICO_FACES.map((indices) => {
          const [i0, i1, i2] = indices;
          const v0 = projectedCore[i0];
          const v1 = projectedCore[i1];
          const v2 = projectedCore[i2];
          const avgZ = (v0.z + v1.z + v2.z) / 3;

          // Compute surface normal in 3D
          const ax = v1.x - v0.x;
          const ay = v1.y - v0.y;
          const az = v1.z - v0.z;
          const bx = v2.x - v0.x;
          const by = v2.y - v0.y;
          const bz = v2.z - v0.z;

          const nx = ay * bz - az * by;
          const ny = az * bx - ax * bz;
          const nz = ax * by - ay * bx;
          const nLen = Math.hypot(nx, ny, nz) || 1;

          return {
            indices,
            avgZ,
            norm: { x: nx / nLen, y: ny / nLen, z: nz / nLen },
          };
        }).sort((a, b) => a.avgZ - b.avgZ);

        // Directional Lights: Key Light (Crimson) + Rim Light (Cyan)
        const keyLight = { x: 0.577, y: 0.707, z: 0.408 };
        const rimLight = { x: -0.6, y: -0.4, z: -0.4 };

        sortedFaces.forEach(({ indices, norm }) => {
          // Dot products for diffuse shading
          const diffKey = Math.max(0, norm.x * keyLight.x + norm.y * keyLight.y + norm.z * keyLight.z);
          const diffRim = Math.max(0, norm.x * rimLight.x + norm.y * rimLight.y + norm.z * rimLight.z);

          // PBR-like metallic color interpolation
          const r = Math.min(255, Math.floor(22 + diffKey * 190 + diffRim * 15));
          const g = Math.min(255, Math.floor(22 + diffKey * 25 + diffRim * 155));
          const b = Math.min(255, Math.floor(26 + diffKey * 50 + diffRim * 195));

          const p0 = projectedCore[indices[0]];
          const p1 = projectedCore[indices[1]];
          const p2 = projectedCore[indices[2]];

          ctx.beginPath();
          ctx.moveTo(p0.px, p0.py);
          ctx.lineTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.closePath();

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });

        // Orbital Equator Ring (Projected Torus)
        const ringPointsCount = 44;
        const ringRadius = 1.48;
        const ringAngleX = Math.PI / 2.3;
        ctx.beginPath();
        for (let i = 0; i <= ringPointsCount; i++) {
          const theta = (i / ringPointsCount) * Math.PI * 2;
          const lx = Math.cos(theta) * ringRadius;
          const ly = 0;
          const lz = Math.sin(theta) * ringRadius;

          // Rotate ring by inclination
          const rx1 = lx;
          const ry1 = ly * Math.cos(ringAngleX) - lz * Math.sin(ringAngleX);
          const rz1 = ly * Math.sin(ringAngleX) + lz * Math.cos(ringAngleX);

          const pt = rotate3D(rx1, ry1, rz1);
          if (i === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Outer Geodesic Wireframe Cage (when enabled)
        if (isWireframe) {
          const cageScale = 1.15;
          const projectedWire = ICO_VERTICES.map(([x, y, z]) =>
            rotate3D(x * cageScale, y * cageScale, z * cageScale, wireRotY, rx)
          );

          ICO_EDGES.forEach(([i0, i1]) => {
            const p0 = projectedWire[i0];
            const p1 = projectedWire[i1];
            const avgZ = (p0.z + p1.z) / 2;
            const alpha = Math.max(0.2, Math.min(0.85, (avgZ + 1.2) / 2));

            ctx.beginPath();
            ctx.moveTo(p0.px, p0.py);
            ctx.lineTo(p1.px, p1.py);
            ctx.strokeStyle = `rgba(225, 29, 72, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          });

          // Small vertex nodes
          projectedWire.forEach((p) => {
            if (p.z > -0.3) {
              ctx.beginPath();
              ctx.arc(p.px, p.py, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = '#E11D48';
              ctx.fill();
            }
          });
        }
      };

      animFrameId.current = requestAnimationFrame(renderFallback);
      window.addEventListener('resize', updateSize);

      return () => {
        if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
        window.removeEventListener('resize', updateSize);
        observer.disconnect();
        if (container.contains(canvas)) {
          container.removeChild(canvas);
        }
      };
    }

    // =========================================================================
    // STANDARD WEBGL ENGINE: Three.js 3D Scene (Active when WebGL is available)
    // =========================================================================
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 250;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;
    cameraRef.current = camera;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe11d48, 4.5);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 3.5);
    dirLight2.position.set(-3, -2, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x10b981, 2, 8);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // Composite 3D Sphere Group
    const sphereGroup = new THREE.Group();
    sphereGroupRef.current = sphereGroup;
    scene.add(sphereGroup);

    // Core Mesh
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 4);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.15,
      metalness: 0.85,
      flatShading: true,
    });
    const innerMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    sphereGroup.add(innerMesh);

    // Outer Geodesic Wireframe Lattice Cage
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

    // Orbital Equator Ring
    const ringGeometry = new THREE.TorusGeometry(1.65, 0.02, 16, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
    });
    const equatorRing = new THREE.Mesh(ringGeometry, ringMaterial);
    equatorRing.rotation.x = Math.PI / 2.3;
    sphereGroup.add(equatorRing);

    // Visibility observer
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(container);

    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      if (isPlaying) {
        targetRotation.current.y += delta * 0.45;

        if (outerWireframeRef.current) {
          outerWireframeRef.current.rotation.y -= delta * 0.2;
          outerWireframeRef.current.rotation.x += delta * 0.1;
        }

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

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

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
  }, [isPlaying, isWireframe]);

  // Mouse & Touch Drag Controls
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    previousMousePosition.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - previousMousePosition.current.x;
    const deltaY = clientY - previousMousePosition.current.y;

    targetRotation.current.y += deltaX * 0.01;
    targetRotation.current.x += deltaY * 0.01;

    previousMousePosition.current = { x: clientX, y: clientY };
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="relative w-full h-64 bg-[#0A0A0C] border border-white/10 rounded overflow-hidden select-none flex flex-col justify-between p-3"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => {
        if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchEnd={handleEnd}
      role="region"
      aria-label="3D floating geodesic sphere simulation"
    >
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className={`absolute inset-0 w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        title="Click and drag to rotate in 3D space"
      />

      {/* Top Telemetry */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 border border-white/15 text-white/80">
          <Box className="w-3 h-3 text-cyan-400" />
          <span>
            {isFallbackMode
              ? 'CANVAS 2D · 3D GEODESIC PROJECTION'
              : 'WEBGL 2.0 · PBR SHADER + WIREFRAME'}
          </span>
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
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors cursor-pointer"
            title={isPlaying ? 'Pause rotation' : 'Resume rotation'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            type="button"
            className={`p-1.5 text-white border rounded transition-colors cursor-pointer ${
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
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition-colors cursor-pointer"
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

