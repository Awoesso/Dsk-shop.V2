import React, { useState } from 'react';
import { User, Package, Heart, MapPin, Shield, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SEO } from '../../components/SEO/SEO';
import { formatPrice } from '../../utils/currency';

export const AccountPage: React.FC = () => {
  const { navigateTo, lastOrder, wishlist, setFilters } = useShop();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  return (
    <div className="max-w-[1200px] mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-12 pb-28 sm:pb-16 font-secondary">
      <SEO
        title="Mon Compte | DSK-Shop Lomé"
        description="Gérez vos commandes, vos informations de livraison et vos favoris sur DSK-Shop Lomé."
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Mon Compte', url: '/account' },
        ]}
      />

      <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-white rounded-2xl border border-[#DDE8DE] p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-slate-100">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center font-bold text-base sm:text-lg font-primary shrink-0">
              <User size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[#172017] font-primary truncate">Client DSK-Shop</h2>
              <p className="text-xs text-[#647064]">Lomé, Togo</p>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-1 gap-1.5 sm:space-y-1 font-primary text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center justify-center md:justify-start gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-semibold transition-colors cursor-pointer text-center md:text-left min-h-[42px] ${
                activeTab === 'profile'
                  ? 'bg-[#166534] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-[#F0FDF4] hover:text-[#166534] bg-slate-50 md:bg-transparent'
              }`}
            >
              <User size={15} />
              <span className="truncate">Profil</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-center md:justify-start gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-semibold transition-colors cursor-pointer text-center md:text-left min-h-[42px] ${
                activeTab === 'orders'
                  ? 'bg-[#166534] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-[#F0FDF4] hover:text-[#166534] bg-slate-50 md:bg-transparent'
              }`}
            >
              <Package size={15} />
              <span className="truncate">Commandes</span>
              {lastOrder && (
                <span className="hidden md:inline-block ml-auto w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
            <button
              onClick={() => navigateTo('wishlist')}
              className="flex items-center justify-center md:justify-between gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-[#F0FDF4] hover:text-[#166534] transition-colors cursor-pointer text-center md:text-left min-h-[42px] bg-slate-50 md:bg-transparent"
            >
              <div className="flex items-center gap-1.5 sm:gap-2.5 truncate">
                <Heart size={15} />
                <span className="truncate">Favoris</span>
              </div>
              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] font-bold">
                {wishlist.length}
              </span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-[#DDE8DE] p-4 sm:p-6 md:p-8 shadow-2xs">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-[#172017] font-primary">
                  Mon Profil & Préférences
                </h1>
                <p className="text-xs text-[#647064] mt-1">
                  Vos informations de commande et zone de livraison à Lomé.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                    <MapPin size={14} className="text-[#166534]" /> Zone de livraison
                  </span>
                  <p className="text-sm font-bold text-[#172017]">Lomé et périphérie (Togo)</p>
                  <p className="text-xs text-slate-500">Expédition rapide à domicile ou bureau</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                    <Shield size={14} className="text-[#166534]" /> Sécurité & Garantie
                  </span>
                  <p className="text-sm font-bold text-[#172017]">Garantie DSK-Shop active</p>
                  <p className="text-xs text-slate-500">Produits testés et vérifiés avant départ</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  Besoin d&apos;aide sur une commande ou un article ?
                </p>
                <button
                  onClick={() => navigateTo('contact')}
                  className="px-4 py-2 bg-[#166534] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer font-primary"
                >
                  Contacter le support client
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-[#172017] font-primary">
                  Historique de vos Commandes
                </h1>
                <p className="text-xs text-[#647064] mt-1">
                  Suivez en direct l&apos;état de vos commandes passées sur DSK-Shop.
                </p>
              </div>

              {lastOrder ? (
                <div className="p-5 rounded-xl border border-emerald-200 bg-[#F0FDF4] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                    <div>
                      <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800 font-primary">
                        Dernière Commande
                      </span>
                      <p className="text-sm font-extrabold text-[#172017] font-mono">
                        {lastOrder.orderNumber}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#166534]">
                      <CheckCircle2 size={13} /> {lastOrder.status === 'confirmed' ? 'Confirmée' : lastOrder.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {lastOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="font-bold text-[#166534]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs sm:text-sm font-bold text-[#172017]">
                    <span>Total payé</span>
                    <span className="text-base text-[#166534]">
                      {formatPrice(lastOrder.total)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <Clock size={36} className="mx-auto text-slate-300" />
                  <h3 className="text-base font-bold text-[#172017] font-primary">
                    Aucune commande récente
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Vous n&apos;avez pas encore validé de commande. Découvrez notre catalogue pour faire votre premier achat !
                  </p>
                  <button
                    onClick={() => {
                      setFilters({ category: 'all' });
                      navigateTo('shop');
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#166534] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer font-primary"
                  >
                    <span>Explorer la boutique</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
