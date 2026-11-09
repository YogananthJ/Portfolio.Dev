import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const SignalInterrupted408Illustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Amber/Violet Ambient Timeout Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600/20 via-violet-600/15 to-rose-600/15 blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_35px_rgba(245,158,11,0.25)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="clockRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>

          <filter id="timeoutGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Digital Hourglass Frame Container */}
        <rect x="70" y="70" width="360" height="360" rx="16" fill="#0D0F17" stroke="#27272A" strokeWidth="2" />

        {/* Outer Circular Chronometer Dials */}
        <circle cx="250" cy="230" r="130" stroke="#3F3F46" strokeWidth="1.5" strokeDasharray="3 6" />
        <circle cx="250" cy="230" r="105" stroke="url(#clockRingGrad)" strokeWidth="3" strokeDasharray="180 50 20 40" />

        {/* Clock Tick Marks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1="250"
            y1="108"
            x2="250"
            y2="118"
            stroke="#71717A"
            strokeWidth="2"
            transform={`rotate(${deg} 250 230)`}
          />
        ))}

        {/* Frozen Clock Hands (Paused at timeout threshold) */}
        <line x1="250" y1="230" x2="250" y2="150" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" filter="url(#timeoutGlow)" />
        <line x1="250" y1="230" x2="310" y2="230" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" filter="url(#timeoutGlow)" />
        <circle cx="250" cy="230" r="7" fill="#F59E0B" />

        {/* Interrupted Data Transmission Stream (Fragmenting midway) */}
        <g transform="translate(100, 345)">
          {/* Progress Bar Track */}
          <rect x="0" y="0" width="300" height="18" rx="4" fill="#18181B" stroke="#3F3F46" strokeWidth="1" />
          {/* Progress Fill Stalled at 92% */}
          <rect x="2" y="2" width="220" height="14" rx="2" fill="#F59E0B" opacity="0.85" />
          
          {/* Glitching / Frozen Loading Bar Segment */}
          <motion.rect
            x="222"
            y="2"
            width="25"
            height="14"
            fill="#EF4444"
            animate={shouldReduceMotion ? undefined : { opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />

          {/* Stalled Progress Text */}
          <text x="150" y="13" textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize="9" fontWeight="bold">
            TIMEOUT // 30,000ms EXCEEDED
          </text>
        </g>

        {/* Digital Holographic Countdown Display Box */}
        <g transform="translate(160, 275)">
          <rect x="0" y="0" width="180" height="38" rx="6" fill="#0A0B10" stroke="#F59E0B" strokeWidth="1.5" />
          <motion.text
            x="90"
            y="25"
            textAnchor="middle"
            fill="#F59E0B"
            fontFamily="monospace"
            fontSize="18"
            fontWeight="bold"
            letterSpacing="3"
            filter="url(#timeoutGlow)"
            animate={shouldReduceMotion ? undefined : { opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            00:00:00
          </motion.text>
        </g>

        {/* Interrupted Signal Packets */}
        <path d="M 120 180 L 170 180" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 330 180 L 380 180" stroke="#71717A" strokeWidth="2" strokeDasharray="4 4" />

        {/* Glitched 408 Header Tag */}
        <text x="250" y="460" textAnchor="middle" fill="#F59E0B" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="4">
          REQ_TIMEOUT // 408
        </text>
      </svg>
    </div>
  );
};
