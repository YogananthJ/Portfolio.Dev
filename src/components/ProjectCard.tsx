import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  ArrowUpRight,
  ExternalLink,
  Bot,
  Trophy,
  Sparkles,
  Layers,
  Activity,
  Cpu,
  Binary,
  GitBranch,
  Eye,
} from 'lucide-react';
import { ProjectItem } from '../types/portfolio';
import { ARCHITECTURE_DATA } from '../data/architectureData';
import { soundFX } from '../utils/soundEffects';

interface ProjectCardProps {
  project: ProjectItem;
  onOpenModal: (project: ProjectItem) => void;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenModal, index }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isSchematicMode, setIsSchematicMode] = useState<boolean>(false);

  // 3D Tilt interaction on pointer movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // max -6 to +6 deg
    const rotateY = ((x - centerX) / centerX) * 6;  // max -6 to +6 deg

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Visual banner illustration based on project ID
  const renderVisualIllustration = () => {
    switch (project.id) {
      case 'vibeathon-restaurant':
        return (
          <div className="w-full h-full bg-[#1A1409] text-amber-200 p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-amber-400 border-b border-amber-500/20 pb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Trophy className="w-3.5 h-3.5" /> Vibeathon 6.0 Solo Track
              </span>
              <span className="text-emerald-400 font-bold">Top 60 Finalist</span>
            </div>
            <div className="my-auto p-2 bg-black/40 border border-amber-500/30 space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/80">Order Triage Pipeline:</span>
                <span className="text-emerald-400 font-bold">0 Drop / Playwright Verified</span>
              </div>
              <div className="text-[10px] text-white/60">Built in 48-hr sprint using Lovable + Claude + Playwright</div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-amber-500/20 text-white/50">
              <span>Stack: Lovable · Claude · Playwright</span>
              <span className="text-amber-300">48h Hackathon</span>
            </div>
          </div>
        );

      case 'cognitive-ai':
        return (
          <div className="w-full h-full bg-[#201019] text-pink-200 p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-pink-400 border-b border-pink-500/20 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> Cognitive Emotion Radar
              </span>
              <span className="text-emerald-400 font-bold">Live on Streamlit</span>
            </div>
            <div className="my-auto space-y-1.5">
              <div className="flex justify-between text-[10px] text-white/80">
                <span>Emotion Trajectory:</span>
                <span className="text-pink-400 font-bold">Friction / Hesitant</span>
              </div>
              <div className="flex justify-between text-[10px] text-white/80">
                <span>Keystroke Pause:</span>
                <span className="text-amber-300 font-bold">850ms Cadence</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 overflow-hidden">
                <div className="w-[78%] h-full bg-pink-500"></div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-pink-500/20 text-white/50">
              <span>Dynamic Prompt Conditioning</span>
              <span className="text-pink-300">Latency &lt;220ms</span>
            </div>
          </div>
        );

      case 'careerpilot-ai':
        return (
          <div className="w-full h-full bg-[#0A1628] text-sky-200 p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-sky-400 border-b border-sky-500/20 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> Autonomous Career Agent
              </span>
              <span className="text-sky-300">Telegram Bot</span>
            </div>
            <div className="my-auto bg-black/40 border border-sky-500/30 p-2.5 space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/80">Target: AI Engineer</span>
                <span className="text-emerald-400 font-bold">Active Mentorship</span>
              </div>
              <p className="text-[10px] text-white/70">
                Autonomous diagnostic questionnaire generates weekly skill gap roadmaps via Telegram.
              </p>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-sky-500/20 text-white/50">
              <span>@CareerPilotAgent2026_bot</span>
              <span className="text-sky-300">24/7 Webhook</span>
            </div>
          </div>
        );

      case 'pdf-rag':
        return (
          <div className="w-full h-full bg-[#181324] text-purple-200 p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-purple-400 border-b border-purple-500/20 pb-2">
              <span className="font-bold">Hybrid Vector RAG Pipeline</span>
              <span className="text-purple-300">Llama 3.1</span>
            </div>
            <div className="my-auto bg-black/40 border border-purple-500/30 p-2.5 space-y-1">
              <div className="flex items-center justify-between text-[9px] text-purple-300">
                <span>CHUNK #BGE-1024</span>
                <span className="text-emerald-400 font-bold">cos_sim: 0.942</span>
              </div>
              <p className="text-[10px] text-white/80 line-clamp-2">
                "Technical specification strict citation verification ensures answers reflect source PDF..."
              </p>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-purple-500/20 text-white/50">
              <span>FAISS + BM25 Hybrid</span>
              <span className="text-purple-300">Retrieval: &lt;180ms</span>
            </div>
          </div>
        );

      case 'resume-parser':
        return (
          <div className="w-full h-full bg-[#0C1A14] text-emerald-200 p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-emerald-400 border-b border-emerald-500/20 pb-2">
              <span className="font-bold">CrewAI Multi-Agent System</span>
              <span className="text-emerald-300">3 Agents</span>
            </div>
            <div className="my-auto space-y-1 text-[10px]">
              <div className="flex justify-between text-white/80">
                <span>Agent 1 (Extractor):</span>
                <span className="text-emerald-400 font-bold">JSON OK</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Agent 2 (Matcher):</span>
                <span className="text-blue-400 font-bold">Score 88%</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Agent 3 (Gap Analyst):</span>
                <span className="text-purple-400 font-bold">Action Plan</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-emerald-500/20 text-white/50">
              <span>Deterministic Output Schema</span>
              <span className="text-emerald-300">Role Delegation</span>
            </div>
          </div>
        );

      case 'wildfire-detection':
        return (
          <div className="w-full h-full bg-[#1F0A10] text-rose-200 p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-rose-400 border-b border-rose-500/20 pb-2">
              <span className="font-bold">DenseNet-121 Multi-Spectral</span>
              <span className="text-rose-300">Satellite Vision</span>
            </div>
            <div className="my-auto bg-black/40 border border-rose-500/30 p-2.5 space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/80">Test Recall on Holdout:</span>
                <span className="text-emerald-400 font-bold">96.4%</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/80">Resolution:</span>
                <span className="text-white/70">30m Multi-Band (SWIR+TIR)</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-rose-500/20 text-white/50">
              <span>Academic Deep Learning</span>
              <span className="text-rose-300">False Alarm: 2.1%</span>
            </div>
          </div>
        );

      case 'loan-approval':
        return (
          <div className="w-full h-full bg-[#18181B] text-amber-200 p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-amber-400 border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Activity className="w-3.5 h-3.5" /> XGBoost Underwriting
              </span>
              <span className="text-emerald-400 font-bold">ROC-AUC: 94.2%</span>
            </div>
            <div className="space-y-1.5 my-auto text-[10px]">
              <div className="flex justify-between text-white/80">
                <span>DTI Ratio Weighting:</span>
                <span className="text-amber-400 font-bold">+12.4% Recall</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Evaluation Baseline:</span>
                <span className="text-white/60">LogReg 81.8% vs XGB 94.2%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/10 text-white/50">
              <span>Dataset: 4,269 Records</span>
              <span className="text-amber-300">TreeSHAP Explainability</span>
            </div>
          </div>
        );

      case 'event-platform':
        return (
          <div className="w-full h-full bg-[#0D1527] text-blue-200 p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-blue-400 border-b border-blue-500/20 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Full-Stack Platform
              </span>
              <span className="text-emerald-400 font-bold">98/100 Lighthouse</span>
            </div>
            <div className="my-auto space-y-1 text-[10px]">
              <div className="flex justify-between text-white/80">
                <span>Authentication:</span>
                <span className="text-blue-300">Clerk Role RBAC</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Payments:</span>
                <span className="text-emerald-400">Stripe Webhooks</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-blue-500/20 text-white/50">
              <span>Dynamic QR Check-in</span>
              <span className="text-blue-300">Idempotent Webhooks</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-[var(--bg-surface)] text-[var(--text-main)] p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] border-b border-[var(--border-color)] pb-2">
              <span className="font-bold">{project.categoryLabel}</span>
              <span>{project.year}</span>
            </div>
            <div className="my-auto text-xs text-[var(--text-muted)]">
              {project.tagline}
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[var(--border-color)] text-[var(--text-muted)]">
              <span>Verified Implementation</span>
              <span>Open Source</span>
            </div>
          </div>
        );
    }
  };

  // Topological Architecture Schematic Blueprint
  const renderSchematicBlueprint = () => {
    const arch = ARCHITECTURE_DATA[project.id];
    const nodes = arch?.nodes ? arch.nodes.slice(0, 3) : [
      { id: 'in', label: 'Trigger / Ingestion', subtitle: 'Event Stream', technologies: ['REST / Webhook'] },
      { id: 'core', label: 'Model Pipeline', subtitle: 'Neural Compute', technologies: project.tags.slice(0, 2) },
      { id: 'out', label: 'Store & Client', subtitle: 'Target Sink', technologies: ['Client UI'] },
    ];

    return (
      <div className="w-full h-full bg-[#06080F] text-zinc-200 p-3.5 flex flex-col justify-between font-mono select-none relative overflow-hidden">
        {/* Subtle schematic background blueprint grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(rgba(225, 29, 72, 0.4) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        />

        {/* Blueprint Header */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 border-b border-white/10 pb-1.5 relative z-10">
          <span className="flex items-center gap-1.5 text-[var(--accent)] font-bold">
            <Binary className="w-3.5 h-3.5" />
            <span>TOPOLOGY BLUEPRINT // X-RAY</span>
          </span>
          <span className="text-emerald-400 font-bold">3 STAGES</span>
        </div>

        {/* Sequential 3-Stage Pipeline with Animated Signal Flow */}
        <div className="my-auto grid grid-cols-3 gap-2 relative z-10 items-center">
          {nodes.map((node, i) => (
            <div
              key={node.id || i}
              className="bg-black/70 border border-white/15 p-2 rounded-xs flex flex-col justify-between h-20 text-[9px] relative group-hover:border-[var(--accent)]/50 transition-colors"
            >
              <div className="flex items-center justify-between text-zinc-400 text-[8px]">
                <span className="text-[var(--accent)] font-bold">S_{i + 1}</span>
                <span className="truncate max-w-[50px]">{node.technologies?.[0] || 'Module'}</span>
              </div>
              <div className="font-bold text-white leading-tight truncate mt-1">
                {node.label}
              </div>
              <div className="text-[8px] text-zinc-400 truncate mt-0.5">
                {node.subtitle || 'Subsystem'}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Telemetry Status */}
        <div className="flex items-center justify-between text-[9px] pt-1.5 border-t border-white/10 text-zinc-400 relative z-10">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>DATAFLOW ACTIVE</span>
          </span>
          <span className="text-zinc-500">LATENCY &lt;140MS</span>
        </div>
      </div>
    );
  };

  const getKindBadgeClass = () => {
    switch (project.projectKind) {
      case 'hackathon':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'academic':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'personal':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
  };

  const getKindBadgeLabel = () => {
    switch (project.projectKind) {
      case 'hackathon':
        return 'Hackathon Project';
      case 'academic':
        return 'Academic Coursework';
      case 'personal':
        return 'Personal Build';
    }
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.35s ease-out',
      }}
      className="project-card-item flex flex-col bg-[var(--bg-card)] border-2 border-[var(--border-color)] shadow-sm hover:border-[var(--accent)] hover:shadow-xl transition-all duration-300 group rounded-xs relative overflow-hidden"
    >
      {/* Subtle interactive hover light reflection */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-30"
          style={{
            background: `radial-gradient(400px circle at 50% 30%, rgba(225, 29, 72, 0.15), transparent 70%)`,
          }}
        />
      )}

      {/* Visual illustration top frame */}
      <div className="h-44 w-full border-b border-[var(--border-color)] overflow-hidden relative group/frame">
        {isSchematicMode ? renderSchematicBlueprint() : renderVisualIllustration()}

        {/* Interactive X-Ray Schematic Lens Switcher */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playPulse();
            setIsSchematicMode((prev) => !prev);
          }}
          type="button"
          className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 bg-black/80 hover:bg-black text-[10px] font-mono text-zinc-200 border border-white/20 hover:border-[var(--accent)] flex items-center gap-1 transition-all cursor-pointer shadow-md rounded-xs"
          title="Toggle between Runtime Simulation and X-Ray Architecture Schematic"
        >
          {isSchematicMode ? (
            <>
              <Eye className="w-3 h-3 text-[var(--accent)]" />
              <span>RUNTIME</span>
            </>
          ) : (
            <>
              <GitBranch className="w-3 h-3 text-emerald-400" />
              <span>X-RAY</span>
            </>
          )}
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
        <div>
          {/* Taxonomy & Category Badges */}
          <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px]">
            <span className={`px-2 py-0.5 border font-bold uppercase ${getKindBadgeClass()}`}>
              {getKindBadgeLabel()}
            </span>
            <span className="text-[var(--text-muted)] font-mono">{project.year}</span>
          </div>

          {/* Project Title */}
          <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
            {project.title}
          </h3>

          <p className="text-xs text-[var(--text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Verified Metrics Strip */}
          <div className="grid grid-cols-2 gap-2 my-4 p-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono">
            {project.metrics.slice(0, 2).map((metric, i) => (
              <div key={i} className="truncate">
                <span className="text-[10px] text-[var(--text-muted)] uppercase block truncate" title={metric.label}>
                  {metric.label}
                </span>
                <span className="font-bold text-[var(--text-main)] block truncate">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] text-[10px] font-mono group-hover:border-[var(--accent)]/30 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2 font-mono text-xs">
          <div className="flex items-center gap-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] hover:text-[var(--accent)] transition-colors"
              title="View GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 text-[11px] bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 font-bold hover:bg-[var(--accent)] hover:text-white transition-colors"
              >
                <span>Live</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <button
            onClick={() => onOpenModal(project)}
            className="flex items-center gap-1 px-3 py-1 bg-[var(--bg-surface)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border-color)] font-bold transition-colors text-[11px] cursor-pointer active:scale-95"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
