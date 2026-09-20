import { supabase, getProductImageUrl } from '../lib/supabase';
import { Product } from '../types';
import { normalizeCategory } from '../constants/categories';
import {
  clampPagination,
  sanitizeSearchQuery,
  sanitizeSlug,
  sanitizeNumber,
  handleSecureError,
  DEFAULT_QUERY_LIMIT,
} from '../utils/security';
import { RealtimeChannel } from '@supabase/supabase-js';

// Explicit column projection to prevent data leaks and optimize payload size
const PRODUCT_EXPLICIT_COLUMNS = `
  id,
  created_at,
  updated_at,
  name,
  slug,
  description,
  price,
  currency,
  category,
  status,
  view_count,
  sales_count,
  product_images (
    id,
    storage_path,
    sort_order
  )
` as const;

export interface GetProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  status?: string;
}

export interface ProductsResponse {
  data: Product[];
  totalCount: number;
  page: number;
  limit: number;
  error: string | null;
}

export interface SingleProductResponse {
  data: Product | null;
  error: string | null;
}

/**
 * Transforms a raw Supabase database row into the strongly-typed DSK-Shop Product entity.
 * Resolves Storage bucket images securely and ensures type contracts are strictly met.
 */
export function mapDbRowToProduct(row: any): Product {
  // Sort and map product images through the verified Supabase Storage resolver
  const rawImages: Array<{ storage_path: string; sort_order: number | null }> =
    Array.isArray(row.product_images) ? row.product_images : [];

  const sortedImages = [...rawImages].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  const images = sortedImages
    .map((img) => getProductImageUrl(img.storage_path))
    .filter(Boolean);

  // High quality default fallback placeholder if product has no uploaded images yet
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80');
  }

  const isPublished = !row.status || row.status === 'published' || row.status === 'active';
  const name = row.name || 'Produit sans titre';
  const slug = row.slug || sanitizeSlug(name) || row.id;

  return {
    id: row.id,
    name,
    slug,
    brand: 'DSK-Shop',
    price: Number(row.price) || 0,
    category: normalizeCategory(row.category),
    inStock: isPublished,
    stockCount: isPublished ? 10 : 0,
    description: row.description || '',
    features: [],
    specs: {
      Devise: row.currency || 'FCFA',
      Statut: row.status || 'Disponible',
    },
    images,
    rating: 4.8,
    reviewCount: Number(row.sales_count) || 0,
    tags: [row.category || 'Shop'].filter(Boolean),
    isFeatured: (row.view_count || 0) > 10,
    isNew: false,
    isBestSeller: (row.sales_count || 0) > 20,
  };
}

export const ProductsService = {
  /**
   * Fetches paginated, sanitized, and filtered products from Supabase.
   * Respects RLS and bounds limits strictly to max 50 items.
   */
  async getProducts(options: GetProductsOptions = {}): Promise<ProductsResponse> {
    const { from, to, safeLimit, safePage } = clampPagination(
      options.page || 1,
      options.limit || DEFAULT_QUERY_LIMIT
    );

    try {
      let query = supabase
        .from('products')
        .select(PRODUCT_EXPLICIT_COLUMNS, { count: 'exact' })
        .range(from, to);

      // Sanitize and apply category filter if specified
      if (options.category && options.category !== 'all') {
        const sanitizedCat = sanitizeSearchQuery(options.category);
        if (sanitizedCat) {
          query = query.eq('category', sanitizedCat);
        }
      }

      // Sanitize and apply search query
      if (options.searchQuery) {
        const sanitizedSearch = sanitizeSearchQuery(options.searchQuery);
        if (sanitizedSearch) {
          query = query.ilike('name', `%${sanitizedSearch}%`);
        }
      }

      // Price range filters
      if (options.minPrice !== undefined && options.minPrice > 0) {
        query = query.gte('price', sanitizeNumber(options.minPrice));
      }
      if (options.maxPrice !== undefined && options.maxPrice < 1000000) {
        query = query.lte('price', sanitizeNumber(options.maxPrice));
      }

      // Safe sorting whitelist
      switch (options.sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'rating':
        case 'featured':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error, count } = await query;

      if (error) {
        const safeError = handleSecureError(error, 'ProductsService.getProducts');
        return {
          data: [],
          totalCount: 0,
          page: safePage,
          limit: safeLimit,
          error: safeError.userMessage,
        };
      }

      const products = (data || []).map(mapDbRowToProduct);

      return {
        data: products,
        totalCount: count ?? products.length,
        page: safePage,
        limit: safeLimit,
        error: null,
      };
    } catch (err) {
      const safeError = handleSecureError(err, 'ProductsService.getProducts[Unhandled]');
      return {
        data: [],
        totalCount: 0,
        page: safePage,
        limit: safeLimit,
        error: safeError.userMessage,
      };
    }
  },

  /**
   * Fetches a single product by its unique slug or UUID.
   * Parameter is sanitized to prevent injection.
   */
  async getProductBySlug(rawSlug: string): Promise<SingleProductResponse> {
    const slug = sanitizeSlug(rawSlug);
    if (!slug) {
      return { data: null, error: 'Identifiant de produit invalide.' };
    }

    try {
      // First attempt query by slug
      let { data, error } = await supabase
        .from('products')
        .select(PRODUCT_EXPLICIT_COLUMNS)
        .eq('slug', slug)
        .maybeSingle();

      // If not found by slug, check if the input is a valid UUID
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      if (!data && isUuid) {
        const uuidQuery = await supabase
          .from('products')
          .select(PRODUCT_EXPLICIT_COLUMNS)
          .eq('id', slug)
          .maybeSingle();
        data = uuidQuery.data;
        error = uuidQuery.error;
      }

      if (error) {
        const safeError = handleSecureError(error, 'ProductsService.getProductBySlug');
        return { data: null, error: safeError.userMessage };
      }

      if (!data) {
        return { data: null, error: 'Produit introuvable.' };
      }

      return { data: mapDbRowToProduct(data), error: null };
    } catch (err) {
      const safeError = handleSecureError(err, 'ProductsService.getProductBySlug[Unhandled]');
      return { data: null, error: safeError.userMessage };
    }
  },

  /**
   * Subscribes to real-time changes on the public products catalog (UPDATE, INSERT, DELETE from Nexa).
   * Ensures scoped channel subscription and returns a safe cleanup unmount function.
   */
  subscribeToProducts(
    onUpdate: (payload: { eventType: 'INSERT' | 'UPDATE' | 'DELETE'; newRow: any; oldRow: any }) => void
  ): () => void {
    const channelId = `realtime:products:${Math.random().toString(36).substring(2, 9)}`;

    const channel: RealtimeChannel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          onUpdate({
            eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            newRow: payload.new,
            oldRow: payload.old,
          });
        }
      )
      .subscribe((status) => {
        if (import.meta.env.DEV) {
          console.log(`[DSK-Realtime] Channel ${channelId} status:`, status);
        }
      });

    // Cleanup function strictly prevents memory leaks or zombie sockets on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  },
};
