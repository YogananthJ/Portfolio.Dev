import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const GatewayTimeout504Illustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Deep Violet/Rose Ambient Horizon Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600/20 via-purple-700/15 to-rose-600/15 blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_35px_rgba(139,92,246,0.25)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="horizonGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#18181B" />
            <stop offset="60%" stopColor="#0B0D14" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
          </linearGradient>

          <filter id="voidGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Perspective Deep-Space Container */}
        <rect x="60" y="60" width="380" height="380" rx="14" fill="#090B10" stroke="#27272A" strokeWidth="2" />

        {/* Perspective Grid Converging to Distant Vanishing Point */}
        <g stroke="rgba(139,92,246,0.18)" strokeWidth="1">
          {/* Horizontal Grid Lines */}
          <line x1="60" y1="360" x2="440" y2="360" />
          <line x1="100" y1="310" x2="400" y2="310" />
          <line x1="140" y1="270" x2="360" y2="270" />
          <line x1="180" y1="240" x2="320" y2="240" />
          <line x1="210" y1="220" x2="290" y2="220" />

          {/* Perspective Ray Lines converging to (250, 200) */}
          <line x1="80" y1="420" x2="250" y2="200" />
          <line x1="140" y1="420" x2="250" y2="200" />
          <line x1="200" y1="420" x2="250" y2="200" />
          <line x1="250" y1="420" x2="250" y2="200" />
          <line x1="300" y1="420" x2="250" y2="200" />
          <line x1="360" y1="420" x2="250" y2="200" />
          <line x1="420" y1="420" x2="250" y2="200" />
        </g>

        {/* Distant Unreachable Server Monolith (Tiny on Horizon) */}
        <g transform="translate(235, 150)">
          <rect x="0" y="0" width="30" height="60" rx="2" fill="#18181B" stroke="#8B5CF6" strokeWidth="1.5" />
          <line x1="5" y1="12" x2="25" y2="12" stroke="#EF4444" strokeWidth="1" />
          <line x1="5" y1="20" x2="25" y2="20" stroke="#EF4444" strokeWidth="1" />
          <circle cx="15" cy="8" r="1.5" fill="#EF4444" filter="url(#voidGlow)" />
        </g>

        {/* Vanishing Horizon Event Line */}
        <circle cx="250" cy="200" r="15" fill="none" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        {/* Data Transmission Packets Travelling into the Void & Expiring */}
        {/* Packet 1 (Foreground - strong) */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect x="190" y="320" width="120" height="34" rx="6" fill="#141824" stroke="#8B5CF6" strokeWidth="1.8" />
          <circle cx="210" cy="337" r="4" fill="#06B6D4" />
          <text x="225" y="341" fill="#FFFFFF" fontFamily="monospace" fontSize="10" fontWeight="bold">
            REQ_PKT #902
          </text>
        </motion.g>

        {/* Packet 2 (Mid-distance - fading, TTL Expiring) */}
        <g opacity="0.6">
          <rect x="220" y="245" width="60" height="18" rx="3" fill="#181324" stroke="#EF4444" strokeWidth="1" />
          <text x="250" y="257" textAnchor="middle" fill="#EF4444" fontFamily="monospace" fontSize="8">
            TTL=0 EXPIRED
          </text>
        </g>

        {/* Vanishing Signal Wave Rings from Monolith */}
        <motion.circle
          cx="250"
          cy="180"
          r="40"
          stroke="#EF4444"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 6"
          animate={shouldReduceMotion ? undefined : { r: [20, 80], opacity: [0.8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
        />

        {/* Status Telemetry Banner */}
        <g transform="translate(130, 395)">
          <rect x="0" y="0" width="240" height="26" rx="4" fill="#121217" stroke="#8B5CF6" strokeWidth="1" />
          <text x="120" y="17" textAnchor="middle" fill="#C084FC" fontFamily="monospace" fontSize="10" fontWeight="bold">
            RESPONSE_NULL // TIMEOUT 504
          </text>
        </g>

        {/* Header HUD */}
        <text x="250" y="105" textAnchor="middle" fill="#A855F7" fontFamily="monospace" fontSize="11" fontWeight="bold" letterSpacing="3">
          GATEWAY_TIMEOUT // 504
        </text>
      </svg>
    </div>
  );
};
