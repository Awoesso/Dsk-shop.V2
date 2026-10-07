import React, { useState } from 'react';
import {
  Heart,
  Eye,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/currency';
import { ProductImage } from '../Common/ProductImage';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
}) => {
  const { openProduct, addToCart, toggleWishlist, isInWishlist } = useShop();
  const [justAdded, setJustAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Discount calculation
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Image source handling
  const displayImage = product.primaryImage || product.images?.[0] || '';
  const hoverImage = product.images?.[1] || displayImage;

  const categoryLabel = product.category ? product.category.toUpperCase() : '';

  /* -------------------------------------------------------------------------- */
  /*                            LIST VIEW LAYOUT                                */
  /* -------------------------------------------------------------------------- */
  if (layout === 'list') {
    return (
      <div
        onClick={() => openProduct(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-white border border-surface-variant/70 hover:border-primary/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row gap-3 sm:gap-4 shadow-xs hover:shadow-md transition-all duration-200 ease-out hover:-translate-y-[1px] cursor-pointer font-secondary"
      >
        {/* Compact Thumbnail Container with protected icon badge */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-lg sm:rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 bg-surface-container-low border border-surface-variant/40">
          <ProductImage
            src={isHovered && product.images?.[1] ? hoverImage : displayImage}
            alt={product.name}
            containerClassName="w-full h-full"
            className="w-full h-full object-contain p-1 group-hover:scale-[1.02] transition-transform duration-200 ease-out"
          />

          {/* Icon in protected container with border so it remains crisp on any photo */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-xs transition-all duration-200 active:scale-90 flex items-center justify-center border border-surface-variant/80 cursor-pointer min-w-[32px] min-h-[32px] ${
              isFavorited ? 'text-rose-500 border-rose-200 bg-white' : 'text-on-surface-variant hover:text-rose-500'
            }`}
            title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-label="Ajouter aux favoris"
          >
            <Heart size={14} className={isFavorited ? 'fill-rose-500 text-rose-500' : ''} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            {/* Category label - subtle, extra small, light uppercase */}
            {categoryLabel && (
              <span className="text-[9px] font-medium tracking-wider text-on-surface-variant uppercase block">
                {categoryLabel}
              </span>
            )}

            {/* Product title */}
            <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors mt-0.5 line-clamp-1">
              {product.name}
            </h3>

            {/* Direct Price - No redundant "Prix" label */}
            <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 mt-1.5">
              <span className="text-base sm:text-lg font-extrabold text-primary whitespace-nowrap font-primary tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] font-normal text-on-surface-variant line-through whitespace-nowrap opacity-70">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discount && (
                <span className="text-[10px] font-bold bg-primary-fixed text-on-primary-fixed px-1.5 py-0.5 rounded border border-primary-fixed/40">
                  -{discount}%
                </span>
              )}
            </div>

            <p className="text-xs font-normal text-on-surface-variant line-clamp-1 mt-1 font-secondary">
              {product.description || (categoryLabel ? `Catégorie: ${categoryLabel}` : '')}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-surface-variant/50">
            <button
              onClick={handleAddToCart}
              className={`w-full sm:w-auto py-2 px-4 rounded-xl text-xs font-bold font-primary transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs min-h-[42px] ${
                justAdded
                  ? 'bg-primary-container text-white'
                  : 'bg-primary hover:bg-primary-container text-white'
              }`}
              title="Ajouter au panier"
              aria-label="Ajouter au panier"
            >
              {justAdded ? (
                <>
                  <Check size={15} className="text-white" />
                  <span>Ajouté au panier</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={15} />
                  <span>Ajouter au panier</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                            GRID VIEW LAYOUT                                */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      onClick={() => openProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white border border-surface-variant/70 hover:border-primary/50 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 ease-out hover:-translate-y-[1px] cursor-pointer font-secondary h-full"
    >
      {/* Top section: Image & Floating controls */}
      <div>
        {/* Uniform Aspect-Square Image Container with subtle inner border */}
        <div className="aspect-square rounded-lg sm:rounded-xl p-1.5 sm:p-2 relative flex items-center justify-center overflow-hidden mb-2 bg-surface-container-low border border-surface-variant/40">
          <ProductImage
            src={isHovered && product.images?.[1] ? hoverImage : displayImage}
            alt={product.name}
            containerClassName="w-full h-full"
            className="w-full h-full object-contain p-0.5 sm:p-1 group-hover:scale-[1.02] transition-transform duration-200 ease-out"
          />

          {/* Clean Discount Badge (Clear & quick to scan, no icon clutter) */}
          {discount ? (
            <span className="absolute top-1.5 left-1.5 text-[9px] sm:text-[10px] font-bold bg-primary-fixed text-on-primary-fixed px-1.5 py-0.5 rounded-md border border-primary-fixed/40 shadow-xs z-10">
              -{discount}%
            </span>
          ) : null}

          {/* Floating Wishlist Button inside a protected container with crisp border */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-1.5 right-1.5 p-1 sm:p-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-xs transition-all duration-200 active:scale-90 flex items-center justify-center z-10 cursor-pointer border border-surface-variant/80 min-w-[30px] min-h-[30px] ${
              isFavorited ? 'text-rose-500 border-rose-200 bg-white' : 'text-on-surface-variant hover:text-rose-500 hover:bg-white'
            }`}
            title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-label="Ajouter aux favoris"
          >
            <Heart
              size={13}
              className={isFavorited ? 'fill-rose-500 text-rose-500' : ''}
            />
          </button>

          {/* Desktop Quick View Button on Hover */}
          <div className="absolute inset-x-2 bottom-2 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openProduct(product);
              }}
              className="w-full py-1.5 px-2 bg-white/95 backdrop-blur-md text-on-surface hover:text-primary hover:bg-white text-[11px] font-semibold rounded-lg shadow-xs border border-surface-variant flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-primary"
            >
              <Eye size={12} />
              <span>Aperçu</span>
            </button>
          </div>
        </div>

        {/* Info Section: Category -> Title */}
        <div className="space-y-0.5">
          {categoryLabel && (
            <span className="text-[8px] sm:text-[9px] font-normal tracking-wider text-on-surface-variant uppercase block truncate opacity-75">
              {categoryLabel}
            </span>
          )}

          <h3 className="text-xs sm:text-[13px] font-semibold text-on-surface line-clamp-1 group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </div>
      </div>

      {/* Bottom Section: Clear direct price & direct purchasing action */}
      <div className="mt-2 pt-2 border-t border-surface-variant/50 space-y-2">
        {/* Direct Price Presentation without redundant label */}
        <div className="flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-xs sm:text-base font-extrabold text-primary whitespace-nowrap font-primary tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[9px] sm:text-[11px] font-normal text-on-surface-variant line-through whitespace-nowrap opacity-60">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Clear Action Button: "Ajouter au panier" */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold font-primary transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs min-h-[42px] ${
            justAdded
              ? 'bg-primary-container text-white'
              : 'bg-primary hover:bg-primary-container text-white'
          }`}
          title="Ajouter au panier"
          aria-label="Ajouter au panier"
        >
          {justAdded ? (
            <>
              <Check size={14} className="text-white shrink-0 stroke-[2.5]" />
              <span className="truncate">Ajouté</span>
            </>
          ) : (
            <>
              <ShoppingBag size={14} className="shrink-0 stroke-[2.2]" />
              <span className="truncate hidden min-[360px]:inline">Ajouter au panier</span>
              <span className="min-[360px]:hidden">Ajouter</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
