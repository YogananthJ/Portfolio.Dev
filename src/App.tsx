import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectShowcase } from './components/ProjectShowcase';
import { LayoutProvider, useLayout } from './context/LayoutContext';
import { motion, useReducedMotion } from 'framer-motion';
import { ProjectItem } from './types/portfolio';
import { PROJECTS } from './data/portfolioData';
import { ScrollProgressBar } from './components/common/ScrollProgressBar';
import { BackToTop } from './components/common/BackToTop';
import { QuickActionsMenu } from './components/common/QuickActionsMenu';
import { FuturisticSpotlight } from './components/common/FuturisticSpotlight';
import { ScrollSectionReveal } from './components/common/ScrollSectionReveal';
import { ThemeTransitionOverlay } from './components/common/ThemeTransitionOverlay';
import { useGlobalUtmTracking } from './hooks/useGlobalUtmTracking';
import { useErrorMonitoring } from './hooks/useErrorMonitoring';
import { useUrlActivityTracking } from './hooks/useUrlActivityTracking';
import { trackGa4PageView, trackProjectModalOpen } from './utils/ga4';
import {
  clearProjectParam,
  getCurrentUrlParam,
  hasAnyActivityParams,
  resolveSectionFromUrl,
  toDomSectionId,
  trackProjectParam,
  trackSectionNavigation,
} from './utils/urlActivityTracker';
import { ErrorBoundary } from './components/errors/ErrorBoundary';
import { SectionErrorBoundary } from './components/errors/SectionErrorBoundary';
import { OfflineBanner } from './components/errors/OfflineBanner';
import { AppExceptionPage } from './components/errors/pages/AppExceptionPage';

const loadSkillsSection = () => import('./components/SkillsSection');
const loadGitHubActivitySection = () => import('./components/GitHubActivitySection');
const loadExperienceSection = () => import('./components/ExperienceSection');
const loadContactSection = () => import('./components/ContactSection');
const loadFooter = () => import('./components/Footer');
const loadWorkspaceSidebar = () => import('./components/WorkspaceSidebar');
const loadLayoutController = () => import('./components/LayoutController');

const SkillsSection = lazy(() =>
  loadSkillsSection().then((m) => ({ default: m.SkillsSection }))
);
const GitHubActivitySection = lazy(() =>
  loadGitHubActivitySection().then((m) => ({ default: m.GitHubActivitySection }))
);
const ExperienceSection = lazy(() =>
  loadExperienceSection().then((m) => ({ default: m.ExperienceSection }))
);
const ContactSection = lazy(() =>
  loadContactSection().then((m) => ({ default: m.ContactSection }))
);
const Footer = lazy(() =>
  loadFooter().then((m) => ({ default: m.Footer }))
);
const WorkspaceSidebar = lazy(() =>
  loadWorkspaceSidebar().then((m) => ({ default: m.WorkspaceSidebar }))
);
const LayoutController = lazy(() =>
  loadLayoutController().then((m) => ({ default: m.LayoutController }))
);

const SECTION_LOAD_ORDER = ['overview', 'projects', 'skills', 'github-activity', 'experience', 'contact'] as const;

function getSectionOrderIndex(domId: string): number {
  const idx = SECTION_LOAD_ORDER.indexOf(domId as (typeof SECTION_LOAD_ORDER)[number]);
  return idx === -1 ? 1 : idx;
}

function preloadSectionsThrough(domId: string): Promise<void> {
  const idx = getSectionOrderIndex(domId);
  const promises: Promise<unknown>[] = [];
  if (idx >= 2) promises.push(loadSkillsSection());
  if (idx >= 3) promises.push(loadGitHubActivitySection());
  if (idx >= 4) promises.push(loadExperienceSection());
  if (idx >= 5) {
    promises.push(loadContactSection());
    promises.push(loadFooter());
  }
  return Promise.all(promises).then(() => undefined);
}

interface LazySectionSlotProps {
  id: string;
  forceMount: boolean;
  minHeightClass?: string;
  fallbackLabel: string;
  children: React.ReactNode;
}

const LazySectionSlot: React.FC<LazySectionSlotProps> = ({
  id,
  forceMount,
  minHeightClass = 'min-h-[360px]',
  fallbackLabel,
  children,
}) => {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const [hasEnteredNearViewport, setHasEnteredNearViewport] = useState<boolean>(forceMount);

  useEffect(() => {
    if (forceMount) {
      setHasEnteredNearViewport(true);
      return;
    }
    if (hasEnteredNearViewport) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setHasEnteredNearViewport(true);
      return;
    }
    const el = slotRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasEnteredNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '550px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [forceMount, hasEnteredNearViewport]);

  const shouldRender = forceMount || hasEnteredNearViewport;

  return (
    <div id={id} ref={slotRef} className="scroll-mt-16 w-full">
      {shouldRender ? (
        <Suspense
          fallback={
            <div className={`${minHeightClass} border-t border-[var(--border-color)] flex items-center justify-center font-mono text-xs text-[var(--text-muted)]`}>
              {fallbackLabel}
            </div>
          }
        >
          {children}
        </Suspense>
      ) : (
        <div
          aria-hidden="true"
          className={`${minHeightClass} border-t border-[var(--border-color)] bg-[var(--bg-canvas)]`}
        />
      )}
    </div>
  );
};

const ProjectModal = lazy(() =>
  import('./components/ProjectModal').then((m) => ({ default: m.ProjectModal }))
);
const ResumeModal = lazy(() =>
  import('./components/ResumeModal').then((m) => ({ default: m.ResumeModal }))
);
const TerminalDrawer = lazy(() =>
  import('./components/TerminalDrawer').then((m) => ({ default: m.TerminalDrawer }))
);
const SplitScreenWorkspace = lazy(() =>
  import('./components/SplitScreenWorkspace').then((m) => ({ default: m.SplitScreenWorkspace }))
);
const ErrorHubModal = lazy(() =>
  import('./components/errors/ErrorHubModal').then((m) => ({ default: m.ErrorHubModal }))
);
const NotFoundPage = lazy(() =>
  import('./components/errors/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);
const OfflinePage = lazy(() =>
  import('./components/errors/pages/OfflinePage').then((m) => ({ default: m.OfflinePage }))
);
const ServerErrorPage = lazy(() =>
  import('./components/errors/pages/ServerErrorPage').then((m) => ({ default: m.ServerErrorPage }))
);
const AccessDeniedPage = lazy(() =>
  import('./components/errors/pages/AccessDeniedPage').then((m) => ({ default: m.AccessDeniedPage }))
);
const RequestTimeoutPage = lazy(() =>
  import('./components/errors/pages/RequestTimeoutPage').then((m) => ({ default: m.RequestTimeoutPage }))
);
const BadGatewayPage = lazy(() =>
  import('./components/errors/pages/BadGatewayPage').then((m) => ({ default: m.BadGatewayPage }))
);
const ServiceUnavailablePage = lazy(() =>
  import('./components/errors/pages/ServiceUnavailablePage').then((m) => ({ default: m.ServiceUnavailablePage }))
);
const GatewayTimeoutPage = lazy(() =>
  import('./components/errors/pages/GatewayTimeoutPage').then((m) => ({ default: m.GatewayTimeoutPage }))
);

function PortfolioMainContent() {
  const { layoutMode, setLayoutMode, setActiveSimulatorId, isThemeTransitioning, sidebarOpen } = useLayout();
  const shouldReduceMotion = useReducedMotion();
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [isGitHubExportOpen, setIsGitHubExportOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isErrorHubOpen, setIsErrorHubOpen] = useState<boolean>(false);
  const [isSimulatedCrash, setIsSimulatedCrash] = useState<boolean>(false);
  const [mountedThroughIndex, setMountedThroughIndex] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    const { domId, hasExplicitSection } = resolveSectionFromUrl();
    return hasExplicitSection ? getSectionOrderIndex(domId) : 1;
  });
  const [hasUserScrolled, setHasUserScrolled] = useState<boolean>(false);
  const { friendlyNotice, dismissNotice } = useErrorMonitoring();
  const lastSpiedSectionRef = useRef<string>('overview');
  const programmaticScrollRef = useRef<{ targetId: string; until: number } | null>(null);
  const hasRestoredInitialUrlRef = useRef<boolean>(false);

  // Client-side route detection for Error Pages (/404, /offline, etc.)
  const getRouteFromUrl = (): { page: string } => {
    if (typeof window === 'undefined') return { page: 'home' };
    const pathname = window.location.pathname;
    const hash = window.location.hash;

    // Specific custom error routes (e.g. /404, /offline, /500, /403, /408, /502, /503, /504, /app-error)
    const cleanPath = pathname.toLowerCase().replace(/\/$/, '');
    const cleanHash = hash.toLowerCase().replace(/^#\/?/, '').replace(/\/$/, '');

    const errorCodes = ['404', 'offline', '500', '403', '408', '502', '503', '504', 'app-error'];
    for (const code of errorCodes) {
      if (cleanPath === `/${code}` || cleanHash === code || cleanHash === `error/${code}`) {
        return { page: `error-${code === 'app-error' ? 'app' : code}` };
      }
    }

    if (cleanPath.startsWith('/error/')) {
      const sub = cleanPath.replace('/error/', '').split('/')[0];
      return { page: `error-${sub}` };
    }

    // Home or root path
    if (cleanPath === '' || cleanPath === '/' || cleanPath === '/index.html') {
      return { page: 'home' };
    }

    // Any other unrecognized route triggers 404 (Lost in Digital Void)
    return { page: 'error-404' };
  };

  const [route, setRoute] = useState<{ page: string }>(getRouteFromUrl);
  const isAnyModalOpen = Boolean(
    activeProject || isResumeModalOpen || isErrorHubOpen || isTerminalOpen || isGitHubExportOpen
  );

  useUrlActivityTracking({
    isScrollTrackingEnabled: route.page === 'home' && layoutMode === 'standard',
    isModalOpen: isAnyModalOpen,
  });

  const getSectionDocumentTop = (el: HTMLElement): number => {
    let checkNode: HTMLElement | null = el;
    let hasTransformAncestor = false;
    while (checkNode && checkNode !== document.body) {
      if (window.getComputedStyle(checkNode).transform !== 'none') {
        hasTransformAncestor = true;
        break;
      }
      checkNode = checkNode.parentElement;
    }
    if (hasTransformAncestor) {
      let top = 0;
      let curr: HTMLElement | null = el;
      while (curr) {
        top += curr.offsetTop;
        curr = curr.offsetParent as HTMLElement | null;
      }
      return top;
    }
    return el.getBoundingClientRect().top + window.scrollY;
  };

  const scrollToSectionId = (sectionId: string, behavior: ScrollBehavior = 'smooth') => {
    if (typeof window === 'undefined') return;
    const domId = toDomSectionId(sectionId);
    const resolvedBehavior: ScrollBehavior =
      shouldReduceMotion || behavior === 'auto'
        ? ('instant' as ScrollBehavior)
        : behavior;
    if (domId === 'overview') {
      window.scrollTo({ top: 0, behavior: resolvedBehavior });
      return;
    }
    const el = document.getElementById(domId);
    if (el) {
      const top = Math.max(0, getSectionDocumentTop(el) - 64);
      window.scrollTo({ top, behavior: resolvedBehavior });
    }
  };

  const navigateToSection = (
    sectionId: string,
    options: { pushHistory?: boolean; behavior?: ScrollBehavior } = {}
  ) => {
    const domId = toDomSectionId(sectionId);
    const targetOrderIdx = getSectionOrderIndex(domId);
    setMountedThroughIndex((prev) => Math.max(prev, targetOrderIdx));

    const prevLayout = layoutMode;
    if (prevLayout === 'split') {
      setLayoutMode('standard');
    }
    setActiveSection(domId);
    lastSpiedSectionRef.current = domId;
    programmaticScrollRef.current = {
      targetId: domId,
      until: Date.now() + 2400,
    };

    trackSectionNavigation(domId, {
      historyMode: options.pushHistory === false ? 'replace' : 'push',
      clearSectionHash: true,
    });

    const delay = prevLayout === 'split' ? 80 : 0;
    window.setTimeout(() => {
      scrollToSectionId(domId, options.behavior ?? 'smooth');
      if (targetOrderIdx >= 2) {
        preloadSectionsThrough(domId)
          .then(() => {
            window.requestAnimationFrame(() => {
              if (programmaticScrollRef.current?.targetId === domId) {
                scrollToSectionId(domId, options.behavior ?? 'smooth');
              }
            });
          })
          .catch(() => {});
      }
    }, delay);
  };

  useEffect(() => {
    const handleHistoryNavigation = () => {
      const nextRoute = getRouteFromUrl();
      setRoute(nextRoute);
      if (nextRoute.page !== 'home') return;

      const { domId, hasExplicitSection } = resolveSectionFromUrl();
      const targetOrderIdx = getSectionOrderIndex(domId);
      setMountedThroughIndex((prev) => Math.max(prev, targetOrderIdx));
      setActiveSection(domId);
      lastSpiedSectionRef.current = domId;
      programmaticScrollRef.current = {
        targetId: domId,
        until: Date.now() + 2400,
      };
      if (hasExplicitSection) {
        trackSectionNavigation(domId, {
          preserveScroll: true,
          historyMode: 'replace',
          clearSectionHash: true,
        });
      }
      window.requestAnimationFrame(() => {
        scrollToSectionId(domId, 'smooth');
        if (targetOrderIdx >= 2) {
          preloadSectionsThrough(domId)
            .then(() => {
              window.requestAnimationFrame(() => {
                if (programmaticScrollRef.current?.targetId === domId) {
                  scrollToSectionId(domId, 'smooth');
                }
              });
            })
            .catch(() => {});
        }
      });
    };

    window.addEventListener('popstate', handleHistoryNavigation);
    window.addEventListener('hashchange', handleHistoryNavigation);
    return () => {
      window.removeEventListener('popstate', handleHistoryNavigation);
      window.removeEventListener('hashchange', handleHistoryNavigation);
    };
  }, [shouldReduceMotion]);

  // Synchronize document title, meta description, robots, canonical, and OG tags with active route
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const BASE_URL = 'https://iam-mjyogananth.pages.dev';
    const DEFAULT_TITLE = 'Yogananth J | AI/ML Engineer & Full-Stack Developer';
    const DEFAULT_DESC =
      'Portfolio of Yogananth J: AI/ML Engineer & Full-Stack Developer building RAG pipelines, CrewAI agents, PyTorch vision models, and React web apps.';

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      const el = document.querySelector(`meta[${attr}="${key}"]`);
      if (el) el.setAttribute('content', content);
    };

    const canonicalEl = document.querySelector('link[rel="canonical"]');

    if (route.page.startsWith('error-')) {
      const code = route.page.replace('error-', '').toUpperCase();
      const errTitle = `${code} | Yogananth J`;
      document.title = errTitle;
      setMeta('name', 'robots', 'noindex, nofollow');
      setMeta('name', 'description', DEFAULT_DESC);
      if (canonicalEl) canonicalEl.setAttribute('href', `${BASE_URL}/`);
      setMeta('property', 'og:title', errTitle);
      setMeta('property', 'og:url', `${BASE_URL}/`);
      const errPath =
        typeof window !== 'undefined' && window.location.pathname && window.location.pathname !== '/'
          ? window.location.pathname
          : `/${route.page}`;
      trackGa4PageView(errPath, errTitle);
      return;
    }

    document.title = DEFAULT_TITLE;
    setMeta('name', 'robots', 'index, follow');
    setMeta('name', 'description', DEFAULT_DESC);
    if (canonicalEl) canonicalEl.setAttribute('href', `${BASE_URL}/`);
    setMeta('property', 'og:site_name', 'Yogananth J');
    setMeta('property', 'og:title', DEFAULT_TITLE);
    setMeta('property', 'og:description', DEFAULT_DESC);
    setMeta('property', 'og:url', `${BASE_URL}/`);
    setMeta('name', 'twitter:title', DEFAULT_TITLE);
    setMeta('name', 'twitter:description', DEFAULT_DESC);
    setMeta('name', 'twitter:url', `${BASE_URL}/`);
    trackGa4PageView('/', DEFAULT_TITLE);
  }, [route]);

  // Initial URL activity hydration (?section=..., #section, or default ?section=home)
  useEffect(() => {
    if (route.page !== 'home' || layoutMode !== 'standard' || typeof window === 'undefined') {
      return;
    }

    const { domId, hasExplicitSection } = resolveSectionFromUrl();

    if (hasExplicitSection) {
      const targetOrderIdx = getSectionOrderIndex(domId);
      setMountedThroughIndex((prev) => Math.max(prev, targetOrderIdx));
      lastSpiedSectionRef.current = domId;
      setActiveSection(domId);
      trackSectionNavigation(domId, {
        preserveScroll: true,
        historyMode: 'replace',
        clearSectionHash: true,
      });

      if (!hasRestoredInitialUrlRef.current && domId !== 'overview' && !getCurrentUrlParam('project')) {
        hasRestoredInitialUrlRef.current = true;
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
        programmaticScrollRef.current = {
          targetId: domId,
          until: Date.now() + 2800,
        };
        let cancelledByUser = false;
        const cancelInitialAlign = () => {
          cancelledByUser = true;
        };
        window.addEventListener('wheel', cancelInitialAlign, { passive: true, once: true });
        window.addEventListener('touchstart', cancelInitialAlign, { passive: true, once: true });

        const alignTarget = () => {
          if (!cancelledByUser) {
            scrollToSectionId(domId, 'instant' as ScrollBehavior);
          }
        };

        preloadSectionsThrough(domId)
          .then(() => {
            window.requestAnimationFrame(alignTarget);
          })
          .catch(() => {});

        const timer1 = window.setTimeout(alignTarget, 60);
        const timer2 = window.setTimeout(alignTarget, 260);
        const timer3 = window.setTimeout(alignTarget, 650);
        const handleWindowLoad = () => alignTarget();
        window.addEventListener('load', handleWindowLoad, { once: true });
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(alignTarget).catch(() => {});
        }
        return () => {
          cancelledByUser = true;
          window.clearTimeout(timer1);
          window.clearTimeout(timer2);
          window.clearTimeout(timer3);
          window.removeEventListener('load', handleWindowLoad);
          window.removeEventListener('wheel', cancelInitialAlign);
          window.removeEventListener('touchstart', cancelInitialAlign);
        };
      }
      hasRestoredInitialUrlRef.current = true;
      return;
    }

    hasRestoredInitialUrlRef.current = true;
    if (!hasAnyActivityParams() && !window.location.hash) {
      trackSectionNavigation('home', { historyMode: 'replace', clearSectionHash: true });
    }
  }, [route.page, layoutMode]);

  // Listen for Error Experience Hub launch events from Terminal or Workspace Controls
  useEffect(() => {
    const handleOpenHub = () => setIsErrorHubOpen(true);
    window.addEventListener('open-error-hub', handleOpenHub);
    return () => window.removeEventListener('open-error-hub', handleOpenHub);
  }, []);

  const handleReturnHome = () => {
    window.history.pushState({}, '', '/');
    setRoute({ page: 'home' });
    navigateToSection('overview', { pushHistory: false });
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleReturnHome();
    }
  };

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for Terminal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is focused inside an input/textarea and it's not the terminal shortcut, don't interfere
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active section scroll spy (standard layout, rAF throttled)
  useEffect(() => {
    if (layoutMode !== 'standard' || route.page !== 'home') return;
    const sectionIds = ['overview', 'projects', 'skills', 'github-activity', 'experience', 'contact'];
    let rafId: number | null = null;

    const runScrollSpy = () => {
      rafId = null;
      if (window.scrollY > 40) {
        setHasUserScrolled(true);
      }
      const lock = programmaticScrollRef.current;
      if (lock && Date.now() < lock.until) {
        if (lock.targetId === 'overview') {
          if (window.scrollY > 36) return;
        } else {
          const targetEl = document.getElementById(lock.targetId);
          if (targetEl) {
            const targetTop = Math.max(0, getSectionDocumentTop(targetEl) - 64);
            if (Math.abs(window.scrollY - targetTop) > 48) {
              return;
            }
          }
        }
        programmaticScrollRef.current = null;
      }

      let detectedId = 'overview';
      const docEl = document.documentElement;
      const nearBottom = window.innerHeight + window.scrollY >= docEl.scrollHeight - 40;

      if (window.scrollY <= 40) {
        detectedId = 'overview';
      } else if (nearBottom && document.getElementById('contact')) {
        detectedId = 'contact';
      } else {
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i]);
          if (el && el.getBoundingClientRect().top <= 160) {
            detectedId = sectionIds[i];
            break;
          }
        }
      }

      if (detectedId !== lastSpiedSectionRef.current) {
        lastSpiedSectionRef.current = detectedId;
        setActiveSection(detectedId);
        if (!isAnyModalOpen) {
          trackSectionNavigation(detectedId, {
            preserveScroll: true,
            historyMode: 'replace',
            clearSectionHash: true,
          });
        }
      }
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(runScrollSpy);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [layoutMode, route.page, isAnyModalOpen]);

  // Check for project deep-link in URL search params (?project=...) or hash (#project-...)
  useEffect(() => {
    const syncProjectFromUrl = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const projectId = params.get('project');
      const hash = window.location.hash;
      const hashProjectId = hash.startsWith('#project-') ? hash.replace('#project-', '') : null;
      const targetId = projectId || hashProjectId;
      if (targetId) {
        const found = PROJECTS.find((p) => p.id === targetId);
        if (found) {
          setActiveProject(found);
        }
      }
    };

    syncProjectFromUrl();
    window.addEventListener('popstate', syncProjectFromUrl);
    window.addEventListener('hashchange', syncProjectFromUrl);
    return () => {
      window.removeEventListener('popstate', syncProjectFromUrl);
      window.removeEventListener('hashchange', syncProjectFromUrl);
    };
  }, []);

  const handleOpenProjectModal = (project: ProjectItem) => {
    setActiveProject(project);
    trackProjectModalOpen(project.id, project.category);
    trackProjectParam(project.id);
  };

  const handleCloseProjectModal = () => {
    setActiveProject(null);
    clearProjectParam();
  };

  const handleOpenResumeModal = () => {
    setIsResumeModalOpen(true);
  };

  const handleCloseResumeModal = () => {
    setIsResumeModalOpen(false);
  };

  const handleExploreWork = () => {
    navigateToSection('projects');
  };

  function SimulatedCrashTrigger(): never {
    throw new Error('Simulated runtime exception triggered from Error Hub Lab');
  }

  return (
    <motion.div
      animate={isThemeTransitioning && !shouldReduceMotion ? { opacity: [1, 0.88, 1] } : { opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-main)] flex flex-col font-sans selection:bg-[var(--accent)] selection:text-white relative w-full max-w-full overflow-x-clip"
    >
      {/* Skip to main content link for keyboard and screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:font-mono focus:text-xs focus:font-bold focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Simulated crash trigger for testing ErrorBoundary */}
      {isSimulatedCrash && <SimulatedCrashTrigger />}

      {/* Real-time ambient offline warning banner */}
      <OfflineBanner
        onViewOfflinePage={() => {
          window.history.pushState({}, '', '/offline');
          setRoute({ page: 'error-offline' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Viewport Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Subtle Hardware-Accelerated Ambient Cursor Spotlight (Non-touch devices only) */}
      <FuturisticSpotlight />

      {/* 3-Zone Sticky Navigation */}
      <Header
        activeSection={activeSection}
        onNavigateSection={(sectionId) => navigateToSection(sectionId)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenResume={handleOpenResumeModal}
      />

      {/* Customizable Workspace Sidebar Drawer (lazy loaded when opened) */}
      {sidebarOpen && (
        <Suspense fallback={null}>
          <WorkspaceSidebar
            onSelectProject={(id) => {
              const proj = PROJECTS.find((p) => p.id === id);
              if (proj) {
                setActiveSimulatorId(id);
                handleOpenProjectModal(proj);
              }
            }}
          />
        </Suspense>
      )}

      {/* Main Body: Error Page vs Detail Page vs Dual-Pane Split Workbench vs Standard Editorial Flow */}
      {route.page.startsWith('error-') ? (
        <main id="main-content" tabIndex={-1} className="flex-1 w-full max-w-full focus:outline-none">
          <SectionErrorBoundary sectionName="Diagnostic View">
            <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">Loading diagnostic view...</div>}>
              {route.page === 'error-offline' ? (
                <OfflinePage onReturnHome={handleReturnHome} onGoBack={handleGoBack} />
              ) : route.page === 'error-500' ? (
                <ServerErrorPage onReturnHome={handleReturnHome} onGoBack={handleGoBack} />
              ) : route.page === 'error-403' ? (
                <AccessDeniedPage onReturnHome={handleReturnHome} onGoBack={handleGoBack} />
              ) : route.page === 'error-408' ? (
                <RequestTimeoutPage onReturnHome={handleReturnHome} onGoBack={handleGoBack} />
              ) : route.page === 'error-502' ? (
                <BadGatewayPage onReturnHome={handleReturnHome} onGoBack={handleGoBack} />
              ) : route.page === 'error-503' ? (
                <ServiceUnavailablePage onReturnHome={handleReturnHome} onGoBack={handleGoBack} />
              ) : route.page === 'error-504' ? (
                <GatewayTimeoutPage onReturnHome={handleReturnHome} onGoBack={handleGoBack} />
              ) : route.page === 'error-app' ? (
                <AppExceptionPage onReturnHome={handleReturnHome} onReload={() => window.location.reload()} />
              ) : (
                <NotFoundPage onReturnHome={handleReturnHome} onGoBack={handleGoBack} />
              )}
            </Suspense>
          </SectionErrorBoundary>
        </main>
      ) : layoutMode === 'split' ? (
        <main id="main-content" tabIndex={-1} className="flex-1 w-full max-w-full overflow-x-clip focus:outline-none">
          <SectionErrorBoundary sectionName="Split-Screen Workspace">
            <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">Loading split workspace...</div>}>
              <SplitScreenWorkspace onOpenModal={handleOpenProjectModal} />
            </Suspense>
          </SectionErrorBoundary>
        </main>
      ) : (
        <main id="main-content" tabIndex={-1} className="flex-1 w-full max-w-full overflow-x-clip focus:outline-none">
          {/* Monolithic Hero Collage Section with Profile Portrait */}
          <SectionErrorBoundary sectionName="Hero Overview">
            <Hero
              onOpenTerminal={() => setIsTerminalOpen(true)}
              onExploreWork={handleExploreWork}
              onOpenResume={handleOpenResumeModal}
            />
          </SectionErrorBoundary>

          {/* Selected Works & Engineered Systems (Grid / List / Bento View) */}
          <SectionErrorBoundary sectionName="Selected Projects">
            <ScrollSectionReveal variant="curtain-rise" duration={0.62}>
              <ProjectShowcase onOpenModal={handleOpenProjectModal} />
            </ScrollSectionReveal>
          </SectionErrorBoundary>

          {/* Core Toolkit & Competencies (Lazy) */}
          <SectionErrorBoundary sectionName="Technical Skills">
            <LazySectionSlot
              id="skills"
              forceMount={mountedThroughIndex >= 2}
              fallbackLabel="Loading technical toolkit..."
            >
              <SkillsSection />
            </LazySectionSlot>
          </SectionErrorBoundary>

          {/* GitHub Activity & Open-Source Metrics (Lazy) */}
          <SectionErrorBoundary sectionName="GitHub Activity">
            <LazySectionSlot
              id="github-activity"
              forceMount={mountedThroughIndex >= 3}
              minHeightClass="min-h-[480px]"
              fallbackLabel="Loading GitHub activity..."
            >
              <GitHubActivitySection onExportModalOpenChange={setIsGitHubExportOpen} />
            </LazySectionSlot>
          </SectionErrorBoundary>

          {/* Verified Milestones & Certifications (Lazy) */}
          <SectionErrorBoundary sectionName="Experience & Milestones">
            <LazySectionSlot
              id="experience"
              forceMount={mountedThroughIndex >= 4}
              fallbackLabel="Loading milestones and education..."
            >
              <ExperienceSection />
            </LazySectionSlot>
          </SectionErrorBoundary>

          {/* Contact & Inquiries (Lazy) */}
          <SectionErrorBoundary sectionName="Contact Section">
            <LazySectionSlot
              id="contact"
              forceMount={mountedThroughIndex >= 5}
              fallbackLabel="Loading contact form..."
            >
              <ContactSection onOpenResume={handleOpenResumeModal} />
            </LazySectionSlot>
          </SectionErrorBoundary>
        </main>
      )}

      {/* Footer (lazy-loaded with section slots, hidden during dedicated error pages) */}
      {layoutMode === 'standard' && !route.page.startsWith('error-') && (
        <LazySectionSlot
          id="portfolio-footer-slot"
          forceMount={mountedThroughIndex >= 5 || hasUserScrolled}
          minHeightClass="min-h-[180px]"
          fallbackLabel=""
        >
          <Footer onNavigateTop={() => navigateToSection('overview')} />
        </LazySectionSlot>
      )}

      {/* Deep-Dive Project Modal with Interactive Simulator */}
      <SectionErrorBoundary sectionName="Project Details Modal">
        <Suspense fallback={null}>
          {activeProject && (
            <ProjectModal
              project={activeProject}
              onClose={handleCloseProjectModal}
            />
          )}
        </Suspense>
      </SectionErrorBoundary>

      {/* Official Technical Resume & Engineering Dossier Modal */}
      <SectionErrorBoundary sectionName="Resume Modal">
        <Suspense fallback={null}>
          {isResumeModalOpen && (
            <ResumeModal
              isOpen={isResumeModalOpen}
              onClose={handleCloseResumeModal}
            />
          )}
        </Suspense>
      </SectionErrorBoundary>

      {/* Interactive Error Experience Testing Lab Modal */}
      <SectionErrorBoundary sectionName="Error Experience Lab">
        <Suspense fallback={null}>
          {isErrorHubOpen && (
            <ErrorHubModal
              isOpen={isErrorHubOpen}
              onClose={() => setIsErrorHubOpen(false)}
              onSelectErrorRoute={(path) => {
                window.history.pushState({}, '', path);
                setRoute(getRouteFromUrl());
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onTriggerSimulatedCrash={() => setIsSimulatedCrash(true)}
            />
          )}
        </Suspense>
      </SectionErrorBoundary>

      {/* Developer Terminal Console Drawer (Cmd+K) */}
      <SectionErrorBoundary sectionName="Terminal Console">
        <Suspense fallback={null}>
          {isTerminalOpen && (
            <TerminalDrawer
              isOpen={isTerminalOpen}
              onClose={() => setIsTerminalOpen(false)}
              onOpenResume={handleOpenResumeModal}
              onNavigateSection={(sectionId) => {
                navigateToSection(sectionId);
              }}
              onSelectProject={(id) => {
                const p = PROJECTS.find((item) => item.id === id);
                if (p) {
                  setIsTerminalOpen(false);
                  handleOpenProjectModal(p);
                }
              }}
            />
          )}
        </Suspense>
      </SectionErrorBoundary>

      {/* Non-intrusive visitor-friendly runtime fallback notice (hidden when healthy) */}
      {friendlyNotice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 right-4 z-[60] max-w-xs px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] shadow-lg font-mono text-[11px] flex items-center justify-between gap-3"
        >
          <span>{friendlyNotice}</span>
          <button
            type="button"
            onClick={dismissNotice}
            aria-label="Dismiss notification"
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold px-1 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Floating workspace & navigation controls hidden when any modal/drawer/sidebar is open */}
      {!isAnyModalOpen && !sidebarOpen && (
        <>
          <Suspense fallback={null}>
            <LayoutController />
          </Suspense>

          <BackToTop onNavigateTop={() => navigateToSection('overview')} />

          <QuickActionsMenu
            onOpenTerminal={() => setIsTerminalOpen(true)}
            onNavigateSection={(sectionId) => navigateToSection(sectionId)}
          />
        </>
      )}

      {/* Global Framer Motion Glassmorphism Theme Transition Overlay */}
      <ThemeTransitionOverlay />
    </motion.div>
  );
}

export default function App() {
  useGlobalUtmTracking();

  return (
    <ErrorBoundary>
      <LayoutProvider>
        <PortfolioMainContent />
      </LayoutProvider>
    </ErrorBoundary>
  );
}
