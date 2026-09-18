import React from 'react';
import { SkeletonBox, SkeletonLine, SkeletonButton, SkeletonCard } from './SkeletonLoader';

export const CheckoutSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 font-secondary animate-pulse">
      {/* Checkout Breadcrumb Skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <SkeletonLine height="h-3.5" width="w-24" />
        <span className="text-[#DDE8DE]">/</span>
        <SkeletonLine height="h-3.5" width="w-28" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Steps Skeleton */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1 Skeleton */}
          <div className="bg-[#FAFCFA] p-6 sm:p-8 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-[#DDE8DE]">
              <div className="w-8 h-8 rounded-full bg-[#166534]/20 flex-shrink-0" />
              <div className="space-y-1">
                <SkeletonLine height="h-5" width="w-48" />
                <SkeletonLine height="h-3" width="w-64" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <SkeletonLine height="h-3" width="w-28" />
                <SkeletonBox className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <SkeletonLine height="h-3" width="w-24" />
                <SkeletonBox className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <SkeletonLine height="h-3" width="w-24" />
                <SkeletonBox className="h-10 w-full rounded-xl" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <SkeletonLine height="h-3" width="w-32" />
                <SkeletonBox className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>

          {/* Step 2 Skeleton */}
          <div className="bg-[#FAFCFA] p-6 sm:p-8 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-[#DDE8DE]">
              <div className="w-8 h-8 rounded-full bg-[#166534]/20 flex-shrink-0" />
              <div className="space-y-1">
                <SkeletonLine height="h-5" width="w-44" />
                <SkeletonLine height="h-3" width="w-56" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-2xl border border-[#DDE8DE] bg-[#F0FDF4]/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E3EFE4]" />
                  <SkeletonLine height="h-4" width="w-24" />
                  <SkeletonLine height="h-3" width="w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Skeleton */}
        <div className="lg:col-span-4">
          <SkeletonCard className="space-y-5 sticky top-24">
            <SkeletonLine height="h-6" width="w-40" />

            <div className="space-y-3 max-h-60 overflow-hidden py-2 border-y border-[#DDE8DE]">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <SkeletonBox className="w-12 h-12 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <SkeletonLine height="h-3.5" width="w-32" />
                    <SkeletonLine height="h-3" width="w-16" />
                  </div>
                  <SkeletonLine height="h-3.5" width="w-14" />
                </div>
              ))}
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between">
                <SkeletonLine height="h-3.5" width="w-20" />
                <SkeletonLine height="h-3.5" width="w-16" />
              </div>
              <div className="flex justify-between">
                <SkeletonLine height="h-3.5" width="w-24" />
                <SkeletonLine height="h-3.5" width="w-14" />
              </div>
              <div className="flex justify-between pt-2 border-t border-[#DDE8DE]">
                <SkeletonLine height="h-6" width="w-24" />
                <SkeletonLine height="h-6" width="w-28" />
              </div>
            </div>

            <SkeletonButton width="w-full" height="h-12" />
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton;
