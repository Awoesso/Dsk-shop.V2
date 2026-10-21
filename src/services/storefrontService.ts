import { supabase } from '../lib/supabase';
import {
  Storefront,
  StoreIdentity,
  StoreTheme,
  StoreCategory,
  StorefrontConfig,
} from '../types/storefront';
import { ProductsService } from './products.service';
import { StoresService } from './stores.service';
import {
  templateRegistry,
  FASHION_DEFAULT_THEME,
  TECH_DEFAULT_THEME,
  GENERAL_DEFAULT_THEME,
} from '../templates/storefront/registry/templateRegistry';
import { handleSecureError, sanitizeText } from '../utils/security';

/**
 * Built-in Demonstration Stores
 * Ensure the storefront engine and editor function seamlessly
 * while providing full backward compatibility.
 */
export const DEMO_STORES: Record<string, { identity: StoreIdentity; theme: StoreTheme }> = {
  'dsk-official': {
    identity: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'DSK-Shop Officiel',
      slug: 'dsk-official',
      tagline: 'Votre référence shopping éco-responsable à Lomé',
      description:
        'DSK-Shop propose une vaste sélection de produits de haute qualité avec livraison rapide à domicile et paiement sécurisé à la réception partout à Lomé.',
      logoUrl: '',
      bannerUrl: '/Harmonie.png',
      phone: '+228 90 00 00 00',
      email: 'contact@dskshop.tg',
      address: 'Boulevard du 13 Janvier, Déckon',
      city: 'Lomé',
      country: 'Togo',
      currency: 'FCFA',
      socialLinks: {
        whatsapp: '+22890000000',
        instagram: 'https://instagram.com/dskshop',
        facebook: 'https://facebook.com/dskshop',
      },
      isPublished: true,
    },
    theme: GENERAL_DEFAULT_THEME,
  },
  'lome-elegance': {
    identity: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Lomé Élégance Atelier',
      slug: 'lome-elegance',
      tagline: 'Haute couture & Prêt-à-porter exclusif',
      description:
        'Maison de mode contemporaine spécialisée dans la création de vêtements raffinés, accessoires en lin et pièces uniques confectionnées avec passion.',
      logoUrl: '',
      bannerUrl: '',
      phone: '+228 91 23 45 67',
      email: 'contact@lome-elegance.com',
      address: 'Quartier Nyékonakpoè',
      city: 'Lomé',
      country: 'Togo',
      currency: 'FCFA',
      socialLinks: {
        whatsapp: '+22891234567',
        instagram: 'https://instagram.com/lome_elegance',
      },
      isPublished: true,
    },
    theme: FASHION_DEFAULT_THEME,
  },
  'cyber-lome': {
    identity: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'CyberTech Lomé',
      slug: 'cyber-lome',
      tagline: 'High-Tech, Informatique & Accessoires certifiés',
      description:
        'Le spécialiste togolais des smartphones, ordinateurs portables, casques audio et composants électroniques d’origine avec garantie 1 an.',
      logoUrl: '',
      bannerUrl: '',
      phone: '+228 92 88 99 00',
      email: 'sales@cybertech-lome.tg',
      address: 'Carrefour 3K, Hedzranawoé',
      city: 'Lomé',
      country: 'Togo',
      currency: 'FCFA',
      socialLinks: {
        whatsapp: '+22892889900',
      },
      isPublished: true,
    },
    theme: TECH_DEFAULT_THEME,
  },
  'tech-horizon': {
    identity: {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Tech Horizon Lomé',
      slug: 'tech-horizon',
      tagline: 'Composants gamer, périphériques pro et stations de travail',
      description:
        'Le spécialiste de l’informatique haute performance, stations de travail et accessoires gaming de pointe à Lomé.',
      logoUrl: '',
      bannerUrl: '',
      phone: '+228 92 88 99 00',
      email: 'contact@tech-horizon.tg',
      address: 'Boulevard Circulaire, Lomé',
      city: 'Lomé',
      country: 'Togo',
      currency: 'FCFA',
      socialLinks: {
        whatsapp: '+22892889900',
      },
      isPublished: true,
    },
    theme: TECH_DEFAULT_THEME,
  },
};

export const StorefrontService = {
  /**
   * Retrieves a storefront by slug.
   * Tries Supabase 'stores' and 'storefront_configs' tables first.
   * If not configured or offline, falls back seamlessly to demo stores.
   */
  async getStorefrontBySlug(slug: string): Promise<{ data: Storefront | null; error: string | null }> {
    const cleanSlug = (slug || '').trim().toLowerCase();

    try {
      // 1. Fetch live products from the Supabase catalog
      const productsRes = await ProductsService.getProducts({ limit: 40 });
      const liveProducts = productsRes.data || [];

      // Extract unique categories
      const categoryMap = new Map<string, StoreCategory>();
      liveProducts.forEach((p) => {
        if (p.category) {
          const catName = p.category;
          const catSlug = catName.toLowerCase();
          const existing = categoryMap.get(catSlug);
          if (existing) {
            existing.itemCount = (existing.itemCount || 0) + 1;
          } else {
            categoryMap.set(catSlug, {
              id: catSlug,
              name: catName,
              slug: catSlug,
              itemCount: 1,
            });
          }
        }
      });
      const categories = Array.from(categoryMap.values());

      // 2. Query Supabase for store and store_settings via StoresService
      const storeRes = await StoresService.getStoreBySlug(cleanSlug);
      if (storeRes.data) {
        const { store, settings } = storeRes.data;
        // Fetch products strictly for this specific store
        const storeProductsRes = await ProductsService.getProductsByStore(store.id);
        const storeProducts = storeProductsRes.data;

        const defaultTheme = templateRegistry.getDefaultThemeForTemplate('general');
        const themeSettings: StoreTheme = {
          ...defaultTheme,
          colors: {
            ...defaultTheme.colors,
            ...(settings?.primary_color ? { primary: settings.primary_color } : {}),
            ...(settings?.secondary_color ? { secondary: settings.secondary_color } : {}),
          },
          typography: {
            ...defaultTheme.typography,
            ...(settings?.font_family ? { headingFont: settings.font_family as any } : {}),
          },
        };

        const storefront: Storefront = {
          identity: {
            id: store.id,
            owner_id: store.owner_id || null,
            name: store.name,
            slug: store.slug,
            tagline: '',
            description: store.description || '',
            logoUrl: store.logo_url || '',
            bannerUrl: settings?.banner_url || '',
            phone: '',
            email: '',
            address: '',
            city: 'Lomé',
            country: 'Togo',
            currency: settings?.currency || 'FCFA',
            socialLinks: (settings?.social_links as any) || {},
            isPublished: store.status === 'active' || store.status === 'published' || !store.status,
            status: store.status || 'active',
          },
          theme: themeSettings,
          categories,
          products: storeProducts,
          featuredProducts: storeProducts.filter((p) => p.isFeatured),
        };

        return { data: storefront, error: null };
      }

      // 3. Fallback to matching demo store or default DSK store
      const demo = DEMO_STORES[cleanSlug] || DEMO_STORES['dsk-official'];

      // Check local storage for any custom unsaved/saved theme for this store
      let localTheme = demo.theme;
      try {
        const savedThemeStr = localStorage.getItem(`dsk_theme_${demo.identity.id}`);
        if (savedThemeStr) {
          localTheme = JSON.parse(savedThemeStr);
        }
      } catch {
        // ignore
      }

      const storefront: Storefront = {
        identity: demo.identity,
        theme: localTheme,
        categories,
        products: liveProducts,
        featuredProducts: liveProducts.filter((p) => p.isFeatured),
      };

      return { data: storefront, error: null };
    } catch (err: any) {
      const safe = handleSecureError(err, 'StorefrontService.getStorefrontBySlug');
      return { data: null, error: safe.userMessage };
    }
  },

  /**
   * Persists updated theme and template configuration for a store.
   * Updates Supabase if 'storefront_configs' exists, and also saves to localStorage
   * for instant responsiveness and offline development.
   */
  async saveStorefrontConfig(
    storeId: string,
    templateId: string,
    theme: StoreTheme
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // 1. Save to local storage for instant responsiveness
      try {
        localStorage.setItem(`dsk_theme_${storeId}`, JSON.stringify(theme));
      } catch {
        // ignore
      }

      // 2. Persist to real Supabase store_settings table via StoresService
      return await StoresService.updateStoreSettings(storeId, {
        primary_color: theme.colors?.primary,
        secondary_color: theme.colors?.secondary,
        font_family: theme.typography?.headingFont,
        template_id: templateId,
        social_links: {
          template_id: templateId,
          theme,
        },
      });
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erreur lors de l’enregistrement de la configuration.' };
    }
  },

  /**
   * Returns list of available demo stores for quick navigation.
   */
  getDemoStores(): StoreIdentity[] {
    return Object.values(DEMO_STORES).map((s) => s.identity);
  },
};
