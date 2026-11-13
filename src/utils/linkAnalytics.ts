/**
 * Privacy-Safe External Link Click Analytics
 *
 * Records anonymized external navigation events (category, destination host,
 * originating UI section, and timestamp) with zero PII, zero cookies, and
 * Do-Not-Track respect.
 */

import { trackExternalPortfolioClick } from './ga4';

export type ExternalLinkCategory =
  | 'github'
  | 'linkedin'
  | 'demo'
  | 'telegram'
  | 'certification'
  | 'external';

export interface ExternalLinkEvent {
  category: ExternalLinkCategory;
  hostname: string;
  section: string;
  timestamp: string;
}

const STORAGE_KEY = 'portfolio_external_link_events';
const MAX_EVENTS = 100;
const sessionEvents: ExternalLinkEvent[] = [];

export function classifyExternalLink(hostname: string): ExternalLinkCategory {
  const host = hostname.toLowerCase();
  if (host === 'github.com' || host.endsWith('.github.com')) return 'github';
  if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) return 'linkedin';
  if (host === 't.me' || host.endsWith('.telegram.org')) return 'telegram';
  if (host.includes('anthropic.com') || host.includes('mongodb.com')) return 'certification';
  if (host.includes('streamlit.app') || host.includes('pages.dev')) return 'demo';
  return 'external';
}

export function resolveAnchorSection(anchor: HTMLAnchorElement): string {
  if (!anchor || typeof anchor.closest !== 'function') return 'unknown';

  const section = anchor.closest('section[id]');
  if (section?.id) return section.id;

  const dialog = anchor.closest('[role="dialog"]');
  if (dialog) return dialog.getAttribute('aria-labelledby') || 'modal-dialog';

  if (anchor.closest('header')) return 'header';
  if (anchor.closest('footer')) return 'footer';
  if (anchor.closest('aside')) return 'sidebar';

  return 'main';
}

export function isDoNotTrackEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.doNotTrack === '1' || (navigator as { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function trackExternalLinkClick(anchor: HTMLAnchorElement): ExternalLinkEvent | null {
  if (!anchor || anchor.hasAttribute('download') || isDoNotTrackEnabled()) {
    return null;
  }

  const rawHref = anchor.getAttribute('href');
  if (!rawHref) return null;

  const trimmed = rawHref.trim();
  if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith('//')) {
    return null;
  }

  try {
    const baseProtocol =
      typeof window !== 'undefined' && window.location?.protocol
        ? window.location.protocol
        : 'https:';
    const parsed = new URL(trimmed.startsWith('//') ? `${baseProtocol}${trimmed}` : trimmed);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    if (
      typeof window !== 'undefined' &&
      window.location?.hostname &&
      parsed.hostname.toLowerCase() === window.location.hostname.toLowerCase()
    ) {
      return null;
    }

    const eventRecord: ExternalLinkEvent = {
      category: classifyExternalLink(parsed.hostname),
      hostname: parsed.hostname,
      section: resolveAnchorSection(anchor),
      timestamp: new Date().toISOString(),
    };

    sessionEvents.push(eventRecord);
    if (sessionEvents.length > MAX_EVENTS) {
      sessionEvents.shift();
    }

    trackExternalPortfolioClick({
      category: eventRecord.category,
      hostname: eventRecord.hostname,
      section: eventRecord.section,
      projectId: anchor.getAttribute('data-project-id') || undefined,
      linkRole: anchor.getAttribute('data-link-role') || undefined,
      pathname: parsed.pathname,
    });

    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(
          new CustomEvent<ExternalLinkEvent>('portfolio:external-link-click', {
            detail: eventRecord,
          })
        );
      } catch {
        // Ignore CustomEvent failure
      }

      try {
        if (window.sessionStorage) {
          const existingRaw = window.sessionStorage.getItem(STORAGE_KEY);
          const existing: ExternalLinkEvent[] = existingRaw ? JSON.parse(existingRaw) : [];
          if (Array.isArray(existing)) {
            existing.push(eventRecord);
            if (existing.length > MAX_EVENTS) {
              existing.splice(0, existing.length - MAX_EVENTS);
            }
            window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
          }
        }
      } catch {
        // Ignore storage quota or disabled storage errors
      }
    }

    return eventRecord;
  } catch {
    return null;
  }
}

export function getExternalLinkMetrics(): ExternalLinkEvent[] {
  return [...sessionEvents];
}
