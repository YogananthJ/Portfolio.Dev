import React, { useEffect, useRef, useState } from 'react';

/**
 * Provides a non-blocking long-press label preview on touch devices while
 * keeping quick taps (onClick / href) immediate and unmodified.
 */
export function useTouchExpandPreview(previewDurationMs = 2000) {
  const [touchExpanded, setTouchExpanded] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const clearTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (clearTimerRef.current !== null) {
      window.clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
  };

  useEffect(() => clearTimers, []);

  const onTouchStart = () => {
    clearTimers();
    holdTimerRef.current = window.setTimeout(() => {
      setTouchExpanded(true);
      clearTimerRef.current = window.setTimeout(() => {
        setTouchExpanded(false);
      }, previewDurationMs);
    }, 320);
  };

  const cancelHold = () => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const dismiss = () => {
    clearTimers();
    setTouchExpanded(false);
  };

  return {
    'data-touch-expanded': touchExpanded ? ('true' as const) : undefined,
    onTouchStart,
    onTouchEnd: cancelHold,
    onTouchCancel: dismiss,
    onTouchMove: dismiss,
  };
}

interface ExpandableLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const ExpandableLabel: React.FC<ExpandableLabelProps> = ({ children, className = '' }) => (
  <span className="expandable-icon-label" aria-hidden="true">
    <span className={`expandable-icon-label-inner ${className}`}>{children}</span>
  </span>
);

interface SharedExpandableProps {
  variant?: 'header' | 'floating';
  icon: React.ReactNode;
  label: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export interface ExpandableIconButtonProps
  extends SharedExpandableProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {}

export const ExpandableIconButton: React.FC<ExpandableIconButtonProps> = ({
  variant = 'header',
  icon,
  label,
  className = '',
  labelClassName = '',
  type = 'button',
  ...buttonProps
}) => {
  const touchPreviewProps = useTouchExpandPreview();
  const variantClass =
    variant === 'floating' ? 'expandable-icon-btn--floating' : 'expandable-icon-btn--header';

  return (
    <button
      type={type}
      className={`expandable-icon-btn ${variantClass} ${className}`}
      {...touchPreviewProps}
      {...buttonProps}
    >
      {icon}
      <ExpandableLabel className={labelClassName}>{label}</ExpandableLabel>
    </button>
  );
};

export interface ExpandableIconLinkProps
  extends SharedExpandableProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {}

export const ExpandableIconLink: React.FC<ExpandableIconLinkProps> = ({
  variant = 'header',
  icon,
  label,
  className = '',
  labelClassName = '',
  ...anchorProps
}) => {
  const touchPreviewProps = useTouchExpandPreview();
  const variantClass =
    variant === 'floating' ? 'expandable-icon-btn--floating' : 'expandable-icon-btn--header';

  return (
    <a
      className={`expandable-icon-btn ${variantClass} ${className}`}
      {...touchPreviewProps}
      {...anchorProps}
    >
      {icon}
      <ExpandableLabel className={labelClassName}>{label}</ExpandableLabel>
    </a>
  );
};
