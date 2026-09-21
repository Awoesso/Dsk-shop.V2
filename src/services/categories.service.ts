import { supabase } from '../lib/supabase';
import { Category, ProductCategory } from '../types';
import { handleSecureError } from '../utils/security';
import {
  CATEGORIES as BASE_CATEGORIES,
  PRODUCT_CATEGORIES,
  DEFAULT_CATEGORY_ICONS,
  DEFAULT_CATEGORY_IMAGES,
  normalizeCategory,
} from '../constants/categories';

export const CategoriesService = {
  /**
   * Fetches products to dynamically group and count under the exact 9 standardized categories.
   * Restricts projection strictly to the 'category' column to prevent leaks.
   */
  async getCategories(): Promise<{ data: Category[]; error: string | null }> {
    try {
      // Initialize counts strictly for the 9 standardized categories
      const counts: Record<ProductCategory, number> = {
        Electronics: 0,
        Fashion: 0,
        Books: 0,
        Home: 0,
        Beauty: 0,
        Sports: 0,
        Accessories: 0,
        Digital: 0,
        Other: 0,
      };

      const { data, error } = await supabase
        .from('products')
        .select('category')
        .limit(1000);

      if (!error && data) {
        data.forEach((item) => {
          if (item.category) {
            const standardCat = normalizeCategory(item.category);
            counts[standardCat] = (counts[standardCat] || 0) + 1;
          }
        });
      }

      // Return strictly the 9 categories with their dynamic counts
      const categories: Category[] = BASE_CATEGORIES.map((cat) => ({
        ...cat,
        itemCount: counts[cat.id] ?? 0,
      }));

      return { data: categories, error: null };
    } catch (err) {
      const safe = handleSecureError(err, 'CategoriesService.getCategories[Unhandled]');
      return { data: BASE_CATEGORIES, error: safe.userMessage };
    }
  },
};
export default CategoriesService;
