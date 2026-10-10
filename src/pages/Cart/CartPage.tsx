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
    navigateTo,
  } = useShop();

  /* =========================================================
     STATE: EMPTY CART
  ========================================================= */
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 sm:py-28 text-center font-secondary">
        <SEO
          title="Mon Panier | DSK-Shop"
          description="Votre panier DSK-Shop est actuellement vide. Parcourez notre catalogue pour découvrir nos nouveautés."
          noindex={true}
        />

        <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-400 mb-5">
          <ShoppingBag size={24} strokeWidth={1.5} />
        </div>

        <h2 className="text-lg font-semibold text-bamboo-text-main tracking-tight font-primary">
          Votre panier est vide
        </h2>

        <p className="text-xs text-bamboo-text-muted mt-1.5 leading-relaxed font-secondary">
          Découvrez notre sélection d'équipements audio, claviers mécaniques et accessoires high-tech à Lomé.
        </p>

        <button
          type="button"
          onClick={() => navigateTo('shop')}
          className="mt-6 px-6 py-2.5 bg-bamboo-forest hover:opacity-90 text-white text-xs font-medium rounded-xl transition-all active:scale-[0.98] inline-flex items-center gap-2 font-primary cursor-pointer shadow-xs"
        >
          <span>Explorer la boutique</span>
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  /* =========================================================
     STATE: CART WITH ITEMS
  ========================================================= */
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-secondary">
      <SEO
        title={`Mon Panier (${cartItemCount}) | DSK-Shop`}
        description="Finalisez votre commande chez DSK-Shop. Service garanti et livraison rapide à Lomé."
        noindex={true}
      />

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-bamboo-text-main tracking-tight font-primary">
            Mon Panier
          </h1>
          <p className="text-xs text-bamboo-text-muted mt-0.5">
            {cartItemCount} {cartItemCount > 1 ? 'articles sélectionnés' : 'article sélectionné'}
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-rose-600 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-rose-50/60"
        >
          <Trash2 size={13} />
          <span className="hidden sm:inline">Vider le panier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* LEFT COLUMN: ITEMS & PROGRESS */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">

          {/* BARRE MOBILE RAPIDE */}
          <div className="lg:hidden flex items-center justify-between p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100 font-primary">
            <div>
              <span className="text-[10px] text-gray-400 block font-medium">Total estimé</span>
              <span className="text-sm font-semibold text-bamboo-forest">{formatPrice(cartTotal)}</span>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('checkout')}
              className="px-4 py-2 bg-bamboo-forest hover:opacity-90 text-white text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
            >
              <span>Commander</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* LIVRAISON OFFERTE */}
          <div className="flex items-center gap-2 bg-gray-50/60 p-4 rounded-2xl border border-gray-100/80 text-xs font-medium text-bamboo-forest font-primary">
            <Truck size={15} className="shrink-0" />
            <span>Livraison offerte sur tous les produits</span>
          </div>

          {/* LISTE DES ARTICLES */}
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
            {cart.map((item, idx) => (
              <CartItem
                key={`${item.product.id}-${item.selectedVariant?.id || 'default'}-${idx}`}
                item={item}
              />
            ))}
          </div>

          {/* LIEN RETOUR */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigateTo('shop')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-bamboo-text-main transition-colors font-primary cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Continuer mes achats</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: RÉCAPITULATIF STICKY */}
        <div className="lg:col-span-5 xl:col-span-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold text-bamboo-text-main font-primary tracking-tight">
            Récapitulatif
          </h2>

          {/* BREAKDOWN */}
          <div className="space-y-2.5 text-xs text-gray-500 pt-3 border-t border-gray-200/60 font-secondary">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span className="font-medium text-bamboo-text-main font-primary">{formatPrice(cartSubtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Livraison</span>
              <span className="font-medium text-bamboo-text-main font-primary">
                {shippingCost === 0 ? 'Offerte' : formatPrice(shippingCost)}
              </span>
            </div>

            <div className="flex justify-between text-sm font-semibold text-bamboo-text-main pt-3 border-t border-gray-200/60 font-primary">
              <span>Total TTC</span>
              <span className="text-bamboo-forest">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          {/* BOUTON COMMANDER */}
          <button
            type="button"
            onClick={() => navigateTo('checkout')}
            className="w-full py-3 bg-bamboo-forest hover:opacity-90 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 font-primary cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span>Commander • {formatPrice(cartTotal)}</span>
            <ArrowRight size={14} />
          </button>

          {/* GUARANTEE */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center pt-1">
            <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
            <span>Paiement sécurisé & service garanti à Lomé</span>
          </div>
        </div>

      </div>
    </div>
  );
};