import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Check,
  Smartphone,
  Wallet,
  Tag,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ShippingAddress, PaymentMethod } from '../../types';
import { formatPrice } from '../../utils/currency';
import { SEO } from '../../components/SEO/SEO';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    shippingCost,
    discountAmount,
    cartTotal,
    cartItemCount,
    promoDiscount,
    removePromoCode,
    createOrder,
    navigateTo,
    showToast,
  } = useShop();

  // Form state
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');

  // Credit Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect to cart page
  if (cart.length === 0) {
    return (
      <div className="max-w-xl 2xl:max-w-2xl mx-auto px-4 py-20 2xl:py-32 text-center font-secondary">
        <h2 className="text-xl 2xl:text-2xl font-extrabold text-[#172017] font-primary">Votre panier est vide</h2>
        <p className="text-xs 2xl:text-sm text-[#647064] mt-2 font-secondary">
          Ajoutez des articles avant de finaliser votre commande.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-5 2xl:mt-7 px-6 py-2.5 2xl:py-3.5 bg-[#166534] hover:bg-[#16A34A] text-white rounded-xl text-xs 2xl:text-sm font-bold font-primary transition-colors shadow-2xs cursor-pointer"
        >
          Découvrir le Catalogue
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      showToast('Veuillez entrer votre nom complet', 'warning');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      showToast('Veuillez fournir une adresse e-mail valide', 'warning');
      return;
    }
    if (!formData.addressLine1.trim() || !formData.city.trim()) {
      showToast('Veuillez fournir une adresse de livraison complète', 'warning');
      return;
    }

    if (paymentMethod === 'credit_card') {
      if (cardNumber.replace(/\s/g, '').length < 15) {
        showToast('Veuillez entrer un numéro de carte valide (16 chiffres)', 'warning');
        return;
      }
      if (!cardExpiry.trim() || !cardCvv.trim()) {
        showToast("Veuillez entrer la date d'expiration et le code de sécurité CVV", 'warning');
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      createOrder(formData, paymentMethod);
      setIsSubmitting(false);
    }, 900);
  };

  return (
    <div className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-8 2xl:py-12 pb-24 font-secondary">
      <SEO
        title="Paiement Sécurisé & Livraison | DSK-Shop"
        description="Finalisez votre commande en toute sécurité chez DSK-Shop Lomé. Paiement sécurisé et livraison rapide à domicile."
        noindex={true}
      />
      {/* Checkout Breadcrumb */}
      <div className="flex items-center gap-3 text-xs 2xl:text-sm font-medium text-[#647064] mb-6 2xl:mb-8 font-primary">
        <button
          onClick={() => navigateTo('cart')}
          className="hover:text-[#166534] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Retour au panier
        </button>
        <span>/</span>
        <span className="text-[#166534] font-bold">Paiement Sécurisé</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-12 items-start">
        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-8 2xl:space-y-10">
          <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-8 2xl:space-y-10">
            {/* Step 1: Customer Contact & Shipping */}
            <div className="bg-[#FAFCFA] p-6 sm:p-8 2xl:p-10 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-5 2xl:space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#DDE8DE]">
                <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-full bg-[#166534] text-white font-black text-xs 2xl:text-sm flex items-center justify-center font-primary">
                  1
                </div>
                <div>
                  <h2 className="text-base 2xl:text-lg font-extrabold text-[#172017] font-primary">Coordonnées & Adresse de Livraison</h2>
                  <p className="text-xs 2xl:text-sm text-[#647064] font-secondary">
                    Où devons-nous acheminer votre commande à Lomé ou au Togo ?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-6 font-secondary">
                <div className="sm:col-span-2">
                  <label className="block text-xs 2xl:text-sm font-bold text-[#172017] mb-1 font-primary">
                    Nom et Prénom complets *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="ex. Koffi Mensah"
                    className="w-full px-3.5 py-2.5 2xl:py-3 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs 2xl:text-sm font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs 2xl:text-sm font-bold text-[#172017] mb-1 font-primary">
                    Adresse e-mail (pour confirmation & reçu) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="koffi@example.com"
                    className="w-full px-3.5 py-2.5 2xl:py-3 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs 2xl:text-sm font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs 2xl:text-sm font-bold text-[#172017] mb-1 font-primary">
                    Numéro de téléphone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+228 90 12 34 56"
                    className="w-full px-3.5 py-2.5 2xl:py-3 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs 2xl:text-sm font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs 2xl:text-sm font-bold text-[#172017] mb-1 font-primary">
                    Adresse / Quartier de livraison *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="ex. Boulevard du 13 Janvier, Quartier Dékon"
                    className="w-full px-3.5 py-2.5 2xl:py-3 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs 2xl:text-sm font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs 2xl:text-sm font-bold text-[#172017] mb-1 font-primary">
                    Bâtiment, Repère ou Instructions de livraison (Optionnel)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="ex. En face de la pharmacie, portail noir"
                    className="w-full px-3.5 py-2.5 2xl:py-3 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs 2xl:text-sm font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs 2xl:text-sm font-bold text-[#172017] mb-1 font-primary">Ville *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Lomé"
                    className="w-full px-3.5 py-2.5 2xl:py-3 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs 2xl:text-sm font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs 2xl:text-sm font-bold text-[#172017] mb-1 font-primary">Région *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Maritime"
                      className="w-full px-3.5 py-2.5 2xl:py-3 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs 2xl:text-sm font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs 2xl:text-sm font-bold text-[#172017] mb-1 font-primary">
                      Code Postal / BP
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="00228"
                      className="w-full px-3.5 py-2.5 2xl:py-3 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs 2xl:text-sm font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-[#FAFCFA] p-6 sm:p-8 2xl:p-10 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-5 2xl:space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#DDE8DE]">
                <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-full bg-[#166534] text-white font-black text-xs 2xl:text-sm flex items-center justify-center font-primary">
                  2
                </div>
                <div>
                  <h2 className="text-base 2xl:text-lg font-extrabold text-[#172017] font-primary">Mode de Règlement Sécurisé</h2>
                  <p className="text-xs 2xl:text-sm text-[#647064] font-secondary">
                    Transaction protégée et chiffrée de bout en bout
                  </p>
                </div>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 2xl:gap-4 font-primary">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 2xl:p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'credit_card'
                      ? 'border-[#166534] bg-[#166534] text-white shadow-2xs'
                      : 'border-[#DDE8DE] bg-[#F0FDF4]/50 text-[#172017] hover:bg-[#F0FDF4]'
                  }`}
                >
                  <CreditCard size={18} className="2xl:w-6 2xl:h-6" />
                  <span className="text-xs 2xl:text-sm font-bold">Carte Bancaire</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 2xl:p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#166534] bg-[#166534] text-white shadow-2xs'
                      : 'border-[#DDE8DE] bg-[#F0FDF4]/50 text-[#172017] hover:bg-[#F0FDF4]'
                  }`}
                >
                  <Smartphone size={18} className="2xl:w-6 2xl:h-6" />
                  <span className="text-xs 2xl:text-sm font-bold">Flooz / T-Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 2xl:p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'border-[#166534] bg-[#166534] text-white shadow-2xs'
                      : 'border-[#DDE8DE] bg-[#F0FDF4]/50 text-[#172017] hover:bg-[#F0FDF4]'
                  }`}
                >
                  <Wallet size={18} className="2xl:w-6 2xl:h-6" />
                  <span className="text-xs 2xl:text-sm font-bold">PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 2xl:p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#166534] bg-[#166534] text-white shadow-2xs'
                      : 'border-[#DDE8DE] bg-[#F0FDF4]/50 text-[#172017] hover:bg-[#F0FDF4]'
                  }`}
                >
                  <Truck size={18} className="2xl:w-6 2xl:h-6" />
                  <span className="text-xs 2xl:text-sm font-bold">À la Livraison</span>
                </button>
              </div>

              {/* Card Inputs if credit_card is selected */}
              {paymentMethod === 'credit_card' && (
                <div className="p-4 2xl:p-6 bg-[#F0FDF4] rounded-2xl border border-[#DDE8DE] space-y-4 font-secondary">
                  <div>
                    <label className="block text-xs 2xl:text-sm font-bold text-[#172017] mb-1 font-primary">
                      Numéro de carte (16 Chiffres)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                          setCardNumber(val);
                        }}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3.5 py-2.5 2xl:py-3 bg-[#FAFCFA] border border-[#DDE8DE] rounded-xl text-xs 2xl:text-sm font-mono font-medium text-[#172017] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                      />
                      <CreditCard
                        size={16}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#647064]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs 2xl:text-sm font-bold text-[#172017] mb-1 font-primary">
                        Date d'expiration (MM/AA)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3.5 py-2.5 2xl:py-3 bg-[#FAFCFA] border border-[#DDE8DE] rounded-xl text-xs 2xl:text-sm font-mono font-medium text-[#172017] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs 2xl:text-sm font-bold text-[#172017] mb-1 font-primary">
                        Code de sécurité (CVV)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="789"
                        className="w-full px-3.5 py-2.5 2xl:py-3 bg-[#FAFCFA] border border-[#DDE8DE] rounded-xl text-xs 2xl:text-sm font-mono font-medium text-[#172017] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-4 2xl:p-6 bg-[#F0FDF4] rounded-2xl text-center text-xs 2xl:text-sm text-[#647064] font-secondary border border-[#DDE8DE]">
                  Paiement Mobile Money direct et sécurisé : vous recevrez une invite USSD / confirmation par T-Money ou Moov Flooz.
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-4 2xl:p-6 bg-[#F0FDF4] rounded-2xl text-center text-xs 2xl:text-sm text-[#647064] font-secondary border border-[#DDE8DE]">
                  Vous serez redirigé vers l'interface sécurisée PayPal pour confirmer la transaction.
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 2xl:p-6 bg-[#F0FDF4] rounded-2xl text-center text-xs 2xl:text-sm text-[#647064] font-secondary border border-[#DDE8DE]">
                  Réglez en toute sérénité en espèces ou par Mobile Money lors de la livraison à votre adresse à Lomé.
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 2xl:py-5 px-6 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-sm sm:text-base 2xl:text-lg rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-primary cursor-pointer"
            >
              <Lock size={16} />
              <span>{isSubmitting ? 'Validation du paiement...' : `Confirmer la Commande (${formatPrice(cartTotal)})`}</span>
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        {/* Right Column: Order Items Summary */}
        <div className="lg:col-span-4 bg-[#FAFCFA] p-6 sm:p-8 2xl:p-10 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-5 2xl:space-y-6 sticky top-24 font-secondary">
          <h2 className="text-base 2xl:text-lg font-extrabold text-[#172017] pb-3 border-b border-[#DDE8DE] font-primary">
            Récapitulatif ({cartItemCount} {cartItemCount > 1 ? 'articles' : 'article'})
          </h2>

          {/* Item thumbnail list */}
          <div className="divide-y divide-[#DDE8DE] max-h-72 2xl:max-h-96 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="py-3 2xl:py-4 flex items-center gap-3 2xl:gap-4">
                <div className="w-12 h-12 2xl:w-16 2xl:h-16 rounded-lg bg-[#F0FDF4] border border-[#DDE8DE] overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs 2xl:text-sm font-bold text-[#172017] truncate font-primary">{item.product.name}</p>
                  <p className="text-[11px] 2xl:text-xs text-[#647064]">
                    Qté: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                  </p>
                </div>
                <span className="text-xs 2xl:text-sm font-bold text-[#172017] font-primary">
                  {formatPrice((item.product.price + (item.selectedVariant?.priceModifier || 0)) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 2xl:space-y-3 text-xs 2xl:text-sm text-[#647064] pt-3 border-t border-[#DDE8DE]">
            <div className="flex justify-between">
              <span>Sous-total articles</span>
              <span className="font-semibold text-[#172017] font-primary">{formatPrice(cartSubtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#166534] font-semibold">
                <span>Remise appliquée</span>
                <span className="font-primary">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Livraison</span>
              <span className="font-semibold text-[#172017] font-primary">
                {shippingCost === 0 ? 'OFFERTE' : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-base 2xl:text-lg font-black text-[#172017] pt-3 border-t border-[#DDE8DE] font-primary">
              <span>Total à payer</span>
              <span className="text-[#166534]">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <div className="p-3 2xl:p-4 bg-[#F0FDF4] rounded-xl text-[11px] 2xl:text-xs text-[#647064] space-y-1 border border-[#DDE8DE]">
            <div className="flex items-center gap-1.5 font-semibold text-[#172017] font-primary">
              <ShieldCheck size={14} className="text-[#166534] 2xl:w-4 2xl:h-4" />
              <span>Garantie & Sérénité DSK-Shop</span>
            </div>
            <p>Chaque commande est suivie en temps réel et couverte par notre garantie de satisfaction 30 jours à Lomé.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
