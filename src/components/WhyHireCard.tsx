import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  Cpu, 
  ArrowUpRight, 
  CheckCircle2, 
  Rocket, 
  Layers, 
  Mail, 
  Copy, 
  ExternalLink,
  Target,
  Zap,
  TrendingUp,
  Award,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, CERTIFICATIONS } from '../data/portfolioData';

export interface WhyHireCardProps {
  initialTab?: 'why-me' | 'fresher' | 'proof' | 'roadmap';
  queryPrompt: string;
  onRunCommand: (cmd: string) => void;
  onSelectProject?: (projectId: string) => void;
}

export const WhyHireCard: React.FC<WhyHireCardProps> = ({
  initialTab = 'why-me',
  queryPrompt,
  onRunCommand,
  onSelectProject,
}) => {
  const [activeTab, setActiveTab] = useState<'why-me' | 'fresher' | 'proof' | 'roadmap'>(initialTab);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const isFresherQuery = queryPrompt.toLowerCase().includes('fresher');

  return (
    <div className="p-3 sm:p-5 bg-[#121212] border-2 border-emerald-500/80 shadow-[6px_6px_0px_0px_#10B981] space-y-4 text-xs font-mono text-[#F5F2EB]">
      {/* Top Query Header */}
      <div className="border-b border-white/10 pb-3 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
              EXECUTIVE CANDIDATE BRIEFING // HIRING PITCH
            </span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold">
            2026 ENTRY-LEVEL / JUNIOR READY
          </span>
        </div>

        <div className="flex items-center gap-2 text-white/90 text-[11px]">
          <span className="text-[#E11D48] font-bold">&gt;</span>
          <span className="text-white/60">Interpreted Query:</span>
          <span className="text-amber-300 font-bold underline decoration-amber-500/40">"{queryPrompt}"</span>
        </div>

        {/* Transparent Recruiter Notice */}
        <div className="p-2.5 bg-black/50 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white font-bold">Transparent Verification Disclosure:</strong>{' '}
            Yogananth J has <strong>no prior commercial industry employment</strong>. All accomplishments presented are academic coursework, 
            hackathon final placements, self-directed engineering builds, and verified industry credentials.
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('why-me')}
          className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'why-me'
              ? 'bg-[#E11D48] text-white shadow-[2px_2px_0px_0px_#FFFFFF]'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>1. Why Yogananth?</span>
        </button>

        <button
          onClick={() => setActiveTab('fresher')}
          className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'fresher'
              ? 'bg-emerald-600 text-white shadow-[2px_2px_0px_0px_#FFFFFF]'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>2. The Fresher Advantage</span>
        </button>

        <button
          onClick={() => setActiveTab('proof')}
          className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'proof'
              ? 'bg-cyan-600 text-white shadow-[2px_2px_0px_0px_#FFFFFF]'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3. Proof-of-Work (10 Builds)</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'roadmap'
              ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_#FFFFFF]'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>4. 30-60-90 Day Ramp</span>
        </button>
      </div>

      {/* TAB 1: WHY YOGANANTH? */}
      {activeTab === 'why-me' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider">
              CORE PILLARS // WHY YOGANANTH OUT-EXECUTES TRADITIONAL APPLICANTS
            </span>
            <span className="text-white/50 text-[10px]">5 Verifiable Advantages</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {/* Pillar 1 */}
            <div className="p-3 bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-[10px]">
                  01
                </span>
                <span>Competitive 48h Hackathon Finalist</span>
              </div>
              <p className="text-white/80 text-[11px] leading-relaxed">
                Placed as a <strong>Top 60 Finalist at Vibeathon 6.0</strong> (out of 1,500+ participants nationwide). 
                Engineered the <em>Restaurant Nerve Center</em> solo in 48 hours, fully verified with headless Playwright end-to-end automated test suites.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => onRunCommand('project vibeathon-restaurant')}
                  className="text-amber-400 hover:underline text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>[Inspect Vibeathon System Architecture] &rarr;</span>
                </button>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-3 bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px]">
                  02
                </span>
                <span>Live Deployments Operating 24/7</span>
              </div>
              <p className="text-white/80 text-[11px] leading-relaxed">
                Not localhost toys. Publicly deployed applications:
                <br />
                • <strong>Streamlit Cloud:</strong> Cognitive-Aware AI (RoBERTa + keystroke hesitation pacing).
                <br />
                • <strong>Telegram Bot:</strong> @CareerPilotAgent2026_bot (AI Agent with PyPDF &amp; Gemini Flash).
              </p>
              <div className="pt-1 flex gap-2">
                <a
                  href="https://cognitive-core-ai.streamlit.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline text-[10px] font-bold flex items-center gap-0.5"
                >
                  <span>Open Streamlit App</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span className="text-white/30">|</span>
                <a
                  href="https://t.me/CareerPilotAgent2026_bot"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline text-[10px] font-bold flex items-center gap-0.5"
                >
                  <span>Telegram Bot</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-3 bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[10px]">
                  03
                </span>
                <span>Verified Anthropic &amp; MongoDB Credentials</span>
              </div>
              <p className="text-white/80 text-[11px] leading-relaxed">
                Formally certified in <strong>Anthropic Claude 101</strong>, <strong>Anthropic Claude Code 101</strong>, and <strong>MongoDB Associate Developer</strong>. 
                Applies agentic CLI tool-calling, chain-of-thought prompt engineering, and aggregation pipeline indexing.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => onRunCommand('certifications')}
                  className="text-cyan-400 hover:underline text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>[View Verified Credentials &amp; Badge Codes] &rarr;</span>
                </button>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-3 bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <span className="w-5 h-5 rounded bg-rose-500/20 text-[#E11D48] border border-rose-500/40 flex items-center justify-center text-[10px]">
                  04
                </span>
                <span>Real Applied ML Math &amp; Explainability</span>
              </div>
              <p className="text-white/80 text-[11px] leading-relaxed">
                Understands loss curves, confusion matrices, and regulatory auditing. Trained XGBoost models with SMOTE-NC and TreeSHAP waterfall attribution, plus PyTorch DenseNet-121 on NASA Landsat satellite imagery.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => onRunCommand('project loan-approval')}
                  className="text-[#E11D48] hover:underline text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>[Inspect TreeSHAP Risk Model] &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full-Stack Bridging Callout */}
          <div className="p-3 bg-black/60 border border-white/10 space-y-1">
            <div className="text-white font-bold text-xs flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full-Stack Bridging: From Python Tensor Math to React 19 Interfaces</span>
            </div>
            <p className="text-white/75 text-[11px] leading-relaxed">
              Yogananth doesn't just stop at training notebooks. He builds complete operational systems: 
              FastAPI/Flask backends, transactional MongoDB/PostgreSQL schemas, and strict TypeScript 5.8 React 19 frontends with zero layout shift.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: THE FRESHER ADVANTAGE */}
      {activeTab === 'fresher' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 space-y-1">
            <div className="font-bold text-white text-xs flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Direct Answer: Why Hire an AI-Native Fresher Like Yogananth?</span>
            </div>
            <p className="text-white/90 text-[11px] leading-relaxed">
              Hiring an ambitious fresher in 2026 is no longer about accepting lower output. 
              Equipped with modern AI-native agentic development workflows and unencumbered by legacy technical debt, 
              an engineer like Yogananth ramps up faster and delivers outsized value.
            </p>
          </div>

          <div className="space-y-2">
            {/* Advantage 1 */}
            <div className="p-2.5 bg-white/5 border-l-2 border-emerald-400 space-y-1">
              <div className="font-bold text-white text-xs flex items-center justify-between">
                <span>1. Zero Legacy Technical Debt &amp; Unlearning Friction</span>
                <span className="text-emerald-400 text-[10px] font-bold">[Clean Slate]</span>
              </div>
              <p className="text-white/80 text-[11px] leading-relaxed">
                Experienced engineers often bring ingrained habits from legacy frameworks or exhibit reluctance toward modern AI-assisted engineering. 
                Yogananth was forged directly in the modern AI era—agentic CLI tool-calling (Claude Code), prompt engineering, and modern React 19 are his native language.
              </p>
            </div>

            {/* Advantage 2 */}
            <div className="p-2.5 bg-white/5 border-l-2 border-cyan-400 space-y-1">
              <div className="font-bold text-white text-xs flex items-center justify-between">
                <span>2. AI-Native Velocity Multiplier</span>
                <span className="text-cyan-400 text-[10px] font-bold">[3x Output Cadence]</span>
              </div>
              <p className="text-white/80 text-[11px] leading-relaxed">
                By leveraging modern agentic toolchains, test-driven validation, and automated refactoring, 
                Yogananth moves with the throughput traditionally expected from mid-level developers, while retaining rigorous attention to edge cases and unit tests.
              </p>
            </div>

            {/* Advantage 3 */}
            <div className="p-2.5 bg-white/5 border-l-2 border-amber-400 space-y-1">
              <div className="font-bold text-white text-xs flex items-center justify-between">
                <span>3. Maximum Coachability &amp; Architectural Alignment</span>
                <span className="text-amber-400 text-[10px] font-bold">[Zero Ego]</span>
              </div>
              <p className="text-white/80 text-[11px] leading-relaxed">
                No territorial design biases or resistance to feedback. Eager to adopt your team's specific coding guidelines, 
                PR review standards, CI/CD pipelines, and architectural patterns from Day 1.
              </p>
            </div>

            {/* Advantage 4 */}
            <div className="p-2.5 bg-white/5 border-l-2 border-purple-400 space-y-1">
              <div className="font-bold text-white text-xs flex items-center justify-between">
                <span>4. High ROI &amp; Long-Term Engineering Retention</span>
                <span className="text-purple-400 text-[10px] font-bold">[Strategic Value]</span>
              </div>
              <p className="text-white/80 text-[11px] leading-relaxed">
                Offers an entry-level cost profile with steep upside trajectory. Unlike job-hopping candidates, 
                a dedicated fresher is invested in mastering your company's domain problem space and growing with your team.
              </p>
            </div>

            {/* Advantage 5 */}
            <div className="p-2.5 bg-white/5 border-l-2 border-[#E11D48] space-y-1">
              <div className="font-bold text-white text-xs flex items-center justify-between">
                <span>5. Verified Proof of Work Over Generic Resumes</span>
                <span className="text-[#E11D48] text-[10px] font-bold">[10 Documented Builds]</span>
              </div>
              <p className="text-white/80 text-[11px] leading-relaxed">
                Most freshers only show classroom clone projects. Yogananth presents 10 architectural repositories, 
                a national hackathon finalist badge, 3 industry certifications, and interactive mathematical sandboxes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROOF-OF-WORK */}
      {activeTab === 'proof' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold uppercase text-[11px] tracking-wider">
              10 VERIFIED BUILDS // EVIDENCE VS. CLAIMS
            </span>
            <span className="text-white/50 text-[10px]">Click any project to inspect</span>
          </div>

          <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
            {PROJECTS.map((proj, idx) => (
              <div
                key={proj.id}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold text-[10px]">0{idx + 1}.</span>
                    <button
                      onClick={() => onRunCommand(`project ${proj.id}`)}
                      className="font-bold text-white hover:text-emerald-400 underline text-left cursor-pointer"
                    >
                      {proj.title}
                    </button>
                    <span className="text-[9px] px-1.5 py-0.2 bg-white/10 text-white/70 uppercase">
                      {proj.categoryLabel}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/60 line-clamp-1">{proj.tagline}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-amber-400 font-bold text-[10px]">
                    {proj.metrics[0].label}: {proj.metrics[0].value}
                  </span>
                  {proj.simulatorConfig?.hasSimulator && (
                    <button
                      onClick={() => onSelectProject?.(proj.id)}
                      className="px-2 py-0.5 bg-[#E11D48] text-white font-bold text-[9px] uppercase cursor-pointer"
                    >
                      Sandbox
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-black/50 border border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-white/70">Want to inspect technical architecture flows?</span>
            <button
              onClick={() => onRunCommand('architecture')}
              className="text-cyan-400 underline font-bold cursor-pointer"
            >
              Run 'architecture' &rarr;
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: 30-60-90 DAY RAMP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="text-purple-300 font-bold uppercase text-[11px] tracking-wider">
            ONBOARDING PROJECTION // 30-60-90 DAY VALUE DELIVERY
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 30 Days */}
            <div className="p-3 bg-white/5 border border-white/10 space-y-1.5">
              <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Days 1–30: Absorption &amp; Triage</span>
              </div>
              <ul className="text-white/75 text-[10px] space-y-1 list-disc pl-3">
                <li>Complete local &amp; cloud dev setup within hours.</li>
                <li>Audit test suites, identify edge-case coverage gaps.</li>
                <li>Triage and resolve lower-priority backlog bug tickets.</li>
                <li>Ship first tested pull requests in week 1.</li>
              </ul>
            </div>

            {/* 60 Days */}
            <div className="p-3 bg-white/5 border border-white/10 space-y-1.5">
              <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Days 31–60: Feature Velocity</span>
              </div>
              <ul className="text-white/75 text-[10px] space-y-1 list-disc pl-3">
                <li>Independently pick up vertical feature stories.</li>
                <li>Build and test robust REST/FastAPI endpoints.</li>
                <li>Integrate LLM / agentic tool workflows safely.</li>
                <li>Conduct peer code reviews with thoroughness.</li>
              </ul>
            </div>

            {/* 90 Days */}
            <div className="p-3 bg-white/5 border border-white/10 space-y-1.5">
              <div className="text-purple-400 font-bold text-xs flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" />
                <span>Days 61–90: Full Ownership</span>
              </div>
              <ul className="text-white/75 text-[10px] space-y-1 list-disc pl-3">
                <li>End-to-end ownership of service modules.</li>
                <li>Proactively automate developer CLI tooling.</li>
                <li>Optimize database aggregation &amp; caching.</li>
                <li>Serve as a dependable high-throughput contributor.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Recruiter Action Bar */}
      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`mailto:${PERSONAL_INFO.email}?subject=Interview%20Invitation%20for%20Yogananth%20J%20(Entry-Level%20AI%2FFull-Stack)`}
            className="px-3.5 py-1.5 bg-[#E11D48] hover:bg-rose-600 text-white font-bold uppercase text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#FFFFFF] cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Interview Invitation</span>
          </a>

          <button
            onClick={handleCopyEmail}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 cursor-pointer"
          >
            {copiedEmail ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEmail ? 'Email Copied!' : 'Copy Email'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <button
            onClick={() => onRunCommand('projects')}
            className="text-white/70 hover:text-white underline cursor-pointer"
          >
            [View 10 Projects]
          </button>
          <button
            onClick={() => onRunCommand('certifications')}
            className="text-white/70 hover:text-white underline cursor-pointer"
          >
            [Certifications]
          </button>
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-300 underline flex items-center gap-0.5"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
