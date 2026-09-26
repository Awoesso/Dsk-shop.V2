import React from 'react';

interface ProductCardSkeletonProps {
  layout?: 'grid' | 'list';
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <div className="bg-white border border-[#DDE8DE] rounded-xl p-3 shadow-xs flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Image Box Skeleton with Shimmer */}
        <div className="relative w-full sm:w-36 md:w-44 h-36 sm:h-36 md:h-44 bg-[#F3FAF4] rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-[#DDE8DE]/60 animate-shimmer">
          <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#DCFCE7]/70" />
        </div>

        {/* Content Skeleton with Shimmer */}
        <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="w-3/5 h-4 bg-[#DCFCE7]/70 rounded" />
              <div className="w-12 h-4 bg-[#F3FAF4] rounded shrink-0" />
            </div>

            <div className="w-4/5 h-3 bg-[#F3FAF4] rounded mt-2" />
            <div className="w-20 h-3 bg-[#F3FAF4] rounded mt-2" />
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#DDE8DE]/80 gap-3">
            <div className="w-24 h-4 bg-[#DCFCE7]/70 rounded" />
            <div className="w-20 h-7 bg-[#F3FAF4] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Grid layout skeleton
  return (
    <div className="bg-white border border-[#DDE8DE] rounded-xl p-3 shadow-xs flex flex-col justify-between">
      {/* Product Image Area with Shimmer */}
      <div>
        <div className="aspect-square rounded-lg p-2 relative flex items-center justify-center overflow-hidden mb-2 bg-[#F3FAF4] border border-[#DDE8DE]/60 animate-shimmer">
          <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#DCFCE7]/70" />
        </div>

        {/* Info Section with Shimmer */}
        <div>
          <div className="w-3/4 h-3.5 bg-[#DCFCE7]/70 rounded" />
          <div className="w-1/2 h-3 bg-[#F3FAF4] rounded mt-2" />
          <div className="w-16 h-2.5 bg-[#F3FAF4] rounded mt-2" />
        </div>
      </div>

      {/* Row: Price & Compact Action Button with Shimmer */}
      <div className="mt-2.5 pt-2 border-t border-[#DDE8DE]/80 flex items-center justify-between gap-1.5">
        <div className="w-20 h-4 bg-[#DCFCE7]/70 rounded" />
        <div className="w-8 h-8 bg-[#F3FAF4] rounded-lg shrink-0" />
      </div>
    </div>
  );
};
