import React from 'react';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../../../types';
import { ProductCardStyle, ProductLayout } from '../../../types/storefront';

interface StoreProductCardProps {
  product: Product;
  cardStyle?: ProductCardStyle;
  layout?: ProductLayout;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  onSelectProduct?: (product: Product) => void;
  currency?: string;
}

const fallbackImage =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="#f4fafd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#717973" font-family="sans-serif" font-size="20">Image non disponible</text></svg>'
  );

export const StoreProductCard: React.FC<StoreProductCardProps> = ({
  product,
  cardStyle = 'standard',
  layout = 'grid',
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  onSelectProduct,
  currency = 'FCFA',
}) => {
  const [imageSrc, setImageSrc] = React.useState<string>(
    product.primaryImage || product.images?.[0] || fallbackImage
  );
  const [justAdded, setJustAdded] = React.useState(false);

  React.useEffect(() => {
    setImageSrc(product.primaryImage || product.images?.[0] || fallbackImage);
  }, [product.primaryImage, product.images]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    }
  };

  const formattedPrice = `${new Intl.NumberFormat('fr-FR').format(product.price)} ${currency}`;
  const formattedOriginalPrice = product.originalPrice
    ? `${new Intl.NumberFormat('fr-FR').format(product.originalPrice)} ${currency}`
    : null;

  const isOutOfStock = !product.inStock || product.stockCount === 0;

  // List Layout
  if (layout === 'list') {
    return (
      <div
        onClick={() => onSelectProduct && onSelectProduct(product)}
        className="group flex flex-col sm:flex-row items-center gap-4 p-4 rounded-[var(--store-card-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] hover:shadow-md transition-all duration-200 cursor-pointer"
      >
        <div className="relative w-full sm:w-44 h-44 shrink-0 overflow-hidden rounded-[calc(var(--store-card-radius)-4px)] bg-[var(--store-bg)]">
          <img
            src={imageSrc}
            alt={product.name}
            onError={() => setImageSrc(fallbackImage)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discountPercent && (
            <span
              className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-[var(--store-btn-radius)] text-white shadow-xs"
              style={{ backgroundColor: 'var(--store-primary)' }}
            >
              -{product.discountPercent}%
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2 w-full">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--store-muted)' }}>
              {product.category}
            </span>
            {onToggleWishlist && (
              <button
                onClick={handleToggleWishlist}
                className="p-1.5 rounded-full hover:bg-[var(--store-bg)] text-[var(--store-muted)] hover:text-rose-500 transition-colors"
                aria-label="Ajouter aux favoris"
              >
                <Heart size={16} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
              </button>
            )}
          </div>

          <h3
            className="font-bold text-base sm:text-lg line-clamp-1 group-hover:opacity-85 transition-opacity"
            style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
          >
            {product.name}
          </h3>

          <p className="text-xs line-clamp-2" style={{ color: 'var(--store-muted)' }}>
            {product.description || 'Article sélectionné avec soin.'}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-extrabold text-base sm:text-lg" style={{ color: 'var(--store-primary)' }}>
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="ml-2 text-xs line-through" style={{ color: 'var(--store-muted)' }}>
                  {formattedOriginalPrice}
                </span>
              )}
            </div>

            {onAddToCart && (
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-[var(--store-btn-radius)] transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-600'
                    : 'text-white hover:opacity-90 shadow-xs'
                }`}
                style={!isOutOfStock ? { backgroundColor: 'var(--store-primary)' } : undefined}
              >
                {justAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
                <span>{isOutOfStock ? 'Épuisé' : justAdded ? 'Ajouté !' : 'Ajouter'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout
  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className={`group relative flex flex-col rounded-[var(--store-card-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
        cardStyle === 'elevated' ? 'shadow-md' : cardStyle === 'bordered' ? 'border-2' : ''
      }`}
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--store-bg)]">
        <img
          src={imageSrc}
          alt={product.name}
          onError={() => setImageSrc(fallbackImage)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.discountPercent ? (
            <span
              className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-[var(--store-btn-radius)] text-white shadow-xs"
              style={{ backgroundColor: 'var(--store-primary)' }}
            >
              -{product.discountPercent}%
            </span>
          ) : null}
          {product.isFeatured && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-[var(--store-btn-radius)] bg-amber-500 text-white shadow-xs">
              Vedette
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-[var(--store-btn-radius)] bg-slate-900/80 text-white shadow-xs">
              Épuisé
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-rose-500 hover:scale-110 shadow-xs transition-all z-10"
            aria-label="Ajouter aux favoris"
          >
            <Heart size={15} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
          </button>
        )}
      </div>

      {/* Card Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--store-muted)' }}>
            {product.category || 'Article'}
          </span>
          <h3
            className="font-bold text-xs sm:text-sm line-clamp-1 group-hover:opacity-85 transition-opacity"
            style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="pt-2 flex items-center justify-between border-t border-[var(--store-border)]/60">
          <div>
            <div className="font-extrabold text-xs sm:text-sm" style={{ color: 'var(--store-primary)' }}>
              {formattedPrice}
            </div>
            {formattedOriginalPrice && (
              <div className="text-[10px] line-through" style={{ color: 'var(--store-muted)' }}>
                {formattedOriginalPrice}
              </div>
            )}
          </div>

          {onAddToCart && (
            <button
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`p-2 rounded-[var(--store-btn-radius)] text-white shadow-xs transition-transform active:scale-95 cursor-pointer ${
                isOutOfStock ? 'opacity-40 cursor-not-allowed bg-slate-400' : 'hover:opacity-90'
              }`}
              style={!isOutOfStock ? { backgroundColor: 'var(--store-primary)' } : undefined}
              aria-label="Ajouter au panier"
            >
              {justAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
