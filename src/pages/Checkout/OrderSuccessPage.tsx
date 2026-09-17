import React from 'react';
import { CheckCircle2, PackageCheck, Calendar, MapPin, ArrowRight, Printer } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/currency';

export const OrderSuccessPage: React.FC = () => {
  const { lastOrder, navigateTo } = useShop();

  if (!lastOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">No recent order found</h2>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-24">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Success Header Banner */}
        <div className="text-center space-y-3 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 size={36} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Payment Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            We've received your request. A confirmation email with live carrier tracking has been dispatched to{' '}
            <strong className="text-slate-800">{lastOrder.shippingAddress.email}</strong>.
          </p>
        </div>

        {/* Order Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl text-xs border border-slate-100">
          <div>
            <span className="text-slate-400 block font-semibold">Order Number</span>
            <span className="font-mono font-bold text-slate-900">{lastOrder.orderNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Date Placed</span>
            <span className="font-bold text-slate-900">{lastOrder.date}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Est. Delivery</span>
            <span className="font-bold text-emerald-600">{lastOrder.estimatedDelivery}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Payment</span>
            <span className="font-bold text-slate-900 capitalize">
              {lastOrder.paymentMethod.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Delivery Details & Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <MapPin size={16} className="text-slate-700" />
              <span>Shipping Destination</span>
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
            <p className="text-slate-500 pt-1">Tel: {lastOrder.shippingAddress.phone}</p>
          </div>

          <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <PackageCheck size={16} className="text-slate-700" />
              <span>Fulfillment Status</span>
            </div>
            <p className="text-slate-700 font-medium">
              Order processing at our fulfillment center. Standard packaging with anti-shock bubble suspension.
            </p>
            <div className="pt-2 flex items-center gap-2 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Ready for courier pickup</span>
            </div>
          </div>
        </div>

        {/* Itemized Receipt Table */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900">Purchased Hardware</h3>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-4">
            {lastOrder.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.product.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 font-primary">
                  {formatPrice((item.product.price + (item.selectedVariant?.priceModifier || 0)) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs text-slate-600">
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
              <span>Livraison Express</span>
              <span className="font-semibold text-slate-900 font-primary">
                {lastOrder.shipping === 0 ? 'OFFERTE' : formatPrice(lastOrder.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200 font-primary">
              <span>Total Payé</span>
              <span className="text-[#166534]">{formatPrice(lastOrder.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer size={15} /> Print Receipt
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
