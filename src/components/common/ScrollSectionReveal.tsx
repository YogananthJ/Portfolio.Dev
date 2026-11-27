import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

export type ScrollAnimationVariant =
  | 'fade-up'
  | 'curtain-rise'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-emerge'
  | 'perspective-unfold'
  | 'dock-up';

export interface ScrollSectionRevealProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  variant?: ScrollAnimationVariant;
  delay?: number;
  yOffset?: number;
  duration?: number;
  staggerChildren?: number;
  delayChildren?: number;
}

/**
 * Standard child item variants for staggered child elements within a section
 * (e.g., project cards, skill badges, metrics cards, timeline items).
 */
export const revealItemVariants: Variants = {
  hidden: { opacity: 1, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0,
    },
  },
};

/**
 * StaggerContainer component to wrap lists of cards or badges without hiding content.
 */
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

/**
 * Child item wrapper that keeps content visible and interactive immediately.
 */
export const RevealItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  duration?: number;
  variants?: Variants;
}> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

/**
 * Reusable section wrapper keeping sections immediately readable and interactive
 * during fast scrolling while providing optional subtle non-blocking motion on desktop.
 */
export const ScrollSectionReveal: React.FC<ScrollSectionRevealProps> = ({
  children,
  id,
  className = '',
  yOffset = 10,
  duration = 0.2,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div id={id} className={`w-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={`w-full ${className}`}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.02 }}
      transition={{ duration: Math.min(0.22, duration), ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: 'center top' }}
      data-reveal-offset={yOffset}
    >
      {children}
    </motion.div>
  );
};

export default ScrollSectionReveal;
