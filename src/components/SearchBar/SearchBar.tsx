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
  placeholder = 'Search high-performance gear, audio, workspace...',
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
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#647064]">
          <Search size={18} />
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
          className="w-full pl-10 pr-10 py-2.5 bg-[#F0FDF4] hover:bg-white focus:bg-white text-sm font-secondary text-[#172017] placeholder:text-[#647064] rounded-xl border border-[#DDE8DE] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 focus:outline-none transition-all shadow-2xs"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#647064] hover:text-[#172017] transition-colors"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Instant Dropdown Preview */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#FAFCFA] rounded-2xl shadow-xl shadow-emerald-950/10 border border-[#DDE8DE] overflow-hidden z-50 divide-y divide-[#DDE8DE] animate-in fade-in-50 zoom-in-95 duration-150">
          {matchingSuggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#166534] font-primary">
                Products ({matchingSuggestions.length})
              </div>
              {matchingSuggestions.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod)}
                  className="w-full px-3.5 py-2.5 flex items-center gap-3 hover:bg-[#F0FDF4] text-left transition-colors group"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-10 h-10 object-cover rounded-lg bg-[#F0FDF4] border border-[#DDE8DE] flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[#647064] font-medium uppercase font-secondary">{prod.brand}</p>
                    <p className="text-sm font-semibold text-[#172017] truncate group-hover:text-[#166534] font-primary">
                      {prod.name}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold text-[#172017] font-primary">{formatPrice(prod.price)}</span>
                  </div>
                </button>
              ))}

              <div className="p-2 bg-[#F0FDF4] border-t border-[#DDE8DE]">
                <button
                  onClick={() => handleSubmit()}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#166534] hover:text-[#16A34A] hover:bg-white rounded-lg transition-colors font-primary"
                >
                  <span>See all results for "{query}"</span>
                  <span className="flex items-center gap-1 text-[#647064] font-secondary">
                    Press Enter <CornerDownLeft size={12} />
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-[#172017] font-semibold font-primary">No direct matches for "{query}"</p>
              <p className="text-xs text-[#647064] mt-1 font-secondary">Try checking for typos or searching general categories.</p>
              <button
                onClick={() => handleSubmit()}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] hover:text-[#16A34A] font-primary"
              >
                Search full catalog <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
