import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const RestrictedZone403Illustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Neon Red/Purple Security Perimeter Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-700/25 via-purple-600/20 to-red-600/15 blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_35px_rgba(225,29,72,0.25)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#BE123C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.85" />
          </linearGradient>

          <filter id="gateGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Security Perimeter Outer Frame */}
        <polygon
          points="250,50 430,140 430,360 250,450 70,360 70,140"
          fill="#0C0E14"
          stroke="#3F3F46"
          strokeWidth="2"
        />

        {/* Rotating Concentric Security Verification Hex Rings */}
        <motion.polygon
          points="250,75 405,152 405,348 250,425 95,348 95,152"
          stroke="#F43F5E"
          strokeWidth="1.5"
          strokeDasharray="40 20 10 20"
          fill="none"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '250px 250px' }}
        />
        <motion.polygon
          points="250,95 385,162 385,338 250,405 115,338 115,162"
          stroke="#8B5CF6"
          strokeWidth="1"
          strokeDasharray="20 15"
          fill="none"
          opacity="0.5"
          animate={shouldReduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '250px 250px' }}
        />

        {/* Heavy Armored Security Bulkhead Door Gate */}
        <g transform="translate(150, 140)">
          {/* Main Shield Hologram */}
          <path
            d="M 100 10 L 180 50 C 180 160, 100 210, 100 210 C 100 210, 20 160, 20 50 Z"
            fill="url(#shieldGrad)"
            stroke="#F43F5E"
            strokeWidth="2.5"
            filter="url(#gateGlow)"
          />

          {/* Holographic Security Grid Lines inside Shield */}
          <path d="M 40 70 L 160 70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <path d="M 50 110 L 150 110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <path d="M 70 150 L 130 150" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* Central Heavy Digital Padlock */}
          {/* Shackle */}
          <path
            d="M 78 95 L 78 72 C 78 60, 122 60, 122 72 L 122 95"
            stroke="#F43F5E"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            filter="url(#gateGlow)"
          />
          {/* Lock Body */}
          <rect x="65" y="90" width="70" height="58" rx="8" fill="#0E121D" stroke="#F43F5E" strokeWidth="2.5" />
          <circle cx="100" cy="115" r="7" fill="#F43F5E" filter="url(#gateGlow)" />
          <path d="M 97 122 L 103 122 L 101 133 L 99 133 Z" fill="#F43F5E" />

          {/* Access Denied Red Stamp Badge */}
          <rect x="35" y="155" width="130" height="24" rx="3" fill="#DC2626" />
          <text x="100" y="171" textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="2">
            ACCESS DENIED
          </text>
        </g>

        {/* Biometric Laser Scanner Beams (Sweeping horizontally) */}
        <motion.line
          x1="100"
          y1="190"
          x2="400"
          y2="190"
          stroke="#EF4444"
          strokeWidth="2"
          filter="url(#gateGlow)"
          animate={shouldReduceMotion ? undefined : { y: [0, 120, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Telemetry Corner Brackets */}
        <path d="M 85 155 L 85 135 L 105 135" stroke="#F43F5E" strokeWidth="2" fill="none" />
        <path d="M 415 155 L 415 135 L 395 135" stroke="#F43F5E" strokeWidth="2" fill="none" />
        <path d="M 85 345 L 85 365 L 105 365" stroke="#F43F5E" strokeWidth="2" fill="none" />
        <path d="M 415 345 L 415 365 L 395 365" stroke="#F43F5E" strokeWidth="2" fill="none" />

        {/* Telemetry Readouts */}
        <text x="250" y="475" textAnchor="middle" fill="#F43F5E" fontFamily="monospace" fontSize="11" fontWeight="bold" letterSpacing="4">
          ZONE: RESTRICTED // 403
        </text>
      </svg>
    </div>
  );
};
