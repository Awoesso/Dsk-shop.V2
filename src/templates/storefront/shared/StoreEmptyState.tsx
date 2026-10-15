import React from 'react';
import { PackageOpen, RotateCcw } from 'lucide-react';

interface StoreEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const StoreEmptyState: React.FC<StoreEmptyStateProps> = ({
  title = 'Aucun produit trouvé',
  description = 'Aucun article ne correspond à vos filtres actuels ou la boutique est en cours d’approvisionnement.',
  actionLabel = 'Réinitialiser les filtres',
  onAction,
}) => {
  return (
    <div className="w-full py-16 px-4 text-center rounded-[var(--store-card-radius)] border border-dashed border-[var(--store-border)] bg-[var(--store-surface)] my-8">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--store-border)] shadow-xs"
        style={{ backgroundColor: 'var(--store-bg)', color: 'var(--store-primary)' }}
      >
        <PackageOpen size={30} />
      </div>
      <h3
        className="text-base sm:text-lg font-bold"
        style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
      >
        {title}
      </h3>
      <p className="text-xs sm:text-sm mt-1 max-w-md mx-auto" style={{ color: 'var(--store-muted)' }}>
        {description}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white rounded-[var(--store-btn-radius)] shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
          style={{ backgroundColor: 'var(--store-primary)' }}
        >
          <RotateCcw size={14} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
