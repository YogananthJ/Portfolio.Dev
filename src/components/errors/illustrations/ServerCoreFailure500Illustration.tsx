import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const ServerCoreFailure500Illustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Red Critical Core Breach Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-700/25 via-red-600/20 to-orange-500/15 blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_35px_rgba(239,68,68,0.3)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="coreOverheat" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>

          <linearGradient id="warningStripes" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <filter id="coreGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Server Rack Outer Chassis */}
        <rect x="80" y="60" width="340" height="380" rx="12" fill="#0C0E14" stroke="#3F3F46" strokeWidth="2" />
        
        {/* Chassis Ventilation Slits (Top & Bottom) */}
        {[85, 95, 105, 395, 405, 415].map((y) => (
          <line key={y} x1="120" y1={y} x2="380" y2={y} stroke="#27272A" strokeWidth="3" strokeLinecap="round" />
        ))}

        {/* Server Blade Tray 1 (Faulty) */}
        <rect x="105" y="125" width="290" height="48" rx="4" fill="#141824" stroke="#EF4444" strokeWidth="1.5" />
        <circle cx="125" cy="149" r="5" fill="#EF4444" filter="url(#coreGlow)" />
        <text x="140" y="153" fill="#EF4444" fontFamily="monospace" fontSize="10" fontWeight="bold">BLADE_01: KERNEL_PANIC</text>
        <rect x="330" y="141" width="50" height="16" rx="2" fill="#27272A" />
        <text x="355" y="153" textAnchor="middle" fill="#EF4444" fontFamily="monospace" fontSize="8" fontWeight="bold">HALT</text>

        {/* Central Cylindrical Server Reactor Core (Meltdown Breach) */}
        <g transform="translate(140, 190)">
          {/* Reactor Chamber Outer Housing */}
          <rect x="0" y="0" width="220" height="180" rx="10" fill="#0A0B0F" stroke="#52525B" strokeWidth="2" />
          
          {/* Glass Containment Tube */}
          <rect x="35" y="15" width="150" height="150" rx="75" fill="#180A0A" stroke="#EF4444" strokeWidth="2" />
          
          {/* Internal Plasma Coils with Overheating Warning Pulse */}
          <motion.circle
            cx="110"
            cy="90"
            r="55"
            fill="url(#coreOverheat)"
            filter="url(#coreGlow)"
            animate={shouldReduceMotion ? undefined : { scale: [0.95, 1.05, 0.95], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Fractured Core Breach Lightning / Sparks */}
          <motion.path
            d="M 90 60 L 115 85 L 105 100 L 130 120"
            stroke="#FEF08A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#coreGlow)"
            animate={shouldReduceMotion ? undefined : { opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />

          {/* Warning Core Temperature HUD Badge */}
          <rect x="65" y="80" width="90" height="22" rx="3" fill="#000000" stroke="#EF4444" strokeWidth="1" />
          <text x="110" y="95" textAnchor="middle" fill="#F87171" fontFamily="monospace" fontSize="9" fontWeight="bold">
            CORE: 1420°C
          </text>
        </g>

        {/* Diagnostic Bus Bars (Disconnected Left & Right) */}
        <line x1="80" y1="280" x2="140" y2="280" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 4" />
        <line x1="360" y1="280" x2="420" y2="280" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 4" />

        {/* Blinking Emergency Strobe Lights */}
        <motion.circle
          cx="100"
          cy="75"
          r="4"
          fill="#EF4444"
          filter="url(#coreGlow)"
          animate={shouldReduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
        <motion.circle
          cx="400"
          cy="75"
          r="4"
          fill="#EF4444"
          filter="url(#coreGlow)"
          animate={shouldReduceMotion ? undefined : { opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />

        {/* Warning Hazard Stripe Banner */}
        <rect x="105" y="380" width="290" height="10" fill="url(#warningStripes)" opacity="0.8" />

        {/* Big Glitched 500 Stamp */}
        <text
          x="250"
          y="435"
          textAnchor="middle"
          fill="none"
          stroke="#EF4444"
          strokeWidth="1.5"
          fontFamily="monospace"
          fontWeight="900"
          fontSize="48"
          letterSpacing="8"
          opacity="0.85"
        >
          SYS_ERR: 500
        </text>
      </svg>
    </div>
  );
};
