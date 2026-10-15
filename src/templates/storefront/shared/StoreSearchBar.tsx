import React from 'react';
import { Search, X } from 'lucide-react';

interface StoreSearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const StoreSearchBar: React.FC<StoreSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher un produit...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-[var(--store-btn-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] text-[var(--store-text)] placeholder-[var(--store-muted)] shadow-xs focus:outline-none focus:ring-1 focus:ring-[var(--store-primary)]"
      />
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--store-muted)]"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--store-muted)] hover:text-[var(--store-text)] p-1 rounded-full cursor-pointer"
          aria-label="Effacer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
