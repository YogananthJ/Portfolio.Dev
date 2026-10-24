import React, { createContext, useContext, useState, useEffect } from 'react';
import { LayoutMode, ViewMode, DensityMode, LayoutSettings } from '../types/layout';

interface LayoutContextType extends LayoutSettings {
  setLayoutMode: (mode: LayoutMode) => void;
  setViewMode: (mode: ViewMode) => void;
  setDensity: (density: DensityMode) => void;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setSplitRatio: (ratio: number) => void;
  setActiveSimulatorId: (id: string) => void;
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('standard');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [density, setDensity] = useState<DensityMode>('comfortable');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const [activeSimulatorId, setActiveSimulatorId] = useState<string>('loan-approval');

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // If user enters split mode, automatically select simulator
  const handleSetLayoutMode = (mode: LayoutMode) => {
    setLayoutMode(mode);
    if (mode === 'split') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <LayoutContext.Provider
      value={{
        layoutMode,
        viewMode,
        density,
        sidebarOpen,
        splitRatio,
        activeSimulatorId,
        setLayoutMode: handleSetLayoutMode,
        setViewMode,
        setDensity,
        setSidebarOpen,
        setSplitRatio,
        setActiveSimulatorId,
        toggleSidebar,
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
