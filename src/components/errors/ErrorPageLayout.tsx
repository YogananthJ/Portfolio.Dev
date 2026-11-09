import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldAlert, Terminal, Radio, Cpu, ArrowRight } from 'lucide-react';
import { ErrorDetails, ErrorActionConfig } from './types';
import { ErrorActions } from './ErrorActions';

interface ErrorPageLayoutProps {
  details: ErrorDetails;
  illustration: React.ReactNode;
  primaryAction?: ErrorActionConfig;
  secondaryAction?: ErrorActionConfig;
  tertiaryAction?: ErrorActionConfig;
  onReturnHome?: () => void;
  onGoBack?: () => void;
  onRetry?: () => void;
  systemTip?: string;
  children?: React.ReactNode;
}

export const ErrorPageLayout: React.FC<ErrorPageLayoutProps> = ({
  details,
  illustration,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  onReturnHome,
  onGoBack,
  onRetry,
  systemTip,
  children,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const currentTimestamp = details.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  return (
    <div className="min-h-screen bg-[#07090E] text-[#F4F4F5] font-sans relative w-full max-w-full overflow-x-hidden flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Background Cyberpunk Grid & Scanline Ambience */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true" 
      />
      <div 
        className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] [background-size:100%_4px] opacity-40"
        aria-hidden="true" 
      />
      <div 
        className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true" 
      />
      <div 
        className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true" 
      />

      {/* Top Telemetry Header Bar */}
      <header className="relative z-20 border-b border-white/10 bg-[#0B0E17]/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 font-display font-black tracking-wider text-white hover:text-rose-400 transition-colors"
          >
            <span>YOGANANTH</span>
            <span className="w-1.5 h-1.5 bg-rose-500" />
          </a>
          <span className="text-zinc-600 hidden sm:inline">/</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-rose-400 font-bold uppercase tracking-wider text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>INCIDENT_TELEMETRY</span>
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-[10px] text-zinc-400">
          <span className="hidden md:inline-block">
            TIME: <span className="text-zinc-200">{currentTimestamp}</span>
          </span>
          <span className="px-2 py-0.5 rounded-xs bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold uppercase tracking-wide">
            STATUS: {details.code}
          </span>
        </div>
      </header>

      {/* Main Content Showcase */}
      <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-16 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full">
          
          {/* Left Column: Descriptive Typography & Actions */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-6 flex flex-col justify-center order-2 lg:order-1"
          >
            {/* Incident Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-xs text-[11px] font-mono tracking-wider text-rose-400 w-fit">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-bold uppercase">{details.badge}</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400">{details.protocolCode || `HTTP_${details.code}`}</span>
            </div>

            {/* Giant Monolithic Code & Header */}
            <div>
              <div className="font-mono text-5xl sm:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-400 to-cyan-400 tracking-tight leading-none">
                {details.code}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white uppercase tracking-tight mt-2">
                {details.title}
              </h1>
            </div>

            {/* Subtitle & Core Narrative */}
            <div className="space-y-2 max-w-xl">
              <p className="text-base sm:text-lg text-zinc-200 font-medium leading-relaxed">
                {details.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono leading-relaxed border-l-2 border-rose-500/60 pl-3">
                {details.description}
              </p>
            </div>

            {/* Optional System Diagnostics Telemetry Box */}
            <div className="p-3.5 bg-[#0C101A] border border-white/10 rounded-xs font-mono text-[11px] text-zinc-400 space-y-1">
              <div className="flex items-center justify-between text-zinc-500 pb-1 border-b border-white/5 text-[10px]">
                <span>DIAGNOSTIC_CONSOLE</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ACTIVE_TRAP
                </span>
              </div>
              <div className="text-zinc-300">
                <span className="text-rose-400 font-bold">&gt;&gt;</span> {systemTip || 'Automated error recovery protocol initiated. Check network and router telemetry.'}
              </div>
            </div>

            {/* Additional Custom Children (e.g. search bars, ping meter) */}
            {children}

            {/* Interactive Functional Buttons */}
            <ErrorActions
              primaryAction={primaryAction}
              secondaryAction={secondaryAction}
              tertiaryAction={tertiaryAction}
              onReturnHome={onReturnHome}
              onGoBack={onGoBack}
              onRetry={onRetry}
            />
          </motion.div>

          {/* Right Column: Unique Bespoke SVG Illustration */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-6 flex items-center justify-center order-1 lg:order-2 w-full"
          >
            {illustration}
          </motion.div>

        </div>
      </main>

      {/* Cyberpunk Telemetry Footer */}
      <footer className="relative z-20 border-t border-white/10 bg-[#0B0E17]/80 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span>PORTFOLIO_SYSTEMS // AI_ENGINEERING</span>
          <span>·</span>
          <span>AUTONOMOUS_FAILSAFE</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/#contact" className="hover:text-rose-400 transition-colors">
            REPORT_INCIDENT
          </a>
          <span>·</span>
          <a href="/" className="hover:text-white transition-colors">
            HOMEPAGE
          </a>
        </div>
      </footer>
    </div>
  );
};
