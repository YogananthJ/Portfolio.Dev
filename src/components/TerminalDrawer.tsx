import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal, CornerDownLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES } from '../data/portfolioData';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({ isOpen, onClose, onSelectProject }) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<Array<{ command: string; output: React.ReactNode }>>([
    {
      command: 'init',
      output: (
        <div className="space-y-1 text-xs">
          <div className="text-emerald-400 font-bold">YOGANANTH DEVELOPER CONSOLE [v2.6.0-prod]</div>
          <div className="text-white/60">Type <span className="text-[#E11D48] font-bold">help</span> to list available commands or click the chips below.</div>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    let outputNode: React.ReactNode;

    switch (cmd) {
      case 'help':
        outputNode = (
          <div className="space-y-1 text-xs text-white/80">
            <div className="text-amber-400 font-bold mb-1">AVAILABLE COMMANDS:</div>
            <div><span className="text-emerald-400 font-bold w-24 inline-block">whoami</span> Display developer profile and summary</div>
            <div><span className="text-emerald-400 font-bold w-24 inline-block">projects</span> List all 7 deployed machine learning &amp; web projects</div>
            <div><span className="text-emerald-400 font-bold w-24 inline-block">skills</span> Display verified technology stack and proficiencies</div>
            <div><span className="text-emerald-400 font-bold w-24 inline-block">contact</span> Show verified contact credentials &amp; email</div>
            <div><span className="text-emerald-400 font-bold w-24 inline-block">hire</span> Get recruitment and availability information</div>
            <div><span className="text-emerald-400 font-bold w-24 inline-block">clear</span> Clear terminal console screen</div>
            <div><span className="text-emerald-400 font-bold w-24 inline-block">exit</span> Close developer console window</div>
          </div>
        );
        break;

      case 'whoami':
      case 'bio':
        outputNode = (
          <div className="space-y-2 text-xs text-white/85">
            <div className="text-white font-bold">{PERSONAL_INFO.name} — {PERSONAL_INFO.role}</div>
            <p className="text-white/70">{PERSONAL_INFO.bio}</p>
            <div className="text-white/50">Location: {PERSONAL_INFO.location} | Availability: {PERSONAL_INFO.availability}</div>
          </div>
        );
        break;

      case 'projects':
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-amber-400 font-bold">DEPLOYED PRODUCTION PROJECTS:</div>
            {PROJECTS.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-1 border-b border-white/10 text-white/80">
                <span>0{i + 1}. <strong className="text-white">{p.title}</strong> ({p.categoryLabel})</span>
                <span className="text-emerald-400">{p.metrics[0].label}: {p.metrics[0].value}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-amber-400 font-bold">TECHNOLOGY PORTFOLIO:</div>
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.category} className="space-y-0.5">
                <div className="text-purple-300 font-bold">{cat.category}:</div>
                <div className="text-white/70">{cat.skills.map((s) => s.name).join(', ')}</div>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className="space-y-1.5 text-xs text-white/80">
            <div><strong className="text-white">Email:</strong> <a href={`mailto:${PERSONAL_INFO.email}`} className="text-[#E11D48] underline">{PERSONAL_INFO.email}</a></div>
            <div><strong className="text-white">GitHub:</strong> <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-blue-400 underline">{PERSONAL_INFO.github}</a></div>
            <div><strong className="text-white">LinkedIn:</strong> <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 underline">{PERSONAL_INFO.linkedin}</a></div>
          </div>
        );
        break;

      case 'hire':
        outputNode = (
          <div className="space-y-2 text-xs p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
            <div className="font-bold text-white uppercase">Recruitment Status: ACTIVE</div>
            <p>
              Yogananth is open to <strong>Full-Time Software Engineer</strong>, <strong>Machine Learning Engineer</strong>, and <strong>AI Application Engineer</strong> opportunities starting in 2026.
            </p>
            <p className="text-white/70">
              Reach out directly via email at <span className="text-white font-bold">{PERSONAL_INFO.email}</span>.
            </p>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        outputNode = (
          <div className="text-rose-400 text-xs">
            Command not recognized: "{cmd}". Type <span className="underline font-bold">help</span> to view all commands.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: rawCmd, output: outputNode }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl h-[560px] bg-[#121212] text-[#F5F2EB] border-2 border-[#121212] shadow-[8px_8px_0px_0px_#E11D48] flex flex-col overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Title Bar */}
        <div className="px-4 py-3 bg-[#1C1C1E] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block cursor-pointer" onClick={onClose}></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block"></span>
            <span className="ml-2 text-xs text-white/70 font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#E11D48]" />
              yogananth@workstation:~ (bash)
            </span>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close terminal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Command Chips */}
        <div className="px-4 py-2 bg-[#18181A] border-b border-white/10 flex flex-wrap gap-1.5 text-[11px]">
          {['help', 'whoami', 'projects', 'skills', 'contact', 'hire', 'clear'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleCommand(cmd)}
              type="button"
              className="px-2.5 py-0.5 bg-white/5 hover:bg-[#E11D48] text-white/80 hover:text-white border border-white/10 transition-colors"
            >
              ${cmd}
            </button>
          ))}
        </div>

        {/* Console Log Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.command !== 'init' && (
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span className="text-[#E11D48] font-bold">&gt;</span>
                  <span>{item.command}</span>
                </div>
              )}
              <div className="pl-3 border-l border-white/10 py-0.5">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#1C1C1E] border-t border-white/10 flex items-center gap-2 text-xs">
          <span className="text-[#E11D48] font-bold">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command and hit Enter..."
            className="flex-1 bg-transparent text-white focus:outline-none font-mono placeholder:text-white/30"
          />
          <button
            onClick={() => handleCommand(inputVal)}
            type="button"
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
