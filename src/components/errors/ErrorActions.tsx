import React, { useEffect, useState, useRef } from 'react';
import { Home, ArrowLeft, RotateCw, Wifi, RefreshCcw, AlertTriangle } from 'lucide-react';
import { ErrorActionConfig } from './types';
import { soundFX } from '../../utils/soundEffects';

interface ErrorActionsProps {
  primaryAction?: ErrorActionConfig;
  secondaryAction?: ErrorActionConfig;
  tertiaryAction?: ErrorActionConfig;
  onReturnHome?: () => void;
  onGoBack?: () => void;
  onRetry?: () => void;
  className?: string;
}

export const ErrorActions: React.FC<ErrorActionsProps> = ({
  primaryAction,
  secondaryAction,
  tertiaryAction,
  onReturnHome,
  onGoBack,
  onRetry,
  className = '',
}) => {
  const [isDebounced, setIsDebounced] = useState<boolean>(false);
  const debounceTimerRef = useRef<number | null>(null);

  const handleActionClick = (actionFn?: () => void) => {
    if (!actionFn || isDebounced) return;

    soundFX.playClick();
    setIsDebounced(true);
    actionFn();

    // Debounce to prevent flooding
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => {
      setIsDebounced(false);
    }, 600);
  };

  const handleReturnHome = () => {
    if (onReturnHome) {
      onReturnHome();
      return;
    }
    window.location.href = '/';
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  // Keyboard shortcut listener for power users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focused inside an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleActionClick(primaryAction?.onClick || handleReturnHome);
      } else if (e.key === 'Escape' && (secondaryAction || onGoBack)) {
        e.preventDefault();
        handleActionClick(secondaryAction?.onClick || handleGoBack);
      } else if (e.key.toLowerCase() === 'r' && onRetry) {
        e.preventDefault();
        handleActionClick(onRetry);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [primaryAction, secondaryAction, onRetry]);

  // Default action configs if none provided
  const effectivePrimary: ErrorActionConfig = primaryAction || {
    label: 'Return Home',
    onClick: handleReturnHome,
    icon: <Home className="w-4 h-4" />,
    variant: 'primary',
    shortcut: 'H',
  };

  const effectiveSecondary: ErrorActionConfig | undefined = secondaryAction || (onGoBack ? {
    label: 'Go Back',
    onClick: handleGoBack,
    icon: <ArrowLeft className="w-4 h-4" />,
    variant: 'secondary',
    shortcut: 'Esc',
  } : undefined);

  const getButtonStyles = (variant: string = 'primary', disabled?: boolean) => {
    const base = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

    if (disabled || isDebounced) {
      return `${base} opacity-60 cursor-not-allowed bg-zinc-800 text-zinc-400 border-zinc-700`;
    }

    switch (variant) {
      case 'primary':
        return `${base} bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white border-[var(--accent)] shadow-[0_0_20px_rgba(225,29,72,0.35)] hover:shadow-[0_0_25px_rgba(225,29,72,0.5)] active:scale-[0.98]`;
      case 'secondary':
        return `${base} bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--text-main)] active:scale-[0.98]`;
      case 'outline':
        return `${base} bg-transparent hover:bg-white/5 text-[var(--text-main)] border-zinc-700 hover:border-zinc-500 active:scale-[0.98]`;
      case 'danger':
        return `${base} bg-red-600 hover:bg-red-700 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-[0.98]`;
      default:
        return `${base} bg-[var(--accent)] text-white border-[var(--accent)]`;
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 pt-4 ${className}`}>
      {/* Primary Action Button */}
      <button
        type="button"
        onClick={() => handleActionClick(effectivePrimary.onClick)}
        disabled={effectivePrimary.disabled || isDebounced}
        className={getButtonStyles(effectivePrimary.variant, effectivePrimary.disabled)}
        title={effectivePrimary.shortcut ? `Press [${effectivePrimary.shortcut}]` : undefined}
      >
        {effectivePrimary.loading ? (
          <RotateCw className="w-4 h-4 animate-spin text-white" />
        ) : (
          effectivePrimary.icon || <Home className="w-4 h-4" />
        )}
        <span>{effectivePrimary.label}</span>
        {effectivePrimary.shortcut && (
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[9px] bg-black/30 border border-white/20 rounded-xs text-white/80">
            {effectivePrimary.shortcut}
          </kbd>
        )}
      </button>

      {/* Secondary Action Button */}
      {effectiveSecondary && (
        <button
          type="button"
          onClick={() => handleActionClick(effectiveSecondary.onClick)}
          disabled={effectiveSecondary.disabled || isDebounced}
          className={getButtonStyles(effectiveSecondary.variant || 'secondary', effectiveSecondary.disabled)}
          title={effectiveSecondary.shortcut ? `Press [${effectiveSecondary.shortcut}]` : undefined}
        >
          {effectiveSecondary.loading ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            effectiveSecondary.icon || <ArrowLeft className="w-4 h-4" />
          )}
          <span>{effectiveSecondary.label}</span>
          {effectiveSecondary.shortcut && (
            <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[9px] bg-black/10 dark:bg-white/10 border border-zinc-400 dark:border-zinc-600 rounded-xs text-[var(--text-muted)]">
              {effectiveSecondary.shortcut}
            </kbd>
          )}
        </button>
      )}

      {/* Tertiary Action Button */}
      {tertiaryAction && (
        <button
          type="button"
          onClick={() => handleActionClick(tertiaryAction.onClick)}
          disabled={tertiaryAction.disabled || isDebounced}
          className={getButtonStyles(tertiaryAction.variant || 'outline', tertiaryAction.disabled)}
        >
          {tertiaryAction.loading ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            tertiaryAction.icon
          )}
          <span>{tertiaryAction.label}</span>
        </button>
      )}
    </div>
  );
};
