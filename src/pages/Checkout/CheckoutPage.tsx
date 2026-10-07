import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  Lock,
  Package,
  ChevronDown,
  ShoppingBag,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatPrice, toFCFA } from '../../utils/currency';
import { SEO } from '../../components/SEO/SEO';
import { ProductImage } from '../../components/Common/ProductImage';
import { OrdersService } from '../../services/orders.service';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    shippingCost,
    cartTotal,
    cartItemCount,
    createOrder,
    navigateTo,
    showToast,
  } = useShop();

  // ONLY 3 required fields: Full Name, Phone, Delivery Address
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // If cart is empty, show empty state with catalog redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center font-secondary">
        <div className="w-16 h-16 rounded-2xl bg-bamboo-subtle text-bamboo-forest flex items-center justify-center mx-auto mb-4 border border-bamboo-divider">
          <Package size={32} />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-bamboo-text-main font-primary">
          Votre panier est vide
        </h2>
        <p className="text-xs sm:text-sm text-bamboo-text-muted mt-2 font-secondary">
          Ajoutez des articles à votre panier avant de passer commande.
        </p>
        <button
          id="checkout-empty-browse-btn"
          onClick={() => navigateTo('shop')}
          className="mt-6 px-6 py-3 bg-bamboo-forest hover:bg-bamboo-accent text-white rounded-xl text-xs sm:text-sm font-bold font-primary transition-colors shadow-xs cursor-pointer"
        >
          Découvrir le Catalogue
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict validation for the 3 required fields
    if (!formData.fullName.trim()) {
      showToast('Veuillez entrer votre nom complet', 'warning');
      return;
    }
    if (!formData.phone.trim()) {
      showToast('Veuillez entrer votre numéro de téléphone (T-Money / Moov)', 'warning');
      return;
    }
    if (!formData.address.trim()) {
      showToast('Veuillez indiquer votre quartier ou adresse de livraison à Lomé', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Persist order atomically directly to Supabase via OrdersService
      const result = await OrdersService.createOrder({
        customer_name: formData.fullName.trim(),
        customer_phone: formData.phone.trim(),
        shipping_address: formData.address.trim(),
        city: 'Lomé',
        currency: 'XOF',
        total_amount: toFCFA(cartTotal),
        payment_method: 'cash_on_delivery',
        payment_status: 'pending',
        order_status: 'pending',
        items: cart.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          unit_price: toFCFA(item.product.price + (item.selectedVariant?.priceModifier || 0)),
          quantity: item.quantity,
          selected_variant: item.selectedVariant ? item.selectedVariant.name : null,
        })),
      });

      if (!result.success && result.error) {
        showToast(result.error, 'warning');
        setIsSubmitting(false);
        return;
      }

      // 2. Clear cart state and record order in ShopContext, which redirects to /order-success
      createOrder(
        {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          addressLine1: formData.address.trim(),
          city: 'Lomé',
          country: 'Togo',
        },
        'cod',
        result.orderNumber
      );
    } catch {
      showToast('Une erreur est survenue lors de la création de la commande.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-5 sm:py-8 2xl:py-12 pb-28 sm:pb-16 font-secondary">
      <SEO
        title="Validation de Commande Rapide | DSK-Shop"
        description="Commandez en 3 clics chez DSK-Shop Lomé. Aucun e-mail requis, paiement à la livraison à domicile."
        noindex={true}
      />

      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs 2xl:text-sm font-medium text-outline mb-3 sm:mb-6 font-primary">
        <button
          id="checkout-back-to-cart-btn"
          onClick={() => navigateTo('cart')}
          className="hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Retour au panier
        </button>
        <span>/</span>
        <span className="text-primary font-bold">Commande Rapide</span>
      </div>

      {/* Mobile Collapsible Order Summary Accordion (Visible on small screens) */}
      <div className="lg:hidden bg-white rounded-2xl border border-surface-variant shadow-xs overflow-hidden mb-4 sm:mb-6">
        <button
          type="button"
          onClick={() => setShowMobileSummary(!showMobileSummary)}
          className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left font-primary bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
          aria-expanded={showMobileSummary}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-on-surface">
            <ShoppingBag size={16} className="text-primary" />
            <span>{showMobileSummary ? 'Masquer le récapitulatif' : 'Voir le récapitulatif'}</span>
            <span className="text-outline font-normal">({cartItemCount})</span>
            <ChevronDown
              size={14}
              className={`text-outline transition-transform duration-200 ${
                showMobileSummary ? 'rotate-180 text-primary' : ''
              }`}
            />
          </div>
          <span className="text-sm sm:text-base font-black text-primary">
            {formatPrice(cartTotal)}
          </span>
        </button>

        {showMobileSummary && (
          <div className="p-4 border-t border-surface-variant space-y-3 font-secondary animate-in fade-in duration-150">
            <div className="divide-y divide-surface-variant max-h-56 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-surface border border-surface-variant overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <ProductImage
                      src={item.product.images?.[0] || item.product.primaryImage || ''}
                      alt={item.product.name}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate font-primary">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-outline">
                      Qté : {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-on-surface font-primary shrink-0">
                    {formatPrice((item.product.price + (item.selectedVariant?.priceModifier || 0)) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs text-on-surface-variant pt-2 border-t border-surface-variant">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-semibold text-on-surface font-primary">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="font-semibold text-primary font-primary">
                  {shippingCost === 0 ? 'OFFERTE' : formatPrice(shippingCost)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 2xl:gap-12 items-start">
        {/* Left Column: 3-Field Checkout Form */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-6 sm:space-y-8">
            {/* Customer Details Box */}
            <div className="bg-white p-5 sm:p-7 lg:p-9 rounded-2xl sm:rounded-3xl border border-surface-variant shadow-xs space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-surface-variant">
                <div>
                  <h1 className="text-base sm:text-lg 2xl:text-xl font-extrabold text-on-surface font-primary">
                    Coordonnées de Livraison
                  </h1>
                  <p className="text-xs text-outline font-secondary mt-0.5">
                    Remplissez ces 3 informations pour recevoir votre colis à Lomé sans créer de compte.
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-fixed text-primary border border-surface-variant">
                  <CheckCircle2 size={13} className="text-primary" />
                  0 E-mail Requis
                </span>
              </div>

              <div className="space-y-4 sm:space-y-5 font-secondary">
                {/* 1. Full Name */}
                <div>
                  <label
                    htmlFor="customer_name"
                    className="block text-xs sm:text-sm font-bold text-on-surface mb-1.5 font-primary"
                  >
                    1. Nom et Prénom complets <span className="text-primary font-black">*</span>
                  </label>
                  <input
                    id="customer_name"
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="ex. Koffi Mensah"
                    className="w-full px-4 py-3 bg-surface hover:bg-white border border-surface-variant rounded-xl text-base sm:text-sm font-medium text-on-surface focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                  />
                </div>

                {/* 2. Phone Number */}
                <div>
                  <label
                    htmlFor="customer_phone"
                    className="block text-xs sm:text-sm font-bold text-on-surface mb-1.5 font-primary"
                  >
                    2. Numéro de Téléphone (T-Money / Moov Flooz / Appel) <span className="text-primary font-black">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customer_phone"
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+228 90 12 34 56 ou 70 12 34 56"
                      className="w-full pl-10 pr-4 py-3 bg-surface hover:bg-white border border-surface-variant rounded-xl text-base sm:text-sm font-medium text-on-surface focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                    />
                    <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  </div>
                  <p className="text-[11px] text-outline mt-1 font-secondary">
                    Le livreur vous contactera par appel ou WhatsApp dès son arrivée.
                  </p>
                </div>

                {/* 3. Delivery Address / District in Lomé */}
                <div>
                  <label
                    htmlFor="shipping_address"
                    className="block text-xs sm:text-sm font-bold text-on-surface mb-1.5 font-primary"
                  >
                    3. Quartier / Adresse de livraison à Lomé <span className="text-primary font-black">*</span>
                  </label>
                  <input
                    id="shipping_address"
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="ex. Tokoin Casablanca, face pharmacie ou Bè Klikamé"
                    className="w-full px-4 py-3 bg-surface hover:bg-white border border-surface-variant rounded-xl text-base sm:text-sm font-medium text-on-surface focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Notice: Cash on Delivery */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-surface-variant shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0 border border-surface-variant">
                <Truck size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-on-surface font-primary">
                    Paiement à la Livraison (Cash on Delivery)
                  </h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary-fixed text-primary">
                    Sécurisé
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 font-secondary leading-relaxed">
                  Réglez votre commande en toute sérénité en espèces ou par Mobile Money (T-Money / Moov Flooz) directement lors de la réception de votre colis.
                </p>
              </div>
            </div>

            {/* Submit Order Action Button */}
            <button
              id="checkout-submit-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-primary hover:bg-primary-container active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 font-primary cursor-pointer min-h-[52px]"
            >
              <Lock size={16} />
              <span>
                {isSubmitting
                  ? 'Enregistrement de votre commande...'
                  : `Confirmer la Commande (${formatPrice(cartTotal)})`}
              </span>
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        {/* Right Column: Order Items & Pricing Summary */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-surface-variant shadow-xs space-y-5 lg:sticky lg:top-24 font-secondary">
          <div className="flex items-center justify-between pb-3 border-b border-surface-variant font-primary">
            <h2 className="text-sm sm:text-base font-extrabold text-on-surface">
              Récapitulatif de Commande
            </h2>
            <span className="text-xs font-semibold text-outline">
              {cartItemCount} {cartItemCount > 1 ? 'articles' : 'article'}
            </span>
          </div>

          {/* Item thumbnail list */}
          <div className="divide-y divide-surface-variant max-h-64 sm:max-h-80 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface border border-surface-variant overflow-hidden shrink-0 flex items-center justify-center">
                  <ProductImage
                    src={item.product.images?.[0] || item.product.primaryImage || ''}
                    alt={item.product.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate font-primary">
                    {item.product.name}
                  </p>
                  <p className="text-[11px] text-outline">
                    Qté: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                  </p>
                </div>
                <span className="text-xs font-bold text-on-surface font-primary shrink-0">
                  {formatPrice((item.product.price + (item.selectedVariant?.priceModifier || 0)) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2.5 text-xs sm:text-sm text-on-surface-variant pt-3 border-t border-surface-variant">
            <div className="flex justify-between">
              <span>Sous-total articles</span>
              <span className="font-semibold text-on-surface font-primary">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison à Lomé</span>
              <span className="font-semibold text-primary font-primary">
                {shippingCost === 0 ? 'OFFERTE' : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-on-surface pt-3 border-t border-surface-variant font-primary">
              <span>Total à payer</span>
              <span className="text-primary">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="p-3.5 bg-surface rounded-xl text-xs text-outline space-y-1 border border-surface-variant">
            <div className="flex items-center gap-1.5 font-semibold text-on-surface font-primary">
              <ShieldCheck size={14} className="text-primary shrink-0" />
              <span>Garantie Qualité DSK-Shop</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Vérifiez vos articles avant de payer au livreur. Service client disponible à Lomé 7j/7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
