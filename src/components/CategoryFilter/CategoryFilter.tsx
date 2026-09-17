import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, Sparkles, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/products';
import { formatPrice } from '../../utils/currency';

interface CategoryFilterProps {
  onFilterChange?: () => void;
  isMobileModal?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ isMobileModal = false, onFilterChange }) => {
  const { filterState, setFilters, resetFilters, products } = useShop();

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
      <div className="flex items-center justify-between pb-3.5 border-b border-[#DDE8DE]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#166534] flex items-center justify-center">
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

      {/* Active filters chips (if any) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {filterState.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#166534] border border-[#D5EDD8]">
              {CATEGORIES.find((c) => c.id === filterState.category)?.name}
              <button
                onClick={() => handleCategorySelect('all')}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X size={11} />
              </button>
            </span>
          )}
          {filterState.selectedBrand && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#166534] border border-[#D5EDD8]">
              {filterState.selectedBrand}
              <button
                onClick={() => handleBrandSelect(filterState.selectedBrand!)}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X size={11} />
              </button>
            </span>
          )}
          {filterState.inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#166534] border border-[#D5EDD8]">
              En stock
              <button
                onClick={() => handleInStockToggle(false)}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X size={11} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Categories Section */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647064] mb-2.5 font-primary">
          Catégories
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = filterState.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-150 font-primary cursor-pointer ${
                  isSelected
                    ? 'bg-[#166534] text-white font-semibold shadow-xs'
                    : 'text-[#172017] hover:bg-[#DCFCE7]/60 hover:text-[#166534]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                    isSelected
                      ? 'bg-[#DCFCE7] text-[#166534] font-bold'
                      : 'bg-[#EAF7ED] text-[#166534] font-semibold'
                  }`}
                >
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range in Franc CFA */}
      <div className="pt-4 border-t border-[#DDE8DE]">
        <div className="flex items-center justify-between mb-2 font-primary">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#647064]">
            Budget Max
          </label>
          <span className="text-xs font-bold text-[#166534] font-mono">
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
          className="w-full h-2 bg-[#DDE8DE] rounded-lg appearance-none cursor-pointer accent-[#166534]"
        />

        <div className="flex justify-between text-[10px] font-semibold text-[#647064] mt-1 font-mono">
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
                  ? 'bg-[#166534] text-white border-[#166534]'
                  : 'bg-white hover:bg-[#F0FDF4] text-[#647064] border-[#DDE8DE]'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Selection */}
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
                className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#166534] bg-[#166534] text-white font-semibold shadow-2xs'
                    : 'border-[#DDE8DE] bg-white text-[#172017] hover:border-[#16A34A] hover:bg-[#F0FDF4] hover:text-[#166534]'
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Custom Toggle Switch */}
      <div className="pt-4 border-t border-[#DDE8DE]">
        <label
          onClick={() => handleInStockToggle(!filterState.inStockOnly)}
          className="flex items-center justify-between cursor-pointer group select-none"
        >
          <span className="text-xs font-semibold text-[#172017] group-hover:text-[#166534] transition-colors font-primary">
            Articles en stock uniquement
          </span>
          <div
            className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
              filterState.inStockOnly ? 'bg-[#16A34A]' : 'bg-[#DDE8DE]'
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
