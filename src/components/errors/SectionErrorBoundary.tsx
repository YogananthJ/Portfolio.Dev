import React, { ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';

interface SectionErrorBoundaryProps {
  sectionName: string;
  children: ReactNode;
}

export const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({
  sectionName,
  children,
}) => {
  return (
    <ErrorBoundary
      fallbackRender={(reset) => (
        <section
          aria-label={`${sectionName} recovery`}
          className="py-12 border-t border-[var(--border-color)] bg-[var(--bg-canvas)]"
        >
          <div className="max-w-3xl mx-auto px-4">
            <div
              role="alert"
              className="p-6 bg-[var(--bg-card)] border-2 border-[var(--border-color)] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[var(--text-main)] uppercase tracking-wider">
                    {sectionName} temporarily unavailable
                  </div>
                  <p className="text-[var(--text-muted)] mt-1 leading-relaxed">
                    This section encountered an unexpected display error. The rest of the portfolio remains active.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[var(--accent)] hover:opacity-90 text-white font-bold uppercase tracking-wider transition-opacity cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Section</span>
              </button>
            </div>
          </div>
        </section>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
