import React from 'react';
import { X, ShoppingBag, ArrowRight, Truck, ShieldCheck, Trash2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CartItem } from './CartItem';
import { formatPrice } from '../../utils/currency';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    cartSubtotal,
    shippingCost,
    cartTotal,
    cartItemCount,
    freeShippingThreshold,
    freeShippingRemaining,
    navigateTo,
  } = useShop();

  if (!isCartOpen) return null;

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
        className="fixed inset-0 bg-bamboo-dark/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md 2xl:max-w-lg bg-bamboo-card shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 border-l border-bamboo-divider">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 2xl:p-6 border-b border-bamboo-divider flex items-center justify-between font-primary bg-bamboo-subtle/60">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-bamboo-forest 2xl:w-6 2xl:h-6" />
              <h2 className="text-base 2xl:text-lg font-extrabold text-bamboo-text-main">
                Mon Panier <span className="text-bamboo-text-muted font-medium">({cartItemCount})</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 p-1 px-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Vider le panier"
                >
                  <Trash2 size={13} />
                  <span>Vider</span>
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-bamboo-text-muted hover:text-bamboo-text-main hover:bg-bamboo-subtle rounded-xl transition-colors cursor-pointer"
                title="Fermer le panier"
              >
                <X size={18} className="2xl:w-5 2xl:h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="bg-bamboo-subtle px-5 py-3 2xl:py-4 border-b border-bamboo-divider">
              <div className="flex items-center justify-between text-xs 2xl:text-sm mb-1.5 font-primary">
                <span className="flex items-center gap-1.5 font-medium text-bamboo-text-main">
                  <Truck size={14} className="text-bamboo-forest 2xl:w-4 2xl:h-4" />
                  {freeShippingRemaining === 0 ? (
                    <strong className="text-bamboo-forest font-bold">Livraison standard offerte activée !</strong>
                  ) : (
                    <span>
                      Plus que <strong className="text-bamboo-forest font-bold">{formatPrice(freeShippingRemaining)}</strong> pour la livraison OFFERTE
                    </span>
                  )}
                </span>
                <span className="text-[11px] 2xl:text-xs font-bold text-bamboo-text-muted">{shippingPercent}%</span>
              </div>
              <div className="w-full h-1.5 2xl:h-2 bg-bamboo-divider rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    freeShippingRemaining === 0 ? 'bg-bamboo-accent' : 'bg-bamboo-forest'
                  }`}
                  style={{ width: `${shippingPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 2xl:p-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 2xl:w-20 2xl:h-20 bg-bamboo-subtle border border-bamboo-divider rounded-2xl flex items-center justify-center text-bamboo-forest mb-4">
                  <ShoppingBag size={30} className="2xl:w-9 2xl:h-9" />
                </div>
                <h3 className="text-base 2xl:text-lg font-bold text-bamboo-text-main font-primary">Votre panier est vide</h3>
                <p className="text-xs 2xl:text-sm text-bamboo-text-muted mt-1 max-w-xs font-secondary">
                  Découvrez notre sélection d'équipements high-tech, audio haute fidélité et accessoires premium à Lomé.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="mt-5 px-6 py-2.5 2xl:py-3 bg-bamboo-forest hover:bg-bamboo-accent text-white text-xs 2xl:text-sm font-bold rounded-xl transition-colors shadow-2xs font-primary cursor-pointer"
                >
                  Commencer mes achats
                </button>
              </div>
            ) : (
              <div className="divide-y divide-bamboo-divider">
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
            <div className="p-4 sm:p-5 2xl:p-6 border-t border-bamboo-divider bg-bamboo-subtle space-y-3 2xl:space-y-4 font-secondary pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
              {/* Price Breakdown */}
              <div className="space-y-1.5 2xl:space-y-2 text-xs 2xl:text-sm text-bamboo-text-muted pt-1">
                <div className="flex justify-between font-secondary">
                  <span>Sous-total</span>
                  <span className="font-semibold text-bamboo-text-main font-primary">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between font-secondary">
                  <span>Livraison</span>
                  <span className="font-semibold text-bamboo-text-main font-primary">
                    {shippingCost === 0 ? 'OFFERTE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm 2xl:text-base font-black text-bamboo-text-main pt-2 border-t border-bamboo-divider font-primary">
                  <span>Total TTC</span>
                  <span className="text-bamboo-forest">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 space-y-2 font-primary">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 2xl:py-3.5 px-4 bg-bamboo-forest hover:bg-bamboo-accent text-white font-bold text-sm 2xl:text-base rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Commander ({formatPrice(cartTotal)})</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={handleViewFullCart}
                  className="w-full py-2 text-center text-xs 2xl:text-sm font-semibold text-bamboo-text-muted hover:text-bamboo-forest transition-colors cursor-pointer"
                >
                  Voir le panier complet
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] 2xl:text-xs text-bamboo-text-muted pt-1 font-secondary">
                <ShieldCheck size={13} className="text-bamboo-forest" />
                <span>Paiement sécurisé et service garanti à Lomé</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
