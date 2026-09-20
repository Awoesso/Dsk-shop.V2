import React, { useState } from 'react';
import { LayoutGrid, List, ArrowUpDown, X, PackageX, RotateCw } from 'lucide-react';
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
  skeletonCount = 10,
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
      {/* Optional Heading with Reduced Typography Scale */}
      {(title || subtitle) && (
        <div className="mb-3 sm:mb-5">
          {title && (
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#172017] font-primary">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-[11px] md:text-xs font-normal text-[#647064] opacity-70 mt-0.5 sm:mt-1 font-secondary">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Toolbar: Counter, Active Chips, View Mode & Sort Dropdown */}
      {showToolbar && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 mb-4 sm:mb-6 border-b border-[#DDE8DE]">
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#166534] animate-pulse font-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
                Chargement des produits...
              </span>
            ) : (
              <span className="text-xs font-medium text-[#647064] font-secondary">
                <strong className="text-[#172017] font-bold font-primary">{products.length}</strong>{' '}
                {products.length === 1 ? 'produit affiché' : 'produits affichés'}
              </span>
            )}

            {/* Active filter badges */}
            {filterState.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#DCFCE7] rounded-full font-primary">
                « {filterState.searchQuery} »
                <button onClick={removeSearchChip} className="hover:text-rose-600 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {filterState.category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#DCFCE7] rounded-full capitalize font-primary">
                {filterState.category.replace('-', ' ')}
                <button onClick={removeCategoryChip} className="hover:text-rose-600 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {filterState.selectedBrand && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#DCFCE7] rounded-full font-primary">
                Marque: {filterState.selectedBrand}
                <button onClick={removeBrandChip} className="hover:text-rose-600 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {filterState.minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/60 rounded-full font-primary">
                ★ {filterState.minRating}+
                <button onClick={removeRatingChip} className="hover:text-rose-600 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5">
            {/* Refresh button */}
            <button
              onClick={refreshCatalog}
              disabled={isLoading}
              className={`p-1.5 sm:p-2 rounded-xl border border-[#DDE8DE] bg-white text-[#647064] hover:text-[#166534] hover:border-[#166534]/50 shadow-2xs transition-all cursor-pointer ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              title="Actualiser le catalogue"
            >
              <RotateCw size={13} className={`${isLoading ? 'animate-spin text-[#166534]' : ''}`} />
            </button>

            {/* Sort Selector */}
            <div className="relative flex items-center">
              <span className="text-xs font-semibold text-[#647064] mr-1.5 hidden sm:inline font-secondary">Trier :</span>
              <div className="relative">
                <select
                  id="sort-select"
                  value={filterState.sortBy}
                  onChange={handleSortChange}
                  className="pl-2.5 pr-7 py-1.5 text-xs font-semibold text-[#172017] bg-white border border-[#DDE8DE] rounded-xl hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#166534] cursor-pointer appearance-none shadow-2xs font-primary"
                >
                  <option value="featured">En vedette</option>
                  <option value="price-low">Prix : Croissant</option>
                  <option value="price-high">Prix : Décroissant</option>
                  <option value="rating">Mieux notés</option>
                  <option value="newest">Nouveautés</option>
                </select>
                <ArrowUpDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-[#F3FAF4] p-1 rounded-xl border border-[#DDE8DE]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-[#166534] shadow-2xs font-bold' : 'text-[#647064] hover:text-[#172017]'
                }`}
                title="Affichage grille"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-[#166534] shadow-2xs font-bold' : 'text-[#647064] hover:text-[#172017]'
                }`}
                title="Affichage liste"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List / Grid (Strictly 2 cols on mobile, 3-4 on tablet, 5 on desktop) */}
      {isLoading ? (
        <ProductGridSkeleton count={skeletonCount} layout={viewMode} columnsClassName={columnsClassName} />
      ) : products.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? columnsClassName || 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xl:gap-4'
              : 'flex flex-col gap-3 sm:gap-4'
          }
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} layout={viewMode} />
          ))}
        </div>
      ) : (
        /* Clean & Minimal Empty State */
        <div className="py-12 px-4 text-center font-secondary">
          <div className="w-12 h-12 mx-auto mb-3 bg-[#F0FDF4] text-[#166534] rounded-xl flex items-center justify-center border border-[#DCFCE7]">
            <PackageX size={24} className="text-[#166534]" />
          </div>
          <h3 className="text-base font-semibold text-[#172017] font-primary">
            Aucun produit trouvé
          </h3>
          <p className="text-xs md:text-sm text-[#647064] opacity-70 mt-1 mb-4 font-secondary">
            Aucun article ne correspond à votre recherche.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-[#166534] hover:bg-[#16A34A] text-white text-xs md:text-sm font-semibold font-primary rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
