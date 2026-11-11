import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
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
      <header className="relative z-20 border-b border-white/10 bg-[#0B0E17]/85 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 font-display font-black tracking-wider text-white hover:text-rose-400 transition-colors"
          >
            <span>YOGANANTH</span>
            <span className="w-1.5 h-1.5 bg-rose-500" />
          </a>
          <span className="text-zinc-600 hidden sm:inline">/</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ERROR_UNIVERSE // INCIDENT_LOG</span>
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-[10px] text-zinc-400">
          <span className="hidden md:inline-block">
            TIME: <span className="text-zinc-200">{currentTimestamp}</span>
          </span>
          <span className="px-2 py-0.5 rounded-xs bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold uppercase tracking-wide">
            SECTOR: {details.code}
          </span>
        </div>
      </header>

      {/* Main Content Showcase: Large Cinematic Illustration & Side-by-Side Narrative */}
      <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-14 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
          
          {/* Left Column (Desktop) / Lower Column (Mobile): Error Code, Story Title, Narrative & Actions */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 xl:col-span-5 space-y-6 flex flex-col justify-center order-2 lg:order-1"
          >
            {/* Clean Unboxed Metadata Line (No Pill Enclosures) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-wider text-rose-400">
              <span className="font-bold uppercase tracking-wider">{details.badge}</span>
              <span className="text-zinc-600" aria-hidden="true">·</span>
              <span className="text-zinc-400">{details.protocolCode || `HTTP_${details.code}`}</span>
              <span className="text-zinc-600" aria-hidden="true">·</span>
              <span className="text-zinc-500 text-[11px]">SECTOR_FAILSAFE</span>
            </div>

            {/* Giant Monolithic Error Code & Story Title */}
            <div className="space-y-1">
              <div className="font-mono text-6xl sm:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-400 to-cyan-400 tracking-tight leading-none">
                {details.code}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white uppercase tracking-tight">
                {details.title}
              </h1>
            </div>

            {/* Subtitle & Story Narrative */}
            <div className="space-y-3 max-w-xl">
              <p className="text-lg sm:text-xl text-rose-200/90 font-medium leading-relaxed font-sans">
                &ldquo;{details.subtitle}&rdquo;
              </p>
              <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
                {details.description}
              </p>
            </div>

            {/* Diagnostic Telemetry Console */}
            <div className="p-3.5 bg-[#0A0D15] border border-white/10 rounded-xs font-mono text-[11px] text-zinc-400 space-y-1 relative">
              <div className="flex items-center justify-between text-zinc-500 pb-1 border-b border-white/5 text-[10px]">
                <span className="tracking-wider">INCIDENT_DIAGNOSTICS</span>
                <span className="text-emerald-400">FAILSAFE_STABLE</span>
              </div>
              <div className="text-zinc-300 pt-0.5">
                <span className="text-rose-400 font-bold">&gt;&gt;</span> {systemTip || 'Automated error recovery protocol active. Select an action below.'}
              </div>
            </div>

            {/* Additional Custom Children (e.g. search / network indicators) */}
            {children}

            {/* Interactive Functional Actions */}
            <div className="pt-2">
              <ErrorActions
                primaryAction={primaryAction}
                secondaryAction={secondaryAction}
                tertiaryAction={tertiaryAction}
                onReturnHome={onReturnHome}
                onGoBack={onGoBack}
                onRetry={onRetry}
              />
            </div>
          </motion.div>

          {/* Right Column (Desktop) / Upper Column (Mobile): Large Cinematic Illustration */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="lg:col-span-7 xl:col-span-7 flex items-center justify-center order-1 lg:order-2 w-full"
          >
            {illustration}
          </motion.div>

        </div>
      </main>

      {/* Cyberpunk Telemetry Footer */}
      <footer className="relative z-20 border-t border-white/10 bg-[#0B0E17]/85 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span>PORTFOLIO_SYSTEMS // ERROR_UNIVERSE</span>
          <span aria-hidden="true">·</span>
          <span>AUTONOMOUS_FAILSAFE_PROTOCOL</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/#contact" className="hover:text-rose-400 transition-colors">
            REPORT_ANOMALY
          </a>
          <span aria-hidden="true">·</span>
          <a href="/" className="hover:text-white transition-colors">
            RETURN_HOME
          </a>
        </div>
      </footer>
    </div>
  );
};
