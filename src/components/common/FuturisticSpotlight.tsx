import React, { useEffect, useRef } from 'react';

/**
 * High-Performance Context-Aware Custom Cursor & Ambient Spotlight
 *
 * Performance-first architecture:
 * - 0ms tracking latency: Center dot updates directly on native pointer events.
 * - GPU-accelerated rAF loop: Interpolates outer ring with momentum and velocity distortion.
 * - Zero React state updates on pointer moves (eliminates 120Hz React re-rendering jank).
 * - Web Animations API for micro-ripples, double-click shockwaves, and distortion pulses.
 * - Context-aware behaviors: Single-click, double-click, right-click, dragging elongation,
 *   text-selection pinpoint mode, scroll inertia, magnetic attraction, and interactive hover labels.
 * - Touch & Reduced-Motion compliant: Automatically disables on touch devices and respects prefers-reduced-motion.
 */
export const FuturisticSpotlight: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const cursorRootRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const ringBorderRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ripple1Ref = useRef<HTMLDivElement | null>(null);
  const ripple2Ref = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const labelTextRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    // 1. Only enable on fine pointer devices (mouse/trackpad); bypass mobile/touch
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Internal state tracked via non-reactive refs for 120 FPS performance
    const state = {
      // Coordinates
      targetX: -100,
      targetY: -100,
      currentX: -100,
      currentY: -100,
      prevX: -100,
      prevY: -100,
      vx: 0,
      vy: 0,
      speed: 0,

      // Interactive States
      isPointerInWindow: false,
      isMouseDown: false,
      isSelectingText: false,
      isScrolling: false,
      isDragging: false,
      targetMode: 'none' as 'none' | 'card' | 'canvas' | 'action' | 'text',
      targetLabel: '',

      // Magnetic offsets
      magneticX: 0,
      magneticY: 0,

      // Distortion factors
      currentAngle: 0,
      currentScaleX: 1,
      currentScaleY: 1,

      // Animation flags
      scrollTimeout: null as number | null,
    };

    let rafId: number;

    // Direct helper to trigger outward shockwave ripples without React re-renders
    const triggerRipple = (
      element: HTMLDivElement | null, 
      scaleFrom = 1, 
      scaleTo = 2.4, 
      duration = 260, 
      color = 'rgba(225, 29, 72, 0.85)'
    ) => {
      if (!element || prefersReducedMotion) return;
      element.animate(
        [
          { transform: `scale(${scaleFrom})`, opacity: 0.9, borderColor: color },
          { transform: `scale(${scaleTo})`, opacity: 0, borderColor: 'rgba(251, 113, 133, 0)' }
        ],
        {
          duration,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'forwards'
        }
      );
    };

    // Update contextual label visibility and text directly via DOM
    const updateLabel = (visible: boolean, text: string) => {
      if (!labelRef.current || !labelTextRef.current) return;
      if (visible && text) {
        labelTextRef.current.textContent = text;
        labelRef.current.style.opacity = '1';
        labelRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
      } else {
        labelRef.current.style.opacity = '0';
        labelRef.current.style.transform = 'translate3d(-4px, -4px, 0) scale(0.92)';
      }
    };

    // 2. High-Frequency Native Pointer Movement
    const handlePointerMove = (e: PointerEvent) => {
      state.targetX = e.clientX;
      state.targetY = e.clientY;

      if (!state.isPointerInWindow) {
        state.isPointerInWindow = true;
        if (cursorRootRef.current) cursorRootRef.current.style.opacity = '1';
        if (spotlightRef.current) spotlightRef.current.style.opacity = '1';
      }

      // Check text selection in progress
      const hasSelection = typeof window !== 'undefined' && window.getSelection && (window.getSelection()?.toString().length ?? 0) > 0;
      state.isSelectingText = Boolean(hasSelection);

      // Inspect target element beneath pointer
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Handle text selection mode over readable content
      if (
        state.isSelectingText || 
        (state.isMouseDown && target.closest('p, span, h1, h2, h3, h4, pre, code, blockquote, input, textarea'))
      ) {
        state.targetMode = 'text';
        updateLabel(false, '');
        return;
      }

      // Magnetic hover target detection
      const interactiveEl = target.closest('button, a, [role="button"], input, select, textarea, .project-card-item, canvas, [data-cursor-interactive]') as HTMLElement | null;

      if (interactiveEl) {
        if (interactiveEl.closest('.project-card-item')) {
          state.targetMode = 'card';
          state.targetLabel = 'SYSTEM // SCHEMATIC';
        } else if (interactiveEl.closest('canvas')) {
          state.targetMode = 'canvas';
          state.targetLabel = 'PHYSICS // DRAG';
        } else {
          state.targetMode = 'action';
          const explicitLabel = interactiveEl.getAttribute('data-cursor-label');
          const title = interactiveEl.getAttribute('title') || interactiveEl.getAttribute('aria-label');
          
          if (explicitLabel) {
            state.targetLabel = explicitLabel.toUpperCase();
          } else if (title && title.length <= 18) {
            state.targetLabel = title.toUpperCase();
          } else if (interactiveEl.tagName === 'INPUT' || interactiveEl.tagName === 'TEXTAREA') {
            state.targetLabel = 'INPUT';
          } else {
            state.targetLabel = 'INTERACT';
          }
        }

        // Subtle magnetic pull towards element center for compact buttons (max 5px delta)
        const rect = interactiveEl.getBoundingClientRect();
        if (rect.width <= 140 && rect.height <= 80) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          state.magneticX = (centerX - e.clientX) * 0.14;
          state.magneticY = (centerY - e.clientY) * 0.14;
        } else {
          state.magneticX = 0;
          state.magneticY = 0;
        }

        updateLabel(true, state.targetLabel);
      } else {
        state.targetMode = 'none';
        state.targetLabel = '';
        state.magneticX = 0;
        state.magneticY = 0;
        updateLabel(false, '');
      }
    };

    // 3. Pointer Down: Immediate Compression & Accent Glow
    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return; // Only primary button
      state.isMouseDown = true;

      if (ringBorderRef.current) {
        ringBorderRef.current.style.transform = 'scale(0.74)';
        ringBorderRef.current.style.borderColor = '#FB7185';
        ringBorderRef.current.style.backgroundColor = 'rgba(225, 29, 72, 0.28)';
      }
      if (dotRef.current) {
        dotRef.current.style.transform = 'scale(1.5)';
        dotRef.current.style.backgroundColor = '#FFFFFF';
      }
    };

    // 4. Pointer Up & Release Ripple
    const handlePointerUp = (e: PointerEvent) => {
      state.isMouseDown = false;
      state.isDragging = false;

      if (ringBorderRef.current) {
        ringBorderRef.current.style.transform = 'scale(1)';
        ringBorderRef.current.style.borderColor = '';
        ringBorderRef.current.style.backgroundColor = '';
      }
      if (dotRef.current) {
        dotRef.current.style.transform = 'scale(1)';
        dotRef.current.style.backgroundColor = '';
      }

      // Single-click release ripple
      if (e.button === 0) {
        triggerRipple(ripple1Ref.current, 1, 2.3, 260, 'rgba(225, 29, 72, 0.8)');
      }
    };

    // 5. Double-Click: Rapid Dual Concentric Pulse (Zero Delay on Single Click)
    const handleDoubleClick = () => {
      // First ripple expands wide
      triggerRipple(ripple1Ref.current, 1.1, 2.8, 320, 'rgba(225, 29, 72, 0.9)');
      
      // Second ripple follows immediately with a fast resonant frequency
      setTimeout(() => {
        triggerRipple(ripple2Ref.current, 0.8, 2.2, 280, 'rgba(251, 113, 133, 0.85)');
      }, 40);

      // Brief tactile distortion bounce on outer ring
      if (ringBorderRef.current && !prefersReducedMotion) {
        ringBorderRef.current.animate(
          [
            { transform: 'scale(1.35)', borderColor: '#FB7185' },
            { transform: 'scale(0.88)' },
            { transform: 'scale(1)' }
          ],
          {
            duration: 300,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }
        );
      }
    };

    // 6. Right-Click: Directional Angular Distortion (Native Context Menu Preserved)
    const handleContextMenu = () => {
      if (prefersReducedMotion) return;
      if (ringBorderRef.current) {
        ringBorderRef.current.animate(
          [
            { transform: 'rotate(0deg) scale(1)', borderColor: '#E11D48' },
            { transform: 'rotate(45deg) scale(1.22)', borderColor: '#FB7185' },
            { transform: 'rotate(0deg) scale(1)', borderColor: 'rgba(225, 29, 72, 0.8)' }
          ],
          {
            duration: 240,
            easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)'
          }
        );
      }
      triggerRipple(ripple1Ref.current, 1, 2.0, 240, 'rgba(251, 113, 133, 0.7)');
    };

    // 7. Scroll Interaction: Subtle Inertial Compression (Throttled & Non-Bouncing)
    const handleScroll = () => {
      state.isScrolling = true;
      if (state.scrollTimeout) window.clearTimeout(state.scrollTimeout);

      state.scrollTimeout = window.setTimeout(() => {
        state.isScrolling = false;
      }, 120);
    };

    // 8. Pointer Enter / Leave Window
    const handlePointerEnter = () => {
      state.isPointerInWindow = true;
      if (cursorRootRef.current) cursorRootRef.current.style.opacity = '1';
      if (spotlightRef.current) spotlightRef.current.style.opacity = '1';
    };

    const handlePointerLeave = () => {
      state.isPointerInWindow = false;
      state.isMouseDown = false;
      state.isDragging = false;
      if (cursorRootRef.current) cursorRootRef.current.style.opacity = '0';
      if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
      updateLabel(false, '');
    };

    // 9. Hardware-Accelerated 120 FPS Animation Loop
    const updateLoop = () => {
      // First frame initialization
      if (state.currentX === -100 && state.targetX !== -100) {
        state.currentX = state.targetX;
        state.currentY = state.targetY;
        state.prevX = state.targetX;
        state.prevY = state.targetY;
      }

      // Smooth kinetic lerp for outer ring (0.36 = responsive with organic fluidity)
      const lerp = prefersReducedMotion ? 1 : 0.36;
      state.currentX += (state.targetX + state.magneticX - state.currentX) * lerp;
      state.currentY += (state.targetY + state.magneticY - state.currentY) * lerp;

      // Velocity calculation
      state.vx = state.targetX - state.prevX;
      state.vy = state.targetY - state.prevY;
      state.speed = Math.hypot(state.vx, state.vy);
      state.prevX = state.targetX;
      state.prevY = state.targetY;

      // Detect active drag action
      state.isDragging = state.isMouseDown && state.speed > 2.0;

      // Calculate directional aerodynamic distortion
      let targetAngle = 0;
      let targetScaleX = 1;
      let targetScaleY = 1;

      if (!prefersReducedMotion) {
        if (state.isDragging) {
          // Elongate in movement direction during drag
          targetAngle = Math.atan2(state.vy, state.vx) * (180 / Math.PI);
          const stretch = Math.min(1.42, 1 + state.speed * 0.016);
          const compress = Math.max(0.72, 1 - state.speed * 0.009);
          targetScaleX = stretch;
          targetScaleY = compress;
        } else if (state.isScrolling) {
          // Subtle vertical compression during scroll
          targetAngle = 0;
          targetScaleX = 1.12;
          targetScaleY = 0.86;
        } else if (state.speed > 3) {
          // Subtle kinetic tilt based on mouse velocity
          targetAngle = Math.atan2(state.vy, state.vx) * (180 / Math.PI);
          const subtleStretch = Math.min(1.18, 1 + state.speed * 0.006);
          const subtleCompress = Math.max(0.88, 1 - state.speed * 0.004);
          targetScaleX = subtleStretch;
          targetScaleY = subtleCompress;
        }
      }

      // Smooth decay of distortion factors
      state.currentAngle += (targetAngle - state.currentAngle) * 0.28;
      state.currentScaleX += (targetScaleX - state.currentScaleX) * 0.25;
      state.currentScaleY += (targetScaleY - state.currentScaleY) * 0.25;

      // Update Cursor Root Position
      if (cursorRootRef.current) {
        cursorRootRef.current.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0)`;
      }

      // Update Ring Transform with Distortion
      if (ringRef.current) {
        if (state.targetMode === 'text') {
          // Precision pinpoint mode during text selection
          ringRef.current.style.transform = 'scale(0.35)';
          ringRef.current.style.opacity = '0.25';
        } else {
          ringRef.current.style.transform = `rotate(${state.currentAngle}deg) scale(${state.currentScaleX}, ${state.currentScaleY})`;
          ringRef.current.style.opacity = '1';
        }
      }

      // Center Dot: Always strictly anchored to actual pointer (0ms perceived lag)
      if (dotRef.current) {
        const dotOffsetX = state.targetX - state.currentX;
        const dotOffsetY = state.targetY - state.currentY;
        dotRef.current.style.transform = `translate3d(${dotOffsetX}px, ${dotOffsetY}px, 0) scale(${state.isMouseDown ? 1.45 : state.targetMode === 'text' ? 0.75 : 1})`;
      }

      // Update Ambient Spotlight Position
      if (spotlightRef.current && state.isPointerInWindow) {
        spotlightRef.current.style.background = `radial-gradient(650px circle at ${state.targetX}px ${state.targetY}px, rgba(225, 29, 72, 0.05), rgba(56, 189, 248, 0.02), transparent 75%)`;
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    // Attach listeners with passive options for maximum scroll/touch performance
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('dblclick', handleDoubleClick, { passive: true });
    window.addEventListener('contextmenu', handleContextMenu, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('pointerenter', handlePointerEnter, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('dblclick', handleDoubleClick);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('pointerenter', handlePointerEnter);
      document.removeEventListener('pointerleave', handlePointerLeave);
      cancelAnimationFrame(rafId);
      if (state.scrollTimeout) window.clearTimeout(state.scrollTimeout);
    };
  }, []);

  return (
    <>
      {/* Ambient Hardware-Accelerated Spotlight Illumination */}
      <div
        ref={spotlightRef}
        className="fixed inset-0 pointer-events-none z-20 opacity-0 transition-opacity duration-300 select-none will-change-[background]"
        aria-hidden="true"
      />

      {/* Kinetic Context-Aware Custom Cursor Chassis */}
      <div
        ref={cursorRootRef}
        className="fixed top-0 left-0 pointer-events-none z-50 select-none hidden md:block opacity-0 will-change-transform"
        aria-hidden="true"
      >
        {/* Cursor Reticle Center Anchor (-50% -50%) */}
        <div className="relative -top-1/2 -left-1/2 flex items-center justify-center">
          {/* Animated Distortion Layer */}
          <div ref={ringRef} className="relative flex items-center justify-center will-change-transform">
            {/* Primary Outward Pulse Ripple (Single Click / Double Click Burst 1) */}
            <div
              ref={ripple1Ref}
              className="absolute -inset-1.5 rounded-full border border-rose-500 pointer-events-none opacity-0 scale-100 will-change-transform"
            />

            {/* Secondary Concentric Ripple (Double Click Burst 2) */}
            <div
              ref={ripple2Ref}
              className="absolute -inset-1 rounded-full border border-pink-400 pointer-events-none opacity-0 scale-100 will-change-transform"
            />

            {/* Main Outer Thin Circular Ring */}
            <div
              ref={ringBorderRef}
              className="w-7 h-7 rounded-full border-[1.5px] border-rose-500/85 bg-rose-500/5 shadow-[0_0_10px_rgba(225,29,72,0.3)] transition-all duration-150 flex items-center justify-center will-change-transform"
            />
          </div>

          {/* Precision Center Core Dot (Always exactly pinned to pointer coordinate) */}
          <div
            ref={dotRef}
            className="absolute w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(225,29,72,0.8)] pointer-events-none transition-colors duration-100 will-change-transform"
          />

          {/* Contextual Futuristic HUD Label Tag */}
          <div
            ref={labelRef}
            className="absolute top-5 left-5 whitespace-nowrap bg-black/90 border border-rose-500/40 text-white font-mono text-[8.5px] px-1.5 py-0.5 rounded-xs tracking-wider shadow-xl flex items-center gap-1.5 opacity-0 transition-opacity duration-150 pointer-events-none"
          >
            <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
            <span ref={labelTextRef} className="font-bold text-rose-300">
              INTERACT
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
