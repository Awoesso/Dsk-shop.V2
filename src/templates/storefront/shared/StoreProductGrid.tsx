import React from 'react';
import { Product } from '../../../types';
import { StoreProductCard } from './StoreProductCard';
import { ProductCardStyle, ProductLayout } from '../../../types/storefront';

interface StoreProductGridProps {
  products: Product[];
  cardStyle?: ProductCardStyle;
  layout?: ProductLayout;
  columns?: 2 | 3 | 4;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: (productId: string) => boolean;
  onSelectProduct?: (product: Product) => void;
  currency?: string;
}

export const StoreProductGrid: React.FC<StoreProductGridProps> = ({
  products,
  cardStyle = 'standard',
  layout = 'grid',
  columns = 4,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onSelectProduct,
  currency = 'FCFA',
}) => {
  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-3 sm:gap-4">
        {products.map((product) => (
          <StoreProductCard
            key={product.id}
            product={product}
            cardStyle={cardStyle}
            layout="list"
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={isInWishlist ? isInWishlist(product.id) : false}
            onSelectProduct={onSelectProduct}
            currency={currency}
          />
        ))}
      </div>
    );
  }

  const gridColsClass =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 3
      ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`grid gap-3 sm:gap-6 ${gridColsClass}`}>
      {products.map((product) => (
        <StoreProductCard
          key={product.id}
          product={product}
          cardStyle={cardStyle}
          layout="grid"
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={isInWishlist ? isInWishlist(product.id) : false}
          onSelectProduct={onSelectProduct}
          currency={currency}
        />
      ))}
    </div>
  );
};
