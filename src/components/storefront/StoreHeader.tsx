import React from 'react';
import { Store, ShoppingBag, Sliders, ArrowLeft, Layers, Compass } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../router/RouterContext';

export const StoreHeader: React.FC = () => {
  const { identity, slug, storefront } = useStore();
  const { navigate, route } = useRouter();

  const isHome = route.type === 'store-home';
  const isProducts = route.type === 'store-products';
  const isCart = route.type === 'store-cart';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 text-xs">
      {/* Top micro-bar: Nexa Portal switch */}
      <div className="bg-slate-900 text-white px-4 py-1.5 flex items-center justify-between text-[11px]">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={12} />
          <span>Portail Nexa Multi-Boutiques</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden sm:inline">
            Modèle actif : <span className="text-emerald-400 font-bold uppercase">{storefront?.theme.templateId || 'general'}</span>
          </span>
          <button
            onClick={() => navigate(`/editeur/${slug}`)}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
          >
            <Sliders size={11} />
            <span>Éditeur de ce modèle</span>
          </button>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => navigate(`/boutique/${slug}`)}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {identity.logoUrl ? (
            <img
              src={identity.logoUrl}
              alt={identity.name}
              className="w-8 h-8 rounded-lg object-contain border border-slate-100"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm transition-colors">
              {identity.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-extrabold text-sm text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
              {identity.name}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">/boutique/{slug}</div>
          </div>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-1 sm:gap-2 font-medium">
          <button
            onClick={() => navigate(`/boutique/${slug}`)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isHome
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Accueil
          </button>
          <button
            onClick={() => navigate(`/boutique/${slug}/produits`)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isProducts
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Produits
          </button>
          <button
            onClick={() => navigate(`/boutique/${slug}/panier`)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isCart
                ? 'bg-slate-900 text-white font-bold'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag size={14} />
            <span>Panier</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
