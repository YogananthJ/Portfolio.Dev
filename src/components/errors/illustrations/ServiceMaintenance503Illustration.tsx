import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const ServiceMaintenance503Illustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[580px] lg:max-w-[660px] aspect-[16/13] sm:aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Cyan/Amber/Emerald Maintenance Station Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600/20 via-cyan-600/15 to-emerald-600/15 blur-[85px] pointer-events-none" />

      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_15px_45px_rgba(245,158,11,0.25)]"
        aria-hidden="true"
      >
        <defs>
          {/* Drone Chassis Gradient */}
          <linearGradient id="droneMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          {/* Diagnostic Screen Glass Gradient */}
          <linearGradient id="screenGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#060913" stopOpacity="0.75" />
          </linearGradient>

          {/* Maintenance Glow Filter */}
          <filter id="maintGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="stationBayGrid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M 22 0 L 0 0 0 22" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* 1. Maintenance Station Orbital Drydock Bay Backdrop */}
        <rect x="50" y="40" width="500" height="520" rx="20" fill="#070A11" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        <rect x="50" y="40" width="500" height="520" rx="20" fill="url(#stationBayGrid)" />

        {/* Industrial Scaffolding Trusses (Left, Right, Top) */}
        <path d="M 50 120 L 150 120 L 170 140 L 170 460 L 50 460" stroke="#1E293B" strokeWidth="2.5" fill="none" />
        <path d="M 550 120 L 450 120 L 430 140 L 430 460 L 550 460" stroke="#1E293B" strokeWidth="2.5" fill="none" />
        <line x1="170" y1="140" x2="430" y2="140" stroke="#334155" strokeWidth="3" />

        {/* Subtle Status Light Tickers on Scaffolding */}
        <circle cx="100" cy="120" r="4" fill="#22C55E" />
        <circle cx="500" cy="120" r="4" fill="#F59E0B" />
        <circle cx="170" cy="300" r="4" fill="#06B6D4" />
        <circle cx="430" cy="300" r="4" fill="#F43F5E" />

        {/* 2. Damaged System Component Being Repaired (Central Power Cell Rack) */}
        <g id="damagedComponent" transform="translate(160, 200)">
          {/* Component Chassis */}
          <rect x="0" y="0" width="200" height="230" rx="12" fill="#0B0E17" stroke="#334155" strokeWidth="2" />
          
          {/* Circuit Board Array Layers */}
          <rect x="20" y="20" width="160" height="85" rx="6" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
          {/* Circuit Traces */}
          <path d="M 35 45 L 85 45 L 95 65 L 145 65" stroke="#22C55E" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
          <path d="M 35 75 L 75 75 L 85 55 L 135 55" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
          <circle cx="145" cy="65" r="3" fill="#22C55E" />
          <circle cx="135" cy="55" r="3" fill="#F59E0B" />

          {/* Lower Exposed Gear / Turbine Core Assembly */}
          <g transform="translate(100, 165)">
            <motion.circle
              cx="0"
              cy="0"
              r="38"
              stroke="#64748B"
              strokeWidth="7"
              strokeDasharray="18 12"
              fill="none"
              animate={shouldReduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />
            <circle cx="0" cy="0" r="22" fill="#1E293B" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="10" fill="#F59E0B" filter="url(#maintGlow)" />
          </g>

          {/* Component Warning Tag */}
          <rect x="55" y="105" width="90" height="18" rx="2" fill="#451A03" stroke="#F59E0B" strokeWidth="1" />
          <text x="100" y="117" textAnchor="middle" fill="#FDE047" fontFamily="monospace" fontSize="8" fontWeight="bold">
            RECALIBRATING_CHIP
          </text>
        </g>

        {/* 3. Floating Holographic Diagnostic Screens */}
        {/* Diagnostic Screen A (Top-Left) */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [-6, 6, -6], rotate: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '140px 140px' }}
        >
          <rect x="75" y="100" width="135" height="80" rx="6" fill="url(#screenGlass)" stroke="#06B6D4" strokeWidth="1.5" filter="url(#maintGlow)" />
          <text x="88" y="120" fill="#06B6D4" fontFamily="monospace" fontSize="8" fontWeight="bold">DIAGNOSTIC_V4</text>
          <line x1="88" y1="126" x2="195" y2="126" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Animated Diagnostic Progress Bar */}
          <text x="88" y="142" fill="#94A3B8" fontFamily="monospace" fontSize="8">FIRMWARE_RELOAD</text>
          <rect x="88" y="148" width="105" height="8" rx="2" fill="#1E293B" />
          <motion.rect
            x="88"
            y="148"
            width="82"
            height="8"
            rx="2"
            fill="#22C55E"
            animate={shouldReduceMotion ? undefined : { width: [30, 85, 30] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <text x="88" y="168" fill="#F59E0B" fontFamily="monospace" fontSize="7">&gt;&gt; STABILIZING: 78.4%</text>
        </motion.g>

        {/* Diagnostic Screen B (Bottom-Right Schematic) */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [5, -5, 5], rotate: [2, -2, 2] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '460px 440px' }}
        >
          <rect x="390" y="405" width="145" height="70" rx="6" fill="url(#screenGlass)" stroke="#F43F5E" strokeWidth="1.5" />
          <text x="404" y="425" fill="#F43F5E" fontFamily="monospace" fontSize="8" fontWeight="bold">MODULE_503_STATUS</text>
          <line x1="404" y1="432" x2="520" y2="432" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <text x="404" y="448" fill="#E2E8F0" fontFamily="monospace" fontSize="8">MAINTENANCE_BAY_07</text>
          <text x="404" y="462" fill="#22C55E" fontFamily="monospace" fontSize="8">SAFETY_CONDUITS: OK</text>
        </motion.g>

        {/* 4. Small Futuristic Repair Robot / Drone Hovering */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { 
            y: [-12, 12, -12], 
            x: [-4, 4, -4],
            rotate: [-3, 3, -3] 
          }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '420px 240px' }}
        >
          {/* Dual Thruster Pods (Left & Right) */}
          <rect x="375" y="215" width="12" height="38" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <rect x="445" y="215" width="12" height="38" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          
          {/* Thruster Flame Jets */}
          <motion.circle
            cx="381"
            cy="260"
            r="4"
            fill="#06B6D4"
            filter="url(#maintGlow)"
            animate={shouldReduceMotion ? undefined : { r: [2, 5, 2], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <motion.circle
            cx="451"
            cy="260"
            r="4"
            fill="#06B6D4"
            filter="url(#maintGlow)"
            animate={shouldReduceMotion ? undefined : { r: [5, 2, 5], opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />

          {/* Spherical Drone Main Body Chassis */}
          <ellipse cx="416" cy="235" rx="36" ry="28" fill="#182033" stroke="url(#droneMetal)" strokeWidth="2.5" filter="url(#maintGlow)" />

          {/* Drone Cyclops Optical Scanner Lens */}
          <circle cx="405" cy="235" r="12" fill="#080C14" stroke="#22C55E" strokeWidth="2" />
          <circle cx="405" cy="235" r="6" fill="#22C55E" filter="url(#maintGlow)" />
          <circle cx="403" cy="233" r="2" fill="#FFFFFF" />

          {/* Antenna Transceiver */}
          <line x1="425" y1="207" x2="435" y2="185" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="435" cy="185" r="3.5" fill="#F43F5E" />

          {/* Multi-Jointed Robotic Repair Articulated Arm (Reaching toward component) */}
          <path d="M 390 252 L 350 280 L 290 270" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="350" cy="280" r="4.5" fill="#334155" />
          
          {/* Plasma Welding Torch Head */}
          <rect x="278" y="264" width="14" height="12" rx="2" fill="#F59E0B" />
          <line x1="278" y1="270" x2="265" y2="270" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />

          {/* Laser Welding Sparks Flying into Component */}
          <motion.g
            animate={shouldReduceMotion ? undefined : { opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.55, repeat: Infinity }}
          >
            <circle cx="260" cy="270" r="4" fill="#FFFFFF" filter="url(#maintGlow)" />
            <line x1="260" y1="270" x2="245" y2="262" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
            <line x1="260" y1="270" x2="250" y2="282" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
            <line x1="260" y1="270" x2="248" y2="270" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>
        </motion.g>

        {/* 5. Floating Diagnostic Tools */}
        {/* Floating Tool: Holographic Digital Torque Calibrator (Hovering near robot) */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [-8, 8, -8], rotate: [-8, 8, -8] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '480px 180px' }}
        >
          <path d="M 470 170 L 495 195 M 480 165 L 490 175 M 490 190 L 500 200" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" filter="url(#maintGlow)" />
        </motion.g>

        {/* Floating Tool: Laser Level Wand (Hovering left) */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [7, -7, 7], rotate: [5, -5, 5] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '140px 370px' }}
        >
          <line x1="125" y1="360" x2="155" y2="390" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" filter="url(#maintGlow)" />
        </motion.g>

        {/* 6. Maintenance Bay Status Ticker Banner */}
        <g transform="translate(180, 485)">
          <rect x="0" y="0" width="240" height="28" rx="4" fill="#0B101D" stroke="rgba(34,197,94,0.4)" strokeWidth="1.2" />
          <circle cx="16" cy="14" r="4" fill="#22C55E" filter="url(#maintGlow)" />
          <text x="28" y="18" fill="#22C55E" fontFamily="monospace" fontSize="9" fontWeight="bold">
            BAY_07 // SYSTEM_REPAIR_ACTIVE
          </text>
        </g>
      </svg>
    </div>
  );
};
