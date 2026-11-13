import { useEffect, useState } from 'react';
import {
  recordMonitoredError,
  sanitizeUserMessage,
  subscribeToMonitoredErrors,
} from '../utils/errorMonitor';

/**
 * Global React hook that registers window runtime, unhandled promise rejection,
 * and capture-phase asset failure listeners with deduplicated cleanup.
 */
export function useErrorMonitoring() {
  const [friendlyNotice, setFriendlyNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unsubscribe = subscribeToMonitoredErrors((record) => {
      if (record.source === 'runtime' || record.source === 'boundary') {
        setFriendlyNotice(sanitizeUserMessage(record.source));
      }
    });

    const handleWindowError = (event: Event) => {
      // Resource loading error (e.g. <img>, <script>, <link>)
      const target = event.target;
      if (
        target &&
        target !== window &&
        target instanceof HTMLElement &&
        (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')
      ) {
        const assetUrl =
          (target as HTMLImageElement).src ||
          (target as HTMLLinkElement).href ||
          target.tagName;
        recordMonitoredError('asset', `Asset failed to load: ${assetUrl}`, assetUrl);
        return;
      }

      if (event instanceof ErrorEvent) {
        const msg = event.message || event.error?.message || 'Unknown runtime error';
        recordMonitoredError('runtime', msg, event.filename);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (reason && typeof reason === 'object' && (reason as Error).name === 'AbortError') {
        return;
      }

      const msg =
        reason instanceof Error
          ? reason.message
          : typeof reason === 'string'
            ? reason
            : 'Unhandled async rejection';
      recordMonitoredError('unhandledrejection', msg);
    };

    window.addEventListener('error', handleWindowError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      unsubscribe();
      window.removeEventListener('error', handleWindowError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return {
    friendlyNotice,
    dismissNotice: () => setFriendlyNotice(null),
  };
}
