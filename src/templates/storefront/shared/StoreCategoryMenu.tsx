import React from 'react';
import { StoreCategory } from '../../../types/storefront';

interface StoreCategoryMenuProps {
  categories: StoreCategory[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  variant?: 'pills' | 'underline' | 'cards';
}

export const StoreCategoryMenu: React.FC<StoreCategoryMenuProps> = ({
  categories,
  selectedCategory = 'all',
  onSelectCategory,
  variant = 'pills',
}) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max">
        <button
          onClick={() => onSelectCategory && onSelectCategory('all')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-[var(--store-btn-radius)] transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'text-white shadow-xs'
              : 'bg-[var(--store-surface)] border border-[var(--store-border)] text-[var(--store-muted)] hover:text-[var(--store-text)]'
          }`}
          style={
            selectedCategory === 'all'
              ? { backgroundColor: 'var(--store-primary)' }
              : undefined
          }
        >
          Tous les produits
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === (cat.slug || cat.name);
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.slug || cat.name)}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-[var(--store-btn-radius)] transition-all cursor-pointer ${
                isSelected
                  ? 'text-white shadow-xs'
                  : 'bg-[var(--store-surface)] border border-[var(--store-border)] text-[var(--store-muted)] hover:text-[var(--store-text)]'
              }`}
              style={
                isSelected
                  ? { backgroundColor: 'var(--store-primary)' }
                  : undefined
              }
            >
              <span>{cat.name}</span>
              {typeof cat.itemCount === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[var(--store-bg)] text-[var(--store-muted)]'
                  }`}
                >
                  {cat.itemCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
