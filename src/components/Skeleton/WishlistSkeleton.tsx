import React from 'react';
import { SkeletonLine, SkeletonButton } from './SkeletonLoader';
import { ProductGridSkeleton } from './ProductGridSkeleton';

export const WishlistSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 font-secondary animate-pulse">
      {/* Wishlist Header Banner Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-[#DDE8DE]">
        <div className="space-y-2">
          <SkeletonLine height="h-8" width="w-48 sm:w-64" />
          <SkeletonLine height="h-3.5" width="w-56" />
        </div>
        <div className="flex items-center gap-3">
          <SkeletonButton width="w-40" height="h-10" />
        </div>
      </div>

      {/* Grid of Wishlist Cards */}
      <ProductGridSkeleton count={4} layout="grid" />
    </div>
  );
};

export default WishlistSkeleton;
