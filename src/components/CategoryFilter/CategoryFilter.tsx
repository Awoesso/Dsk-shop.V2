import React from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  X,
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
import { CATEGORIES } from '../../data/products';
import { formatPrice } from '../../utils/currency';

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

  // Dynamic count map strictly across products
  const categoryCounts = React.useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      const catKey = p.category || 'Other';
      map[catKey] = (map[catKey] || 0) + 1;
    });
    return map;
  }, [products]);

  // Extract unique brands
  const brands = React.useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return Array.from(set);
  }, [products]);

  const handleCategorySelect = (categoryId: string) => {
    setFilters({ category: categoryId });
    if (onFilterChange) onFilterChange();
  };

  const handlePriceChange = (maxPrice: number) => {
    setFilters({ maxPrice });
    if (onFilterChange) onFilterChange();
  };

  const handleInStockToggle = (inStockOnly: boolean) => {
    setFilters({ inStockOnly });
    if (onFilterChange) onFilterChange();
  };

  const handleBrandSelect = (brand: string) => {
    setFilters({ selectedBrand: filterState.selectedBrand === brand ? undefined : brand });
    if (onFilterChange) onFilterChange();
  };

  const activeFilterCount = [
    filterState.category !== 'all',
    filterState.searchQuery !== '',
    filterState.maxPrice < 400,
    filterState.inStockOnly,
    !!filterState.selectedBrand,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  // Preset quick price tiers in USD to convert cleanly to FCFA
  const priceTiers = [
    { label: 'Tous', value: 400 },
    { label: '< 65 000 FCFA', value: 100 },
    { label: '< 130 000 FCFA', value: 200 },
    { label: '< 200 000 FCFA', value: 300 },
  ];

  return (
    <div className={`space-y-6 font-secondary ${isMobileModal ? 'p-1' : ''}`}>
      {/* Header with Active Badge and Reset */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100/80">
            <SlidersHorizontal size={14} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900 font-primary">
              Filtres
            </h3>
            {activeFilterCount > 0 && (
              <span className="text-[10px] text-emerald-700 font-semibold">
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

      {/* Active filters chips (if any) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {filterState.category !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              {CATEGORIES.find((c) => c.id === filterState.category)?.name}
              <button
                onClick={() => handleCategorySelect('all')}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X size={11} />
              </button>
            </span>
          )}
          {filterState.selectedBrand && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              {filterState.selectedBrand}
              <button
                onClick={() => handleBrandSelect(filterState.selectedBrand!)}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X size={11} />
              </button>
            </span>
          )}
          {filterState.inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              En stock
              <button
                onClick={() => handleInStockToggle(false)}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X size={11} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Categories Section with Sleek Modern Pills */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 font-primary">
          Catégories
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = filterState.category === cat.id;
            const count = categoryCounts[cat.id] ?? cat.itemCount;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(isSelected ? 'all' : cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-150 font-primary cursor-pointer ${
                  isSelected
                    ? 'bg-[#166534] text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-emerald-50/70 hover:text-[#166534]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isSelected ? 'text-white' : 'text-slate-400'}>
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

      {/* Price Range in Franc CFA */}
      <div className="pt-4 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-2 font-primary">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Budget Max
          </label>
          <span className="text-xs font-bold text-emerald-700 font-mono">
            {formatPrice(filterState.maxPrice)}
          </span>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={30}
          max={400}
          step={10}
          value={filterState.maxPrice}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />

        <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1 font-mono">
          <span>{formatPrice(30)}</span>
          <span>{formatPrice(400)}</span>
        </div>

        {/* Quick Tiers */}
        <div className="grid grid-cols-2 gap-1.5 mt-2.5">
          {priceTiers.map((tier) => (
            <button
              key={tier.label}
              onClick={() => handlePriceChange(tier.value)}
              className={`px-2 py-1 text-[10px] font-semibold rounded-lg border transition-colors cursor-pointer text-center ${
                filterState.maxPrice === tier.value
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Selection */}
      <div className="pt-4 border-t border-slate-200/80">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 font-primary">
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
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Custom Toggle Switch */}
      <div className="pt-4 border-t border-slate-200/80">
        <label
          onClick={() => handleInStockToggle(!filterState.inStockOnly)}
          className="flex items-center justify-between cursor-pointer group select-none"
        >
          <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors font-primary">
            Articles en stock uniquement
          </span>
          <div
            className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
              filterState.inStockOnly ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                filterState.inStockOnly ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default CategoryFilter;
