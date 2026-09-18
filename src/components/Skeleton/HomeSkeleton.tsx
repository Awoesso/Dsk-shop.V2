import React from 'react';
import { SkeletonBox, SkeletonLine, SkeletonButton, SkeletonCard } from './SkeletonLoader';
import { ProductGridSkeleton } from './ProductGridSkeleton';

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 sm:space-y-14 lg:space-y-18 pb-16 font-secondary animate-pulse">
      {/* Split-Screen Hero Skeleton */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div className="bg-[#FAFCFA] rounded-2xl sm:rounded-3xl border border-[#DDE8DE] p-6 sm:p-10 lg:p-14 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            {/* Pill tag */}
            <div className="w-36 h-6 rounded-full bg-[#DCFCE7]/80 animate-shimmer" />
            {/* Big Headline */}
            <div className="space-y-3">
              <SkeletonLine height="h-8 sm:h-11" width="w-4/5" />
              <SkeletonLine height="h-8 sm:h-11" width="w-3/5" />
            </div>
            {/* Subtitle */}
            <div className="space-y-2 max-w-xl pt-2">
              <SkeletonLine height="h-4" width="w-full" />
              <SkeletonLine height="h-4" width="w-5/6" />
            </div>
            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <SkeletonButton width="w-36 sm:w-44" height="h-12" />
              <SkeletonButton width="w-36 sm:w-40" height="h-12" className="bg-[#E8F3E9]" />
            </div>
            {/* Guarantees mini row */}
            <div className="flex items-center gap-6 pt-6 border-t border-[#DDE8DE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E3EFE4]" />
                <div className="w-24 h-3 bg-[#E3EFE4] rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E3EFE4]" />
                <div className="w-24 h-3 bg-[#E3EFE4] rounded" />
              </div>
            </div>
          </div>
          {/* Hero Right Visual */}
          <div className="lg:col-span-5">
            <SkeletonBox className="w-full aspect-4/3 sm:aspect-16/10 lg:aspect-square rounded-2xl sm:rounded-3xl border border-[#DDE8DE]" />
          </div>
        </div>
      </section>

      {/* Curated Collections Skeleton */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-5">
          <div className="space-y-2">
            <SkeletonLine height="h-7" width="w-48" />
            <SkeletonLine height="h-3.5" width="w-72" />
          </div>
          <div className="w-20 h-4 bg-[#E3EFE4] rounded" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBox
              key={i}
              className="h-40 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl border border-[#DDE8DE]"
            />
          ))}
        </div>
      </section>

      {/* Featured Products Skeleton */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-5">
          <div className="space-y-2">
            <SkeletonLine height="h-7" width="w-56" />
            <SkeletonLine height="h-3.5" width="w-80" />
          </div>
          <div className="w-24 h-4 bg-[#E3EFE4] rounded" />
        </div>

        <ProductGridSkeleton count={8} layout="grid" />
      </section>
    </div>
  );
};

export default HomeSkeleton;
