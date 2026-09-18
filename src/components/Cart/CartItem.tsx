import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../Common/ProductImage';
import { formatPrice } from '../../utils/currency';

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({ item, compact = false }) => {
  const { updateCartQuantity, removeFromCart, openProduct, setIsCartOpen } = useShop();
  const { product, quantity, selectedVariant } = item;

  const unitPrice = Math.max(0, product.price + (selectedVariant?.priceModifier || 0));
  const itemPrice = unitPrice * quantity;
  const maxStock = product.stockCount > 0 ? product.stockCount : 99;
  const isMaxStock = quantity >= maxStock;

  const handleProductClick = () => {
    setIsCartOpen(false);
    openProduct(product);
  };

  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-[#DDE8DE] last:border-0 group font-secondary">
      {/* Thumbnail with Skeleton Loader */}
      <div
        onClick={handleProductClick}
        className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F0FDF4] rounded-xl overflow-hidden flex-shrink-0 cursor-pointer border border-[#DDE8DE] hover:opacity-90 transition-opacity"
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          containerClassName="w-full h-full"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div
            onClick={handleProductClick}
            className="cursor-pointer hover:text-[#166534] transition-colors"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#647064] font-primary">
              {product.brand}
            </p>
            <h4 className="text-xs sm:text-sm font-bold text-[#172017] truncate font-primary">
              {product.name}
            </h4>
            {selectedVariant && (
              <p className="text-[11px] text-[#647064] mt-0.5">
                Variante : <span className="font-semibold text-[#172017] font-primary">{selectedVariant.name}</span>
              </p>
            )}
          </div>

          <button
            onClick={() => removeFromCart(product.id, selectedVariant?.id)}
            className="text-[#647064] hover:text-rose-600 p-1 transition-colors cursor-pointer"
            title="Supprimer l'article"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Quantity Controls & Price */}
        <div className="flex items-center justify-between mt-2.5 font-primary">
          <div className="flex items-center border border-[#DDE8DE] rounded-lg bg-[#FAFCFA] overflow-hidden shadow-2xs">
            <button
              onClick={() => updateCartQuantity(product.id, quantity - 1, selectedVariant?.id)}
              className="p-1 sm:px-2 text-[#647064] hover:bg-[#F0FDF4] hover:text-[#166534] transition-colors cursor-pointer"
              title={quantity === 1 ? "Retirer l'article" : "Diminuer la quantité"}
            >
              {quantity === 1 ? <Trash2 size={12} className="text-rose-500" /> : <Minus size={12} />}
            </button>
            <span className="px-2.5 text-xs font-bold text-[#172017] min-w-[24px] text-center">{quantity}</span>
            <button
              onClick={() => updateCartQuantity(product.id, quantity + 1, selectedVariant?.id)}
              disabled={isMaxStock}
              className={`p-1 sm:px-2 text-[#647064] transition-colors ${
                isMaxStock
                  ? 'opacity-40 cursor-not-allowed bg-neutral-100'
                  : 'hover:bg-[#F0FDF4] hover:text-[#166534] cursor-pointer'
              }`}
              title={isMaxStock ? `Stock max disponible (${maxStock})` : "Augmenter la quantité"}
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="text-right">
            <span className="text-xs sm:text-sm font-black text-[#172017]">
              {formatPrice(itemPrice)}
            </span>
            {quantity > 1 && (
              <p className="text-[10px] text-[#647064] font-secondary">
                {formatPrice(unitPrice)} / unité
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
