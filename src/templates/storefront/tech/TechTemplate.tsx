import React, { useState, useMemo } from 'react';
import { Cpu, Zap, Shield, Flame, SlidersHorizontal, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TemplateProps } from '../../../types/storefront';
import { StoreHeader } from '../shared/StoreHeader';
import { StoreFooter } from '../shared/StoreFooter';
import { StoreProductGrid } from '../shared/StoreProductGrid';
import { StoreCategoryMenu } from '../shared/StoreCategoryMenu';
import { StoreEmptyState } from '../shared/StoreEmptyState';
import { StoreTrustBadges } from '../shared/StoreTrustBadges';

export const TechTemplate: React.FC<TemplateProps> = ({
  storefront,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onSelectProduct,
  onSearch,
  onSelectCategory,
  selectedCategory = 'all',
  searchQuery = '',
}) => {
  const { identity, theme, categories, products } = storefront;
  const [internalCategory, setInternalCategory] = useState<string>(selectedCategory);
  const [internalSearch, setInternalSearch] = useState<string>(searchQuery);
  const [activeSort, setActiveSort] = useState<'featured' | 'price-low' | 'price-high'>('featured');

  const currentCategory = onSelectCategory ? selectedCategory : internalCategory;
  const currentSearch = onSearch ? searchQuery : internalSearch;

  const handleCategorySelect = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  const handleSearchChange = (query: string) => {
    if (onSearch) {
      onSearch(query);
    } else {
      setInternalSearch(query);
    }
  };

  const displayProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (currentCategory !== 'all') {
          const matchCat = (p.category || '').toLowerCase() === currentCategory.toLowerCase();
          if (!matchCat) return false;
        }
        if (currentSearch.trim()) {
          const q = currentSearch.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (activeSort === 'price-low') return a.price - b.price;
        if (activeSort === 'price-high') return b.price - a.price;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, currentCategory, currentSearch, activeSort]);

  const flashDeals = useMemo(() => {
    return products.filter((p) => (p.discountPercent || 0) > 0 || p.isFeatured).slice(0, 4);
  }, [products]);

  return (
    <div className="tech-storefront flex flex-col min-h-screen">
      {/* Header */}
      <StoreHeader
        identity={identity}
        categories={categories}
        selectedCategory={currentCategory}
        onSelectCategory={handleCategorySelect}
        searchQuery={currentSearch}
        onSearch={handleSearchChange}
      />

      <main className="flex-1 mx-auto w-full max-w-[var(--store-content-max-w)] px-4 sm:px-6 lg:px-8">
        {/* Flash Announcement Bar */}
        {theme.sections.showPromoBanner && (
          <div className="mt-4 p-3 rounded-[var(--store-card-radius)] bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shadow-sm border border-slate-800">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 tech-badge-pulse" />
              <span className="text-amber-400 font-extrabold uppercase tracking-wide">Vente Flash Électronique :</span>
              <span>Stock limité sur smartphones, audio & accessoires testés et garantis.</span>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-[var(--store-btn-radius)] bg-white/10 border border-white/20">
              ⚡ Livraison en 24H à Lomé
            </div>
          </div>
        )}

        {/* Tech Hero Showcase */}
        {theme.sections.showHeroBanner && (
          <section className="relative my-6 overflow-hidden rounded-[var(--store-card-radius)] border border-[var(--store-border)] bg-gradient-to-br from-[var(--store-surface)] to-[var(--store-bg)] shadow-sm">
            <div className="p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-xl space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--store-btn-radius)] bg-[var(--store-bg)] border border-[var(--store-border)] text-xs font-bold" style={{ color: 'var(--store-primary)' }}>
                  <Cpu size={14} />
                  <span>Matériel Original & Certifié Conforme</span>
                </div>

                <h1
                  className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase"
                  style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
                >
                  {identity.name}
                </h1>

                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--store-muted)' }}>
                  {identity.tagline || identity.description || "Trouvez les meilleurs équipements high-tech, téléphones, casques, laptops et accessoires informatiques au meilleur prix du marché togolais."}
                </p>

                {/* Tech Highlights */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold text-[var(--store-text)]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Garantie vérifiée</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Paiement à la livraison</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Produits 100% testés</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Support SAV réactif</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white rounded-[var(--store-btn-radius)] shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ backgroundColor: 'var(--store-primary)' }}
                  >
                    <Zap size={16} />
                    <span>Découvrir tout le catalogue</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Graphic Spec Visual */}
              <div className="w-full lg:w-96 shrink-0">
                {identity.bannerUrl ? (
                  <img
                    src={identity.bannerUrl}
                    alt={identity.name}
                    className="w-full h-64 sm:h-80 object-cover rounded-[calc(var(--store-card-radius)-4px)] shadow-md border border-[var(--store-border)]"
                  />
                ) : (
                  <div className="p-6 rounded-[calc(var(--store-card-radius)-4px)] border border-[var(--store-border)] bg-[var(--store-surface)] space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-[var(--store-border)] pb-3">
                      <div className="font-mono text-xs font-bold text-[var(--store-muted)]">SYSTEM_CHECK</div>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                        OPÉRATIONNEL
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-dashed border-[var(--store-border)]">
                        <span className="text-[var(--store-muted)]">Disponibilité :</span>
                        <span className="font-bold text-[var(--store-text)]">En stock immédiat</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-dashed border-[var(--store-border)]">
                        <span className="text-[var(--store-muted)]">Devise :</span>
                        <span className="font-bold text-[var(--store-text)]">{identity.currency || 'FCFA'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-dashed border-[var(--store-border)]">
                        <span className="text-[var(--store-muted)]">Zone de livraison :</span>
                        <span className="font-bold text-[var(--store-text)]">Lomé, Togo</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 text-white text-center">
                      <span className="text-xs font-mono uppercase tracking-wider block text-slate-400">Paiement Mobile</span>
                      <span className="text-sm font-bold text-amber-400">Flooz & T-Money acceptés</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Categories Bar */}
        {theme.sections.showCategoryPills && categories.length > 0 && (
          <div className="my-6">
            <StoreCategoryMenu
              categories={categories}
              selectedCategory={currentCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        )}

        {/* Catalog Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-6 pb-4 border-b border-[var(--store-border)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[var(--store-btn-radius)] bg-[var(--store-bg)] border border-[var(--store-border)]" style={{ color: 'var(--store-primary)' }}>
              <Cpu size={18} />
            </div>
            <div>
              <h2
                className="text-lg sm:text-xl font-bold uppercase tracking-tight"
                style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
              >
                {currentCategory === 'all' ? 'Catalogue Équipements' : currentCategory}
              </h2>
              <span className="text-xs" style={{ color: 'var(--store-muted)' }}>
                {displayProducts.length} référence{displayProducts.length > 1 ? 's' : ''} en rayon
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--store-muted)]">Trier :</span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as any)}
              className="text-xs font-semibold py-1.5 px-3 rounded-[var(--store-btn-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] text-[var(--store-text)] focus:outline-none"
            >
              <option value="featured">Sélection Technologique</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {displayProducts.length > 0 ? (
          <StoreProductGrid
            products={displayProducts}
            cardStyle={theme.layout.productCardStyle}
            layout={theme.layout.productLayout}
            columns={theme.layout.productGridColumns}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isInWishlist={isInWishlist}
            onSelectProduct={onSelectProduct}
            currency={identity.currency || 'FCFA'}
          />
        ) : (
          <StoreEmptyState
            title="Aucun équipement disponible"
            description="Aucun matériel ne correspond à vos filtres. Réinitialisez la recherche pour consulter les autres rubriques."
            onAction={() => {
              handleCategorySelect('all');
              handleSearchChange('');
            }}
          />
        )}

        {/* Trust Badges */}
        {theme.sections.showTrustBadges && <StoreTrustBadges />}
      </main>

      {/* Footer */}
      <StoreFooter identity={identity} />
    </div>
  );
};
