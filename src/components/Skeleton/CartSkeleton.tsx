import React from 'react';
import { SkeletonBox, SkeletonLine, SkeletonButton, SkeletonCard } from './SkeletonLoader';

export const CartSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 font-secondary animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-bamboo-divider">
        <div className="space-y-2">
          <SkeletonLine height="h-8" width="w-48" />
          <SkeletonLine height="h-3.5" width="w-64" />
        </div>
        <div className="w-24 h-4 bg-bamboo-skeleton-line rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-bamboo-card p-4 sm:p-5 rounded-2xl border border-bamboo-divider shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <SkeletonBox className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="w-16 h-3 bg-bamboo-skeleton-line rounded" />
                  <SkeletonLine height="h-5" width="w-44 sm:w-56" />
                  <div className="w-24 h-3.5 bg-bamboo-tint rounded" />
                  <div className="w-20 h-4 bg-bamboo-skeleton-line rounded sm:hidden" />
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-bamboo-divider">
                <SkeletonBox className="w-24 h-9 rounded-xl" />
                <div className="hidden sm:block text-right space-y-1">
                  <SkeletonLine height="h-5" width="w-20" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-bamboo-skeleton-line" />
              </div>
            </div>
          ))}

          {/* Continue Shopping button */}
          <div className="pt-4 flex justify-between items-center">
            <SkeletonButton width="w-40" height="h-10" className="bg-bamboo-skeleton-box" />
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4">
          <SkeletonCard className="space-y-5 sticky top-24">
            <SkeletonLine height="h-6" width="w-36" />

            {/* Shipping indicator progress */}
            <div className="p-3 bg-bamboo-subtle rounded-xl border border-bamboo-divider space-y-2">
              <SkeletonLine height="h-3" width="w-48" />
              <div className="w-full h-2 rounded-full bg-bamboo-skeleton-line" />
            </div>

            {/* Summary lines */}
            <div className="space-y-3 pt-2 border-t border-bamboo-divider">
              <div className="flex justify-between">
                <SkeletonLine height="h-3.5" width="w-20" />
                <SkeletonLine height="h-3.5" width="w-16" />
              </div>
              <div className="flex justify-between">
                <SkeletonLine height="h-3.5" width="w-24" />
                <SkeletonLine height="h-3.5" width="w-14" />
              </div>
              <div className="flex justify-between pt-2 border-t border-bamboo-divider">
                <SkeletonLine height="h-6" width="w-24" />
                <SkeletonLine height="h-6" width="w-28" />
              </div>
            </div>

            {/* Checkout CTA */}
            <SkeletonButton width="w-full" height="h-12" />

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-bamboo-divider">
              <div className="h-6 bg-bamboo-skeleton-line rounded" />
              <div className="h-6 bg-bamboo-skeleton-line rounded" />
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
