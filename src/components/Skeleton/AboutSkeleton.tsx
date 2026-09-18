import React from 'react';
import { SkeletonBox, SkeletonLine, SkeletonButton, SkeletonCard } from './SkeletonLoader';

export const AboutSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 font-secondary animate-pulse">
      {/* Editorial Hero Banner Skeleton */}
      <section className="rounded-2xl sm:rounded-3xl border border-[#DDE8DE] bg-[#FAFCFA] p-6 sm:p-12 lg:p-16">
        <div className="max-w-3xl space-y-4 sm:space-y-6">
          <div className="w-32 h-6 rounded-full bg-[#DCFCE7]/80" />
          <div className="space-y-3">
            <SkeletonLine height="h-9 sm:h-12" width="w-4/5" />
            <SkeletonLine height="h-9 sm:h-12" width="w-3/5" />
          </div>
          <div className="space-y-2 pt-2">
            <SkeletonLine height="h-4" width="w-full" />
            <SkeletonLine height="h-4" width="w-4/5" />
          </div>
          <div className="pt-2">
            <SkeletonButton width="w-48" height="h-12" />
          </div>
        </div>
      </section>

      {/* Commitments 4 Cards Skeleton */}
      <section className="space-y-6">
        <div className="space-y-2">
          <SkeletonLine height="h-7" width="w-56" />
          <SkeletonLine height="h-3.5" width="w-72" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7]/60" />
              <div className="space-y-2">
                <SkeletonLine height="h-5" width="w-40" />
                <SkeletonLine height="h-3.5" width="w-full" />
                <SkeletonLine height="h-3.5" width="w-5/6" />
              </div>
              <div className="w-20 h-4 bg-[#E3EFE4] rounded" />
            </SkeletonCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutSkeleton;
