import React from 'react';
import { BookOpen, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

interface HowItWorksPoint {
  title: string;
  description: string;
}

interface MotionExplanationProps {
  points: HowItWorksPoint[];
  title: string;
}

export const MotionExplanation: React.FC<MotionExplanationProps> = ({ points, title }) => {
  return (
    <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] shadow-[4px_4px_0px_0px_var(--border-color)] p-6 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="font-display text-base sm:text-lg font-black uppercase text-[var(--text-main)]">
            HOW IT WORKS // ARCHITECTURE &amp; MECHANICS
          </h3>
        </div>
        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">
          {points.length} Technical Directives
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((point, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                0{idx + 1}
              </span>
              <h4 className="font-bold text-xs text-[var(--text-main)]">
                {point.title}
              </h4>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-7">
              {point.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
