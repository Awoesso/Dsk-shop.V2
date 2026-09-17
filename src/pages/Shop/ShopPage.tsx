import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { CATEGORIES } from '../../data/products';

export const ShopPage: React.FC = () => {
  const { filteredProducts, filterState, setFilters } = useShop();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const currentCategory = CATEGORIES.find((c) => c.id === filterState.category) || CATEGORIES[0];

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-16 font-secondary">
      {/* Category Header Banner */}
      <div className="mb-5 sm:mb-8 p-4 sm:p-6 md:p-8 bg-[#FAFCFA] rounded-2xl sm:rounded-3xl border border-[#DDE8DE] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#647064] mb-1 font-primary">
            <span>DSK Catalog</span>
            <span>/</span>
            <span className="text-[#166534] font-extrabold">{currentCategory.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#172017] tracking-tight font-primary">
            {filterState.searchQuery
              ? `Results for "${filterState.searchQuery}"`
              : currentCategory.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#647064] mt-0.5 sm:mt-1 max-w-2xl font-secondary">
            {currentCategory.description}
          </p>
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="lg:hidden w-full sm:w-auto">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-xs font-primary rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <SlidersHorizontal size={14} />
            <span>Filtres du catalogue ({filteredProducts.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 bg-[#FAFCFA]/90 backdrop-blur-xs p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#DDE8DE] shadow-xs sticky top-24 transition-all">
          <CategoryFilter />
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-8 xl:col-span-9">
          <ProductGrid products={filteredProducts} showToolbar={true} />
        </main>
      </div>

      {/* Mobile Filters Slide-in Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-[#14532D]/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-12">
            <div className="w-screen max-w-md bg-[#FAFCFA] shadow-2xl flex flex-col">
              <div className="p-4 border-b border-[#DDE8DE] flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#172017] font-primary">Filter & Refine</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-[#647064] hover:text-[#172017] rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <CategoryFilter isMobileModal={true} />
              </div>

              <div className="p-4 border-t border-[#DDE8DE] bg-[#F0FDF4]">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-xs font-primary rounded-xl shadow-xs transition-colors"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
