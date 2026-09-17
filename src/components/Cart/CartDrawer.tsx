import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, Truck, Tag, ShieldCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CartItem } from './CartItem';
import { formatPrice } from '../../utils/currency';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    cartSubtotal,
    discountAmount,
    shippingCost,
    cartTotal,
    cartItemCount,
    freeShippingThreshold,
    freeShippingRemaining,
    promoDiscount,
    applyPromoCode,
    navigateTo,
  } = useShop();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (success) setPromoInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const handleViewFullCart = () => {
    setIsCartOpen(false);
    navigateTo('cart');
  };

  const shippingPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-secondary">
      {/* Dark overlay backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-[#14532D]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAFCFA] shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 border-l border-[#DDE8DE]">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-[#DDE8DE] flex items-center justify-between font-primary bg-[#F0FDF4]/60">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#166534]" />
              <h2 className="text-base font-extrabold text-[#172017]">
                Your Shopping Cart <span className="text-[#647064] font-medium">({cartItemCount})</span>
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#647064] hover:text-[#172017] hover:bg-[#F0FDF4] rounded-xl transition-colors"
              title="Close drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="bg-[#F0FDF4] px-5 py-3 border-b border-[#DDE8DE]">
              <div className="flex items-center justify-between text-xs mb-1.5 font-primary">
                <span className="flex items-center gap-1.5 font-medium text-[#172017]">
                  <Truck size={14} className="text-[#166534]" />
                  {freeShippingRemaining === 0 ? (
                    <strong className="text-[#166534] font-bold">Livraison standard offerte activée !</strong>
                  ) : (
                    <span>
                      Plus que <strong className="text-[#166534] font-bold">{formatPrice(freeShippingRemaining)}</strong> pour la livraison OFFERTE
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-[#647064]">{shippingPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#DDE8DE] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    freeShippingRemaining === 0 ? 'bg-[#16A34A]' : 'bg-[#166534]'
                  }`}
                  style={{ width: `${shippingPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-[#F0FDF4] border border-[#DDE8DE] rounded-2xl flex items-center justify-center text-[#166534] mb-4">
                  <ShoppingBag size={30} />
                </div>
                <h3 className="text-base font-bold text-[#172017] font-primary">Your cart is empty</h3>
                <p className="text-xs text-[#647064] mt-1 max-w-xs font-secondary">
                  Browse our curated collections of precision workspace gear, high-end audio, and accessories.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="mt-5 px-6 py-2.5 bg-[#166534] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs font-primary"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#DDE8DE]">
                {cart.map((item, idx) => (
                  <CartItem
                    key={`${item.product.id}-${item.selectedVariant?.id || 'default'}-${idx}`}
                    item={item}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#DDE8DE] bg-[#F0FDF4] space-y-3 font-secondary">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#647064]">
                    <Tag size={14} />
                  </div>
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Discount code (try DSK15)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAFCFA] border border-[#DDE8DE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 uppercase placeholder:normal-case font-medium text-[#172017]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#166534] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl transition-colors font-primary shadow-2xs"
                >
                  Apply
                </button>
              </form>

              {/* Promo badge if active */}
              {promoDiscount && (
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#DCFCE7] text-[#166534] rounded-lg text-xs font-semibold border border-[#DCFCE7] font-primary">
                  <span>Code: {promoDiscount.code} applied</span>
                  <span>-{promoDiscount.percent}%</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#647064] pt-1">
                <div className="flex justify-between font-secondary">
                  <span>Sous-total</span>
                  <span className="font-semibold text-[#172017] font-primary">{formatPrice(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#166534] font-secondary">
                    <span>Remise Code Promo</span>
                    <span className="font-semibold font-primary">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-secondary">
                  <span>Livraison estimée</span>
                  <span className="font-semibold text-[#172017] font-primary">
                    {shippingCost === 0 ? 'OFFERTE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#172017] pt-2 border-t border-[#DDE8DE] font-primary">
                  <span>Total TTC</span>
                  <span className="text-[#166534]">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 space-y-2 font-primary">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 px-4 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>Checkout Now</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={handleViewFullCart}
                  className="w-full py-2 text-center text-xs font-semibold text-[#647064] hover:text-[#166534] transition-colors"
                >
                  View Full Cart & Summary
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#647064] pt-1 font-secondary">
                <ShieldCheck size={13} className="text-[#166534]" />
                <span>256-Bit SSL Encrypted & Protected Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
