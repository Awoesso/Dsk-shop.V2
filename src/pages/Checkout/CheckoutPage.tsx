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
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ShippingAddress, PaymentMethod } from '../../types';
import { formatPrice } from '../../utils/currency';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    shippingCost,
    discountAmount,
    cartTotal,
    cartItemCount,
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
      <div className="max-w-xl mx-auto px-4 py-20 text-center font-secondary">
        <h2 className="text-xl font-extrabold text-[#172017] font-primary">Your cart is empty</h2>
        <p className="text-xs text-[#647064] mt-2 font-secondary">
          Add items before proceeding through checkout.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-5 px-6 py-2.5 bg-[#166534] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold font-primary transition-colors shadow-2xs"
        >
          Explore Catalog
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
      showToast('Please enter your full name', 'warning');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      showToast('Please provide a valid email address', 'warning');
      return;
    }
    if (!formData.addressLine1.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      showToast('Please provide a complete shipping address', 'warning');
      return;
    }

    if (paymentMethod === 'credit_card') {
      if (cardNumber.replace(/\s/g, '').length < 15) {
        showToast('Please enter a valid card number (16 digits)', 'warning');
        return;
      }
      if (!cardExpiry.trim() || !cardCvv.trim()) {
        showToast('Please enter card expiry and CVV security code', 'warning');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 font-secondary">
      {/* Checkout Breadcrumb */}
      <div className="flex items-center gap-3 text-xs font-medium text-[#647064] mb-6 font-primary">
        <button
          onClick={() => navigateTo('cart')}
          className="hover:text-[#166534] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Cart
        </button>
        <span>/</span>
        <span className="text-[#166534] font-bold">Secure Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-8">
          <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-8">
            {/* Step 1: Customer Contact & Shipping */}
            <div className="bg-[#FAFCFA] p-6 sm:p-8 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-[#DDE8DE]">
                <div className="w-8 h-8 rounded-full bg-[#166534] text-white font-black text-xs flex items-center justify-center font-primary">
                  1
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#172017] font-primary">Shipping & Delivery Details</h2>
                  <p className="text-xs text-[#647064] font-secondary">
                    Where should we send your hardware package?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-secondary">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3.5 py-2.5 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">
                    Email Address (For Tracking) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="elena@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3.5 py-2.5 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="742 Evergreen Terrace"
                    className="w-full px-3.5 py-2.5 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">
                    Apartment, Suite, Unit (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Apt 4B"
                    className="w-full px-3.5 py-2.5 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="San Francisco"
                    className="w-full px-3.5 py-2.5 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="CA"
                      className="w-full px-3.5 py-2.5 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="94107"
                      className="w-full px-3.5 py-2.5 bg-[#F0FDF4] border border-[#DDE8DE] rounded-xl text-xs font-medium text-[#172017] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-[#FAFCFA] p-6 sm:p-8 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-[#DDE8DE]">
                <div className="w-8 h-8 rounded-full bg-[#166534] text-white font-black text-xs flex items-center justify-center font-primary">
                  2
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#172017] font-primary">Payment Authorization</h2>
                  <p className="text-xs text-[#647064] font-secondary">
                    Encrypted through end-to-end tokenized security
                  </p>
                </div>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-primary">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'border-[#166534] bg-[#166534] text-white shadow-2xs'
                      : 'border-[#DDE8DE] bg-[#F0FDF4]/50 text-[#172017] hover:bg-[#F0FDF4]'
                  }`}
                >
                  <CreditCard size={18} />
                  <span className="text-xs font-bold">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#166534] bg-[#166534] text-white shadow-2xs'
                      : 'border-[#DDE8DE] bg-[#F0FDF4]/50 text-[#172017] hover:bg-[#F0FDF4]'
                  }`}
                >
                  <Smartphone size={18} />
                  <span className="text-xs font-bold">Apple / Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-[#166534] bg-[#166534] text-white shadow-2xs'
                      : 'border-[#DDE8DE] bg-[#F0FDF4]/50 text-[#172017] hover:bg-[#F0FDF4]'
                  }`}
                >
                  <Wallet size={18} />
                  <span className="text-xs font-bold">PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#166534] bg-[#166534] text-white shadow-2xs'
                      : 'border-[#DDE8DE] bg-[#F0FDF4]/50 text-[#172017] hover:bg-[#F0FDF4]'
                  }`}
                >
                  <Truck size={18} />
                  <span className="text-xs font-bold">Pay on Delivery</span>
                </button>
              </div>

              {/* Card Inputs if credit_card is selected */}
              {paymentMethod === 'credit_card' && (
                <div className="p-4 bg-[#F0FDF4] rounded-2xl border border-[#DDE8DE] space-y-4 font-secondary">
                  <div>
                    <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">
                      Card Number (16 Digits)
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
                        className="w-full px-3.5 py-2.5 bg-[#FAFCFA] border border-[#DDE8DE] rounded-xl text-xs font-mono font-medium text-[#172017] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                      />
                      <CreditCard
                        size={16}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#647064]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">
                        Expires (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3.5 py-2.5 bg-[#FAFCFA] border border-[#DDE8DE] rounded-xl text-xs font-mono font-medium text-[#172017] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">
                        Security Code (CVV)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="789"
                        className="w-full px-3.5 py-2.5 bg-[#FAFCFA] border border-[#DDE8DE] rounded-xl text-xs font-mono font-medium text-[#172017] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-4 bg-[#F0FDF4] rounded-2xl text-center text-xs text-[#647064] font-secondary border border-[#DDE8DE]">
                  You will complete biometric verification (Touch ID / Face ID) after placing order.
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-4 bg-[#F0FDF4] rounded-2xl text-center text-xs text-[#647064] font-secondary border border-[#DDE8DE]">
                  You will be securely routed to PayPal to approve this transaction.
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-[#F0FDF4] rounded-2xl text-center text-xs text-[#647064] font-secondary border border-[#DDE8DE]">
                  Pay with cash or contactless terminal upon courier delivery at your doorstep.
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-sm sm:text-base rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-primary cursor-pointer"
            >
              <Lock size={16} />
              <span>{isSubmitting ? 'Validation du paiement...' : `Payer et Confirmer la Commande (${formatPrice(cartTotal)})`}</span>
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        {/* Right Column: Order Items Summary */}
        <div className="lg:col-span-4 bg-[#FAFCFA] p-6 sm:p-8 rounded-3xl border border-[#DDE8DE] shadow-2xs space-y-5 sticky top-24 font-secondary">
          <h2 className="text-base font-extrabold text-[#172017] pb-3 border-b border-[#DDE8DE] font-primary">
            Récapitulatif ({cartItemCount} {cartItemCount > 1 ? 'articles' : 'article'})
          </h2>

          {/* Item thumbnail list */}
          <div className="divide-y divide-[#DDE8DE] max-h-72 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#F0FDF4] border border-[#DDE8DE] overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#172017] truncate font-primary">{item.product.name}</p>
                  <p className="text-[11px] text-[#647064]">
                    Qté: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#172017] font-primary">
                  {formatPrice((item.product.price + (item.selectedVariant?.priceModifier || 0)) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 text-xs text-[#647064] pt-3 border-t border-[#DDE8DE]">
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
            <div className="flex justify-between text-base font-black text-[#172017] pt-3 border-t border-[#DDE8DE] font-primary">
              <span>Total à payer</span>
              <span className="text-[#166534]">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <div className="p-3 bg-[#F0FDF4] rounded-xl text-[11px] text-[#647064] space-y-1 border border-[#DDE8DE]">
            <div className="flex items-center gap-1.5 font-semibold text-[#172017] font-primary">
              <ShieldCheck size={14} className="text-[#166534]" />
              <span>Purchase Protection Policy</span>
            </div>
            <p>Every shipment is tracked and backed by our full 30-day money-back guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
