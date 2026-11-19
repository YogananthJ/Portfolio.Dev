/**
 * Dynamic URL Activity Tracking Utility
 *
 * Updates the browser address bar using window.history.replaceState() to reflect
 * the visitor's latest meaningful activity without refreshing or adding history entries.
 *
 * Strict Privacy Rules:
 * - Never stores names, emails, messages, phone numbers, or other PII in the URL.
 * - Preserves external/non-tracking query parameters (e.g. utm_source, ref) unless
 *   explicitly replaced or cleared.
 */

export type PortfolioSectionParam =
  | 'home'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'contact'
  | 'architecture'
  | 'simulators'
  | 'motion-playground'
  | 'github-activity';

export type ScrollMilestone = 25 | 50 | 75 | 100;
export type ScrollDirection = 'down' | 'up';
export type ThemeParam = 'dark' | 'light';
export type ToggleStateParam = 'open' | 'closed';
export type FormStageParam =
  | 'started'
  | 'name_completed'
  | 'email_completed'
  | 'submitted'
  | 'success';

const MAX_SEARCH_LENGTH = 64;
const SPECIFIC_EVENT_SUPPRESSION_WINDOW_MS = 60;

let lastSpecificEventTimestamp = 0;

/**
 * Marks that a higher-priority domain event was tracked in the current interaction
 * so the delegated generic button click listener does not overwrite it.
 */
export function markSpecificUrlEvent(): void {
  lastSpecificEventTimestamp = Date.now();
}

export function wasRecentSpecificUrlEvent(): boolean {
  return Date.now() - lastSpecificEventTimestamp <= SPECIFIC_EVENT_SUPPRESSION_WINDOW_MS;
}

/**
 * Maps internal DOM section IDs (like 'overview') to normalized URL section names.
 */
export function normalizeSectionParam(sectionId: string): PortfolioSectionParam | string {
  const clean = sectionId.replace(/^#/, '').trim().toLowerCase();
  if (clean === 'overview' || clean === 'hero' || clean === 'top' || clean === '') {
    return 'home';
  }
  return clean;
}

/**
 * Safely mutates URLSearchParams via history.replaceState() without page reload
 * and without creating extra history entries.
 */
function updateQueryParams(
  mutator: (params: URLSearchParams) => void,
  options: { markSpecific?: boolean } = {}
): void {
  if (typeof window === 'undefined' || typeof window.history?.replaceState !== 'function') {
    return;
  }

  if (options.markSpecific !== false) {
    markSpecificUrlEvent();
  }

  try {
    const url = new URL(window.location.href);
    const beforeRelative = `${url.pathname}${url.search}${url.hash}`;
    mutator(url.searchParams);
    const nextSearch = url.searchParams.toString();
    const afterRelative = `${url.pathname}${nextSearch ? `?${nextSearch}` : ''}${url.hash}`;

    if (afterRelative !== beforeRelative) {
      window.history.replaceState(window.history.state, '', afterRelative);
    }
  } catch {
    // Gracefully ignore URL serialization / security exceptions in restricted environments
  }
}

export function getCurrentUrlParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return new URLSearchParams(window.location.search).get(key);
  } catch {
    return null;
  }
}

export function hasAnyActivityParams(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const activityKeys = [
      'section',
      'event',
      'project',
      'search',
      'filter',
      'sort',
      'scroll',
      'direction',
      'theme',
      'menu',
      'modal',
      'form',
    ];
    return activityKeys.some((k) => params.has(k));
  } catch {
    return false;
  }
}

export function trackSectionNavigation(
  sectionId: string,
  options: { preserveScroll?: boolean; markSpecific?: boolean } = {}
): void {
  const normalized = normalizeSectionParam(sectionId);
  if (!normalized) return;

  updateQueryParams(
    (params) => {
      params.set('section', normalized);
      // Clear stale transient click/project events when navigating between sections
      // unless a project modal is actively open.
      if (params.get('modal') !== 'open') {
        params.delete('event');
        params.delete('project');
      }
      if (!options.preserveScroll) {
        params.delete('scroll');
        params.delete('direction');
      }
    },
    { markSpecific: options.markSpecific ?? true }
  );
}

export function trackButtonClick(): void {
  updateQueryParams(
    (params) => {
      params.set('event', 'click');
      if (params.get('modal') !== 'open') {
        params.delete('project');
      }
    },
    { markSpecific: false }
  );
}

export function trackProjectOpen(projectId: string): void {
  const cleanId = projectId.trim();
  if (!cleanId) return;

  updateQueryParams((params) => {
    params.set('event', 'project_open');
    params.set('project', cleanId);
    params.set('modal', 'open');
  });
}

export function trackCardFlip(projectId?: string): void {
  updateQueryParams((params) => {
    params.set('event', 'card_flip');
    if (projectId && projectId.trim()) {
      params.set('project', projectId.trim());
    } else if (params.get('modal') !== 'open') {
      params.delete('project');
    }
  });
}

export function trackLiveDemoClick(projectId?: string): void {
  updateQueryParams((params) => {
    params.set('event', 'live_demo');
    if (projectId && projectId.trim()) {
      params.set('project', projectId.trim());
    }
  });
}

export function trackResumeDownloadUrl(): void {
  updateQueryParams((params) => {
    params.set('event', 'resume_download');
    if (params.get('modal') !== 'open') {
      params.delete('project');
    }
  });
}

export function trackGitHubClick(): void {
  updateQueryParams((params) => {
    params.set('event', 'github_click');
  });
}

export function trackLinkedInClick(): void {
  updateQueryParams((params) => {
    params.set('event', 'linkedin_click');
  });
}

export function trackSearchActivated(): void {
  updateQueryParams(
    (params) => {
      if (!params.has('search')) {
        params.set('search', 'true');
      }
    },
    { markSpecific: true }
  );
}

export function trackSearchQuery(query: string): void {
  const trimmed = query.trim().slice(0, MAX_SEARCH_LENGTH);
  updateQueryParams(
    (params) => {
      if (!trimmed) {
        params.delete('search');
      } else {
        params.set('search', trimmed);
      }
    },
    { markSpecific: false }
  );
}

export function clearSearchParam(): void {
  updateQueryParams((params) => {
    params.delete('search');
  });
}

export function trackFilterApplied(filterValue: string): void {
  const clean = filterValue.trim();
  if (!clean) return;
  updateQueryParams((params) => {
    params.set('filter', clean);
  });
}

export function trackSortApplied(sortValue: string): void {
  const clean = sortValue.trim();
  if (!clean) return;
  updateQueryParams((params) => {
    params.set('sort', clean);
  });
}

export function trackScrollProgress(milestone: ScrollMilestone, direction?: ScrollDirection): void {
  updateQueryParams(
    (params) => {
      params.set('scroll', String(milestone));
      if (direction) {
        params.set('direction', direction);
      }
    },
    { markSpecific: false }
  );
}

export function trackScrollDirection(direction: ScrollDirection): void {
  updateQueryParams(
    (params) => {
      params.set('direction', direction);
    },
    { markSpecific: false }
  );
}

export function trackThemeChange(theme: ThemeParam): void {
  updateQueryParams((params) => {
    params.set('theme', theme);
  });
}

export function trackMenuState(state: ToggleStateParam): void {
  updateQueryParams((params) => {
    params.set('menu', state);
  });
}

export function trackModalState(
  state: ToggleStateParam,
  options: { clearProject?: boolean } = {}
): void {
  updateQueryParams((params) => {
    params.set('modal', state);
    if (state === 'closed' && options.clearProject) {
      params.delete('project');
      if (params.get('event') === 'project_open') {
        params.delete('event');
      }
    }
  });
}

export function trackFormProgress(stage: FormStageParam): void {
  updateQueryParams((params) => {
    params.set('form', stage);
  });
}
