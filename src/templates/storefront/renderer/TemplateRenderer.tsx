import React, { useMemo } from 'react';
import { Storefront, StoreTheme, TemplateProps, DeepPartial } from '../../../types/storefront';
import { templateRegistry } from '../registry/templateRegistry';
import { StoreThemeScope } from '../shared/StoreThemeScope';
import { Lock } from 'lucide-react';

interface TemplateRendererProps {
  storefront: Storefront;
  themeOverride?: DeepPartial<StoreTheme>;
  isPreviewMode?: boolean;
  onAddToCart?: TemplateProps['onAddToCart'];
  onToggleWishlist?: TemplateProps['onToggleWishlist'];
  isInWishlist?: TemplateProps['isInWishlist'];
  onSelectProduct?: TemplateProps['onSelectProduct'];
  onSearch?: TemplateProps['onSearch'];
  onSelectCategory?: TemplateProps['onSelectCategory'];
  selectedCategory?: string;
  searchQuery?: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  storefront,
  themeOverride,
  isPreviewMode = false,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onSelectProduct,
  onSearch,
  onSelectCategory,
  selectedCategory,
  searchQuery,
}) => {
  // If store is unpublished and not in editor preview, show unpublished screen
  if (!storefront.identity.isPublished && !isPreviewMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-800">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Lock size={28} />
          </div>
          <h2 className="text-xl font-bold font-primary">{storefront.identity.name}</h2>
          <p className="text-sm text-slate-600">
            Cette boutique est actuellement en cours de configuration par son propriétaire et n'est pas encore ouverte au public.
          </p>
          <div className="text-xs text-slate-400 font-mono">Status: UNPUBLISHED</div>
        </div>
      </div>
    );
  }

  // Merge base theme with any active unsaved overrides (for real-time editing preview)
  const effectiveTheme: StoreTheme = useMemo(() => {
    const baseTheme = storefront.theme || templateRegistry.getDefaultThemeForTemplate('general');
    if (!themeOverride) return baseTheme;

    return {
      ...baseTheme,
      ...themeOverride,
      colors: {
        ...baseTheme.colors,
        ...(themeOverride.colors || {}),
      },
      typography: {
        ...baseTheme.typography,
        ...(themeOverride.typography || {}),
      },
      shape: {
        ...baseTheme.shape,
        ...(themeOverride.shape || {}),
      },
      layout: {
        ...baseTheme.layout,
        ...(themeOverride.layout || {}),
      },
      sections: {
        ...baseTheme.sections,
        ...(themeOverride.sections || {}),
      },
    };
  }, [storefront.theme, themeOverride]);

  // Lookup template definition securely
  const templateDef = templateRegistry.getTemplate(effectiveTheme.templateId);
  const TemplateComponent = templateDef.component;

  // Pass current storefront with effective theme
  const currentStorefront: Storefront = useMemo(() => {
    return {
      ...storefront,
      theme: effectiveTheme,
    };
  }, [storefront, effectiveTheme]);

  return (
    <StoreThemeScope theme={effectiveTheme}>
      <TemplateComponent
        storefront={currentStorefront}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        isInWishlist={isInWishlist}
        onSelectProduct={onSelectProduct}
        onSearch={onSearch}
        onSelectCategory={onSelectCategory}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />
    </StoreThemeScope>
  );
};
