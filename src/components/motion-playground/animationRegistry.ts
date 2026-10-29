/**
 * Unified Animation Loop Registry
 * 
 * Provides a single coordinated requestAnimationFrame loop across all Motion Lab experiments.
 * Features:
 * - Single rAF driver eliminating duplicate loops and redundant GPU/CPU wakeups.
 * - Tab visibility detection (Page Visibility API) to pause loops when minimized/blurred.
 * - Delta-time clamping (dt) preventing physics explosion after tab restores or frame drops.
 * - Dynamic FPS calculation and active simulation tracking.
 * - React hook `useAnimationLoop` with automatic cleanup and dependency management.
 */

export type AnimationCallback = (timestamp: number, dt: number) => void;

interface RegistryEntry {
  id: string;
  callback: AnimationCallback;
  priority: number;
}

class AnimationLoopRegistry {
  private entries: Map<string, RegistryEntry> = new Map();
  private rafId: number | null = null;
  private lastTimestamp: number = 0;
  private isRunning: boolean = false;
  private isDocumentVisible: boolean = true;
  private fps: number = 60;
  private frameCount: number = 0;
  private fpsLastSampleTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isDocumentVisible = !document.hidden;
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  private handleVisibilityChange = () => {
    if (typeof document === 'undefined') return;
    this.isDocumentVisible = !document.hidden;

    if (this.isDocumentVisible) {
      // Reset timestamp to current time to avoid large dt step
      this.lastTimestamp = performance.now();
      if (this.entries.size > 0 && !this.isRunning) {
        this.start();
      }
    } else {
      // Pause loop while tab is hidden to conserve power and prevent memory leaks
      if (this.isRunning) {
        this.stop();
      }
    }
  };

  /**
   * Register an animation callback. If the loop is not running, it starts automatically.
   */
  public register(id: string, callback: AnimationCallback, priority: number = 0): () => void {
    this.entries.set(id, { id, callback, priority });

    if (!this.isRunning && this.entries.size > 0 && this.isDocumentVisible) {
      this.lastTimestamp = performance.now();
      this.start();
    }

    return () => this.unregister(id);
  }

  /**
   * Unregister an animation callback by id. If no callbacks remain, the loop stops.
   */
  public unregister(id: string): void {
    this.entries.delete(id);
    if (this.entries.size === 0 && this.isRunning) {
      this.stop();
    }
  }

  /**
   * Start the master animation loop
   */
  private start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.fpsLastSampleTime = this.lastTimestamp;
    this.frameCount = 0;
    this.loop(this.lastTimestamp);
  }

  /**
   * Stop the master animation loop
   */
  private stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Core RAF loop handler
   */
  private loop = (timestamp: number) => {
    if (!this.isRunning) return;

    // Calculate clamped dt (between 1ms and 45ms) to prevent integration blowout
    const rawDt = (timestamp - this.lastTimestamp) / 1000;
    const dt = Math.max(0.001, Math.min(rawDt, 0.045));
    this.lastTimestamp = timestamp;

    // Track FPS
    this.frameCount++;
    if (timestamp - this.fpsLastSampleTime >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.fpsLastSampleTime));
      this.frameCount = 0;
      this.fpsLastSampleTime = timestamp;
    }

    // Execute registered callbacks in sorted priority order
    if (this.entries.size > 0) {
      const sortedEntries = Array.from(this.entries.values()).sort((a, b) => b.priority - a.priority);
      for (let i = 0; i < sortedEntries.length; i++) {
        try {
          sortedEntries[i].callback(timestamp, dt);
        } catch (err) {
          console.error(`[AnimationRegistry] Error in loop '${sortedEntries[i].id}':`, err);
        }
      }
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  /**
   * Get current diagnostic stats
   */
  public getStats() {
    return {
      activeListeners: this.entries.size,
      fps: this.fps,
      isRunning: this.isRunning,
      isVisible: this.isDocumentVisible,
    };
  }

  /**
   * Destroy registry and clean up event listeners
   */
  public destroy(): void {
    this.stop();
    this.entries.clear();
    if (typeof window !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }
}

// Singleton instance
export const animationRegistry = new AnimationLoopRegistry();

/**
 * React hook to register an experiment or canvas into the unified animation loop.
 */
import { useEffect, useRef } from 'react';

export function useAnimationLoop(
  id: string,
  callback: AnimationCallback,
  enabled: boolean = true,
  priority: number = 0
) {
  const callbackRef = useRef<AnimationCallback>(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    const unregister = animationRegistry.register(
      id,
      (timestamp, dt) => {
        callbackRef.current(timestamp, dt);
      },
      priority
    );

    return () => {
      unregister();
    };
  }, [id, enabled, priority]);
}
