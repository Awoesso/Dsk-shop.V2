import React from 'react';
import { CheckCircle2, PackageCheck, Calendar, MapPin, ArrowRight, Printer } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/currency';
import { SEO } from '../../components/SEO/SEO';

export const OrderSuccessPage: React.FC = () => {
  const { lastOrder, navigateTo } = useShop();

  if (!lastOrder) {
    return (
      <div className="max-w-xl 2xl:max-w-2xl mx-auto px-4 py-20 2xl:py-28 text-center font-secondary">
        <SEO title="Commande Non Trouvée | DSK-Shop" noindex={true} />
        <h2 className="text-xl 2xl:text-2xl font-bold text-slate-800 font-primary">Aucune commande récente trouvée</h2>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 px-6 py-2.5 2xl:px-8 2xl:py-3 bg-[#166534] hover:bg-[#16A34A] text-white rounded-xl text-xs 2xl:text-sm font-bold font-primary cursor-pointer transition-colors shadow-xs"
        >
          Retour à l&apos;accueil
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'flooz':
        return 'Moov Money (Flooz)';
      case 'tmoney':
        return 'Mixx by Yas (T-Money)';
      case 'cod':
        return 'Paiement à la livraison';
      case 'credit_card':
        return 'Carte bancaire (Visa / Mastercard)';
      case 'apple_pay':
        return 'Apple Pay';
      case 'paypal':
        return 'PayPal';
      default:
        return method.replace('_', ' ');
    }
  };

  return (
    <div className="max-w-3xl 2xl:max-w-4xl mx-auto px-4 sm:px-6 2xl:px-8 py-10 2xl:py-16 pb-24 2xl:pb-32 font-secondary">
      <SEO
        title={`Commande #${lastOrder.orderNumber} Confirmée | DSK-Shop`}
        description={`Merci pour votre commande #${lastOrder.orderNumber} chez DSK-Shop Lomé.`}
        noindex={true}
      />
      <div className="bg-white rounded-3xl 2xl:rounded-4xl border border-slate-200/80 shadow-sm p-6 sm:p-10 2xl:p-12 space-y-8 2xl:space-y-10">
        {/* Success Header Banner */}
        <div className="text-center space-y-3 2xl:space-y-4 pb-6 2xl:pb-8 border-b border-slate-100">
          <div className="w-16 h-16 2xl:w-20 2xl:h-20 bg-emerald-50 text-emerald-600 rounded-2xl 2xl:rounded-3xl flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 size={36} className="2xl:w-11 2xl:h-11" />
          </div>
          <span className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-emerald-600 font-primary">
            Paiement & Commande Validés
          </span>
          <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight font-primary">
            Merci pour votre commande !
          </h1>
          <p className="text-xs sm:text-sm 2xl:text-base text-slate-500 max-w-md 2xl:max-w-lg mx-auto">
            Nous avons bien enregistré votre achat. Un récapitulatif avec numéro de suivi a été envoyé à{' '}
            <strong className="text-slate-800">{lastOrder.shippingAddress.email}</strong>.
          </p>
        </div>

        {/* Order Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 2xl:gap-6 p-4 2xl:p-6 bg-slate-50 rounded-2xl 2xl:rounded-3xl text-xs 2xl:text-sm border border-slate-100">
          <div>
            <span className="text-slate-400 block font-semibold">Numéro de Commande</span>
            <span className="font-mono font-bold text-slate-900">{lastOrder.orderNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Date d&apos;Achat</span>
            <span className="font-bold text-slate-900">{lastOrder.date}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Délai Estimé</span>
            <span className="font-bold text-emerald-600">{lastOrder.estimatedDelivery}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Mode de Paiement</span>
            <span className="font-bold text-slate-900">
              {getPaymentLabel(lastOrder.paymentMethod)}
            </span>
          </div>
        </div>

        {/* Delivery Details & Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-8">
          <div className="p-5 2xl:p-6 bg-slate-50/70 rounded-2xl 2xl:rounded-3xl border border-slate-100 space-y-2 text-xs 2xl:text-sm">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm 2xl:text-base font-primary">
              <MapPin size={16} className="text-slate-700 2xl:w-5 2xl:h-5" />
              <span>Adresse de Livraison</span>
            </div>
            <p className="font-semibold text-slate-800">{lastOrder.shippingAddress.fullName}</p>
            <p className="text-slate-600">{lastOrder.shippingAddress.addressLine1}</p>
            {lastOrder.shippingAddress.addressLine2 && (
              <p className="text-slate-600">{lastOrder.shippingAddress.addressLine2}</p>
            )}
            <p className="text-slate-600">
              {lastOrder.shippingAddress.city}, {lastOrder.shippingAddress.state}{' '}
              {lastOrder.shippingAddress.postalCode}
            </p>
            <p className="text-slate-600">{lastOrder.shippingAddress.country}</p>
            <p className="text-slate-500 pt-1">Tél : {lastOrder.shippingAddress.phone}</p>
          </div>

          <div className="p-5 2xl:p-6 bg-slate-50/70 rounded-2xl 2xl:rounded-3xl border border-slate-100 space-y-2 text-xs 2xl:text-sm">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm 2xl:text-base font-primary">
              <PackageCheck size={16} className="text-slate-700 2xl:w-5 2xl:h-5" />
              <span>Statut d&apos;Expédition</span>
            </div>
            <p className="text-slate-700 font-medium">
              Commande en cours de préparation dans notre centre logistique à Lomé. Emballage sécurisé renforcé.
            </p>
            <div className="pt-2 flex items-center gap-2 text-emerald-600 font-bold font-primary">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Prêt pour le coursier express</span>
            </div>
          </div>
        </div>

        {/* Itemized Receipt Table */}
        <div className="space-y-3 2xl:space-y-4 pt-2">
          <h3 className="text-sm 2xl:text-base font-bold text-slate-900 font-primary">Articles Commandés</h3>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl 2xl:rounded-3xl p-4 2xl:p-6">
            {lastOrder.items.map((item, idx) => (
              <div key={idx} className="py-3 2xl:py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 2xl:gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 2xl:w-16 2xl:h-16 rounded-xl object-cover bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs 2xl:text-sm font-bold text-slate-900 font-primary">{item.product.name}</h4>
                    <p className="text-[11px] 2xl:text-xs text-slate-400">
                      Qté : {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-xs 2xl:text-sm font-bold text-slate-900 font-primary">
                  {formatPrice((item.product.price + (item.selectedVariant?.priceModifier || 0)) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="p-4 2xl:p-6 bg-slate-50 rounded-2xl 2xl:rounded-3xl space-y-2 2xl:space-y-3 text-xs 2xl:text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span className="font-semibold text-slate-900 font-primary">{formatPrice(lastOrder.subtotal)}</span>
            </div>
            {lastOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Économies Promotionnelles</span>
                <span className="font-primary">-{formatPrice(lastOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Livraison Express Lomé</span>
              <span className="font-semibold text-slate-900 font-primary">
                {lastOrder.shipping === 0 ? 'OFFERTE' : formatPrice(lastOrder.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-sm 2xl:text-base font-black text-slate-900 pt-2 border-t border-slate-200 font-primary">
              <span>Total Payé</span>
              <span className="text-[#166534]">{formatPrice(lastOrder.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 font-primary">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 2xl:px-6 2xl:py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs 2xl:text-sm font-bold rounded-xl 2xl:rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer size={15} className="2xl:w-4 2xl:h-4" /> <span>Imprimer la facture</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto px-6 py-3 2xl:px-8 2xl:py-3.5 bg-[#166534] hover:bg-[#16A34A] text-white text-xs 2xl:text-sm font-bold rounded-xl 2xl:rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Continuer mes achats</span>
            <ArrowRight size={15} className="2xl:w-4 2xl:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
