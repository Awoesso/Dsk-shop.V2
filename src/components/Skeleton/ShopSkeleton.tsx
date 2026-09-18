import React from 'react';
import { SkeletonBox, SkeletonLine, SkeletonCard, SkeletonButton } from './SkeletonLoader';
import { ProductGridSkeleton } from './ProductGridSkeleton';

export const ShopSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-16 font-secondary animate-pulse">
      {/* Category Header Banner Skeleton */}
      <div className="mb-5 sm:mb-8 p-4 sm:p-6 md:p-8 bg-[#FAFCFA] rounded-2xl sm:rounded-3xl border border-[#DDE8DE] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 w-full max-w-xl">
          <div className="flex items-center gap-2">
            <SkeletonLine height="h-3" width="w-20" />
            <span className="text-[#DDE8DE]">/</span>
            <SkeletonLine height="h-3" width="w-28" />
          </div>
          <SkeletonLine height="h-8" width="w-72" />
          <SkeletonLine height="h-3.5" width="w-full max-w-md" />
        </div>
        <div className="lg:hidden w-full sm:w-auto">
          <SkeletonButton width="w-full sm:w-44" height="h-10" />
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Desktop Sidebar Filter Skeleton */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 bg-[#FAFCFA]/90 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#DDE8DE] shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE8DE]">
            <SkeletonLine height="h-5" width="w-24" />
            <SkeletonLine height="h-3" width="w-16" />
          </div>

          {/* Category choices */}
          <div className="space-y-2">
            <SkeletonLine height="h-3.5" width="w-28" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F0FDF4]/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#E3EFE4]" />
                  <SkeletonLine height="h-3.5" width="w-28" />
                </div>
                <div className="w-6 h-4 rounded bg-[#E3EFE4]" />
              </div>
            ))}
          </div>

          {/* Price Range */}
          <div className="space-y-3 pt-3 border-t border-[#DDE8DE]">
            <SkeletonLine height="h-3.5" width="w-24" />
            <div className="h-2 rounded-full bg-[#E3EFE4] w-full" />
            <div className="flex justify-between">
              <SkeletonLine height="h-3" width="w-14" />
              <SkeletonLine height="h-3" width="w-14" />
            </div>
          </div>

          {/* Rating filter */}
          <div className="space-y-2 pt-3 border-t border-[#DDE8DE]">
            <SkeletonLine height="h-3.5" width="w-24" />
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-7 w-12 rounded-lg bg-[#E3EFE4]" />
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area Skeleton */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Grid Toolbar Skeleton */}
          <div className="p-3 sm:p-4 bg-[#FAFCFA] rounded-2xl border border-[#DDE8DE] flex flex-col sm:flex-row items-center justify-between gap-3">
            <SkeletonLine height="h-4" width="w-40" />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SkeletonBox className="h-9 w-36 rounded-xl" />
              <SkeletonBox className="h-9 w-20 rounded-xl" />
            </div>
          </div>

          <ProductGridSkeleton count={8} layout="grid" />
        </main>
      </div>
    </div>
  );
};

export default ShopSkeleton;
