import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, Heart, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { TemplateProps } from '../../../types/storefront';
import { StoreHeader } from '../shared/StoreHeader';
import { StoreFooter } from '../shared/StoreFooter';
import { StoreProductGrid } from '../shared/StoreProductGrid';
import { StoreCategoryMenu } from '../shared/StoreCategoryMenu';
import { StoreEmptyState } from '../shared/StoreEmptyState';
import { StoreTrustBadges } from '../shared/StoreTrustBadges';

export const FashionTemplate: React.FC<TemplateProps> = ({
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

  // Filtered and sorted products
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

  const featuredLookbook = useMemo(() => {
    return products.filter((p) => p.isFeatured || p.isNew).slice(0, 3);
  }, [products]);

  return (
    <div className="fashion-storefront flex flex-col min-h-screen">
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
        {/* Editorial Fashion Hero */}
        {theme.sections.showHeroBanner && (
          <section className="relative my-6 sm:my-8 overflow-hidden rounded-[var(--store-card-radius)] border border-[var(--store-border)] bg-[var(--store-surface)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[360px] sm:min-h-[460px]">
              {/* Text Side */}
              <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-[var(--store-bg)] border border-[var(--store-border)]" style={{ color: 'var(--store-primary)' }}>
                  <Sparkles size={13} />
                  <span>Nouvelle Collection • {new Date().getFullYear()}</span>
                </div>

                <h1
                  className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.15]"
                  style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
                >
                  {identity.name}
                </h1>

                <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: 'var(--store-muted)' }}>
                  {identity.tagline || identity.description || "L'art de l'élégance moderne. Découvrez une garde-robe raffinée façonnée avec des matières d'exception pour un style intemporel."}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white rounded-[var(--store-btn-radius)] shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ backgroundColor: 'var(--store-primary)' }}
                  >
                    <span>Explorer le Lookbook</span>
                    <ArrowRight size={15} />
                  </button>
                  {identity.phone && (
                    <a
                      href={`https://wa.me/${identity.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold rounded-[var(--store-btn-radius)] border border-[var(--store-border)] hover:bg-[var(--store-bg)] transition-colors text-[var(--store-text)]"
                    >
                      <span>Conseiller Style VIP</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Visual Showcase Side */}
              <div className="lg:col-span-5 h-full min-h-[260px] sm:min-h-[380px] relative p-4 sm:p-6 flex items-center justify-center">
                {identity.bannerUrl ? (
                  <img
                    src={identity.bannerUrl}
                    alt={identity.name}
                    className="w-full h-full max-h-[420px] object-cover rounded-[calc(var(--store-card-radius)-4px)] shadow-md"
                  />
                ) : (
                  <div
                    className="w-full h-full max-h-[380px] rounded-[calc(var(--store-card-radius)-4px)] flex flex-col items-center justify-center p-8 text-center border border-[var(--store-border)] shadow-inner"
                    style={{ backgroundColor: 'var(--store-bg)' }}
                  >
                    <span className="text-5xl font-black mb-2 opacity-80" style={{ color: 'var(--store-primary)', fontFamily: 'var(--store-heading-font)' }}>
                      {identity.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="fashion-quote text-lg text-slate-700">« Le style est une manière de dire qui vous êtes sans avoir à parler. »</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Brand Story Statement */}
        {theme.sections.showBrandStory && (
          <section className="my-8 py-6 px-4 text-center border-y border-[var(--store-border)] max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--store-muted)' }}>
              Philosophie de la Maison
            </span>
            <blockquote
              className="fashion-quote text-lg sm:text-2xl mt-2 leading-relaxed"
              style={{ color: 'var(--store-text)' }}
            >
              « {identity.description || "Chaque pièce est sélectionnée pour célébrer l'individualité, le confort et la distinction à chaque occasion."} »
            </blockquote>
          </section>
        )}

        {/* Category Pills */}
        {theme.sections.showCategoryPills && categories.length > 0 && (
          <div className="my-6">
            <StoreCategoryMenu
              categories={categories}
              selectedCategory={currentCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        )}

        {/* Catalog Header with Sort & Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-6 pb-4 border-b border-[var(--store-border)]">
          <div>
            <h2
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
            >
              {currentCategory === 'all' ? 'Toutes les Créations' : currentCategory}
            </h2>
            <p className="text-xs" style={{ color: 'var(--store-muted)' }}>
              {displayProducts.length} modèle{displayProducts.length > 1 ? 's' : ''} disponible{displayProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[var(--store-muted)]">
              <SlidersHorizontal size={14} />
              <span>Trier par :</span>
            </div>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as any)}
              className="text-xs font-semibold py-1.5 px-3 rounded-[var(--store-btn-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] text-[var(--store-text)] focus:outline-none"
            >
              <option value="featured">Sélection Vedette</option>
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
            title="Aucune création trouvée"
            description="Aucun article ne correspond à cette recherche. Réinitialisez la catégorie pour découvrir nos autres collections."
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
