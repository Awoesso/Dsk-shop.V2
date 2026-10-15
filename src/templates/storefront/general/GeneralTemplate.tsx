import React, { useState, useMemo } from 'react';
import { ShoppingBag, ArrowRight, Star, Tag, SlidersHorizontal, Send, Check } from 'lucide-react';
import { TemplateProps } from '../../../types/storefront';
import { StoreHeader } from '../shared/StoreHeader';
import { StoreFooter } from '../shared/StoreFooter';
import { StoreProductGrid } from '../shared/StoreProductGrid';
import { StoreCategoryMenu } from '../shared/StoreCategoryMenu';
import { StoreHeroBanner } from '../shared/StoreHeroBanner';
import { StoreEmptyState } from '../shared/StoreEmptyState';
import { StoreTrustBadges } from '../shared/StoreTrustBadges';

export const GeneralTemplate: React.FC<TemplateProps> = ({
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
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 4000);
    }
  };

  return (
    <div className="general-storefront flex flex-col min-h-screen">
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
        {/* Configurable Hero Banner */}
        {theme.sections.showHeroBanner && (
          <StoreHeroBanner
            identity={identity}
            onExplore={() => handleCategorySelect('all')}
            ctaText="Découvrir nos offres"
            badgeText="Boutique En Ligne Officielle"
          />
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

        {/* Brand Story or Highlight banner */}
        {theme.sections.showBrandStory && identity.description && (
          <div className="p-4 sm:p-6 my-6 rounded-[var(--store-card-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div
              className="p-3 rounded-2xl shrink-0"
              style={{ backgroundColor: 'var(--store-bg)', color: 'var(--store-primary)' }}
            >
              <Star size={24} />
            </div>
            <div>
              <h3
                className="font-bold text-sm sm:text-base"
                style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
              >
                À propos de {identity.name}
              </h3>
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--store-muted)' }}>
                {identity.description}
              </p>
            </div>
          </div>
        )}

        {/* Catalog Header with Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-6 pb-4 border-b border-[var(--store-border)]">
          <div>
            <h2
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
            >
              {currentCategory === 'all' ? 'Tous les Produits' : currentCategory}
            </h2>
            <p className="text-xs" style={{ color: 'var(--store-muted)' }}>
              {displayProducts.length} article{displayProducts.length > 1 ? 's' : ''} disponible{displayProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--store-muted)]">Trier par :</span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as any)}
              className="text-xs font-semibold py-1.5 px-3 rounded-[var(--store-btn-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] text-[var(--store-text)] focus:outline-none"
            >
              <option value="featured">Sélection recommandée</option>
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
            title="Aucun article disponible"
            description="Aucun produit ne correspond à vos critères de recherche. Essayez de réinitialiser vos filtres."
            onAction={() => {
              handleCategorySelect('all');
              handleSearchChange('');
            }}
          />
        )}

        {/* Trust Badges */}
        {theme.sections.showTrustBadges && <StoreTrustBadges />}

        {/* Newsletter Section */}
        {theme.sections.showNewsletter && (
          <section className="my-10 p-6 sm:p-10 rounded-[var(--store-card-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] text-center max-w-2xl mx-auto shadow-xs">
            <div className="space-y-2">
              <h3
                className="text-lg sm:text-xl font-bold"
                style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
              >
                Restez informé des promotions de {identity.name}
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--store-muted)' }}>
                Inscrivez-vous pour recevoir nos alertes nouveaux arrivages et bons plans exclusifs.
              </p>
            </div>

            {newsletterSubscribed ? (
              <div className="mt-4 p-3 rounded-[var(--store-btn-radius)] bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                <Check size={16} />
                <span>Merci ! Vous recevrez nos meilleures offres en priorité.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-5 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Votre adresse e-mail ou WhatsApp..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-[var(--store-btn-radius)] border border-[var(--store-border)] bg-[var(--store-bg)] text-[var(--store-text)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white rounded-[var(--store-btn-radius)] shadow-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: 'var(--store-primary)' }}
                >
                  <Send size={14} />
                  <span>S'inscrire</span>
                </button>
              </form>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <StoreFooter identity={identity} />
    </div>
  );
};
