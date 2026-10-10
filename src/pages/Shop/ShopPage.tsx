import React, { useState } from 'react';
import { SlidersHorizontal, X, Truck, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { CATEGORIES } from '../../constants/categories';
import { SEO } from '../../components/SEO/SEO';

export const ShopPage: React.FC = () => {
  const { filteredProducts, filterState } = useShop();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const isAllCategories = filterState.category === 'all';
  const currentCategory = CATEGORIES.find((c) => c.id === filterState.category) || CATEGORIES[0];
  const isSearch = Boolean(filterState.searchQuery);

  const pageTitle = isSearch
    ? `Recherche: "${filterState.searchQuery}" (${filteredProducts.length} articles) | DSK-Shop`
    : isAllCategories
    ? 'Catalogue Produits - Tech, Audio & Lifestyle | DSK-Shop'
    : `${currentCategory.name} | Boutique en ligne Lomé | DSK-Shop`;

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
    <div className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-secondary">
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
      <div className="mb-6 p-5 sm:p-7 bg-white rounded-2xl border border-gray-100 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-gray-400 mb-1 font-primary">
            <span>Catalogue</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{currentCategory.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 font-primary">
            {filterState.searchQuery
              ? `Résultats pour « ${filterState.searchQuery} »`
              : currentCategory.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl font-secondary leading-relaxed">
            {isAllCategories
              ? 'Bienvenue sur le catalogue complet. Filtrez facilement par catégorie, prix ou disponibilité pour trouver vos articles à Lomé.'
              : `${currentCategory.description} Tous nos articles sont vérifiés en atelier et éligibles à la livraison rapide sous 24h.`}
          </p>
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="lg:hidden w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-bamboo-forest hover:opacity-90 text-white font-medium text-xs font-primary rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-xs min-h-[42px]"
          >
            <SlidersHorizontal size={14} />
            <span>Filtres ({filteredProducts.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs sticky top-24">
          <CategoryFilter />
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-8">
          <ProductGrid
            products={filteredProducts}
            showToolbar={true}
            columnsClassName="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5"
          />

          {/* Guide d'achat & Conseils DSK Shop */}
          <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100/60 text-emerald-700">
                <Sparkles size={15} />
              </span>
              <h2 className="text-xs sm:text-sm font-semibold text-gray-900 font-primary">
                Engagements & Garanties DSK Shop à Lomé
              </h2>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Pour vous garantir un achat serein, chaque modèle est sélectionné avec soin. Tous les prix affichés sont nets en FCFA, sans frais cachés.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 font-primary">
                  <Truck size={14} className="text-bamboo-forest" />
                  <span>Livraison express</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Livre chez vous ou au bureau sous 24h ouvrées à Lomé.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 font-primary">
                  <CreditCard size={14} className="text-bamboo-forest" />
                  <span>Paiement souple</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Réglez par T-Money, Flooz ou espèces à la livraison.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 font-primary">
                  <ShieldCheck size={14} className="text-bamboo-forest" />
                  <span>Garantie vérifiée</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Articles contrôlés avant expédition avec retour simplifié.
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
            className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-250">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-xs text-gray-900 font-primary">Filtrer & Trier</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg cursor-pointer transition-colors"
                  aria-label="Fermer les filtres"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <CategoryFilter isMobileModal={true} />
              </div>

              <div className="p-4 border-t border-gray-100 bg-white pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-bamboo-forest hover:opacity-90 text-white font-medium text-xs font-primary rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
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