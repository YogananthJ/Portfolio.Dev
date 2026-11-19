import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Linkedin,
  Github,
  Award,
  Terminal,
  FileText,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
} from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, CERTIFICATIONS, SKILL_CATEGORIES } from '../data/portfolioData';
import { soundFX } from '../utils/soundEffects';
import { useDialogA11y } from '../hooks/useDialogA11y';
import { trackResumeDownload } from '../utils/ga4';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);

  useDialogA11y(isOpen, dialogRef, onClose);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundFX.playClick();
    trackResumeDownload('pdf_print', 'resume_modal');
    window.print();
  };

  const generateATSPlainText = () => {
    return `YOGANANTH J
AI Engineer | Full-Stack Developer | Automation Specialist
Email: ${PERSONAL_INFO.email} | Location: ${PERSONAL_INFO.location}
GitHub: ${PERSONAL_INFO.github} | LinkedIn: ${PERSONAL_INFO.linkedin}
Portfolio: https://iam-mjyogananth.pages.dev

------------------------------------------------------------
PROFESSIONAL SUMMARY
------------------------------------------------------------
AI Engineer, Full-Stack Developer, and Automation Specialist with verified expertise in multi-agent orchestration (CrewAI), Retrieval-Augmented Generation (RAG), dense vector embeddings, and full-stack reactive applications (React 19, TypeScript, Python, FastAPI). Proven track record including Top 60 Solo Finalist out of hundreds at Vibeathon 6.0 and 3 official industry certifications from Anthropic and MongoDB.

------------------------------------------------------------
VERIFIED INDUSTRY CERTIFICATIONS
------------------------------------------------------------
* Claude 101 — Anthropic (2025)
  Prompt Engineering, Context Window Management, Safety & Alignment.
* Claude Code 101 — Anthropic (2025)
  Agentic CLI Workflows, Automated Codebase Refactoring, Test-Driven Verification.
* MongoDB Associate Developer — MongoDB (2025)
  Document Modeling, Aggregation Pipelines, Index Optimization, Atlas Vector Search.

------------------------------------------------------------
TECHNICAL SKILLS & COMPETENCIES
------------------------------------------------------------
* AI & Agentic Systems: CrewAI, Llama 3.1, LangChain, FAISS Vector Search, RoBERTa, BGE-Large Embeddings, Prompt Engineering.
* Programming Languages: Python, TypeScript, JavaScript, SQL, HTML5, CSS3.
* Full-Stack Web Development: React 19, Vite, Next.js, FastAPI, Node.js, Express, Tailwind CSS, REST APIs.
* Databases & Cloud: PostgreSQL, MongoDB Atlas, Firebase Firestore, Supabase.
* Tooling & Verification: Git, GitHub Actions, Playwright E2E, Linux/Bash, VS Code.

------------------------------------------------------------
VERIFIED PROJECTS & ENGINEERING BUILDS
------------------------------------------------------------
1. Restaurant Nerve Center (Vibeathon 6.0 — Top 60 Solo Finalist)
   * Autonomous kitchen inventory depletion and order triage system built in 48 hours.
   * Verified with Playwright end-to-end automated testing for zero-drop queue reliability.
   * Tech Stack: Lovable, Claude, ChatGPT, Playwright, GitHub.

2. Cognitive-Aware Conversational AI (Live on Streamlit Cloud)
   * Contextual empathy agent modulating explanation depth based on user keystroke cadence and sentiment.
   * Deployed live: https://cognitive-core-ai.streamlit.app/
   * Tech Stack: Python, Transformers, RoBERTa, Streamlit, FastAPI.

3. CareerPilot AI Agent (Operational on Telegram)
   * Stateful career advisory agent that interviews candidates and generates structured weekly skill roadmaps.
   * Deployed live: Telegram @CareerPilotAgent2026_bot
   * Tech Stack: Python, Telegram Bot API, Claude API, OpenAI.

4. PDF RAG Intelligent Assistant
   * Semantic question-answering pipeline using Llama 3.1 and dense vector embeddings with strict source citation.
   * Tech Stack: Python, Llama 3.1, FAISS, BGE-Large embeddings, LangChain, FastAPI.

5. CrewAI Multi-Agent Resume Parser
   * Autonomous agentic orchestration with 3 specialized roles: Entity Extractor, Role Matcher, and Skill Gap Analyst.
   * Tech Stack: Python, CrewAI, Claude API.

6. Wildfire Hotspot Detection (Deep Learning Coursework)
   * Satellite multi-spectral image classifier leveraging DenseNet-121 to isolate thermal infrared hotspots through smoke.
   * Achieved 96.4% recall on benchmark satellite raster test tiles.
   * Tech Stack: PyTorch, DenseNet-121, OpenCV, GeoTIFF.

7. Loan Approval Prediction (Machine Learning Coursework)
   * Credit risk underwriting classifier comparing Logistic Regression against tuned XGBoost ensembles with TreeSHAP explainability.
   * Achieved 94.2% recall on 4,269 applicant test split (12.4% net recall gain over baseline).
   * Tech Stack: Python, Scikit-Learn, XGBoost, SHAP, SMOTE-NC.

------------------------------------------------------------
ACADEMIC EDUCATION
------------------------------------------------------------
* Bachelor of Engineering in Computer Science & Engineering
  Rigorous foundation in Data Structures, Algorithms, Distributed Systems, Database Engineering, and Machine Learning.
`;
  };

  const handleDownloadATS = () => {
    soundFX.playClick();
    trackResumeDownload('ats_txt', 'resume_modal');
    const text = generateATSPlainText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Yogananth_J_AI_Engineer_Resume_${new Date().getFullYear()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    soundFX.playClick();
    navigator.clipboard.writeText(generateATSPlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto" onClick={onClose}>
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-[#0F0F11] border border-white/20 rounded-xs shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col font-sans focus:outline-none"
        >
          {/* Modal Top Control Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#18181B] border-b border-white/10 shrink-0 font-mono text-xs">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-bold text-white uppercase tracking-wider">
                YOGANANTH J // OFFICIAL ENGINEERING RESUME
              </span>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold rounded-xs">
                VERIFIED 2026
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                type="button"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-xs transition-colors cursor-pointer"
                title="Copy ATS plaintext to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleDownloadATS}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-xs transition-colors cursor-pointer"
                title="Download ATS plaintext resume (.txt)"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>ATS Text</span>
              </button>

              <button
                onClick={handlePrint}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--accent)] hover:opacity-90 text-white font-bold rounded-xs transition-colors cursor-pointer shadow-sm"
                title="Print or save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  onClose();
                }}
                type="button"
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer ml-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Resume Container */}
          <div className="overflow-y-auto p-6 sm:p-10 space-y-8 bg-[#0D0D10] text-zinc-200" id="resume-dossier-printable">
            {/* 1. Header & Identity */}
            <header className="border-b border-white/15 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h2 id="resume-modal-title" className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display">
                    YOGANANTH J
                  </h2>
                  <p className="text-sm sm:text-base font-bold text-[var(--accent)] font-mono mt-1">
                    AI Engineer · Full-Stack Developer · Automation Specialist
                  </p>
                  <p className="text-xs text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                    Building robust multi-agent orchestration systems (CrewAI), verifiable Retrieval-Augmented Generation (RAG) pipelines, and high-performance React/Node web platforms with rigorous engineering discipline.
                  </p>
                </div>

                <div className="space-y-1.5 font-mono text-xs sm:text-right shrink-0 text-zinc-300">
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:text-white underline">
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <Github className="w-3.5 h-3.5 text-emerald-400" />
                    <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
                      github.com/YogananthJ
                    </a>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                    <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
                      linkedin.com/in/yogananth-j
                    </a>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{PERSONAL_INFO.location}</span>
                  </div>
                </div>
              </div>
            </header>

            {/* 2. Industry Certifications */}
            <section className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 border-b border-white/10 pb-1">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verified Industry Certifications</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                {CERTIFICATIONS.map((cert) => (
                  <div key={cert.id} className="p-3 bg-[#16161A] border border-white/10 rounded-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{cert.title}</span>
                      <span className="text-[10px] text-zinc-400">{cert.issueDate}</span>
                    </div>
                    <div className="text-[11px] text-[var(--accent)] font-semibold">{cert.issuer}</div>
                    <p className="text-[10.5px] text-zinc-400 leading-snug">{cert.description}</p>
                    <div className="text-[9.5px] text-emerald-400 font-bold pt-1">
                      Credential ID: {cert.badgeCode}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Core Technical Skills */}
            <section className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2 border-b border-white/10 pb-1">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>Technical Skills Matrix</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#16161A] border border-white/10 rounded-xs space-y-1">
                  <div className="text-sky-300 font-bold uppercase text-[11px]">AI &amp; Multi-Agent</div>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    CrewAI, Llama 3.1, LangChain, FAISS Vector Search, RoBERTa, BGE-Large, Prompt Engineering
                  </p>
                </div>

                <div className="p-3 bg-[#16161A] border border-white/10 rounded-xs space-y-1">
                  <div className="text-emerald-300 font-bold uppercase text-[11px]">Languages</div>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    Python (Scientific &amp; ML), TypeScript, JavaScript, SQL, HTML5, CSS3/Tailwind
                  </p>
                </div>

                <div className="p-3 bg-[#16161A] border border-white/10 rounded-xs space-y-1">
                  <div className="text-purple-300 font-bold uppercase text-[11px]">Full-Stack &amp; Web</div>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    React 19, FastAPI, Node.js, Express, Next.js, REST APIs, Clerk Auth, Stripe Webhooks
                  </p>
                </div>

                <div className="p-3 bg-[#16161A] border border-white/10 rounded-xs space-y-1">
                  <div className="text-amber-300 font-bold uppercase text-[11px]">Data &amp; Tooling</div>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    PostgreSQL, MongoDB Atlas, Firebase Firestore, Playwright E2E, Git, Linux/Bash
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Flagship Projects & Engineering Builds */}
            <section className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between border-b border-white/10 pb-1">
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Featured Engineering Builds &amp; Demonstrators</span>
                </span>
                <span className="text-[10px] text-zinc-400">10 Verified Systems</span>
              </h3>

              <div className="space-y-3.5">
                {/* Project 1: Vibeathon */}
                <div className="p-4 bg-[#16161A] border border-white/10 rounded-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>Restaurant Nerve Center</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono uppercase">
                        Vibeathon 6.0 Solo Finalist
                      </span>
                    </div>
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                      Placement: Top 60 Finalist (48h Sprint)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Autonomous kitchen inventory depletion and order triage cockpit built under a 48-hour hackathon. Integrated automated Playwright test suites ensuring zero order loss under simulated queue surges.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono text-zinc-400 pt-1">
                    <span className="text-white/60">Tech:</span>
                    <span>Lovable · Claude · ChatGPT · Playwright · GitHub Actions</span>
                  </div>
                </div>

                {/* Project 2: Cognitive-Aware Conversational AI */}
                <div className="p-4 bg-[#16161A] border border-white/10 rounded-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>Cognitive-Aware Conversational AI</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono uppercase">
                        Live Deployed
                      </span>
                    </div>
                    <a
                      href="https://cognitive-core-ai.streamlit.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span>cognitive-core-ai.streamlit.app</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Adaptive dialog agent evaluating keystroke latency, hesitation pauses, and sentiment polarity via fine-tuned RoBERTa models to dynamically adapt technical explanation depth and tone in real-time.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono text-zinc-400 pt-1">
                    <span className="text-white/60">Tech:</span>
                    <span>Python · Transformers · RoBERTa · Streamlit Cloud · FastAPI</span>
                  </div>
                </div>

                {/* Project 3: CareerPilot AI Agent */}
                <div className="p-4 bg-[#16161A] border border-white/10 rounded-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>CareerPilot AI Mentor Agent</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/15 text-purple-400 border border-purple-500/30 font-mono uppercase">
                        Live on Telegram
                      </span>
                    </div>
                    <a
                      href="https://t.me/CareerPilotAgent2026_bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span>@CareerPilotAgent2026_bot</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Stateful career guidance agent executing autonomous interviews to identify candidate skill gaps and synthesize weekly milestones via Telegram Bot API and Claude models.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono text-zinc-400 pt-1">
                    <span className="text-white/60">Tech:</span>
                    <span>Python · Telegram Bot API · Claude API · Asyncio</span>
                  </div>
                </div>

                {/* Project 4: Dense Vector RAG & CrewAI Parser */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-[#16161A] border border-white/10 rounded-xs space-y-1.5">
                    <div className="font-bold text-white text-xs">PDF RAG Intelligent Assistant</div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      Semantic document question-answering pipeline using Llama 3.1 and BGE-Large dense vector embeddings with strict source coordinate citation and hallucination guards.
                    </p>
                    <div className="text-[10px] font-mono text-zinc-400">FAISS · BGE-Large · Llama 3.1 · LangChain</div>
                  </div>

                  <div className="p-3.5 bg-[#16161A] border border-white/10 rounded-xs space-y-1.5">
                    <div className="font-bold text-white text-xs">CrewAI Multi-Agent Resume Parser</div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      Agentic pipeline orchestrating 3 autonomous roles: Entity Extractor, Role Matcher, and Skill Gap Analyst producing structured deterministic candidate reports.
                    </p>
                    <div className="text-[10px] font-mono text-zinc-400">CrewAI · Claude API · Python · AST Evaluation</div>
                  </div>
                </div>

                {/* Project 5: Academic Deep Learning & ML */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-[#16161A] border border-white/10 rounded-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">Wildfire Hotspot Detection</span>
                      <span className="font-mono text-[10.5px] text-emerald-400 font-bold">96.4% Recall</span>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      Satellite multi-spectral raster classifier using DenseNet-121 to isolate thermal infrared hotspots through heavy smoke and cloud noise.
                    </p>
                    <div className="text-[10px] font-mono text-zinc-400">PyTorch · DenseNet-121 · OpenCV · GeoTIFF</div>
                  </div>

                  <div className="p-3.5 bg-[#16161A] border border-white/10 rounded-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">Loan Underwriting Prediction</span>
                      <span className="font-mono text-[10.5px] text-emerald-400 font-bold">94.2% Recall</span>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      Credit risk underwriting comparing Logistic Regression against tuned XGBoost ensembles with TreeSHAP explainability on 4,269 applicant test holdout.
                    </p>
                    <div className="text-[10px] font-mono text-zinc-400">Python · Scikit-Learn · XGBoost · TreeSHAP</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Academic Education & Career Status */}
            <section className="space-y-3 border-t border-white/10 pt-4 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase text-zinc-400">Academic Degree</div>
                  <div className="font-bold text-white text-sm">Bachelor of Engineering in Computer Science &amp; Engineering</div>
                  <div className="text-[11px] text-zinc-400">Coursework: Data Structures, Algorithms, Distributed Systems, Deep Learning, Database Systems</div>
                </div>
                <div className="sm:text-right">
                  <div className="text-[10px] uppercase text-emerald-400 font-bold">Candidate Status</div>
                  <div className="text-white font-bold">{PERSONAL_INFO.availability}</div>
                  <div className="text-[10px] text-zinc-400">Ready for 2026 Roles</div>
                </div>
              </div>
            </section>

            {/* 6. Footer Disclaimer & Verification Note */}
            <footer className="pt-4 border-t border-white/10 text-[10px] font-mono text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strictly authentic: Coursework, personal builds, and verified hackathons. Zero commercial misrepresentation.</span>
              </div>
              <div className="text-zinc-500">
                Generated: {new Date().toLocaleDateString()} · Yogananth J Official Portfolio
              </div>
            </footer>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
