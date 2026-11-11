import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const RestrictedZone403Illustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[580px] lg:max-w-[660px] aspect-[16/13] sm:aspect-square flex items-center justify-center select-none ${className}`}>
      {/* High-Security Crimson Perimeter Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-700/25 via-red-600/20 to-purple-700/15 blur-[85px] pointer-events-none" />

      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_15px_45px_rgba(244,63,94,0.35)]"
        aria-hidden="true"
      >
        <defs>
          {/* Holographic Security Shield Gradient */}
          <linearGradient id="shieldForcefield" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#BE123C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1E1228" stopOpacity="0.9" />
          </linearGradient>

          {/* Heavy Bulkhead Steel Gradient */}
          <linearGradient id="bulkheadSteel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#181D2A" />
            <stop offset="50%" stopColor="#0E121B" />
            <stop offset="100%" stopColor="#181D2A" />
          </linearGradient>

          {/* Security Gate Glow */}
          <filter id="shieldGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="securityGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(244,63,94,0.08)" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* 1. Massive Futuristic Security Gate Corridor Frame */}
        <rect x="50" y="40" width="500" height="520" rx="16" fill="#07090F" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        <rect x="50" y="40" width="500" height="520" rx="16" fill="url(#securityGrid)" />

        {/* Outer Heavy Hydraulic Gate Pillars (Left & Right) */}
        <rect x="60" y="55" width="85" height="490" rx="8" fill="url(#bulkheadSteel)" stroke="#334155" strokeWidth="2" />
        <rect x="455" y="55" width="85" height="490" rx="8" fill="url(#bulkheadSteel)" stroke="#334155" strokeWidth="2" />

        {/* Hydraulic Pistons & Reinforcement Ribs on Gate Pillars */}
        {[100, 180, 260, 340, 420].map((y) => (
          <g key={y}>
            <rect x="75" y={y} width="55" height="18" rx="3" fill="#0F172A" stroke="#475569" strokeWidth="1" />
            <circle cx="85" cy={y + 9} r="3" fill="#F43F5E" />
            <rect x="470" y={y} width="55" height="18" rx="3" fill="#0F172A" stroke="#475569" strokeWidth="1" />
            <circle cx="515" cy={y + 9} r="3" fill="#F43F5E" />
          </g>
        ))}

        {/* Laser Tripwires Crossing the Corridor */}
        {[140, 220, 380, 460].map((y) => (
          <line
            key={`laser-${y}`}
            x1="145"
            y1={y}
            x2="455"
            y2={y}
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.5"
          />
        ))}

        {/* 2. Concentric Rotating Security Hexagonal Rings */}
        <motion.polygon
          points="300,90 440,170 440,370 300,450 160,370 160,170"
          stroke="#F43F5E"
          strokeWidth="2"
          strokeDasharray="40 20 15 20"
          fill="none"
          filter="url(#shieldGlow)"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '300px 270px' }}
        />
        <motion.polygon
          points="300,115 415,182 415,358 300,425 185,358 185,182"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          strokeDasharray="25 15"
          fill="none"
          opacity="0.6"
          animate={shouldReduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '300px 270px' }}
        />

        {/* 3. Glowing Red Holographic Forcefield Shield */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { 
            scale: [0.99, 1.02, 0.99],
            opacity: [0.85, 1, 0.85]
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '300px 270px' }}
        >
          {/* Main Crest Shield */}
          <path
            d="M 300 130 L 415 185 C 415 340, 300 410, 300 410 C 300 410, 185 340, 185 185 Z"
            fill="url(#shieldForcefield)"
            stroke="#F43F5E"
            strokeWidth="3.5"
            filter="url(#shieldGlow)"
          />

          {/* Internal Holographic Security Grid Lines */}
          <path d="M 215 210 L 385 210" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          <path d="M 230 260 L 370 260" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          <path d="M 255 310 L 345 310" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        </motion.g>

        {/* 4. Heavy Digital Padlock & Biometric Scanner Panel */}
        {/* Shackle */}
        <path
          d="M 268 235 L 268 200 C 268 180, 332 180, 332 200 L 332 235"
          stroke="#F43F5E"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          filter="url(#shieldGlow)"
        />
        {/* Padlock Body */}
        <rect x="250" y="230" width="100" height="85" rx="12" fill="#0C0F1A" stroke="#F43F5E" strokeWidth="3" filter="url(#shieldGlow)" />
        
        {/* Biometric Palm/Retina Scanner Display */}
        <circle cx="300" cy="265" r="14" fill="#180C14" stroke="#F43F5E" strokeWidth="2" />
        <circle cx="300" cy="265" r="6" fill="#F43F5E" filter="url(#shieldGlow)" />
        <rect x="280" y="290" width="40" height="12" rx="2" fill="#0F172A" />
        <text x="300" y="299" textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize="7" fontWeight="bold">LOCKED</text>

        {/* 5. Animated Laser Security Scanner Sweeping Across Screen */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [-110, 110, -110] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Main Laser Sweep Beam */}
          <line x1="160" y1="270" x2="440" y2="270" stroke="#EF4444" strokeWidth="3" filter="url(#shieldGlow)" />
          {/* Faint Laser Scan Field */}
          <polygon points="160,270 440,270 420,295 180,295" fill="rgba(239,68,68,0.15)" />
        </motion.g>

        {/* 6. Restricted Access Warning Banner Stamp */}
        <g transform="translate(165, 435)">
          <rect x="0" y="0" width="270" height="34" rx="4" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1" filter="url(#shieldGlow)" />
          <text x="135" y="22" textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize="11" fontWeight="900" letterSpacing="2">
            RESTRICTED // ACCESS DENIED
          </text>
        </g>

        {/* Pulsing Red Warning Beacon Strobes */}
        <motion.circle
          cx="102"
          cy="75"
          r="9"
          fill="#EF4444"
          filter="url(#shieldGlow)"
          animate={shouldReduceMotion ? undefined : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
        <motion.circle
          cx="498"
          cy="75"
          r="9"
          fill="#EF4444"
          filter="url(#shieldGlow)"
          animate={shouldReduceMotion ? undefined : { opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      </svg>
    </div>
  );
};
