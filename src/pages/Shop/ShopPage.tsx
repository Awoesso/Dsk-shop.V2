import React, { useState } from 'react';
import { SlidersHorizontal, X, Truck, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
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
    <div className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-4 sm:py-8 2xl:py-12 pb-24 sm:pb-16 font-secondary">
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
          <p className="text-xs sm:text-sm font-normal text-[#647064] mt-1 max-w-3xl font-secondary leading-relaxed">
            {isAllCategories
              ? 'Bienvenue sur le catalogue complet de DSK Shop. Filtrez facilement par catégorie, tranche de prix, marque ou disponibilité pour trouver exactement les articles répondant à vos besoins à Lomé.'
              : `${currentCategory.description} Tous nos articles sont vérifiés en atelier, stockés localement à Lomé et éligibles à la livraison rapide sous 24h avec paiement à la réception.`}
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
        <main className="lg:col-span-8 xl:col-span-9 2xl:col-span-9 space-y-8">
          <ProductGrid
            products={filteredProducts}
            showToolbar={true}
            columnsClassName="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 xl:gap-5"
          />

          {/* Guide d'achat & Conseils DSK Shop */}
          <div className="bg-[#F8FCF9] border border-[#DDE8DE] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#DCFCE7] text-[#166534]">
                <Sparkles size={16} />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#172017] font-primary">
                Conseils d&apos;achat & Engagements DSK Shop à Lomé
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#647064] leading-relaxed">
              Pour vous garantir un achat serein, nous sélectionnons chaque modèle auprès de fabricants reconnus. Tous les prix affichés sont en Francs CFA TTC, sans frais cachés ni taxes imprévues.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-[#DDE8DE] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#166534] font-primary">
                  <Truck size={15} />
                  <span>Livraison express</span>
                </div>
                <p className="text-[11px] text-[#647064] leading-relaxed">
                  Livré chez vous ou à votre bureau sous 24h ouvrées dans tout Lomé.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#DDE8DE] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#166534] font-primary">
                  <CreditCard size={15} />
                  <span>Paiement souple</span>
                </div>
                <p className="text-[11px] text-[#647064] leading-relaxed">
                  Réglez par T-Money, Flooz ou directement en espèces lors de la remise en main propre.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#DDE8DE] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#166534] font-primary">
                  <ShieldCheck size={15} />
                  <span>Garantie vérifiée</span>
                </div>
                <p className="text-[11px] text-[#647064] leading-relaxed">
                  Chaque article est contrôlé avant expédition avec droit de retour simplifié.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Filters Slide-in Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden font-secondary">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-12">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 font-primary">Filtrer & Trier</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                  aria-label="Fermer les filtres"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <CategoryFilter isMobileModal={true} />
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm font-primary rounded-xl shadow-xs transition-colors cursor-pointer min-h-[44px]"
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

export default ShopPage;
