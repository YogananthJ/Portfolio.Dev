export type ErrorCode = 
  | '404' 
  | 'offline' 
  | '500' 
  | '403' 
  | '408' 
  | '502' 
  | '503' 
  | '504' 
  | 'app-error';

export interface ErrorActionConfig {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  loading?: boolean;
}

export interface ErrorDetails {
  code: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  protocolCode?: string;
  timestamp?: string;
}
