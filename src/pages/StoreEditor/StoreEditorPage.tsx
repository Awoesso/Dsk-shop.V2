import React, { useState, useEffect } from 'react';
import { ArrowLeft, Store, ExternalLink, Sliders, Smartphone, Layers } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useStorefront } from '../../hooks/useStorefront';
import { ThemeEditor } from '../../components/store-editor/ThemeEditor';
import { StorePreview } from '../../components/store-editor/StorePreview';
import { StorefrontService, DEMO_STORES } from '../../services/storefrontService';
import { SEO } from '../../components/SEO/SEO';

export interface StoreEditorPageProps {
  slug?: string;
}

export const StoreEditorPage: React.FC<StoreEditorPageProps> = ({ slug: propSlug }) => {
  const { navigateTo, addToCart } = useShop();
  const [selectedStoreSlug, setSelectedStoreSlug] = useState<string>(
    () => propSlug || 'dsk-official'
  );
  const [editorLayout, setEditorLayout] = useState<'split' | 'editor' | 'preview'>('split');

  useEffect(() => {
    if (propSlug) {
      setSelectedStoreSlug(propSlug);
    }
  }, [propSlug]);

  const {
    storefront,
    isLoading,
    error,
    themeOverride,
    hasUnsavedChanges,
    isSaving,
    updateTheme,
    resetTheme,
    saveConfig,
  } = useStorefront(selectedStoreSlug);

  const demoStores = StorefrontService.getDemoStores();

  return (
    <div className="w-full min-h-screen bg-slate-100 py-6 px-3 sm:px-6 lg:px-8 font-secondary">
      <SEO
        title="Éditeur de Thème de Boutique | Nexa Storefront Engine"
        description="Personnalisez les couleurs, typographies, sections et templates de votre boutique e-commerce en temps réel."
        noindex={true}
      />

      <div className="max-w-[1720px] mx-auto space-y-5">
        {/* Top Control Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-1.5 p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Retour accueil"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 font-primary">
                Atelier de Personnalisation Storefront
              </h1>
              <p className="text-[11px] text-slate-500">
                Moteur de templates modulaire partagé DSK & Nexa
              </p>
            </div>
          </div>

          {/* Store Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Boutique :</span>
            <select
              value={selectedStoreSlug}
              onChange={(e) => setSelectedStoreSlug(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
            >
              {demoStores.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name} ({s.slug})
                </option>
              ))}
            </select>

            <button
              onClick={() => navigateTo('templates')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Layers size={14} />
              <span className="hidden md:inline">Galerie</span>
            </button>

            <button
              onClick={() => navigateTo('storefront')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <span>Voir en direct</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && !storefront && (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            Chargement de la configuration de la boutique...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-4 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            {error}
          </div>
        )}

        {/* Editor & Preview Workspace */}
        {storefront && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Editor Sidebar Controls */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-4">
              <ThemeEditor
                currentTheme={storefront.theme}
                identity={storefront.identity}
                onUpdateTheme={updateTheme}
                onSave={saveConfig}
                onReset={resetTheme}
                hasUnsavedChanges={hasUnsavedChanges}
                isSaving={isSaving}
              />
            </div>

            {/* Live Interactive Preview */}
            <div className="lg:col-span-7 xl:col-span-7 sticky top-4">
              <StorePreview
                storefront={storefront}
                themeOverride={themeOverride || undefined}
                onAddToCart={(prod, qty) => addToCart(prod, qty)}
                onOpenStorefront={() => navigateTo('storefront')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
