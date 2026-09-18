import React from 'react';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
  count?: number;
  layout?: 'grid' | 'list';
  columnsClassName?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 6,
  layout = 'grid',
  columnsClassName,
}) => {
  return (
    <div
      className={
        layout === 'grid'
          ? columnsClassName || 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5 2xl:gap-6'
          : 'flex flex-col gap-3.5 sm:gap-4 2xl:gap-6'
      }
      aria-busy="true"
      aria-label="Chargement des produits"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} layout={layout} />
      ))}
    </div>
  );
};
