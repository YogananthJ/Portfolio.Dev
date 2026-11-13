import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { EmptySearchIllustration } from './illustrations/EmptySearchIllustration';
import { soundFX } from '../../utils/soundEffects';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClear?: () => void;
  clearLabel?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Matching Records Found',
  description = 'Your filter query returned zero neural dossiers in the current index.',
  onClear,
  clearLabel = 'Clear Filters',
  className = '',
}) => {
  return (
    <div className={`py-12 px-4 flex flex-col items-center justify-center text-center font-mono space-y-4 ${className}`}>
      <EmptySearchIllustration />

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          {description}
        </p>
      </div>

      {onClear && (
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onClear();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-[var(--accent)] hover:text-white border border-white/15 hover:border-[var(--accent)] text-zinc-300 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{clearLabel}</span>
        </button>
      )}
    </div>
  );
};
