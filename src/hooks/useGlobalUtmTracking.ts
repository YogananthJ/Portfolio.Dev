import { useEffect } from 'react';
import { applyUtmToAnchor, processExternalLinksInRoot } from '../utils/utmTracker';

/**
 * Global React hook that attaches `utm_source=<window.location.hostname>`
 * to all external HTTP/HTTPS anchor links across initial render, dynamic modals,
 * lazy components, and SPA route transitions without leaking memory or looping.
 */
export function useGlobalUtmTracking(): void {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const rootNode = document.body || document.documentElement;
    if (!rootNode) {
      return;
    }

    // 1. Process all links present at mount
    processExternalLinksInRoot(rootNode);

    // 2. Observe dynamic DOM insertions and href/download attribute changes
    const observer = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i];

        if (mutation.type === 'childList') {
          const added = mutation.addedNodes;
          for (let j = 0; j < added.length; j++) {
            const node = added[j];
            if (node instanceof HTMLAnchorElement) {
              applyUtmToAnchor(node);
            } else if (node instanceof Element) {
              processExternalLinksInRoot(node);
            }
          }
        } else if (mutation.type === 'attributes') {
          const target = mutation.target;
          if (target instanceof HTMLAnchorElement) {
            applyUtmToAnchor(target);
          }
        }
      }
    });

    observer.observe(rootNode, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href', 'download'],
    });

    // 3. Capture-phase interaction guard before navigation or context-menu copy
    const handleAnchorInteraction = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (anchor instanceof HTMLAnchorElement) {
        applyUtmToAnchor(anchor);
      }
    };

    // 4. Re-scan on SPA history navigation as an extra safeguard
    const handleRouteSync = () => {
      processExternalLinksInRoot(rootNode);
    };

    document.addEventListener('click', handleAnchorInteraction, true);
    document.addEventListener('auxclick', handleAnchorInteraction, true);
    document.addEventListener('contextmenu', handleAnchorInteraction, true);
    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleAnchorInteraction, true);
      document.removeEventListener('auxclick', handleAnchorInteraction, true);
      document.removeEventListener('contextmenu', handleAnchorInteraction, true);
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);
}
