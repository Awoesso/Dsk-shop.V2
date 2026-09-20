import React from 'react';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
  count?: number;
  layout?: 'grid' | 'list';
  columnsClassName?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 10,
  layout = 'grid',
  columnsClassName,
}) => {
  return (
    <div
      className={
        layout === 'grid'
          ? columnsClassName || 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xl:gap-4'
          : 'flex flex-col gap-3 sm:gap-4'
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
