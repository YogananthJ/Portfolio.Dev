import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Terminal, Activity, Layers, Code2, Compass } from 'lucide-react';
import { MOTION_EXPERIMENTS } from './motion-playground.data';
import { MotionCategory } from './motion-playground.types';
import { MotionCard, MotionCardHandle } from './MotionCard';
import { MotionFilters } from './MotionFilters';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface MotionPlaygroundProps {
  onOpenDetail?: (experimentId: string) => void;
}

export const MotionPlayground: React.FC<MotionPlaygroundProps> = ({ onOpenDetail }) => {
  const [activeCategory, setActiveCategory] = useState<MotionCategory>('all');
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const cardsGridRef = useRef<HTMLDivElement | null>(null);

  // Map of refs to trigger actions on cards
  const cardHandlesRef = useRef<Record<string, MotionCardHandle | null>>({});

  const filteredExperiments = activeCategory === 'all'
    ? MOTION_EXPERIMENTS
    : MOTION_EXPERIMENTS.filter((exp) => exp.category === activeCategory);

  // GSAP ScrollTrigger Entrance
  useEffect(() => {
    if (!sectionRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Heading Reveal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Subtitle stagger
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. Progressive Card Entrance
      if (cardsGridRef.current) {
        const cards = cardsGridRef.current.children;
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [activeCategory]);

  // "Surprise Me" handler
  const handleSurpriseMe = () => {
    // If current filter has no items, switch to all
    let available = filteredExperiments;
    if (available.length === 0) {
      setActiveCategory('all');
      available = MOTION_EXPERIMENTS;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const chosen = available[randomIndex];

    const element = document.getElementById(`motion-exp-${chosen.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Trigger card highlight & replay
      setTimeout(() => {
        cardHandlesRef.current[chosen.id]?.flashHighlight();
      }, 400);
    }
  };

  return (
    <section
      id="motion-playground"
      ref={sectionRef}
      className="py-16 sm:py-24 border-b border-[var(--border-color)] bg-[var(--bg-canvas)] relative paper-grid"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono font-bold uppercase text-[var(--accent)] tracking-wider">
              <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>INTERACTIVE EXPERIMENTS // LIVE RENDERING</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>6 BESPOKE SIMULATIONS · HARMONIC RECOVERY</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-2 border-[var(--border-color)] pb-6">
            <div>
              <h2
                ref={headingRef}
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-main)] uppercase tracking-tight"
              >
                MOTION LAB
              </h2>
              <p
                ref={subtitleRef}
                className="font-mono text-sm sm:text-base font-bold text-[var(--accent)] mt-1 italic"
              >
                Small experiments. Real motion. Interactive worlds.
              </p>
            </div>

            <p className="max-w-xl text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Explore interactive animations, creative interaction physics, and generative visuals. 
              Grab, drag, stretch, and explore each experiment with real-time physical simulation and natural recovery.
            </p>
          </div>
        </div>

        {/* Filters & Surprise Me Bar */}
        <MotionFilters
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onSurpriseMe={handleSurpriseMe}
          totalCount={MOTION_EXPERIMENTS.length}
          filteredCount={filteredExperiments.length}
        />

        {/* Experiment Cards Grid */}
        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2"
        >
          {filteredExperiments.map((exp) => (
            <MotionCard
              key={exp.id}
              experiment={exp}
              onOpenDetail={onOpenDetail}
              ref={(handle) => {
                cardHandlesRef.current[exp.id] = handle;
              }}
            />
          ))}
        </div>

        {/* Bottom Educational Callout */}
        <div className="p-4 sm:p-5 bg-[var(--bg-surface)] border-2 border-[var(--border-color)] shadow-[4px_4px_0px_0px_var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[var(--accent)]" />
              <span>CREATIVE CODING PHILOSOPHY: EXPERIMENTATION OVER CANNED PLUGINS</span>
            </div>
            <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
              Every animation in this lab runs directly in the browser with zero video fallbacks. Click "View Code" on any experiment to inspect clean, modular source code you can drop into any React/TypeScript application.
            </p>
          </div>

          <button
            onClick={handleSurpriseMe}
            className="px-4 py-2 bg-[var(--accent)] hover:bg-[#BE123C] text-white font-bold text-xs uppercase shrink-0 transition-colors shadow-[2px_2px_0px_0px_var(--border-color)] cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Random Experiment</span>
          </button>
        </div>
      </div>
    </section>
  );
};
