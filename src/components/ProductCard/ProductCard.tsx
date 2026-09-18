import React from 'react';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../Common/ProductImage';
import { formatPrice } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { addToCart, openProduct, toggleWishlist, isInWishlist } = useShop();
  const isFavorited = isInWishlist(product.id);
  const [isHovered, setIsHovered] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState(false);

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

  /* -------------------------------------------------------------------------- */
  /*                            LIST VIEW LAYOUT                                */
  /* -------------------------------------------------------------------------- */
  if (layout === 'list') {
    return (
      <div
        onClick={() => openProduct(product)}
        className="group relative flex flex-col sm:flex-row bg-[#FAFCFA] rounded-2xl 2xl:rounded-3xl border border-[#DDE8DE] hover:border-[#16A34A]/60 overflow-hidden hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300 cursor-pointer p-3 sm:p-4 2xl:p-6 gap-3.5 sm:gap-5 2xl:gap-8"
      >
        {/* Product Image Box */}
        <div className="relative w-full sm:w-44 md:w-52 lg:w-56 2xl:w-64 h-48 sm:h-44 md:h-52 lg:h-56 2xl:h-64 bg-gradient-to-b from-[#F7FAF7] to-[#EDF5EE] rounded-xl 2xl:rounded-2xl overflow-hidden flex-shrink-0 border border-[#DDE8DE]/70 flex items-center justify-center p-2 sm:p-3">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            containerClassName="w-full h-full"
            className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 font-primary">
            {product.discountPercent && (
              <span className="px-2 py-0.5 text-[9px] sm:text-[10px] 2xl:text-xs font-black tracking-tight bg-[#16A34A] text-white rounded-full shadow-xs">
                -{product.discountPercent}%
              </span>
            )}
            {product.isNew && (
              <span className="px-2 py-0.5 text-[9px] sm:text-[10px] 2xl:text-xs font-bold bg-[#14532D] text-[#DCFCE7] rounded-full shadow-xs">
                NOUVEAU
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 2xl:w-9 2xl:h-9 rounded-full backdrop-blur-md shadow-xs transition-all active:scale-90 flex items-center justify-center z-10 cursor-pointer ${
              isFavorited
                ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
                : 'bg-white/90 text-[#172017] hover:bg-white hover:text-rose-600 border border-white/80'
            }`}
            title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-label="Favoris"
          >
            <Heart
              size={14}
              className={
                isFavorited
                  ? 'fill-rose-500 text-rose-500 sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5'
                  : 'sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5'
              }
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between font-secondary min-w-0">
          <div>
            {/* Brand, Category & Rating Row */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] 2xl:text-xs">
                <span className="font-bold uppercase tracking-wider text-[#166534] font-primary">
                  {product.brand}
                </span>
                <span className="text-[#DDE8DE]">•</span>
                <span className="text-[#647064] capitalize font-medium">{product.category.replace('-', ' ')}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] 2xl:text-xs">
                <div className="flex items-center text-amber-500">
                  <Star size={12} className="fill-amber-400 text-amber-400 sm:w-3.5 sm:h-3.5" />
                  <span className="ml-1 font-bold text-[#172017] font-primary">{product.rating}</span>
                </div>
                <span className="text-[#849385]">({product.reviewCount} avis)</span>
              </div>
            </div>

            {/* Product Title */}
            <h3 className="text-sm sm:text-base md:text-lg 2xl:text-xl font-bold text-[#172017] group-hover:text-[#166534] transition-colors font-primary line-clamp-2 leading-snug">
              {product.name}
            </h3>

            {/* Product Description */}
            <p className="mt-1 text-xs sm:text-sm 2xl:text-base text-[#647064] line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Meta Tags: Stock & Variants */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
              {product.stockCount <= 15 && product.stockCount > 0 ? (
                <span className="text-[10px] sm:text-xs 2xl:text-sm font-semibold text-amber-900 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-full font-primary inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Plus que {product.stockCount} en stock à Lomé
                </span>
              ) : (
                <span className="text-[10px] sm:text-xs 2xl:text-sm font-semibold text-[#166534] bg-[#DCFCE7] border border-[#DCFCE7] px-2.5 py-0.5 rounded-full font-primary inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  En Stock • Livraison Express
                </span>
              )}

              {product.variants && product.variants.length > 1 && (
                <div className="flex items-center gap-1 pl-1">
                  <span className="text-[10px] sm:text-xs text-[#647064] font-medium mr-0.5">Couleurs :</span>
                  {product.variants.slice(0, 4).map((v) => (
                    <div
                      key={v.id}
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-slate-300 shadow-2xs"
                      style={{ backgroundColor: v.value.startsWith('#') ? v.value : '#cbd5e1' }}
                      title={v.name}
                    />
                  ))}
                  {product.variants.length > 4 && (
                    <span className="text-[10px] text-[#647064]">+{product.variants.length - 4}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar: Price & Action */}
          <div className="flex items-center justify-between mt-4 pt-3 2xl:pt-4 border-t border-[#DDE8DE]">
            <div className="flex items-baseline gap-2 2xl:gap-3">
              <span className="text-base sm:text-lg md:text-xl 2xl:text-2xl font-black text-[#172017] font-primary tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm 2xl:text-base text-[#849385] line-through font-primary">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discountPercent && (
                <span className="hidden md:inline-block text-[10px] sm:text-xs font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-md font-primary">
                  Économie {formatPrice(product.originalPrice! - product.price)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-4 sm:px-5 2xl:px-7 py-2 sm:py-2.5 2xl:py-3 text-xs sm:text-sm 2xl:text-base font-bold rounded-xl 2xl:rounded-2xl transition-all font-primary active:scale-95 cursor-pointer ${
                justAdded
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-[#166534] hover:bg-[#16A34A] text-white shadow-xs hover:shadow-md'
              }`}
            >
              {justAdded ? (
                <>
                  <Check size={15} className="2xl:w-4 2xl:h-4" />
                  <span>Ajouté au panier</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={15} className="2xl:w-4 2xl:h-4" />
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
      className="group relative flex flex-col h-full bg-[#FAFCFA] rounded-xl sm:rounded-2xl 2xl:rounded-3xl border border-[#DDE8DE] hover:border-[#16A34A]/60 overflow-hidden hover:shadow-lg hover:shadow-emerald-950/5 hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-gradient-to-b from-[#F7FAF7] to-[#EEF5EE] overflow-hidden border-b border-[#DDE8DE]/70 flex items-center justify-center p-2 sm:p-3 2xl:p-4">
        <ProductImage
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          containerClassName="w-full h-full"
          className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges: Top-Left */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 2xl:top-3.5 2xl:left-3.5 flex flex-col gap-1 items-start z-10 font-primary">
          {product.discountPercent && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] 2xl:text-xs font-black tracking-tight bg-[#16A34A] text-white rounded-md shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[8.5px] sm:text-[9.5px] 2xl:text-[11px] font-bold bg-[#14532D] text-[#DCFCE7] rounded-md shadow-xs">
              NOUVEAU
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[8.5px] sm:text-[9.5px] 2xl:text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300/60 rounded-md shadow-xs">
              TOP VENTE
            </span>
          )}
        </div>

        {/* Wishlist Button: Top-Right */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 2xl:top-3.5 2xl:right-3.5 w-7 h-7 sm:w-8 sm:h-8 2xl:w-9 2xl:h-9 rounded-full backdrop-blur-md shadow-xs transition-all active:scale-90 flex items-center justify-center z-10 cursor-pointer ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
              : 'bg-white/90 text-[#172017] hover:bg-white hover:text-rose-600 border border-white/80'
          }`}
          title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-label="Ajouter aux favoris"
        >
          <Heart
            size={13}
            className={
              isFavorited
                ? 'fill-rose-500 text-rose-500 sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5'
                : 'sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5'
            }
          />
        </button>

        {/* Quick View Button (desktop hover) */}
        <div className="absolute inset-x-2.5 bottom-2.5 2xl:inset-x-3.5 2xl:bottom-3.5 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProduct(product);
            }}
            className="w-full py-1.5 2xl:py-2 px-2 bg-white/95 backdrop-blur-xs text-[#166534] text-[11px] 2xl:text-xs font-bold font-primary rounded-lg 2xl:rounded-xl shadow-xs border border-[#DDE8DE] flex items-center justify-center gap-1.5 hover:bg-[#F0FDF4] hover:text-[#16A34A] transition-colors cursor-pointer"
          >
            <Eye size={13} className="2xl:w-4 2xl:h-4" />
            <span>Aperçu rapide</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex-1 p-2.5 sm:p-3 md:p-3.5 2xl:p-4.5 flex flex-col justify-between font-secondary bg-[#FAFCFA]">
        <div>
          {/* Brand & Rating Row */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] 2xl:text-xs mb-1 font-secondary gap-1">
            <span className="font-bold uppercase tracking-wider text-[#166534] truncate max-w-[85px] sm:max-w-[110px] 2xl:max-w-none">
              {product.brand}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-[#172017] flex-shrink-0">
              <Star size={11} className="fill-amber-400 text-amber-400 sm:w-3 sm:h-3 2xl:w-3.5 2xl:h-3.5" />
              <span className="font-bold font-primary">{product.rating}</span>
              <span className="text-[9px] sm:text-[10px] text-[#849385]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title with Fixed Baseline Height */}
          <h3 className="text-xs sm:text-[13px] md:text-sm 2xl:text-base font-bold text-[#172017] group-hover:text-[#166534] transition-colors line-clamp-2 leading-snug font-primary h-8 sm:h-9 md:h-10 2xl:h-11 flex items-start">
            {product.name}
          </h3>

          {/* Stock Tag & Variant Swatches Row */}
          <div className="flex items-center justify-between gap-1.5 mt-1 sm:mt-1.5 mb-1 sm:mb-2 min-h-[20px]">
            {product.stockCount <= 15 ? (
              <span className="text-[8.5px] sm:text-[9.5px] 2xl:text-[10.5px] font-semibold text-amber-900 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded font-primary truncate">
                Plus que {product.stockCount} dispo{product.stockCount > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-[8.5px] sm:text-[9.5px] 2xl:text-[10.5px] font-semibold text-[#166534] bg-[#DCFCE7]/70 border border-[#DCFCE7] px-1.5 py-0.5 rounded font-primary truncate">
                En stock Lomé
              </span>
            )}

            {/* Variant color swatches preview */}
            {product.variants && product.variants.length > 1 && (
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                {product.variants.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 2xl:w-3 2xl:h-3 rounded-full border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: v.value.startsWith('#') ? v.value : '#cbd5e1' }}
                    title={v.name}
                  />
                ))}
                {product.variants.length > 3 && (
                  <span className="text-[7.5px] sm:text-[8.5px] text-[#849385] font-semibold">
                    +{product.variants.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Price & Add Button */}
        <div className="pt-2 sm:pt-2.5 2xl:pt-3 border-t border-[#E8F0E9] mt-auto flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Price Container */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1 truncate">
              <span className="text-xs sm:text-sm md:text-base 2xl:text-lg font-extrabold text-[#172017] font-primary tracking-tight truncate">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.originalPrice ? (
              <span className="text-[8.5px] sm:text-[9.5px] md:text-[11px] 2xl:text-xs text-[#849385] line-through font-primary block -mt-0.5 truncate">
                {formatPrice(product.originalPrice)}
              </span>
            ) : (
              <span className="text-[8px] sm:text-[9px] text-[#849385] font-medium block -mt-0.5">
                Prix unitaire
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`p-2 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 2xl:px-4 2xl:py-2.5 text-[10px] sm:text-[11px] md:text-xs 2xl:text-sm font-bold rounded-lg sm:rounded-xl 2xl:rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-1 font-primary flex-shrink-0 cursor-pointer shadow-xs ${
              justAdded
                ? 'bg-[#16A34A] text-white ring-2 ring-[#DCFCE7]'
                : 'bg-[#166534] hover:bg-[#16A34A] text-white hover:shadow-sm'
            }`}
            title="Ajouter au Panier"
            aria-label="Ajouter au panier"
          >
            {justAdded ? (
              <>
                <Check size={13} className="sm:w-3.5 sm:h-3.5 2xl:w-4 2xl:h-4" />
                <span className="hidden sm:inline">Ajouté</span>
              </>
            ) : (
              <>
                <ShoppingBag size={13} className="sm:w-3.5 sm:h-3.5 2xl:w-4 2xl:h-4" />
                <span className="hidden sm:inline">Ajouter</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

