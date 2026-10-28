import React, { useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Layers, 
  Sparkles, 
  Code2, 
  Play, 
  RotateCcw, 
  Cpu,
  Target,
  Compass
} from 'lucide-react';
import { ALL_EXPERIMENT_DETAILS } from '../detail-data';
import { MotionCodeViewer } from './MotionCodeViewer';
import { MotionExplanation } from './MotionExplanation';

// Live Experiment Components
import { LiquidMetalBall } from '../experiments/LiquidMetalBall';
import { AtomicNetwork } from '../experiments/AtomicNetwork';
import { ChaoticTypography } from '../experiments/ChaoticTypography';
import { InfiniteTunnel } from '../experiments/InfiniteTunnel';
import { GalacticCore } from '../experiments/GalacticCore';
import { HeliumBalloon } from '../experiments/HeliumBalloon';

interface MotionExperimentPageProps {
  experimentId: string;
  onBack: () => void;
}

export const MotionExperimentPage: React.FC<MotionExperimentPageProps> = ({
  experimentId,
  onBack,
}) => {
  const detail = ALL_EXPERIMENT_DETAILS[experimentId as keyof typeof ALL_EXPERIMENT_DETAILS] || ALL_EXPERIMENT_DETAILS['helium-balloon'];
  const previewControlsRef = useRef<{ reset: () => void; replay: () => void }>({
    reset: () => {},
    replay: () => {},
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `${detail.title} — Motion Lab | Yogananth`;
  }, [detail.title]);

  const handleRegisterControls = (controls: { reset: () => void; replay: () => void }) => {
    previewControlsRef.current = controls;
  };

  const renderLivePreview = () => {
    switch (detail.id) {
      case 'liquid-metal-ball':
        return <LiquidMetalBall onRegisterControls={handleRegisterControls} className="h-[420px]" />;
      case 'atomic-network':
        return <AtomicNetwork onRegisterControls={handleRegisterControls} className="h-[420px]" />;
      case 'chaotic-typography':
        return <ChaoticTypography onRegisterControls={handleRegisterControls} className="h-[420px]" />;
      case 'infinite-tunnel':
        return <InfiniteTunnel onRegisterControls={handleRegisterControls} className="h-[420px]" />;
      case 'galactic-core':
        return <GalacticCore onRegisterControls={handleRegisterControls} className="h-[420px]" />;
      case 'helium-balloon':
        return <HeliumBalloon onRegisterControls={handleRegisterControls} className="h-[420px]" />;
      default:
        return <HeliumBalloon onRegisterControls={handleRegisterControls} className="h-[420px]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-main)] font-sans paper-grid py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4 font-mono text-xs">
          <button
            onClick={onBack}
            type="button"
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[var(--bg-surface)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border-color)] text-[var(--text-main)] font-bold uppercase transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>&larr; Back to Motion Lab</span>
          </button>

          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <span className="hover:underline cursor-pointer" onClick={onBack}>
              Motion Lab
            </span>
            <span>/</span>
            <span className="font-bold text-[var(--text-main)]">{detail.title}</span>
            <span className="px-2 py-0.5 bg-[var(--accent)] text-white text-[10px] font-bold rounded uppercase">
              EXP_{detail.number}
            </span>
          </div>
        </div>

        {/* Experiment Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono font-bold text-[var(--accent)] uppercase">
              {detail.categoryLabel}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {detail.technologies.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--border-color)] text-[11px] font-mono font-semibold text-[var(--text-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-main)]">
            {detail.title}
          </h1>
          <p className="font-mono text-base font-bold text-[var(--accent)] italic">
            {detail.subtitle}
          </p>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed">
            {detail.description}
          </p>
        </div>

        {/* About This Experiment (4 Pillars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {/* 1. What it is */}
          <div className="p-4 bg-[var(--bg-card)] border-2 border-[var(--border-color)] shadow-[3px_3px_0px_0px_var(--border-color)] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[var(--accent)]">
              <Layers className="w-3.5 h-3.5" />
              <span>What It Is</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {detail.about.whatItIs}
            </p>
          </div>

          {/* 2. What it is used for */}
          <div className="p-4 bg-[var(--bg-card)] border-2 border-[var(--border-color)] shadow-[3px_3px_0px_0px_var(--border-color)] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
              <Target className="w-3.5 h-3.5" />
              <span>Real-World UI Use</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {detail.about.whatItIsUsedFor}
            </p>
          </div>

          {/* 3. How it works */}
          <div className="p-4 bg-[var(--bg-card)] border-2 border-[var(--border-color)] shadow-[3px_3px_0px_0px_var(--border-color)] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-cyan-600 dark:text-cyan-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>Core Mechanics</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {detail.about.howItWorks}
            </p>
          </div>

          {/* 4. What to explore */}
          <div className="p-4 bg-[var(--bg-card)] border-2 border-[var(--border-color)] shadow-[3px_3px_0px_0px_var(--border-color)] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>What to Try</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {detail.about.whatToExplore}
            </p>
          </div>
        </div>

        {/* Interactive Workbench: Live Preview + Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
                LIVE INTERACTIVE STAGE // HIGH DENSITY WORKBENCH
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => previewControlsRef.current.replay()}
                type="button"
                className="px-3 py-1 bg-[var(--bg-surface)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border-color)] text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3" />
                <span>Replay Effect</span>
              </button>

              <button
                onClick={() => previewControlsRef.current.reset()}
                type="button"
                className="px-3 py-1 bg-[var(--bg-surface)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border-color)] text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Stage</span>
              </button>
            </div>
          </div>

          {/* Render Actual Live Preview Component */}
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] shadow-[6px_6px_0px_0px_var(--border-color)] p-4 sm:p-6 rounded-lg">
            {renderLivePreview()}
          </div>
        </div>

        {/* Polished Code Editor & Implementation Explorer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
                SOURCE CODE EXPLORER // RUNNABLE IMPLEMENTATION
              </span>
            </div>
            <span className="text-xs text-[var(--text-muted)]">
              {detail.files.length} File{detail.files.length > 1 ? 's' : ''} Included
            </span>
          </div>

          <MotionCodeViewer
            files={detail.files}
            title={detail.title}
            ideConfig={detail.ideConfig}
          />
        </div>

        {/* Deep "How It Works" Technical Directive Breakdown */}
        <MotionExplanation
          points={detail.howItWorksPoints}
          title={detail.title}
        />

        {/* Bottom Navigation & Online IDE Callout */}
        <div className="p-6 bg-[var(--bg-surface)] border-2 border-[var(--border-color)] shadow-[4px_4px_0px_0px_var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[var(--accent)]" />
              <span>EXPERIMENTATION OVER CANNED PLUGINS</span>
            </div>
            <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
              Every animation in this lab runs directly in the browser with zero video fallbacks. Copy clean, modular TypeScript source code to drop directly into your project.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onBack}
              type="button"
              className="px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] font-bold text-xs uppercase transition-colors cursor-pointer"
            >
              &larr; Back to Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
