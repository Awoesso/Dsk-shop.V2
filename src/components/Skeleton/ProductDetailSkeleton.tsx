import React from 'react';
import { SkeletonBox, SkeletonLine, SkeletonButton, SkeletonCard } from './SkeletonLoader';

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 font-secondary animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <SkeletonLine height="h-3" width="w-14" />
        <span className="text-[#DDE8DE]">/</span>
        <SkeletonLine height="h-3" width="w-24" />
        <span className="text-[#DDE8DE]">/</span>
        <SkeletonLine height="h-3" width="w-36" />
      </div>

      {/* Main Product Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery Skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square sm:aspect-4/3 w-full bg-[#E8F3E9] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DDE8DE] animate-shimmer">
            <div className="absolute top-4 left-4 w-20 h-6 bg-[#DCFCE7] rounded-lg" />
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="w-10 h-10 rounded-full bg-[#FAFCFA]/80" />
              <div className="w-10 h-10 rounded-full bg-[#FAFCFA]/80" />
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-2xl bg-[#E8F3E9] border border-[#DDE8DE] animate-shimmer overflow-hidden flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Right Column: Buying Controls & Info */}
        <div className="lg:col-span-5 space-y-6 bg-[#FAFCFA] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#DDE8DE] shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SkeletonLine height="h-3.5" width="w-20" />
              <div className="w-24 h-5 bg-[#DCFCE7] rounded-full" />
            </div>

            <div className="space-y-2 mt-2">
              <SkeletonLine height="h-7" width="w-5/6" />
              <SkeletonLine height="h-7" width="w-3/5" />
            </div>

            <div className="flex items-center gap-3 mt-3">
              <SkeletonLine height="h-4" width="w-28" />
              <SkeletonLine height="h-3.5" width="w-16" />
            </div>
          </div>

          {/* Price Strip */}
          <div className="flex items-baseline gap-3 pt-3 border-t border-[#DDE8DE]">
            <SkeletonLine height="h-8" width="w-32" />
            <SkeletonLine height="h-5" width="w-20" />
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <SkeletonLine height="h-3.5" width="w-full" />
            <SkeletonLine height="h-3.5" width="w-full" />
            <SkeletonLine height="h-3.5" width="w-3/4" />
          </div>

          {/* Variants */}
          <div className="space-y-2 pt-2 border-t border-[#DDE8DE]">
            <SkeletonLine height="h-3.5" width="w-28" />
            <div className="flex gap-2">
              <div className="w-20 h-8 bg-[#E8F3E9] rounded-xl" />
              <div className="w-24 h-8 bg-[#E8F3E9] rounded-xl" />
              <div className="w-20 h-8 bg-[#E8F3E9] rounded-xl" />
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2 border-t border-[#DDE8DE]">
            <div className="flex items-center gap-4">
              <SkeletonLine height="h-3.5" width="w-16" />
              <div className="w-24 h-8 bg-[#E8F3E9] rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <SkeletonButton width="w-full" height="h-12" />
              <SkeletonButton width="w-full" height="h-12" className="bg-[#E8F3E9]" />
            </div>
          </div>

          {/* Guarantees */}
          <div className="space-y-2.5 pt-4 border-t border-[#DDE8DE]">
            <SkeletonLine height="h-3.5" width="w-4/5" />
            <SkeletonLine height="h-3.5" width="w-3/4" />
            <SkeletonLine height="h-3.5" width="w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
