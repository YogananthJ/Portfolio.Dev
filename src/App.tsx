import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectShowcase } from './components/ProjectShowcase';
import { SimulatorsSection } from './components/SimulatorsSection';
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
  const { layoutMode, setActiveSimulatorId } = useLayout();
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for Terminal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    const sectionIds = ['overview', 'projects', 'simulators', 'skills', 'experience', 'contact'];
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
    <div className="min-h-screen bg-[#F5F2EB] text-[#121212] flex flex-col font-sans selection:bg-[#E11D48] selection:text-white relative">
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

      {/* Main Body: Dual-Pane Split Workbench vs Standard Editorial Flow */}
      {layoutMode === 'split' ? (
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

          {/* Dedicated Live Interactive Model Lab & Simulators */}
          <SimulatorsSection />

          {/* Core Toolkit & Competencies */}
          <SkillsSection />

          {/* Timeline & Professional Experience */}
          <ExperienceSection />

          {/* Contact & Inquiries */}
          <ContactSection />
        </main>
      )}

      {/* Footer (shown in standard mode) */}
      {layoutMode === 'standard' && <Footer />}

      {/* Deep-Dive Project Modal with Interactive Simulator */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />

      {/* Developer Terminal Console Drawer (Cmd+K) */}
      <TerminalDrawer
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
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
