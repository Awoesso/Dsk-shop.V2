import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DbStore, DbStoreSetting } from '../types/database.types';
import {
  Storefront,
  StoreIdentity,
  StoreTheme,
  StoreCategory,
} from '../types/storefront';
import {
  StoresService,
  mapDbStoreToStorefront,
  UpdateSettingsPayload,
} from '../services/stores.service';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../services/categories.service';
import { DEMO_STORES } from '../services/storefrontService';
import { templateRegistry } from '../templates/storefront/registry/templateRegistry';

export interface StoreContextValue {
  /** Stable UUID of the store */
  storeId: string;
  /** Public URL slug */
  slug: string;
  /** Raw database store record */
  store: DbStore | null;
  /** Relational visual settings from store_settings */
  settings: DbStoreSetting | null;
  /** Resolved identity (branding, name, contact, status) */
  identity: StoreIdentity;
  /** Resolved theme (colors, typography, layout, template) */
  theme: StoreTheme;
  /** Full structured storefront consumed by templates */
  storefront: Storefront | null;
  /** True while resolving from Supabase */
  isLoading: boolean;
  /** Error message if Supabase or network failed */
  error: string | null;
  /** True if store slug does not exist on Nexa */
  notFound: boolean;
  /** True if store exists but is not published (draft, archived, suspended) */
  isUnpublished: boolean;
  /** Reload store data from Supabase */
  refreshStore: () => Promise<void>;
  /** Update visual settings without creating duplicate records */
  updateSettings: (payload: UpdateSettingsPayload) => Promise<{ success: boolean; error: string | null }>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export interface StoreProviderProps {
  slug: string;
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ slug, children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [isUnpublished, setIsUnpublished] = useState<boolean>(false);

  const [store, setStore] = useState<DbStore | null>(null);
  const [settings, setSettings] = useState<DbStoreSetting | null>(null);
  const [storefront, setStorefront] = useState<Storefront | null>(null);

  const resolveStore = useCallback(async () => {
    if (!slug) {
      setIsLoading(false);
      setNotFound(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setNotFound(false);
    setIsUnpublished(false);

    try {
      // 1. Query Supabase via StoresService
      const res = await StoresService.getStoreBySlug(slug);

      // If Supabase returned an actual error (e.g. network failure, RLS issue):
      // NEVER fall back to demo data! Report the exact error.
      if (res.error) {
        setError(res.error);
        setIsLoading(false);
        setStore(null);
        setSettings(null);
        setStorefront(null);
        return;
      }

      // If store is found in Supabase
      if (res.data) {
        const { store: dbStore, settings: dbSettings } = res.data;

        // Check publication status: 'active' or 'published'
        const rawStatus = (dbStore.status || 'active').toLowerCase();
        const published = rawStatus === 'active' || rawStatus === 'published';

        if (!published) {
          setIsUnpublished(true);
          setStore(dbStore);
          setSettings(dbSettings);
          setIsLoading(false);
          return;
        }

        // Fetch catalog strictly for this storeId
        const productsRes = await ProductsService.getProductsByStore(dbStore.id);
        const storeProducts = productsRes.data || [];

        // Build storefront with products and categories
        const baseStorefront = mapDbStoreToStorefront({
          ...dbStore,
          store_settings: dbSettings,
        });

        // Derive categories present in this store's products
        const catMap = new Map<string, StoreCategory>();
        storeProducts.forEach((p) => {
          if (p.category) {
            const catSlug = p.category.toLowerCase();
            const existing = catMap.get(catSlug);
            if (existing) {
              existing.itemCount = (existing.itemCount || 0) + 1;
            } else {
              catMap.set(catSlug, {
                id: catSlug,
                name: p.category,
                slug: catSlug,
                itemCount: 1,
              });
            }
          }
        });

        const completeStorefront: Storefront = {
          ...baseStorefront,
          products: storeProducts,
          featuredProducts: storeProducts.filter((p) => p.isFeatured || p.isBestSeller),
          categories: Array.from(catMap.values()),
        };

        setStore(dbStore);
        setSettings(dbSettings);
        setStorefront(completeStorefront);
        setIsLoading(false);
        return;
      }

      // 2. If not found in DB, check if it's explicitly a registered demo store
      // (Only allow demo stores when the slug is literally that demo store)
      const demoConfig = DEMO_STORES[slug];
      if (demoConfig) {
        // Fetch demo products (or unassigned demo catalogue)
        const productsRes = await ProductsService.getProducts({ limit: 20 });
        const demoProducts = productsRes.data || [];

        const catMap = new Map<string, StoreCategory>();
        demoProducts.forEach((p) => {
          if (p.category) {
            const catSlug = p.category.toLowerCase();
            const existing = catMap.get(catSlug);
            if (existing) {
              existing.itemCount = (existing.itemCount || 0) + 1;
            } else {
              catMap.set(catSlug, {
                id: catSlug,
                name: p.category,
                slug: catSlug,
                itemCount: 1,
              });
            }
          }
        });

        const demoStorefront: Storefront = {
          identity: demoConfig.identity,
          theme: demoConfig.theme,
          products: demoProducts,
          featuredProducts: demoProducts.filter((p) => p.isFeatured || p.isBestSeller),
          categories: Array.from(catMap.values()),
        };

        const syntheticDbStore: DbStore = {
          id: demoConfig.identity.id,
          owner_id: demoConfig.identity.owner_id || null,
          name: demoConfig.identity.name,
          slug: demoConfig.identity.slug,
          description: demoConfig.identity.description || null,
          logo_url: demoConfig.identity.logoUrl || null,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setStore(syntheticDbStore);
        setSettings(null);
        setStorefront(demoStorefront);
        setIsLoading(false);
        return;
      }

      // 3. Slug unknown -> Strict NOT FOUND (404). Never silent fallback!
      setNotFound(true);
      setStore(null);
      setSettings(null);
      setStorefront(null);
      setIsLoading(false);
    } catch (err: any) {
      setError(err?.message || 'Erreur inattendue lors de la résolution de la boutique.');
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    resolveStore();
  }, [resolveStore]);

  const updateSettings = useCallback(
    async (payload: UpdateSettingsPayload) => {
      if (!store?.id) {
        return { success: false, error: 'Boutique non initialisée.' };
      }

      const res = await StoresService.updateStoreSettings(store.id, payload);
      if (res.success) {
        // Reload settings to refresh theme state
        await resolveStore();
      }
      return res;
    },
    [store?.id, resolveStore]
  );

  const defaultTheme = templateRegistry.getDefaultThemeForTemplate('general');

  const identity: StoreIdentity = storefront?.identity || {
    id: store?.id || '',
    name: store?.name || '',
    slug: slug,
    currency: 'FCFA',
    isPublished: !isUnpublished,
  };

  const theme: StoreTheme = storefront?.theme || defaultTheme;

  const value: StoreContextValue = {
    storeId: store?.id || '',
    slug,
    store,
    settings,
    identity,
    theme,
    storefront,
    isLoading,
    error,
    notFound,
    isUnpublished,
    refreshStore: resolveStore,
    updateSettings,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a <StoreProvider>');
  }
  return ctx;
}
