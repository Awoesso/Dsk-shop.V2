import React, { useState } from 'react';
import { ArrowLeft, Sliders, ExternalLink, RefreshCw } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useStorefront } from '../../hooks/useStorefront';
import { TemplateRenderer } from '../../templates/storefront/renderer/TemplateRenderer';
import { StorefrontService } from '../../services/storefrontService';
import { SEO } from '../../components/SEO/SEO';

export const StorefrontPage: React.FC = () => {
  const { navigateTo, addToCart, toggleWishlist, isInWishlist, openProduct } = useShop();
  const [selectedSlug, setSelectedSlug] = useState<string>('dsk-official');
  const demoStores = StorefrontService.getDemoStores();

  const { storefront, isLoading, error } = useStorefront(selectedSlug);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-secondary">
      <SEO
        title={storefront ? `${storefront.identity.name} | Boutique Officielle` : 'Boutique Storefront'}
        description={storefront?.identity.description || 'Découvrez notre catalogue en ligne.'}
      />

      {/* Top Floating Control Bar */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 border-b border-slate-800 text-xs">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Accueil DSK</span>
            </button>

            <span className="text-slate-600">|</span>

            {/* Store Switcher */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 hidden sm:inline">Boutique active :</span>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-md px-2 py-1 text-xs font-bold focus:outline-none"
              >
                {demoStores.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('editor')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
            >
              <Sliders size={13} />
              <span>Personnaliser ce template</span>
            </button>
            <button
              onClick={() => navigateTo('templates')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer"
            >
              <span>Changer de modèle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        {isLoading && !storefront && (
          <div className="py-24 text-center text-slate-500 font-medium">
            Chargement de la boutique...
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-center space-y-2">
            <h3 className="font-bold text-sm">Erreur de chargement</h3>
            <p className="text-xs">{error}</p>
          </div>
        )}

        {storefront && (
          <TemplateRenderer
            storefront={storefront}
            onAddToCart={(prod, qty) => addToCart(prod, qty)}
            onToggleWishlist={toggleWishlist}
            isInWishlist={isInWishlist}
            onSelectProduct={openProduct}
          />
        )}
      </div>
    </div>
  );
};
