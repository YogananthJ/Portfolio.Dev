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

export function normalizeSectionParam(sectionId: string): string {
  const clean = sectionId.replace(/^#/, '').trim().toLowerCase();
  if (!clean || clean === 'overview' || clean === 'hero' || clean === 'top') {
    return 'home';
  }
  return clean;
}

function updateQueryParams(mutator: (params: URLSearchParams) => void): void {
  if (typeof window === 'undefined' || typeof window.history?.replaceState !== 'function') {
    return;
  }

  try {
    const url = new URL(window.location.href);
    const beforeRelative = `${url.pathname}${url.search}${url.hash}`;

    mutator(url.searchParams);

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
      window.history.replaceState(window.history.state, '', afterRelative);
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
  options: { preserveScroll?: boolean } = {}
): void {
  const normalized = normalizeSectionParam(sectionId);
  if (!normalized) return;

  updateQueryParams((params) => {
    params.set('section', normalized);
    if (normalized === 'home') {
      params.delete('project');
    }
    if (!options.preserveScroll) {
      params.delete('scroll');
    }
  });
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
