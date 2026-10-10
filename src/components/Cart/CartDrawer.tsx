import React from 'react';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Trash2 } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-secondary">
      {/* Backdrop sombre épuré avec flou doux */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-6">
        <div className="w-screen max-w-md 2xl:max-w-lg bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-100">
          
          {/* Header minimaliste */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm 2xl:text-base font-semibold tracking-tight text-gray-900 font-primary">
                Panier
              </h2>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                {cartItemCount}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-rose-600 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Vider le panier"
                >
                  <Trash2 size={13} />
                  <span>Vider</span>
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
                title="Fermer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Liste des articles */}
          <div className="flex-1 overflow-y-auto px-6 py-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
                  <ShoppingBag size={20} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 font-primary">
                  Votre panier est vide
                </h3>
                <p className="text-xs text-gray-400 mt-1 max-w-[240px] leading-relaxed">
                  Découvrez nos équipements audio et produits high-tech premium.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="mt-6 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-full transition-all active:scale-[0.98] cursor-pointer"
                >
                  Explorer la boutique
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cart.map((item, idx) => (
                  <CartItem
                    key={`${item.product.id}-${item.selectedVariant?.id || 'default'}-${idx}`}
                    item={item}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer & Actions */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white space-y-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
              
              {/* Détails du montant */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-medium text-gray-900">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span className="font-medium text-gray-900">
                    {shippingCost === 0 ? 'Gratuit' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* CTAs minimalistes */}
              <div className="space-y-2 pt-1 font-primary">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 px-4 bg-bamboo-forest hover:opacity-90 text-white font-medium text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span>Commander • {formatPrice(cartTotal)}</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={handleViewFullCart}
                  className="w-full py-2 text-center text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Voir le détail du panier
                </button>
              </div>

              {/* Garanties discretes */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 pt-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>Paiement sécurisé et livraison garantie à Lomé</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};