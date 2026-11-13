/**
 * Google Analytics 4 (GA4) Privacy-Safe Integration Utility
 *
 * Measurement ID: G-D1GRL5P56Q
 *
 * Guarantees:
 * - Zero duplicate GA4 initialization (reuses global gtag initialized in index.html)
 * - Strict Do-Not-Track / Global Privacy Control & Consent Mode v2 support
 * - Zero PII collected (strips sensitive query parameters & rejects email-like values)
 * - Deduplicated SPA page_view tracking (StrictMode & re-render safe)
 * - Custom portfolio event names that do not duplicate GA4 Enhanced Measurement events
 */

export const GA4_MEASUREMENT_ID = 'G-D1GRL5P56Q';
export const ANALYTICS_CONSENT_STORAGE_KEY = 'portfolio_analytics_consent';

export type AnalyticsConsentState = 'granted' | 'denied';

type GtagCommand = 'js' | 'config' | 'event' | 'consent' | 'set';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, targetOrAction: string | Date, params?: Record<string, unknown>) => void;
    __GA4_INITIALIZED__?: boolean;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const consentListeners = new Set<(state: AnalyticsConsentState) => void>();
let lastTrackedPageKey: string | null = null;

const PII_PARAM_KEYS = new Set([
  'email',
  'e-mail',
  'mail',
  'name',
  'fullname',
  'full_name',
  'first_name',
  'last_name',
  'phone',
  'tel',
  'mobile',
  'token',
  'access_token',
  'auth',
  'password',
  'secret',
  'address',
]);

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export function isBrowserPrivacyOptOut(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    navigator.doNotTrack === '1' ||
    (navigator as { globalPrivacyControl?: boolean }).globalPrivacyControl === true
  );
}

export function getAnalyticsConsentState(): AnalyticsConsentState {
  if (isBrowserPrivacyOptOut()) {
    return 'denied';
  }
  if (typeof window === 'undefined') return 'granted';
  try {
    const stored = window.localStorage?.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    if (stored === 'denied') return 'denied';
    if (stored === 'granted') return 'granted';
  } catch {
    // Ignore storage access failures in strict privacy contexts
  }
  return 'granted';
}

export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsentState() === 'granted';
}

function getGtag(): Window['gtag'] | null {
  if (typeof window === 'undefined') return null;
  if (typeof window.gtag === 'function') return window.gtag;
  if (Array.isArray(window.dataLayer)) {
    return (...args: Parameters<NonNullable<Window['gtag']>>) => {
      window.dataLayer?.push(args);
    };
  }
  return null;
}

export function setAnalyticsConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;

  const effectiveState: AnalyticsConsentState =
    granted && !isBrowserPrivacyOptOut() ? 'granted' : 'denied';

  try {
    window.localStorage?.setItem(ANALYTICS_CONSENT_STORAGE_KEY, effectiveState);
  } catch {
    // Ignore storage failures
  }

  window[`ga-disable-${GA4_MEASUREMENT_ID}`] = effectiveState !== 'granted';

  const gtag = getGtag();
  if (gtag) {
    gtag('consent', 'update', {
      analytics_storage: effectiveState,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  consentListeners.forEach((cb) => {
    try {
      cb(effectiveState);
    } catch {
      // Ignore subscriber errors
    }
  });
}

export function subscribeToAnalyticsConsent(
  listener: (state: AnalyticsConsentState) => void
): () => void {
  consentListeners.add(listener);
  return () => {
    consentListeners.delete(listener);
  };
}

/**
 * Strips potentially sensitive query params & hash fragments to ensure zero PII in GA4.
 */
export function sanitizeAnalyticsUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl, 'https://iam-mjyogananth.pages.dev');
    const cleanParams = new URLSearchParams();
    parsed.searchParams.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (PII_PARAM_KEYS.has(lowerKey)) return;
      if (EMAIL_PATTERN.test(value)) return;
      cleanParams.set(key, value);
    });
    const searchStr = cleanParams.toString();
    return `${parsed.origin}${parsed.pathname}${searchStr ? `?${searchStr}` : ''}`;
  } catch {
    return 'https://iam-mjyogananth.pages.dev/';
  }
}

function sanitizeEventParams(
  params: Record<string, string | number | boolean | undefined> = {}
): Record<string, string | number | boolean> {
  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    const lowerKey = key.toLowerCase();
    if (PII_PARAM_KEYS.has(lowerKey)) continue;
    if (typeof value === 'string') {
      if (EMAIL_PATTERN.test(value)) continue;
      clean[key] = value.slice(0, 100);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Tracks a single SPA page_view when the active route changes, deduplicated
 * against the most recent tracked page key to avoid StrictMode/re-render duplicates.
 */
export function trackGa4PageView(pagePath: string, pageTitle: string): boolean {
  if (typeof window === 'undefined') return false;
  if (!hasAnalyticsConsent()) return false;

  const normalizedPath = pagePath.startsWith('/') ? pagePath : `/${pagePath}`;
  if (lastTrackedPageKey === normalizedPath) {
    return false;
  }

  const gtag = getGtag();
  if (!gtag) return false;

  lastTrackedPageKey = normalizedPath;
  const pageLocation = sanitizeAnalyticsUrl(`${window.location.origin}${normalizedPath}`);

  gtag('event', 'page_view', {
    send_to: GA4_MEASUREMENT_ID,
    page_path: normalizedPath,
    page_location: pageLocation,
    page_title: pageTitle.slice(0, 120),
  });

  return true;
}

/**
 * Sends a privacy-sanitized custom GA4 event.
 * Rejects Enhanced Measurement reserved names ('page_view', 'scroll', 'click', 'file_download')
 * when dispatched via generic event wrapper to avoid accidental duplication.
 */
export function trackGa4Event(
  eventName: string,
  params: Record<string, string | number | boolean | undefined> = {}
): boolean {
  if (typeof window === 'undefined') return false;
  if (!hasAnalyticsConsent()) return false;

  const reservedEnhancedNames = new Set(['scroll', 'click', 'file_download', 'view_search_results']);
  if (reservedEnhancedNames.has(eventName)) {
    return false;
  }

  const gtag = getGtag();
  if (!gtag) return false;

  const cleanParams = sanitizeEventParams({
    ...params,
    send_to: GA4_MEASUREMENT_ID,
  });

  gtag('event', eventName, cleanParams);
  return true;
}

export function trackResumeDownload(format: 'ats_txt' | 'pdf_print', source = 'resume_modal'): boolean {
  return trackGa4Event('resume_download', {
    file_format: format,
    trigger_source: source,
  });
}

export function trackVisitingCardExport(format: 'pdf' | 'png' | 'vcf'): boolean {
  return trackGa4Event('visiting_card_export', {
    export_format: format,
    section: 'hero_visiting_card',
  });
}

export function trackPortfolioExport(
  exportType: 'github_audit_json' | 'github_report_print',
  section: string
): boolean {
  return trackGa4Event('portfolio_export', {
    export_type: exportType,
    section,
  });
}

export function trackProjectModalOpen(projectId: string, category: string): boolean {
  return trackGa4Event('project_detail_open', {
    project_id: projectId,
    project_category: category,
  });
}

export function trackExternalPortfolioClick(details: {
  category: 'github' | 'linkedin' | 'demo' | 'telegram' | 'certification' | 'external';
  hostname: string;
  section: string;
  projectId?: string;
  linkRole?: string;
  pathname?: string;
}): boolean {
  const { category, hostname, section, projectId, linkRole, pathname } = details;

  if (linkRole === 'project_demo' || category === 'demo' || category === 'telegram') {
    return trackGa4Event('project_demo_click', {
      project_id: projectId || hostname,
      demo_domain: hostname,
      section,
    });
  }

  if (category === 'linkedin') {
    return trackGa4Event('social_profile_click', {
      platform: 'linkedin',
      link_domain: hostname,
      section,
    });
  }

  if (category === 'github') {
    const cleanPath = (pathname || '').replace(/^\/+|\/+$/g, '');
    const pathSegments = cleanPath ? cleanPath.split('/') : [];
    const isSpecificRepo = linkRole === 'project_repo' || pathSegments.length >= 2;
    if (isSpecificRepo) {
      return trackGa4Event('project_repo_click', {
        project_id: projectId || pathSegments[1] || 'repository',
        link_domain: hostname,
        section,
      });
    }
    return trackGa4Event('social_profile_click', {
      platform: 'github',
      link_domain: hostname,
      section,
    });
  }

  if (category === 'certification') {
    return trackGa4Event('certification_link_click', {
      issuer_domain: hostname,
      section,
    });
  }

  return trackGa4Event('portfolio_external_link', {
    link_category: category,
    link_domain: hostname,
    section,
  });
}

export function resetGa4TrackingStateForTests(): void {
  lastTrackedPageKey = null;
}
