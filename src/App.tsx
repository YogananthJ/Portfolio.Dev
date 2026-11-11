import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectShowcase } from './components/ProjectShowcase';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';
import { SimulatorsSection } from './components/SimulatorsSection';
import { MotionPlayground } from './components/motion-playground/MotionPlayground';
import { MotionExperimentPage } from './components/motion-playground/detail/MotionExperimentPage';
import { SkillsSection } from './components/SkillsSection';
import { GitHubActivitySection } from './components/GitHubActivitySection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ResumeModal } from './components/ResumeModal';
import { TerminalDrawer } from './components/TerminalDrawer';
import { LayoutController } from './components/LayoutController';
import { WorkspaceSidebar } from './components/WorkspaceSidebar';
import { SplitScreenWorkspace } from './components/SplitScreenWorkspace';
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
import {
  ErrorBoundary,
  OfflineBanner,
  ErrorHubModal,
  NotFoundPage,
  OfflinePage,
  ServerErrorPage,
  AccessDeniedPage,
  RequestTimeoutPage,
  BadGatewayPage,
  ServiceUnavailablePage,
  GatewayTimeoutPage,
  AppExceptionPage,
} from './components/errors';

function PortfolioMainContent() {
  const { layoutMode, setLayoutMode, setActiveSimulatorId, isThemeTransitioning } = useLayout();
  const shouldReduceMotion = useReducedMotion();
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isErrorHubOpen, setIsErrorHubOpen] = useState<boolean>(false);
  const [isSimulatedCrash, setIsSimulatedCrash] = useState<boolean>(false);

  // Client-side route detection for Motion Lab (/motion-lab/:id) and Error Pages (/404, /offline, etc.)
  const getRouteFromUrl = () => {
    if (typeof window === 'undefined') return { page: 'home', experimentId: '' };
    const pathname = window.location.pathname;
    const hash = window.location.hash;

    // Motion Lab detail pages
    if (pathname.startsWith('/motion-lab/')) {
      const expId = pathname.replace('/motion-lab/', '').split('/')[0];
      return { page: 'motion-detail', experimentId: expId };
    }
    if (hash.startsWith('#/motion-lab/') || hash.startsWith('#motion-lab/')) {
      const expId = hash.replace(/^#\/?motion-lab\//, '').split('/')[0];
      return { page: 'motion-detail', experimentId: expId };
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
        <main className="flex-1 w-full max-w-full">
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
        </main>
      ) : route.page === 'motion-detail' && route.experimentId ? (
        <main className="flex-1 w-full max-w-full overflow-x-clip">
          <MotionExperimentPage
            experimentId={route.experimentId}
            onBack={handleBackToMotionLab}
          />
        </main>
      ) : layoutMode === 'split' ? (
        <main className="flex-1 w-full max-w-full overflow-x-clip">
          <SplitScreenWorkspace onOpenModal={handleOpenProjectModal} />
        </main>
      ) : (
        <main className="flex-1 w-full max-w-full overflow-x-clip">
          {/* Monolithic Hero Collage Section with Profile Portrait */}
          <Hero
            onOpenTerminal={() => setIsTerminalOpen(true)}
            onExploreWork={handleExploreWork}
            onLaunchSimulator={handleLaunchSimulator}
            onOpenResume={() => setIsResumeModalOpen(true)}
          />

          {/* Selected Works & Engineered Systems (Grid / List / Bento View) */}
          <ScrollSectionReveal>
            <ProjectShowcase onOpenModal={handleOpenProjectModal} />
          </ScrollSectionReveal>

          {/* Interactive Architecture Explorer (Node & Edge Schematics) */}
          <ScrollSectionReveal>
            <ArchitectureExplorer initialProjectId="cognitive-ai" />
          </ScrollSectionReveal>

          {/* Dedicated Live Interactive Model Lab & Simulators (AI Projects Only) */}
          <ScrollSectionReveal>
            <SimulatorsSection />
          </ScrollSectionReveal>

          {/* Motion Playground & Interactive Animation Code Lab */}
          <ScrollSectionReveal>
            <MotionPlayground onOpenDetail={handleOpenMotionDetail} />
          </ScrollSectionReveal>

          {/* Core Toolkit & Competencies */}
          <ScrollSectionReveal>
            <SkillsSection />
          </ScrollSectionReveal>

          {/* GitHub Activity & Open-Source Metrics */}
          <ScrollSectionReveal>
            <GitHubActivitySection />
          </ScrollSectionReveal>

          {/* Verified Milestones & Certifications */}
          <ScrollSectionReveal>
            <ExperienceSection />
          </ScrollSectionReveal>

          {/* Contact & Inquiries */}
          <ScrollSectionReveal>
            <ContactSection onOpenResume={() => setIsResumeModalOpen(true)} />
          </ScrollSectionReveal>
        </main>
      )}

      {/* Footer (shown in standard mode or detail view, hidden during dedicated error page experiences) */}
      {(layoutMode === 'standard' || route.page === 'motion-detail') && !route.page.startsWith('error-') && <Footer />}

      {/* Deep-Dive Project Modal with Interactive Simulator */}
      <ProjectModal
        project={activeProject}
        onClose={handleCloseProjectModal}
      />

      {/* Official Technical Resume & Engineering Dossier Modal */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      {/* Interactive Error Experience Testing Lab Modal */}
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

      {/* Developer Terminal Console Drawer (Cmd+K) */}
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
  return (
    <ErrorBoundary>
      <LayoutProvider>
        <PortfolioMainContent />
      </LayoutProvider>
    </ErrorBoundary>
  );
}
