import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const AstronautVoid404Illustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Background portal ambient glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-600/20 via-purple-600/15 to-cyan-500/15 blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_35px_rgba(225,29,72,0.25)]"
        aria-hidden="true"
      >
        <defs>
          {/* Cyberpunk Portal Gradients */}
          <linearGradient id="portalRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E2230" />
            <stop offset="100%" stopColor="#0D1017" />
          </linearGradient>

          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#BE123C" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0369A1" stopOpacity="0.9" />
          </linearGradient>

          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="voidGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* Fractured Digital Void Grid Backdrop */}
        <circle cx="250" cy="250" r="210" fill="url(#voidGrid)" />
        <circle cx="250" cy="250" r="210" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 6" />

        {/* Pulsing Outer Portal Vortex Rings */}
        <motion.circle
          cx="250"
          cy="250"
          r="185"
          stroke="url(#portalRing)"
          strokeWidth="2.5"
          strokeDasharray="60 30 15 30"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '250px 250px' }}
        />
        <motion.circle
          cx="250"
          cy="250"
          r="160"
          stroke="#06B6D4"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeDasharray="10 20 40 10"
          animate={shouldReduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '250px 250px' }}
        />

        {/* Glitched Background 404 Typography */}
        <text
          x="250"
          y="180"
          textAnchor="middle"
          fill="none"
          stroke="rgba(244,63,94,0.16)"
          strokeWidth="2"
          fontFamily="monospace"
          fontWeight="900"
          fontSize="110"
          letterSpacing="12"
        >
          404
        </text>

        {/* Broken Interface Fragments (Torn Web Components drifting) */}
        {/* Fragment 1: Broken Nav Pill */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [-6, 6, -6], rotate: [-4, 3, -4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect x="75" y="110" width="85" height="26" rx="4" fill="#131722" stroke="#F43F5E" strokeWidth="1.2" opacity="0.85" />
          <line x1="85" y1="123" x2="115" y2="123" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
          <circle cx="145" cy="123" r="3" fill="#06B6D4" />
        </motion.g>

        {/* Fragment 2: Broken Window Header */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [8, -8, 8], rotate: [5, -3, 5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect x="330" y="320" width="100" height="42" rx="4" fill="#131722" stroke="#8B5CF6" strokeWidth="1.2" opacity="0.85" />
          <line x1="330" y1="332" x2="430" y2="332" stroke="#8B5CF6" strokeWidth="0.8" opacity="0.5" />
          <circle cx="340" cy="326" r="2" fill="#F43F5E" />
          <circle cx="346" cy="326" r="2" fill="#F59E0B" />
          <circle cx="352" cy="326" r="2" fill="#10B981" />
          <line x1="340" y1="346" x2="400" y2="346" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <line x1="340" y1="353" x2="380" y2="353" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        </motion.g>

        {/* Fragment 3: Floating Code Tag */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { x: [-5, 5, -5], y: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect x="345" y="130" width="75" height="24" rx="3" fill="#0D111A" stroke="#06B6D4" strokeWidth="1" opacity="0.8" />
          <text x="382" y="146" textAnchor="middle" fill="#06B6D4" fontFamily="monospace" fontSize="10" fontWeight="bold">
            &lt;null/&gt;
          </text>
        </motion.g>

        {/* Central Floating Cyberpunk Astronaut */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [-12, 12, -12], rotate: [-2, 2, -2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '250px 260px' }}
        >
          {/* Life support cable drifting into void */}
          <path
            d="M 230 320 C 200 360, 160 370, 120 420 C 100 445, 80 430, 60 450"
            stroke="url(#portalRing)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="8 4"
          />

          {/* Astronaut Backpack / Thruster unit */}
          <rect x="215" y="220" width="70" height="85" rx="10" fill="#0A0D14" stroke="#3F3F46" strokeWidth="2" />
          <circle cx="230" cy="235" r="4" fill="#06B6D4" filter="url(#neonGlow)" />
          <circle cx="230" cy="248" r="4" fill="#F43F5E" filter="url(#neonGlow)" />

          {/* Left Arm reaching out */}
          <path
            d="M 220 240 C 190 235, 175 220, 165 200"
            stroke="#272E3F"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="162" cy="195" r="10" fill="#F43F5E" stroke="#1E2230" strokeWidth="2" />

          {/* Right Arm grasping */}
          <path
            d="M 280 240 C 310 245, 325 260, 335 285"
            stroke="#272E3F"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="338" cy="290" r="10" fill="#3B82F6" stroke="#1E2230" strokeWidth="2" />

          {/* Legs floating in zero-G */}
          <path
            d="M 235 300 C 225 335, 210 360, 195 385"
            stroke="#1E2230"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="190" cy="390" rx="11" ry="8" fill="#F43F5E" />

          <path
            d="M 265 300 C 275 330, 290 355, 305 380"
            stroke="#1E2230"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="310" cy="385" rx="11" ry="8" fill="#06B6D4" />

          {/* Main Torso Suit */}
          <rect x="222" y="225" width="56" height="78" rx="12" fill="url(#suitGrad)" stroke="#52525B" strokeWidth="2" />
          <rect x="233" y="240" width="34" height="26" rx="4" fill="#0A0D14" stroke="#F43F5E" strokeWidth="1" />
          <line x1="238" y1="248" x2="262" y2="248" stroke="#06B6D4" strokeWidth="1.5" />
          <line x1="238" y1="254" x2="256" y2="254" stroke="#F43F5E" strokeWidth="1.5" />

          {/* Helmet Base & Dome */}
          <circle cx="250" cy="195" r="32" fill="#181D29" stroke="#71717A" strokeWidth="2.5" />
          {/* Reflective Neon Holographic Visor */}
          <path
            d="M 232 185 C 232 173, 268 173, 268 185 C 268 202, 232 202, 232 185 Z"
            fill="url(#visorGrad)"
            stroke="#FFFFFF"
            strokeWidth="1"
          />
          {/* Visor Glint Reflection */}
          <path
            d="M 237 180 Q 248 176 258 178"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </motion.g>

        {/* Digital Space Dust / Glitch Particles */}
        <circle cx="130" cy="170" r="1.5" fill="#F43F5E" filter="url(#neonGlow)" />
        <circle cx="380" cy="210" r="2" fill="#06B6D4" filter="url(#neonGlow)" />
        <circle cx="160" cy="320" r="1.5" fill="#8B5CF6" />
        <circle cx="310" cy="100" r="2" fill="#F43F5E" />
        <circle cx="270" cy="420" r="1.5" fill="#06B6D4" />

        {/* Digital Coordinates HUD Overlay */}
        <text x="80" y="420" fill="rgba(255,255,255,0.3)" fontFamily="monospace" fontSize="8" letterSpacing="1">
          SEC: 0x404 // VOID_LOC
        </text>
        <text x="350" y="80" fill="rgba(244,63,94,0.5)" fontFamily="monospace" fontSize="8" letterSpacing="1">
          STATUS: SIGNAL_LOST
        </text>
      </svg>
    </div>
  );
};
