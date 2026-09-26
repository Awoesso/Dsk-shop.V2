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
      <div className="flex items-center justify-between pb-3.5 border-b border-[#DDE8DE]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#166534] flex items-center justify-center border border-[#DCFCE7]">
            <SlidersHorizontal size={14} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-[#172017] font-primary">
              Filtres
            </h3>
            {activeFilterCount > 0 && (
              <span className="text-[10px] text-[#166534] font-semibold">
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
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647064] mb-2.5 font-primary">
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
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-150 font-primary cursor-pointer ${
                    isSelected
                      ? 'bg-[#166534] text-white font-semibold shadow-xs'
                      : 'text-[#172017] hover:bg-[#F3FAF4] hover:text-[#166534]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isSelected ? 'text-white' : 'text-[#647064]'}>
                      {getCategoryIcon(cat.id)}
                    </span>
                    <span>{cat.name}</span>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-slate-100 text-slate-500 font-semibold'
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
        <div className="pt-4 border-t border-[#DDE8DE]">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647064] mb-2.5 font-primary">
            Marques
          </label>
          <div className="flex flex-wrap gap-1.5 font-primary">
            {brands.map((brand) => {
              const isSelected = filterState.selectedBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => handleBrandSelect(brand)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#172017] bg-[#172017] text-white font-semibold shadow-2xs'
                      : 'border-[#DDE8DE] bg-white text-[#172017] hover:border-[#16A34A] hover:bg-[#F3FAF4]'
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
