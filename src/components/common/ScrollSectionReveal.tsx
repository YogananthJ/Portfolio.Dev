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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Standard container variants for staggered child animation orchestration.
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

/**
 * StaggerContainer component to wrap lists of cards or badges for sequential viewport animation.
 */
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}> = ({ children, className = '', stagger = 0.07, delay = 0.04 }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.06, margin: '0px 0px -24px 0px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Child item wrapper to be placed inside ScrollSectionReveal or StaggerContainer for staggered animation.
 */
export const RevealItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  duration?: number;
  variants?: Variants;
}> = ({ children, className = '', yOffset = 20, duration = 0.48, variants }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const effectiveVariants = variants || {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div variants={effectiveVariants} className={className}>
      {children}
    </motion.div>
  );
};

function resolveSectionVariants(
  variant: ScrollAnimationVariant,
  yOffset: number,
  duration: number,
  delay: number,
  staggerChildren: number,
  delayChildren: number
): Variants {
  const transition = {
    duration,
    delay,
    ease: [0.22, 1, 0.36, 1] as const,
    staggerChildren: staggerChildren > 0 ? staggerChildren : undefined,
    delayChildren: delayChildren > 0 ? delayChildren : undefined,
  };

  switch (variant) {
    case 'curtain-rise':
      return {
        hidden: { opacity: 0, y: 36, scale: 0.985 },
        visible: { opacity: 1, y: 0, scale: 1, transition },
      };
    case 'slide-left':
      return {
        hidden: { opacity: 0, x: -36 },
        visible: { opacity: 1, x: 0, transition },
      };
    case 'slide-right':
      return {
        hidden: { opacity: 0, x: 36 },
        visible: { opacity: 1, x: 0, transition },
      };
    case 'zoom-emerge':
      return {
        hidden: { opacity: 0, scale: 0.94, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition },
      };
    case 'perspective-unfold':
      return {
        hidden: {
          opacity: 0,
          y: 34,
          scale: 0.97,
          rotateX: 5,
          transformPerspective: 1200,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          transformPerspective: 1200,
          transition,
        },
      };
    case 'dock-up':
      return {
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0, transition },
      };
    case 'fade-up':
    default:
      return {
        hidden: { opacity: 0, y: yOffset },
        visible: { opacity: 1, y: 0, transition },
      };
  }
}

/**
 * Reusable viewport entrance wrapper using Framer Motion.
 * Supports distinct animation presets per section while respecting prefers-reduced-motion.
 */
export const ScrollSectionReveal: React.FC<ScrollSectionRevealProps> = ({
  children,
  id,
  className = '',
  variant = 'fade-up',
  delay = 0,
  yOffset = 28,
  duration = 0.65,
  staggerChildren = 0.08,
  delayChildren = 0.05,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div id={id} className={`w-full ${className}`}>
        {children}
      </div>
    );
  }

  const containerVariants = resolveSectionVariants(
    variant,
    yOffset,
    duration,
    delay,
    staggerChildren,
    delayChildren
  );

  return (
    <motion.div
      id={id}
      className={`w-full ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.04, margin: '0px 0px -24px 0px' }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};

export default ScrollSectionReveal;
