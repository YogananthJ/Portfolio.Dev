/**
 * Global External Link UTM Source Tracking Utility
 *
 * Automatically appends or updates `utm_source=<window.location.hostname>` on
 * external HTTP/HTTPS URLs while preserving existing query parameters, hash
 * fragments, and skipping internal routes, non-HTTP(S) schemes, and downloads.
 */

export function getUtmSourceHostname(): string {
  if (typeof window === 'undefined' || !window.location) {
    return '';
  }
  return window.location.hostname || '';
}

/**
 * Checks whether a raw href string represents an explicit HTTP/HTTPS URL
 * (or protocol-relative // URL) and is not a non-HTTP scheme or relative path.
 */
function isHttpOrProtocolRelative(trimmedUrl: string): boolean {
  if (!trimmedUrl) return false;
  if (
    trimmedUrl.startsWith('#') ||
    trimmedUrl.startsWith('/') && !trimmedUrl.startsWith('//') ||
    trimmedUrl.startsWith('./') ||
    trimmedUrl.startsWith('../') ||
    trimmedUrl.startsWith('?')
  ) {
    return false;
  }

  return /^https?:\/\//i.test(trimmedUrl) || trimmedUrl.startsWith('//');
}

/**
 * Parses an external HTTP/HTTPS URL and attaches/updates `utm_source`.
 * Returns the original string untouched if it is internal, non-HTTP(S),
 * relative, invalid, or already has the up-to-date `utm_source`.
 */
export function appendUtmSource(rawUrl: string, sourceHostname?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return rawUrl;
  }

  const trimmed = rawUrl.trim();
  if (!isHttpOrProtocolRelative(trimmed)) {
    return rawUrl;
  }

  const hostname = (sourceHostname ?? getUtmSourceHostname()).trim();
  if (!hostname) {
    return rawUrl;
  }

  try {
    const baseProtocol =
      typeof window !== 'undefined' && window.location?.protocol
        ? window.location.protocol
        : 'https:';
    const urlInput = trimmed.startsWith('//') ? `${baseProtocol}${trimmed}` : trimmed;
    const parsed = new URL(urlInput);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return rawUrl;
    }

    // Do not modify links pointing to the current portfolio hostname
    if (parsed.hostname.toLowerCase() === hostname.toLowerCase()) {
      return rawUrl;
    }

    // Idempotency check: skip if utm_source is already set to the exact hostname
    if (parsed.searchParams.get('utm_source') === hostname) {
      return rawUrl;
    }

    parsed.searchParams.set('utm_source', hostname);
    return parsed.toString();
  } catch {
    // Malformed URL — leave untouched
    return rawUrl;
  }
}

/**
 * Ensures any anchor opening in a new tab (`target="_blank"`) includes
 * `noopener` and `noreferrer` in its `rel` attribute while preserving
 * existing `rel` tokens and avoiding redundant DOM writes.
 */
export function ensureSecureBlankTarget(anchor: HTMLAnchorElement): boolean {
  if (!anchor) {
    return false;
  }

  const targetAttr = anchor.getAttribute('target');
  if (!targetAttr || targetAttr.trim().toLowerCase() !== '_blank') {
    return false;
  }

  const existingRel = anchor.getAttribute('rel') || '';
  const tokens = existingRel
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const lowerSet = new Set(tokens.map((t) => t.toLowerCase()));
  let changed = false;

  if (!lowerSet.has('noopener')) {
    tokens.push('noopener');
    lowerSet.add('noopener');
    changed = true;
  }
  if (!lowerSet.has('noreferrer')) {
    tokens.push('noreferrer');
    lowerSet.add('noreferrer');
    changed = true;
  }

  if (!changed) {
    return false;
  }

  anchor.setAttribute('rel', tokens.join(' '));
  return true;
}

/**
 * Applies `utm_source` to a single HTMLAnchorElement if it is a valid external
 * HTTP(S) link and not marked with the `download` attribute, and secures
 * `target="_blank"` anchors with `rel="noopener noreferrer"`.
 * Returns `true` if any attribute was updated.
 */
export function applyUtmToAnchor(
  anchor: HTMLAnchorElement,
  sourceHostname?: string
): boolean {
  if (!anchor) {
    return false;
  }

  let updated = ensureSecureBlankTarget(anchor);

  if (anchor.hasAttribute('download')) {
    return updated;
  }

  const rawHref = anchor.getAttribute('href');
  if (!rawHref) {
    return updated;
  }

  const nextHref = appendUtmSource(rawHref, sourceHostname);
  if (nextHref !== rawHref) {
    anchor.setAttribute('href', nextHref);
    updated = true;
  }

  return updated;
}

/**
 * Scans a DOM subtree for anchor elements and applies UTM tracking + link
 * security attributes to external/new-tab links.
 */
export function processExternalLinksInRoot(
  root: ParentNode | Element,
  sourceHostname?: string
): void {
  if (root instanceof HTMLAnchorElement) {
    applyUtmToAnchor(root, sourceHostname);
  }

  if ('querySelectorAll' in root) {
    const anchors = root.querySelectorAll<HTMLAnchorElement>('a[href], a[target="_blank"]');
    for (let i = 0; i < anchors.length; i++) {
      applyUtmToAnchor(anchors[i], sourceHostname);
    }
  }
}
