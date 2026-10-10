import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../constants/categories';
import { getCategoryProductCounts, filterActiveCategories } from '../../utils/categoryUtils';

export const Footer: React.FC = () => {
  const { navigateTo, setFilters, products } = useShop();
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
      return;
    }
    setSubscribed(true);
  };

  const handleCategoryNav = (catId: string) => {
    setFilters({ category: catId, searchQuery: '' });
    navigateTo('shop', { category: catId });
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 pt-16 pb-28 md:pb-16 border-t border-neutral-900 font-secondary text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP SECTION: BRAND & LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-neutral-900">
          
          {/* BRAND & NEWSLETTER (2 COLS) */}
          <div className="lg:col-span-2 space-y-5">
            {/* LOGO */}
            <div className="flex items-center gap-2 font-primary">
              <div className="w-7 h-7 rounded-lg bg-white text-neutral-950 flex items-center justify-center font-bold text-xs tracking-tight">
                DSK
              </div>
              <span className="text-base font-semibold tracking-tight text-white">
                DSK <span className="text-neutral-400 font-normal">SHOP</span>
              </span>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              L'essentiel du quotidien livré rapidement à Lomé, Togo. Produits vérifiés, garantis et paiement sécurisé.
            </p>

            {/* NEWSLETTER */}
            <div className="pt-2">
              <p className="text-xs font-medium text-neutral-300 mb-2.5 font-primary">
                Restez informé des nouveautés
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/40 font-primary">
                  <Check size={14} /> Inscription confirmée. Merci !
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm font-primary">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="flex-1 min-w-0 px-3.5 py-2 bg-neutral-900 text-white placeholder:text-neutral-600 text-xs rounded-xl border border-neutral-800 focus:outline-none focus:border-neutral-700 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer shrink-0"
                  >
                    <span>S'inscrire</span>
                    <ArrowRight size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-wide font-primary">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({ category: 'all', searchQuery: '' });
                    navigateTo('shop');
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Boutique
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('account')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Mon Compte
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('cart')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Panier
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  À propos
                </button>
              </li>
            </ul>
          </div>

          {/* AIDE & SERVICES */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-wide font-primary">
              Aide & Services
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Livraison à Lomé
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Retours & Retractation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Support Client
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/22890000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors inline-block font-medium"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* COLLECTIONS */}
          {activeCategories.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-white tracking-wide font-primary">
                Collections
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                {activeCategories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleCategoryNav(cat.id)}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* BOTTOM SECTION: LEGAL & COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} DSK Shop • Lomé, Togo.</p>

          <div className="flex flex-wrap items-center gap-5 text-neutral-500">
            <button type="button" className="hover:text-neutral-300 transition-colors cursor-pointer">
              Mentions Légales
            </button>
            <button type="button" className="hover:text-neutral-300 transition-colors cursor-pointer">
              Confidentialité
            </button>
            <button type="button" className="hover:text-neutral-300 transition-colors cursor-pointer">
              CGV
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;