import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  fallbackClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackText = 'IMAGE_UNAVAILABLE',
  className = '',
  fallbackClassName = '',
  decoding = 'async',
  ...props
}) => {
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className={`bg-[#0E1118] border border-white/10 flex flex-col items-center justify-center p-3 text-zinc-500 font-mono text-[10px] select-none ${className} ${fallbackClassName}`}
        role="img"
        aria-label={alt || fallbackText}
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
      alt={alt}
      decoding={decoding}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};
