import React from 'react';
import { SkeletonBox, SkeletonLine, SkeletonButton, SkeletonCard } from './SkeletonLoader';

export const OrderSuccessSkeleton: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-24 font-secondary animate-pulse">
      <SkeletonCard className="p-6 sm:p-10 space-y-8">
        <div className="text-center space-y-3 pb-6 border-b border-[#DDE8DE]">
          <div className="w-16 h-16 rounded-2xl bg-[#DCFCE7] mx-auto" />
          <div className="w-28 h-4 rounded bg-[#DCFCE7] mx-auto" />
          <SkeletonLine height="h-8" width="w-64 mx-auto" />
          <SkeletonLine height="h-4" width="w-80 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkeletonBox className="h-24 rounded-2xl" />
          <SkeletonBox className="h-24 rounded-2xl" />
        </div>

        <div className="space-y-3 pt-4 border-t border-[#DDE8DE]">
          <SkeletonLine height="h-4" width="w-32" />
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3">
                  <SkeletonBox className="w-10 h-10 rounded-lg" />
                  <SkeletonLine height="h-3.5" width="w-40" />
                </div>
                <SkeletonLine height="h-3.5" width="w-16" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <SkeletonButton width="w-48" height="h-12" />
        </div>
      </SkeletonCard>
    </div>
  );
};

export default OrderSuccessSkeleton;
