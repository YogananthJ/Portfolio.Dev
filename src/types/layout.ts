export type LayoutMode = 'standard' | 'split' | 'focus';
export type ViewMode = 'grid' | 'list' | 'bento';
export type DensityMode = 'comfortable' | 'compact' | 'spacious';

export interface LayoutSettings {
  layoutMode: LayoutMode;
  viewMode: ViewMode;
  density: DensityMode;
  sidebarOpen: boolean;
  splitRatio: number; // 40 = 40% left, 50 = 50% left, 60 = 60% left
  activeSimulatorId: string;
}
