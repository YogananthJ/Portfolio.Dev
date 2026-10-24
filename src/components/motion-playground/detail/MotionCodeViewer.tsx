import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Code2, Play, Terminal, Download, FileCode } from 'lucide-react';
import { openInStackBlitz, IdeProjectConfig } from './onlineIdeUtils';

interface FileItem {
  name: string;
  language: string;
  isPrimary?: boolean;
  code: string;
}

interface MotionCodeViewerProps {
  files: FileItem[];
  title: string;
  ideConfig: IdeProjectConfig;
}

export const MotionCodeViewer: React.FC<MotionCodeViewerProps> = ({
  files,
  title,
  ideConfig,
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [copyAllCopied, setCopyAllCopied] = useState<boolean>(false);
  const [showStandaloneModal, setShowStandaloneModal] = useState<boolean>(false);

  const activeFile = files[activeFileIndex] || files[0];

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(activeFile.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      const ta = document.createElement('textarea');
      ta.value = activeFile.code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleCopyCompleteExample = async () => {
    const combined = `/**
 * ============================================================
 * ${title} — Complete Standalone Implementation
 * Motion Lab // Yogananth Developer Portfolio
 * ============================================================
 * Dependencies:
 * ${Object.entries(ideConfig.dependencies).map(([k, v]) => ` *   "${k}": "${v}"`).join('\n')}
 * ============================================================
 */

${files.map((f) => `// --- File: ${f.name} ---\n${f.code}`).join('\n\n')}`;

    try {
      await navigator.clipboard.writeText(combined);
      setCopyAllCopied(true);
      setTimeout(() => setCopyAllCopied(false), 2400);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = combined;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopyAllCopied(true);
      setTimeout(() => setCopyAllCopied(false), 2400);
    }
  };

  const handleOpenOnlineIde = () => {
    openInStackBlitz(ideConfig);
  };

  // Generate numbered lines
  const lines = activeFile.code.split('\n');

  return (
    <div className="rounded-xl overflow-hidden bg-[#0D0D11] border-2 border-[var(--border-color)] shadow-[6px_6px_0px_0px_var(--border-color)] flex flex-col font-mono text-xs text-[#F5F2EB]">
      {/* 1. Editor Window Chrome / Header */}
      <div className="px-4 py-2.5 bg-[#15151C] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Left: Window Dots & Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block"></span>
          </div>

          {/* File Tabs */}
          <div className="flex items-center gap-1">
            {files.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setActiveFileIndex(idx)}
                type="button"
                className={`px-3 py-1 text-xs font-mono font-bold flex items-center gap-1.5 rounded-t border-t border-x transition-colors cursor-pointer ${
                  activeFileIndex === idx
                    ? 'bg-[#0D0D11] text-white border-white/20'
                    : 'bg-transparent text-white/50 border-transparent hover:text-white/80'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{file.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions (Copy + Run in Online IDE) */}
        <div className="flex items-center gap-2">
          {/* Copy Current File */}
          <button
            onClick={handleCopyCode}
            type="button"
            className={`px-3 py-1 text-xs font-bold uppercase flex items-center gap-1.5 rounded transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
            title="Copy current file code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          {/* Copy Standalone Example */}
          <button
            onClick={handleCopyCompleteExample}
            type="button"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded bg-white/5 hover:bg-white/15 text-white/80 border border-white/15 transition-colors cursor-pointer"
            title="Copy all project files combined into one complete runnable package"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{copyAllCopied ? 'All Files Copied!' : 'Copy Full Project'}</span>
          </button>

          {/* Run in StackBlitz / CodeSandbox */}
          <button
            onClick={handleOpenOnlineIde}
            type="button"
            className="px-3.5 py-1 bg-[var(--accent)] hover:bg-[#BE123C] text-white font-bold text-xs uppercase flex items-center gap-1.5 rounded shadow-sm transition-all cursor-pointer"
            title="Launch an interactive editable environment in StackBlitz"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Try in Online IDE</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Vertically Scrollable Code Area with Line Numbers */}
      <div className="relative max-h-[460px] overflow-y-auto overflow-x-auto p-4 flex font-mono text-[11px] sm:text-xs leading-relaxed select-all">
        {/* Line Numbers Column */}
        <div className="pr-4 text-white/30 text-right select-none border-r border-white/10 font-mono shrink-0">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Content */}
        <div className="pl-4 text-emerald-400 whitespace-pre">
          <code>{activeFile.code}</code>
        </div>
      </div>

      {/* 3. Editor Status Bar */}
      <div className="px-4 py-1.5 bg-[#121217] border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>•</span>
          <span>TypeScript / React</span>
          <span>•</span>
          <span>{lines.length} lines</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <span>Stack: {Object.keys(ideConfig.dependencies).join(', ')}</span>
        </div>
      </div>
    </div>
  );
};
