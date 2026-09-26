import { Product, ProductCategory } from '../types';

/**
 * Counts how many products belong to each category.
 * If a product does not have a category, it defaults to 'Other'.
 */
export const getCategoryProductCounts = (products: Product[]): Record<string, number> => {
  const map: Record<string, number> = {};
  if (!products || !Array.isArray(products)) return map;

  for (const product of products) {
    const cat = product.category || 'Other';
    map[cat] = (map[cat] || 0) + 1;
  }
  return map;
};

/**
 * Checks whether a category is valid and has at least one active product.
 * Returns false if the count is 0, null, undefined, or <= 0.
 */
export const isCategoryActive = (
  categoryId: string,
  categoryCounts: Record<string, number>
): boolean => {
  if (!categoryId) return false;
  const count = categoryCounts[categoryId];
  return typeof count === 'number' && count > 0;
};

/**
 * Filters any list of categories to only retain those that have at least 1 product.
 * Categories with 0, null, or undefined items are hidden automatically.
 */
export const filterActiveCategories = <T extends { id: string | ProductCategory }>(
  categories: T[],
  categoryCounts: Record<string, number>
): T[] => {
  if (!categories || !Array.isArray(categories)) return [];
  return categories.filter((cat) => isCategoryActive(cat.id, categoryCounts));
};
