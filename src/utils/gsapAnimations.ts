import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initializes entrance animations for the Hero section
 */
export const initHeroAnimations = (
  containerRef: HTMLElement | null,
  headlineRef: HTMLElement | null,
  portraitRef: HTMLElement | null,
  metaRef: HTMLElement | null,
  consoleRef: HTMLElement | null
) => {
  if (!containerRef || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // 1. Meta kicker reveal
  if (metaRef) {
    tl.fromTo(
      metaRef,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 }
    );
  }

  // 2. Monolithic Typography Dramatic Reveal
  if (headlineRef) {
    tl.fromTo(
      headlineRef,
      { y: 40, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.9 },
      '-=0.3'
    );
  }

  // 3. Portrait Avatar Pop & Float
  if (portraitRef) {
    tl.fromTo(
      portraitRef,
      { scale: 0.8, opacity: 0, y: 30, rotation: -3 },
      { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.5'
    );
  }

  // 4. Code Console Slide In
  if (consoleRef) {
    tl.fromTo(
      consoleRef,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7 },
      '-=0.4'
    );
  }
};

/**
 * Registers continuous subtle floating motion on the portrait image
 */
export const initFloatingMotion = (element: HTMLElement | null) => {
  if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const floatTween = gsap.to(element, {
    y: '-=8',
    rotation: 1,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  return () => {
    floatTween.kill();
  };
};

/**
 * Adds magnetic pull to interactive buttons on mouse movement
 */
export const attachMagneticEffect = (element: HTMLElement | null, strength: number = 0.25) => {
  if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const xTo = gsap.quickTo(element, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(element, 'y', { duration: 0.35, ease: 'power3' });

  const onMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    xTo(relX * strength);
    yTo(relY * strength);
  };

  const onMouseLeave = () => {
    xTo(0);
    yTo(0);
  };

  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);

  return () => {
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
  };
};

/**
 * Applies 3D card tilt effect on mouse hover
 */
export const attach3DTilt = (card: HTMLElement | null, maxAngle: number = 7) => {
  if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const rotXTo = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power3.out' });
  const rotYTo = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power3.out' });

  const onMouseMove = (e: MouseEvent) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotX = ((y / rect.height) - 0.5) * -maxAngle;
    const rotY = ((x / rect.width) - 0.5) * maxAngle;
    rotXTo(rotX);
    rotYTo(rotY);
  };

  const onMouseLeave = () => {
    rotXTo(0);
    rotYTo(0);
  };

  card.addEventListener('mousemove', onMouseMove);
  card.addEventListener('mouseleave', onMouseLeave);

  return () => {
    card.removeEventListener('mousemove', onMouseMove);
    card.removeEventListener('mouseleave', onMouseLeave);
  };
};

/**
 * Batch scroll reveal for cards or sections
 */
export const initScrollStagger = (elements: HTMLElement[], staggerTime = 0.12) => {
  if (!elements.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  ScrollTrigger.batch(elements, {
    onEnter: (batch) => {
      gsap.fromTo(
        batch,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.7, stagger: staggerTime, ease: 'power3.out', overwrite: 'auto' }
      );
    },
    once: true,
  });
};
