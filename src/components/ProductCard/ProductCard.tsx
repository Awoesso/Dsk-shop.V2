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

  if (layout === 'list') {
    return (
      <div
        onClick={() => openProduct(product)}
        className="group flex flex-col sm:flex-row bg-[#FAFCFA] rounded-xl sm:rounded-2xl border border-[#DDE8DE] overflow-hidden hover:border-[#16A34A] hover:shadow-md hover:shadow-emerald-950/5 transition-all duration-200 cursor-pointer p-3 sm:p-4 gap-3 sm:gap-5"
      >
        <div className="relative w-full sm:w-40 md:w-48 h-40 sm:h-48 bg-[#F0FDF4] rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border border-[#DDE8DE]/60">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            containerClassName="w-full h-full"
            className="group-hover:scale-105 transition-transform duration-300"
          />
          {product.discountPercent && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold bg-[#16A34A] text-white rounded shadow-xs font-primary">
              -{product.discountPercent}%
            </span>
          )}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-colors ${
              isFavorited
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/90 text-[#172017] hover:bg-white hover:text-rose-600'
            }`}
            title="Save to wishlist"
          >
            <Heart size={14} className={isFavorited ? 'fill-rose-500 text-rose-500 sm:w-4 sm:h-4' : 'sm:w-4 sm:h-4'} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between font-secondary">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[#647064] font-secondary">
                {product.brand}
              </span>
              <span className="text-[#DDE8DE]">•</span>
              <span className="text-[9px] sm:text-[10px] md:text-xs text-[#647064] capitalize">{product.category.replace('-', ' ')}</span>
            </div>

            <h3 className="text-xs sm:text-sm md:text-base font-bold text-[#172017] group-hover:text-[#166534] transition-colors font-primary line-clamp-2 leading-snug">
              {product.name}
            </h3>

            <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs md:text-sm text-[#647064] line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                <Star size={12} className="fill-amber-400 text-amber-400 sm:w-3.5 sm:h-3.5" />
                <span className="ml-1 text-[10px] sm:text-[11px] md:text-xs font-bold text-[#172017] font-primary">{product.rating}</span>
              </div>
              <span className="text-[10px] sm:text-[11px] md:text-xs text-[#647064]">({product.reviewCount} reviews)</span>
              {product.stockCount <= 15 && product.stockCount > 0 ? (
                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-primary">
                  Only {product.stockCount} left
                </span>
              ) : (
                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full font-primary">
                  In Stock
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#DDE8DE]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base md:text-xl font-extrabold text-[#172017] font-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs md:text-sm text-[#647064] line-through font-primary">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl transition-all font-primary ${
                  justAdded
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-[#166534] hover:bg-[#16A34A] text-white shadow-xs'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check size={13} className="sm:w-3.5 sm:h-3.5" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={13} className="sm:w-3.5 sm:h-3.5" /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (Standard default)
  return (
    <div
      onClick={() => openProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-[#FAFCFA] rounded-xl sm:rounded-2xl border border-[#DDE8DE] overflow-hidden hover:border-[#16A34A] hover:shadow-md hover:shadow-emerald-950/5 transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-[#F0FDF4] overflow-hidden border-b border-[#DDE8DE]/60">
        <ProductImage
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          containerClassName="w-full h-full"
          className="group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 items-start font-primary z-10">
          {product.discountPercent && (
            <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-tight bg-[#16A34A] text-white rounded sm:rounded-md shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold bg-[#166534] text-white rounded sm:rounded-md shadow-xs">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold bg-[#DCFCE7] text-[#166534] rounded sm:rounded-md shadow-xs">
              POPULAR
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 p-1.5 sm:p-2 rounded-full backdrop-blur-md shadow-xs transition-transform active:scale-90 z-10 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/90 text-[#172017] hover:bg-white hover:text-rose-600'
          }`}
          title="Save to Wishlist"
          aria-label="Wishlist"
        >
          <Heart size={13} className={isFavorited ? 'fill-rose-500 text-rose-500 sm:w-4 sm:h-4' : 'sm:w-4 sm:h-4'} />
        </button>

        {/* Quick View Floating Action Bar on hover */}
        <div className="absolute inset-x-2 bottom-2 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProduct(product);
            }}
            className="w-full py-1.5 px-2.5 bg-white/95 backdrop-blur-sm text-[#166534] text-xs font-semibold font-primary rounded-lg shadow-xs border border-[#DDE8DE] flex items-center justify-center gap-1.5 hover:bg-[#F0FDF4] hover:text-[#16A34A] transition-colors"
          >
            <Eye size={13} /> Quick View
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex-1 p-2 sm:p-2.5 md:p-3.5 flex flex-col justify-between font-secondary bg-[#FAFCFA]">
        <div>
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] md:text-xs text-[#647064] font-semibold mb-0.5 sm:mb-1 font-secondary">
            <span className="uppercase tracking-wider truncate max-w-[65px] sm:max-w-none">{product.brand}</span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-[#172017]">
              <Star size={10} className="fill-amber-400 text-amber-400 sm:w-3 sm:h-3" />
              <span className="text-[9px] sm:text-[10px] md:text-xs font-bold font-primary">{product.rating}</span>
            </div>
          </div>

          <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-[#172017] group-hover:text-[#166534] transition-colors line-clamp-2 leading-snug font-primary min-h-[1.85rem] sm:min-h-[2rem] md:min-h-[2.5rem]">
            {product.name}
          </h3>

          <p className="mt-0.5 text-[9.5px] sm:text-[10.5px] md:text-xs text-[#647064] line-clamp-1 leading-normal font-secondary">
            {product.description}
          </p>

          {/* Color variants preview dots if available */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex items-center gap-1 mt-1 sm:mt-1.5">
              {product.variants.slice(0, 3).map((v) => (
                <div
                  key={v.id}
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full border border-[#DDE8DE]"
                  style={{ backgroundColor: v.value.startsWith('#') ? v.value : '#cbd5e1' }}
                  title={v.name}
                />
              ))}
              {product.variants.length > 3 && (
                <span className="text-[7.5px] sm:text-[8.5px] md:text-[10px] text-[#647064] font-secondary">
                  +{product.variants.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Cart Button */}
        <div className="mt-1.5 sm:mt-2 md:mt-2.5 pt-1 sm:pt-1.5 md:pt-2 border-t border-[#DDE8DE] flex items-center justify-between gap-1">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-0.5 sm:gap-1 truncate">
              <span className="text-xs sm:text-sm md:text-base font-extrabold text-[#172017] font-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-[8.5px] sm:text-[9.5px] md:text-[11px] text-[#647064] line-through font-primary">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.stockCount <= 15 ? (
              <span className="text-[7.5px] sm:text-[8.5px] md:text-[10px] font-semibold text-amber-800 font-primary truncate">
                {product.stockCount} left
              </span>
            ) : (
              <span className="text-[7.5px] sm:text-[8.5px] md:text-[10px] font-semibold text-[#166534] font-primary truncate">
                In Stock
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-1.5 sm:p-2 sm:px-2.5 text-[9.5px] sm:text-[10.5px] md:text-xs font-bold rounded-lg sm:rounded-xl transition-all active:scale-95 flex items-center gap-1 font-primary flex-shrink-0 ${
              justAdded
                ? 'bg-[#16A34A] text-white'
                : 'bg-[#166534] hover:bg-[#16A34A] text-white shadow-xs'
            }`}
            title="Add to Shopping Cart"
          >
            {justAdded ? (
              <>
                <Check size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden md:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden md:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
