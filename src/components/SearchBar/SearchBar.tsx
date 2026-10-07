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
  placeholder = 'Rechercher un équipement, audio, accessoires...',
  className = '',
  onSearchSubmitted,
}) => {
  const { products, filterState, setFilters, navigateTo, openProduct } = useShop();
  const [query, setQuery] = useState(filterState.searchQuery || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync when filterState changes from outside
  useEffect(() => {
    setQuery(filterState.searchQuery);
  }, [filterState.searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setIsOpen(false);
    navigateTo('shop', { search: query });
    if (onSearchSubmitted) onSearchSubmitted();
  };

  const handleSelectProduct = (product: Product) => {
    setIsOpen(false);
    openProduct(product);
    if (onSearchSubmitted) onSearchSubmitted();
  };

  const handleClear = () => {
    setQuery('');
    setFilters({ searchQuery: '' });
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3.5 2xl:pl-4 flex items-center pointer-events-none text-on-surface-variant">
          <Search size={18} className="2xl:w-5 2xl:h-5" />
        </div>
        <input
          id="dsk-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 2xl:pl-12 pr-10 2xl:pr-12 py-2.5 2xl:py-3.5 bg-surface-container-low hover:bg-white focus:bg-white text-base sm:text-sm 2xl:text-base font-secondary text-on-surface placeholder:text-outline rounded-xl 2xl:rounded-2xl border border-surface-variant focus:border-primary focus:ring-2 focus:ring-surface-tint/20 focus:outline-none transition-all shadow-xs"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 2xl:pr-4 flex items-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer min-w-[36px] min-h-[36px] justify-center"
            title="Effacer la recherche"
          >
            <X size={16} className="2xl:w-5 2xl:h-5" />
          </button>
        )}
      </form>

      {/* Instant Dropdown Preview */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-surface-variant overflow-hidden z-50 divide-y divide-surface-variant animate-in fade-in-50 zoom-in-95 duration-150 max-h-[75vh] overflow-y-auto">
          {matchingSuggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary font-primary">
                Produits correspondants ({matchingSuggestions.length})
              </div>
              {matchingSuggestions.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod)}
                  className="w-full px-3.5 py-2.5 flex items-center gap-3 hover:bg-surface-container-low text-left transition-colors group cursor-pointer"
                >
                  <ProductImage
                    src={prod.images?.[0] || prod.primaryImage || ''}
                    alt={prod.name}
                    containerClassName="w-10 h-10 2xl:w-12 2xl:h-12 rounded-lg bg-surface-container-low border border-surface-variant flex-shrink-0 overflow-hidden"
                    className="w-full h-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] 2xl:text-xs text-on-surface-variant font-medium uppercase font-secondary">{prod.brand}</p>
                    <p className="text-sm 2xl:text-base font-semibold text-on-surface truncate group-hover:text-primary font-primary">
                      {prod.name}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm 2xl:text-base font-bold text-primary font-primary">{formatPrice(prod.price)}</span>
                  </div>
                </button>
              ))}

              <div className="p-2 bg-surface-container-low border-t border-surface-variant">
                <button
                  onClick={() => handleSubmit()}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs 2xl:text-sm font-semibold text-primary hover:bg-white rounded-lg transition-colors font-primary cursor-pointer min-h-[38px]"
                >
                  <span>Voir tous les résultats pour &laquo; {query} &raquo;</span>
                  <span className="flex items-center gap-1 text-on-surface-variant font-secondary">
                    Appuyez sur Entrée <CornerDownLeft size={12} />
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm 2xl:text-base text-on-surface font-semibold font-primary">Aucun résultat direct pour &laquo; {query} &raquo;</p>
              <p className="text-xs 2xl:text-sm text-on-surface-variant mt-1 font-secondary">Vérifiez l'orthographe ou essayez un terme plus général.</p>
              <button
                onClick={() => handleSubmit()}
                className="mt-3 inline-flex items-center gap-1.5 text-xs 2xl:text-sm font-bold text-primary hover:text-primary-container font-primary cursor-pointer"
              >
                Rechercher dans tout le catalogue <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
