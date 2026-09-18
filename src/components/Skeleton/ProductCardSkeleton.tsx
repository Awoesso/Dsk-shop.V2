import React from 'react';

interface ProductCardSkeletonProps {
  layout?: 'grid' | 'list';
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <div className="flex flex-col sm:flex-row bg-[#FAFCFA] rounded-2xl 2xl:rounded-3xl border border-[#DDE8DE] overflow-hidden p-3 sm:p-4 2xl:p-6 gap-3.5 sm:gap-5 2xl:gap-8 shadow-xs animate-pulse">
        {/* Image Box Skeleton with Shimmer */}
        <div className="relative w-full sm:w-44 md:w-52 lg:w-56 2xl:w-64 h-48 sm:h-44 md:h-52 lg:h-56 2xl:h-64 bg-slate-200/80 rounded-xl 2xl:rounded-2xl animate-shimmer overflow-hidden flex-shrink-0">
          <div className="absolute top-2.5 left-2.5 w-12 h-5 rounded-full bg-slate-300/70" />
          <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-300/70" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-3">
            {/* Category / Brand row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-16 h-3.5 bg-slate-200 rounded-md" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <div className="w-20 h-3.5 bg-slate-200 rounded-md" />
              </div>
              <div className="w-16 h-3.5 bg-slate-200 rounded-md" />
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
              <div className="w-36 h-5 bg-slate-200/80 rounded-full" />
              <div className="w-20 h-4 bg-slate-100 rounded-full" />
            </div>
          </div>

          {/* Bottom Price & Button */}
          <div className="flex items-center justify-between mt-4 pt-3 2xl:pt-4 border-t border-[#DDE8DE]">
            <div className="space-y-1">
              <div className="w-24 h-6 bg-slate-200 rounded-md" />
              <div className="w-16 h-3 bg-slate-100 rounded-md" />
            </div>
            <div className="w-32 h-9 sm:h-10 bg-slate-200 rounded-xl 2xl:rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Grid layout skeleton
  return (
    <div className="flex flex-col h-full bg-[#FAFCFA] rounded-xl sm:rounded-2xl 2xl:rounded-3xl border border-[#DDE8DE] overflow-hidden shadow-xs animate-pulse">
      {/* Product Image Area with Shimmer */}
      <div className="relative aspect-square w-full bg-[#F0FDF4] animate-shimmer overflow-hidden">
        {/* Simulated Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1">
          <div className="w-10 sm:w-12 h-4 rounded-md bg-[#DDE8DE]" />
        </div>
        {/* Simulated Wishlist circle */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#DDE8DE]" />
      </div>

      {/* Product Content Details */}
      <div className="flex-1 p-2.5 sm:p-3 md:p-3.5 2xl:p-4.5 flex flex-col justify-between">
        <div>
          {/* Brand & Rating row */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-14 sm:w-16 h-3 bg-[#DDE8DE] rounded" />
            <div className="w-10 sm:w-12 h-3 bg-[#DDE8DE] rounded" />
          </div>

          {/* Title lines (fixed height to mirror card) */}
          <div className="h-8 sm:h-9 md:h-10 2xl:h-11 space-y-1.5">
            <div className="w-5/6 h-3.5 bg-[#DDE8DE] rounded" />
            <div className="w-3/5 h-3.5 bg-[#DDE8DE] rounded" />
          </div>

          {/* Stock tag / dots row */}
          <div className="flex items-center justify-between gap-1.5 mt-1.5 mb-2 min-h-[20px]">
            <div className="w-20 h-4 bg-[#DDE8DE]/80 rounded" />
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#DDE8DE]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#DDE8DE]" />
            </div>
          </div>
        </div>

        {/* Price & Cart Button */}
        <div className="pt-2 sm:pt-2.5 2xl:pt-3 border-t border-[#E8F0E9] mt-auto flex items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="w-16 sm:w-20 h-4 sm:h-5 bg-[#DDE8DE] rounded" />
            <div className="w-10 sm:w-12 h-2.5 bg-[#DDE8DE]/60 rounded" />
          </div>

          <div className="w-8 h-8 sm:w-16 sm:h-8 rounded-lg sm:rounded-xl bg-[#DDE8DE]" />
        </div>
      </div>
    </div>
  );
};
