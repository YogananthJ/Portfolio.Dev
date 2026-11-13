import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  WifiOff, 
  Server, 
  Lock, 
  Clock, 
  Network, 
  Wrench, 
  Hourglass, 
  Flame, 
  Eye, 
  Play
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import { useDialogA11y } from '../../hooks/useDialogA11y';

interface ErrorHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectErrorRoute: (route: string) => void;
  onTriggerSimulatedCrash: () => void;
}

export const ErrorHubModal: React.FC<ErrorHubModalProps> = ({
  isOpen,
  onClose,
  onSelectErrorRoute,
  onTriggerSimulatedCrash,
}) => {
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  useDialogA11y(isOpen, dialogRef, onClose);

  if (!isOpen) return null;

  const ERROR_SCENARIOS = [
    {
      code: '404',
      title: 'Lost in Space',
      concept: 'Digital Explorer in the Cosmic Void',
      route: '/404',
      icon: Eye,
      accent: 'border-rose-500/40 text-rose-400',
    },
    {
      code: 'OFFLINE',
      title: 'Signal Disconnected',
      concept: 'Communication Lost / Station Dark',
      route: '/offline',
      icon: WifiOff,
      accent: 'border-cyan-500/40 text-cyan-400',
    },
    {
      code: '500',
      title: 'Core Malfunction',
      concept: 'Central Reactor Breach & Failsafe',
      route: '/500',
      icon: Server,
      accent: 'border-red-500/40 text-red-400',
    },
    {
      code: '403',
      title: 'Security Lockdown',
      concept: 'Unauthorized Access to Protected Sector',
      route: '/403',
      icon: Lock,
      accent: 'border-rose-500/40 text-rose-400',
    },
    {
      code: '408',
      title: 'Request Timeout',
      concept: 'Signal Interrupted / Frozen Clock',
      route: '/408',
      icon: Clock,
      accent: 'border-amber-500/40 text-amber-400',
    },
    {
      code: '502',
      title: 'Bad Gateway',
      concept: 'Broken Dual-Node Connection',
      route: '/502',
      icon: Network,
      accent: 'border-cyan-500/40 text-cyan-400',
    },
    {
      code: '503',
      title: 'Under Maintenance',
      concept: 'Automated Repair Drones & Diagnostics',
      route: '/503',
      icon: Wrench,
      accent: 'border-emerald-500/40 text-emerald-400',
    },
    {
      code: '504',
      title: 'Gateway Timeout',
      concept: 'Response Disappearing into Deep Void',
      route: '/504',
      icon: Hourglass,
      accent: 'border-purple-500/40 text-purple-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div 
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-3xl bg-[#0E1119] border-2 border-rose-500/60 rounded-sm shadow-2xl p-6 font-mono text-xs text-white max-h-[90vh] overflow-y-auto space-y-6 focus:outline-none"
        role="dialog"
        aria-modal="true"
        aria-label="Error Experience System Testing Hub"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider text-sm">
              Custom Error Experience Lab
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-zinc-400 leading-relaxed text-[11px] font-sans">
          Test and preview all custom error experiences, individual bespoke illustrations, functional actions, and the React Error Boundary live in the client environment.
        </p>

        {/* Error Scenarios Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ERROR_SCENARIOS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.code}
                className="p-3.5 bg-[#141824] border border-white/10 hover:border-rose-500/60 rounded-xs transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xs bg-white/5 border ${item.accent}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white uppercase">{item.code}</span>
                      <span className="text-[10px] text-zinc-500">·</span>
                      <span className="text-zinc-300 text-[11px] font-medium">{item.title}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-sans mt-0.5">
                      {item.concept}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    onSelectErrorRoute(item.route);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 rounded-xs font-bold uppercase text-[10px] tracking-wider transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Launch</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Live React Error Boundary Crash Test Zone */}
        <div className="p-4 bg-red-950/20 border border-red-500/40 rounded-xs space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider text-xs">
            <Flame className="w-4 h-4" />
            <span>Simulate Runtime Exception (Error Boundary Trap)</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
            Throws a simulated client-side component render error to test the React Error Boundary. It will safely catch the crash and render the custom Application Error page without exposing sensitive traces to visitors.
          </p>
          <button
            type="button"
            onClick={() => {
              soundFX.playWarning();
              onTriggerSimulatedCrash();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-xs text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Trigger Component Exception</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-2 border-t border-white/5">
          <span>ROUTES: /404, /offline, /500, /403, /408, /502, /503, /504</span>
          <span>CLI: <code>error &lt;code&gt;</code></span>
        </div>
      </div>
    </div>
  );
};
