import React, { useState } from 'react';
import { Copy, Check, X, Code2, BookOpen, Sparkles, Terminal } from 'lucide-react';
import { MotionExperiment } from './motion-playground.types';

interface MotionCodePanelProps {
  experiment: MotionExperiment;
  onClose: () => void;
}

export const MotionCodePanel: React.FC<MotionCodePanelProps> = ({ experiment, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<boolean>(false);

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(experiment.sourceCode);
        setCopied(true);
        setCopyError(false);
        setTimeout(() => setCopied(false), 2200);
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch {
      // Fallback
      try {
        const textArea = document.createElement('textarea');
        textArea.value = experiment.sourceCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        setCopyError(true);
      }
    }
  };

  return (
    <div
      className="mt-3 bg-[#0D0D11] border-2 border-[var(--accent)] shadow-[4px_4px_0px_0px_var(--border-color)] p-4 text-xs font-mono text-[#F5F2EB] space-y-3.5 animate-fadeIn"
      role="region"
      aria-label={`Source code and mechanics for ${experiment.title}`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[var(--accent)]" />
          <span className="font-bold text-white text-xs uppercase tracking-wide">
            {experiment.title} // SOURCE CODE
          </span>
          <span className="px-1.5 py-0.5 bg-white/10 text-white/70 text-[10px] rounded uppercase">
            {experiment.codeLanguage}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            type="button"
            className={`px-3 py-1 font-bold text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white border border-emerald-400'
                : 'bg-[var(--accent)] hover:bg-[#BE123C] text-white border border-white/30'
            }`}
            title="Copy clean implementation to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={onClose}
            type="button"
            className="p-1 text-white/60 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors"
            title="Close code panel"
            aria-label="Close code panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {copyError && (
        <div className="p-2 bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[11px]">
          Could not automatically copy. Please select the code block below and press Ctrl+C / Cmd+C.
        </div>
      )}

      {/* Technique Explanation & Concepts */}
      <div className="p-3 bg-white/5 border border-white/10 space-y-2">
        <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px] uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Animation Architecture &amp; Mechanics</span>
        </div>
        <p className="text-white/80 text-[11px] leading-relaxed">
          {experiment.techniqueExplanation}
        </p>

        <div className="pt-1 border-t border-white/5 space-y-1">
          <span className="text-white/50 text-[10px] uppercase font-bold block">Key Architectural Principles:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-white/80">
            {experiment.keyConcepts.map((concept, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-[var(--accent)] font-bold shrink-0">&gt;</span>
                <span>{concept}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="relative">
        <div className="flex items-center justify-between text-[10px] text-white/40 pb-1">
          <span>Complete Verified Source:</span>
          <span>{experiment.technologies.join(' · ')}</span>
        </div>
        <pre className="p-3 bg-[#050507] border border-white/10 rounded overflow-x-auto text-[11px] text-emerald-400 font-mono leading-relaxed select-all max-h-72 overflow-y-auto">
          <code>{experiment.sourceCode}</code>
        </pre>
      </div>
    </div>
  );
};
