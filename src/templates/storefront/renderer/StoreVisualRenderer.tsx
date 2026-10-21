import React, { useMemo } from 'react';
import { Storefront, BuilderProjectData, TemplateProps } from '../../../types/storefront';
import { StoreProductCard } from '../shared/StoreProductCard';
import { StoreThemeScope } from '../shared/StoreThemeScope';

interface StoreVisualRendererProps extends TemplateProps {
  project: BuilderProjectData;
}

/**
 * Renders a GrapesJS custom visual project on the public storefront
 * while dynamically injecting LIVE e-commerce components:
 * - Real live products from Supabase
 * - Real prices in store's currency (FCFA)
 * - Real in-stock statuses
 * - Real addToCart connected to the store's isolated cart
 */
export const StoreVisualRenderer: React.FC<StoreVisualRendererProps> = ({
  project,
  storefront,
  onAddToCart,
  onSelectProduct,
  onToggleWishlist,
  isInWishlist,
}) => {
  const { identity, theme, products } = storefront;

  // Extract HTML & CSS from project
  const { html, css } = useMemo(() => {
    let rawHtml = project.html || '';
    let rawCss = project.css || '';

    // If html is not stored directly, extract from page component
    if (!rawHtml && project.pages?.[0]?.component) {
      const comp = project.pages[0].component;
      if (typeof comp.content === 'string') {
        rawHtml = comp.content;
      }
    }

    return { html: rawHtml, css: rawCss };
  }, [project]);

  // Split HTML into before and after the dynamic product grid placeholder
  const hasDynamicGrid = html.includes('dsk-product-grid-section') || html.includes('data-dsk-dynamic="product-grid"');

  const parts = useMemo(() => {
    if (!hasDynamicGrid) {
      return { before: html, after: '' };
    }

    // Split before the product-grid section and after it
    const marker = html.includes('data-dsk-dynamic="product-grid"')
      ? /<section[^>]*data-dsk-dynamic="product-grid"[^>]*>[\s\S]*?<\/section>/i
      : /<section[^>]*dsk-product-grid-section[^>]*>[\s\S]*?<\/section>/i;

    const match = html.match(marker);
    if (!match || match.index === undefined) {
      return { before: html, after: '' };
    }

    const before = html.substring(0, match.index);
    const after = html.substring(match.index + match[0].length);
    return { before, after };
  }, [html, hasDynamicGrid]);

  return (
    <StoreThemeScope theme={theme}>
      <div className="w-full min-h-screen bg-slate-50 font-sans pb-16">
        {/* Custom Scoped CSS if present */}
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}

        {/* Top Visual Layout (Hero, Badges, Category Pills) */}
        {parts.before && (
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: parts.before }}
          />
        )}

        {/* Real Dynamic Product Grid (Controlled React Component) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 my-10" id="produits">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Catalogue Officiel
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-primary">
              Nos Articles Disponibles
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Découvrez les produits proposés par {identity.name} avec commande en ligne et livraison rapide.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <p className="text-sm font-semibold">Aucun produit en stock actuellement pour cette boutique.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <StoreProductCard
                  key={product.id}
                  product={product}
                  currency={identity.currency || 'FCFA'}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={isInWishlist ? isInWishlist(product.id) : false}
                />
              ))}
            </div>
          )}
        </section>

        {/* Bottom Visual Layout (Trust Badges, Footer) */}
        {parts.after && (
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: parts.after }}
          />
        )}
      </div>
    </StoreThemeScope>
  );
};
