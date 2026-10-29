/**
 * Touch & Mouse Pointer Normalization Layer
 * 
 * Provides unified, responsive pointer interactions across touchscreens and desktop mice:
 * - Normalizes coordinates relative to the canvas bounding rect.
 * - Computes instantaneous and smoothed velocity vectors (vx, vy).
 * - Tracks pointer down, move, up, cancel, and canvas enter/leave.
 * - Handles global window pointerup/pointercancel so drags are never stuck if released outside canvas.
 * - Enforces touch-action: none and prevents default gestures where appropriate.
 */

export interface NormalizedPointerState {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  isDown: boolean;
  isInside: boolean;
  pointerId: number | null;
  pointerType: string;
}

export interface UseNormalizedPointerOptions {
  onPointerDown?: (state: NormalizedPointerState, event: PointerEvent) => void;
  onPointerMove?: (state: NormalizedPointerState, event: PointerEvent) => void;
  onPointerUp?: (state: NormalizedPointerState, event: PointerEvent) => void;
  onPointerCancel?: (state: NormalizedPointerState, event: PointerEvent) => void;
  onPointerLeave?: (state: NormalizedPointerState) => void;
}

/**
 * Helper to compute element-relative coordinates from a pointer event
 */
export function getRelativePointerPos(
  event: PointerEvent | React.PointerEvent,
  element: HTMLElement
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  const scaleX = element.clientWidth ? element.clientWidth / rect.width : 1;
  const scaleY = element.clientHeight ? element.clientHeight / rect.height : 1;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

/**
 * Creates and manages a normalized pointer controller for a canvas element.
 */
export class NormalizedPointerController {
  private element: HTMLElement | null = null;
  private state: NormalizedPointerState = {
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    vx: 0,
    vy: 0,
    isDown: false,
    isInside: false,
    pointerId: null,
    pointerType: 'mouse',
  };

  private lastTime: number = 0;
  private options: UseNormalizedPointerOptions = {};

  constructor(options: UseNormalizedPointerOptions = {}) {
    this.options = options;
  }

  public attach(element: HTMLElement) {
    if (this.element === element) return;
    this.detach();
    this.element = element;

    // Apply touch-action style
    element.style.touchAction = 'none';

    element.addEventListener('pointerdown', this.handlePointerDown);
    element.addEventListener('pointermove', this.handlePointerMove);
    element.addEventListener('pointerup', this.handlePointerUp);
    element.addEventListener('pointercancel', this.handlePointerCancel);
    element.addEventListener('pointerenter', this.handlePointerEnter);
    element.addEventListener('pointerleave', this.handlePointerLeave);

    if (typeof window !== 'undefined') {
      window.addEventListener('pointerup', this.handleWindowPointerUp);
      window.addEventListener('pointercancel', this.handleWindowPointerCancel);
    }
  }

  public detach() {
    if (!this.element) return;
    this.element.removeEventListener('pointerdown', this.handlePointerDown);
    this.element.removeEventListener('pointermove', this.handlePointerMove);
    this.element.removeEventListener('pointerup', this.handlePointerUp);
    this.element.removeEventListener('pointercancel', this.handlePointerCancel);
    this.element.removeEventListener('pointerenter', this.handlePointerEnter);
    this.element.removeEventListener('pointerleave', this.handlePointerLeave);

    if (typeof window !== 'undefined') {
      window.removeEventListener('pointerup', this.handleWindowPointerUp);
      window.removeEventListener('pointercancel', this.handleWindowPointerCancel);
    }

    this.element = null;
    this.reset();
  }

  public getState(): Readonly<NormalizedPointerState> {
    return this.state;
  }

  private updatePos(event: PointerEvent) {
    if (!this.element) return;
    const pos = getRelativePointerPos(event, this.element);
    const now = performance.now();
    const dt = this.lastTime > 0 ? Math.max(0.001, (now - this.lastTime) / 1000) : 0.016;
    this.lastTime = now;

    if (this.state.x > -9000) {
      const rawVx = (pos.x - this.state.x) / dt;
      const rawVy = (pos.y - this.state.y) / dt;
      // Exponential moving average for velocity stability
      this.state.vx = this.state.vx * 0.4 + rawVx * 0.6;
      this.state.vy = this.state.vy * 0.4 + rawVy * 0.6;
    } else {
      this.state.vx = 0;
      this.state.vy = 0;
    }

    this.state.prevX = this.state.x;
    this.state.prevY = this.state.y;
    this.state.x = pos.x;
    this.state.y = pos.y;
    this.state.pointerType = event.pointerType;
  }

  private handlePointerDown = (e: PointerEvent) => {
    if (!this.element) return;
    try {
      this.element.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if setPointerCapture fails
    }

    this.state.pointerId = e.pointerId;
    this.state.isDown = true;
    this.state.isInside = true;
    this.updatePos(e);
    this.options.onPointerDown?.(this.state, e);
  };

  private handlePointerMove = (e: PointerEvent) => {
    this.updatePos(e);
    this.options.onPointerMove?.(this.state, e);
  };

  private handlePointerUp = (e: PointerEvent) => {
    if (this.state.pointerId === e.pointerId || this.state.isDown) {
      this.state.isDown = false;
      this.state.pointerId = null;
      try {
        if (this.element?.hasPointerCapture(e.pointerId)) {
          this.element.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Safe catch
      }
      this.options.onPointerUp?.(this.state, e);
    }
  };

  private handleWindowPointerUp = (e: PointerEvent) => {
    if (this.state.isDown) {
      this.handlePointerUp(e);
    }
  };

  private handlePointerCancel = (e: PointerEvent) => {
    this.state.isDown = false;
    this.state.pointerId = null;
    this.options.onPointerCancel?.(this.state, e);
  };

  private handleWindowPointerCancel = (e: PointerEvent) => {
    if (this.state.isDown) {
      this.handlePointerCancel(e);
    }
  };

  private handlePointerEnter = (e: PointerEvent) => {
    this.state.isInside = true;
    this.updatePos(e);
  };

  private handlePointerLeave = () => {
    this.state.isInside = false;
    if (!this.state.isDown) {
      this.state.x = -9999;
      this.state.y = -9999;
      this.state.vx = 0;
      this.state.vy = 0;
    }
    this.options.onPointerLeave?.(this.state);
  };

  public reset() {
    this.state = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      isDown: false,
      isInside: false,
      pointerId: null,
      pointerType: 'mouse',
    };
    this.lastTime = 0;
  }
}
