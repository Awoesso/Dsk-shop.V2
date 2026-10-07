import React, { useState } from 'react';
import { LayoutGrid, List, ArrowUpDown, X, PackageX, RotateCw } from 'lucide-react';
import { Product, SortOption } from '../../types';
import { ProductCard } from '../ProductCard/ProductCard';
import { ProductGridSkeleton } from '../Skeleton/ProductGridSkeleton';
import { useShop } from '../../context/ShopContext';
import { StaggerItem } from '../Common/ScrollAnimation';

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

  return (
    <div className="w-full font-secondary">
      {/* Optional Heading with Reduced Typography Scale */}
      {(title || subtitle) && (
        <div className="mb-3 sm:mb-5">
          {title && (
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-bamboo-text-main font-primary">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-[11px] md:text-xs font-normal text-bamboo-text-muted opacity-70 mt-0.5 sm:mt-1 font-secondary">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Toolbar: Counter, Active Chips, View Mode & Sort Dropdown */}
      {showToolbar && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 mb-4 sm:mb-6 border-b border-surface-variant">
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary animate-pulse font-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-surface-tint animate-ping" />
                Chargement des produits...
              </span>
            ) : (
              <span className="text-xs font-medium text-on-surface-variant font-secondary">
                <strong className="text-on-surface font-bold font-primary">{products.length}</strong>{' '}
                {products.length === 1 ? 'produit affiché' : 'produits affichés'}
              </span>
            )}

            {/* Active filter badges */}
            {filterState.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold bg-primary-fixed text-on-primary-fixed border border-primary-fixed rounded-full font-primary">
                « {filterState.searchQuery} »
                <button onClick={removeSearchChip} className="hover:text-rose-600 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {filterState.category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold bg-primary-fixed text-on-primary-fixed border border-primary-fixed rounded-full capitalize font-primary">
                {filterState.category.replace('-', ' ')}
                <button onClick={removeCategoryChip} className="hover:text-rose-600 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {filterState.selectedBrand && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold bg-primary-fixed text-on-primary-fixed border border-primary-fixed rounded-full font-primary">
                Marque: {filterState.selectedBrand}
                <button onClick={removeBrandChip} className="hover:text-rose-600 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5 w-full sm:w-auto">
            {/* Refresh button */}
            <button
              onClick={refreshCatalog}
              disabled={isLoading}
              className={`p-1.5 sm:p-2 rounded-xl border border-surface-variant bg-white text-on-surface-variant hover:text-primary hover:border-primary/50 shadow-xs transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              title="Actualiser le catalogue"
            >
              <RotateCw size={13} className={`${isLoading ? 'animate-spin text-primary' : ''}`} />
            </button>

            {/* Sort Selector */}
            <div className="relative flex items-center">
              <span className="text-xs font-semibold text-on-surface-variant mr-1.5 hidden sm:inline font-secondary">Trier :</span>
              <div className="relative">
                <select
                  id="sort-select"
                  value={filterState.sortBy}
                  onChange={handleSortChange}
                  className="pl-2.5 pr-7 py-2 text-xs font-semibold text-on-surface bg-white border border-surface-variant rounded-xl hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-surface-tint/20 focus:border-primary cursor-pointer appearance-none shadow-xs font-primary min-h-[38px]"
                >
                  <option value="featured">En vedette</option>
                  <option value="newest">Nouveautés</option>
                  <option value="price-low">Prix : Croissant</option>
                  <option value="price-high">Prix : Décroissant</option>
                </select>
                <ArrowUpDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-surface-container-low p-1 rounded-xl border border-surface-variant">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Affichage grille"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-on-surface'
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
          <div className="w-12 h-12 mx-auto mb-3 bg-surface-container-low text-primary rounded-xl flex items-center justify-center border border-surface-variant">
            <PackageX size={24} className="text-primary" />
          </div>
          <h3 className="text-base font-semibold text-on-surface font-primary">
            Aucun produit trouvé
          </h3>
          <p className="text-xs md:text-sm text-on-surface-variant opacity-70 mt-1 mb-4 font-secondary">
            Aucun article ne correspond à votre recherche.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white text-xs md:text-sm font-semibold font-primary rounded-xl shadow-xs transition-colors cursor-pointer min-h-[42px]"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
