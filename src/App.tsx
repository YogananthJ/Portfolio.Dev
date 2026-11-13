import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectShowcase } from './components/ProjectShowcase';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';
import { SimulatorsSection } from './components/SimulatorsSection';
import { MotionPlayground } from './components/motion-playground/MotionPlayground';
import { SkillsSection } from './components/SkillsSection';
import { GitHubActivitySection } from './components/GitHubActivitySection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LayoutController } from './components/LayoutController';
import { WorkspaceSidebar } from './components/WorkspaceSidebar';
import { LayoutProvider, useLayout } from './context/LayoutContext';
import { motion, useReducedMotion } from 'framer-motion';
import { ProjectItem } from './types/portfolio';
import { PROJECTS } from './data/portfolioData';
import { ALL_EXPERIMENT_DETAILS } from './components/motion-playground/detail-data';
import { ScrollProgressBar } from './components/common/ScrollProgressBar';
import { BackToTop } from './components/common/BackToTop';
import { QuickActionsMenu } from './components/common/QuickActionsMenu';
import { FuturisticSpotlight } from './components/common/FuturisticSpotlight';
import { ScrollSectionReveal } from './components/common/ScrollSectionReveal';
import { ThemeTransitionOverlay } from './components/common/ThemeTransitionOverlay';
import { useGlobalUtmTracking } from './hooks/useGlobalUtmTracking';
import { useErrorMonitoring } from './hooks/useErrorMonitoring';
import { trackGa4PageView, trackProjectModalOpen } from './utils/ga4';
import { ErrorBoundary } from './components/errors/ErrorBoundary';
import { SectionErrorBoundary } from './components/errors/SectionErrorBoundary';
import { OfflineBanner } from './components/errors/OfflineBanner';
import { AppExceptionPage } from './components/errors/pages/AppExceptionPage';

const MotionExperimentPage = lazy(() =>
  import('./components/motion-playground/detail/MotionExperimentPage').then((m) => ({ default: m.MotionExperimentPage }))
);
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
  const { layoutMode, setLayoutMode, setActiveSimulatorId, isThemeTransitioning } = useLayout();
  const shouldReduceMotion = useReducedMotion();
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isErrorHubOpen, setIsErrorHubOpen] = useState<boolean>(false);
  const [isSimulatedCrash, setIsSimulatedCrash] = useState<boolean>(false);
  const { friendlyNotice, dismissNotice } = useErrorMonitoring();

  // Client-side route detection for Motion Lab (/motion-lab/:id) and Error Pages (/404, /offline, etc.)
  const getRouteFromUrl = () => {
    if (typeof window === 'undefined') return { page: 'home', experimentId: '' };
    const pathname = window.location.pathname;
    const hash = window.location.hash;

    // Motion Lab detail pages
    if (pathname.startsWith('/motion-lab/')) {
      const expId = pathname.replace('/motion-lab/', '').split('/')[0];
      if (expId && Object.prototype.hasOwnProperty.call(ALL_EXPERIMENT_DETAILS, expId)) {
        return { page: 'motion-detail', experimentId: expId };
      }
      return { page: 'error-404', experimentId: '' };
    }
    if (hash.startsWith('#/motion-lab/') || hash.startsWith('#motion-lab/')) {
      const expId = hash.replace(/^#\/?motion-lab\//, '').split('/')[0];
      if (expId && Object.prototype.hasOwnProperty.call(ALL_EXPERIMENT_DETAILS, expId)) {
        return { page: 'motion-detail', experimentId: expId };
      }
      return { page: 'error-404', experimentId: '' };
    }

    // Specific custom error routes (e.g. /404, /offline, /500, /403, /408, /502, /503, /504, /app-error)
    const cleanPath = pathname.toLowerCase().replace(/\/$/, '');
    const cleanHash = hash.toLowerCase().replace(/^#\/?/, '').replace(/\/$/, '');

    const errorCodes = ['404', 'offline', '500', '403', '408', '502', '503', '504', 'app-error'];
    for (const code of errorCodes) {
      if (cleanPath === `/${code}` || cleanHash === code || cleanHash === `error/${code}`) {
        return { page: `error-${code === 'app-error' ? 'app' : code}`, experimentId: '' };
      }
    }

    if (cleanPath.startsWith('/error/')) {
      const sub = cleanPath.replace('/error/', '').split('/')[0];
      return { page: `error-${sub}`, experimentId: '' };
    }

    // Home or root path
    if (cleanPath === '' || cleanPath === '/' || cleanPath === '/index.html') {
      return { page: 'home', experimentId: '' };
    }

    // Any other unrecognized route triggers 404 (Lost in Digital Void)
    return { page: 'error-404', experimentId: '' };
  };

  const [route, setRoute] = useState<{ page: string; experimentId: string }>(getRouteFromUrl);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getRouteFromUrl());
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

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

    if (route.page === 'motion-detail' && route.experimentId) {
      const detail =
        ALL_EXPERIMENT_DETAILS[route.experimentId as keyof typeof ALL_EXPERIMENT_DETAILS];
      if (detail) {
        const expUrl = `${BASE_URL}/motion-lab/${detail.id}`;
        const expTitle = `${detail.title} — Motion Lab | Yogananth J`;
        const expDesc = `${detail.subtitle}. ${detail.description}`.slice(0, 158);
        document.title = expTitle;
        setMeta('name', 'robots', 'index, follow');
        setMeta('name', 'description', expDesc);
        if (canonicalEl) canonicalEl.setAttribute('href', expUrl);
        setMeta('property', 'og:title', expTitle);
        setMeta('property', 'og:description', expDesc);
        setMeta('property', 'og:url', expUrl);
        setMeta('name', 'twitter:title', expTitle);
        setMeta('name', 'twitter:description', expDesc);
        setMeta('name', 'twitter:url', expUrl);
        trackGa4PageView(`/motion-lab/${detail.id}`, expTitle);
        return;
      }
    }

    document.title = DEFAULT_TITLE;
    setMeta('name', 'robots', 'index, follow');
    setMeta('name', 'description', DEFAULT_DESC);
    if (canonicalEl) canonicalEl.setAttribute('href', `${BASE_URL}/`);
    setMeta('property', 'og:title', DEFAULT_TITLE);
    setMeta('property', 'og:description', DEFAULT_DESC);
    setMeta('property', 'og:url', `${BASE_URL}/`);
    setMeta('name', 'twitter:title', DEFAULT_TITLE);
    setMeta('name', 'twitter:description', DEFAULT_DESC);
    setMeta('name', 'twitter:url', `${BASE_URL}/`);
    trackGa4PageView('/', DEFAULT_TITLE);
  }, [route]);

  // Listen for Error Experience Hub launch events from Terminal or Workspace Controls
  useEffect(() => {
    const handleOpenHub = () => setIsErrorHubOpen(true);
    window.addEventListener('open-error-hub', handleOpenHub);
    return () => window.removeEventListener('open-error-hub', handleOpenHub);
  }, []);

  const handleReturnHome = () => {
    window.history.pushState({}, '', '/');
    setRoute({ page: 'home', experimentId: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleReturnHome();
    }
  };

  const handleOpenMotionDetail = (experimentId: string) => {
    window.history.pushState({}, '', `/motion-lab/${experimentId}`);
    setRoute({ page: 'motion-detail', experimentId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMotionLab = () => {
    window.history.pushState({}, '', '/#motion-playground');
    setRoute({ page: 'home', experimentId: '' });
    setTimeout(() => {
      const el = document.getElementById('motion-playground');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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

  // Active section scroll spy (standard layout)
  useEffect(() => {
    if (layoutMode !== 'standard') return;
    const sectionIds = ['overview', 'projects', 'architecture', 'simulators', 'motion-playground', 'skills', 'github-activity', 'experience', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [layoutMode]);

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
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('project', project.id);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Fallback if URL mutation fails
    }
  };

  const handleCloseProjectModal = () => {
    setActiveProject(null);
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('project')) {
        url.searchParams.delete('project');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : '') + url.hash);
      }
    } catch {
      // Fallback
    }
  };

  const handleLaunchSimulator = (projectId: string) => {
    const proj = PROJECTS.find((p) => p.id === projectId) || PROJECTS[0];
    setActiveSimulatorId(projectId);
    handleOpenProjectModal(proj);
  };

  const handleExploreWork = () => {
    const projectsEl = document.getElementById('projects');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth' });
    }
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
          setRoute({ page: 'error-offline', experimentId: '' });
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
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenResume={() => setIsResumeModalOpen(true)}
      />

      {/* Customizable Workspace Sidebar Drawer */}
      <WorkspaceSidebar
        onSelectProject={(id) => {
          const proj = PROJECTS.find((p) => p.id === id);
          if (proj) {
            setActiveSimulatorId(id);
            handleOpenProjectModal(proj);
          }
        }}
      />

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
      ) : route.page === 'motion-detail' && route.experimentId ? (
        <main id="main-content" tabIndex={-1} className="flex-1 w-full max-w-full overflow-x-clip focus:outline-none">
          <SectionErrorBoundary sectionName="Motion Experiment">
            <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">Loading motion experiment...</div>}>
              <MotionExperimentPage
                experimentId={route.experimentId}
                onBack={handleBackToMotionLab}
              />
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
              onLaunchSimulator={handleLaunchSimulator}
              onOpenResume={() => setIsResumeModalOpen(true)}
            />
          </SectionErrorBoundary>

          {/* Selected Works & Engineered Systems (Grid / List / Bento View) */}
          <SectionErrorBoundary sectionName="Selected Projects">
            <ScrollSectionReveal>
              <ProjectShowcase onOpenModal={handleOpenProjectModal} />
            </ScrollSectionReveal>
          </SectionErrorBoundary>

          {/* Interactive Architecture Explorer (Node & Edge Schematics) */}
          <SectionErrorBoundary sectionName="Architecture Explorer">
            <ScrollSectionReveal>
              <ArchitectureExplorer initialProjectId="cognitive-ai" />
            </ScrollSectionReveal>
          </SectionErrorBoundary>

          {/* Dedicated Live Interactive Model Lab & Simulators (AI Projects Only) */}
          <SectionErrorBoundary sectionName="AI Simulators">
            <ScrollSectionReveal>
              <SimulatorsSection />
            </ScrollSectionReveal>
          </SectionErrorBoundary>

          {/* Motion Playground & Interactive Animation Code Lab */}
          <SectionErrorBoundary sectionName="Motion Playground">
            <ScrollSectionReveal>
              <MotionPlayground onOpenDetail={handleOpenMotionDetail} />
            </ScrollSectionReveal>
          </SectionErrorBoundary>

          {/* Core Toolkit & Competencies */}
          <SectionErrorBoundary sectionName="Technical Skills">
            <ScrollSectionReveal>
              <SkillsSection />
            </ScrollSectionReveal>
          </SectionErrorBoundary>

          {/* GitHub Activity & Open-Source Metrics */}
          <SectionErrorBoundary sectionName="GitHub Activity">
            <ScrollSectionReveal>
              <GitHubActivitySection />
            </ScrollSectionReveal>
          </SectionErrorBoundary>

          {/* Verified Milestones & Certifications */}
          <SectionErrorBoundary sectionName="Experience & Milestones">
            <ScrollSectionReveal>
              <ExperienceSection />
            </ScrollSectionReveal>
          </SectionErrorBoundary>

          {/* Contact & Inquiries */}
          <SectionErrorBoundary sectionName="Contact Section">
            <ScrollSectionReveal>
              <ContactSection onOpenResume={() => setIsResumeModalOpen(true)} />
            </ScrollSectionReveal>
          </SectionErrorBoundary>
        </main>
      )}

      {/* Footer (shown in standard mode or detail view, hidden during dedicated error page experiences) */}
      {(layoutMode === 'standard' || route.page === 'motion-detail') && !route.page.startsWith('error-') && <Footer />}

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
              onClose={() => setIsResumeModalOpen(false)}
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
              onOpenResume={() => setIsResumeModalOpen(true)}
              onNavigateSection={(sectionId) => {
                if (layoutMode === 'split') {
                  setLayoutMode('standard');
                }
                setTimeout(() => {
                  const el = document.getElementById(sectionId);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
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

      {/* Global Floating Layout & Workspace Controller */}
      <LayoutController />

      {/* Floating Back To Top Button */}
      <BackToTop />

      {/* Expandable Quick Actions Menu in Bottom-Left Corner */}
      <QuickActionsMenu onOpenTerminal={() => setIsTerminalOpen(true)} />

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
