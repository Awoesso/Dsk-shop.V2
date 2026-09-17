import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, ArrowLeft, Truck, Tag, ShieldCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CartItem } from '../../components/Cart/CartItem';
import { formatPrice } from '../../utils/currency';

export const CartPage: React.FC = () => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    shippingCost,
    discountAmount,
    cartTotal,
    cartItemCount,
    freeShippingThreshold,
    freeShippingRemaining,
    promoDiscount,
    applyPromoCode,
    navigateTo,
  } = useShop();

  const [promoCode, setPromoCode] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const success = applyPromoCode(promoCode);
    if (success) setPromoCode('');
  };

  const shippingPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-secondary">
        <div className="w-20 h-20 bg-[#F0FDF4] border border-[#DDE8DE] rounded-3xl flex items-center justify-center mx-auto text-[#166534] mb-5">
          <ShoppingBag size={38} />
        </div>
        <h2 className="text-2xl font-extrabold text-[#172017] tracking-tight font-primary">Your Cart is Empty</h2>
        <p className="text-sm text-[#647064] mt-2 max-w-md mx-auto font-secondary">
          Explore our collections to discover studio-quality audio, mechanical keyboards, and everyday carry gear.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-6 px-8 py-3.5 bg-[#166534] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2 font-primary"
        >
          <span>Explore Catalog</span>
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 font-secondary">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#DDE8DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172017] tracking-tight font-primary">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-[#647064] mt-0.5 font-secondary">
            Review your selected gear ({cartItemCount} items)
          </p>
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors font-primary"
        >
          <Trash2 size={14} /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 bg-[#FAFCFA] p-6 sm:p-8 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-6">
          {/* Free Shipping Banner */}
          <div className="bg-[#F0FDF4] p-4 rounded-2xl border border-[#DDE8DE]">
            <div className="flex items-center justify-between text-xs mb-2 font-primary">
              <span className="flex items-center gap-1.5 font-medium text-[#172017]">
                <Truck size={16} className="text-[#166534]" />
                {freeShippingRemaining === 0 ? (
                  <strong className="text-[#166534] font-bold">
                    Livraison express offerte activée !
                  </strong>
                ) : (
                  <span>
                    Plus que <strong className="text-[#166534] font-bold">{formatPrice(freeShippingRemaining)}</strong> pour débloquer la livraison OFFERTE
                  </span>
                )}
              </span>
              <span className="font-bold text-[#647064]">{shippingPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#DDE8DE] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  freeShippingRemaining === 0 ? 'bg-[#16A34A]' : 'bg-[#166534]'
                }`}
                style={{ width: `${shippingPercent}%` }}
              />
            </div>
          </div>

          {/* List of items */}
          <div className="divide-y divide-[#DDE8DE]">
            {cart.map((item, idx) => (
              <CartItem
                key={`${item.product.id}-${item.selectedVariant?.id || 'default'}-${idx}`}
                item={item}
              />
            ))}
          </div>

          <div className="pt-4 border-t border-[#DDE8DE]">
            <button
              onClick={() => navigateTo('shop')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#172017] hover:text-[#166534] transition-colors font-primary"
            >
              <ArrowLeft size={14} /> Continue Shopping
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 bg-[#FAFCFA] p-6 sm:p-8 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-6 sticky top-24 font-secondary">
          <h2 className="text-lg font-extrabold text-[#172017] font-primary">Order Summary</h2>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="flex gap-2 font-primary">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#647064]">
                <Tag size={15} />
              </div>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo Code (DSK15)"
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl uppercase font-semibold text-[#172017] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
            >
              Apply
            </button>
          </form>

          {promoDiscount && (
            <div className="flex items-center justify-between px-3 py-2 bg-[#DCFCE7] text-[#166534] rounded-xl text-xs font-semibold border border-[#DCFCE7] font-primary">
              <span>Code: {promoDiscount.code} applied</span>
              <span>-{promoDiscount.percent}%</span>
            </div>
          )}

          {/* Breakdown */}
          <div className="space-y-2.5 text-xs text-[#647064] pt-2 border-t border-[#DDE8DE]">
            <div className="flex justify-between">
              <span>Sous-total articles</span>
              <span className="font-semibold text-[#172017] font-primary">{formatPrice(cartSubtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#166534] font-semibold">
                <span>Remise promotionnelle</span>
                <span className="font-primary">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Frais de livraison</span>
              <span className="font-semibold text-[#172017] font-primary">
                {shippingCost === 0 ? 'OFFERTE' : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-[#172017] pt-3 border-t border-[#DDE8DE] font-primary">
              <span>Total Estimé</span>
              <span className="text-[#166534]">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('checkout')}
            className="w-full py-4 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 font-primary"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-[#647064] font-secondary">
            <ShieldCheck size={15} className="text-[#166534]" />
            <span>Encrypted 256-Bit SSL Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
