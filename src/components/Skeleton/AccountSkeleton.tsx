import React from 'react';
import { SkeletonLine, SkeletonCard, SkeletonButton } from './SkeletonLoader';

export const AccountSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 font-secondary animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6 sm:mb-8 space-y-2">
        <SkeletonLine height="h-7 sm:h-9" width="w-48" />
        <SkeletonLine height="h-4" width="w-80" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Sidebar Nav Skeleton */}
        <div className="w-full lg:w-64 bg-white rounded-2xl border border-bamboo-divider p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-bamboo-tint" />
            <div className="space-y-1.5 flex-1">
              <SkeletonLine height="h-4" width="w-28" />
              <SkeletonLine height="h-3" width="w-20" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-10 rounded-xl bg-bamboo-tint/70" />
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
          </div>
        </div>

        {/* Content Area Skeleton */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-bamboo-divider p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <SkeletonLine height="h-6" width="w-64" />
            <SkeletonLine height="h-4" width="w-96" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkeletonCard className="space-y-2">
              <SkeletonLine height="h-4" width="w-32" />
              <SkeletonLine height="h-5" width="w-48" />
              <SkeletonLine height="h-3.5" width="w-40" />
            </SkeletonCard>
            <SkeletonCard className="space-y-2">
              <SkeletonLine height="h-4" width="w-32" />
              <SkeletonLine height="h-5" width="w-48" />
              <SkeletonLine height="h-3.5" width="w-40" />
            </SkeletonCard>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <SkeletonLine height="h-4" width="w-56" />
            <SkeletonButton width="w-40" height="h-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSkeleton;
