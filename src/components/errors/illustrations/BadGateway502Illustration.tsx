import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const BadGateway502Illustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Red/Cyan Ambient Bridge Failure Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-600/20 via-cyan-600/15 to-red-600/20 blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_35px_rgba(239,68,68,0.25)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="45%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="55%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>

          <filter id="splitGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Telemetry Grid Frame */}
        <rect x="60" y="60" width="380" height="380" rx="14" fill="#0C0E15" stroke="#27272A" strokeWidth="2" />

        {/* Left Server Node: Proxy / Gateway */}
        <g transform="translate(85, 160)">
          <rect x="0" y="0" width="105" height="180" rx="8" fill="#141824" stroke="#06B6D4" strokeWidth="2" />
          {/* Server Blades */}
          <rect x="10" y="20" width="85" height="24" rx="3" fill="#1E2433" stroke="#06B6D4" strokeWidth="1" />
          <circle cx="22" cy="32" r="3" fill="#06B6D4" />
          <rect x="10" y="55" width="85" height="24" rx="3" fill="#1E2433" stroke="#06B6D4" strokeWidth="1" />
          <circle cx="22" cy="67" r="3" fill="#06B6D4" />
          <rect x="10" y="90" width="85" height="24" rx="3" fill="#1E2433" stroke="#06B6D4" strokeWidth="1" />
          <circle cx="22" cy="102" r="3" fill="#06B6D4" />
          <text x="52" y="145" textAnchor="middle" fill="#06B6D4" fontFamily="monospace" fontSize="10" fontWeight="bold">
            GATEWAY [A]
          </text>
        </g>

        {/* Right Server Node: Upstream Daemon (Failing) */}
        <g transform="translate(310, 160)">
          <rect x="0" y="0" width="105" height="180" rx="8" fill="#1A1215" stroke="#EF4444" strokeWidth="2" />
          {/* Server Blades with Red Alert Failure */}
          <rect x="10" y="20" width="85" height="24" rx="3" fill="#241416" stroke="#EF4444" strokeWidth="1" />
          <circle cx="22" cy="32" r="3" fill="#EF4444" />
          <rect x="10" y="55" width="85" height="24" rx="3" fill="#241416" stroke="#EF4444" strokeWidth="1" />
          <circle cx="22" cy="67" r="3" fill="#EF4444" />
          <rect x="10" y="90" width="85" height="24" rx="3" fill="#241416" stroke="#EF4444" strokeWidth="1" />
          <circle cx="22" cy="102" r="3" fill="#EF4444" />
          <text x="52" y="145" textAnchor="middle" fill="#EF4444" fontFamily="monospace" fontSize="10" fontWeight="bold">
            UPSTREAM [B]
          </text>
        </g>

        {/* Fractured Data Transmission Bridge Conduit Between Servers */}
        {/* Upper conduit */}
        <path d="M 190 200 L 230 200" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
        <path d="M 270 200 L 310 200" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
        {/* Severed Gap Lightning Spark */}
        <motion.path
          d="M 230 200 L 245 185 L 255 215 L 270 200"
          stroke="#EF4444"
          strokeWidth="3"
          fill="none"
          filter="url(#splitGlow)"
          animate={shouldReduceMotion ? undefined : { opacity: [0, 1, 0, 1, 0] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />

        {/* Lower conduit */}
        <path d="M 190 290 L 225 290" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
        <path d="M 275 290 L 310 290" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
        <motion.path
          d="M 225 290 L 240 305 L 260 275 L 275 290"
          stroke="#F59E0B"
          strokeWidth="3"
          fill="none"
          filter="url(#splitGlow)"
          animate={shouldReduceMotion ? undefined : { opacity: [1, 0, 1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />

        {/* Big Central Fractured Bridge Warning Symbol */}
        <circle cx="250" cy="245" r="32" fill="#0E1119" stroke="#EF4444" strokeWidth="2.5" />
        <motion.g
          animate={shouldReduceMotion ? undefined : { scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Broken Bridge / Lightning Glyph */}
          <path d="M 243 225 L 257 225 L 247 245 L 260 245 L 240 268 L 246 250 L 237 250 Z" fill="#EF4444" filter="url(#splitGlow)" />
        </motion.g>

        {/* Diagnostic Status Message */}
        <rect x="135" y="380" width="230" height="26" rx="4" fill="#18181B" stroke="#EF4444" strokeWidth="1" />
        <text x="250" y="397" textAnchor="middle" fill="#EF4444" fontFamily="monospace" fontSize="9" fontWeight="bold">
          HANDSHAKE_COLLISION // 502
        </text>

        {/* Top Header Label */}
        <text x="250" y="105" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontFamily="monospace" fontSize="11" fontWeight="bold" letterSpacing="3">
          BAD_GATEWAY // PROXY_ERROR
        </text>
      </svg>
    </div>
  );
};
