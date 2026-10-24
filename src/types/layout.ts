export type LayoutMode = 'standard' | 'split' | 'focus';
export type ViewMode = 'grid' | 'list' | 'bento';
export type DensityMode = 'comfortable' | 'compact' | 'spacious';
export type AppearanceMode = 'light' | 'dark' | 'system';
export type AccentTheme = 'signal-red' | 'electric-blue' | 'forest-green' | 'violet';

export interface LayoutSettings {
  layoutMode: LayoutMode;
  viewMode: ViewMode;
  density: DensityMode;
  sidebarOpen: boolean;
  splitRatio: number;
  activeSimulatorId: string;
  appearance: AppearanceMode;
  accentTheme: AccentTheme;
}
