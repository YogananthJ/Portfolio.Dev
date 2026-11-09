import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const ServiceMaintenance503Illustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Amber/Emerald Maintenance Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600/20 via-emerald-600/15 to-blue-600/15 blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_35px_rgba(245,158,11,0.25)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="droneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <filter id="maintGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Maintenance Bay Background Panel */}
        <rect x="70" y="70" width="360" height="360" rx="14" fill="#0C0F17" stroke="#3F3F46" strokeWidth="2" />

        {/* Wall Circuit Boards Under Repair */}
        <g stroke="#27272A" strokeWidth="1.5">
          <path d="M 100 120 L 160 120 L 180 140 L 220 140" />
          <circle cx="100" cy="120" r="3" fill="#22C55E" />
          <path d="M 100 360 L 150 360 L 170 340 L 210 340" />
          <circle cx="100" cy="360" r="3" fill="#F59E0B" />
          <path d="M 400 130 L 340 130 L 320 150 L 280 150" />
          <circle cx="400" cy="130" r="3" fill="#3B82F6" />
        </g>

        {/* Open System Chassis with Circuit Diagnostic Grid */}
        <rect x="180" y="130" width="140" height="180" rx="8" fill="#141824" stroke="#F59E0B" strokeWidth="1.8" />
        <rect x="195" y="145" width="110" height="60" rx="4" fill="#0D111A" stroke="#3F3F46" strokeWidth="1" />
        
        {/* Diagnostic Scaffolding Wires */}
        <line x1="205" y1="165" x2="295" y2="165" stroke="#22C55E" strokeWidth="2" strokeDasharray="4 2" />
        <line x1="205" y1="185" x2="275" y2="185" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
        
        {/* Gear / Cog Under Maintenance */}
        <g transform="translate(250, 255)">
          <motion.circle
            cx="0"
            cy="0"
            r="28"
            stroke="#71717A"
            strokeWidth="5"
            strokeDasharray="14 10"
            fill="none"
            animate={shouldReduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          />
          <circle cx="0" cy="0" r="14" fill="#0D111A" stroke="#F59E0B" strokeWidth="2" />
        </g>

        {/* Hovering Futuristic Maintenance Drone Robot */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [-8, 8, -8], rotate: [-2, 2, -2] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '320px 220px' }}
        >
          {/* Drone Chassis Body */}
          <ellipse cx="330" cy="210" rx="36" ry="24" fill="#182032" stroke="url(#droneGrad)" strokeWidth="2" />

          {/* Drone Eye / Scanner Lens */}
          <circle cx="318" cy="210" r="9" fill="#0D111A" stroke="#22C55E" strokeWidth="1.5" />
          <circle cx="318" cy="210" r="4" fill="#22C55E" filter="url(#maintGlow)" />

          {/* Dual Thruster Ring Pods */}
          <rect x="355" y="194" width="10" height="32" rx="3" fill="#0D111A" stroke="#3F3F46" strokeWidth="1.2" />
          <circle cx="365" cy="210" r="2.5" fill="#38BDF8" filter="url(#maintGlow)" />

          {/* Robotic Repair Articulated Arm with Welding Torch */}
          <path d="M 310 225 L 290 250 L 265 245" stroke="#71717A" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="265" cy="245" r="3" fill="#F59E0B" />

          {/* Laser Repair Sparks coming from welding arm tip */}
          <motion.path
            d="M 265 245 L 255 248 M 265 245 L 262 238 M 265 245 L 258 240"
            stroke="#FEF08A"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#maintGlow)"
            animate={shouldReduceMotion ? undefined : { opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </motion.g>

        {/* Maintenance Mode Status Banner */}
        <g transform="translate(130, 360)">
          <rect x="0" y="0" width="240" height="28" rx="4" fill="#18181B" stroke="#F59E0B" strokeWidth="1" />
          <text x="120" y="18" textAnchor="middle" fill="#F59E0B" fontFamily="monospace" fontSize="10" fontWeight="bold">
            SYSTEM_UPGRADE // IN_PROGRESS
          </text>
        </g>

        {/* Telemetry Header */}
        <text x="250" y="105" textAnchor="middle" fill="#F59E0B" fontFamily="monospace" fontSize="11" fontWeight="bold" letterSpacing="3">
          SERVICE_UNAVAILABLE // 503
        </text>
      </svg>
    </div>
  );
};
