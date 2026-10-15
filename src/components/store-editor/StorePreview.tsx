import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, RefreshCw, ExternalLink } from 'lucide-react';
import { Storefront, StoreTheme, DeepPartial } from '../../types/storefront';
import { TemplateRenderer } from '../../templates/storefront/renderer/TemplateRenderer';

interface StorePreviewProps {
  storefront: Storefront;
  themeOverride?: DeepPartial<StoreTheme>;
  onAddToCart?: (product: any, quantity?: number) => void;
  onOpenStorefront?: () => void;
}

export const StorePreview: React.FC<StorePreviewProps> = ({
  storefront,
  themeOverride,
  onAddToCart,
  onOpenStorefront,
}) => {
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [reloadKey, setReloadKey] = useState<number>(0);

  const handleRefresh = () => {
    setReloadKey((k) => k + 1);
  };

  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[390px] shadow-2xl rounded-[32px] border-[8px] border-slate-800 overflow-hidden my-4';
      case 'tablet':
        return 'max-w-[768px] shadow-xl rounded-2xl border-4 border-slate-700 overflow-hidden my-4';
      case 'desktop':
      default:
        return 'w-full rounded-xl border border-slate-200 shadow-sm';
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* Device Viewport Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between p-2 rounded-xl bg-slate-900 text-white shadow-sm">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewport === 'mobile' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={15} />
            <span className="hidden sm:inline">Mobile (390px)</span>
          </button>

          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewport === 'tablet' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet size={15} />
            <span className="hidden sm:inline">Tablette (768px)</span>
          </button>

          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewport === 'desktop' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor size={15} />
            <span className="hidden sm:inline">Ordinateur (Plein écran)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Rafraîchir l'aperçu"
          >
            <RefreshCw size={15} />
          </button>

          {onOpenStorefront && (
            <button
              onClick={onOpenStorefront}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Voir en direct</span>
              <ExternalLink size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Frame Container */}
      <div className={`w-full flex justify-center transition-all duration-300`}>
        <div
          key={reloadKey}
          className={`${getViewportWidthClass()} bg-white transition-all duration-300 min-h-[600px]`}
        >
          <TemplateRenderer
            storefront={storefront}
            themeOverride={themeOverride}
            isPreviewMode={true}
            onAddToCart={onAddToCart}
          />
        </div>
      </div>
    </div>
  );
};
