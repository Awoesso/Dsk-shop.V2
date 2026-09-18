import React, { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones, ArrowRight, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/products';

export const Footer: React.FC = () => {
  const { navigateTo, setFilters, showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Veuillez entrer une adresse email valide.', 'warning');
      return;
    }
    setSubscribed(true);
    showToast('Félicitations ! Vous recevrez nos offres exclusives et réductions à Lomé.', 'success');
  };

  const handleCategoryNav = (catId: string) => {
    setFilters({ category: catId, searchQuery: '' });
    navigateTo('shop', { category: catId });
  };

  return (
    <footer className="bg-[#0c1d12] text-slate-300 pt-12 2xl:pt-16 pb-24 md:pb-12 2xl:pb-16 border-t border-emerald-950/60 font-secondary">
      {/* Trust Badges Strip */}
      <div className="max-w-7xl 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 pb-12 2xl:pb-16 border-b border-emerald-900/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 2xl:gap-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3.5 2xl:gap-4">
            <div className="w-12 h-12 2xl:w-14 2xl:h-14 rounded-2xl bg-white/5 border border-white/10 text-[#16A34A] flex items-center justify-center flex-shrink-0">
              <Truck size={22} className="text-[#16A34A] 2xl:w-6 2xl:h-6" />
            </div>
            <div>
              <h4 className="text-sm 2xl:text-base font-bold text-white font-primary">Livraison Express Lomé</h4>
              <p className="text-xs 2xl:text-sm text-slate-400 mt-0.5">Offerte dès 60 000 FCFA d'achat</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 2xl:gap-4">
            <div className="w-12 h-12 2xl:w-14 2xl:h-14 rounded-2xl bg-white/5 border border-white/10 text-[#16A34A] flex items-center justify-center flex-shrink-0">
              <RotateCcw size={22} className="text-[#16A34A] 2xl:w-6 2xl:h-6" />
            </div>
            <div>
              <h4 className="text-sm 2xl:text-base font-bold text-white font-primary">Retours Sous 30 Jours</h4>
              <p className="text-xs 2xl:text-sm text-slate-400 mt-0.5">Échange ou remboursement simple</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 2xl:gap-4">
            <div className="w-12 h-12 2xl:w-14 2xl:h-14 rounded-2xl bg-white/5 border border-white/10 text-[#16A34A] flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={22} className="text-[#16A34A] 2xl:w-6 2xl:h-6" />
            </div>
            <div>
              <h4 className="text-sm 2xl:text-base font-bold text-white font-primary">Garantie 2 Ans DSK</h4>
              <p className="text-xs 2xl:text-sm text-slate-400 mt-0.5">Remplacement direct du matériel</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 2xl:gap-4">
            <div className="w-12 h-12 2xl:w-14 2xl:h-14 rounded-2xl bg-white/5 border border-white/10 text-[#16A34A] flex items-center justify-center flex-shrink-0">
              <Headphones size={22} className="text-[#16A34A] 2xl:w-6 2xl:h-6" />
            </div>
            <div>
              <h4 className="text-sm 2xl:text-base font-bold text-white font-primary">Support Client Dédié</h4>
              <p className="text-xs 2xl:text-sm text-slate-400 mt-0.5">Conseillers à votre écoute à Lomé</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 2xl:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 2xl:gap-16">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4 2xl:space-y-6">
            <div className="flex items-center gap-2.5 font-primary">
              <div className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-extrabold tracking-tight">
                <span>DSK</span>
              </div>
              <span className="text-xl 2xl:text-2xl font-extrabold tracking-tight text-white">
                DSK<span className="text-emerald-400 font-medium">SHOP</span>
              </span>
            </div>
            <p className="text-xs 2xl:text-sm text-slate-400 leading-relaxed max-w-sm 2xl:max-w-md">
              DSK-Shop propose une sélection soignée d&apos;équipements high-tech, d&apos;accessoires audio haut de gamme, d&apos;outils informatiques et d&apos;objets du quotidien à Lomé, Togo.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-slate-300 mb-2 font-primary">
                Rejoignez le Club Privilège DSK
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs 2xl:text-sm font-semibold text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40 font-primary">
                  <Check size={16} /> Merci pour votre inscription ! Consultez votre boîte mail.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md font-primary">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre email..."
                    className="flex-1 px-3.5 py-2.5 2xl:py-3 bg-white/5 text-white placeholder:text-slate-500 text-xs 2xl:text-sm rounded-xl border border-white/10 focus:outline-none focus:border-[#16A34A] transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 2xl:px-6 2xl:py-3 bg-[#16A34A] hover:bg-emerald-500 text-white font-bold text-xs 2xl:text-sm rounded-xl transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>S&apos;inscrire</span>
                    <ArrowRight size={13} className="2xl:w-4 2xl:h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-white mb-4 font-primary">
              Rayons & Collections
            </h4>
            <ul className="space-y-2.5 text-xs 2xl:text-sm text-slate-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryNav(cat.id)}
                    className="hover:text-[#16A34A] transition-colors cursor-pointer text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-white mb-4 font-primary">
              Service Client
            </h4>
            <ul className="space-y-2.5 text-xs 2xl:text-sm text-slate-400">
              <li>
                <button onClick={() => navigateTo('cart')} className="hover:text-[#16A34A] transition-colors cursor-pointer text-left">
                  Suivi de Commande & Panier
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Garantie & Service Après-Vente
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Retours & Modalités d'Échange
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Assistance WhatsApp & Téléphone
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-white mb-4 font-primary">
              À Propos de DSK
            </h4>
            <ul className="space-y-2.5 text-xs 2xl:text-sm text-slate-400">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Notre Histoire & Vision
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Standards & Sélection Qualité
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Engagement Éco-responsable
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Boutique & Showroom Lomé
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 2xl:pt-10 mt-8 2xl:mt-10 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs 2xl:text-sm text-slate-500">
          <p>© {new Date().getFullYear()} DSK-Shop Lomé, Togo. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Politique de Confidentialité</span>
            <span className="hover:text-slate-400 cursor-pointer">Conditions Générales de Vente</span>
            <span className="hover:text-slate-400 cursor-pointer">Paiements Sécurisés</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
