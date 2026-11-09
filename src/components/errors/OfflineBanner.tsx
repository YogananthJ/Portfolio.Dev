import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, X } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

interface OfflineBannerProps {
  onViewOfflinePage?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onViewOfflinePage }) => {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
      soundFX.playSuccess();
    };

    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
      soundFX.playWarning();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#160D12] border-b-2 border-rose-500 text-rose-300 px-4 py-2 text-xs font-mono flex items-center justify-between shadow-2xl"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-xs bg-rose-500/20 text-rose-400">
            <WifiOff className="w-3.5 h-3.5" />
          </span>
          <span className="font-bold uppercase tracking-wider text-[11px] text-white">
            Connection Lost:
          </span>
          <span className="hidden sm:inline text-rose-200">
            You are browsing in offline cached mode. Live simulator responses and GitHub stats are paused.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/offline"
            onClick={(e) => {
              if (onViewOfflinePage) {
                e.preventDefault();
                onViewOfflinePage();
              }
            }}
            className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white font-bold uppercase rounded-xs transition-colors text-[10px]"
          >
            Diagnostics
          </a>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss offline banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
