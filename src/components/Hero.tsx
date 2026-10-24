import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Play, Terminal, Sparkles, CheckCircle2, Columns2 } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useLayout } from '../context/LayoutContext';
import { 
  initHeroAnimations, 
  initFloatingMotion, 
  attachMagneticEffect, 
  attach3DTilt 
} from '../utils/gsapAnimations';
import { DigitalVisitingCard } from './DigitalVisitingCard';

interface HeroProps {
  onOpenTerminal: () => void;
  onExploreWork: () => void;
  onLaunchSimulator: (projectId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal, onExploreWork, onLaunchSimulator }) => {
  const { setLayoutMode } = useLayout();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const consoleRef = useRef<HTMLDivElement | null>(null);
  const btnExploreRef = useRef<HTMLButtonElement | null>(null);
  const btnSimulatorRef = useRef<HTMLButtonElement | null>(null);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'agent' | 'rag' | 'cognitive'>('agent');

  // Live IST Clock
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

  // GSAP Animations Initialization
  useEffect(() => {
    initHeroAnimations(
      containerRef.current,
      headlineRef.current,
      portraitRef.current,
      metaRef.current,
      consoleRef.current
    );

    const cleanupFloat = initFloatingMotion(portraitRef.current);
    const cleanupTilt = attach3DTilt(portraitRef.current, 12);
    const cleanupMagnetic1 = attachMagneticEffect(btnExploreRef.current, 0.2);
    const cleanupMagnetic2 = attachMagneticEffect(btnSimulatorRef.current, 0.2);

    return () => {
      cleanupFloat?.();
      cleanupTilt?.();
      cleanupMagnetic1?.();
      cleanupMagnetic2?.();
    };
  }, []);

  // Interactive Particle Grid Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(Math.floor((width * height) / 14000), 70);
    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.parentElement?.addEventListener('mousemove', onMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', onMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        const dxMouse = mouseX - p1.x;
        const dyMouse = mouseY - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 140) {
          p1.x -= (dxMouse / distMouse) * 1.2;
          p1.y -= (dyMouse / distMouse) * 1.2;
        }

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(18, 18, 18, 0.4)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(18, 18, 18, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
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

  return (
    <section
      ref={containerRef}
      id="overview"
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden paper-grid pt-6 pb-12"
    >
      {/* Background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
      />

      {/* Top Meta Bar */}
      <div ref={metaRef} className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-[#121212]/15 pb-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#E11D48]">
              <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping"></span>
              PORTFOLIO 2026
            </span>
            <span className="text-[#121212]/30">/</span>
            <span className="text-[#121212]/80">{PERSONAL_INFO.role}</span>
          </div>
          <div className="flex items-center gap-4 text-[#121212]/75">
            <span>{PERSONAL_INFO.location}</span>
            <span className="text-[#121212]/30">/</span>
            <span className="font-semibold text-[#121212]">{currentTime || 'India Standard Time'}</span>
          </div>
        </div>
      </div>

      {/* Center Hero Stage */}
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10 flex-1 flex flex-col justify-center">
        {/* Giant Monolithic Display Headline + Avatar Lockup */}
        <div ref={headlineRef} className="relative mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="text-[11px] font-mono tracking-widest text-[var(--accent)] uppercase font-bold mb-2">
                Developer &amp; Aspiring AI Engineer · LLMs · Agents · Web Systems
              </div>
              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[104px] leading-[0.88] tracking-tight uppercase text-[var(--text-main)] select-none">
                YOGANANTH
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base font-semibold text-[var(--text-muted)] mt-3 max-w-2xl">
                <span>Multi-Agent Orchestration (CrewAI)</span>
                <span className="text-[var(--accent)] font-bold">·</span>
                <span>Hybrid Vector RAG</span>
                <span className="text-[var(--accent)] font-bold">·</span>
                <span>Vibeathon 6.0 Top 60 Finalist</span>
                <span className="text-[var(--accent)] font-bold">·</span>
                <span>Certified Claude Developer</span>
              </div>
            </div>

            {/* Interactive Digital Visiting Card (Flips between square photo and vertical business card) */}
            <div
              ref={portraitRef}
              className="relative shrink-0 flex items-center justify-center self-start lg:self-center z-20"
            >
              <DigitalVisitingCard />
            </div>
          </div>
        </div>

        {/* Hero Split: Bio + Interactive Code Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-4">
          {/* Left Column: Biography & Action Cluster */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-6 sm:p-8 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                Developer Profile &amp; Focus
              </div>
              <p className="text-sm sm:text-base text-[var(--text-main)] leading-relaxed mb-4 font-medium">
                {PERSONAL_INFO.bio}
              </p>
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400 mb-4 font-mono">
                {PERSONAL_INFO.statusNote}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  ref={btnExploreRef}
                  onClick={onExploreWork}
                  type="button"
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[var(--accent)] hover:opacity-90 transition-all shadow-sm"
                >
                  <span>Explore 10 Projects</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <a
                  href="#architecture"
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--bg-surface)] hover:border-[var(--accent)] border border-[var(--border-color)] transition-all"
                >
                  <span>Architecture</span>
                </a>

                <button
                  ref={btnSimulatorRef}
                  onClick={() => onLaunchSimulator('cognitive-ai')}
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--bg-surface)] hover:border-[var(--accent)] border border-[var(--border-color)] transition-all"
                >
                  <Play className="w-3 h-3 fill-current text-[var(--accent)]" />
                  <span>AI Labs</span>
                </button>

                <button
                  onClick={() => setLayoutMode('split')}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono font-bold uppercase text-[var(--text-main)] bg-[var(--bg-surface)] hover:border-[var(--accent)] border border-[var(--border-color)] transition-colors"
                  title="Switch to Dual-Pane Split-Screen Workbench"
                >
                  <Columns2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Split View</span>
                </button>
              </div>

              {/* Social and Contact Fast Links */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#121212] bg-[#F5F2EB] hover:bg-[#121212] hover:text-[#F5F2EB] border border-[#121212]/30 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#121212] bg-[#F5F2EB] hover:bg-[#121212] hover:text-[#F5F2EB] border border-[#121212]/30 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
                <button
                  onClick={handleCopyEmail}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#121212] bg-[#F5F2EB] hover:bg-[#121212] hover:text-[#F5F2EB] border border-[#121212]/30 transition-colors"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Mail className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied mjyogananth@gmail.com!' : 'Copy Email'}</span>
                </button>
                <button
                  onClick={onOpenTerminal}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#121212] bg-[#F5F2EB] hover:bg-[#121212] hover:text-[#F5F2EB] border border-[#121212]/30 transition-colors ml-auto"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CLI</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Code Console & Interactive Snippets */}
          <div
            ref={consoleRef}
            className="lg:col-span-6 flex flex-col bg-[#121212] text-[#F5F2EB] border-2 border-[#121212] shadow-[6px_6px_0px_0px_#E11D48] overflow-hidden"
          >
            {/* Console Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1C1C1E] border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block"></span>
                <span className="ml-2 font-mono text-xs text-white/60">yogananth_workspace_v26.py</span>
              </div>
              <div className="flex items-center gap-1">
                {(['agent', 'rag', 'cognitive'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSnippetTab(tab)}
                    type="button"
                    className={`px-2.5 py-1 text-xs font-mono uppercase transition-colors ${
                      activeSnippetTab === tab
                        ? 'bg-[var(--accent)] text-white font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab === 'agent' ? 'AI Agents' : tab === 'rag' ? 'RAG Search' : 'Cognitive'}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 sm:p-6 font-mono text-xs sm:text-[13px] leading-relaxed flex-1 overflow-x-auto text-emerald-400/90 selection:bg-[#E11D48] selection:text-white">
              <pre>
                <code>{codeSnippets[activeSnippetTab]}</code>
              </pre>
            </div>

            {/* Live Telemetry Bar */}
            <div className="px-4 py-3 bg-[#18181A] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-white/70">
              <div className="flex items-center gap-4">
                <span>Model Latency: <strong className="text-white">&lt; 35ms</strong></span>
                <span>Test Precision: <strong className="text-[#E11D48]">94.2%</strong></span>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <span>Branch: main</span>
                <span>·</span>
                <span className="text-emerald-400">All tests passing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Key Metrics Strip */}
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6 z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y-2 border-[#121212] py-4 bg-[#F5F2EB]">
          {PERSONAL_INFO.stats.map((stat, i) => (
            <div key={i} className="px-2 sm:px-4 border-r last:border-r-0 border-[#121212]/15">
              <div className="font-display text-2xl sm:text-3xl font-black text-[#121212] tracking-tight tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#121212]/60 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
