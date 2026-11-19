import { useEffect, useRef } from 'react';
import {
  clearScrollParam,
  ScrollMilestone,
  trackScrollProgress,
} from '../utils/urlActivityTracker';

interface UseUrlActivityTrackingOptions {
  /** Enables scroll milestone tracking (standard home layout). */
  isScrollTrackingEnabled: boolean;
  /** Suppresses scroll URL updates while a modal/drawer locks viewport scroll. */
  isModalOpen: boolean;
}

export function getScrollMilestone(percent: number): ScrollMilestone | null {
  if (percent >= 96) return 100;
  if (percent >= 75) return 75;
  if (percent >= 50) return 50;
  if (percent >= 25) return 25;
  return null;
}

/**
 * Tracks meaningful viewport scroll progress milestones (25%, 50%, 75%, 100%)
 * throttled via requestAnimationFrame and passive scroll listeners.
 */
export function useUrlActivityTracking({
  isScrollTrackingEnabled,
  isModalOpen,
}: UseUrlActivityTrackingOptions): void {
  const lastMilestoneRef = useRef<ScrollMilestone | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isScrollTrackingEnabled || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const evaluateScroll = () => {
      rafIdRef.current = null;
      if (isModalOpen) return;

      const docEl = document.documentElement;
      const scrollHeight = Math.max(docEl.scrollHeight, document.body?.scrollHeight || 0);
      const maxScroll = scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const currentY = Math.max(0, window.scrollY);
      const percent = Math.min(100, Math.max(0, (currentY / maxScroll) * 100));
      const milestone = getScrollMilestone(percent);

      if (milestone !== lastMilestoneRef.current) {
        lastMilestoneRef.current = milestone;
        if (milestone !== null) {
          trackScrollProgress(milestone);
        } else {
          clearScrollParam();
        }
      }
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(evaluateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isScrollTrackingEnabled, isModalOpen]);
}
