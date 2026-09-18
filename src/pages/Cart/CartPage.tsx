import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, ArrowLeft, Truck, Tag, ShieldCheck, X } from 'lucide-react';
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
    discountAmount,
    cartTotal,
    cartItemCount,
    freeShippingThreshold,
    freeShippingRemaining,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
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
      <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 py-20 2xl:py-32 text-center font-secondary">
        <SEO
          title="Mon Panier d'Achats | DSK-Shop"
          description="Votre panier DSK-Shop est actuellement vide. Parcourez notre catalogue pour découvrir nos nouveautés technologiques et lifestyle."
          noindex={true}
        />
        <div className="w-20 h-20 2xl:w-24 2xl:h-24 bg-[#F0FDF4] border border-[#DDE8DE] rounded-3xl flex items-center justify-center mx-auto text-[#166534] mb-5 2xl:mb-8">
          <ShoppingBag size={38} className="2xl:w-12 2xl:h-12" />
        </div>
        <h2 className="text-2xl 2xl:text-3xl font-extrabold text-[#172017] tracking-tight font-primary">Votre Panier est Vide</h2>
        <p className="text-sm 2xl:text-base text-[#647064] mt-2 max-w-md mx-auto font-secondary">
          Explorez notre catalogue pour découvrir nos équipements audio, claviers mécaniques et accessoires lifestyle à Lomé.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-6 2xl:mt-8 px-8 py-3.5 2xl:py-4 bg-[#166534] hover:bg-[#16A34A] text-white text-xs 2xl:text-sm font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2 font-primary cursor-pointer"
        >
          <span>Découvrir le Catalogue</span>
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-8 2xl:py-12 pb-20 font-secondary">
      <SEO
        title={`Mon Panier (${cartItemCount} articles) | DSK-Shop`}
        description="Passez votre commande en toute sécurité chez DSK-Shop. Livraison express à Lomé."
        noindex={true}
      />
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#DDE8DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-extrabold text-[#172017] tracking-tight font-primary">
            Mon Panier
          </h1>
          <p className="text-xs sm:text-sm 2xl:text-base text-[#647064] mt-0.5 font-secondary">
            Vérifiez votre sélection d'équipements ({cartItemCount} {cartItemCount > 1 ? 'articles' : 'article'})
          </p>
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs 2xl:text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors font-primary cursor-pointer"
        >
          <Trash2 size={14} /> Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-12 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 bg-[#FAFCFA] p-6 sm:p-8 2xl:p-10 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-6 2xl:space-y-8">
          {/* Free Shipping Banner */}
          <div className="bg-[#F0FDF4] p-4 2xl:p-6 rounded-2xl border border-[#DDE8DE]">
            <div className="flex items-center justify-between text-xs 2xl:text-sm mb-2 font-primary">
              <span className="flex items-center gap-1.5 font-medium text-[#172017]">
                <Truck size={16} className="text-[#166534] 2xl:w-5 2xl:h-5" />
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
        <div className="lg:col-span-4 bg-[#FAFCFA] p-6 sm:p-8 2xl:p-10 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-6 2xl:space-y-8 sticky top-24 font-secondary">
          <h2 className="text-lg 2xl:text-xl font-extrabold text-[#172017] font-primary">Récapitulatif de commande</h2>

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
                placeholder="Code promo (ex: DSK15)"
                className="w-full pl-9 pr-3 py-2 2xl:py-2.5 text-xs 2xl:text-sm bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl uppercase font-semibold text-[#172017] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 2xl:px-5 2xl:py-2.5 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-xs 2xl:text-sm rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              Appliquer
            </button>
          </form>

          {promoDiscount ? (
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#DCFCE7] text-[#166534] rounded-xl text-xs 2xl:text-sm font-semibold border border-[#BBF7D0] font-primary">
              <div className="flex items-center gap-2 truncate mr-2">
                <Tag size={15} className="text-[#166534] shrink-0" />
                <span className="truncate">Code <strong>{promoDiscount.code}</strong> appliqué (-{promoDiscount.percent}%)</span>
              </div>
              <button
                type="button"
                onClick={removePromoCode}
                className="p-1 text-[#166534] hover:text-rose-600 hover:bg-[#BBF7D0] rounded-lg transition-colors cursor-pointer shrink-0"
                title="Retirer ce code promo"
                aria-label="Retirer ce code promo"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#647064]">
              <span>Codes valides :</span>
              <button
                type="button"
                onClick={() => {
                  setPromoCode('DSK15');
                  applyPromoCode('DSK15');
                }}
                className="px-2 py-0.5 bg-[#F0FDF4] border border-[#DDE8DE] rounded-md text-[#166534] font-semibold hover:bg-[#DCFCE7] transition-colors cursor-pointer"
              >
                DSK15 (-15%)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPromoCode('BIENVENUE10');
                  applyPromoCode('BIENVENUE10');
                }}
                className="px-2 py-0.5 bg-[#F0FDF4] border border-[#DDE8DE] rounded-md text-[#166534] font-semibold hover:bg-[#DCFCE7] transition-colors cursor-pointer"
              >
                BIENVENUE10 (-10%)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPromoCode('VIP25');
                  applyPromoCode('VIP25');
                }}
                className="px-2 py-0.5 bg-[#F0FDF4] border border-[#DDE8DE] rounded-md text-[#166534] font-semibold hover:bg-[#DCFCE7] transition-colors cursor-pointer"
              >
                VIP25 (-25%)
              </button>
            </div>
          )}

          {/* Breakdown */}
          <div className="space-y-2.5 2xl:space-y-3.5 text-xs 2xl:text-sm text-[#647064] pt-2 border-t border-[#DDE8DE]">
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
            <div className="flex justify-between text-base 2xl:text-lg font-black text-[#172017] pt-3 border-t border-[#DDE8DE] font-primary">
              <span>Total Estimé</span>
              <span className="text-[#166534]">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('checkout')}
            className="w-full py-4 2xl:py-4.5 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-sm 2xl:text-base rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 font-primary cursor-pointer"
          >
            <span>Passer la commande ({formatPrice(cartTotal)})</span>
            <ArrowRight size={16} />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs 2xl:text-sm text-[#647064] font-secondary">
            <ShieldCheck size={15} className="text-[#166534]" />
            <span>Paiement sécurisé et service garanti à Lomé</span>
          </div>
        </div>
      </div>
    </div>
  );
};
