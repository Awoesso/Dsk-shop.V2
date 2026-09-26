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
        className="group relative bg-white border border-[#DDE8DE] hover:border-[#166534]/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row gap-3 sm:gap-4 shadow-2xs hover:shadow-xs transition-all duration-200 ease-out hover:-translate-y-[3px] cursor-pointer font-secondary"
      >
        {/* Compact Thumbnail Container */}
        <div className="relative w-full sm:w-36 h-36 rounded-lg sm:rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 bg-[#F3FAF4] border border-[#DDE8DE]/60">
          <ProductImage
            src={isHovered && product.images?.[1] ? hoverImage : displayImage}
            alt={product.name}
            containerClassName="w-full h-full"
            className="w-full h-full object-contain p-1 group-hover:scale-[1.02] transition-transform duration-200 ease-out"
          />

          <button
            onClick={handleToggleWishlist}
            className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs shadow-2xs transition-all duration-200 active:scale-90 flex items-center justify-center border border-[#DDE8DE]/80 cursor-pointer ${
              isFavorited ? 'text-rose-500 border-rose-200 bg-white' : 'text-[#647064] hover:text-rose-500'
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
              <span className="text-[9px] font-medium tracking-wider text-[#647064] uppercase block">
                {categoryLabel}
              </span>
            )}

            {/* Product title - refined, light & clean */}
            <h3 className="text-sm font-normal text-[#172017] group-hover:text-[#166534] transition-colors mt-0.5 line-clamp-1">
              {product.name}
            </h3>

            {/* Price Tag in FCFA */}
            <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 mt-1.5">
              <span className="text-base sm:text-lg font-extrabold text-[#172017] whitespace-nowrap font-primary tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] font-normal text-[#647064] line-through whitespace-nowrap opacity-70">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discount && (
                <span className="text-[9px] font-bold bg-[#DCFCE7] text-[#166534] px-1.5 py-0.5 rounded">
                  -{discount}%
                </span>
              )}
            </div>

            <p className="text-xs font-normal text-[#647064] line-clamp-1 mt-1 font-secondary">
              {product.description || (categoryLabel ? `Catégorie: ${categoryLabel}` : '')}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#DDE8DE]/80">
            <button
              onClick={handleAddToCart}
              className={`w-full sm:w-auto py-2 px-4 rounded-xl text-xs font-bold font-primary transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs ${
                justAdded
                  ? 'bg-[#15803D] text-white'
                  : 'bg-[#166534] hover:bg-[#15803D] text-white'
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
      className="group relative bg-white border border-[#DDE8DE] hover:border-[#166534]/50 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 ease-out hover:-translate-y-[3px] cursor-pointer font-secondary"
    >
      {/* Top section: Image & Floating controls */}
      <div>
        {/* Compact Image Container */}
        <div className="aspect-square rounded-lg sm:rounded-xl p-1.5 sm:p-2 relative flex items-center justify-center overflow-hidden mb-2 bg-[#F8FCF9] border border-[#DDE8DE]/50">
          <ProductImage
            src={isHovered && product.images?.[1] ? hoverImage : displayImage}
            alt={product.name}
            containerClassName="w-full h-full"
            className="w-full h-full object-contain p-0.5 sm:p-1 group-hover:scale-[1.02] transition-transform duration-200 ease-out"
          />

          {/* Discount Badge if available */}
          {discount ? (
            <span className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 text-[8px] sm:text-[10px] font-bold bg-[#DCFCE7] text-[#166534] px-1 sm:px-1.5 py-0.5 rounded sm:rounded-md border border-[#DCFCE7]/60 shadow-2xs">
              -{discount}%
            </span>
          ) : null}

          {/* Floating Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 p-1 sm:p-1.5 rounded-full bg-white/95 backdrop-blur-xs shadow-2xs transition-all duration-200 active:scale-90 flex items-center justify-center z-10 cursor-pointer border border-[#DDE8DE]/80 min-w-[28px] min-h-[28px] ${
              isFavorited ? 'text-rose-500 border-rose-200 bg-white' : 'text-[#647064] hover:text-rose-500 hover:bg-white'
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
              className="w-full py-1.5 px-2 bg-white/95 backdrop-blur-xs text-[#172017] hover:text-[#166534] hover:bg-white text-[11px] font-semibold rounded-lg shadow-2xs border border-[#DDE8DE] flex items-center justify-center gap-1 transition-colors cursor-pointer font-primary"
            >
              <Eye size={12} />
              <span>Aperçu</span>
            </button>
          </div>
        </div>

        {/* Info Section: Category -> Title */}
        <div className="space-y-0.5">
          {/* Category: extra-small, light, discreet uppercase */}
          {categoryLabel && (
            <span className="text-[8px] sm:text-[9px] font-normal tracking-wider text-[#647064] uppercase block truncate opacity-80">
              {categoryLabel}
            </span>
          )}

          {/* Product Name: refined, thinner font weight */}
          <h3 className="text-xs sm:text-[13px] font-medium text-[#172017] line-clamp-1 group-hover:text-[#166534] transition-colors leading-tight">
            {product.name}
          </h3>
        </div>
      </div>

      {/* Bottom Section: Price prominently displayed + Direct Full-width "Ajouter au panier" Button */}
      <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-[#DDE8DE]/70 space-y-1.5 sm:space-y-2">
        {/* Prominent Price Tag in FCFA */}
        <div className="flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-xs sm:text-base font-extrabold text-[#172017] whitespace-nowrap font-primary tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[9px] sm:text-[11px] font-normal text-[#647064] line-through whitespace-nowrap opacity-60">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Clear Action Button: "Ajouter au panier" (Green background, white text) */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold font-primary transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 shadow-xs min-h-[36px] sm:min-h-[40px] ${
            justAdded
              ? 'bg-[#15803D] text-white'
              : 'bg-[#166534] hover:bg-[#15803D] text-white'
          }`}
          title="Ajouter au panier"
          aria-label="Ajouter au panier"
        >
          {justAdded ? (
            <>
              <Check size={13} className="text-white shrink-0 stroke-[2.5]" />
              <span className="truncate">Ajouté</span>
            </>
          ) : (
            <>
              <ShoppingBag size={13} className="shrink-0 stroke-[2.2]" />
              <span className="truncate">Ajouter au panier</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
