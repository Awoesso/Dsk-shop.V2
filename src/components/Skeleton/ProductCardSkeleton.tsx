import React from 'react';

interface ProductCardSkeletonProps {
  layout?: 'grid' | 'list';
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <div className="flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-200/90 overflow-hidden p-4 gap-5 shadow-xs animate-pulse">
        {/* Image Box Skeleton with Shimmer */}
        <div className="relative w-full sm:w-48 h-48 bg-slate-200 rounded-xl animate-shimmer overflow-hidden flex-shrink-0">
          <div className="absolute top-2.5 left-2.5 w-12 h-5 rounded-md bg-slate-300/70" />
          <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-300/70" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-3">
            {/* Category / Brand row */}
            <div className="flex items-center gap-2">
              <div className="w-20 h-3.5 bg-slate-200 rounded-md" />
              <div className="w-2 h-2 rounded-full bg-slate-200" />
              <div className="w-24 h-3.5 bg-slate-200 rounded-md" />
            </div>

            {/* Product Title */}
            <div className="space-y-1.5">
              <div className="w-3/4 h-5 bg-slate-200 rounded-md" />
              <div className="w-1/2 h-5 bg-slate-200 rounded-md" />
            </div>

            {/* Description lines */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-3.5 bg-slate-100 rounded-md" />
              <div className="w-4/5 h-3.5 bg-slate-100 rounded-md" />
            </div>

            {/* Rating and stock badges */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-24 h-4 bg-slate-200 rounded-md" />
              <div className="w-16 h-4 bg-slate-100 rounded-full" />
            </div>
          </div>

          {/* Bottom Price & Button */}
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
            <div className="space-y-1">
              <div className="w-20 h-6 bg-slate-200 rounded-md" />
              <div className="w-14 h-3 bg-slate-100 rounded-md" />
            </div>
            <div className="w-28 h-9 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Grid layout skeleton
  return (
    <div className="flex flex-col bg-[#FAFCFA] rounded-xl sm:rounded-2xl border border-[#DDE8DE] overflow-hidden shadow-xs animate-pulse">
      {/* Product Image Area with Shimmer */}
      <div className="relative aspect-square w-full bg-[#F0FDF4] animate-shimmer overflow-hidden">
        {/* Simulated Badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-1">
          <div className="w-10 sm:w-12 h-3.5 sm:h-4 rounded bg-[#DDE8DE]" />
        </div>
        {/* Simulated Wishlist circle */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#DDE8DE]" />
      </div>

      {/* Product Content Details */}
      <div className="flex-1 p-2 sm:p-3 md:p-3.5 flex flex-col justify-between">
        <div>
          {/* Brand & Rating row */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-12 sm:w-14 h-2.5 sm:h-3 bg-[#DDE8DE] rounded" />
            <div className="w-8 sm:w-10 h-2.5 sm:h-3 bg-[#DDE8DE] rounded" />
          </div>

          {/* Title lines */}
          <div className="space-y-1">
            <div className="w-5/6 h-3 sm:h-3.5 bg-[#DDE8DE] rounded" />
            <div className="w-3/5 h-3 sm:h-3.5 bg-[#DDE8DE] rounded" />
          </div>

          {/* Description line */}
          <div className="w-4/5 h-2 sm:h-2.5 bg-[#DDE8DE]/70 rounded mt-1.5" />

          {/* Color variant dots */}
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#DDE8DE]" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#DDE8DE]" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#DDE8DE]" />
          </div>
        </div>

        {/* Price & Cart Button */}
        <div className="mt-2.5 pt-2 border-t border-[#DDE8DE] flex items-center justify-between">
          <div className="space-y-1">
            <div className="w-12 sm:w-14 h-3.5 sm:h-4 bg-[#DDE8DE] rounded" />
            <div className="w-8 sm:w-10 h-2 sm:h-2.5 bg-[#DDE8DE] rounded" />
          </div>

          <div className="w-7 sm:w-12 h-6 sm:h-7 rounded-lg sm:rounded-xl bg-[#DDE8DE]" />
        </div>
      </div>
    </div>
  );
};
