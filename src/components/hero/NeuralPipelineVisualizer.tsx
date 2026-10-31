import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, RefreshCw, Cpu, Layers, GitBranch, ArrowRight } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

interface PipelineNode {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  color: string;
}

export const NeuralPipelineVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(true);
  const [metrics, setMetrics] = useState({
    latency: '42ms',
    cosineSim: '0.942',
    tokensSec: '84.6 t/s',
    activeAgent: 'RoleMatcher',
  });

  const steps = [
    { name: 'Prompt Input', desc: 'Raw unstructured query tokenized into 768-dim tensor' },
    { name: 'Embedding Space', desc: 'BGE-Large dense vector projection in FAISS index' },
    { name: 'Agent Delegation', desc: 'CrewAI sequential handoff: Extractor → Matcher → Analyst' },
    { name: 'Synthesized Output', desc: 'Deterministic structured JSON with grounded citation' },
  ];

  // Auto-run loop
  useEffect(() => {
    if (!isAutoRunning) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isAutoRunning, steps.length]);

  const nodes: PipelineNode[] = [
    { id: 'input', label: 'User Token Stream', sub: 'Input Tensor', x: 15, y: 50, color: '#F43F5E' },
    { id: 'embed', label: 'BGE-Large Vector', sub: 'Dense Projection', x: 38, y: 25, color: '#8B5CF6' },
    { id: 'faiss', label: 'FAISS Index', sub: 'Cosine Search', x: 38, y: 75, color: '#3B82F6' },
    { id: 'crew', label: 'CrewAI Orchestrator', sub: '3-Agent Task Chain', x: 65, y: 50, color: '#10B981' },
    { id: 'output', label: 'Grounded Output', sub: 'Deterministic JSON', x: 88, y: 50, color: '#F59E0B' },
  ];

  return (
    <div className="w-full bg-[#07090E] border border-white/10 rounded-xs p-4 sm:p-5 font-mono text-xs select-none relative overflow-hidden flex flex-col justify-between h-full min-h-[290px]">
      {/* Background cyber grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header controls & real-time telemetry */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="font-bold text-white text-[11px] uppercase tracking-wider">
            NEURAL PIPELINE RUNTIME
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-white/60">
          <span>Latency: <strong className="text-emerald-400">{metrics.latency}</strong></span>
          <span>Sim: <strong className="text-rose-400">{metrics.cosineSim}</strong></span>
          <button
            onClick={() => {
              soundFX.playClick();
              setIsAutoRunning(!isAutoRunning);
            }}
            type="button"
            className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded-xs transition-colors cursor-pointer text-[9px] font-bold"
          >
            {isAutoRunning ? 'Pause Flow' : 'Auto Flow'}
          </button>
        </div>
      </div>

      {/* Dynamic Visual Pipeline Canvas (SVG) */}
      <div className="relative z-10 my-4 h-36 w-full">
        <svg className="w-full h-full overflow-visible">
          {/* Connection Lines */}
          <line x1="15%" y1="50%" x2="38%" y2="25%" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="15%" y1="50%" x2="38%" y2="75%" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="38%" y1="25%" x2="65%" y2="50%" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="38%" y1="75%" x2="65%" y2="50%" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="65%" y1="50%" x2="88%" y2="50%" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Active pulse traveling along beam */}
          {activeStep === 0 && (
            <motion.circle
              cx="15%"
              cy="50%"
              r="4"
              fill="#F43F5E"
              animate={{ cx: ['15%', '38%'], cy: ['50%', '25%'] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            />
          )}
          {activeStep === 1 && (
            <motion.circle
              cx="38%"
              cy="25%"
              r="4"
              fill="#8B5CF6"
              animate={{ cx: ['38%', '65%'], cy: ['25%', '50%'] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            />
          )}
          {activeStep === 2 && (
            <motion.circle
              cx="65%"
              cy="50%"
              r="4"
              fill="#10B981"
              animate={{ cx: ['65%', '88%'], cy: ['50%', '50%'] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            />
          )}

          {/* Render Nodes */}
          {nodes.map((node, i) => {
            const isHighlighted =
              (activeStep === 0 && (node.id === 'input' || node.id === 'embed')) ||
              (activeStep === 1 && (node.id === 'embed' || node.id === 'faiss')) ||
              (activeStep === 2 && node.id === 'crew') ||
              (activeStep === 3 && node.id === 'output');

            return (
              <g
                key={node.id}
                onClick={() => {
                  setActiveStep(i > 3 ? 3 : i);
                  setIsAutoRunning(false);
                }}
                className="cursor-pointer"
              >
                <circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r={isHighlighted ? '14' : '10'}
                  fill="#0E131F"
                  stroke={isHighlighted ? node.color : 'rgba(255,255,255,0.25)'}
                  strokeWidth={isHighlighted ? '2.5' : '1.5'}
                  style={{
                    filter: isHighlighted ? `drop-shadow(0 0 6px ${node.color})` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
                <circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r="3.5"
                  fill={isHighlighted ? node.color : 'rgba(255,255,255,0.5)'}
                />
                <text
                  x={`${node.x}%`}
                  y={`${node.y > 50 ? node.y + 16 : node.y - 14}%`}
                  textAnchor="middle"
                  fill={isHighlighted ? '#FFFFFF' : 'rgba(255,255,255,0.6)'}
                  fontSize="9.5"
                  fontWeight={isHighlighted ? '700' : '400'}
                  fontFamily="monospace"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Current Stage Explanation Footer */}
      <div className="relative z-10 pt-2.5 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-[10px] text-[var(--accent)] font-bold flex items-center gap-1.5">
            <span>STAGE 0{activeStep + 1}: {steps[activeStep].name}</span>
          </div>
          <p className="text-[10.5px] text-white/70 leading-snug">
            {steps[activeStep].desc}
          </p>
        </div>

        {/* Step Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundFX.playBleep(440 + idx * 80);
                setActiveStep(idx);
                setIsAutoRunning(false);
              }}
              type="button"
              aria-label={`Jump to stage ${idx + 1}`}
              className={`w-5 h-5 rounded-xs flex items-center justify-center font-bold text-[9px] cursor-pointer transition-colors ${
                activeStep === idx
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
