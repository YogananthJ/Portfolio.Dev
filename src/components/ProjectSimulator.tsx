import React, { useState } from 'react';
import { ProjectItem } from '../types/portfolio';
import { 
  Cpu, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Send, 
  Sliders, 
  Bot, 
  FileText, 
  Search,
  Flame,
  UserCheck
} from 'lucide-react';

interface ProjectSimulatorProps {
  project: ProjectItem;
}

export const ProjectSimulator: React.FC<ProjectSimulatorProps> = ({ project }) => {
  // 1. Cognitive AI State
  const [cognitiveInput, setCognitiveInput] = useState<string>(
    'I have been struggling for hours trying to optimize this model convergence and feel really stuck.'
  );
  const [hesitationPause, setHesitationPause] = useState<number>(850); // ms
  const [isAnalyzingCognitive, setIsAnalyzingCognitive] = useState<boolean>(false);

  // 2. CareerPilot AI State
  const [careerRole, setCareerRole] = useState<'ai-engineer' | 'fullstack-dev' | 'mlops'>('ai-engineer');
  const [experienceLevel, setExperienceLevel] = useState<'student' | 'junior' | 'career-switcher'>('student');
  const [weeklyHours, setWeeklyHours] = useState<number>(15);
  const [activeStep, setActiveStep] = useState<number>(1);

  // 3. PDF RAG State
  const [ragQuery, setRagQuery] = useState<string>('What is the context window and token limit of Claude 3.5 Sonnet?');
  const [retrievalTopK, setRetrievalTopK] = useState<number>(3);
  const [ragSearchState, setRagSearchState] = useState<boolean>(false);

  // 4. CrewAI Resume Parser State
  const [selectedResumeProfile, setSelectedResumeProfile] = useState<'student-ml' | 'frontend-dev'>('student-ml');
  const [crewStage, setCrewStage] = useState<number>(3); // 1 = extractor, 2 = matcher, 3 = analyst

  // 5. Wildfire Satellite State
  const [spectralBand, setSpectralBand] = useState<'rgb' | 'swir' | 'thermal'>('thermal');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(80);

  // --- Cognitive AI Logic ---
  const evaluateCognitiveTone = (text: string, pause: number) => {
    const lower = text.toLowerCase();
    const hasStruggle = lower.includes('stuck') || lower.includes('struggling') || lower.includes('fail') || lower.includes('difficult');
    const hasCuriosity = lower.includes('how') || lower.includes('why') || lower.includes('learn') || lower.includes('explain');

    let emotion = 'Neutral Inquisitive';
    let stressScore = 24;
    let adaptedTone = 'Direct & Concise';
    let suggestedResponse = 'Here is the step-by-step breakdown: First verify learning rate decay schedules.';

    if (hasStruggle || pause > 700) {
      emotion = 'Friction / High Hesitation';
      stressScore = 78;
      adaptedTone = 'Empathetic & Guided Breakdown';
      suggestedResponse = "I can see this has been frustrating. Let's step back and debug this together: usually gradient explosion or improper batch scaling is the primary culprit. Let's isolate the loss curve first.";
    } else if (hasCuriosity) {
      emotion = 'Confident Exploration';
      stressScore = 15;
      adaptedTone = 'Deep Technical Deep-Dive';
      suggestedResponse = 'Excellent inquiry. In modern transformer architectures, cross-attention mechanisms operate on key-value caches to preserve multi-head alignments across long sequences.';
    }

    return { emotion, stressScore, adaptedTone, suggestedResponse };
  };

  const cognitiveEval = evaluateCognitiveTone(cognitiveInput, hesitationPause);

  // --- Render by Simulator Type ---
  switch (project.simulatorConfig.type) {
    case 'cognitive-ai':
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-pink-500/10 border border-pink-500/30 text-xs font-mono">
            <span className="text-pink-600 dark:text-pink-400 font-bold flex items-center gap-1.5">
              <Bot className="w-4 h-4" />
              Cognitive Emotion & Cadence Simulator (Client-Side Demo)
            </span>
            {project.simulatorConfig.externalLiveUrl && (
              <a
                href={project.simulatorConfig.externalLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white font-bold transition-colors"
              >
                <span>{project.simulatorConfig.externalLabel || 'Open Live Streamlit App'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-main)] mb-1.5">
                  Input Message Prompt
                </label>
                <textarea
                  value={cognitiveInput}
                  onChange={(e) => setCognitiveInput(e.target.value)}
                  rows={4}
                  className="w-full p-3 text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)]"
                  placeholder="Type a message expressing confidence or frustration..."
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[var(--text-muted)]">Simulated Keystroke Hesitation Pause:</span>
                  <span className="font-bold text-[var(--text-main)]">{hesitationPause} ms</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={hesitationPause}
                  onChange={(e) => setHesitationPause(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] mt-1">
                  <span>Fast / Confident (100ms)</span>
                  <span>Moderate (500ms)</span>
                  <span>Uncertain / Paused (1500ms)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCognitiveInput('I do not understand how this vector math works, everything is failing.');
                    setHesitationPause(1100);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Preset: High Frustration
                </button>
                <button
                  onClick={() => {
                    setCognitiveInput('Explain the mathematical derivation of cross-entropy loss.');
                    setHesitationPause(250);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Preset: Analytical
                </button>
              </div>
            </div>

            <div className="md:col-span-6 bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 space-y-4">
              <div className="text-xs font-mono font-bold uppercase text-[var(--text-main)] border-b border-[var(--border-color)] pb-2 flex items-center justify-between">
                <span>Model Emotion & Tone Output</span>
                <span className="text-emerald-500 font-mono text-[10px] animate-pulse">● EVAL READY</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Detected State</span>
                  <span className="text-xs font-bold text-pink-600 dark:text-pink-400 font-mono mt-0.5 block">
                    {cognitiveEval.emotion}
                  </span>
                </div>
                <div className="p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Cognitive Stress Index</span>
                  <span className="text-xs font-bold text-[var(--text-main)] font-mono mt-0.5 block">
                    {cognitiveEval.stressScore} / 100
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1">
                  Dynamic Prompt Condition Modulation
                </span>
                <span className="text-xs font-bold font-mono text-[var(--text-main)] block mb-2">
                  Tone: {cognitiveEval.adaptedTone}
                </span>
                <div className="p-2.5 bg-[var(--bg-canvas)] border-l-2 border-pink-500 text-xs font-mono text-[var(--text-main)] leading-relaxed">
                  "{cognitiveEval.suggestedResponse}"
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'careerpilot-ai':
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-sky-500/10 border border-sky-500/30 text-xs font-mono">
            <span className="text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1.5">
              <Bot className="w-4 h-4" />
              CareerPilot Autonomous Agent Workflow (Client-Side Simulator)
            </span>
            {project.simulatorConfig.externalLiveUrl && (
              <a
                href={project.simulatorConfig.externalLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold transition-colors"
              >
                <span>{project.simulatorConfig.externalLabel || 'Chat on Telegram (@CareerPilotAgent2026_bot)'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-main)] mb-1.5">
                  Target Career Trajectory
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ai-engineer', 'fullstack-dev', 'mlops'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setCareerRole(role)}
                      className={`p-2 text-xs font-mono font-bold border text-center transition-all ${
                        careerRole === role
                          ? 'bg-sky-500 text-white border-sky-500'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-main)]'
                      }`}
                    >
                      {role === 'ai-engineer' ? 'AI Engineer' : role === 'fullstack-dev' ? 'Full-Stack' : 'MLOps'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-main)] mb-1.5">
                  Candidate Background
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full p-2.5 text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-color)] text-[var(--text-main)]"
                >
                  <option value="student">Computer Science Student / Self-Taught</option>
                  <option value="junior">Junior Developer (0-1 Year)</option>
                  <option value="career-switcher">Non-CS Technical Transitioner</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[var(--text-muted)]">Dedicated Weekly Hours:</span>
                  <span className="font-bold text-[var(--text-main)]">{weeklyHours} hrs/week</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono space-y-2">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Live Bot Integration Note</span>
                <p className="text-[var(--text-muted)]">
                  The real bot runs 24/7 on Telegram receiving webhook events, validating responses, and formatting interactive inline action keyboards.
                </p>
              </div>
            </div>

            <div className="md:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span className="text-xs font-mono font-bold uppercase text-[var(--text-main)]">
                  Autonomous Agent Generated Roadmap
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold">
                  Telegram Bot API Format
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sky-600 dark:text-sky-400">Phase 1: Diagnostic Assessment</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <p className="text-[var(--text-muted)] text-[11px]">
                    Extracted tech baseline for {careerRole.toUpperCase()}: Missing verified RAG architecture & multi-agent orchestration credentials.
                  </p>
                </div>

                <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[var(--text-main)]">Phase 2: 4-Week Action Sprint</span>
                    <span className="text-[10px] text-[var(--text-muted)]">Estimated {weeklyHours * 4} Hours</span>
                  </div>
                  <ul className="text-[11px] text-[var(--text-muted)] space-y-1 mt-2">
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>Week 1-2: Complete Anthropic Claude 101 & build a FAISS dense vector retriever</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>Week 3: Orchestrate 3-agent CrewAI pipeline with deterministic JSON outputs</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>Week 4: Deploy model endpoint to Streamlit Cloud with public URL and verification</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-[var(--bg-card)] border border-emerald-500/30 bg-emerald-500/5">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                    Verified Portfolio Target Output
                  </span>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    A verifiable GitHub repository showcasing unit tests, automated CI/CD checks, and an interactive demo instead of generic tutorial code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'pdf-rag':
      return (
        <div className="space-y-6">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 text-xs font-mono flex items-center justify-between">
            <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Hybrid Vector Search & Citation Retrieval Simulator (Client-Side Demo)
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">BGE-Large + BM25</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-main)] mb-1.5">
                  Semantic Query
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    className="flex-1 p-2.5 text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-color)] text-[var(--text-main)]"
                  />
                  <button
                    onClick={() => setRagSearchState(true)}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-mono font-bold"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-main)] mb-1.5">
                  Top-K Vector Chunks: {retrievalTopK}
                </label>
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={retrievalTopK}
                  onChange={(e) => setRetrievalTopK(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono">
                <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block mb-1">
                  Pre-indexed Corpus Chunk
                </span>
                <p className="text-[11px] text-[var(--text-muted)] italic">
                  "Claude 3.5 Sonnet features a 200,000 token context window, capable of ingesting ~150,000 words or 500 pages of technical documentation with strict grounding..."
                </p>
              </div>
            </div>

            <div className="md:col-span-6 bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span className="font-bold text-[var(--text-main)] uppercase">Retrieved Vectors & Attribution</span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Cosine Similarity: 0.942</span>
              </div>

              <div className="p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
                  <span>CHUNK ID: #doc_section_4B</span>
                  <span className="text-emerald-500 font-bold">Score: 94.2% Match</span>
                </div>
                <p className="text-[11px] text-[var(--text-main)]">
                  "...Claude 3.5 Sonnet operates with an active 200K token window and 8,192 maximum output tokens per single generation..."
                </p>
                <div className="mt-2 text-[10px] text-[var(--text-muted)] border-t border-[var(--border-color)] pt-1 flex justify-between">
                  <span>Citation: Technical Spec, Page 14, ¶3</span>
                  <span className="text-purple-500 font-bold">Grounded</span>
                </div>
              </div>

              <div className="p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)]">
                <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 block mb-1">
                  Synthesized Answer (Llama 3.1)
                </span>
                <p className="text-[11px] text-[var(--text-main)] leading-relaxed">
                  Based on Page 14 of the specification, Claude 3.5 Sonnet supports a 200,000 token context window with up to 8,192 maximum output tokens per request.
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'resume-parser':
      return (
        <div className="space-y-6">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono flex items-center justify-between">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" />
              CrewAI Multi-Agent Delegation Simulator (Client-Side Demo)
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">3 Coordinated Agents</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-main)] mb-1.5">
                  Select Candidate Resume
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedResumeProfile('student-ml')}
                    className={`p-2.5 text-xs font-mono font-bold border text-center transition-all ${
                      selectedResumeProfile === 'student-ml'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)]'
                    }`}
                  >
                    CS Student (ML / AI)
                  </button>
                  <button
                    onClick={() => setSelectedResumeProfile('frontend-dev')}
                    className={`p-2.5 text-xs font-mono font-bold border text-center transition-all ${
                      selectedResumeProfile === 'frontend-dev'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)]'
                    }`}
                  >
                    Frontend Developer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-main)] mb-1.5">
                  Agent Pipeline Stage
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((stage) => (
                    <button
                      key={stage}
                      onClick={() => setCrewStage(stage)}
                      className={`flex-1 py-1.5 text-xs font-mono font-bold border ${
                        crewStage >= stage
                          ? 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border-emerald-500'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)]'
                      }`}
                    >
                      Agent {stage}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono">
                <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block mb-1">Target Job Benchmark</span>
                <span className="text-[var(--text-main)] font-bold">Associate AI Engineer (Entry Level)</span>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Required: Python, PyTorch/TensorFlow, Vector Retrieval (RAG), Git, Agent Orchestration.
                </p>
              </div>
            </div>

            <div className="md:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span className="font-bold text-[var(--text-main)] uppercase">Crew Execution Trace</span>
                <span className="text-[10px] text-emerald-500 font-bold">STATUS: COMPLETED</span>
              </div>

              <div className="p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Agent 1: Resume Extractor</span>
                  <span className="text-[10px] text-[var(--text-muted)]">JSON Output Validated</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Extracted: Python (Advanced), OpenCV, DenseNet-121, React, Scikit-Learn. Academic coursework verified.
                </p>
              </div>

              <div className="p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-600 dark:text-blue-400">Agent 2: Semantic Role Matcher</span>
                  <span className="text-[10px] text-[var(--text-muted)]">Role Similarity: 88%</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Matches: Python & Deep Learning skills align. Missing: Production Kubernetes deployment experience.
                </p>
              </div>

              <div className="p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-purple-600 dark:text-purple-400">Agent 3: Gap Analyst</span>
                  <span className="text-[10px] text-[var(--text-muted)]">Actionable Advice</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Recommendation: Highlight Claude 101 certification and practical Streamlit deployment URL to prove applied capability over theoretical knowledge.
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'wildfire':
      return (
        <div className="space-y-6">
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-xs font-mono flex items-center justify-between">
            <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              Multi-Spectral Satellite Band Visualizer (Academic Research Demo)
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">DenseNet-121</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-main)] mb-1.5">
                  Satellite Spectral Band
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['rgb', 'swir', 'thermal'] as const).map((band) => (
                    <button
                      key={band}
                      onClick={() => setSpectralBand(band)}
                      className={`p-2 text-xs font-mono font-bold border text-center transition-all ${
                        spectralBand === band
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)]'
                      }`}
                    >
                      {band === 'rgb' ? 'Visible RGB' : band === 'swir' ? 'SWIR Band' : 'Thermal TIR'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[var(--text-muted)]">Confidence Threshold:</span>
                  <span className="font-bold text-[var(--text-main)]">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono">
                <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block mb-1">
                  Academic Methodology
                </span>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Trained on 30m multi-band satellite rasters. Thermal Infrared (TIR) channels bypass atmospheric smoke plumes to detect ground thermal signatures.
                </p>
              </div>
            </div>

            <div className="md:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span className="font-bold text-[var(--text-main)] uppercase">Multi-Band Anomaly Detection</span>
                <span className="text-[10px] text-rose-500 font-bold">HOTSPOTS DETECTED: 2</span>
              </div>

              <div className="relative h-44 bg-zinc-900 border border-[var(--border-color)] flex items-center justify-center overflow-hidden">
                {/* Simulated Satellite Tile */}
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundColor: spectralBand === 'rgb' ? '#3f3f46' : spectralBand === 'swir' ? '#18181b' : '#09090b',
                    backgroundImage: 'radial-gradient(circle at 45% 40%, rgba(225,29,72,0.7) 0%, transparent 40%), radial-gradient(circle at 75% 65%, rgba(249,115,22,0.8) 0%, transparent 35%)',
                  }}
                />
                <div className="relative z-10 text-center text-white text-xs font-mono bg-black/60 p-2 border border-white/20">
                  <span className="block font-bold">Band Active: {spectralBand.toUpperCase()}</span>
                  <span className="text-[10px] text-white/70">DenseNet-121 Anomaly Score: 96.4%</span>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-[var(--text-muted)] pt-1">
                <span>Pixel Resolution: 30m</span>
                <span>False Alarm Rate: 2.1%</span>
                <span>Recall on Holdout: 96.4%</span>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">
          This project does not feature an interactive simulator. Inspect the architecture and source repository above.
        </div>
      );
  }
};
