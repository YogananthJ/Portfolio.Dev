import React, { useEffect, useRef } from 'react';
import {
  createParticleNetworkState,
  ParticleNetworkState,
  PointerState,
  resizeParticleNetworkState,
  stepParticleNetwork,
} from '../../utils/particleNetworkEngine';

interface ThemePalette {
  isDark: boolean;
  baseRgb: string;
  accentRgb: string;
  secondaryRgb: string;
}

function parseColorToRgbString(rawColor: string, fallback: string): string {
  const color = rawColor.trim();
  if (!color) return fallback;

  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const fullHex =
      hex.length === 3
        ? hex
            .split('')
            .map((ch) => ch + ch)
            .join('')
        : hex;
    if (fullHex.length === 6) {
      const r = parseInt(fullHex.slice(0, 2), 16);
      const g = parseInt(fullHex.slice(2, 4), 16);
      const b = parseInt(fullHex.slice(4, 6), 16);
      if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
        return `${r}, ${g}, ${b}`;
      }
    }
  }

  const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    return `${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}`;
  }

  return fallback;
}

function readThemePalette(): ThemePalette {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  const computed = window.getComputedStyle(root);
  const accentRaw = computed.getPropertyValue('--accent');
  const accentRgb = parseColorToRgbString(accentRaw, '225, 29, 72');

  return {
    isDark,
    baseRgb: isDark ? '203, 213, 225' : '34, 34, 40',
    accentRgb,
    secondaryRgb: isDark ? '56, 189, 248' : '75, 70, 62',
  };
}

function drawParticleNetwork(
  ctx: CanvasRenderingContext2D,
  state: ParticleNetworkState,
  palette: ThemePalette
): void {
  const { width, height, particles, connections } = state;
  ctx.clearRect(0, 0, width, height);

  const maxLineAlpha = palette.isDark ? 0.36 : 0.24;

  // 1. Draw dynamic & fading connections
  ctx.lineWidth = 0.9;
  for (let i = 0; i < connections.length; i++) {
    const edge = connections[i];
    if (edge.opacity <= 0.01) continue;

    const pA = particles[edge.a];
    const pB = particles[edge.b];
    const alpha = Math.min(1, Math.max(0, edge.opacity)) * maxLineAlpha;
    const isAccentLink = pA.isAccent || pB.isAccent;
    const lineRgb = isAccentLink ? palette.accentRgb : palette.baseRgb;

    ctx.beginPath();
    ctx.moveTo(pA.x, pA.y);
    ctx.lineTo(pB.x, pB.y);
    ctx.strokeStyle = `rgba(${lineRgb}, ${alpha.toFixed(3)})`;
    ctx.stroke();
  }

  // 2. Draw particles & understated soft halos
  const baseNodeAlpha = palette.isDark ? 0.62 : 0.48;
  const accentNodeAlpha = palette.isDark ? 0.85 : 0.72;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const rgb = p.isAccent
      ? palette.accentRgb
      : i % 7 === 0
        ? palette.secondaryRgb
        : palette.baseRgb;

    if (p.isAccent) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${palette.isDark ? 0.14 : 0.1})`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb}, ${p.isAccent ? accentNodeAlpha : baseNodeAlpha})`;
    ctx.fill();
  }
}

export const ParticleNetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let isDisposed = false;
    let isPageVisible = !document.hidden;
    let isCanvasInView = true;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    let prefersReduced = motionQuery.matches;
    const isTouchOptimized = coarsePointerQuery.matches || window.innerWidth < 768;

    let palette = readThemePalette();
    let logicalWidth = canvas.parentElement?.clientWidth || window.innerWidth;
    let logicalHeight = canvas.parentElement?.clientHeight || 650;

    const applyCanvasDimensions = (w: number, h: number) => {
      logicalWidth = Math.max(320, w);
      logicalHeight = Math.max(320, h);
      const dpr = isTouchOptimized ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(logicalWidth * dpr);
      canvas.height = Math.floor(logicalHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    applyCanvasDimensions(logicalWidth, logicalHeight);
    const networkState = createParticleNetworkState(logicalWidth, logicalHeight);

    const pointer: PointerState = {
      x: -1000,
      y: -1000,
      active: false,
    };

    const updatePointerFromClient = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;
      const margin = 24;

      if (
        relX >= -margin &&
        relX <= rect.width + margin &&
        relY >= -margin &&
        relY <= rect.height + margin
      ) {
        pointer.x = relX;
        pointer.y = relY;
        pointer.active = true;
      } else {
        pointer.active = false;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      updatePointerFromClient(e.clientX, e.clientY);
    };

    const clearPointer = () => {
      pointer.active = false;
      pointer.x = -1000;
      pointer.y = -1000;
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const nextW = canvas.parentElement.clientWidth;
      const nextH = canvas.parentElement.clientHeight;
      if (nextW === logicalWidth && nextH === logicalHeight) return;
      applyCanvasDimensions(nextW, nextH);
      resizeParticleNetworkState(networkState, nextW, nextH);
      if (prefersReduced) {
        drawParticleNetwork(ctx, networkState, palette);
      }
    };

    let lastTimestamp = performance.now();
    const minFrameIntervalMs = isTouchOptimized ? 33 : 0;

    const frame = (timestamp: number) => {
      if (isDisposed) return;

      const elapsedMs = timestamp - lastTimestamp;
      if (minFrameIntervalMs > 0 && elapsedMs < minFrameIntervalMs) {
        if (!prefersReduced && isPageVisible && isCanvasInView && !isDisposed) {
          animationFrameId = requestAnimationFrame(frame);
        } else {
          animationFrameId = null;
        }
        return;
      }

      lastTimestamp = timestamp;
      const dtFactor = Math.min(2.0, Math.max(0.5, elapsedMs / 16.6667));

      if (!prefersReduced) {
        stepParticleNetwork(networkState, pointer, timestamp, dtFactor);
      }
      drawParticleNetwork(ctx, networkState, palette);

      if (!prefersReduced && isPageVisible && isCanvasInView && !isDisposed) {
        animationFrameId = requestAnimationFrame(frame);
      } else {
        animationFrameId = null;
      }
    };

    const startLoop = () => {
      if (isDisposed || animationFrameId !== null) return;
      if (prefersReduced) {
        drawParticleNetwork(ctx, networkState, palette);
        return;
      }
      if (isPageVisible && isCanvasInView) {
        lastTimestamp = performance.now();
        animationFrameId = requestAnimationFrame(frame);
      }
    };

    const stopLoop = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible && isCanvasInView && !prefersReduced) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches;
      stopLoop();
      startLoop();
    };

    // Observe theme class changes on <html> (dark/light & accent presets)
    const themeObserver = new MutationObserver(() => {
      palette = readThemePalette();
      if (prefersReduced) {
        drawParticleNetwork(ctx, networkState, palette);
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(canvas.parentElement);
    }

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isCanvasInView = entry ? entry.isIntersecting : true;
          if (isCanvasInView && isPageVisible && !prefersReduced) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { threshold: 0.01 }
      );
      intersectionObserver.observe(canvas);
    }

    if (!isTouchOptimized) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('blur', clearPointer);
      document.addEventListener('mouseleave', clearPointer);
    }
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery.addEventListener('change', handleMotionChange);

    // Initial paint & start
    drawParticleNetwork(ctx, networkState, palette);
    startLoop();

    return () => {
      isDisposed = true;
      stopLoop();
      themeObserver.disconnect();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (!isTouchOptimized) {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('blur', clearPointer);
        document.removeEventListener('mouseleave', clearPointer);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
