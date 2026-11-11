import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const ServerCoreFailure500Illustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[580px] lg:max-w-[660px] aspect-[16/13] sm:aspect-square flex items-center justify-center select-none ${className}`}>
      {/* High-Intensity Crimson Core Meltdown Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-700/30 via-red-600/25 to-amber-600/15 blur-[85px] pointer-events-none" />

      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_15px_45px_rgba(225,29,72,0.35)]"
        aria-hidden="true"
      >
        <defs>
          {/* Overheating Molten Core Gradient */}
          <radialGradient id="moltenCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="55%" stopColor="#EF4444" />
            <stop offset="85%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#450A0A" />
          </radialGradient>

          {/* Tokamak Reactor Casing Gradient */}
          <linearGradient id="reactorSteel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E2332" />
            <stop offset="50%" stopColor="#0F121C" />
            <stop offset="100%" stopColor="#080A10" />
          </linearGradient>

          {/* Core Energy Glow Filter */}
          <filter id="coreBlastGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="reactorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* 1. Reactor Containment Chamber Backdrop */}
        <rect x="50" y="40" width="500" height="520" rx="20" fill="#07090E" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        <rect x="50" y="40" width="500" height="520" rx="20" fill="url(#reactorGrid)" />

        {/* Hazard Warning Stripes on Upper & Lower Structural Bulkheads */}
        <g opacity="0.3">
          {[60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520].map((x) => (
            <line key={`top-${x}`} x1={x} y1="45" x2={x + 15} y2="65" stroke="#EF4444" strokeWidth="4" />
          ))}
          {[60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520].map((x) => (
            <line key={`bot-${x}`} x1={x} y1="535" x2={x + 15} y2="555" stroke="#EF4444" strokeWidth="4" />
          ))}
        </g>

        {/* 2. Giant Cylindrical Tokamak Energy Reactor Assembly */}
        {/* Outer Heavy Magnetic Containment Ring */}
        <circle cx="300" cy="300" r="195" fill="none" stroke="#1E293B" strokeWidth="22" />
        <circle cx="300" cy="300" r="195" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="14 14" opacity="0.6" />

        {/* Magnetic Clamping Piston Pods (8 radial stabilizers) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 300 300)`}>
            <rect x="286" y="85" width="28" height="34" rx="4" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
            <circle cx="300" cy="100" r="4" fill={angle % 90 === 0 ? '#EF4444' : '#64748B'} filter={angle % 90 === 0 ? 'url(#coreBlastGlow)' : undefined} />
          </g>
        ))}

        {/* Inner Tokamak Vacuum Vessel Ring */}
        <circle cx="300" cy="300" r="150" fill="url(#reactorSteel)" stroke="#334155" strokeWidth="4" />

        {/* 3. Glowing Red Central Intelligence Core (Pulses Irregularly) */}
        <motion.circle
          cx="300"
          cy="300"
          r="95"
          fill="url(#moltenCore)"
          filter="url(#coreBlastGlow)"
          animate={shouldReduceMotion ? undefined : { 
            scale: [0.94, 1.08, 0.98, 1.12, 0.94],
            opacity: [0.85, 1, 0.88, 1, 0.85]
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '300px 300px' }}
        />

        {/* Core Magnetic Confinement Filament Rings */}
        <motion.ellipse
          cx="300"
          cy="300"
          rx="115"
          ry="55"
          stroke="#FDE047"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="20 15 40 10"
          filter="url(#coreBlastGlow)"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '300px 300px' }}
        />
        <motion.ellipse
          cx="300"
          cy="300"
          rx="115"
          ry="55"
          stroke="#06B6D4"
          strokeWidth="2"
          fill="none"
          strokeDasharray="30 25"
          opacity="0.8"
          animate={shouldReduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '300px 300px' }}
        />

        {/* Fractured Energy Arc Leaks / Lightning Sparks */}
        <motion.path
          d="M 270 240 L 295 270 L 280 290 L 325 315 L 305 340 L 335 365"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#coreBlastGlow)"
          animate={shouldReduceMotion ? undefined : { opacity: [0, 1, 0, 0.9, 0, 1, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M 330 250 L 310 275 L 340 300 L 320 330"
          stroke="#FEF08A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#coreBlastGlow)"
          animate={shouldReduceMotion ? undefined : { opacity: [1, 0, 1, 0, 0.8, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />

        {/* 4. Broken Mechanical Components & Severed High-Voltage Cables */}
        {/* Severed Cable Left with Dangling Wire Filament */}
        <path d="M 50 320 Q 120 340 145 320" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 50 320 Q 120 340 145 320" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 4" fill="none" />
        {/* Cable end spark discharge */}
        <motion.circle
          cx="148"
          cy="318"
          r="4"
          fill="#FDE047"
          filter="url(#coreBlastGlow)"
          animate={shouldReduceMotion ? undefined : { scale: [1, 2, 0.8], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />

        {/* Severed Cable Right */}
        <path d="M 550 310 Q 480 330 455 310" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 550 310 Q 480 330 455 310" stroke="#06B6D4" strokeWidth="3" strokeDasharray="6 4" fill="none" />
        <motion.circle
          cx="452"
          cy="308"
          r="4"
          fill="#06B6D4"
          filter="url(#coreBlastGlow)"
          animate={shouldReduceMotion ? undefined : { scale: [0.8, 2, 1], opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />

        {/* 5. Floating System Warnings & Distorted Terminal Fragments */}
        {/* Floating Warning HUD 1: Core Temperature (Top-Right) */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [-5, 5, -5], rotate: [2, -1, 2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '430px 140px' }}
        >
          <rect x="360" y="115" width="165" height="58" rx="6" fill="#14080B" stroke="#EF4444" strokeWidth="1.5" filter="url(#coreBlastGlow)" />
          <text x="375" y="135" fill="#EF4444" fontFamily="monospace" fontSize="9" fontWeight="900" letterSpacing="1">
            ⚠ CRITICAL_OVERHEAT
          </text>
          <text x="375" y="156" fill="#FDE047" fontFamily="monospace" fontSize="13" fontWeight="bold">
            CORE: 1420.8°C
          </text>
        </motion.g>

        {/* Floating Warning HUD 2: Distorted Terminal Error Log (Bottom-Left) */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [6, -6, 6], rotate: [-2, 1, -2] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '150px 450px' }}
        >
          <rect x="75" y="420" width="180" height="65" rx="6" fill="#0C0E17" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" />
          <text x="88" y="440" fill="#EF4444" fontFamily="monospace" fontSize="9" fontWeight="bold">SYS_HALT: 0x500_BREACH</text>
          <text x="88" y="456" fill="#94A3B8" fontFamily="monospace" fontSize="8">KERNEL_THREAD_ABORT</text>
          <text x="88" y="471" fill="#F59E0B" fontFamily="monospace" fontSize="8">&gt;&gt; FAILSAFE_LOCK: ENGAGED</text>
        </motion.g>

        {/* Blinking Hazard Beacon Lights (Top Corners) */}
        <motion.circle
          cx="80"
          cy="75"
          r="8"
          fill="#EF4444"
          filter="url(#coreBlastGlow)"
          animate={shouldReduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <motion.circle
          cx="520"
          cy="75"
          r="8"
          fill="#EF4444"
          filter="url(#coreBlastGlow)"
          animate={shouldReduceMotion ? undefined : { opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </svg>
    </div>
  );
};
