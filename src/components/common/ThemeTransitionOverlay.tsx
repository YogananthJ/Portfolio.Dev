import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';

/**
 * Global Framer Motion Glassmorphism Theme Transition Overlay.
 *
 * Provides a high-end, cinematic cross-fade effect across the entire viewport
 * whenever the user toggles between Light and Dark modes.
 *
 * Features:
 * - Frosted glassmorphism backdrop blur (16px) with dynamic theme tint.
 * - Hardware-accelerated specular light refraction sweep.
 * - Floating glassmorphism feedback badge with animated Sun / Moon iconography.
 * - Non-blocking pointer-events-none layer (clicks and scrolls are never trapped).
 * - Automatic respect for prefers-reduced-motion accessibility preferences.
 */
export const ThemeTransitionOverlay: React.FC = () => {
  const { isDark, isThemeTransitioning } = useLayout();
  const shouldReduceMotion = useReducedMotion();

  // If user requests reduced motion, gracefully skip the blur/motion overlay
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isThemeTransitioning && (
        <motion.div
          key={isDark ? 'dark-glass-transition' : 'light-glass-transition'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden flex items-center justify-center select-none"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: isDark
              ? 'radial-gradient(ellipse at center, rgba(24, 24, 27, 0.42) 0%, rgba(15, 15, 17, 0.65) 100%)'
              : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.52) 0%, rgba(245, 242, 235, 0.72) 100%)',
          }}
          aria-hidden="true"
        >
          {/* Hardware-accelerated diagonal specular light sweep */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? 'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.12) 50%, transparent 80%)'
                : 'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.65) 50%, transparent 80%)',
              transform: 'skewX(-25deg)',
            }}
          />

          {/* Floating Glassmorphic Feedback Badge */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`px-5 py-3 rounded-2xl border flex items-center gap-3.5 font-mono text-xs uppercase tracking-wider backdrop-blur-2xl shadow-2xl ${
              isDark
                ? 'bg-[#18181B]/85 border-white/20 text-white shadow-[0_25px_60px_rgba(0,0,0,0.65)]'
                : 'bg-white/85 border-black/15 text-zinc-900 shadow-[0_25px_60px_rgba(0,0,0,0.14)]'
            }`}
            style={{
              boxShadow: isDark
                ? '0 25px 60px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.25)'
                : '0 25px 60px rgba(0, 0, 0, 0.14), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
            }}
          >
            {/* Animated Icon Emblem */}
            <motion.div
              animate={{ rotate: [0, 18, 0], scale: [0.9, 1.12, 1] }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  : 'bg-amber-500/20 text-amber-600 border border-amber-500/30'
              }`}
            >
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </motion.div>

            {/* Typography */}
            <div className="flex flex-col">
              <span className="font-black text-[11.5px] tracking-widest leading-tight">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
              <span className="text-[9.5px] opacity-70 font-sans normal-case tracking-normal leading-tight mt-0.5">
                Glassmorphism cross-fade
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
