import React from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Laptop,
  Shirt,
  BookOpen,
  Home,
  Sparkles,
  Activity,
  Watch,
  Cpu,
  Package,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../constants/categories';
import { getCategoryProductCounts, filterActiveCategories } from '../../utils/categoryUtils';

interface CategoryFilterProps {
  onFilterChange?: () => void;
  isMobileModal?: boolean;
}

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'Electronics':
      return <Laptop size={14} className="shrink-0" />;
    case 'Fashion':
      return <Shirt size={14} className="shrink-0" />;
    case 'Books':
      return <BookOpen size={14} className="shrink-0" />;
    case 'Home':
      return <Home size={14} className="shrink-0" />;
    case 'Beauty':
      return <Sparkles size={14} className="shrink-0" />;
    case 'Sports':
      return <Activity size={14} className="shrink-0" />;
    case 'Accessories':
      return <Watch size={14} className="shrink-0" />;
    case 'Digital':
      return <Cpu size={14} className="shrink-0" />;
    case 'Other':
    default:
      return <Package size={14} className="shrink-0" />;
  }
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ isMobileModal = false, onFilterChange }) => {
  const { filterState, setFilters, resetFilters, products } = useShop();

  // Dynamic count map strictly across real products
  const categoryCounts = React.useMemo(() => {
    return getCategoryProductCounts(products);
  }, [products]);

  // Filter out any category with 0 or null products
  const activeCategories = React.useMemo(() => {
    return filterActiveCategories(CATEGORIES, categoryCounts);
  }, [categoryCounts]);

  // Extract unique brands from real products
  const brands = React.useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [products]);

  const handleCategorySelect = (categoryId: string) => {
    setFilters({ category: categoryId });
    if (onFilterChange) onFilterChange();
  };

  const handleBrandSelect = (brand: string) => {
    setFilters({ selectedBrand: filterState.selectedBrand === brand ? undefined : brand });
    if (onFilterChange) onFilterChange();
  };

  const activeFilterCount = [
    filterState.category !== 'all',
    filterState.searchQuery !== '',
    filterState.inStockOnly,
    !!filterState.selectedBrand,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className={`space-y-6 font-secondary ${isMobileModal ? 'p-1' : ''}`}>
      {/* Header with Active Badge and Reset */}
      <div className="flex items-center justify-between pb-3.5 border-b border-surface-variant">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center border border-primary-fixed">
            <SlidersHorizontal size={14} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-on-surface font-primary">
              Filtres
            </h3>
            {activeFilterCount > 0 && (
              <span className="text-[10px] text-primary font-semibold">
                {activeFilterCount} {activeFilterCount === 1 ? 'actif' : 'actifs'}
              </span>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              resetFilters();
              if (onFilterChange) onFilterChange();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors font-primary cursor-pointer"
          >
            <RotateCcw size={11} /> Réinitialiser
          </button>
        )}
      </div>

      {/* Categories Section - Only displays categories with active products (> 0) */}
      {activeCategories.length > 0 && (
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2.5 font-primary">
            Catégories
          </label>
          <div className="space-y-1">
            {activeCategories.map((cat) => {
              const isSelected = filterState.category === cat.id;
              const count = categoryCounts[cat.id] ?? 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(isSelected ? 'all' : cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-150 font-primary cursor-pointer min-h-[40px] ${
                    isSelected
                      ? 'bg-primary text-white font-semibold shadow-xs'
                      : 'text-on-surface hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isSelected ? 'text-white' : 'text-on-surface-variant'}>
                      {getCategoryIcon(cat.id)}
                    </span>
                    <span>{cat.name}</span>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-surface-container-low text-on-surface-variant font-semibold'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Brand Selection */}
      {brands.length > 0 && (
        <div className="pt-4 border-t border-surface-variant">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2.5 font-primary">
            Marques
          </label>
          <div className="flex flex-wrap gap-1.5 font-primary">
            {brands.map((brand) => {
              const isSelected = filterState.selectedBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => handleBrandSelect(brand)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer min-h-[34px] ${
                    isSelected
                      ? 'border-primary bg-primary text-white font-semibold shadow-xs'
                      : 'border-surface-variant bg-white text-on-surface hover:border-primary/40 hover:bg-surface-container-low'
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
