import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { validateImageAlt } from '../../utils/imageAccessibility';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  fallbackClassName?: string;
  priority?: boolean;
  decorative?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackText = 'IMAGE_UNAVAILABLE',
  className = '',
  fallbackClassName = '',
  priority = false,
  decorative = false,
  loading,
  fetchPriority,
  decoding = 'async',
  ...props
}) => {
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const check = validateImageAlt(alt, decorative);
      if (!check.valid) {
        console.warn(`[a11y] ImageWithFallback: ${check.reason}`);
      }
    }
  }, [alt, decorative]);

  const resolvedAlt = decorative ? '' : (alt ?? '');
  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy');
  const resolvedFetchPriority = fetchPriority ?? (priority ? 'high' : undefined);

  if (hasError || !src) {
    return (
      <div
        className={`bg-[#0E1118] border border-white/10 flex flex-col items-center justify-center p-3 text-zinc-500 font-mono text-[10px] select-none ${className} ${fallbackClassName}`}
        role={decorative ? undefined : 'img'}
        aria-hidden={decorative ? true : undefined}
        aria-label={decorative ? undefined : resolvedAlt || fallbackText}
      >
        <ImageOff className="w-5 h-5 mb-1.5 text-zinc-600" />
        <span className="uppercase tracking-wider font-bold text-[9px] text-zinc-400">
          {fallbackText}
        </span>
        <span className="text-[8px] text-zinc-600 mt-0.5">404 // ASSET_NULL</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={resolvedAlt}
      aria-hidden={decorative ? true : undefined}
      loading={resolvedLoading}
      fetchPriority={resolvedFetchPriority}
      decoding={decoding}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};
