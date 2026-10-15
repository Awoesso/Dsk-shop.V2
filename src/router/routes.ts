/**
 * Nexa Storefront Router - Route Definitions & Path Parser
 * Supports explicit multi-store paths:
 *   - / : Hub Nexa Storefronts (Annuaire et accès aux boutiques)
 *   - /templates : Catalogue des modèles de boutiques
 *   - /boutique/:slug : Accueil d'une boutique spécifique
 *   - /boutique/:slug/produits : Catalogue de cette boutique
 *   - /boutique/:slug/produit/:productSlug : Fiche produit détaillée
 *   - /boutique/:slug/panier : Panier de cette boutique
 *   - /boutique/:slug/commande : Tunnel de commande de cette boutique
 *   - /editeur/:slug : Éditeur visuel pour cette boutique
 */

export type AppRouteType =
  | 'hub'
  | 'templates'
  | 'store-home'
  | 'store-products'
  | 'store-product-detail'
  | 'store-cart'
  | 'store-checkout'
  | 'store-editor'
  | 'not-found';

export interface RouteMatch {
  type: AppRouteType;
  path: string;
  slug?: string;
  productSlug?: string;
  params: Record<string, string>;
}

/**
 * Normalizes a URL pathname (strips trailing slashes, lowercases path segments).
 */
export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  // Strip trailing slashes
  return pathname.replace(/\/+$/, '') || '/';
}

/**
 * Parses any incoming pathname into a strongly-typed RouteMatch.
 * Works seamlessly in SSR, Node testing, browser initial load, and history events.
 */
export function parseRoute(rawPath: string): RouteMatch {
  const path = normalizePathname(rawPath);

  // 1. Root / Hub Nexa
  if (path === '/') {
    return { type: 'hub', path, params: {} };
  }

  // 2. Global Template Gallery
  if (path === '/templates') {
    return { type: 'templates', path, params: {} };
  }

  // 3. Store Editor : /editeur/:slug
  const editorMatch = path.match(/^\/editeur\/([a-zA-Z0-9_-]+)$/);
  if (editorMatch) {
    const slug = editorMatch[1];
    return {
      type: 'store-editor',
      path,
      slug,
      params: { slug },
    };
  }

  // 4. Store routes : /boutique/:slug/*
  // Product detail: /boutique/:slug/produit/:productSlug
  const productDetailMatch = path.match(/^\/boutique\/([a-zA-Z0-9_-]+)\/produit\/([a-zA-Z0-9_-]+)$/);
  if (productDetailMatch) {
    const slug = productDetailMatch[1];
    const productSlug = productDetailMatch[2];
    return {
      type: 'store-product-detail',
      path,
      slug,
      productSlug,
      params: { slug, productSlug },
    };
  }

  // Store Catalog: /boutique/:slug/produits
  const catalogMatch = path.match(/^\/boutique\/([a-zA-Z0-9_-]+)\/produits$/);
  if (catalogMatch) {
    const slug = catalogMatch[1];
    return {
      type: 'store-products',
      path,
      slug,
      params: { slug },
    };
  }

  // Store Cart: /boutique/:slug/panier
  const cartMatch = path.match(/^\/boutique\/([a-zA-Z0-9_-]+)\/panier$/);
  if (cartMatch) {
    const slug = cartMatch[1];
    return {
      type: 'store-cart',
      path,
      slug,
      params: { slug },
    };
  }

  // Store Checkout: /boutique/:slug/commande
  const checkoutMatch = path.match(/^\/boutique\/([a-zA-Z0-9_-]+)\/commande$/);
  if (checkoutMatch) {
    const slug = checkoutMatch[1];
    return {
      type: 'store-checkout',
      path,
      slug,
      params: { slug },
    };
  }

  // Store Home: /boutique/:slug
  const storeHomeMatch = path.match(/^\/boutique\/([a-zA-Z0-9_-]+)$/);
  if (storeHomeMatch) {
    const slug = storeHomeMatch[1];
    return {
      type: 'store-home',
      path,
      slug,
      params: { slug },
    };
  }

  // 5. Unknown route -> Not found 404
  return {
    type: 'not-found',
    path,
    params: {},
  };
}

/**
 * Route URL builders for safe navigation.
 */
export const routes = {
  hub: () => '/',
  templates: () => '/templates',
  storeHome: (slug: string) => `/boutique/${encodeURIComponent(slug)}`,
  storeProducts: (slug: string) => `/boutique/${encodeURIComponent(slug)}/produits`,
  storeProductDetail: (slug: string, productSlug: string) =>
    `/boutique/${encodeURIComponent(slug)}/produit/${encodeURIComponent(productSlug)}`,
  storeCart: (slug: string) => `/boutique/${encodeURIComponent(slug)}/panier`,
  storeCheckout: (slug: string) => `/boutique/${encodeURIComponent(slug)}/commande`,
  storeEditor: (slug: string) => `/editeur/${encodeURIComponent(slug)}`,
};
