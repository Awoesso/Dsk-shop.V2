import React, { useState } from 'react';
import { ShoppingBag, Search, Phone, Menu, X, Heart } from 'lucide-react';
import { StoreIdentity, StoreCategory } from '../../../types/storefront';

interface StoreHeaderProps {
  identity: StoreIdentity;
  categories: StoreCategory[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  cartItemCount?: number;
  onOpenCart?: () => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  identity,
  categories,
  selectedCategory = 'all',
  onSelectCategory,
  cartItemCount = 0,
  onOpenCart,
  searchQuery = '',
  onSearch,
  wishlistCount = 0,
  onOpenWishlist,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--store-border)] bg-[var(--store-surface)]/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto max-w-[var(--store-content-max-w)] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Logo & Store Name */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onSelectCategory && onSelectCategory('all')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              {identity.logoUrl ? (
                <img
                  src={identity.logoUrl}
                  alt={identity.name}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-[var(--store-card-radius)] object-cover border border-[var(--store-border)] shadow-xs"
                />
              ) : (
                <div
                  className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center font-bold text-lg sm:text-xl text-white shadow-xs rounded-[var(--store-card-radius)]"
                  style={{ backgroundColor: 'var(--store-primary)' }}
                >
                  {identity.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="truncate">
                <span
                  className="block font-bold text-base sm:text-lg tracking-tight leading-tight group-hover:opacity-85 transition-opacity"
                  style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
                >
                  {identity.name}
                </span>
                {identity.tagline && (
                  <span
                    className="block text-xs font-normal truncate opacity-70"
                    style={{ color: 'var(--store-muted)' }}
                  >
                    {identity.tagline}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Desktop Category Navigation */}
          {categories && categories.length > 0 && (
            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 text-sm font-medium">
              <button
                onClick={() => onSelectCategory && onSelectCategory('all')}
                className={`px-3 py-1.5 rounded-[var(--store-btn-radius)] transition-colors text-xs font-semibold cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'text-white'
                    : 'text-[var(--store-muted)] hover:text-[var(--store-text)] hover:bg-[var(--store-bg)]'
                }`}
                style={
                  selectedCategory === 'all'
                    ? { backgroundColor: 'var(--store-primary)' }
                    : undefined
                }
              >
                Tous
              </button>
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory && onSelectCategory(cat.slug || cat.name)}
                  className={`px-3 py-1.5 rounded-[var(--store-btn-radius)] transition-colors text-xs font-semibold cursor-pointer ${
                    selectedCategory === (cat.slug || cat.name)
                      ? 'text-white'
                      : 'text-[var(--store-muted)] hover:text-[var(--store-text)] hover:bg-[var(--store-bg)]'
                  }`}
                  style={
                    selectedCategory === (cat.slug || cat.name)
                      ? { backgroundColor: 'var(--store-primary)' }
                      : undefined
                  }
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          )}

          {/* Actions: Search, Contact, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input on Desktop */}
            <div className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                className="w-44 lg:w-56 pl-9 pr-3 py-1.5 text-xs rounded-[var(--store-btn-radius)] border border-[var(--store-border)] bg-[var(--store-bg)] text-[var(--store-text)] placeholder-[var(--store-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--store-primary)]"
              />
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--store-muted)]"
              />
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-[var(--store-btn-radius)] text-[var(--store-text)] hover:bg-[var(--store-bg)] transition-colors cursor-pointer"
              aria-label="Recherche"
            >
              <Search size={18} />
            </button>

            {/* Phone WhatsApp CTA */}
            {identity.phone && (
              <a
                href={`https://wa.me/${identity.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[var(--store-btn-radius)] border border-[var(--store-border)] hover:bg-[var(--store-bg)] transition-colors text-[var(--store-text)]"
              >
                <Phone size={14} className="text-emerald-600" />
                <span>Contact</span>
              </a>
            )}

            {/* Wishlist Button */}
            {onOpenWishlist && (
              <button
                onClick={onOpenWishlist}
                className="relative p-2 rounded-[var(--store-btn-radius)] text-[var(--store-text)] hover:bg-[var(--store-bg)] transition-colors cursor-pointer"
                aria-label="Favoris"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: 'var(--store-primary)' }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button */}
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-3 py-2 rounded-[var(--store-btn-radius)] text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: 'var(--store-primary)' }}
                aria-label="Panier"
              >
                <ShoppingBag size={18} />
                <span className="text-xs font-bold">{cartItemCount}</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-[var(--store-btn-radius)] text-[var(--store-text)] hover:bg-[var(--store-bg)] transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-[var(--store-border)] animate-in fade-in duration-150">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-[var(--store-btn-radius)] border border-[var(--store-border)] bg-[var(--store-bg)] text-[var(--store-text)] placeholder-[var(--store-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--store-primary)]"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--store-muted)]"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu Categories Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[var(--store-border)] space-y-2 animate-in fade-in duration-150">
            <div className="text-xs font-bold tracking-wider uppercase text-[var(--store-muted)] px-2 mb-2">
              Catégories
            </div>
            <button
              onClick={() => {
                onSelectCategory && onSelectCategory('all');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-[var(--store-btn-radius)] text-sm font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[var(--store-primary)] text-white'
                  : 'text-[var(--store-text)] hover:bg-[var(--store-bg)]'
              }`}
            >
              Tous les produits
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory && onSelectCategory(cat.slug || cat.name);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-[var(--store-btn-radius)] text-sm font-semibold transition-colors ${
                  selectedCategory === (cat.slug || cat.name)
                    ? 'bg-[var(--store-primary)] text-white'
                    : 'text-[var(--store-text)] hover:bg-[var(--store-bg)]'
                }`}
              >
                {cat.name}
              </button>
            ))}

            {identity.phone && (
              <div className="pt-3 border-t border-[var(--store-border)]">
                <a
                  href={`https://wa.me/${identity.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold rounded-[var(--store-btn-radius)] bg-emerald-600 text-white shadow-xs"
                >
                  <Phone size={14} />
                  <span>Commander via WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
