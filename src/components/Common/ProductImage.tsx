import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon } from 'lucide-react';

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  containerClassName?: string;
  aspectRatioClassName?: string;
  showSkeleton?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatioClassName = '',
  showSkeleton = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset loading status if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    // Check if the image is already cached in browser memory
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 ${aspectRatioClassName} ${containerClassName}`}
    >
      {/* Skeleton Shimmer Overlay while image is loading */}
      {showSkeleton && !isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-200/70 animate-shimmer">
          <div className="w-8 h-8 rounded-lg bg-slate-300/60 flex items-center justify-center text-slate-400/80 animate-pulse">
            <ImageIcon size={18} />
          </div>
        </div>
      )}

      {/* Error state fallback */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-3 text-center">
          <ImageIcon size={24} className="mb-1 text-slate-300" />
          <span className="text-[11px] font-medium text-slate-400">Image unavailable</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
};
