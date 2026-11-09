import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  LayoutMode, 
  ViewMode, 
  DensityMode, 
  AppearanceMode, 
  AccentTheme, 
  LayoutSettings 
} from '../types/layout';

interface LayoutContextType extends LayoutSettings {
  setLayoutMode: (mode: LayoutMode) => void;
  setViewMode: (mode: ViewMode) => void;
  setDensity: (density: DensityMode) => void;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setSplitRatio: (ratio: number) => void;
  setActiveSimulatorId: (id: string) => void;
  setAppearance: (appearance: AppearanceMode) => void;
  setAccentTheme: (theme: AccentTheme) => void;
  toggleSidebar: () => void;
  isDark: boolean;
  isThemeTransitioning: boolean;
  toggleTheme: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('standard');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [density, setDensity] = useState<DensityMode>('comfortable');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const [activeSimulatorId, setActiveSimulatorId] = useState<string>('pdf-rag');

  // Appearance (Light, Dark, System) with localStorage persistence
  const [appearance, setAppearanceState] = useState<AppearanceMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yogananth_appearance');
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    }
    return 'light';
  });

  // Accent Theme (Signal Red, Electric Blue, Forest Green, Violet) with localStorage persistence
  const [accentTheme, setAccentThemeState] = useState<AccentTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yogananth_accent');
      if (saved === 'signal-red' || saved === 'electric-blue' || saved === 'forest-green' || saved === 'violet') {
        return saved;
      }
    }
    return 'signal-red';
  });

  // Theme Transition State & Timers for Global Framer Motion Cross-fade
  const [isThemeTransitioning, setIsThemeTransitioning] = useState<boolean>(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const isMountedRef = useRef<boolean>(false);

  // Helper to determine effective isDark boolean
  const getIsDark = (mode: AppearanceMode): boolean => {
    if (typeof window === 'undefined') return false;
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const isDark = getIsDark(appearance);

  const triggerThemeTransition = () => {
    setIsThemeTransitioning(true);
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsThemeTransitioning(false);
    }, 550);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleSetLayoutMode = (mode: LayoutMode) => {
    setLayoutMode(mode);
    if (mode === 'split') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setAppearance = (mode: AppearanceMode) => {
    const nextIsDark = getIsDark(mode);
    const currentIsDark = getIsDark(appearance);

    if (isMountedRef.current && nextIsDark !== currentIsDark) {
      triggerThemeTransition();
    }

    setAppearanceState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yogananth_appearance', mode);
    }
  };

  const toggleTheme = () => {
    const nextMode: AppearanceMode = isDark ? 'light' : 'dark';
    setAppearance(nextMode);
  };

  const setAccentTheme = (theme: AccentTheme) => {
    setAccentThemeState(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yogananth_accent', theme);
    }
  };

  // Mount tracking and cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Sync DOM classes with appearance and accentTheme
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    // Handle appearance
    const darkActive = getIsDark(appearance);

    if (darkActive) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Handle accent theme class
    root.classList.remove('theme-signal-red', 'theme-electric-blue', 'theme-forest-green', 'theme-violet');
    root.classList.add(`theme-${accentTheme}`);

    // System theme change listener
    if (appearance === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        if (isMountedRef.current) {
          triggerThemeTransition();
        }
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [appearance, accentTheme]);

  return (
    <LayoutContext.Provider
      value={{
        layoutMode,
        viewMode,
        density,
        sidebarOpen,
        splitRatio,
        activeSimulatorId,
        appearance,
        accentTheme,
        isDark,
        isThemeTransitioning,
        setLayoutMode: handleSetLayoutMode,
        setViewMode,
        setDensity,
        setSidebarOpen,
        setSplitRatio,
        setActiveSimulatorId,
        setAppearance,
        setAccentTheme,
        toggleSidebar,
        toggleTheme,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
