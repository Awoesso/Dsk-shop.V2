import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { CATEGORIES } from '../../constants/categories';
import { SEO } from '../../components/SEO/SEO';

export const ShopPage: React.FC = () => {
  const { filteredProducts, filterState, setFilters } = useShop();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const isAllCategories = filterState.category === 'all';
  const currentCategory = CATEGORIES.find((c) => c.id === filterState.category) || CATEGORIES[0];
  const isSearch = Boolean(filterState.searchQuery);

  const pageTitle = isSearch
    ? `Recherche: "${filterState.searchQuery}" (${filteredProducts.length} articles) | DSK-Shop`
    : isAllCategories
    ? 'Catalogue Produits - Tech, Audio & Lifestyle | DSK-Shop'
    : `${currentCategory.name} - Boutique en ligne Lomé | DSK-Shop`;

  const pageDescription = isSearch
    ? `Découvrez les ${filteredProducts.length} articles correspondant à votre recherche "${filterState.searchQuery}" sur DSK-Shop Lomé.`
    : isAllCategories
    ? 'Explorez notre gamme complète : smartphones, audio pro, ordinateurs et accessoires du quotidien à Lomé avec livraison sans frais.'
    : `${currentCategory.description} Commandez en ligne chez DSK-Shop avec livraison rapide à Lomé.`;

  const breadcrumbs = [
    { name: 'Accueil', url: '/' },
    { name: 'Catalogue', url: '/shop' },
    ...(!isAllCategories
      ? [{ name: currentCategory.name, url: `/shop?category=${currentCategory.id}` }]
      : []),
  ];

  return (
    <div className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-4 sm:py-8 2xl:py-12 pb-16 2xl:pb-24 font-secondary">
      {/* Dynamic SEO Meta Tags */}
      <SEO
        title={pageTitle}
        description={pageDescription}
        image={currentCategory.image}
        type="website"
        category={currentCategory}
        breadcrumbs={breadcrumbs}
        keywords={[
          currentCategory.name,
          'DSK-Shop',
          'Lomé',
          'Togo',
          'e-commerce Lomé',
          'achat en ligne Togo',
          'accessoires informatiques',
        ]}
      />

      {/* Category Header Banner */}
      <div className="mb-4 sm:mb-6 2xl:mb-8 p-4 sm:p-6 md:p-7 bg-white rounded-xl sm:rounded-2xl border border-[#DDE8DE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#647064] opacity-70 mb-1 font-primary">
            <span>Catalogue DSK-Shop</span>
            <span>/</span>
            <span className="text-[#166534] font-bold">{currentCategory.name}</span>
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-[#172017] font-primary">
            {filterState.searchQuery
              ? `Résultats pour « ${filterState.searchQuery} »`
              : currentCategory.name}
          </h1>
          <p className="text-[11px] md:text-xs font-normal text-[#647064] opacity-70 mt-1 max-w-2xl font-secondary leading-relaxed">
            {currentCategory.description}
          </p>
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="lg:hidden w-full sm:w-auto">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#166534] hover:bg-[#16A34A] text-white font-semibold text-xs font-primary rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <SlidersHorizontal size={14} />
            <span>Filtres ({filteredProducts.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 2xl:col-span-3 bg-white p-4 sm:p-5 rounded-xl border border-[#DDE8DE] shadow-xs sticky top-24 transition-all">
          <CategoryFilter />
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-8 xl:col-span-9 2xl:col-span-9">
          <ProductGrid
            products={filteredProducts}
            showToolbar={true}
          />
        </main>
      </div>

      {/* Mobile Filters Slide-in Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-12">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 font-primary">Filtrer & Trier</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <CategoryFilter isMobileModal={true} />
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm font-primary rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Afficher les {filteredProducts.length} résultats
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
