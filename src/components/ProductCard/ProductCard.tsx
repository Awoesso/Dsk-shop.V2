import React, { useState } from 'react';
import { Heart, ShoppingBag, Check, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../Common/ProductImage';
import { ProductCardSkeleton } from '../Skeleton/ProductCardSkeleton';
import { formatPrice } from '../../utils/currency';

export interface ProductCardProps {
  product?: Product;
  layout?: 'grid' | 'list';
  isLoading?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid', isLoading = false }) => {
  if (isLoading || !product) {
    return <ProductCardSkeleton layout={layout} />;
  }

  const { addToCart, openProduct, toggleWishlist, isInWishlist } = useShop();
  const isFavorited = isInWishlist(product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.variants?.[0]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const categoryLabel = product.category ? product.category.replace(/-/g, ' ') : '';
  const discount =
    product.discountPercent ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null);

  const displayImage = product.primaryImage || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
  const hoverImage = product.images?.[1] || displayImage;

  /* -------------------------------------------------------------------------- */
  /*                            LIST VIEW LAYOUT                                */
  /* -------------------------------------------------------------------------- */
  if (layout === 'list') {
    return (
      <div
        onClick={() => openProduct(product)}
        className="group relative bg-white border border-[#DDE8DE] hover:border-[#166534]/40 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-3 sm:gap-4 cursor-pointer font-secondary"
      >
        {/* Image Section */}
        <div className="relative w-full sm:w-36 md:w-44 h-36 sm:h-36 md:h-44 bg-[#F3FAF4] rounded-lg p-2 overflow-hidden shrink-0 flex items-center justify-center border border-[#DDE8DE]/60">
          <ProductImage
            src={displayImage}
            alt={product.name}
            containerClassName="w-full h-full"
            className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-300 ease-out"
          />

          {/* Floating Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur-xs shadow-2xs transition-all duration-200 active:scale-90 flex items-center justify-center z-10 cursor-pointer border border-[#DDE8DE]/80 ${
              isFavorited ? 'text-rose-500 border-rose-200 bg-white' : 'text-[#647064] hover:text-rose-500 hover:bg-white'
            }`}
            title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-label="Favoris"
          >
            <Heart
              size={14}
              className={isFavorited ? 'fill-rose-500 text-rose-500' : ''}
            />
          </button>
        </div>

        {/* Info Section */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xs md:text-sm font-semibold text-[#172017] line-clamp-1 group-hover:text-[#166534] transition-colors font-primary">
                {product.name}
              </h3>
              {discount ? (
                <span className="text-[10px] font-bold bg-[#DCFCE7] text-[#166534] px-1.5 py-0.5 rounded border border-[#DCFCE7] shrink-0 whitespace-nowrap">
                  -{discount}%
                </span>
              ) : categoryLabel ? (
                <span className="text-[10px] font-medium bg-[#F3FAF4] text-[#166534] px-1.5 py-0.5 rounded border border-[#DDE8DE] shrink-0 whitespace-nowrap capitalize">
                  {categoryLabel}
                </span>
              ) : null}
            </div>

            <p className="text-[11px] md:text-xs font-normal text-[#647064] opacity-70 line-clamp-1 mt-0.5 font-secondary">
              {product.description || (categoryLabel ? `Catégorie: ${categoryLabel}` : '')}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#DDE8DE]/80 gap-3">
            <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
              <span className="text-xs md:text-sm font-bold text-[#172017] whitespace-nowrap font-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] md:text-[11px] font-normal text-[#647064] line-through whitespace-nowrap opacity-70">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold font-primary border border-[#DCFCE7] bg-[#F0FDF4] hover:bg-[#166534] text-[#166534] hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95 shadow-2xs ${
                justAdded ? 'bg-[#166534] text-white border-[#166534]' : ''
              }`}
              title="Ajouter au panier"
              aria-label="Ajouter au panier"
            >
              {justAdded ? (
                <>
                  <Check size={14} className="text-white" />
                  <span>Ajouté</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>Ajouter</span>
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
      className="group relative bg-white border border-[#DDE8DE] hover:border-[#166534]/40 p-3 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer font-secondary"
    >
      {/* Top section: Image & Badges */}
      <div>
        {/* Compact Image Container */}
        <div className="aspect-square rounded-lg p-2 relative flex items-center justify-center overflow-hidden mb-2 bg-[#F3FAF4] border border-[#DDE8DE]/60">
          <ProductImage
            src={isHovered && product.images?.[1] ? hoverImage : displayImage}
            alt={product.name}
            containerClassName="w-full h-full"
            className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300 ease-out"
          />

          {/* Discount Badge if available */}
          {discount ? (
            <span className="absolute top-1.5 left-1.5 text-[10px] font-bold bg-[#DCFCE7] text-[#166534] px-1.5 py-0.5 rounded border border-[#DCFCE7]/60 shadow-2xs">
              -{discount}%
            </span>
          ) : null}

          {/* Floating Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur-xs shadow-2xs transition-all duration-200 active:scale-90 flex items-center justify-center z-10 cursor-pointer border border-[#DDE8DE]/80 ${
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

        {/* Info Section: Category -> Title -> Description */}
        <div>
          {/* Category */}
          {categoryLabel && (
            <span className="text-[10px] font-semibold text-[#166534] uppercase tracking-wider font-primary block truncate">
              {categoryLabel}
            </span>
          )}

          {/* Card Title (H3) */}
          <h3 className="text-xs md:text-sm font-semibold text-[#172017] line-clamp-1 group-hover:text-[#166534] transition-colors font-primary mt-0.5">
            {product.name}
          </h3>

          {/* Description line */}
          {product.description && (
            <p className="text-[11px] font-normal text-[#647064] opacity-70 line-clamp-1 mt-0.5 font-secondary">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Section: Price Tag & Compact Action Button */}
      <div className="mt-2.5 pt-2 border-t border-[#DDE8DE]/80 flex items-center justify-between gap-1.5">
        {/* Full Price in FCFA */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs md:text-sm font-bold text-[#172017] whitespace-nowrap font-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[10px] md:text-[11px] font-normal text-[#647064] line-through whitespace-nowrap opacity-70">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Compact Action Button */}
        <button
          onClick={handleAddToCart}
          className={`p-2 rounded-lg bg-[#F0FDF4] hover:bg-[#166534] text-[#166534] hover:text-white border border-[#DCFCE7] hover:border-[#166534] transition-all duration-200 shrink-0 cursor-pointer active:scale-95 shadow-2xs flex items-center justify-center ${
            justAdded ? 'bg-[#166534] text-white border-[#166534]' : ''
          }`}
          title={justAdded ? 'Ajouté au panier' : 'Ajouter au panier'}
          aria-label="Ajouter au panier"
        >
          {justAdded ? <Check size={14} className="text-white" /> : <ShoppingBag size={14} />}
        </button>
      </div>
    </div>
  );
};
