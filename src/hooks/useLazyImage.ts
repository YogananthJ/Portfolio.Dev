import { useEffect, useRef, useState } from 'react';

interface UseLazyImageOptions {
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
}

/**
 * Observes a container element with IntersectionObserver to defer image loading
 * until it enters (or approaches) the viewport, and tracks image load/error
 * state for smooth placeholder transitions without layout shift.
 */
export function useLazyImage<T extends HTMLElement = HTMLDivElement>({
  rootMargin = '50px 0px',
  threshold = 0.01,
  enabled = true,
}: UseLazyImageOptions = {}) {
  const containerRef = useRef<T | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled || shouldLoad) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setShouldLoad(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, shouldLoad, rootMargin, threshold]);

  // Immediately resolve cached images once mounted
  useEffect(() => {
    if (!shouldLoad || isLoaded || hasError) return;
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [shouldLoad, isLoaded, hasError]);

  const handleLoad = () => {
    setHasError(false);
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return {
    containerRef,
    imgRef,
    shouldLoad,
    isLoaded,
    hasError,
    handleLoad,
    handleError,
  };
}
