import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { ExpandableLabel, useTouchExpandPreview } from './ExpandableIconButton';

const SHOW_SCROLL_THRESHOLD_PX = 32;
const HIDE_SCROLL_THRESHOLD_PX = 12;

interface BackToTopProps {
  onNavigateTop?: () => void;
}

export const BackToTop: React.FC<BackToTopProps> = ({ onNavigateTop }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const isActiveRef = useRef<boolean>(false);
  const shouldReduceMotion = useReducedMotion();
  const touchPreviewProps = useTouchExpandPreview();

  useEffect(() => {
    let rafId: number | null = null;

    const updateVisibility = () => {
      rafId = null;
      const scrollY =
        window.scrollY ?? window.pageYOffset ?? document.documentElement.scrollTop ?? 0;

      const currentlyActive = isActiveRef.current;
      const nextActive = currentlyActive
        ? scrollY > HIDE_SCROLL_THRESHOLD_PX
        : scrollY >= SHOW_SCROLL_THRESHOLD_PX;

      if (nextActive !== currentlyActive) {
        isActiveRef.current = nextActive;
        setIsActive(nextActive);
      }
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateVisibility);
    };

    // Run initial scroll detection on mount
    updateVisibility();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (onNavigateTop) {
      onNavigateTop();
      return;
    }
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.button
          initial={
            shouldReduceMotion
              ? { opacity: 0, x: '-50%' }
              : { opacity: 0, y: 16, x: '-50%' }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1, x: '-50%' }
              : { opacity: 1, y: 0, x: '-50%' }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0, x: '-50%' }
              : { opacity: 0, y: 14, x: '-50%' }
          }
          transition={{
            duration: shouldReduceMotion ? 0.01 : 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll to top of page"
          title="Return to top"
          {...touchPreviewProps}
          style={{
            position: 'fixed',
            left: '50%',
            zIndex: 30,
          }}
          className="expandable-icon-btn expandable-icon-btn--floating fixed z-30 left-1/2 bottom-3 sm:bottom-5 -translate-x-1/2 bg-[#0e0e0e]/90 hover:bg-[#181818] text-white border border-white/20 hover:border-[var(--accent)] rounded-xs shadow-xl backdrop-blur-md font-mono text-xs inline-flex group cursor-pointer select-none"
        >
          <ArrowUp className="w-3.5 h-3.5 shrink-0 text-[var(--accent)] group-hover:-translate-y-0.5 transition-transform" />
          <ExpandableLabel className="text-[10px] uppercase font-bold tracking-wider">
            Top
          </ExpandableLabel>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
