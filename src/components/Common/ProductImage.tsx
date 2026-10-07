import React, { useState, useEffect, useRef } from 'react';
import { Package } from 'lucide-react';

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
      className={`relative overflow-hidden bg-surface-container-low flex items-center justify-center ${aspectRatioClassName} ${containerClassName}`}
    >
      {/* Skeleton Shimmer Overlay while image is loading */}
      {showSkeleton && !isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface animate-shimmer">
          <div className="w-9 h-9 rounded-xl bg-surface-container border border-surface-variant text-bamboo-forest flex items-center justify-center shadow-2xs">
            <Package size={16} />
          </div>
        </div>
      )}

      {/* Elegant Fallback if image fails or bucket not yet populated */}
      {hasError || !src ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-low p-3 text-center select-none">
          <div className="w-10 h-10 rounded-xl bg-white border border-surface-variant text-primary flex items-center justify-center mb-1.5 shadow-2xs">
            <Package size={20} />
          </div>
          <span className="text-[11px] font-semibold text-on-surface font-primary line-clamp-1 max-w-[120px]">
            {alt || 'DSK-Shop'}
          </span>
          <span className="text-[10px] text-on-surface-variant font-secondary mt-0.5">
            Aperçu produit
          </span>
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
          className={`w-full h-full object-contain p-1.5 transition-opacity duration-300 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
};
