import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { CATEGORIES } from '../../data/products';
import { SEO } from '../../components/SEO/SEO';

export const ShopPage: React.FC = () => {
  const { filteredProducts, filterState, setFilters } = useShop();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const currentCategory = CATEGORIES.find((c) => c.id === filterState.category) || CATEGORIES[0];
  const isSearch = Boolean(filterState.searchQuery);

  const pageTitle = isSearch
    ? `Recherche: "${filterState.searchQuery}" (${filteredProducts.length} articles) | DSK-Shop`
    : currentCategory.id === 'all'
    ? 'Catalogue Produits - Tech, Audio & Lifestyle | DSK-Shop'
    : `${currentCategory.name} - Boutique en ligne Lomé | DSK-Shop`;

  const pageDescription = isSearch
    ? `Découvrez les ${filteredProducts.length} articles correspondant à votre recherche "${filterState.searchQuery}" sur DSK-Shop Lomé.`
    : currentCategory.id === 'all'
    ? 'Explorez notre gamme complète : smartphones, audio pro, ordinateurs et accessoires du quotidien à Lomé avec livraison sans frais.'
    : `${currentCategory.description} Commandez en ligne chez DSK-Shop avec livraison rapide à Lomé.`;

  const breadcrumbs = [
    { name: 'Accueil', url: '/' },
    { name: 'Catalogue', url: '/shop' },
    ...(currentCategory.id !== 'all'
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
      <div className="mb-5 sm:mb-8 2xl:mb-10 p-4 sm:p-6 md:p-8 2xl:p-10 bg-[#FAFCFA] rounded-2xl sm:rounded-3xl border border-[#DDE8DE] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 2xl:gap-6">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2 2xl:gap-2.5 text-[10px] sm:text-xs 2xl:text-sm font-bold uppercase tracking-wider text-[#647064] mb-1 font-primary">
            <span>Catalogue DSK-Shop</span>
            <span>/</span>
            <span className="text-[#166534] font-extrabold">{currentCategory.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-4xl font-black text-[#172017] tracking-tight font-primary">
            {filterState.searchQuery
              ? `Résultats pour « ${filterState.searchQuery} »`
              : currentCategory.name}
          </h1>
          <p className="text-xs sm:text-sm 2xl:text-base text-[#647064] mt-0.5 sm:mt-1 max-w-2xl 2xl:max-w-3xl font-secondary">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 2xl:gap-10 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 2xl:col-span-3 bg-[#FAFCFA]/90 backdrop-blur-xs p-5 sm:p-6 2xl:p-8 rounded-2xl sm:rounded-3xl border border-[#DDE8DE] shadow-xs sticky top-24 transition-all">
          <CategoryFilter />
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-8 xl:col-span-9 2xl:col-span-9">
          <ProductGrid
            products={filteredProducts}
            showToolbar={true}
            columnsClassName="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5 2xl:gap-6"
          />
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
                <h3 className="font-bold text-sm text-[#172017] font-primary">Filtrer & Trier</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-[#647064] hover:text-[#172017] rounded-lg cursor-pointer"
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
                  className="w-full py-3 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-xs font-primary rounded-xl shadow-xs transition-colors cursor-pointer"
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
