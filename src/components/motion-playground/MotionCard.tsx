import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Code2, Play, RotateCcw, Sparkles, Terminal, Layers } from 'lucide-react';
import { MotionExperiment } from './motion-playground.types';
import { MotionCodePanel } from './MotionCodePanel';

import { OrbitingBalls } from './experiments/OrbitingBalls';
import { BouncingBall } from './experiments/BouncingBall';
import { KineticTypography } from './experiments/KineticTypography';
import { MagneticButton } from './experiments/MagneticButton';
import { FloatingSphere3D } from './experiments/FloatingSphere3D';
import { ParticleField } from './experiments/ParticleField';

export interface MotionCardHandle {
  replay: () => void;
  reset: () => void;
  flashHighlight: () => void;
}

interface MotionCardProps {
  experiment: MotionExperiment;
  onCodeToggled?: (isOpen: boolean) => void;
}

export const MotionCard = forwardRef<MotionCardHandle, MotionCardProps>(({ experiment }, ref) => {
  const [isCodeOpen, setIsCodeOpen] = useState<boolean>(false);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const controlsRef = useRef<{ reset: () => void; replay: () => void }>({
    reset: () => {},
    replay: () => {},
  });

  const cardRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => ({
    replay: () => {
      controlsRef.current.replay();
    },
    reset: () => {
      controlsRef.current.reset();
    },
    flashHighlight: () => {
      setIsHighlighted(true);
      controlsRef.current.replay();
      setTimeout(() => setIsHighlighted(false), 2400);
    },
  }));

  const handleRegisterControls = (controls: { reset: () => void; replay: () => void }) => {
    controlsRef.current = controls;
  };

  const renderExperimentPreview = () => {
    switch (experiment.id) {
      case 'orbiting-balls':
        return <OrbitingBalls onRegisterControls={handleRegisterControls} />;
      case 'bouncing-ball':
        return <BouncingBall onRegisterControls={handleRegisterControls} />;
      case 'kinetic-typography':
        return <KineticTypography onRegisterControls={handleRegisterControls} />;
      case 'magnetic-button':
        return <MagneticButton onRegisterControls={handleRegisterControls} />;
      case 'floating-sphere-3d':
        return <FloatingSphere3D onRegisterControls={handleRegisterControls} />;
      case 'particle-field':
        return <ParticleField onRegisterControls={handleRegisterControls} />;
      default:
        return null;
    }
  };

  return (
    <div
      id={`motion-exp-${experiment.id}`}
      ref={cardRef}
      className={`bg-[var(--bg-card)] border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
        isHighlighted
          ? 'border-[var(--accent)] ring-4 ring-[var(--accent)]/40 shadow-[8px_8px_0px_0px_var(--accent)]'
          : 'border-[var(--border-color)] shadow-[4px_4px_0px_0px_var(--border-color)] hover:shadow-[6px_6px_0px_0px_var(--border-color)]'
      }`}
    >
      {/* Top Banner / Card Kicker */}
      <div className="p-3.5 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[var(--accent)] text-white font-mono font-black text-xs">
            EXP_{experiment.number}
          </span>
          <span className="font-mono text-xs text-[var(--text-muted)] font-bold uppercase">
            {experiment.categoryLabel}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => controlsRef.current.replay()}
            type="button"
            className="p-1 bg-[var(--bg-card)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border-color)] text-[var(--text-main)] transition-colors"
            title="Replay sequence"
            aria-label="Replay sequence"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => controlsRef.current.reset()}
            type="button"
            className="p-1 bg-[var(--bg-card)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border-color)] text-[var(--text-main)] transition-colors"
            title="Reset animation"
            aria-label="Reset animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg sm:text-xl font-black text-[var(--text-main)] leading-tight">
              {experiment.title}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">
              {experiment.tagline}
            </p>
          </div>
        </div>

        {/* Live Interactive Preview */}
        <div className="mt-2.5 rounded overflow-hidden">
          {renderExperimentPreview()}
        </div>

        {/* Interaction Hint Banner */}
        <div className="p-2 bg-[var(--bg-surface)] border border-[var(--border-color)]/20 text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
            <span>{experiment.interactionHint}</span>
          </div>
          <button
            onClick={() => setIsCodeOpen(!isCodeOpen)}
            type="button"
            className={`px-2 py-0.5 font-mono font-bold text-[10px] uppercase border transition-colors flex items-center gap-1 cursor-pointer ${
              isCodeOpen
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>{isCodeOpen ? 'Hide Code' : 'View Code'}</span>
          </button>
        </div>

        {/* Expandable Code Panel */}
        {isCodeOpen && (
          <MotionCodePanel
            experiment={experiment}
            onClose={() => setIsCodeOpen(false)}
          />
        )}
      </div>

      {/* Technology Tags Footer */}
      <div className="px-4 py-2.5 bg-[var(--bg-surface)] border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {experiment.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-mono font-semibold text-[var(--text-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <button
          onClick={() => setIsCodeOpen(!isCodeOpen)}
          className="text-xs font-mono font-bold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{isCodeOpen ? 'Close Panel' : 'Inspect Code &rarr;'}</span>
        </button>
      </div>
    </div>
  );
});

MotionCard.displayName = 'MotionCard';
