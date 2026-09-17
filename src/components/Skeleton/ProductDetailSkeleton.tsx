import React from 'react';

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-12 h-3.5 bg-slate-200 rounded-md" />
        <div className="w-3 h-3 bg-slate-200 rounded-full" />
        <div className="w-20 h-3.5 bg-slate-200 rounded-md" />
        <div className="w-3 h-3 bg-slate-200 rounded-full" />
        <div className="w-32 h-3.5 bg-slate-200 rounded-md" />
      </div>

      {/* Main Product Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery Skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square sm:aspect-4/3 w-full bg-slate-200 rounded-3xl overflow-hidden border border-slate-200/80 animate-shimmer">
            <div className="absolute top-4 left-4 w-20 h-6 bg-slate-300/80 rounded-lg" />
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-300/80" />
              <div className="w-10 h-10 rounded-full bg-slate-300/80" />
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-2xl bg-slate-200 animate-shimmer overflow-hidden flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Right Column: Buying Controls & Info */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-20 h-3.5 bg-slate-200 rounded-md" />
              <div className="w-24 h-5 bg-slate-100 rounded-full" />
            </div>

            <div className="space-y-2 mt-2">
              <div className="w-5/6 h-7 bg-slate-200 rounded-lg" />
              <div className="w-3/5 h-7 bg-slate-200 rounded-lg" />
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="w-24 h-4 bg-slate-200 rounded-md" />
              <div className="w-16 h-3.5 bg-slate-100 rounded-md" />
            </div>
          </div>

          {/* Price Strip */}
          <div className="flex items-baseline gap-3 pt-3 border-t border-slate-100">
            <div className="w-24 h-8 bg-slate-200 rounded-lg" />
            <div className="w-16 h-5 bg-slate-100 rounded-md" />
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <div className="w-full h-3.5 bg-slate-100 rounded-md" />
            <div className="w-full h-3.5 bg-slate-100 rounded-md" />
            <div className="w-3/4 h-3.5 bg-slate-100 rounded-md" />
          </div>

          {/* Variants */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="w-28 h-3.5 bg-slate-200 rounded-md" />
            <div className="flex gap-2">
              <div className="w-20 h-8 bg-slate-100 rounded-xl" />
              <div className="w-24 h-8 bg-slate-100 rounded-xl" />
              <div className="w-20 h-8 bg-slate-100 rounded-xl" />
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-3.5 bg-slate-200 rounded-md" />
              <div className="w-24 h-8 bg-slate-100 rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-12 bg-slate-200 rounded-xl" />
              <div className="h-12 bg-slate-300 rounded-xl" />
            </div>
          </div>

          {/* Guarantees */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <div className="w-4/5 h-3.5 bg-slate-100 rounded-md" />
            <div className="w-3/4 h-3.5 bg-slate-100 rounded-md" />
            <div className="w-2/3 h-3.5 bg-slate-100 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
