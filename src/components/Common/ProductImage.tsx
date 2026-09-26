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
      className={`relative overflow-hidden bg-[#F3FAF4] ${aspectRatioClassName} ${containerClassName}`}
    >
      {/* Skeleton Shimmer Overlay while image is loading */}
      {showSkeleton && !isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F3FAF4] animate-shimmer">
          <div className="w-8 h-8 rounded-xl bg-[#DCFCE7]/70 flex items-center justify-center text-[#166534] shadow-2xs">
            <Package size={16} />
          </div>
        </div>
      )}

      {/* Elegant Fallback if image fails or bucket not yet populated */}
      {hasError || !src ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#F3FAF4] to-[#E8F5EB] p-3 text-center select-none">
          <div className="w-10 h-10 rounded-2xl bg-white/90 border border-[#DDE8DE] text-[#166534] flex items-center justify-center mb-1.5 shadow-2xs">
            <Package size={20} />
          </div>
          <span className="text-[11px] font-semibold text-[#166534] font-primary line-clamp-1 max-w-[120px]">
            {alt || 'DSK-Shop'}
          </span>
          <span className="text-[10px] text-[#849385] font-secondary mt-0.5">
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
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
};
