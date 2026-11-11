import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const AstronautVoid404Illustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full max-w-[580px] lg:max-w-[660px] aspect-[16/13] sm:aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Mysterious Neon-Pink Cosmic Portal Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-600/25 via-purple-600/20 to-cyan-500/15 blur-[80px] pointer-events-none" />

      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_15px_40px_rgba(244,63,94,0.3)]"
        aria-hidden="true"
      >
        <defs>
          {/* Neon Portal Gradient */}
          <linearGradient id="portalVoidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="45%" stopColor="#BE123C" />
            <stop offset="75%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Deep Space Black Vortex */}
          <radialGradient id="deepVortex" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#05070D" />
            <stop offset="65%" stopColor="#0B0D19" />
            <stop offset="90%" stopColor="#1E1228" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.4" />
          </radialGradient>

          {/* Astronaut Visor Mirror Gradient */}
          <linearGradient id="visorGoldCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#F43F5E" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#8B5CF6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.95" />
          </linearGradient>

          {/* Floating UI Glass Card Gradient */}
          <linearGradient id="glassCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#181D2E" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0E121E" stopOpacity="0.6" />
          </linearGradient>

          {/* Neon Glow Filter */}
          <filter id="neonPinkGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Digital Grid Pattern */}
          <pattern id="voidCosmicGrid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* Outer Cosmic Grid Boundary */}
        <circle cx="300" cy="300" r="260" fill="url(#deepVortex)" />
        <circle cx="300" cy="300" r="260" fill="url(#voidCosmicGrid)" />
        <circle cx="300" cy="300" r="260" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 8" />

        {/* Twinkling Space Particles / Distant Stars */}
        {[
          { cx: 120, cy: 110, r: 1.5, d: 2 },
          { cx: 480, cy: 140, r: 2, d: 3 },
          { cx: 160, cy: 460, r: 1.5, d: 2.5 },
          { cx: 500, cy: 420, r: 2.5, d: 1.8 },
          { cx: 90, cy: 280, r: 1, d: 3.2 },
          { cx: 520, cy: 260, r: 1.5, d: 2.1 },
          { cx: 280, cy: 70, r: 2, d: 2.7 },
          { cx: 370, cy: 520, r: 1.5, d: 2.9 },
        ].map((star, i) => (
          <motion.circle
            key={i}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill="#FFFFFF"
            animate={shouldReduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
            transition={{ duration: star.d, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* 1. Large Fragmented 404 Typography Drifting Behind */}
        <g opacity="0.35">
          <text
            x="300"
            y="230"
            textAnchor="middle"
            fill="none"
            stroke="url(#portalVoidGrad)"
            strokeWidth="3"
            fontFamily="monospace"
            fontWeight="900"
            fontSize="145"
            letterSpacing="18"
            className="select-none"
          >
            404
          </text>
          {/* Glitch Fracture Line Through 404 */}
          <line x1="160" y1="180" x2="440" y2="180" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="12 8" />
          <line x1="180" y1="183" x2="420" y2="183" stroke="#F43F5E" strokeWidth="1" strokeDasharray="4 6" />
        </g>

        {/* 2. Mysterious Neon-Pink Dimensional Portal */}
        {/* Outer Counter-Rotating Accretion Ring */}
        <motion.circle
          cx="300"
          cy="300"
          r="195"
          stroke="url(#portalVoidGrad)"
          strokeWidth="3"
          strokeDasharray="90 35 15 35 40 20"
          filter="url(#neonPinkGlow)"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '300px 300px' }}
        />

        {/* Inner Counter-Clockwise Gravitational Ring */}
        <motion.circle
          cx="300"
          cy="300"
          r="160"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeDasharray="30 20 60 15"
          strokeOpacity="0.75"
          animate={shouldReduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '300px 300px' }}
        />

        {/* Intermittent Portal Chromatic Glitch Flash */}
        <motion.circle
          cx="300"
          cy="300"
          r="135"
          fill="none"
          stroke="#F43F5E"
          strokeWidth="2.5"
          strokeDasharray="12 4 48 8"
          animate={shouldReduceMotion ? undefined : { 
            scale: [0.98, 1.02, 0.99, 1.01], 
            opacity: [0.7, 1, 0.5, 0.9] 
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '300px 300px' }}
        />

        {/* Deep Horizon Core */}
        <circle cx="300" cy="300" r="105" fill="#04060B" stroke="#8B5CF6" strokeWidth="1.5" strokeOpacity="0.4" />
        <circle cx="300" cy="300" r="65" fill="#000000" />

        {/* 3. Floating Fragments of Broken Website Interfaces */}
        {/* Fragment A: Floating Broken Browser Wireframe Window (Top-Left) */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [-10, 10, -10], rotate: [-6, 2, -6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '150px 170px' }}
        >
          <rect x="90" y="130" width="125" height="85" rx="6" fill="url(#glassCardGrad)" stroke="rgba(244,63,94,0.4)" strokeWidth="1.5" filter="url(#neonPinkGlow)" />
          {/* Window Header Dots */}
          <circle cx="106" cy="144" r="3" fill="#F43F5E" />
          <circle cx="116" cy="144" r="3" fill="#F59E0B" />
          <circle cx="126" cy="144" r="3" fill="#10B981" />
          <line x1="90" y1="154" x2="215" y2="154" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* Wireframe Text Lines */}
          <line x1="105" y1="168" x2="185" y2="168" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="105" y1="179" x2="160" y2="179" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <line x1="105" y1="190" x2="140" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* Fragment B: Broken Code Syntax Snippet (Bottom-Right) */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [12, -12, 12], rotate: [4, -4, 4] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '470px 420px' }}
        >
          <rect x="400" y="380" width="135" height="75" rx="6" fill="url(#glassCardGrad)" stroke="rgba(6,182,212,0.45)" strokeWidth="1.5" />
          <text x="415" y="405" fill="#F43F5E" fontFamily="monospace" fontSize="9" fontWeight="bold">&lt;route id=&quot;void&quot;&gt;</text>
          <text x="425" y="423" fill="#06B6D4" fontFamily="monospace" fontSize="9">status: null</text>
          <text x="415" y="440" fill="#8B5CF6" fontFamily="monospace" fontSize="9">&lt;/route&gt;</text>
          {/* Floating Warning Tag */}
          <rect x="495" y="372" width="46" height="15" rx="2" fill="#E11D48" />
          <text x="518" y="383" textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize="8" fontWeight="bold">LOST</text>
        </motion.g>

        {/* Fragment C: Torn Button Pill Fragment (Top-Right) */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { y: [-8, 8, -8], x: [5, -5, 5], rotate: [8, -3, 8] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '450px 160px' }}
        >
          <rect x="405" y="145" width="85" height="28" rx="14" fill="#141828" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x="447" y="163" textAnchor="middle" fill="#E2E8F0" fontFamily="monospace" fontSize="9" fontWeight="bold">
            NAV_PULL//ERR
          </text>
        </motion.g>

        {/* 4. Small Futuristic Astronaut / Digital Explorer */}
        <motion.g
          animate={shouldReduceMotion ? undefined : { 
            y: [-14, 14, -14], 
            x: [-6, 6, -6],
            rotate: [-4, 6, -4] 
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '300px 320px' }}
        >
          {/* Golden Life-Support Tether Cable drifting into portal */}
          <path
            d="M 285 340 C 250 370, 260 410, 210 435 C 180 450, 150 430, 120 460"
            stroke="url(#portalVoidGrad)"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
          />

          {/* Life Support Backpack */}
          <rect x="250" y="278" width="30" height="52" rx="6" fill="#181D2A" stroke="#334155" strokeWidth="1.5" />
          {/* Thruster Jet Nozzles */}
          <rect x="254" y="330" width="8" height="7" rx="1" fill="#475569" />
          <rect x="268" y="330" width="8" height="7" rx="1" fill="#475569" />
          {/* Micro Thruster Plasma Particles */}
          <motion.circle
            cx="258"
            cy="342"
            r="3"
            fill="#06B6D4"
            animate={shouldReduceMotion ? undefined : { r: [1.5, 3.5, 1.5], opacity: [0.9, 0.3, 0.9] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
          <motion.circle
            cx="272"
            cy="342"
            r="3"
            fill="#F43F5E"
            animate={shouldReduceMotion ? undefined : { r: [3.5, 1.5, 3.5], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />

          {/* Astronaut Suit Torso */}
          <rect x="272" y="275" width="46" height="54" rx="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          {/* Chest Control Console with Mini LEDs */}
          <rect x="282" y="286" width="26" height="20" rx="3" fill="#0F172A" stroke="#475569" strokeWidth="1" />
          <circle cx="288" cy="296" r="2.5" fill="#10B981" />
          <circle cx="295" cy="296" r="2.5" fill="#F43F5E" />
          <circle cx="302" cy="296" r="2.5" fill="#06B6D4" />

          {/* Limbs: Left Arm (Reaching towards user/portal) */}
          <path d="M 274 286 L 248 302 L 236 295" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="234" cy="294" r="5.5" fill="#0F172A" />

          {/* Limbs: Right Arm (Floating naturally) */}
          <path d="M 316 286 L 338 300 L 345 316" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="347" cy="318" r="5.5" fill="#0F172A" />

          {/* Limbs: Left Leg */}
          <path d="M 284 326 L 278 355 L 268 368" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 264 366 L 274 372" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />

          {/* Limbs: Right Leg (Tilted float) */}
          <path d="M 306 326 L 316 352 L 330 366" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 326 364 L 338 370" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />

          {/* Helmet Dome */}
          <ellipse cx="295" cy="254" rx="22" ry="24" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
          
          {/* Reflective Panoramic Visor (Gold / Rose / Cyan Hologram) */}
          <ellipse cx="296" cy="255" rx="16" ry="14" fill="url(#visorGoldCyan)" stroke="#F43F5E" strokeWidth="1.5" filter="url(#neonPinkGlow)" />
          {/* Visor Glare Highlights */}
          <path d="M 288 248 Q 295 245 303 249" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <circle cx="290" cy="258" r="1.5" fill="#FFFFFF" opacity="0.9" />
        </motion.g>

        {/* 5. Floating Sector Telemetry Ring Badge */}
        <g transform="translate(60, 480)">
          <rect x="0" y="0" width="170" height="28" rx="4" fill="#0C0E17" stroke="rgba(244,63,94,0.35)" strokeWidth="1" />
          <circle cx="14" cy="14" r="4" fill="#F43F5E" filter="url(#neonPinkGlow)" />
          <text x="26" y="18" fill="#F43F5E" fontFamily="monospace" fontSize="9" fontWeight="bold">
            SECTOR: UNKNOWN_VOID
          </text>
        </g>
      </svg>
    </div>
  );
};
