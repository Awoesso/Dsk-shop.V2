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
  columnsClassName?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  subtitle,
  showToolbar = true,
  isLoading: propIsLoading,
  skeletonCount = 6,
  columnsClassName,
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 mb-4 sm:mb-6 2xl:mb-8 border-b border-[#DDE8DE]">
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 2xl:gap-3">
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm 2xl:text-base font-semibold text-[#166534] animate-pulse font-primary">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                Chargement des produits...
              </span>
            ) : (
              <span className="text-xs sm:text-sm 2xl:text-base font-medium text-[#647064] font-secondary">
                <strong className="text-[#172017] font-bold font-primary">{products.length}</strong> {products.length === 1 ? 'produit affiché' : 'produits affichés'}
              </span>
            )}

            {/* Active filter badges */}
            {filterState.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 2xl:px-3 2xl:py-1.5 text-[11px] sm:text-xs 2xl:text-sm font-semibold bg-[#DCFCE7] text-[#166534] border border-[#DCFCE7] rounded-lg font-primary">
                « {filterState.searchQuery} »
                <button onClick={removeSearchChip} className="hover:text-rose-600 cursor-pointer">
                  <X size={11} className="2xl:w-3.5 2xl:h-3.5" />
                </button>
              </span>
            )}

            {filterState.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 2xl:px-3 2xl:py-1.5 text-[11px] sm:text-xs 2xl:text-sm font-semibold bg-[#DCFCE7] text-[#166534] border border-[#DCFCE7] rounded-lg capitalize font-primary">
                {filterState.category.replace('-', ' ')}
                <button onClick={removeCategoryChip} className="hover:text-rose-600 cursor-pointer">
                  <X size={11} className="2xl:w-3.5 2xl:h-3.5" />
                </button>
              </span>
            )}

            {filterState.selectedBrand && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 2xl:px-3 2xl:py-1.5 text-[11px] sm:text-xs 2xl:text-sm font-semibold bg-[#DCFCE7] text-[#166534] border border-[#DCFCE7] rounded-lg font-primary">
                Marque: {filterState.selectedBrand}
                <button onClick={removeBrandChip} className="hover:text-rose-600 cursor-pointer">
                  <X size={11} className="2xl:w-3.5 2xl:h-3.5" />
                </button>
              </span>
            )}

            {filterState.minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 2xl:px-3 2xl:py-1.5 text-[11px] sm:text-xs 2xl:text-sm font-semibold bg-amber-50 text-amber-900 border border-amber-200/60 rounded-lg font-primary">
                ★ {filterState.minRating}+
                <button onClick={removeRatingChip} className="hover:text-rose-600 cursor-pointer">
                  <X size={11} className="2xl:w-3.5 2xl:h-3.5" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 2xl:gap-4">
            {/* Refresh button to simulate/refresh fetch */}
            <button
              onClick={refreshCatalog}
              disabled={isLoading}
              className={`p-1.5 sm:p-2 2xl:p-2.5 rounded-xl border border-[#DDE8DE] bg-[#FAFCFA] text-[#647064] hover:text-[#166534] hover:border-[#16A34A] shadow-2xs transition-all cursor-pointer ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              title="Actualiser le catalogue"
            >
              <RotateCw size={13} className={`2xl:w-4 2xl:h-4 ${isLoading ? 'animate-spin text-[#16A34A]' : ''}`} />
            </button>

            {/* Sort Selector */}
            <div className="relative flex items-center">
              <span className="text-xs 2xl:text-sm font-semibold text-[#647064] mr-1.5 hidden sm:inline font-secondary">Trier :</span>
              <div className="relative">
                <select
                  id="sort-select"
                  value={filterState.sortBy}
                  onChange={handleSortChange}
                  className="pl-2.5 pr-7 py-1.5 sm:py-2 2xl:py-2.5 text-[11px] sm:text-xs 2xl:text-sm font-bold text-[#172017] bg-[#FAFCFA] border border-[#DDE8DE] rounded-xl hover:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] cursor-pointer appearance-none shadow-2xs font-primary"
                >
                  <option value="featured">En vedette</option>
                  <option value="price-low">Prix : Croissant</option>
                  <option value="price-high">Prix : Décroissant</option>
                  <option value="rating">Mieux notés</option>
                  <option value="newest">Nouveautés</option>
                </select>
                <ArrowUpDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#647064] 2xl:w-3.5 2xl:h-3.5"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-[#F0FDF4] p-1 2xl:p-1.5 rounded-xl border border-[#DDE8DE]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 2xl:p-2 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#FAFCFA] text-[#166534] shadow-2xs font-bold' : 'text-[#647064] hover:text-[#172017]'
                }`}
                title="Affichage grille"
              >
                <LayoutGrid size={15} className="2xl:w-4 2xl:h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 2xl:p-2 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#FAFCFA] text-[#166534] shadow-2xs font-bold' : 'text-[#647064] hover:text-[#172017]'
                }`}
                title="Affichage liste"
              >
                <List size={15} className="2xl:w-4 2xl:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List / Grid or Skeleton Screen */}
      {isLoading ? (
        <ProductGridSkeleton count={skeletonCount} layout={viewMode} columnsClassName={columnsClassName} />
      ) : products.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? columnsClassName || 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5 2xl:gap-6'
              : 'flex flex-col gap-3.5 sm:gap-4 2xl:gap-6'
          }
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} layout={viewMode} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#FAFCFA] rounded-3xl border border-[#DDE8DE] p-12 2xl:p-16 text-center max-w-lg 2xl:max-w-xl mx-auto my-8 2xl:my-12 shadow-xs">
          <div className="w-16 h-16 2xl:w-20 2xl:h-20 mx-auto mb-4 bg-[#F0FDF4] text-[#166534] rounded-2xl flex items-center justify-center border border-[#DDE8DE]">
            <SearchX size={32} className="text-[#166534] 2xl:w-10 2xl:h-10" />
          </div>
          <h3 className="text-lg 2xl:text-xl font-bold text-[#172017] font-primary">Aucun produit ne correspond à vos critères</h3>
          <p className="text-sm 2xl:text-base text-[#647064] mt-2 font-secondary">
            Essayez de modifier votre recherche, d'augmenter votre budget ou de réinitialiser certains filtres.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 2xl:mt-6 px-5 py-2.5 2xl:px-7 2xl:py-3.5 bg-[#166534] hover:bg-[#16A34A] text-white text-xs 2xl:text-sm font-bold font-primary rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Réinitialiser tous les filtres
          </button>
        </div>
      )}
    </div>
  );
};
