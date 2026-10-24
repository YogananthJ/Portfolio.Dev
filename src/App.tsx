import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectShowcase } from './components/ProjectShowcase';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';
import { SimulatorsSection } from './components/SimulatorsSection';
import { MotionPlayground } from './components/motion-playground/MotionPlayground';
import { MotionExperimentPage } from './components/motion-playground/detail/MotionExperimentPage';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { TerminalDrawer } from './components/TerminalDrawer';
import { LayoutController } from './components/LayoutController';
import { WorkspaceSidebar } from './components/WorkspaceSidebar';
import { SplitScreenWorkspace } from './components/SplitScreenWorkspace';
import { LayoutProvider, useLayout } from './context/LayoutContext';
import { ProjectItem } from './types/portfolio';
import { PROJECTS } from './data/portfolioData';

function PortfolioMainContent() {
  const { layoutMode, setLayoutMode, setActiveSimulatorId } = useLayout();
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Client-side route detection for Motion Lab experiment detail pages (/motion-lab/:id)
  const getRouteFromUrl = () => {
    if (typeof window === 'undefined') return { page: 'home', experimentId: '' };
    const pathname = window.location.pathname;
    const hash = window.location.hash;

    if (pathname.startsWith('/motion-lab/')) {
      const expId = pathname.replace('/motion-lab/', '').split('/')[0];
      return { page: 'motion-detail', experimentId: expId };
    }
    if (hash.startsWith('#/motion-lab/') || hash.startsWith('#motion-lab/')) {
      const expId = hash.replace(/^#\/?motion-lab\//, '').split('/')[0];
      return { page: 'motion-detail', experimentId: expId };
    }
    return { page: 'home', experimentId: '' };
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
    const sectionIds = ['overview', 'projects', 'architecture', 'simulators', 'motion-playground', 'skills', 'experience', 'contact'];
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

  const handleOpenProjectModal = (project: ProjectItem) => {
    setActiveProject(project);
  };

  const handleLaunchSimulator = (projectId: string) => {
    const proj = PROJECTS.find((p) => p.id === projectId) || PROJECTS[0];
    setActiveSimulatorId(projectId);
    setActiveProject(proj);
  };

  const handleExploreWork = () => {
    const projectsEl = document.getElementById('projects');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-main)] flex flex-col font-sans selection:bg-[var(--accent)] selection:text-white relative">
      {/* 3-Zone Sticky Navigation */}
      <Header
        activeSection={activeSection}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      {/* Customizable Workspace Sidebar Drawer */}
      <WorkspaceSidebar
        onSelectProject={(id) => {
          const proj = PROJECTS.find((p) => p.id === id);
          if (proj) {
            setActiveSimulatorId(id);
            setActiveProject(proj);
          }
        }}
      />

      {/* Main Body: Detail Page vs Dual-Pane Split Workbench vs Standard Editorial Flow */}
      {route.page === 'motion-detail' && route.experimentId ? (
        <main className="flex-1">
          <MotionExperimentPage
            experimentId={route.experimentId}
            onBack={handleBackToMotionLab}
          />
        </main>
      ) : layoutMode === 'split' ? (
        <main className="flex-1">
          <SplitScreenWorkspace onOpenModal={handleOpenProjectModal} />
        </main>
      ) : (
        <main className="flex-1">
          {/* Monolithic Hero Collage Section with Profile Portrait */}
          <Hero
            onOpenTerminal={() => setIsTerminalOpen(true)}
            onExploreWork={handleExploreWork}
            onLaunchSimulator={handleLaunchSimulator}
          />

          {/* Selected Works & Engineered Systems (Grid / List / Bento View) */}
          <ProjectShowcase onOpenModal={handleOpenProjectModal} />

          {/* Interactive Architecture Explorer (Node & Edge Schematics) */}
          <ArchitectureExplorer initialProjectId="cognitive-ai" />

          {/* Dedicated Live Interactive Model Lab & Simulators (AI Projects Only) */}
          <SimulatorsSection />

          {/* Motion Playground & Interactive Animation Code Lab */}
          <MotionPlayground onOpenDetail={handleOpenMotionDetail} />

          {/* Core Toolkit & Competencies */}
          <SkillsSection />

          {/* Verified Milestones & Certifications */}
          <ExperienceSection />

          {/* Contact & Inquiries */}
          <ContactSection />
        </main>
      )}

      {/* Footer (shown in standard mode or detail view) */}
      {(layoutMode === 'standard' || route.page === 'motion-detail') && <Footer />}

      {/* Deep-Dive Project Modal with Interactive Simulator */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />

      {/* Developer Terminal Console Drawer (Cmd+K) */}
      <TerminalDrawer
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
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
            setActiveProject(p);
          }
        }}
      />

      {/* Global Floating Layout & Workspace Controller */}
      <LayoutController />
    </div>
  );
}

export default function App() {
  return (
    <LayoutProvider>
      <PortfolioMainContent />
    </LayoutProvider>
  );
}
