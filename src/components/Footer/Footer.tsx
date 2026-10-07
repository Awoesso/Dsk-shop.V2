import React, { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones, ArrowRight, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../constants/categories';
import { getCategoryProductCounts, filterActiveCategories } from '../../utils/categoryUtils';

export const Footer: React.FC = () => {
  const { navigateTo, setFilters, showToast, products } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Dynamic active categories with >0 products
  const activeCategories = React.useMemo(() => {
    const counts = getCategoryProductCounts(products);
    return filterActiveCategories(CATEGORIES, counts);
  }, [products]);

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
    <footer className="bg-bamboo-darkest text-slate-300 pt-12 2xl:pt-16 pb-28 md:pb-12 2xl:pb-16 border-t border-emerald-950/60 font-secondary">
      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 2xl:gap-14">
          {/* Brand Col: DSK Shop */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 font-primary">
              <div className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-xl bg-bamboo-accent text-white flex items-center justify-center font-extrabold tracking-tight">
                <span>DSK</span>
              </div>
              <span className="text-xl 2xl:text-2xl font-extrabold tracking-tight text-white">
                DSK <span className="text-emerald-400 font-medium">SHOP</span>
              </span>
            </div>
            <p className="text-xs 2xl:text-sm text-slate-400 leading-relaxed max-w-sm 2xl:max-w-md">
              DSK-Shop · L&apos;essentiel du quotidien livré rapidement à Lomé, Togo. Des produits testés, garantis avec paiement sécurisé.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-slate-300 mb-2 font-primary">
                Restez informé des nouveautés
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs 2xl:text-sm font-semibold text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40 font-primary">
                  <Check size={16} /> Inscription confirmée ! Merci pour votre confiance.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md font-primary">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email..."
                    className="flex-1 min-w-0 px-3.5 py-2.5 2xl:py-3 bg-white/5 text-white placeholder:text-slate-500 text-base sm:text-xs 2xl:text-sm rounded-xl border border-white/10 focus:outline-none focus:border-bamboo-accent transition-colors min-h-[44px]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 2xl:px-6 2xl:py-3 bg-bamboo-accent hover:bg-emerald-500 text-white font-bold text-xs 2xl:text-sm rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer min-h-[44px]"
                  >
                    <span>S&apos;inscrire</span>
                    <ArrowRight size={13} className="2xl:w-4 2xl:h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-white mb-4 font-primary">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs 2xl:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-bamboo-accent transition-colors cursor-pointer text-left"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters({ category: 'all', searchQuery: '' });
                    navigateTo('shop');
                  }}
                  className="hover:text-bamboo-accent transition-colors cursor-pointer text-left"
                >
                  Boutique / Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="hover:text-bamboo-accent transition-colors cursor-pointer text-left"
                >
                  Mon Compte
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('cart')}
                  className="hover:text-bamboo-accent transition-colors cursor-pointer text-left"
                >
                  Panier d&apos;achats
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-bamboo-accent transition-colors cursor-pointer text-left"
                >
                  À Propos de DSK
                </button>
              </li>
            </ul>
          </div>

          {/* Aide & Services (Livraison, Retours, Contact) */}
          <div>
            <h4 className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-white mb-4 font-primary">
              Aide & Services
            </h4>
            <ul className="space-y-2.5 text-xs 2xl:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-bamboo-accent transition-colors cursor-pointer text-left"
                >
                  Livraison rapide (24h à Lomé)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-bamboo-accent transition-colors cursor-pointer text-left"
                >
                  Retours sous 30 jours
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-bamboo-accent transition-colors cursor-pointer text-left"
                >
                  Contact & Assistance directe
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/22890000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1 text-emerald-400 font-semibold"
                >
                  Support WhatsApp (+228)
                </a>
              </li>
            </ul>
          </div>

          {/* Collections - Only shown if at least 1 active category has products */}
          {activeCategories.length > 0 && (
            <div>
              <h4 className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-white mb-4 font-primary">
                Collections
              </h4>
              <ul className="space-y-2.5 text-xs 2xl:text-sm text-slate-400">
                {activeCategories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryNav(cat.id)}
                      className="hover:text-bamboo-accent transition-colors cursor-pointer text-left"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar / Mentions légales */}
        <div className="pt-8 2xl:pt-10 mt-8 2xl:mt-10 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs 2xl:text-sm text-slate-500">
          <p>© {new Date().getFullYear()} DSK Shop · Lomé, Togo. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Mentions Légales</span>
            <span className="hover:text-slate-400 cursor-pointer">Politique de Confidentialité</span>
            <span className="hover:text-slate-400 cursor-pointer">Conditions Générales de Vente</span>
            <span className="hover:text-slate-400 cursor-pointer">Paiement Sécurisé</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
