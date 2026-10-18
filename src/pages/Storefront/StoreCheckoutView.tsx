import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../router/RouterContext';
import { useStoreCart } from '../../hooks/useStoreCart';
import { StoreHeader } from '../../components/storefront/StoreHeader';
import { SEO } from '../../components/SEO/SEO';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, AlertCircle } from 'lucide-react';
import { OrdersService } from '../../services/orders.service';

export const StoreCheckoutView: React.FC = () => {
  const { identity, slug, storeId } = useStore();
  const { navigate } = useRouter();
  const { cart, cartTotal, clearCart } = useStoreCart(storeId);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Lomé');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'flooz' | 'tmoney'>('cash_on_delivery');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setError('Veuillez renseigner votre nom, téléphone et adresse de livraison.');
      return;
    }

    if (cart.length === 0) {
      setError('Votre panier est vide.');
      return;
    }

    // Verify all items in cart belong to this storeId
    const storeItems = cart.filter(
      (item) => (item.store_id || item.product.store_id) === storeId
    );

    if (storeItems.length === 0) {
      setError('Aucun article de cette boutique trouvé dans le panier.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        store_id: storeId,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        shipping_address: shippingAddress.trim(),
        city: city.trim(),
        total_amount: cartTotal,
        currency: identity.currency || 'FCFA',
        payment_method: paymentMethod,
        notes: notes.trim() || null,
        items: storeItems.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
          store_id: storeId,
        })),
      };

      const res = await OrdersService.createOrder(orderPayload as any);
      if (res.success && res.orderNumber) {
        setOrderSuccess(res.orderNumber);
        clearCart();
      } else {
        setError(res.error || 'Erreur lors de la validation de la commande.');
      }
    } catch (err: any) {
      setError(err?.message || 'Une erreur inattendue est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans">
        <StoreHeader />
        <main className="max-w-md mx-auto my-16 px-4 flex-1 w-full text-center space-y-6">
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-xl shadow-emerald-50 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
              Commande confirmée
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">Merci pour votre achat !</h1>
            <p className="text-xs text-slate-600">
              Votre commande numéro <strong className="text-slate-900 font-mono">{orderSuccess}</strong> a bien été transmise à <strong className="text-slate-900">{identity.name}</strong>.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 text-left space-y-1">
              <div>📍 Livraison à : {shippingAddress}, {city}</div>
              <div>📞 Contact : {customerPhone}</div>
              <div>💰 Montant : {cartTotal.toLocaleString('fr-FR')} {identity.currency || 'FCFA'}</div>
            </div>
            <button
              onClick={() => navigate(`/boutique/${slug}`)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Retour à la boutique
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans">
      <SEO
        title={`Finaliser la commande | ${identity.name}`}
        description={`Tunnel de commande sécurisé pour vos achats chez ${identity.name}.`}
      />

      <StoreHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-8">
        <button
          onClick={() => navigate(`/boutique/${slug}/panier`)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Retour au panier</span>
        </button>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Tunnel de commande
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Finalisez votre commande chez {identity.name}
          </h1>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Customer & Shipping info */}
          <div className="md:col-span-2 space-y-6 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              1. Informations de livraison
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Koffi Mensah"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Téléphone (WhatsApp / Appel) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: +228 90 00 00 00"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse précise ou quartier *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Tokoin Habitat, près de la pharmacie"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instructions de livraison (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Appeler à l'arrivée"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <h2 className="text-base font-bold text-slate-900 border-t border-slate-100 pt-6 pb-2">
              2. Moyen de paiement
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 ring-2 ring-slate-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="sr-only"
                />
                <span>Paiement à la livraison</span>
                <span className="text-[10px] text-slate-500 font-normal mt-1">Espèces à Lomé</span>
              </label>

              <label
                className={`p-3.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'tmoney'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 ring-2 ring-slate-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'tmoney'}
                  onChange={() => setPaymentMethod('tmoney')}
                  className="sr-only"
                />
                <span>T-Money (Togocom)</span>
                <span className="text-[10px] text-slate-500 font-normal mt-1">Transfert direct</span>
              </label>

              <label
                className={`p-3.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'flooz'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 ring-2 ring-slate-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'flooz'}
                  onChange={() => setPaymentMethod('flooz')}
                  className="sr-only"
                />
                <span>Flooz (Moov Togo)</span>
                <span className="text-[10px] text-slate-500 font-normal mt-1">Mobile Money</span>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Articles ({cart.length})</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-xs py-1 border-b border-slate-50">
                    <span className="truncate max-w-[140px] text-slate-700">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-bold text-slate-900 shrink-0">
                      {(item.product.price * item.quantity).toLocaleString('fr-FR')} {identity.currency || 'FCFA'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Livraison :</span>
                  <span className="text-emerald-600 font-bold">Gratuite</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total :</span>
                  <span>{cartTotal.toLocaleString('fr-FR')} {identity.currency || 'FCFA'}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-lg shadow-slate-900/10"
              >
                {isSubmitting ? 'Traitement en cours...' : 'Confirmer et commander'}
              </button>
            </div>

            <div className="p-4 bg-slate-100/70 rounded-2xl text-[11px] text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Sécurité Nexa Multi-Vendeurs</span>
              </div>
              <p>Cette commande est directement enregistrée pour le vendeur de cette boutique.</p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
