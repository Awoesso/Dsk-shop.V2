import React from 'react';
import { ShoppingBag, ArrowRight, Trash2, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CartItem } from '../../components/Cart/CartItem';
import { formatPrice } from '../../utils/currency';
import { SEO } from '../../components/SEO/SEO';

export const CartPage: React.FC = () => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    shippingCost,
    cartTotal,
    cartItemCount,
    freeShippingThreshold,
    freeShippingRemaining,
    navigateTo,
  } = useShop();

  const shippingPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 py-16 sm:py-20 2xl:py-32 text-center font-secondary">
        <SEO
          title="Mon Panier d'Achats | DSK-Shop"
          description="Votre panier DSK-Shop est actuellement vide. Parcourez notre catalogue pour découvrir nos nouveautés technologiques et lifestyle."
          noindex={true}
        />
        <div className="w-16 h-16 sm:w-20 sm:h-20 2xl:w-24 2xl:h-24 bg-[#F0FDF4] border border-[#DDE8DE] rounded-3xl flex items-center justify-center mx-auto text-[#166534] mb-5 2xl:mb-8">
          <ShoppingBag size={32} className="sm:w-9 sm:h-9 2xl:w-12 2xl:h-12" />
        </div>
        <h2 className="text-xl sm:text-2xl 2xl:text-3xl font-extrabold text-[#172017] tracking-tight font-primary">Votre Panier est Vide</h2>
        <p className="text-xs sm:text-sm 2xl:text-base text-[#647064] mt-2 max-w-md mx-auto font-secondary">
          Explorez notre catalogue pour découvrir nos équipements audio, claviers mécaniques et accessoires lifestyle à Lomé.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-6 2xl:mt-8 px-6 sm:px-8 py-3 sm:py-3.5 2xl:py-4 bg-[#166534] hover:bg-[#16A34A] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2 font-primary cursor-pointer"
        >
          <span>Découvrir le Catalogue</span>
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-6 sm:py-8 2xl:py-12 pb-20 font-secondary">
      <SEO
        title={`Mon Panier (${cartItemCount} articles) | DSK-Shop`}
        description="Passez votre commande en toute sécurité chez DSK-Shop. Livraison express à Lomé."
        noindex={true}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-[#DDE8DE]">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-4xl font-extrabold text-[#172017] tracking-tight font-primary">
            Mon Panier
          </h1>
          <p className="text-xs sm:text-sm 2xl:text-base text-[#647064] mt-0.5 font-secondary">
            Vérifiez votre sélection d'équipements ({cartItemCount} {cartItemCount > 1 ? 'articles' : 'article'})
          </p>
        </div>

        <button
          onClick={clearCart}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs 2xl:text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors font-primary cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-rose-50"
        >
          <Trash2 size={14} /> Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 2xl:gap-12 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 bg-[#FAFCFA] p-4 sm:p-6 lg:p-8 2xl:p-10 rounded-2xl sm:rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-5 sm:space-y-6 2xl:space-y-8">
          {/* Free Shipping Banner */}
          <div className="bg-[#F0FDF4] p-3.5 sm:p-4 2xl:p-6 rounded-xl sm:rounded-2xl border border-[#DDE8DE]">
            <div className="flex items-center justify-between text-xs 2xl:text-sm mb-2 font-primary gap-2">
              <span className="flex items-center gap-1.5 font-medium text-[#172017]">
                <Truck size={16} className="text-[#166534] shrink-0 2xl:w-5 2xl:h-5" />
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
              <span className="font-bold text-[#647064] shrink-0">{shippingPercent}%</span>
            </div>
            <div className="w-full h-2 2xl:h-2.5 bg-[#DDE8DE] rounded-full overflow-hidden">
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
              className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-bold text-[#172017] hover:text-[#166534] transition-colors font-primary cursor-pointer"
            >
              <ArrowLeft size={14} /> Continuer mes achats
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 bg-[#FAFCFA] p-4 sm:p-6 lg:p-8 2xl:p-10 rounded-2xl sm:rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-4 sm:space-y-6 2xl:space-y-8 lg:sticky lg:top-24 font-secondary">
          <h2 className="text-base sm:text-lg 2xl:text-xl font-extrabold text-[#172017] font-primary">
            Récapitulatif de commande
          </h2>

          {/* Breakdown */}
          <div className="space-y-2.5 2xl:space-y-3.5 text-xs 2xl:text-sm text-[#647064] pt-2 border-t border-[#DDE8DE]">
            <div className="flex justify-between">
              <span>Sous-total articles</span>
              <span className="font-semibold text-[#172017] font-primary">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de livraison</span>
              <span className="font-semibold text-[#172017] font-primary">
                {shippingCost === 0 ? 'OFFERTE' : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base 2xl:text-lg font-black text-[#172017] pt-3 border-t border-[#DDE8DE] font-primary">
              <span>Total Estimé</span>
              <span className="text-[#166534]">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('checkout')}
            className="w-full py-3.5 sm:py-4 2xl:py-4.5 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm 2xl:text-base rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 font-primary cursor-pointer min-h-[44px]"
          >
            <span>Passer la commande ({formatPrice(cartTotal)})</span>
            <ArrowRight size={16} />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs 2xl:text-sm text-[#647064] font-secondary text-center">
            <ShieldCheck size={15} className="text-[#166534] shrink-0" />
            <span>Paiement sécurisé et service garanti à Lomé</span>
          </div>
        </div>
      </div>
    </div>
  );
};
