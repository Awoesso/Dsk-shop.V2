import { supabase, getProductImageUrl } from '../lib/supabase';
import { Product, SortOption } from '../types';
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

// Relational query embedding product_images
const PRODUCT_QUERY_WITH_IMAGES = '*, product_images(*)';

export interface GetProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
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
 * Helper to safely resolve image URLs whether stored as direct URLs or Supabase storage paths.
 */
function resolveImageUrl(img: any): string {
  if (!img) return '';
  if (typeof img === 'string') {
    return img.startsWith('http://') || img.startsWith('https://') ? img : getProductImageUrl(img);
  }
  if (img.url && typeof img.url === 'string') return img.url;
  if (img.image_url && typeof img.image_url === 'string') return img.image_url;
  if (img.storage_path && typeof img.storage_path === 'string') return getProductImageUrl(img.storage_path);
  return '';
}

/**
 * Transforms a raw Supabase database row with relational product_images
 * into the strongly-typed DSK-Shop Product entity.
 */
export function mapDbRowToProduct(row: any): Product {
  const rawImages: any[] = Array.isArray(row.product_images) ? row.product_images : [];

  const sortedImages = [...rawImages].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  const images = sortedImages
    .map(resolveImageUrl)
    .filter(Boolean);

  const neutralPlaceholder = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';

  // primaryImage: Use product_images.find(img => img.is_primary)?.url or product_images[0]?.url or a neutral placeholder
  const primaryImgObj = sortedImages.find((img: any) => img.is_primary) || sortedImages[0];
  const primaryImage = (primaryImgObj ? resolveImageUrl(primaryImgObj) : '') || images[0] || neutralPlaceholder;

  if (images.length === 0) {
    images.push(primaryImage);
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
    primaryImage,
    images,
    product_images: rawImages,
    tags: [row.category || 'Shop'].filter(Boolean),
    isFeatured: (row.view_count || 0) > 10,
    isNew: false,
    isBestSeller: (row.sales_count || 0) > 20,
    currency: row.currency || 'FCFA',
    status: row.status || 'active',
  };
}

export const ProductsService = {
  /**
   * Fetches paginated, sanitized, and filtered products from Supabase with relational images.
   */
  async getProducts(options: GetProductsOptions = {}): Promise<ProductsResponse> {
    const { from, to, safeLimit, safePage } = clampPagination(
      options.page || 1,
      options.limit || DEFAULT_QUERY_LIMIT
    );

    try {
      let query = (supabase as any)
        .from('products')
        .select(PRODUCT_QUERY_WITH_IMAGES, { count: 'exact' })
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
   * Fetches a single product by its unique slug or UUID with relational product_images.
   */
  async getProductBySlug(rawSlug: string): Promise<SingleProductResponse> {
    const slug = sanitizeSlug(rawSlug);
    if (!slug) {
      return { data: null, error: 'Identifiant de produit invalide.' };
    }

    try {
      // First attempt query by slug
      let { data, error } = await (supabase as any)
        .from('products')
        .select(PRODUCT_QUERY_WITH_IMAGES)
        .eq('slug', slug)
        .maybeSingle();

      // If not found by slug, check if the input is a valid UUID
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      if (!data && isUuid) {
        const uuidQuery = await (supabase as any)
          .from('products')
          .select(PRODUCT_QUERY_WITH_IMAGES)
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
   * Subscribes to real-time changes on the public products catalog.
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
        async (payload) => {
          if (payload.eventType === 'DELETE') {
            onUpdate({
              eventType: 'DELETE',
              newRow: null,
              oldRow: payload.old,
            });
            return;
          }

          // For INSERT and UPDATE, fetch relational product_images join
          const productId = payload.new?.id;
          let fullRow = payload.new;
          if (productId) {
            try {
              const res = await (supabase as any)
                .from('products')
                .select(PRODUCT_QUERY_WITH_IMAGES)
                .eq('id', productId)
                .maybeSingle();
              if (res.data) {
                fullRow = res.data;
              }
            } catch {
              // fallback to payload.new
            }
          }

          onUpdate({
            eventType: payload.eventType as 'INSERT' | 'UPDATE',
            newRow: fullRow,
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
