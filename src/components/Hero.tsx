import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  Play,
  Terminal,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Cpu,
  Layers,
  Bot,
  Activity,
  Code2,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useLayout } from '../context/LayoutContext';
import { DigitalVisitingCard } from './DigitalVisitingCard';
import { NeuralPipelineVisualizer } from './hero/NeuralPipelineVisualizer';
import { soundFX } from '../utils/soundEffects';

interface HeroProps {
  onOpenTerminal: () => void;
  onExploreWork: () => void;
  onLaunchSimulator: (projectId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenTerminal,
  onExploreWork,
  onLaunchSimulator,
}) => {
  const { setLayoutMode } = useLayout();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [heroConsoleMode, setHeroConsoleMode] = useState<'pipeline' | 'code'>('pipeline');
  const [activeSnippetTab, setActiveSnippetTab] = useState<'agent' | 'rag' | 'cognitive'>('agent');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simOutput, setSimOutput] = useState<string | null>(null);

  // Live IST Clock & Telemetry
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        setCurrentTime(`${timeStr} IST`);
      } catch {
        setCurrentTime(now.toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Interactive Particle Grid & Constellation Canvas
  // Interactive Latent Vector Space & Synapse Projection Field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 4 Semantic Latent Clusters
    const clusterDefinitions = [
      {
        name: 'AGENTIC_ORCHESTRATION',
        centerFactor: { x: 0.22, y: 0.32 },
        color: '#E11D48',
        labels: ['CrewAI Multi-Agent', 'AST Token Stream', 'Role Matcher', 'Task Delegation'],
      },
      {
        name: 'DENSE_VECTOR_RAG',
        centerFactor: { x: 0.78, y: 0.28 },
        color: '#38BDF8',
        labels: ['FAISS Index', 'BGE-Large 1024d', 'Cosine Proximity', 'Strict Citation'],
      },
      {
        name: 'FULLSTACK_REACTIVE',
        centerFactor: { x: 0.26, y: 0.72 },
        color: '#818CF8',
        labels: ['React 19 Hooks', 'FastAPI Proxy', 'Idempotent Webhooks', 'Stripe & Clerk'],
      },
      {
        name: 'DEEP_LEARNING_VISION',
        centerFactor: { x: 0.76, y: 0.75 },
        color: '#34D399',
        labels: ['DenseNet-121', 'Thermal Infrared', 'SWIR Multi-Spectral', 'CLAHE Normalization'],
      },
    ];

    interface LatentNode {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      radius: number;
      label: string;
      clusterIndex: number;
      color: string;
    }

    const nodes: LatentNode[] = [];
    clusterDefinitions.forEach((cluster, cIdx) => {
      const cx = width * cluster.centerFactor.x;
      const cy = height * cluster.centerFactor.y;

      cluster.labels.forEach((label, lIdx) => {
        const angle = (lIdx / cluster.labels.length) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 35 + Math.random() * 55;
        const nx = cx + Math.cos(angle) * dist;
        const ny = cy + Math.sin(angle) * dist;

        nodes.push({
          x: nx,
          y: ny,
          baseX: nx,
          baseY: ny,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: lIdx === 0 ? 3.5 : 2.2,
          label,
          clusterIndex: cIdx,
          color: cluster.color,
        });
      });
    });

    let mouseX = -1000;
    let mouseY = -1000;
    const ripples: { x: number; y: number; r: number; maxR: number; alpha: number }[] = [];

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const onCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      ripples.push({ x: clickX, y: clickY, r: 5, maxR: 160, alpha: 0.75 });
      soundFX.playClick(680);
    };

    canvas.parentElement?.addEventListener('mousemove', onMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onCanvasClick);

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Subtle tech background grid
      const gridSize = 48;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw Click Ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rp = ripples[r];
        rp.r += 3.5;
        rp.alpha *= 0.94;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(225, 29, 72, ${rp.alpha * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (rp.r >= rp.maxR || rp.alpha < 0.02) {
          ripples.splice(r, 1);
        }
      }

      // Draw Cluster Core Halos
      clusterDefinitions.forEach((cluster) => {
        const cx = width * cluster.centerFactor.x;
        const cy = height * cluster.centerFactor.y;
        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 80);
        grad.addColorStop(0, `${cluster.color}15`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 80, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update Nodes Position with organic Brownian float
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx + Math.sin(time + i) * 0.15;
        n.y += n.vy + Math.cos(time + i * 0.8) * 0.15;

        // Soft elastic tethering to origin baseX/baseY
        const dxBase = n.baseX - n.x;
        const dyBase = n.baseY - n.y;
        n.vx += dxBase * 0.008;
        n.vy += dyBase * 0.008;
        n.vx *= 0.96;
        n.vy *= 0.96;

        // Pointer proximity & vector repulsion
        const dxMouse = mouseX - n.x;
        const dyMouse = mouseY - n.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);
        if (distMouse < 140) {
          const force = (1 - distMouse / 140) * 1.8;
          n.x -= (dxMouse / (distMouse || 1)) * force;
          n.y -= (dyMouse / (distMouse || 1)) * force;
        }

        // Intra-cluster connecting rays
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          if (n.clusterIndex === n2.clusterIndex) {
            const dx = n.x - n2.x;
            const dy = n.y - n2.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 130) {
              const alpha = (1 - dist / 130) * 0.3;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.strokeStyle = `${n.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        // Draw Node
        const isHoveredNode = distMouse < 55;
        ctx.beginPath();
        ctx.arc(n.x, n.y, isHoveredNode ? n.radius * 1.6 : n.radius, 0, Math.PI * 2);
        ctx.fillStyle = isHoveredNode ? '#FFFFFF' : n.color;
        ctx.fill();

        // Node Label Annotation when hovered or close
        if (distMouse < 85) {
          ctx.font = '600 9px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.fillText(n.label, n.x + 8, n.y + 3);

          // Dynamic cosine similarity tag
          const sim = (0.91 + (1 - distMouse / 85) * 0.08).toFixed(3);
          ctx.font = '500 7.5px "JetBrains Mono", monospace';
          ctx.fillStyle = n.color;
          ctx.fillText(`cos_θ: ${sim}`, n.x + 8, n.y + 13);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.parentElement?.removeEventListener('mousemove', onMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onCanvasClick);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const codeSnippets = {
    agent: `# CrewAI Multi-Agent Task Orchestration
from crewai import Agent, Task, Crew, Process

extractor = Agent(
    role="Resume Extractor",
    goal="Parse structured competencies from candidate text",
    backstory="Deterministic AST entity parser specialized in technical resumes"
)
matcher = Agent(
    role="Semantic Role Matcher",
    goal="Score candidate alignment against job requisitions",
    backstory="Evaluates vector distances and foundational skillset bounds"
)
crew = Crew(agents=[extractor, matcher], process=Process.sequential)
result = crew.kickoff()`,
    rag: `# Hybrid Vector Retrieval (FAISS + BM25)
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-large-en-v1.5")
vectorstore = FAISS.load_local("index_faiss", embeddings)

def retrieve_grounded_chunks(query: str, top_k=3):
    docs = vectorstore.similarity_search_with_score(query, k=top_k)
    # Cosine threshold prevents hallucinations
    return [d[0] for d in docs if d[1] >= 0.88]`,
    cognitive: `# Adaptive Cadence & Sentiment Modulator
from transformers import pipeline

sentiment_pipe = pipeline("text-classification", model="roberta-base-go_emotions")

def adapt_system_prompt(user_text: str, cadence_pause_ms: int):
    emotion = sentiment_pipe(user_text)[0]["label"]
    if cadence_pause_ms > 700 or emotion in ["confusion", "annoyance"]:
        return "Tone: Step-by-step empathetic guidance with simplified analogies."
    return "Tone: Concise senior engineering response."`,
  };

  const handleRunSimulator = () => {
    soundFX.playPulse();
    setIsSimulating(true);
    setSimOutput('Initializing execution runtime...');
    setTimeout(() => {
      soundFX.playChime();
      if (activeSnippetTab === 'agent') {
        setSimOutput('✓ Agents [Extractor, Matcher] dispatched\n✓ AST Entities extracted: 14 skills\n✓ Role alignment score: 94.2% match');
      } else if (activeSnippetTab === 'rag') {
        setSimOutput('✓ Loaded BGE-Large embeddings (1024 dims)\n✓ Hybrid search: 3 chunks retrieved\n✓ Grounded cosine similarity: 0.942');
      } else {
        setSimOutput('✓ RoBERTa pipeline active\n✓ Keystroke cadence: 850ms pause detected\n✓ Tone adapted: Empathetic clarification');
      }
      setIsSimulating(false);
    }, 900);
  };

  return (
    <section
      id="overview"
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-[var(--bg-canvas)] pt-6 pb-12 select-none"
    >
      {/* Dynamic Background Particle & Geometric Grid Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0"
      />

      {/* Top Telemetry Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 z-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 font-bold text-[#E11D48]">
              <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping"></span>
              ENGINEERING RADAR
            </span>
            <span className="text-white/20">/</span>
            <span className="text-[var(--text-muted)]">{PERSONAL_INFO.role}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] font-mono">
            <span>{PERSONAL_INFO.location}</span>
            <span className="text-white/20">/</span>
            <span className="font-semibold text-[var(--text-main)] tabular-nums">
              {currentTime || 'India Standard Time'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Center Hero Stage */}
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10 flex-1 flex flex-col justify-center">
        {/* Giant Monolithic Display Headline + Avatar Lockup */}
        <div className="relative mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            >
              <div className="text-[11px] font-mono tracking-widest text-[var(--accent)] uppercase font-bold mb-2 flex items-center gap-2">
                <span className="inline-block w-4 h-px bg-[var(--accent)]"></span>
                <span>AI Engineer · Full-Stack Developer · Automation Specialist</span>
              </div>

              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[104px] leading-[0.88] tracking-tight uppercase text-[var(--text-main)] drop-shadow-sm">
                YOGANANTH
              </h1>

              {/* Verified Specialization Pills (Rendered as clean unboxed typography with dot separators) */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm font-semibold text-[var(--text-muted)] mt-4 max-w-2xl font-mono">
                <span>Multi-Agent Orchestration (CrewAI)</span>
                <span className="text-[var(--accent)] font-bold">·</span>
                <span>Hybrid Vector RAG</span>
                <span className="text-[var(--accent)] font-bold">·</span>
                <span>Vibeathon 6.0 Top 60 Finalist</span>
                <span className="text-[var(--accent)] font-bold">·</span>
                <span>Certified Claude Developer</span>
              </div>
            </motion.div>

            {/* Interactive Digital Visiting Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative shrink-0 flex items-center justify-center self-start lg:self-center z-20"
            >
              <DigitalVisitingCard />
            </motion.div>
          </div>
        </div>

        {/* Hero Split: Bio + Interactive Code Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-4">
          {/* Left Column: Biography & Action Cluster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="lg:col-span-6 flex flex-col justify-between bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-6 sm:p-8 shadow-sm rounded-xs relative group"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                Developer Profile &amp; Mission
              </div>
              <p className="text-sm sm:text-base text-[var(--text-main)] leading-relaxed mb-4 font-medium">
                {PERSONAL_INFO.bio}
              </p>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400 mb-4 font-mono leading-relaxed">
                {PERSONAL_INFO.statusNote}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onExploreWork}
                  type="button"
                  className="flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[var(--accent)] hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer font-mono"
                >
                  <span>Explore 10 Projects</span>
                  <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                </button>

                <a
                  href="#architecture"
                  className="flex items-center gap-1.5 px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--bg-surface)] hover:border-[var(--accent)] border border-[var(--border-color)] transition-all active:scale-95 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Architecture</span>
                </a>

                <button
                  onClick={onOpenTerminal}
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--bg-surface)] hover:border-[var(--accent)] border border-[var(--border-color)] transition-all active:scale-95 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>CLI (⌘K)</span>
                </button>
              </div>

              {/* Social and Direct Email Touchpoints */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)] text-xs font-mono">
                <div className="flex items-center gap-3">
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </div>

                <button
                  onClick={handleCopyEmail}
                  type="button"
                  className="flex items-center gap-1.5 text-[var(--text-main)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-bold">Email Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>{PERSONAL_INFO.email}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Neural Architecture & Code Laboratory */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            className="lg:col-span-6 flex flex-col justify-between"
          >
            {/* Top Mode Selector Tabs */}
            <div className="flex items-center gap-2 mb-2 font-mono text-xs">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setHeroConsoleMode('pipeline');
                }}
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase transition-colors cursor-pointer border ${
                  heroConsoleMode === 'pipeline'
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Neural Pipeline</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setHeroConsoleMode('code');
                }}
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase transition-colors cursor-pointer border ${
                  heroConsoleMode === 'code'
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code Runtime</span>
              </button>
            </div>

            {/* Mode Content */}
            {heroConsoleMode === 'pipeline' ? (
              <NeuralPipelineVisualizer />
            ) : (
              <div className="bg-[#0a0d14] text-white border-2 border-[var(--border-color)] p-5 sm:p-6 shadow-sm rounded-xs flex flex-col justify-between font-mono relative h-full">
                <div>
                  {/* Header Tab Switcher */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setActiveSnippetTab('agent');
                          setSimOutput(null);
                        }}
                        type="button"
                        className={`px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                          activeSnippetTab === 'agent'
                            ? 'bg-[var(--accent)] text-white shadow-xs'
                            : 'bg-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        CrewAI Agent
                      </button>
                      <button
                        onClick={() => {
                          setActiveSnippetTab('rag');
                          setSimOutput(null);
                        }}
                        type="button"
                        className={`px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                          activeSnippetTab === 'rag'
                            ? 'bg-[var(--accent)] text-white shadow-xs'
                            : 'bg-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        Vector RAG
                      </button>
                      <button
                        onClick={() => {
                          setActiveSnippetTab('cognitive');
                          setSimOutput(null);
                        }}
                        type="button"
                        className={`px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                          activeSnippetTab === 'cognitive'
                            ? 'bg-[var(--accent)] text-white shadow-xs'
                            : 'bg-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        Cognitive AI
                      </button>
                    </div>

                    <span className="text-[10px] text-white/40 uppercase tracking-wider">
                      Python 3.11 Runtime
                    </span>
                  </div>

                  {/* Code Display Frame */}
                  <pre className="text-[11px] sm:text-xs text-white/80 overflow-x-auto p-3 bg-black/60 border border-white/10 rounded-xs leading-relaxed max-h-56">
                    <code>{codeSnippets[activeSnippetTab]}</code>
                  </pre>

                  {/* Execution Feedback Display */}
                  {simOutput && (
                    <div className="mt-3 p-2.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] sm:text-[11px] whitespace-pre-line">
                      {simOutput}
                    </div>
                  )}
                </div>

                {/* Run Simulation Toolbar */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
                  <button
                    onClick={handleRunSimulator}
                    disabled={isSimulating}
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[var(--accent)] text-white transition-colors cursor-pointer text-xs font-bold uppercase tracking-wider"
                  >
                    <Play className={`w-3.5 h-3.5 text-[var(--accent)] ${isSimulating ? 'animate-spin' : ''}`} />
                    <span>{isSimulating ? 'Evaluating...' : 'Simulate Runtime'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const targetId =
                        activeSnippetTab === 'agent'
                          ? 'resume-parser'
                          : activeSnippetTab === 'rag'
                          ? 'pdf-rag'
                          : 'cognitive-ai';
                      onLaunchSimulator(targetId);
                    }}
                    type="button"
                    className="text-[11px] text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <span>Open Full Lab Sandbox</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Scroll Explorer Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col items-center justify-center text-center font-mono text-[11px] text-[var(--text-muted)]"
        >
          <span className="tracking-widest uppercase mb-1">
            EXPLORE 10 ENGINEERED SYSTEMS &amp; SIMULATORS
          </span>
          <ArrowDown className="w-4 h-4 text-[var(--accent)] animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
};
