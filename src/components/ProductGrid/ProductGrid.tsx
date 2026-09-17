import React, { useState } from 'react';
import { LayoutGrid, List, ArrowUpDown, X, SearchX, RotateCw } from 'lucide-react';
import { Product, SortOption } from '../../types';
import { ProductCard } from '../ProductCard/ProductCard';
import { ProductGridSkeleton } from '../Skeleton/ProductGridSkeleton';
import { useShop } from '../../context/ShopContext';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showToolbar?: boolean;
  isLoading?: boolean;
  skeletonCount?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  subtitle,
  showToolbar = true,
  isLoading: propIsLoading,
  skeletonCount = 6,
}) => {
  const { filterState, setFilters, resetFilters, isLoading: contextIsLoading, refreshCatalog } = useShop();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isLoading = propIsLoading !== undefined ? propIsLoading : contextIsLoading;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ sortBy: e.target.value as SortOption });
  };

  const removeSearchChip = () => setFilters({ searchQuery: '' });
  const removeCategoryChip = () => setFilters({ category: 'all' });
  const removeBrandChip = () => setFilters({ selectedBrand: undefined });
  const removeRatingChip = () => setFilters({ minRating: 0 });

  return (
    <div className="w-full font-secondary">
      {/* Optional Heading */}
      {(title || subtitle) && (
        <div className="mb-4 sm:mb-6">
          {title && <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#172017] tracking-tight font-primary">{title}</h2>}
          {subtitle && <p className="text-xs sm:text-sm text-[#647064] mt-0.5 sm:mt-1 font-secondary">{subtitle}</p>}
        </div>
      )}

      {/* Toolbar: Counter, Active Chips, View Mode & Sort Dropdown */}
      {showToolbar && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-[#DDE8DE]">
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#166534] animate-pulse font-primary">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                Fetching products...
              </span>
            ) : (
              <span className="text-xs sm:text-sm font-medium text-[#647064] font-secondary">
                Showing <strong className="text-[#172017] font-bold font-primary">{products.length}</strong> products
              </span>
            )}

            {/* Active filter badges */}
            {filterState.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#DCFCE7] rounded-lg font-primary">
                "{filterState.searchQuery}"
                <button onClick={removeSearchChip} className="hover:text-rose-600">
                  <X size={11} />
                </button>
              </span>
            )}

            {filterState.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#DCFCE7] rounded-lg capitalize font-primary">
                {filterState.category.replace('-', ' ')}
                <button onClick={removeCategoryChip} className="hover:text-rose-600">
                  <X size={11} />
                </button>
              </span>
            )}

            {filterState.selectedBrand && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#DCFCE7] rounded-lg font-primary">
                Brand: {filterState.selectedBrand}
                <button onClick={removeBrandChip} className="hover:text-rose-600">
                  <X size={11} />
                </button>
              </span>
            )}

            {filterState.minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/60 rounded-lg font-primary">
                ★ {filterState.minRating}+
                <button onClick={removeRatingChip} className="hover:text-rose-600">
                  <X size={11} />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            {/* Refresh button to simulate/refresh fetch */}
            <button
              onClick={refreshCatalog}
              disabled={isLoading}
              className={`p-1.5 sm:p-2 rounded-xl border border-[#DDE8DE] bg-[#FAFCFA] text-[#647064] hover:text-[#166534] hover:border-[#16A34A] shadow-2xs transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              title="Refresh catalog"
            >
              <RotateCw size={13} className={isLoading ? 'animate-spin text-[#16A34A]' : ''} />
            </button>

            {/* Sort Selector */}
            <div className="relative flex items-center">
              <span className="text-xs font-semibold text-[#647064] mr-1.5 hidden sm:inline font-secondary">Sort:</span>
              <div className="relative">
                <select
                  id="sort-select"
                  value={filterState.sortBy}
                  onChange={handleSortChange}
                  className="pl-2.5 pr-7 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[#172017] bg-[#FAFCFA] border border-[#DDE8DE] rounded-xl hover:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] cursor-pointer appearance-none shadow-2xs font-primary"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Releases</option>
                </select>
                <ArrowUpDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#647064]"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-[#F0FDF4] p-1 rounded-xl border border-[#DDE8DE]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#FAFCFA] text-[#166534] shadow-2xs font-bold' : 'text-[#647064] hover:text-[#172017]'
                }`}
                title="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#FAFCFA] text-[#166534] shadow-2xs font-bold' : 'text-[#647064] hover:text-[#172017]'
                }`}
                title="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List / Grid or Skeleton Screen */}
      {isLoading ? (
        <ProductGridSkeleton count={skeletonCount} layout={viewMode} />
      ) : products.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5'
              : 'flex flex-col gap-3 sm:gap-4'
          }
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} layout={viewMode} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#FAFCFA] rounded-3xl border border-[#DDE8DE] p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#F0FDF4] text-[#166534] rounded-2xl flex items-center justify-center border border-[#DDE8DE]">
            <SearchX size={32} className="text-[#166534]" />
          </div>
          <h3 className="text-lg font-bold text-[#172017] font-primary">No products matched your criteria</h3>
          <p className="text-sm text-[#647064] mt-2 font-secondary">
            Try adjusting your search query, increasing your price range limit, or removing some filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 px-5 py-2.5 bg-[#166534] hover:bg-[#16A34A] text-white text-xs font-bold font-primary rounded-xl shadow-xs transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
