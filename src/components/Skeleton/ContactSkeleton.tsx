import React from 'react';
import { SkeletonBox, SkeletonLine, SkeletonButton, SkeletonCard } from './SkeletonLoader';

export const ContactSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 font-secondary animate-pulse">
      {/* Header Banner Skeleton */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-36 h-6 rounded-full bg-[#DCFCE7]/80 mx-auto" />
        <SkeletonLine height="h-9 sm:h-12" width="w-80 mx-auto" />
        <SkeletonLine height="h-4" width="w-full max-w-md mx-auto" />
      </section>

      {/* 3 Quick Info Cards Skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7]/60 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <SkeletonLine height="h-5" width="w-32" />
              <SkeletonLine height="h-3.5" width="w-48" />
              <SkeletonLine height="h-3" width="w-28" />
            </div>
          </SkeletonCard>
        ))}
      </section>

      {/* Form + FAQ Grid Skeleton */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form Skeleton */}
        <div className="lg:col-span-7 bg-[#FAFCFA] p-6 sm:p-8 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-5">
          <SkeletonLine height="h-6" width="w-48" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <SkeletonLine height="h-3" width="w-20" />
                <SkeletonBox className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <SkeletonLine height="h-3" width="w-24" />
                <SkeletonBox className="h-10 w-full rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <SkeletonLine height="h-3" width="w-20" />
              <SkeletonBox className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <SkeletonLine height="h-3" width="w-24" />
              <SkeletonBox className="h-28 w-full rounded-xl" />
            </div>
            <SkeletonButton width="w-44" height="h-12" />
          </div>
        </div>

        {/* FAQ Accordion Skeleton */}
        <div className="lg:col-span-5 space-y-4">
          <SkeletonLine height="h-6" width="w-40" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-2xl border border-[#DDE8DE] bg-[#FAFCFA] space-y-2">
              <div className="flex items-center justify-between">
                <SkeletonLine height="h-4" width="w-4/5" />
                <div className="w-5 h-5 rounded-full bg-[#E3EFE4]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactSkeleton;
