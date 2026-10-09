import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';
import { ProductImage } from '../Common/ProductImage';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearchSubmitted?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Rechercher un produit, une marque...',
  className = '',
  onSearchSubmitted,
}) => {
  const { products, filterState, setFilters, navigateTo, openProduct } = useShop();
  const [query, setQuery] = useState(filterState.searchQuery || '');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(filterState.searchQuery);
  }, [filterState.searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSearchOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      inputRef.current?.focus();

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isSearchOpen]);

  const matchingSuggestions = React.useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .slice(0, 5);
  }, [products, query]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFilters({ searchQuery: query });
    setIsSearchOpen(false);
    navigateTo('shop', { search: query });
    if (onSearchSubmitted) onSearchSubmitted();
  };

  const handleSelectProduct = (product: Product) => {
    setIsSearchOpen(false);
    openProduct(product);
    if (onSearchSubmitted) onSearchSubmitted();
  };

  const handleClear = () => {
    setQuery('');
    setFilters({ searchQuery: '' });
  };

  const popularSearches = ['Téléphones', 'Chaussures', 'Vêtements', 'Accessoires'];

  return (
    <div ref={containerRef} className={className}>
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className="group flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-on-surface transition-colors duration-250 hover:bg-surface-container-low hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-bamboo-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white cursor-pointer"
        aria-label="Rechercher un produit"
        aria-haspopup="dialog"
        aria-expanded={isSearchOpen}
      >
        <Search size={18} className="transition-colors duration-250" />
      </button>

      {isSearchOpen && (
        <>
          <div
            className="fixed inset-x-0 top-0 z-40 h-[116px] bg-black/15 backdrop-blur-[2px] sm:h-[104px] lg:h-[96px]"
            aria-hidden="true"
          />
          <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-transparent p-3 sm:p-6 pt-16 sm:pt-24"
            onClick={() => setIsSearchOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="search-dialog-title"
              className="w-full max-w-3xl overflow-hidden rounded-2xl border border-surface-variant bg-white shadow-[0_20px_60px_rgba(22,40,30,0.18)] animate-[search-dialog-in_300ms_ease-out]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-2 border-b border-surface-variant px-4 py-3 sm:px-5 sm:py-3.5">
                <Search size={18} className="shrink-0 text-primary" />
                <input
                  ref={inputRef}
                  id="dsk-search-input"
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={placeholder}
                  aria-label="Recherche de produits"
                  className="h-10 w-full bg-transparent text-sm sm:text-base text-on-surface placeholder:text-[#6b746d] focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-outline hover:bg-surface-container-low hover:text-on-surface transition-colors duration-200 cursor-pointer"
                    aria-label="Effacer la recherche"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-outline hover:bg-surface-container-low hover:text-on-surface transition-colors duration-200 cursor-pointer"
                  aria-label="Fermer la recherche"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 sm:p-5">
                <p id="search-dialog-title" className="text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
                  Recherches populaires
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border border-surface-variant bg-surface-container-low px-3 py-1.5 text-xs font-medium text-on-surface transition-colors duration-200 hover:border-bamboo-accent hover:bg-bamboo-tint hover:text-primary cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                {query.trim().length >= 2 && (
                  <div className="mt-5 border-t border-surface-variant pt-4">
                    {matchingSuggestions.length > 0 ? (
                      <div className="space-y-1">
                        {matchingSuggestions.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleSelectProduct(product)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 hover:bg-surface-container-low cursor-pointer"
                          >
                            <ProductImage
                              src={product.images?.[0] || product.primaryImage || ''}
                              alt={product.name}
                              containerClassName="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-surface-variant bg-surface-container-low"
                              className="h-full w-full object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-on-surface">{product.name}</p>
                              <p className="text-xs text-on-surface-variant">{product.brand}</p>
                            </div>
                            <span className="shrink-0 text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleSubmit()}
                          className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-primary transition-colors duration-200 hover:bg-surface-container-low cursor-pointer"
                        >
                          <span>Voir tous les résultats</span>
                          <span className="flex items-center gap-1 text-[11px] text-outline">
                            Entrée <CornerDownLeft size={11} />
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-surface-container-low p-4 text-center">
                        <p className="text-sm font-semibold text-on-surface">Aucun résultat pour « {query} »</p>
                        <button
                          type="button"
                          onClick={() => handleSubmit()}
                          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Rechercher dans tout le catalogue <ArrowRight size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};