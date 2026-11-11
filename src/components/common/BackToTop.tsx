import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 700;
      // Transitions to active/visible once user scrolls past the first viewport height (100vh)
      setIsActive(window.scrollY > viewportHeight);
    };

    // Run initial scroll detection on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.button
          initial={
            shouldReduceMotion
              ? { opacity: 0, x: '-50%' }
              : { opacity: 0, y: 24, x: '-50%' }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1, x: '-50%' }
              : { opacity: 1, y: 0, x: '-50%' }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0, x: '-50%' }
              : { opacity: 0, y: 20, x: '-50%' }
          }
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll to top of page"
          title="Return to top"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: '24px',
            zIndex: 50,
          }}
          className="fixed z-50 left-1/2 bottom-6 -translate-x-1/2 p-2.5 bg-[#0e0e0e]/90 hover:bg-[#181818] text-white border border-white/20 hover:border-[var(--accent)] transition-colors rounded-xs shadow-xl backdrop-blur-md font-mono text-xs flex items-center gap-1.5 group cursor-pointer select-none"
        >
          <ArrowUp className="w-3.5 h-3.5 text-[var(--accent)] group-hover:-translate-y-0.5 transition-transform" />
          <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider">Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
