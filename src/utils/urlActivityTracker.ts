/**
 * Simplified Portfolio URL Activity Tracker
 *
 * Updates the browser address bar using window.history.replaceState() with ONLY
 * five concise, meaningful query parameters:
 *   - section : current active website section
 *   - project : currently opened project
 *   - search  : active search query (removed when cleared)
 *   - scroll  : scroll progress milestone (25, 50, 75, 100)
 *   - theme   : current theme (dark | light)
 *
 * All other valid query parameters (e.g. utm_source, ref) are preserved.
 */

export type ScrollMilestone = 25 | 50 | 75 | 100;
export type ThemeParam = 'dark' | 'light';

const MAX_SEARCH_LENGTH = 64;
const TRACKED_KEYS = ['section', 'project', 'search', 'scroll', 'theme'] as const;

export const CANONICAL_SECTION_IDS = [
  'overview',
  'projects',
  'skills',
  'github-activity',
  'experience',
  'contact',
] as const;

export type CanonicalSectionId = (typeof CANONICAL_SECTION_IDS)[number];

const SECTION_HASH_SET = new Set<string>([
  'overview',
  'home',
  'hero',
  'top',
  'about',
  'projects',
  'skills',
  'github-activity',
  'experience',
  'contact',
]);

export function normalizeSectionParam(sectionId: string): string {
  const clean = sectionId.replace(/^#/, '').trim().toLowerCase();
  if (!clean || clean === 'overview' || clean === 'hero' || clean === 'top' || clean === 'about') {
    return 'home';
  }
  return clean;
}

export function toDomSectionId(sectionOrParam: string | null | undefined): CanonicalSectionId {
  const clean = (sectionOrParam || '').replace(/^#/, '').trim().toLowerCase();
  if (!clean || clean === 'home' || clean === 'overview' || clean === 'hero' || clean === 'top' || clean === 'about') {
    return 'overview';
  }
  if ((CANONICAL_SECTION_IDS as readonly string[]).includes(clean)) {
    return clean as CanonicalSectionId;
  }
  return 'overview';
}

export function resolveSectionFromUrl(): {
  domId: CanonicalSectionId;
  hasExplicitSection: boolean;
} {
  if (typeof window === 'undefined') {
    return { domId: 'overview', hasExplicitSection: false };
  }
  const sectionParam = getCurrentUrlParam('section');
  if (sectionParam) {
    return {
      domId: toDomSectionId(sectionParam),
      hasExplicitSection: true,
    };
  }
  const cleanHash = window.location.hash.replace(/^#/, '').trim().toLowerCase();
  if (cleanHash && SECTION_HASH_SET.has(cleanHash)) {
    return {
      domId: toDomSectionId(cleanHash),
      hasExplicitSection: true,
    };
  }
  return { domId: 'overview', hasExplicitSection: false };
}

function updateQueryParams(
  mutator: (params: URLSearchParams, url: URL) => void,
  options: { historyMode?: 'replace' | 'push' } = {}
): void {
  if (typeof window === 'undefined' || typeof window.history?.replaceState !== 'function') {
    return;
  }

  try {
    const url = new URL(window.location.href);
    const beforeRelative = `${url.pathname}${url.search}${url.hash}`;

    mutator(url.searchParams, url);

    // Never leave empty tracked parameters in the address bar
    for (const key of TRACKED_KEYS) {
      const value = url.searchParams.get(key);
      if (value !== null && value.trim() === '') {
        url.searchParams.delete(key);
      }
    }

    const nextSearch = url.searchParams.toString();
    const afterRelative = `${url.pathname}${nextSearch ? `?${nextSearch}` : ''}${url.hash}`;

    if (afterRelative !== beforeRelative) {
      if (options.historyMode === 'push' && typeof window.history?.pushState === 'function') {
        window.history.pushState(window.history.state, '', afterRelative);
      } else {
        window.history.replaceState(window.history.state, '', afterRelative);
      }
    }
  } catch {
    // Ignore URL serialization or SecurityError in restricted environments
  }
}

export function getCurrentUrlParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = new URLSearchParams(window.location.search).get(key);
    return val && val.trim() !== '' ? val : null;
  } catch {
    return null;
  }
}

export function hasAnyActivityParams(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return TRACKED_KEYS.some((key) => {
      const val = params.get(key);
      return val !== null && val.trim() !== '';
    });
  } catch {
    return false;
  }
}

export function trackSectionNavigation(
  sectionId: string,
  options: {
    preserveScroll?: boolean;
    historyMode?: 'replace' | 'push';
    clearSectionHash?: boolean;
  } = {}
): void {
  const normalized = normalizeSectionParam(sectionId);
  if (!normalized) return;

  updateQueryParams(
    (params, url) => {
      params.set('section', normalized);
      if (normalized === 'home') {
        params.delete('project');
      }
      if (!options.preserveScroll) {
        params.delete('scroll');
      }
      if (options.clearSectionHash !== false) {
        const cleanHash = url.hash.replace(/^#/, '').trim().toLowerCase();
        if (cleanHash && SECTION_HASH_SET.has(cleanHash)) {
          url.hash = '';
        }
      }
    },
    { historyMode: options.historyMode }
  );
}

export function trackProjectParam(projectId: string): void {
  const cleanId = projectId.trim();
  if (!cleanId) return;

  updateQueryParams((params) => {
    params.delete('project');
    params.set('project', cleanId);
  });
}

export function clearProjectParam(): void {
  updateQueryParams((params) => {
    params.delete('project');
  });
}

export function trackSearchQuery(query: string): void {
  const trimmed = query.trim().slice(0, MAX_SEARCH_LENGTH);
  updateQueryParams((params) => {
    if (!trimmed) {
      params.delete('search');
    } else {
      params.set('search', trimmed);
    }
  });
}

export function clearSearchParam(): void {
  updateQueryParams((params) => {
    params.delete('search');
  });
}

export function trackScrollProgress(milestone: ScrollMilestone): void {
  updateQueryParams((params) => {
    params.set('scroll', String(milestone));
  });
}

export function clearScrollParam(): void {
  updateQueryParams((params) => {
    params.delete('scroll');
  });
}

export function trackThemeChange(theme: ThemeParam): void {
  updateQueryParams((params) => {
    params.set('theme', theme);
  });
}
