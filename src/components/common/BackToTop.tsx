import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll to top of page"
          title="Return to top"
          className="fixed bottom-6 right-6 z-40 p-2.5 bg-[#0e0e0e]/90 hover:bg-[#181818] text-white border border-white/20 hover:border-[var(--accent)] transition-colors rounded-xs shadow-xl backdrop-blur-md font-mono text-xs flex items-center gap-1.5 group cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5 text-[var(--accent)] group-hover:-translate-y-0.5 transition-transform" />
          <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider">Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
