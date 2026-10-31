import React, { useEffect, useState, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import { Eye, ShieldCheck, Sparkles, Activity } from 'lucide-react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface VisitorCounterProps {
  className?: string;
}

// Persistent keys stored in localStorage so visits are counted strictly once per browser
const VISITOR_ID_KEY = 'portfolio_unique_visitor_id';
const VISITOR_RECORDED_KEY = 'portfolio_visitor_recorded_v1';
const ANALYTICS_DOC_ID = 'visitors';
const BASELINE_COUNT = 1428;

// Module-level lock ensuring strict single-flight execution across concurrent renders
let isSyncingGlobally = false;

export const VisitorCounter: React.FC<VisitorCounterProps> = ({ className = '' }) => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(BASELINE_COUNT);
  const [isNewVisitor, setIsNewVisitor] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const prevCountRef = useRef<number>(BASELINE_COUNT - 30);
  const hasInitializedRef = useRef<boolean>(false);

  // 1. Fetch & Increment count strictly once per browser using localStorage
  useEffect(() => {
    let isMounted = true;
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const docRef = doc(db, 'analytics', ANALYTICS_DOC_ID);

    async function syncVisitorCount() {
      let hasBeenCounted = false;
      let visitorId = '';

      // Check persistent browser storage
      try {
        hasBeenCounted = localStorage.getItem(VISITOR_RECORDED_KEY) === 'true';
        visitorId = localStorage.getItem(VISITOR_ID_KEY) || '';

        if (!visitorId) {
          visitorId =
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : `v_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
          localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }
      } catch (storageErr) {
        console.warn('localStorage access failed (privacy mode or cookies disabled):', storageErr);
      }

      // Case A: This browser has ALREADY been counted previously.
      // Simply fetch the current count and DO NOT increment.
      if (hasBeenCounted) {
        try {
          const docSnap = await getDoc(docRef);
          if (isMounted) {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const count = typeof data?.count === 'number' ? data.count : BASELINE_COUNT;
              setVisitorCount(count);
            } else {
              setVisitorCount(BASELINE_COUNT);
            }
            setIsLoading(false);
          }
        } catch (err) {
          console.warn('Firestore read error in visitor counter:', err);
          if (isMounted) {
            const cached = localStorage.getItem('portfolio_cached_visitors');
            setVisitorCount(cached ? parseInt(cached, 10) : BASELINE_COUNT);
            setIsLoading(false);
          }
        }
        return;
      }

      // Case B: Brand new browser visit.
      // Guard against race conditions (e.g. React StrictMode double-mounting or multiple tabs)
      if (isSyncingGlobally) return;
      isSyncingGlobally = true;

      // Mark as counted IMMEDIATELY so any subsequent refresh or concurrent tab never increments again
      try {
        localStorage.setItem(VISITOR_RECORDED_KEY, 'true');
      } catch {
        // Storage write may fail in strict incognito; proceed gracefully
      }

      try {
        let docSnap;
        try {
          docSnap = await getDoc(docRef);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `analytics/${ANALYTICS_DOC_ID}`);
          return;
        }

        if (!docSnap.exists()) {
          // Initialize baseline document
          const initialCount = BASELINE_COUNT + 1;
          try {
            await setDoc(docRef, {
              count: initialCount,
              lastUpdated: new Date().toISOString(),
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, `analytics/${ANALYTICS_DOC_ID}`);
          }

          if (isMounted) {
            setVisitorCount(initialCount);
            setIsNewVisitor(true);
            setIsLoading(false);
          }
        } else {
          // Document exists: atomically increment visitor count in Firestore
          const data = docSnap.data();
          const existingCount = typeof data?.count === 'number' ? data.count : BASELINE_COUNT;
          const nextCount = existingCount + 1;

          try {
            await updateDoc(docRef, {
              count: increment(1),
              lastUpdated: new Date().toISOString(),
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `analytics/${ANALYTICS_DOC_ID}`);
          }

          if (isMounted) {
            setVisitorCount(nextCount);
            setIsNewVisitor(true);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.warn('Firestore write error, falling back to cached baseline:', err);
        if (isMounted) {
          const cached = localStorage.getItem('portfolio_cached_visitors');
          const fallback = cached ? parseInt(cached, 10) : BASELINE_COUNT;
          setVisitorCount(fallback + 1);
          setIsNewVisitor(true);
          setIsLoading(false);
        }
      } finally {
        isSyncingGlobally = false;
      }
    }

    syncVisitorCount();

    // Attach real-time Firestore onSnapshot listener for live synchronization across all visitors
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!isMounted) return;
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (typeof data?.count === 'number') {
            setVisitorCount(data.count);
            try {
              localStorage.setItem('portfolio_cached_visitors', data.count.toString());
            } catch {
              // Ignore
            }
            setIsLoading(false);
          }
        }
      },
      (error) => {
        console.warn('Firestore snapshot listener info:', error.message);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 2. Smooth Framer Motion Count-Up Animation
  useEffect(() => {
    if (visitorCount === null) return;

    const fromVal = prevCountRef.current;
    const toVal = visitorCount;

    // Use Framer Motion's animate utility for smooth easing
    const controls = animate(fromVal, toVal, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1], // Smooth exponential ease-out
      onUpdate: (latest) => {
        setDisplayCount(Math.round(latest));
      },
      onComplete: () => {
        prevCountRef.current = toVal;
      },
    });

    return () => controls.stop();
  }, [visitorCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 px-4 py-3 bg-[#0d0d0d] border border-white/10 hover:border-white/20 transition-all rounded-xs font-mono text-xs shadow-lg group ${className}`}
    >
      {/* Live Activity Pulse Indicator */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center w-8 h-8 rounded bg-white/5 border border-white/10 text-white/80 group-hover:text-white transition-colors">
          <Eye className="w-4 h-4 text-[#E11D48]" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-white/50 uppercase font-semibold">
            <span>TOTAL VISITORS</span>
            <span className="inline-block w-1 h-1 rounded-full bg-white/30"></span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Activity className="w-2.5 h-2.5 inline" />
              FIRESTORE LIVE
            </span>
          </div>

          <div className="text-[10px] text-white/40 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-white/40" />
            <span>Session Verified · Unique Only</span>
          </div>
        </div>
      </div>

      {/* Sleek Vertical Divider */}
      <div className="hidden sm:block h-7 w-px bg-white/10" />

      {/* Numeric Display with Framer Motion count-up */}
      <div className="flex items-baseline gap-2">
        <motion.div
          key={visitorCount ?? 'loading'}
          initial={{ opacity: 0.6, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="font-display font-black text-xl sm:text-2xl text-white tracking-wider tabular-nums"
        >
          {isLoading ? (
            <span className="inline-block animate-pulse text-white/40">----</span>
          ) : (
            <span className="text-[#F5F2EB] group-hover:text-white transition-colors">
              {displayCount.toLocaleString()}
            </span>
          )}
        </motion.div>

        {isNewVisitor && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold bg-[#E11D48]/20 text-[#FDA4AF] border border-[#E11D48]/40 rounded-xs"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>+1 COUNTED</span>
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};
