import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';

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
        <div className="absolute inset-y-0 left-0 pl-3.5 2xl:pl-4 flex items-center pointer-events-none text-[#647064]">
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
          className="w-full pl-10 2xl:pl-12 pr-10 2xl:pr-12 py-2.5 2xl:py-3.5 bg-[#F0FDF4] hover:bg-white focus:bg-white text-sm 2xl:text-base font-secondary text-[#172017] placeholder:text-[#647064] rounded-xl 2xl:rounded-2xl border border-[#DDE8DE] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 focus:outline-none transition-all shadow-2xs"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 2xl:pr-4 flex items-center text-[#647064] hover:text-[#172017] transition-colors cursor-pointer"
            title="Effacer la recherche"
          >
            <X size={16} className="2xl:w-5 2xl:h-5" />
          </button>
        )}
      </form>

      {/* Instant Dropdown Preview */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#FAFCFA] rounded-2xl shadow-xl shadow-emerald-950/10 border border-[#DDE8DE] overflow-hidden z-50 divide-y divide-[#DDE8DE] animate-in fade-in-50 zoom-in-95 duration-150">
          {matchingSuggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#166534] font-primary">
                Produits correspondants ({matchingSuggestions.length})
              </div>
              {matchingSuggestions.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod)}
                  className="w-full px-3.5 py-2.5 flex items-center gap-3 hover:bg-[#F0FDF4] text-left transition-colors group cursor-pointer"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-10 h-10 2xl:w-12 2xl:h-12 object-cover rounded-lg bg-[#F0FDF4] border border-[#DDE8DE] flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] 2xl:text-xs text-[#647064] font-medium uppercase font-secondary">{prod.brand}</p>
                    <p className="text-sm 2xl:text-base font-semibold text-[#172017] truncate group-hover:text-[#166534] font-primary">
                      {prod.name}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm 2xl:text-base font-bold text-[#172017] font-primary">{formatPrice(prod.price)}</span>
                  </div>
                </button>
              ))}

              <div className="p-2 bg-[#F0FDF4] border-t border-[#DDE8DE]">
                <button
                  onClick={() => handleSubmit()}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs 2xl:text-sm font-semibold text-[#166534] hover:text-[#16A34A] hover:bg-white rounded-lg transition-colors font-primary cursor-pointer"
                >
                  <span>Voir tous les résultats pour &laquo; {query} &raquo;</span>
                  <span className="flex items-center gap-1 text-[#647064] font-secondary">
                    Appuyez sur Entrée <CornerDownLeft size={12} />
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm 2xl:text-base text-[#172017] font-semibold font-primary">Aucun résultat direct pour &laquo; {query} &raquo;</p>
              <p className="text-xs 2xl:text-sm text-[#647064] mt-1 font-secondary">Vérifiez l'orthographe ou essayez un terme plus général.</p>
              <button
                onClick={() => handleSubmit()}
                className="mt-3 inline-flex items-center gap-1.5 text-xs 2xl:text-sm font-bold text-[#166534] hover:text-[#16A34A] font-primary cursor-pointer"
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
