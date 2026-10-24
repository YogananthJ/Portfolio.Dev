import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Terminal, 
  CornerDownLeft, 
  Maximize2, 
  Minimize2, 
  ArrowUpRight, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Layers, 
  Compass,
  FileText
} from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES, TIMELINE, CERTIFICATIONS } from '../data/portfolioData';
import { ARCHITECTURE_DATA } from '../data/architectureData';
import { 
  TERMINAL_THEMES, 
  ASCII_BANNER, 
  NEOFETCH_LOGO, 
  MANIFESTO_PRINCIPLES, 
  CURRENTLY_BUILDING, 
  FUN_FACTS, 
  DEV_QUOTES, 
  PROGRAMMING_JOKES, 
  FORTUNES, 
  SERVICES_LIST, 
  CHANGELOG_ENTRIES,
  ALL_COMMAND_NAMES 
} from '../data/terminalData';
import { TerminalTheme } from '../types/terminal';
import { MatrixRainCanvas } from './MatrixRainCanvas';
import { WhyHireCard } from './WhyHireCard';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onSelectProject,
  onNavigateSection 
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [currentTheme, setCurrentTheme] = useState<TerminalTheme>('default');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isMatrixActive, setIsMatrixActive] = useState<boolean>(false);
  const [sessionStartTime] = useState<number>(Date.now());
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [history, setHistory] = useState<Array<{ id: string; command: string; output: React.ReactNode }>>([
    {
      id: 'init-1',
      command: 'init',
      output: (
        <div className="space-y-1.5 text-xs">
          <pre className="font-mono text-[9px] sm:text-[10px] leading-tight text-emerald-400 select-none overflow-x-auto">
            {ASCII_BANNER}
          </pre>
          <div className="text-white font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>YOGANANTH DEVELOPER COMMAND CENTER [v2.6.2-prod]</span>
          </div>
          <div className="text-white/70">
            Welcome! Type <button onClick={() => runCommand('help')} className="text-[#E11D48] underline font-bold cursor-pointer">help</button> to view all 40+ commands or try <button onClick={() => runCommand('neofetch')} className="text-emerald-400 underline font-bold cursor-pointer">neofetch</button>, <button onClick={() => runCommand('architecture')} className="text-cyan-400 underline font-bold cursor-pointer">architecture</button>, or <button onClick={() => runCommand('matrix')} className="text-emerald-300 underline font-bold cursor-pointer">matrix</button>.
          </div>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const themeConfig = TERMINAL_THEMES[currentTheme] || TERMINAL_THEMES.default;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  // Simple string similarity for fuzzy suggestions
  const findClosestCommand = (input: string): string | null => {
    const clean = input.toLowerCase().trim();
    let closest: string | null = null;
    let minDiff = Infinity;

    for (const cmd of ALL_COMMAND_NAMES) {
      if (cmd.startsWith(clean)) return cmd;
      // Simple character diff
      if (Math.abs(cmd.length - clean.length) <= 3) {
        let diff = 0;
        for (let i = 0; i < Math.max(cmd.length, clean.length); i++) {
          if (cmd[i] !== clean[i]) diff++;
        }
        if (diff < minDiff && diff <= 3) {
          minDiff = diff;
          closest = cmd;
        }
      }
    }
    return closest;
  };

  const handleAutocomplete = () => {
    const current = inputVal.trim().toLowerCase();
    if (!current) return;

    const matches = ALL_COMMAND_NAMES.filter((c) => c.startsWith(current));
    if (matches.length === 1) {
      setInputVal(matches[0]);
    } else if (matches.length > 1) {
      setHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          command: inputVal,
          output: (
            <div className="text-xs text-white/60 space-y-1">
              <div>Suggestions:</div>
              <div className="flex flex-wrap gap-2 text-emerald-400 font-bold">
                {matches.map((m) => (
                  <span key={m} className="cursor-pointer underline" onClick={() => setInputVal(m)}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ),
        },
      ]);
    }
  };

  const runCommand = (cmd: string) => {
    handleCommand(cmd);
  };

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Update command recall history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    // Natural Language Query Normalization & Hiring / Fresher Intent Detection
    const normalizedQuery = trimmed
      .toLowerCase()
      .replace(/[?!.,;:'"()]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const isHireMeQuery = 
      normalizedQuery === 'why should i hire you' ||
      normalizedQuery === 'why should we hire you' ||
      normalizedQuery === 'why hire you' ||
      normalizedQuery === 'why hire me' ||
      normalizedQuery === 'why should i hire' ||
      normalizedQuery === 'why hire' ||
      normalizedQuery === 'why you' ||
      normalizedQuery === 'why me' ||
      cmd === 'whyhire' ||
      cmd === 'why-hire' ||
      cmd === 'why-hire-me' ||
      cmd === 'pitch';

    const isFresherQuery = 
      normalizedQuery === 'why i want to hire an fresher like you' ||
      normalizedQuery === 'why i want to hire a fresher like you' ||
      normalizedQuery === 'why should i hire a fresher and you are a fresher' ||
      normalizedQuery === 'why should i hire a fresher' ||
      normalizedQuery === 'why hire a fresher' ||
      normalizedQuery === 'why hire an fresher' ||
      normalizedQuery === 'why fresher' ||
      normalizedQuery === 'why-fresher' ||
      normalizedQuery === 'fresher' ||
      normalizedQuery === 'hire fresher' ||
      normalizedQuery === 'why hire a fresher when you are a fresher' ||
      cmd === 'fresher' ||
      cmd === 'why-fresher';

    const isGeneralHireFresherMatch = 
      (normalizedQuery.includes('why') && (normalizedQuery.includes('hire') || normalizedQuery.includes('recruit') || normalizedQuery.includes('choose'))) ||
      (normalizedQuery.includes('fresher') && (normalizedQuery.includes('hire') || normalizedQuery.includes('why') || normalizedQuery.includes('want'))) ||
      (cmd === 'why' && (arg.includes('hire') || arg.includes('fresher') || arg.includes('you')));

    if (isHireMeQuery || isFresherQuery || isGeneralHireFresherMatch) {
      const initialTab = isFresherQuery || normalizedQuery.includes('fresher') ? 'fresher' : 'why-me';
      const outputNode = (
        <WhyHireCard
          queryPrompt={trimmed}
          initialTab={initialTab}
          onRunCommand={runCommand}
          onSelectProject={onSelectProject}
        />
      );
      setHistory((prev) => [
        ...prev,
        { id: Math.random().toString(), command: rawCmd, output: outputNode },
      ]);
      setInputVal('');
      return;
    }

    let outputNode: React.ReactNode = null;

    // --- COMMAND DISPATCHER ---
    switch (cmd) {
      // 1. HELP
      case 'help': {
        outputNode = (
          <div className="space-y-4 text-xs font-mono">
            <div className="text-amber-400 font-bold border-b border-white/10 pb-1">
              COMMAND CENTER DIRECTORY // 40+ INTERACTIVE TOOLS
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-emerald-400 font-bold mb-1">PROFILE &amp; IDENTITY:</div>
                <div className="space-y-0.5 text-white/80">
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('whoami')}>whoami</strong> — Summary &amp; credentials</div>
                  <div><strong className="text-emerald-400 cursor-pointer" onClick={() => runCommand('why should i hire you?')}>why should i hire you?</strong> — Candidate pitch &amp; proof</div>
                  <div><strong className="text-emerald-400 cursor-pointer" onClick={() => runCommand('why should i hire a fresher and you are a fresher?')}>why hire a fresher?</strong> — The strategic fresher ROI</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('manifesto')}>manifesto</strong> — Development philosophy</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('timeline')}>timeline</strong> — Developer milestones</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('currently')}>currently</strong> — Active learning &amp; research</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('funfact')}>funfact</strong> — Random developer fact</div>
                </div>
              </div>

              <div>
                <div className="text-cyan-400 font-bold mb-1">PROJECTS &amp; ENGINEERING:</div>
                <div className="space-y-0.5 text-white/80">
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('projects')}>projects</strong> — List 7 deployed systems</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('project loan')}>project &lt;name&gt;</strong> — Deep inspect project</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('featured')}>featured</strong> — Top 3 flagship builds</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('architecture')}>architecture</strong> — System architecture diagram</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('casestudy wildfire')}>casestudy &lt;name&gt;</strong> — Problem/solution breakdown</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('lab')}>lab</strong> — Prototypes &amp; ML sandboxes</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('changelog')}>changelog</strong> — Version history</div>
                </div>
              </div>

              <div>
                <div className="text-pink-400 font-bold mb-1">SKILLS &amp; TOOLBOX:</div>
                <div className="space-y-0.5 text-white/80">
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('skills')}>skills</strong> — Categorized technology matrix</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('stack')}>stack</strong> — Primary daily toolchain</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('ml')}>ml</strong> — Machine learning capabilities</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('webdev')}>webdev</strong> — Full-stack web technologies</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('toolbox')}>toolbox</strong> — Hardware &amp; developer tools</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('roadmap')}>roadmap</strong> — Future technical goals</div>
                </div>
              </div>

              <div>
                <div className="text-purple-400 font-bold mb-1">INTERACTIVE &amp; CREATIVE:</div>
                <div className="space-y-0.5 text-white/80">
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('matrix')}>matrix</strong> — Digital rain terminal stream</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('neofetch')}>neofetch</strong> — System identity report</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('quote')}>quote</strong> — Random developer quote</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('joke')}>joke</strong> — Programming joke</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('theme')}>theme &lt;name&gt;</strong> — Switch terminal themes</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('sudo hire')}>sudo hire</strong> — Root privileges recruitment</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('secret')}>secret</strong> — Easter eggs &amp; hidden flags</div>
                  <div><strong className="text-white cursor-pointer" onClick={() => runCommand('hack')}>hack</strong> — Harmless neural simulation</div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-white/50 pt-2 border-t border-white/10 flex flex-wrap gap-4">
              <span>Navigation: <code className="text-emerald-400">open &lt;section&gt;</code></span>
              <span>Autocomplete: <code className="text-amber-400">Tab</code></span>
              <span>History: <code className="text-cyan-400">Up / Down</code></span>
              <span>Clear: <code className="text-rose-400">clear</code></span>
            </div>
          </div>
        );
        break;
      }

      // 2. PROFILE & IDENTITY
      case 'about':
      case 'whoami': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-emerald-400 font-bold text-sm">{PERSONAL_INFO.name}</div>
            <div className="text-white/70">{PERSONAL_INFO.headline}</div>
            <div className="p-3 bg-white/5 border border-white/10 text-white/85 leading-relaxed">
              {PERSONAL_INFO.bio}
            </div>
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
              {PERSONAL_INFO.statusNote}
            </div>
            <div className="flex flex-wrap gap-4 text-white/60 text-[11px]">
              <span>Location: <strong className="text-white">{PERSONAL_INFO.location}</strong></span>
              <span>Status: <strong className="text-emerald-400">{PERSONAL_INFO.availability}</strong></span>
              <span>Email: <strong className="text-[#E11D48]">{PERSONAL_INFO.email}</strong></span>
            </div>
          </div>
        );
        break;
      }

      case 'certifications': {
        outputNode = (
          <div className="space-y-3 text-xs">
            <div className="text-amber-400 font-bold uppercase tracking-wider">
              VERIFIED INDUSTRY CERTIFICATIONS (3)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.id} className="p-2.5 bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-white/50">
                    <span className="text-[#E11D48] font-bold">{cert.issuer}</span>
                    <span>{cert.issueDate}</span>
                  </div>
                  <div className="font-bold text-white text-xs">{cert.title}</div>
                  <p className="text-[11px] text-white/70">{cert.description}</p>
                  <div className="text-[10px] text-emerald-400 font-mono pt-1">
                    [Code: {cert.badgeCode}]
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;
      }

      case 'education': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-cyan-400 font-bold uppercase tracking-wider">
              ACADEMIC EDUCATION &amp; FOUNDATIONS
            </div>
            <div className="p-3 bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Computer Science &amp; Engineering</span>
                <span className="text-cyan-300 font-mono">India</span>
              </div>
              <p className="text-white/80 leading-relaxed">
                Rigorous grounding in Data Structures, Algorithms, Object-Oriented System Design, Database Systems (RDBMS &amp; Document Store), Machine Learning Foundations, and Deep Learning Architectures.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Data Structures', 'Algorithms', 'Deep Learning', 'Computer Networks', 'Database Engineering'].map((item) => (
                  <span key={item} className="px-2 py-0.5 bg-white/10 text-white/90 text-[10px]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
        break;
      }

      case 'socials': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-emerald-400 font-bold uppercase tracking-wider">
              DEVELOPER CONTACT &amp; VERIFIED SOCIALS:
            </div>
            <div className="space-y-1.5 pl-2">
              <div>
                <span className="text-white/60">GitHub: </span>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-blue-400 underline font-bold">
                  {PERSONAL_INFO.github}
                </a>
              </div>
              <div>
                <span className="text-white/60">LinkedIn: </span>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 underline font-bold">
                  {PERSONAL_INFO.linkedin}
                </a>
              </div>
              <div>
                <span className="text-white/60">Direct Email: </span>
                <a href={`mailto:${PERSONAL_INFO.email}`} className="text-[#E11D48] underline font-bold">
                  {PERSONAL_INFO.email}
                </a>
              </div>
            </div>
          </div>
        );
        break;
      }

      case 'manifesto': {
        outputNode = (
          <div className="space-y-3 text-xs">
            <div className="text-amber-400 font-bold uppercase tracking-wider">
              ENGINEERING MANIFESTO // 4 CORE OPERATING PRINCIPLES
            </div>
            {MANIFESTO_PRINCIPLES.map((item) => (
              <div key={item.title} className="p-2.5 bg-white/5 border-l-2 border-[#E11D48]">
                <div className="font-bold text-white mb-0.5">{item.title}</div>
                <div className="text-white/70 leading-relaxed">{item.body}</div>
              </div>
            ))}
          </div>
        );
        break;
      }

      case 'timeline': {
        outputNode = (
          <div className="space-y-3 text-xs">
            <div className="text-cyan-400 font-bold uppercase tracking-wider">
              DEVELOPER TIMELINE &amp; MILESTONES (HONEST &amp; TRANSPARENT)
            </div>
            {TIMELINE.map((t) => (
              <div key={t.period} className="border-l-2 border-cyan-400 pl-3 py-1 space-y-1">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>{t.title}</span>
                  <span className="text-cyan-300 font-mono">{t.period}</span>
                </div>
                <div className="text-xs text-white/50">{t.subtitle}</div>
                <p className="text-white/80">{t.summary}</p>
                <div className="flex flex-wrap gap-1 text-[10px] text-white/50 pt-1">
                  {t.technologies.join(' · ')}
                </div>
              </div>
            ))}
          </div>
        );
        break;
      }

      case 'currently': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              CURRENT ACTIVE FOCUS &amp; EXPERIMENTS
            </div>
            <ul className="space-y-1.5 pl-2 text-white/80">
              {CURRENTLY_BUILDING.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#E11D48] font-bold">&gt;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
        break;
      }

      case 'funfact': {
        const fact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
        outputNode = (
          <div className="p-3 bg-white/5 border border-amber-500/30 text-xs space-y-1">
            <div className="text-amber-400 font-bold uppercase">Random Developer Fact:</div>
            <div className="text-white/90 font-medium italic">"{fact}"</div>
          </div>
        );
        break;
      }

      // 3. PROJECTS & ENGINEERING
      case 'projects': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-amber-400 font-bold flex items-center justify-between border-b border-white/10 pb-1">
              <span>7 DEPLOYED PRODUCTION SYSTEMS:</span>
              <span className="text-white/50 text-[10px]">Type 'project &lt;name&gt;' for details</span>
            </div>
            <div className="space-y-2">
              {PROJECTS.map((p, i) => (
                <div key={p.id} className="p-2 bg-white/5 hover:bg-white/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white/5">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="text-[#E11D48]">0{i + 1}.</span>
                      <button onClick={() => runCommand(`project ${p.id}`)} className="underline cursor-pointer text-left">
                        {p.title}
                      </button>
                    </div>
                    <div className="text-[11px] text-white/60">{p.tagline}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-emerald-400 font-semibold">{p.metrics[0].label}: {p.metrics[0].value}</span>
                    <button
                      onClick={() => onSelectProject?.(p.id)}
                      className="px-2 py-0.5 bg-[#E11D48] text-white text-[10px] uppercase font-bold"
                    >
                      Simulator
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;
      }

      case 'project': {
        if (!arg) {
          outputNode = (
            <div className="text-xs text-amber-300">
              Please specify a project name or ID. Example: <code className="text-white underline cursor-pointer" onClick={() => runCommand('project loan')}>project loan</code> or <code className="text-white underline cursor-pointer" onClick={() => runCommand('project wildfire')}>project wildfire</code>.
            </div>
          );
          break;
        }

        const found = PROJECTS.find(
          (p) => p.id.includes(arg) || p.title.toLowerCase().includes(arg) || p.category.includes(arg)
        );

        if (!found) {
          outputNode = (
            <div className="text-xs text-rose-400">
              Project matching "{arg}" not found. Type <button onClick={() => runCommand('projects')} className="underline font-bold">projects</button> to view all 7 available systems.
            </div>
          );
        } else {
          outputNode = (
            <div className="p-4 bg-white/5 border border-white/15 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <span className="text-[10px] text-[#E11D48] font-bold uppercase">{found.categoryLabel} // {found.year}</span>
                  <div className="text-sm font-bold text-white">{found.title}</div>
                </div>
                <button
                  onClick={() => onSelectProject?.(found.id)}
                  className="px-2.5 py-1 bg-[#E11D48] text-white text-[10px] font-bold uppercase flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Launch Simulator</span>
                </button>
              </div>

              <p className="text-white/80 leading-relaxed">{found.description}</p>

              <div className="grid grid-cols-3 gap-2 p-2 bg-black/40 border border-white/10 text-center">
                {found.metrics.map((m, i) => (
                  <div key={i}>
                    <div className="text-[10px] text-white/50 uppercase">{m.label}</div>
                    <div className="text-sm font-bold text-emerald-400">{m.value}</div>
                  </div>
                ))}
              </div>

              <div>
                <strong className="text-white block mb-1">Architecture:</strong>
                <p className="text-white/70">{found.architectureOverview}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {found.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-white/10 text-white/90 text-[10px]">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <a href={found.githubUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline flex items-center gap-1">
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <button onClick={() => runCommand(`casestudy ${found.id}`)} className="text-[#E11D48] underline font-bold">
                  View Full Case Study &rarr;
                </button>
              </div>
            </div>
          );
        }
        break;
      }

      case 'featured': {
        const top3 = [PROJECTS[0], PROJECTS[3], PROJECTS[5]]; // Loan, Wildfire, PDF RAG
        outputNode = (
          <div className="space-y-3 text-xs">
            <div className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>FLAGSHIP FEATURED ENGINEERING BUILDS</span>
            </div>
            {top3.map((p) => (
              <div key={p.id} className="p-3 bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white">{p.title}</div>
                  <span className="text-emerald-400 font-bold">{p.metrics[0].label}: {p.metrics[0].value}</span>
                </div>
                <p className="text-white/70 text-[11px]">{p.tagline}</p>
                <div className="pt-1 flex items-center gap-2">
                  <button onClick={() => onSelectProject?.(p.id)} className="text-[#E11D48] underline font-bold text-[10px]">
                    [Run Simulator]
                  </button>
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline text-[10px]">
                    [Inspect Source]
                  </a>
                </div>
              </div>
            ))}
          </div>
        );
        break;
      }

      case 'architecture': {
        const cleanArg = arg.trim().toLowerCase();
        const archEntry = cleanArg
          ? Object.entries(ARCHITECTURE_DATA).find(([k, v]) => k.includes(cleanArg) || v.projectTitle.toLowerCase().includes(cleanArg))
          : null;

        if (archEntry) {
          const [key, arch] = archEntry;
          outputNode = (
            <div className="space-y-3 text-xs font-mono">
              <div className="text-cyan-400 font-bold uppercase flex items-center justify-between border-b border-white/10 pb-1">
                <span>SYSTEM ARCHITECTURE // {arch.projectTitle.toUpperCase()}</span>
                <span className="text-[10px] text-white/50">{arch.nodes.length} Nodes · {arch.edges.length} Flows</span>
              </div>
              <p className="text-white/80">{arch.overview}</p>
              
              <div className="space-y-1.5 p-3 bg-black/50 border border-white/10">
                <span className="text-amber-400 font-bold text-[10px] uppercase block">Component Pipeline:</span>
                {arch.nodes.map((n, i) => (
                  <div key={n.id} className="flex items-start gap-2 text-white/90 text-[11px]">
                    <span className="text-cyan-400 font-bold">{i + 1}.</span>
                    <span><strong>{n.label}</strong> ({n.subtitle}) — <em className="text-white/60">{n.technologies.join(', ')}</em></span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    onNavigateSection?.('architecture');
                    document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Inspect in Visual Explorer &rarr;
                </button>
              </div>
            </div>
          );
        } else {
          outputNode = (
            <div className="space-y-3 text-xs font-mono">
              <div className="text-cyan-400 font-bold uppercase flex items-center justify-between border-b border-white/10 pb-1">
                <span>SYSTEM SCHEMATICS DIRECTORY (6 SYSTEMS)</span>
                <span className="text-white/50 text-[10px]">Type 'architecture &lt;name&gt;'</span>
              </div>
              <p className="text-white/80">Select any system to inspect its component nodes and data pipelines:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(ARCHITECTURE_DATA).map(([key, arch]) => (
                  <button
                    key={key}
                    onClick={() => runCommand(`architecture ${key}`)}
                    className="p-2 text-left bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{arch.projectTitle}</div>
                      <div className="text-[10px] text-white/50">{arch.nodes.length} Nodes · {arch.edges.length} Flows</div>
                    </div>
                    <span className="text-cyan-400 font-bold">&rarr;</span>
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    onNavigateSection?.('architecture');
                    document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-cyan-400 underline font-bold"
                >
                  Open Visual Architecture Explorer section &darr;
                </button>
              </div>
            </div>
          );
        }
        break;
      }

      case 'casestudy': {
        const targetProj = PROJECTS.find(p => p.id.includes(arg) || p.title.toLowerCase().includes(arg)) || PROJECTS[0];
        outputNode = (
          <div className="p-4 bg-white/5 border border-white/15 space-y-3 text-xs font-mono">
            <div className="text-amber-400 font-bold uppercase border-b border-white/10 pb-1">
              CASE STUDY: {targetProj.title.toUpperCase()}
            </div>
            <div>
              <span className="text-[#E11D48] font-bold block mb-0.5">1. THE PROBLEM:</span>
              <p className="text-white/80">Traditional black-box machine learning models achieve high accuracy but fail regulatory compliance due to inability to audit adverse decision factors.</p>
            </div>
            <div>
              <span className="text-cyan-400 font-bold block mb-0.5">2. TECHNICAL ARCHITECTURE:</span>
              <p className="text-white/80">{targetProj.architectureOverview}</p>
            </div>
            <div>
              <span className="text-emerald-400 font-bold block mb-0.5">3. MEASURABLE RESULTS:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-white/80">
                {targetProj.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between">
              <span className="text-white/50">Production Grade · Ready for Deployment</span>
              <button onClick={() => onSelectProject?.(targetProj.id)} className="text-[#E11D48] underline font-bold">
                Test in Live Sandbox &rarr;
              </button>
            </div>
          </div>
        );
        break;
      }

      case 'github': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-emerald-400 font-bold">GITHUB PROFILE // OPEN SOURCE CODEBASES:</div>
            <p className="text-white/80">All repositories are documented, licensed, and equipped with test suites:</p>
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#E11D48] text-white border border-white/20 transition-colors font-bold"
            >
              <span>Visit github.com/YogananthJ</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        );
        break;
      }

      case 'live':
      case 'lab': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-amber-400 font-bold uppercase tracking-wider">
              EXPERIMENTAL LAB &amp; LIVE DEMOS
            </div>
            <p className="text-white/80">Click any interactive model to launch its live mathematical simulator:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {PROJECTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProject?.(p.id)}
                  className="p-2 text-left bg-white/5 hover:bg-[#E11D48] hover:text-white transition-colors border border-white/10 flex items-center justify-between"
                >
                  <span className="font-bold text-white">{p.title}</span>
                  <Play className="w-3 h-3 fill-current text-[#E11D48]" />
                </button>
              ))}
            </div>
          </div>
        );
        break;
      }

      case 'changelog': {
        outputNode = (
          <div className="space-y-3 text-xs">
            <div className="text-cyan-400 font-bold uppercase">PORTFOLIO &amp; SYSTEM CHANGELOG:</div>
            {CHANGELOG_ENTRIES.map((entry) => (
              <div key={entry.version} className="border-l-2 border-white/20 pl-3 space-y-1">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>{entry.version}</span>
                  <span className="text-white/50 text-[11px]">{entry.date}</span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-white/70">
                  {entry.changes.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            ))}
          </div>
        );
        break;
      }

      // 4. SKILLS & KNOWLEDGE
      case 'skills': {
        outputNode = (
          <div className="space-y-3 text-xs">
            <div className="text-amber-400 font-bold uppercase border-b border-white/10 pb-1">
              VERIFIED TECHNICAL SKILLS MATRIX:
            </div>
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="text-purple-300 font-bold">{cat.category}:</div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((s) => (
                    <span key={s.name} className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/90 text-[11px]">
                      {s.name} <span className="text-emerald-400">({s.level})</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        break;
      }

      case 'stack': {
        outputNode = (
          <div className="p-3 bg-white/5 border border-white/15 space-y-2 text-xs">
            <div className="text-emerald-400 font-bold uppercase">PRIMARY DAILY-DRIVER STACK:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-white/90">
              <div className="p-2 bg-black/40 border border-white/10"><strong className="text-white block">Core AI</strong>Python, PyTorch, XGBoost, Scikit-learn</div>
              <div className="p-2 bg-black/40 border border-white/10"><strong className="text-white block">GenAI &amp; NLP</strong>Llama 3.1, LangChain, FAISS, RoBERTa</div>
              <div className="p-2 bg-black/40 border border-white/10"><strong className="text-white block">Frontend</strong>React 19, TypeScript, Tailwind CSS, Motion</div>
              <div className="p-2 bg-black/40 border border-white/10"><strong className="text-white block">Backend</strong>FastAPI, Flask, Node.js, PostgreSQL</div>
            </div>
          </div>
        );
        break;
      }

      case 'ml': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-[#E11D48] font-bold uppercase">MACHINE LEARNING &amp; COMPUTER VISION FOCUS:</div>
            <p className="text-white/80">Experience across both statistical ensembles and deep convolutional architectures:</p>
            <ul className="list-disc pl-4 space-y-1 text-white/80">
              <li><strong>DenseNet-121 / CNNs:</strong> Satellite multi-spectral band anomaly detection and food calorie volume estimation.</li>
              <li><strong>Gradient Boosting:</strong> High-precision credit underwriting using XGBoost with SMOTE-NC and TreeSHAP.</li>
              <li><strong>Retrieval-Augmented Generation:</strong> Hybrid BM25 + dense vector embeddings using BGE-Large and Llama 3.1.</li>
              <li><strong>Cognitive NLP:</strong> Emotion polarity and typing hesitation cadence tracking using fine-tuned RoBERTa.</li>
            </ul>
          </div>
        );
        break;
      }

      case 'webdev': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-cyan-400 font-bold uppercase">FULL-STACK WEB DEVELOPMENT CAPABILITIES:</div>
            <p className="text-white/80">Modern architectures emphasizing performance, zero layout shift, and robust type safety:</p>
            <ul className="list-disc pl-4 space-y-1 text-white/80">
              <li><strong>React 19 &amp; Vite:</strong> Component modularity, custom hooks, and high-framerate canvas integrations.</li>
              <li><strong>TypeScript 5.8:</strong> Strict type constraints, zero implicit anys, and clean shared interface contracts.</li>
              <li><strong>Tailwind CSS:</strong> Anti-slop design discipline, fluid responsive typography, and tactile paper styling.</li>
              <li><strong>Authentication &amp; Payments:</strong> Multi-tenant Clerk Auth, role-based access, and Stripe webhook pipelines.</li>
            </ul>
          </div>
        );
        break;
      }

      case 'toolbox': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-amber-400 font-bold uppercase">DEVELOPER TOOLBOX &amp; ENVIRONMENT:</div>
            <div className="text-white/80 space-y-1">
              <div>* <strong>Editor:</strong> VS Code / Neovim with Vim keybindings &amp; JetBrains Mono</div>
              <div>* <strong>Shell &amp; OS:</strong> Zsh, Bash, Linux / macOS environment</div>
              <div>* <strong>VCS:</strong> Git, GitHub Actions CI/CD workflows</div>
              <div>* <strong>Automation:</strong> Google Apps Script, Python Web Scraping &amp; Cron Webhooks</div>
            </div>
          </div>
        );
        break;
      }

      case 'learning':
      case 'roadmap': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-purple-300 font-bold uppercase">TECHNICAL ROADMAP // 2026 HORIZON:</div>
            <ul className="list-disc pl-4 space-y-1 text-white/80">
              <li>Deploying quantized local models via WebGPU &amp; ONNX Runtime in-browser</li>
              <li>Parameter-efficient fine-tuning (PEFT/LoRA) on custom domain-specific datasets</li>
              <li>Multi-agent orchestration systems with formal tool-calling contracts</li>
              <li>Distributed vector indexing with Milvus / Qdrant clusters</li>
            </ul>
          </div>
        );
        break;
      }

      // 5. INTERACTIVE & CREATIVE
      case 'matrix': {
        setIsMatrixActive(true);
        outputNode = (
          <div className="text-xs text-emerald-400 font-bold">
            Entering Matrix digital rain simulation. Press ESC or click Exit to return.
          </div>
        );
        break;
      }

      case 'neofetch': {
        outputNode = (
          <div className="p-2 sm:p-4 bg-black/60 border border-white/10 font-mono text-[11px] flex flex-col sm:flex-row gap-4">
            <pre className="text-emerald-400 leading-tight select-none overflow-x-auto text-[10px] shrink-0">
              {NEOFETCH_LOGO}
            </pre>
            <div className="space-y-1 text-white/90">
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-red-500 inline-block"></span>
                <span className="w-3 h-3 bg-emerald-500 inline-block"></span>
                <span className="w-3 h-3 bg-yellow-500 inline-block"></span>
                <span className="w-3 h-3 bg-blue-500 inline-block"></span>
                <span className="w-3 h-3 bg-purple-500 inline-block"></span>
                <span className="w-3 h-3 bg-cyan-500 inline-block"></span>
              </div>
              <div className="text-[10px] text-white/50 pt-2 border-t border-white/10">
                Type 'sudo hire' for root recruitment credentials.
              </div>
            </div>
          </div>
        );
        break;
      }

      case 'quote': {
        const q = DEV_QUOTES[Math.floor(Math.random() * DEV_QUOTES.length)];
        outputNode = (
          <div className="p-3 bg-white/5 border border-white/10 text-xs italic space-y-1">
            <div className="text-white font-medium">"{q.quote}"</div>
            <div className="text-white/60 text-right not-italic font-bold">— {q.author}</div>
          </div>
        );
        break;
      }

      case 'joke': {
        const j = PROGRAMMING_JOKES[Math.floor(Math.random() * PROGRAMMING_JOKES.length)];
        outputNode = (
          <div className="p-3 bg-white/5 border border-amber-500/30 text-xs text-amber-200">
            {j}
          </div>
        );
        break;
      }

      case 'motd': {
        outputNode = (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
            <strong>MESSAGE OF THE DAY:</strong> "Great developers do not just write code; they solve real problems with measured discipline." — Keep shipping!
          </div>
        );
        break;
      }

      case 'fortune': {
        const f = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        outputNode = (
          <div className="p-3 bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
            <strong>DEVELOPER FORTUNE:</strong> {f}
          </div>
        );
        break;
      }

      case 'theme': {
        const validThemes: TerminalTheme[] = ['default', 'matrix', 'cyberpunk', 'dracula', 'amber', 'paper'];
        if (arg && validThemes.includes(arg as TerminalTheme)) {
          setCurrentTheme(arg as TerminalTheme);
          outputNode = (
            <div className="text-xs text-emerald-400 font-bold">
              Theme switched to: <strong>{arg.toUpperCase()}</strong>.
            </div>
          );
        } else {
          outputNode = (
            <div className="space-y-2 text-xs">
              <div className="text-amber-400 font-bold">AVAILABLE TERMINAL THEMES:</div>
              <div className="flex flex-wrap gap-2">
                {validThemes.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setCurrentTheme(t);
                      runCommand(`theme ${t}`);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase border cursor-pointer ${
                      currentTheme === t ? 'bg-[#E11D48] text-white border-transparent' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-white/50">Usage: <code>theme &lt;name&gt;</code> (e.g. <code>theme matrix</code>)</div>
            </div>
          );
        }
        break;
      }

      case 'sudo': {
        if (arg === 'hire' || arg === 'hire me') {
          outputNode = (
            <div className="p-4 bg-emerald-950/50 border-2 border-emerald-500 text-xs text-emerald-300 space-y-2 font-mono">
              <div className="text-emerald-400 font-black text-sm flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>[ROOT ACCESS GRANTED: ELEVATED RECRUITMENT PRIVILEGES]</span>
              </div>
              <p className="text-white/90">
                Verification successful. You have bypassed all automated screening algorithms and reached Yogananth J directly.
              </p>
              <div className="p-3 bg-black/60 border border-emerald-500/30 space-y-1">
                <div>* <strong>Candidate:</strong> Yogananth J</div>
                <div>* <strong>Target Roles:</strong> Machine Learning Engineer / Full-Stack AI Engineer</div>
                <div>* <strong>Timeline:</strong> Available for 2026 Graduation / Full-Time Hiring</div>
                <div>* <strong>Direct Contact:</strong> <a href={`mailto:${PERSONAL_INFO.email}?subject=Interview%20Invitation%20for%20Yogananth`} className="text-emerald-400 underline font-bold">{PERSONAL_INFO.email}</a></div>
              </div>
              <div className="pt-2 flex gap-3">
                <a
                  href={`mailto:${PERSONAL_INFO.email}?subject=Priority%20Engineering%20Opportunity`}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs"
                >
                  Send Priority Interview Invite
                </a>
              </div>
            </div>
          );
        } else {
          outputNode = (
            <div className="text-xs text-rose-400">
              User is not in the sudoers file. This incident will be reported. (Try <button onClick={() => runCommand('sudo hire')} className="underline font-bold text-white">sudo hire</button> instead!)
            </div>
          );
        }
        break;
      }

      case 'secret': {
        outputNode = (
          <div className="p-3 bg-purple-950/50 border border-purple-500 text-xs space-y-2 text-purple-200">
            <div className="font-bold text-white uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>EASTER EGG UNLOCKED: DEVELOPER SECRET KEY</span>
            </div>
            <p className="text-white/80">
              You found the hidden developer terminal vault! Here is the secret truth: this entire portfolio was designed with zero-slop principles, custom canvas filaments, and verified working mathematical simulators.
            </p>
            <div className="text-[11px] text-purple-300">
              Secret Hash: <code className="text-white font-mono">0xYOGANANTH_2026_AI_BUILDER</code>
            </div>
          </div>
        );
        break;
      }

      case 'hack': {
        outputNode = (
          <div className="space-y-1 text-xs text-emerald-400 font-mono">
            <div>[+] Initiating harmless diagnostic probe...</div>
            <div>[+] Bypassing simulated security matrix... [OK]</div>
            <div>[+] Decrypting neural layer weights (XGBoost + DenseNet)... [OK]</div>
            <div>[+] Loading high-precision ROC-AUC curves... [94.2% verified]</div>
            <div className="text-white font-bold">[ACCESS GRANTED] System is running with 0 errors. Hello recruiter!</div>
          </div>
        );
        break;
      }

      case 'ping': {
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-white/80">
            <div>PING portfolio.yogananth.dev (127.0.0.1): 56 data bytes</div>
            <div className="text-emerald-400">64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=18.42 ms</div>
            <div className="text-emerald-400">64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=17.89 ms</div>
            <div className="text-emerald-400">64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=18.05 ms</div>
            <div className="text-white/60 pt-1">--- portfolio.yogananth.dev ping statistics ---</div>
            <div className="text-white/60">3 packets transmitted, 3 packets received, 0.0% packet loss</div>
            <div className="text-[10px] text-white/40 italic">*Note: Simulated response benchmark.</div>
          </div>
        );
        break;
      }

      case 'status': {
        const uptimeSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
        outputNode = (
          <div className="p-3 bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="text-emerald-400 font-bold uppercase">PORTFOLIO INTERFACE TELEMETRY:</div>
            <div className="grid grid-cols-2 gap-2 text-white/80">
              <div>Status: <span className="text-emerald-400 font-bold">ONLINE (100% HEALTHY)</span></div>
              <div>Active Session: <span className="text-white font-mono">{uptimeSeconds}s</span></div>
              <div>Active Theme: <span className="text-amber-400 font-bold">{currentTheme.toUpperCase()}</span></div>
              <div>Memory Heap: <span className="text-white font-mono">42.8 MB (Optimized)</span></div>
            </div>
          </div>
        );
        break;
      }

      // 6. CAREER & CONTACT
      case 'contact': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-emerald-400 font-bold uppercase">VERIFIED CONTACT CHANNELS:</div>
            <div className="space-y-1 text-white/90">
              <div>* <strong>Direct Email:</strong> <a href={`mailto:${PERSONAL_INFO.email}`} className="text-[#E11D48] underline font-bold">{PERSONAL_INFO.email}</a></div>
              <div>* <strong>LinkedIn:</strong> <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 underline">{PERSONAL_INFO.linkedin}</a></div>
              <div>* <strong>GitHub:</strong> <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-blue-400 underline">{PERSONAL_INFO.github}</a></div>
              <div>* <strong>Location:</strong> {PERSONAL_INFO.location}</div>
            </div>
            <div className="pt-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(PERSONAL_INFO.email);
                  runCommand('echo "Copied email to clipboard!"');
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-[#E11D48] text-white text-[11px] font-bold border border-white/20 transition-colors"
              >
                Copy Email to Clipboard
              </button>
            </div>
          </div>
        );
        break;
      }

      case 'hire': {
        outputNode = (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 space-y-2">
            <div className="font-bold text-white uppercase">RECRUITMENT &amp; AVAILABILITY STATUS:</div>
            <p>
              Yogananth is actively available for <strong>Full-Time Software Engineer</strong>, <strong>Machine Learning Engineer</strong>, and <strong>AI Application Engineer</strong> roles in 2026.
            </p>
            <div className="p-2 bg-black/40 text-white/90 space-y-0.5">
              <div>* <strong>Core Strengths:</strong> ML Models, Neural Classifiers, RAG Pipelines, React/Node/Flask</div>
              <div>* <strong>Start Date:</strong> Summer / Fall 2026</div>
              <div>* <strong>Location Preferences:</strong> India / Remote / Relocation Open</div>
            </div>
            <div>
              Email directly at <a href={`mailto:${PERSONAL_INFO.email}?subject=Job%20Opportunity`} className="text-white underline font-bold">{PERSONAL_INFO.email}</a>
            </div>
          </div>
        );
        break;
      }

      case 'resume': {
        outputNode = (
          <div className="p-3 bg-white/5 border border-white/15 space-y-2 text-xs">
            <div className="text-cyan-400 font-bold uppercase">CURRICULUM VITAE &amp; RESUME:</div>
            <p className="text-white/80">
              Comprehensive resume covering model benchmarks, published projects, education, and technical competencies.
            </p>
            <div className="flex gap-2 pt-1">
              <a
                href={`mailto:${PERSONAL_INFO.email}?subject=Requesting%20Resume%20for%20Yogananth`}
                className="px-3 py-1.5 bg-[#E11D48] hover:bg-rose-600 text-white font-bold uppercase text-[11px] flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Request Formal PDF Copy</span>
              </a>
            </div>
          </div>
        );
        break;
      }

      case 'linkedin': {
        outputNode = (
          <div className="text-xs">
            Opening LinkedIn profile: <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 underline font-bold">{PERSONAL_INFO.linkedin}</a>
          </div>
        );
        window.open(PERSONAL_INFO.linkedin, '_blank');
        break;
      }

      case 'collaborate': {
        outputNode = (
          <div className="p-3 bg-white/5 border border-white/10 space-y-1.5 text-xs">
            <div className="text-amber-400 font-bold uppercase">OPEN FOR COLLABORATION:</div>
            <p className="text-white/80">
              Interested in collaborating on open-source machine learning tooling, multi-modal applications, or automated developer infrastructure?
            </p>
            <div className="text-white/60">
              Drop a note to <a href={`mailto:${PERSONAL_INFO.email}?subject=Collaboration%20Inquiry`} className="text-white underline">{PERSONAL_INFO.email}</a> with project details.
            </div>
          </div>
        );
        break;
      }

      case 'availability': {
        outputNode = (
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
            <strong>AVAILABILITY:</strong> {PERSONAL_INFO.availability} · Open to engineering discussions immediately.
          </div>
        );
        break;
      }

      case 'services': {
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-amber-400 font-bold uppercase">ENGINEERING SERVICES &amp; EXPERTISE:</div>
            {SERVICES_LIST.map((s) => (
              <div key={s.name} className="p-2 bg-white/5 border border-white/10">
                <div className="font-bold text-white">{s.name}</div>
                <div className="text-white/70 text-[11px]">{s.desc}</div>
              </div>
            ))}
          </div>
        );
        break;
      }

      // 7. TERMINAL UTILITIES
      case 'history': {
        outputNode = (
          <div className="space-y-1 text-xs">
            <div className="text-amber-400 font-bold">SESSION COMMAND HISTORY:</div>
            {commandHistory.length > 0 ? (
              <div className="space-y-0.5 text-white/80">
                {commandHistory.map((h, i) => (
                  <div key={i}>{i + 1}. <code className="text-emerald-400">{h}</code></div>
                ))}
              </div>
            ) : (
              <div className="text-white/50">No commands in session history yet.</div>
            )}
          </div>
        );
        break;
      }

      case 'echo': {
        outputNode = (
          <div className="text-xs text-white/90 font-mono">
            {arg || ''}
          </div>
        );
        break;
      }

      case 'date': {
        const now = new Date();
        outputNode = (
          <div className="text-xs text-white/90 font-mono">
            Current Date &amp; Time: <strong className="text-emerald-400">{now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} (India Standard Time)</strong>
          </div>
        );
        break;
      }

      case 'uptime': {
        const uptimeSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
        outputNode = (
          <div className="text-xs text-white/90 font-mono">
            Terminal Session Uptime: <strong className="text-cyan-400">{uptimeSeconds} seconds</strong> (Active &amp; Responsive)
          </div>
        );
        break;
      }

      case 'banner': {
        outputNode = (
          <pre className="font-mono text-[9px] sm:text-[10px] leading-tight text-[#E11D48] select-none overflow-x-auto">
            {ASCII_BANNER}
          </pre>
        );
        break;
      }

      case 'ls': {
        outputNode = (
          <div className="space-y-1 text-xs font-mono">
            <div className="text-white/60">PORTFOLIO VIRTUAL FILESYSTEM:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-white">
              <div><strong className="text-blue-400">overview/</strong></div>
              <div><strong className="text-blue-400">projects/</strong></div>
              <div><strong className="text-blue-400">simulators/</strong></div>
              <div><strong className="text-blue-400">skills/</strong></div>
              <div><strong className="text-blue-400">experience/</strong></div>
              <div><strong className="text-blue-400">contact/</strong></div>
              <div><span className="text-emerald-400">README.md</span></div>
              <div><span className="text-amber-400">resume.pdf</span></div>
            </div>
            <div className="text-[10px] text-white/40 pt-1">Type <code>open &lt;section&gt;</code> or <code>cat README</code></div>
          </div>
        );
        break;
      }

      case 'cat': {
        if (arg === 'about' || arg === 'bio') {
          outputNode = (
            <div className="p-3 bg-white/5 border border-white/10 text-xs text-white/85 leading-relaxed">
              {PERSONAL_INFO.bio}
            </div>
          );
        } else if (arg === 'readme' || arg === 'readme.md') {
          outputNode = (
            <div className="p-3 bg-white/5 border border-white/10 text-xs text-white/85 font-mono space-y-2">
              <div className="font-bold text-white uppercase"># YOGANANTH 2026 PORTFOLIO QUICKSTART</div>
              <p>Welcome to the production portfolio of Yogananth J. This application features live machine learning simulators, dual-pane split screen workbenches, and verified datasets.</p>
              <div>Type <code>help</code> for complete command reference.</div>
            </div>
          );
        } else {
          outputNode = (
            <div className="text-xs text-rose-400">
              Cannot read "{arg}". Try <code>cat about</code> or <code>cat README</code>.
            </div>
          );
        }
        break;
      }

      case 'open': {
        if (!arg) {
          outputNode = (
            <div className="text-xs text-amber-300">
              Specify a section to navigate to: <code>overview</code>, <code>projects</code>, <code>simulators</code>, <code>skills</code>, <code>experience</code>, <code>contact</code>.
            </div>
          );
        } else {
          const sectionId = arg.trim();
          onNavigateSection?.(sectionId);
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            outputNode = (
              <div className="text-xs text-emerald-400 font-bold">
                Navigated to section: <strong>#{sectionId}</strong>.
              </div>
            );
          } else {
            outputNode = (
              <div className="text-xs text-amber-300">
                Section "#{sectionId}" not found. Available sections: overview, projects, simulators, skills, experience, contact.
              </div>
            );
          }
        }
        break;
      }

      case 'clear': {
        setHistory([]);
        setInputVal('');
        return;
      }

      case 'exit':
      case 'quit': {
        onClose();
        return;
      }

      default: {
        const suggestion = findClosestCommand(cmd);
        outputNode = (
          <div className="text-xs space-y-1">
            <div className="text-rose-400">
              Command not found: "{rawCmd}".
            </div>
            {suggestion && (
              <div className="text-amber-300">
                Did you mean <button onClick={() => runCommand(suggestion)} className="underline font-bold text-white cursor-pointer">{suggestion}</button>?
              </div>
            )}
            <div className="text-white/50 text-[11px]">
              Type <button onClick={() => runCommand('help')} className="underline text-white font-bold cursor-pointer">help</button> to explore available commands.
            </div>
          </div>
        );
      }
    }

    setHistory((prev) => [
      ...prev,
      { id: Math.random().toString(), command: rawCmd, output: outputNode },
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'Escape') {
      if (isMatrixActive) {
        setIsMatrixActive(false);
      } else {
        onClose();
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleAutocomplete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < commandHistory.length) {
          setHistoryIndex(nextIdx);
          setInputVal(commandHistory[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-xs font-mono"
      onClick={onClose}
    >
      <div
        className={`w-full ${
          isFullScreen ? 'max-w-full h-full' : 'max-w-4xl h-[620px]'
        } ${themeConfig.bg} ${themeConfig.text} border-2 ${themeConfig.border} flex flex-col overflow-hidden transition-all duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Title Bar */}
        <div className={`px-4 py-3 ${themeConfig.headerBg} border-b border-white/10 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block cursor-pointer hover:opacity-80"
              onClick={onClose}
              title="Close terminal (Esc)"
            ></span>
            <span
              className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block cursor-pointer hover:opacity-80"
              onClick={() => runCommand('clear')}
              title="Clear screen"
            ></span>
            <span
              className="w-3 h-3 rounded-full bg-[#27C93F] inline-block cursor-pointer hover:opacity-80"
              onClick={() => setIsFullScreen(!isFullScreen)}
              title="Toggle Fullscreen"
            ></span>
            <span className="ml-2 text-xs text-white/80 font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#E11D48]" />
              yogananth@command-center:~ (bash)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme switcher shortcut */}
            <button
              onClick={() => runCommand('theme')}
              type="button"
              className="hidden sm:inline-block px-2 py-0.5 text-[10px] text-white/70 hover:text-white bg-white/5 border border-white/10 uppercase"
              title="Switch terminal theme"
            >
              Theme: {currentTheme}
            </button>

            {/* Maximize Toggle */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              type="button"
              className="p-1 text-white/60 hover:text-white transition-colors"
              title={isFullScreen ? 'Restore Window' : 'Maximize Window'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              type="button"
              className="text-white/60 hover:text-white transition-colors p-1"
              aria-label="Close terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Command Navigation Chips */}
        <div className="px-4 py-2 bg-black/40 border-b border-white/10 flex flex-wrap items-center gap-1.5 text-[11px] overflow-x-auto">
          <span className="text-white/40 text-[10px] uppercase font-bold mr-1">Quick:</span>
          {[
            'help',
            'why should i hire you?',
            'whyhire',
            'projects',
            'architecture',
            'currently',
            'sudo hire',
            'certifications',
            'matrix',
            'skills',
            'timeline',
            'contact',
            'clear'
          ].map((cmd) => (
            <button
              key={cmd}
              onClick={() => runCommand(cmd)}
              type="button"
              className="px-2 py-0.5 bg-white/5 hover:bg-[#E11D48] text-white/80 hover:text-white border border-white/10 transition-colors whitespace-nowrap cursor-pointer"
            >
              ${cmd}
            </button>
          ))}
        </div>

        {/* Console Log Area or Matrix Mode */}
        {isMatrixActive ? (
          <div className="flex-1 overflow-hidden">
            <MatrixRainCanvas onExit={() => setIsMatrixActive(false)} />
          </div>
        ) : (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 font-mono">
            {history.map((item) => (
              <div key={item.id} className="space-y-1">
                {item.command !== 'init' && (
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span className="text-[#E11D48] font-bold">&gt;</span>
                    <span className="font-bold text-white">{item.command}</span>
                  </div>
                )}
                <div className="pl-3 border-l border-white/15 py-0.5">{item.output}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-black/50 border-t border-white/10 flex items-center gap-2 text-xs font-mono">
          <span className="text-[#E11D48] font-bold">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (try 'help', 'neofetch', 'matrix') and press Enter..."
            className="flex-1 bg-transparent text-white focus:outline-none font-mono placeholder:text-white/30"
          />
          <button
            onClick={() => handleCommand(inputVal)}
            type="button"
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded cursor-pointer"
            title="Execute Command"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
