import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const SignalLostOfflineIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Amber/Red Ambient Offline Warning Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600/20 via-rose-600/15 to-zinc-800/30 blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_35px_rgba(245,158,11,0.2)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="offlineLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#3F3F46" />
          </linearGradient>

          <pattern id="offlineGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.75" />
          </pattern>

          <filter id="warnGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Radar / Scope Grid */}
        <rect x="50" y="50" width="400" height="400" rx="16" fill="#0C0E14" stroke="#27272A" strokeWidth="1.5" />
        <rect x="50" y="50" width="400" height="400" rx="16" fill="url(#offlineGrid)" />

        {/* Concentric Radar Disconnection Rings */}
        <circle cx="250" cy="230" r="140" stroke="#3F3F46" strokeWidth="1" strokeDasharray="4 8" opacity="0.6" />
        <circle cx="250" cy="230" r="95" stroke="#3F3F46" strokeWidth="1" strokeDasharray="3 6" opacity="0.8" />
        <circle cx="250" cy="230" r="50" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="2 4" opacity="0.5" />

        {/* Central Broken Wi-Fi / Satellite Transmitter Antenna */}
        <path d="M 250 330 L 250 250" stroke="#71717A" strokeWidth="4" strokeLinecap="round" />
        <path d="M 225 345 L 250 330 L 275 345" stroke="#71717A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="250" cy="250" r="8" fill="#EF4444" filter="url(#warnGlow)" />

        {/* Fragmented Broken Wi-Fi Radiation Waves */}
        {/* Wave 1 (Inner - Broken) */}
        <motion.path
          d="M 215 220 A 45 45 0 0 1 240 205"
          stroke="#F59E0B"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          animate={shouldReduceMotion ? undefined : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <path d="M 260 205 A 45 45 0 0 1 285 220" stroke="#71717A" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 4" fill="none" />

        {/* Wave 2 (Middle - Severed) */}
        <motion.path
          d="M 190 195 A 80 80 0 0 1 230 170"
          stroke="#EF4444"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          animate={shouldReduceMotion ? undefined : { opacity: [1, 0.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <path d="M 270 170 A 80 80 0 0 1 310 195" stroke="#3F3F46" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 6" fill="none" />

        {/* Wave 3 (Outer - Faded Disconnected) */}
        <path d="M 165 170 A 115 115 0 0 1 220 135" stroke="#3F3F46" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 8" fill="none" />
        <path d="M 280 135 A 115 115 0 0 1 335 170" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 8" opacity="0.6" fill="none" />

        {/* Broken Signal Slash Icon right over transmitter */}
        <motion.line
          x1="200"
          y1="280"
          x2="300"
          y2="180"
          stroke="#EF4444"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#warnGlow)"
          animate={shouldReduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />

        {/* Floating Disconnected Network Nodes */}
        {/* Node A (Upper Left) */}
        <g>
          <line x1="120" y1="130" x2="190" y2="180" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" />
          <circle cx="120" cy="130" r="12" fill="#18181B" stroke="#EF4444" strokeWidth="2" />
          <text x="120" y="133" textAnchor="middle" fill="#EF4444" fontFamily="monospace" fontSize="9" fontWeight="bold">01</text>
        </g>

        {/* Node B (Upper Right - Unreachable) */}
        <g>
          <line x1="380" y1="140" x2="310" y2="185" stroke="#3F3F46" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.4" />
          <circle cx="380" cy="140" r="12" fill="#18181B" stroke="#71717A" strokeWidth="1.5" />
          <text x="380" y="143" textAnchor="middle" fill="#A1A1AA" fontFamily="monospace" fontSize="9">??</text>
        </g>

        {/* Node C (Lower Left - Packet Loss) */}
        <g>
          <line x1="110" y1="310" x2="180" y2="280" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.5" />
          <circle cx="110" cy="310" r="10" fill="#18181B" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="110" y="313" textAnchor="middle" fill="#F59E0B" fontFamily="monospace" fontSize="8">ERR</text>
        </g>

        {/* Node D (Lower Right - Offline Server) */}
        <g>
          <line x1="390" y1="310" x2="310" y2="290" stroke="#3F3F46" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.4" />
          <circle cx="390" cy="310" r="11" fill="#18181B" stroke="#3F3F46" strokeWidth="1.5" />
          <text x="390" y="313" textAnchor="middle" fill="#71717A" fontFamily="monospace" fontSize="8">OFF</text>
        </g>

        {/* Waveform Flatline Oscilloscope Banner at Bottom */}
        <g transform="translate(70, 380)">
          <rect x="0" y="0" width="360" height="42" rx="6" fill="#12151E" stroke="#27272A" strokeWidth="1" />
          <path
            d="M 15 21 L 80 21 L 95 6 L 110 36 L 125 12 L 140 21 L 220 21 L 230 18 L 240 21 L 345 21"
            stroke="#EF4444"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Signal Flatline Marker */}
          <circle cx="345" cy="21" r="3" fill="#EF4444" filter="url(#warnGlow)" />
        </g>

        {/* HUD Telemetry text */}
        <text x="80" y="80" fill="#EF4444" fontFamily="monospace" fontSize="9" fontWeight="bold">
          CARRIER_SIGNAL: 0.00 dBm // DROPPED
        </text>
        <text x="420" y="80" textAnchor="end" fill="rgba(255,255,255,0.4)" fontFamily="monospace" fontSize="9">
          PACKET_LOSS: 100%
        </text>
      </svg>
    </div>
  );
};
