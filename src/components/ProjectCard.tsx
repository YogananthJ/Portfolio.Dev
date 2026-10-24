import React from 'react';
import { Github, Play, ArrowUpRight, Cpu, Layers, Activity } from 'lucide-react';
import { ProjectItem } from '../types/portfolio';

interface ProjectCardProps {
  project: ProjectItem;
  onOpenModal: (project: ProjectItem) => void;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenModal, index }) => {
  // Bespoke SVG / CSS visualization for each project type
  const renderVisualIllustration = () => {
    switch (project.simulatorConfig.type) {
      case 'loan':
        return (
          <div className="w-full h-full bg-[#18181B] text-[#F5F2EB] p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-white/60 border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Activity className="w-3.5 h-3.5" /> XGBoost Underwriting
              </span>
              <span className="text-emerald-400">ROC-AUC: 94.2%</span>
            </div>
            {/* Feature attribution bar chart visual */}
            <div className="space-y-2 my-auto">
              <div>
                <div className="flex justify-between text-[10px] text-white/70 mb-1">
                  <span>Debt-to-Income Ratio</span>
                  <span className="text-amber-400 font-semibold">+0.34 SHAP</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-xs overflow-hidden">
                  <div className="w-[78%] h-full bg-gradient-to-r from-amber-500 to-red-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-white/70 mb-1">
                  <span>Credit Score Scorecard</span>
                  <span className="text-emerald-400 font-semibold">+0.28 SHAP</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-xs overflow-hidden">
                  <div className="w-[85%] h-full bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-white/70 mb-1">
                  <span>Applicant Annual Income</span>
                  <span className="text-blue-400 font-semibold">+0.19 SHAP</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-xs overflow-hidden">
                  <div className="w-[62%] h-full bg-blue-500"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/10 text-white/50">
              <span>Latency: 22ms</span>
              <span className="text-emerald-400 uppercase font-bold tracking-wider">Classification: Approved</span>
            </div>
          </div>
        );

      case 'food':
        return (
          <div className="w-full h-full bg-[#141E18] text-[#F5F2EB] p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-emerald-400 border-b border-emerald-500/20 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> CNN Object Segmenter
              </span>
              <span>101 Food Classes</span>
            </div>
            {/* Visual bounding box illustration */}
            <div className="relative my-auto border border-dashed border-emerald-400/50 bg-emerald-950/30 p-3 rounded-xs">
              <span className="absolute -top-2 left-2 bg-emerald-500 text-black px-1.5 py-0.2 text-[9px] font-bold">
                BBOX: Quinoa Salad (0.94)
              </span>
              <div className="flex items-center justify-around py-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-white tabular-nums">420</div>
                  <div className="text-[10px] text-white/60">kcal total</div>
                </div>
                <div className="text-center border-l border-emerald-500/20 pl-3">
                  <div className="text-xs font-semibold text-emerald-300">P: 24g</div>
                  <div className="text-xs font-semibold text-amber-300">C: 45g</div>
                  <div className="text-xs font-semibold text-rose-300">F: 14g</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-emerald-500/20 text-white/50">
              <span>OpenCV CLAHE Filter</span>
              <span className="text-emerald-300">Inference: 62ms</span>
            </div>
          </div>
        );

      case 'event':
        return (
          <div className="w-full h-full bg-[#111827] text-[#F5F2EB] p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-blue-400 border-b border-blue-500/20 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Full-Stack Architecture
              </span>
              <span className="text-emerald-400">Stripe Live</span>
            </div>
            {/* Digital ticket badge */}
            <div className="my-auto bg-white/5 border border-white/10 p-3 rounded-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">AI Developer Summit 2026</div>
                <div className="text-[11px] text-white/60 mt-0.5">VIP All-Access Pass</div>
                <div className="text-[10px] text-blue-400 mt-2">ID: TKT-89241-YOG</div>
              </div>
              <div className="w-12 h-12 bg-white p-1 rounded-xs flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="#121212">
                  <path d="M2 2h8v8H2zM4 4v4h4V4zm10-2h8v8h-8zM16 4v4h4V4zM2 14h8v8H2zm2 2v4h4v-4zm10 0h2v2h-2zm4 0h2v4h-2zm-4 4h4v2h-4zm6-2h2v4h-2zm-2-4h2v2h-2z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-blue-500/20 text-white/50">
              <span>Clerk Auth + Stripe Webhooks</span>
              <span className="text-blue-300">React + Flask</span>
            </div>
          </div>
        );

      case 'wildfire':
        return (
          <div className="w-full h-full bg-[#1F1113] text-[#F5F2EB] p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-rose-400 border-b border-rose-500/20 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Satellite Thermal Radar
              </span>
              <span className="text-rose-300">DenseNet-121</span>
            </div>
            {/* Heatmap radar grid */}
            <div className="my-auto relative h-20 bg-black/40 border border-rose-500/30 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:12px_12px] opacity-40"></div>
              {/* Thermal anomaly pulsing ring */}
              <div className="relative flex items-center justify-center">
                <span className="absolute w-12 h-12 rounded-full border border-rose-500/80 animate-ping"></span>
                <span className="absolute w-8 h-8 rounded-full bg-rose-500/30 border border-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-[#F20D26]"></span>
              </div>
              <div className="absolute bottom-1 right-2 text-[9px] text-rose-300">
                Lat: 34.05° N, Lon: -118.25° W
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-rose-500/20 text-white/50">
              <span>Thermal IR Multi-band</span>
              <span className="text-rose-400 font-bold">Hotspot Conf: 96.4%</span>
            </div>
          </div>
        );

      case 'supply-chain':
        return (
          <div className="w-full h-full bg-[#0F1E24] text-[#F5F2EB] p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-cyan-400 border-b border-cyan-500/20 pb-2">
              <span className="font-bold">Logistics Telemetry Engine</span>
              <span>120+ Corridors</span>
            </div>
            {/* Network graph / route bar */}
            <div className="my-auto space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/80">Pacific Maritime (Port LA)</span>
                <span className="text-emerald-400 font-bold">Normal (2.1d)</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-emerald-500"></div>
              </div>
              <div className="flex items-center justify-between text-[10px] pt-1">
                <span className="text-white/80">Suez Canal Route (EU Rail)</span>
                <span className="text-amber-400 font-bold">Delay Risk: High</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="w-4/5 h-full bg-amber-500"></div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-cyan-500/20 text-white/50">
              <span>Safety Stock Optimizer</span>
              <span className="text-cyan-300">Cost: -14.2%</span>
            </div>
          </div>
        );

      case 'rag':
        return (
          <div className="w-full h-full bg-[#181324] text-[#F5F2EB] p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-purple-400 border-b border-purple-500/20 pb-2">
              <span className="font-bold">Vector RAG Architecture</span>
              <span className="text-purple-300">Llama 3.1</span>
            </div>
            {/* Vector embedding passage chunk representation */}
            <div className="my-auto bg-black/40 border border-purple-500/30 p-2.5 rounded-xs space-y-1">
              <div className="flex items-center justify-between text-[9px] text-purple-300">
                <span>CHUNK_ID: doc_page_14.txt</span>
                <span className="text-emerald-400 font-bold">cos_sim: 0.912</span>
              </div>
              <p className="text-[10px] text-white/80 line-clamp-2">
                "Liability clause is activated upon verified service degradation exceeding 99.9% SLO threshold..."
              </p>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-purple-500/20 text-white/50">
              <span>Strict Grounded Citations</span>
              <span className="text-purple-300">Latency: 175ms</span>
            </div>
          </div>
        );

      case 'cognitive':
        return (
          <div className="w-full h-full bg-[#201019] text-[#F5F2EB] p-4 flex flex-col justify-between font-mono select-none">
            <div className="flex items-center justify-between text-[11px] text-pink-400 border-b border-pink-500/20 pb-2">
              <span className="font-bold">Cognitive Cadence Radar</span>
              <span className="text-pink-300">RoBERTa NLP</span>
            </div>
            {/* Hesitation & Emotion Spectrum */}
            <div className="my-auto space-y-1.5">
              <div className="flex justify-between text-[10px] text-white/80">
                <span>Detected Emotion</span>
                <span className="text-pink-400 font-bold">Uncertain / Hesitant</span>
              </div>
              <div className="flex justify-between text-[10px] text-white/80">
                <span>Keystroke Pause Latency</span>
                <span className="text-amber-400 font-bold">840ms (High)</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold bg-pink-950/40 px-2 py-1 border border-pink-500/20">
                Adaptive Tone: Empathetic &amp; Step-by-Step
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-pink-500/20 text-white/50">
              <span>Emotion Polarity</span>
              <span className="text-pink-300">Dynamic Tuner</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-[#121212] flex items-center justify-center text-white/60 font-mono text-xs">
            Interactive Architecture
          </div>
        );
    }
  };

  return (
    <article
      className="group flex flex-col justify-between bg-[#EBE6DC] border-2 border-[#121212] hover:border-[#E11D48] transition-all duration-300 shadow-[6px_6px_0px_0px_#121212] hover:shadow-[8px_8px_0px_0px_#E11D48] relative overflow-hidden"
    >
      {/* Visual illustration top container */}
      <div className="h-44 sm:h-48 border-b-2 border-[#121212] overflow-hidden relative">
        {renderVisualIllustration()}
        
        {/* Subtle index badge */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#121212]/90 backdrop-blur-xs text-[#F5F2EB] text-[10px] font-mono font-bold tracking-wider border border-white/20">
          0{index + 1}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#121212]/60 uppercase tracking-wider mb-2 font-semibold">
            <span className="text-[#E11D48] font-bold">{project.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#121212]/80">{project.metrics[0].label}: {project.metrics[0].value}</span>
          </div>

          {/* Project Title */}
          <h3 className="font-display text-xl sm:text-2xl font-black text-[#121212] group-hover:text-[#E11D48] transition-colors leading-tight mb-2">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[#121212]/80 leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Tech Stack - clean unboxed inline elements */}
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-mono text-[#121212]/70 mb-5">
            {project.tags.map((tag, i) => (
              <span key={tag}>
                {tag}
                {i < project.tags.length - 1 && <span className="text-[#121212]/30 ml-2">/</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Action strip */}
        <div className="pt-4 border-t border-[#121212]/15 flex items-center justify-between gap-3">
          <button
            onClick={() => onOpenModal(project)}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#F5F2EB] bg-[#121212] hover:bg-[#E11D48] transition-colors shadow-[2px_2px_0px_0px_#121212]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Live Simulator</span>
          </button>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 p-2 text-xs font-bold text-[#121212] hover:text-[#E11D48] hover:bg-white/40 border border-[#121212]/20 transition-colors"
            title="View GitHub Repository"
            aria-label={`${project.title} GitHub repository`}
          >
            <Github className="w-4 h-4" />
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
