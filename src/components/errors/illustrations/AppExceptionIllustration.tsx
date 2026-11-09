import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const AppExceptionIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Rose/Red Ambient Exception Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-600/25 via-pink-600/15 to-red-600/20 blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_35px_rgba(244,63,94,0.3)]"
        aria-hidden="true"
      >
        <defs>
          <filter id="corruptGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="codeGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* Outer Background Terminal Housing */}
        <rect x="60" y="60" width="380" height="380" rx="14" fill="#0A0C13" stroke="#27272A" strokeWidth="2" />
        <rect x="60" y="60" width="380" height="380" rx="14" fill="url(#codeGrid)" />

        {/* Broken IDE Code Editor Window (Main Left) */}
        <g transform="translate(80, 110)">
          {/* Main IDE Frame */}
          <rect x="0" y="0" width="250" height="230" rx="8" fill="#131622" stroke="#F43F5E" strokeWidth="1.8" />
          
          {/* Window Header with Traffic Lights */}
          <rect x="0" y="0" width="250" height="30" rx="8" fill="#1A1E2E" />
          <circle cx="16" cy="15" r="4" fill="#EF4444" />
          <circle cx="28" cy="15" r="4" fill="#F59E0B" />
          <circle cx="40" cy="15" r="4" fill="#10B981" />
          <text x="70" y="19" fill="rgba(255,255,255,0.6)" fontFamily="monospace" fontSize="9">
            AppRuntime.tsx [CRASHED]
          </text>

          {/* Broken Lines of Code with Red Exception Highlight */}
          <line x1="20" y1="52" x2="140" y2="52" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="72" x2="180" y2="72" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
          
          {/* Fault Line Highlight (Red Error Block) */}
          <rect x="15" y="88" width="220" height="28" rx="4" fill="rgba(239,68,68,0.2)" stroke="#EF4444" strokeWidth="1" />
          <text x="25" y="106" fill="#FCA5A5" fontFamily="monospace" fontSize="10" fontWeight="bold">
            &gt;&gt; UNCAUGHT_EXCEPTION
          </text>

          <line x1="30" y1="135" x2="120" y2="135" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" />
          <line x1="20" y1="155" x2="90" y2="155" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" />
          <line x1="20" y1="175" x2="160" y2="175" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Floating Fractured Terminal Fragment (Torn off at an angle) */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [-6, 6, -6], rotate: [6, 3, 6] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '330px 240px' }}
        >
          <g transform="translate(240, 190) rotate(8)">
            <rect x="0" y="0" width="165" height="150" rx="8" fill="#1C1117" stroke="#EF4444" strokeWidth="2" filter="url(#corruptGlow)" />
            {/* Header */}
            <rect x="0" y="0" width="165" height="26" rx="8" fill="#2E121C" />
            <circle cx="14" cy="13" r="3" fill="#EF4444" />
            <text x="30" y="17" fill="#EF4444" fontFamily="monospace" fontSize="9" fontWeight="bold">
              THREAD_DUMP
            </text>

            {/* Binary Glitch Static in Fragmented Terminal */}
            <text x="15" y="52" fill="#F43F5E" fontFamily="monospace" fontSize="10">0x00000000</text>
            <text x="15" y="72" fill="#F43F5E" fontFamily="monospace" fontSize="10">0xDEADBEEF</text>
            <text x="15" y="92" fill="#FCA5A5" fontFamily="monospace" fontSize="10">FAIL_SAFE_TRIP</text>
            <text x="15" y="112" fill="#38BDF8" fontFamily="monospace" fontSize="10">&gt; RECOVER_INIT</text>
          </g>
        </motion.g>

        {/* Diagonal Screen Tear Glitch Line across the entire illustration */}
        <line x1="60" y1="210" x2="440" y2="230" stroke="#F43F5E" strokeWidth="1" strokeDasharray="12 4 2 8" opacity="0.75" />

        {/* Glitched Warning Pill at Bottom */}
        <g transform="translate(130, 395)">
          <rect x="0" y="0" width="240" height="26" rx="4" fill="#18181B" stroke="#F43F5E" strokeWidth="1" />
          <text x="120" y="17" textAnchor="middle" fill="#FB7185" fontFamily="monospace" fontSize="10" fontWeight="bold">
            CLIENT_RENDER // RECOVERABLE
          </text>
        </g>

        {/* Header HUD */}
        <text x="250" y="95" textAnchor="middle" fill="#F43F5E" fontFamily="monospace" fontSize="11" fontWeight="bold" letterSpacing="3">
          APPLICATION_ERROR // REACT_BOUNDARY
        </text>
      </svg>
    </div>
  );
};
