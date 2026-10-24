export type TerminalTheme = 'default' | 'matrix' | 'cyberpunk' | 'dracula' | 'amber' | 'paper';

export interface CommandHistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export interface TerminalThemeConfig {
  name: TerminalTheme;
  label: string;
  bg: string;
  headerBg: string;
  text: string;
  accent: string;
  secondary: string;
  prompt: string;
  border: string;
}
