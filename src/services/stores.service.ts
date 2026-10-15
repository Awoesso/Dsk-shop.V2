import { supabase } from '../lib/supabase';
import { DbStore, DbStoreSetting } from '../types/database.types';
import { StoreIdentity, StoreTheme, Storefront } from '../types/storefront';
import { templateRegistry } from '../templates/storefront/registry/templateRegistry';
import { sanitizeSlug, handleSecureError } from '../utils/security';

export interface StoreWithSettings {
  store: DbStore;
  settings: DbStoreSetting | null;
}

export interface StorefrontResult {
  data: Storefront | null;
  error: string | null;
}

export interface StoreEntityResult {
  data: StoreWithSettings | null;
  error: string | null;
}

export interface UpdateSettingsPayload {
  primary_color?: string | null;
  secondary_color?: string | null;
  font_family?: string | null;
  banner_url?: string | null;
  currency?: string | null;
  social_links?: Record<string, any> | null;
  template_id?: string | null;
}

/**
 * Maps a raw Supabase stores record and its relational store_settings
 * into the strongly-typed Storefront structure consumed by templates.
 */
export function mapDbStoreToStorefront(storeRow: any): Storefront {
  const rawSettings = Array.isArray(storeRow.store_settings)
    ? storeRow.store_settings[0]
    : storeRow.store_settings || null;

  const templateId =
    rawSettings?.template_id ||
    rawSettings?.social_links?.template_id ||
    rawSettings?.social_links?.template ||
    storeRow?.template_id ||
    'general';

  const defaultTheme = templateRegistry.getDefaultThemeForTemplate(templateId);

  // Build merged theme from real store_settings columns
  const theme: StoreTheme = {
    ...defaultTheme,
    templateId,
    colors: {
      ...defaultTheme.colors,
      ...(rawSettings?.primary_color ? { primary: rawSettings.primary_color } : {}),
      ...(rawSettings?.secondary_color ? { secondary: rawSettings.secondary_color } : {}),
    },
    typography: {
      ...defaultTheme.typography,
      ...(rawSettings?.font_family ? { headingFont: rawSettings.font_family as any } : {}),
    },
  };

  const identity: StoreIdentity = {
    id: storeRow.id,
    owner_id: storeRow.owner_id || null,
    name: storeRow.name || 'Boutique sans nom',
    slug: storeRow.slug || '',
    tagline: '',
    description: storeRow.description || '',
    logoUrl: storeRow.logo_url || '',
    bannerUrl: rawSettings?.banner_url || '',
    phone: '',
    email: '',
    address: '',
    city: 'Lomé',
    country: 'Togo',
    currency: rawSettings?.currency || 'FCFA',
    socialLinks: (rawSettings?.social_links as any) || {},
    isPublished: storeRow.status === 'active' || storeRow.status === 'published' || !storeRow.status,
    status: storeRow.status || 'active',
  };

  return {
    identity,
    theme,
    categories: [],
    products: [],
    featuredProducts: [],
  };
}

export const StoresService = {
  /**
   * Retrieves a store and its settings by its unique slug.
   * Returns data: null if the store does not exist (no silent demo fallback).
   */
  async getStoreBySlug(rawSlug: string): Promise<StoreEntityResult> {
    const slug = sanitizeSlug(rawSlug);
    if (!slug) {
      return { data: null, error: 'Identifiant de boutique invalide.' };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('stores')
        .select('*, store_settings(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        const safe = handleSecureError(error, 'StoresService.getStoreBySlug');
        return { data: null, error: safe.userMessage };
      }

      if (!data) {
        return { data: null, error: null };
      }

      const settings = Array.isArray(data.store_settings)
        ? data.store_settings[0] || null
        : data.store_settings || null;

      return {
        data: {
          store: data as DbStore,
          settings: settings as DbStoreSetting | null,
        },
        error: null,
      };
    } catch (err) {
      const safe = handleSecureError(err, 'StoresService.getStoreBySlug[Unhandled]');
      return { data: null, error: safe.userMessage };
    }
  },

  /**
   * Retrieves a store and its settings by its stable UUID.
   */
  async getStoreById(storeId: string): Promise<StoreEntityResult> {
    if (!storeId || typeof storeId !== 'string') {
      return { data: null, error: 'ID de boutique requis.' };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('stores')
        .select('*, store_settings(*)')
        .eq('id', storeId)
        .maybeSingle();

      if (error) {
        const safe = handleSecureError(error, 'StoresService.getStoreById');
        return { data: null, error: safe.userMessage };
      }

      if (!data) {
        return { data: null, error: null };
      }

      const settings = Array.isArray(data.store_settings)
        ? data.store_settings[0] || null
        : data.store_settings || null;

      return {
        data: {
          store: data as DbStore,
          settings: settings as DbStoreSetting | null,
        },
        error: null,
      };
    } catch (err) {
      const safe = handleSecureError(err, 'StoresService.getStoreById[Unhandled]');
      return { data: null, error: safe.userMessage };
    }
  },

  /**
   * Resolves a complete storefront (identity + theme) by slug.
   * Returns data: null if not found (clean 404 handling).
   */
  async getStorefrontBySlug(rawSlug: string): Promise<StorefrontResult> {
    const { data, error } = await this.getStoreBySlug(rawSlug);
    if (error) {
      return { data: null, error };
    }
    if (!data) {
      return { data: null, error: null };
    }

    const storefront = mapDbStoreToStorefront({
      ...data.store,
      store_settings: data.settings,
    });

    return { data: storefront, error: null };
  },

  /**
   * Updates visual parameters for an existing store in the real 'store_settings' table.
   * Uses upsert on conflict 'store_id' so it updates the existing record without creating duplicates.
   */
  async updateStoreSettings(
    storeId: string,
    updates: UpdateSettingsPayload
  ): Promise<{ success: boolean; error: string | null }> {
    if (!storeId) {
      return { success: false, error: 'ID de boutique requis pour la mise à jour.' };
    }

    try {
      const payload: Record<string, any> = {
        store_id: storeId,
        updated_at: new Date().toISOString(),
      };

      if (updates.primary_color !== undefined) payload.primary_color = updates.primary_color;
      if (updates.secondary_color !== undefined) payload.secondary_color = updates.secondary_color;
      if (updates.font_family !== undefined) payload.font_family = updates.font_family;
      if (updates.banner_url !== undefined) payload.banner_url = updates.banner_url;
      if (updates.currency !== undefined) payload.currency = updates.currency;
      if (updates.social_links !== undefined) payload.social_links = updates.social_links;
      if (updates.template_id !== undefined) {
        payload.social_links = {
          ...(payload.social_links || {}),
          template_id: updates.template_id,
        };
      }

      const { error } = await (supabase as any)
        .from('store_settings')
        .upsert(payload, { onConflict: 'store_id' });

      if (error) {
        const safe = handleSecureError(error, 'StoresService.updateStoreSettings');
        return { success: false, error: safe.userMessage };
      }

      return { success: true, error: null };
    } catch (err) {
      const safe = handleSecureError(err, 'StoresService.updateStoreSettings[Unhandled]');
      return { success: false, error: safe.userMessage };
    }
  },
};
