import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const SignalLostOfflineIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[580px] lg:max-w-[660px] aspect-[16/13] sm:aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Cyan/Rose Signal Disconnection Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-600/20 via-cyan-600/15 to-purple-600/10 blur-[80px] pointer-events-none" />

      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_15px_40px_rgba(6,182,212,0.25)]"
        aria-hidden="true"
      >
        <defs>
          {/* Signal Wave Cyan-to-Pink Gradient */}
          <linearGradient id="signalWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>

          {/* Deep Station Background */}
          <radialGradient id="stationChamber" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B0E17" />
            <stop offset="70%" stopColor="#07090F" />
            <stop offset="100%" stopColor="#030408" />
          </radialGradient>

          {/* Cyber Neon Glow */}
          <filter id="signalGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="stationGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* 1. Dark Futuristic Communication Station Backdrop */}
        <rect x="50" y="50" width="500" height="500" rx="20" fill="url(#stationChamber)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        <rect x="50" y="50" width="500" height="500" rx="20" fill="url(#stationGrid)" />

        {/* Outer Circular Telemetry Reticle */}
        <circle cx="300" cy="270" r="190" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="8 6" />
        <circle cx="300" cy="270" r="135" stroke="rgba(6,182,212,0.15)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="300" cy="270" r="80" stroke="rgba(244,63,94,0.2)" strokeWidth="1" strokeDasharray="2 4" />

        {/* Rotating Radar Reconnection Sweep Arm */}
        <motion.line
          x1="300"
          y1="270"
          x2="300"
          y2="90"
          stroke="url(#signalWaveGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#signalGlow)"
          opacity="0.7"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '300px 270px' }}
        />

        {/* 2. Communication Station Spire & Satellite Transmitter Dish */}
        <g id="transmitterTower">
          {/* Base Structural Struts */}
          <path d="M 230 450 L 270 380 L 330 380 L 370 450" stroke="#334155" strokeWidth="3" strokeLinecap="round" fill="none" />
          <line x1="250" y1="415" x2="350" y2="415" stroke="#1E293B" strokeWidth="2" />
          {/* Central Transmitter Mast Spire */}
          <line x1="300" y1="380" x2="300" y2="280" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
          {/* Parabolic Antenna Dish */}
          <path d="M 245 285 Q 300 320 355 285" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Feed Horn Stems */}
          <line x1="260" y1="285" x2="300" y2="255" stroke="#475569" strokeWidth="2" />
          <line x1="340" y1="285" x2="300" y2="255" stroke="#475569" strokeWidth="2" />
          {/* Primary Beacon Emitter Core */}
          <circle cx="300" cy="255" r="9" fill="#F43F5E" filter="url(#signalGlow)" />
          <circle cx="300" cy="255" r="4" fill="#FFFFFF" />
        </g>

        {/* 3. Pink & Cyan Signal Waves Fading into Darkness */}
        {/* Signal Wave 1 (Inner Arc - Radiating Outward) */}
        <motion.path
          d="M 235 220 A 75 75 0 0 1 365 220"
          stroke="#06B6D4"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#signalGlow)"
          animate={shouldReduceMotion ? undefined : { 
            opacity: [0.9, 0.2, 0.9],
            scale: [0.97, 1.03, 0.97]
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '300px 255px' }}
        />

        {/* Signal Wave 2 (Middle Arc - Severed / Disconnected) */}
        <motion.path
          d="M 200 185 A 120 120 0 0 1 275 145"
          stroke="#F43F5E"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#signalGlow)"
          animate={shouldReduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Right side of Wave 2 broken off */}
        <path d="M 325 145 A 120 120 0 0 1 400 185" stroke="#475569" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 8" fill="none" />

        {/* Signal Wave 3 (Outer Arc - Fading Waves) */}
        <motion.path
          d="M 165 150 A 170 170 0 0 1 245 105"
          stroke="#8B5CF6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="10 10"
          fill="none"
          opacity="0.5"
          animate={shouldReduceMotion ? undefined : { opacity: [0.6, 0.1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 355 105 A 170 170 0 0 1 435 150"
          stroke="#06B6D4"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="8 8"
          fill="none"
          opacity="0.4"
          animate={shouldReduceMotion ? undefined : { opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* 4. Damaged Wi-Fi Signal Hologram with Disruption Breach */}
        <g transform="translate(0, -10)">
          {/* Holographic Breach Slash (Red Diagnostic Cut) */}
          <motion.line
            x1="240"
            y1="310"
            x2="360"
            y2="190"
            stroke="#F43F5E"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#signalGlow)"
            animate={shouldReduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </g>

        {/* 5. Disconnected Glowing Network Nodes with Severed Conduits */}
        {/* Node Alpha (Top Left) */}
        <g>
          <line x1="120" y1="130" x2="235" y2="220" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
          <circle cx="120" cy="130" r="16" fill="#0C101A" stroke="#F43F5E" strokeWidth="2" filter="url(#signalGlow)" />
          <circle cx="120" cy="130" r="6" fill="#F43F5E" />
          <text x="120" y="162" textAnchor="middle" fill="#94A3B8" fontFamily="monospace" fontSize="8" fontWeight="bold">NODE_01//DISCONNECTED</text>
        </g>

        {/* Node Beta (Top Right) */}
        <g>
          <line x1="470" y1="140" x2="365" y2="220" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.4" />
          <circle cx="470" cy="140" r="16" fill="#0C101A" stroke="#06B6D4" strokeWidth="2" />
          <circle cx="470" cy="140" r="6" fill="#475569" />
          <text x="470" y="172" textAnchor="middle" fill="#94A3B8" fontFamily="monospace" fontSize="8" fontWeight="bold">RELAY_B//OFFLINE</text>
        </g>

        {/* Node Gamma (Far Right Lower) */}
        <g>
          <line x1="490" y1="330" x2="355" y2="285" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.3" />
          <circle cx="490" cy="330" r="14" fill="#0C101A" stroke="#8B5CF6" strokeWidth="1.5" />
          <circle cx="490" cy="330" r="4" fill="#64748B" />
        </g>

        {/* 6. Communication Telemetry Monitor & Flatline Waveform */}
        <g transform="translate(110, 470)">
          {/* Telemetry Console Frame */}
          <rect x="0" y="0" width="380" height="55" rx="6" fill="#07090F" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          
          {/* Header */}
          <text x="16" y="20" fill="#94A3B8" fontFamily="monospace" fontSize="9" fontWeight="bold">
            UPLINK_CARRIER: <tspan fill="#F43F5E">LOST</tspan>
          </text>
          <text x="240" y="20" fill="#06B6D4" fontFamily="monospace" fontSize="9" fontWeight="bold">
            AUTONOMOUS_PROBE: ACTIVE
          </text>

          {/* Flatline Signal Waveform Monitor */}
          <path d="M 16 38 L 80 38 L 90 28 L 100 46 L 110 38 L 190 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" opacity="0.7" />
          {/* Flatline dead drop */}
          <motion.path
            d="M 190 38 L 360 38"
            stroke="#F43F5E"
            strokeWidth="2"
            fill="none"
            filter="url(#signalGlow)"
            animate={shouldReduceMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </g>
      </svg>
    </div>
  );
};
