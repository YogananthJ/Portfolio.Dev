import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const EmptySearchIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[280px] aspect-square flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_8px_25px_rgba(244,63,94,0.15)]"
        aria-hidden="true"
      >
        <circle cx="150" cy="150" r="110" fill="#0C0E15" stroke="#27272A" strokeWidth="1.5" />
        <circle cx="150" cy="150" r="85" stroke="#3F3F46" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

        {/* Empty Radar Sweep Line */}
        <motion.line
          x1="150"
          y1="150"
          x2="150"
          y2="65"
          stroke="#F43F5E"
          strokeWidth="2"
          strokeLinecap="round"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '150px 150px' }}
        />

        {/* Holographic Magnifying Lens */}
        <g transform="translate(105, 105)">
          <circle cx="45" cy="45" r="32" fill="#181D2A" stroke="#06B6D4" strokeWidth="2.5" />
          <path d="M 68 68 L 92 92" stroke="#06B6D4" strokeWidth="6" strokeLinecap="round" />
          
          {/* Minus / Empty Glyph inside lens */}
          <line x1="32" y1="45" x2="58" y2="45" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Zero Results Tag */}
        <rect x="85" y="215" width="130" height="22" rx="4" fill="#18181B" stroke="#3F3F46" strokeWidth="1" />
        <text x="150" y="230" textAnchor="middle" fill="#A1A1AA" fontFamily="monospace" fontSize="9" fontWeight="bold">
          0 RECORDS FOUND
        </text>
      </svg>
    </div>
  );
};
