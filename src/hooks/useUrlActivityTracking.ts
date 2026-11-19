import { useEffect, useRef } from 'react';
import {
  ScrollDirection,
  ScrollMilestone,
  trackButtonClick,
  trackScrollDirection,
  trackScrollProgress,
  wasRecentSpecificUrlEvent,
} from '../utils/urlActivityTracker';

interface UseUrlActivityTrackingOptions {
  /** Enables scroll milestone & direction tracking (e.g. standard home layout). */
  isScrollTrackingEnabled: boolean;
  /** Suppresses scroll URL updates while a modal/drawer locks viewport scroll. */
  isModalOpen: boolean;
}

const SCROLL_DIRECTION_DELTA_PX = 48;

export function getScrollMilestone(percent: number): ScrollMilestone | null {
  if (percent >= 96) return 100;
  if (percent >= 75) return 75;
  if (percent >= 50) return 50;
  if (percent >= 25) return 25;
  return null;
}

/**
 * Connects global scroll milestone/direction tracking (throttled via requestAnimationFrame)
 * and delegated button click tracking (`?event=click`) when no specific domain event fired.
 */
export function useUrlActivityTracking({
  isScrollTrackingEnabled,
  isModalOpen,
}: UseUrlActivityTrackingOptions): void {
  const lastMilestoneRef = useRef<ScrollMilestone | null>(null);
  const lastDirectionRef = useRef<ScrollDirection | null>(null);
  const lastScrollYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const rafIdRef = useRef<number | null>(null);

  // 1. Delegated generic button click tracking (`?event=click`)
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest('button, [role="button"]');
      if (!button) return;
      if (button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true') {
        return;
      }
      if (button.getAttribute('data-url-track') === 'ignore') {
        return;
      }

      // Yield to any domain-specific event tracked during this click's React handler
      if (wasRecentSpecificUrlEvent()) {
        return;
      }

      trackButtonClick();
    };

    document.addEventListener('click', handleDocumentClick, false);
    return () => {
      document.removeEventListener('click', handleDocumentClick, false);
    };
  }, []);

  // 2. RAF-throttled passive scroll milestone & direction tracking
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
      const deltaY = currentY - lastScrollYRef.current;

      let nextDirection: ScrollDirection | null = lastDirectionRef.current;
      if (Math.abs(deltaY) >= SCROLL_DIRECTION_DELTA_PX) {
        nextDirection = deltaY > 0 ? 'down' : 'up';
        lastScrollYRef.current = currentY;
      }

      const percent = Math.min(100, Math.max(0, (currentY / maxScroll) * 100));
      const milestone = getScrollMilestone(percent);

      const milestoneChanged = milestone !== null && milestone !== lastMilestoneRef.current;
      const directionChanged = nextDirection !== null && nextDirection !== lastDirectionRef.current;

      if (milestoneChanged && milestone !== null) {
        lastMilestoneRef.current = milestone;
        if (nextDirection) {
          lastDirectionRef.current = nextDirection;
        }
        trackScrollProgress(milestone, nextDirection ?? undefined);
      } else if (directionChanged && nextDirection !== null && currentY > 40) {
        lastDirectionRef.current = nextDirection;
        trackScrollDirection(nextDirection);
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
