import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

interface InlineErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  code?: string;
}

export const InlineErrorState: React.FC<InlineErrorStateProps> = ({
  title = 'Telemetry Stream Interrupted',
  message = 'Failed to fetch dynamic telemetry from the remote endpoint.',
  onRetry,
  className = '',
  code = 'ERR_API_FETCH',
}) => {
  return (
    <div className={`p-4 sm:p-5 bg-[#120F16] border border-rose-500/40 rounded-xs font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xs bg-rose-500/15 text-rose-400 border border-rose-500/30 shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wider">{title}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-rose-500/20 text-rose-300 rounded-xs font-bold">
              {code}
            </span>
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed max-w-md">
            {message}
          </p>
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onRetry();
          }}
          className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/50 rounded-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
