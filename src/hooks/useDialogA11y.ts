import { useEffect, useRef, RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Reusable dialog accessibility hook:
 * - Captures previously focused element and restores focus on close.
 * - Moves initial focus into the dialog container.
 * - Traps Tab / Shift+Tab navigation inside the dialog.
 * - Closes on Escape key.
 */
export function useDialogA11y(
  isOpen: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  onClose: () => void
): void {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusTimeout = window.setTimeout(() => {
      const container = dialogRef.current;
      if (!container) return;
      if (!container.contains(document.activeElement)) {
        container.focus({ preventScroll: true });
      }
    }, 20);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (e.key !== 'Tab') return;
      const container = dialogRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusable.length === 0) {
        e.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === container) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimeout);
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocus && typeof previousFocus.focus === 'function') {
        window.requestAnimationFrame(() => {
          if (previousFocus.isConnected) {
            previousFocus.focus({ preventScroll: true });
          }
        });
      }
    };
  }, [isOpen, dialogRef]);
}
