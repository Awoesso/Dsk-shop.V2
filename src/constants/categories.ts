import { Category, ProductCategory } from '../types';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Electronics',
  'Fashion',
  'Books',
  'Home',
  'Beauty',
  'Sports',
  'Accessories',
  'Digital',
  'Other',
];

export const CATEGORIES: Category[] = [
  {
    id: 'Electronics',
    name: 'Electronics',
    slug: 'electronics',
    iconName: 'Laptop',
    itemCount: 6,
    description: 'Smartphones, ordinateurs, audio haute-fidélité et gadgets innovants.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'Fashion',
    name: 'Fashion',
    slug: 'fashion',
    iconName: 'Shirt',
    itemCount: 3,
    description: 'Vêtements élégants, streetwear, chaussures et tendances de saison.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'Books',
    name: 'Books',
    slug: 'books',
    iconName: 'BookOpen',
    itemCount: 2,
    description: 'Romans, livres de développement personnel, guides et littérature.',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'Home',
    name: 'Home',
    slug: 'home',
    iconName: 'Home',
    itemCount: 3,
    description: 'Décoration intérieure, mobilier, luminaires et équipement de maison.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'Beauty',
    name: 'Beauty',
    slug: 'beauty',
    iconName: 'Sparkles',
    itemCount: 2,
    description: 'Soins pour le visage, parfums de prestige, maquillage et bien-être.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'Sports',
    name: 'Sports',
    slug: 'sports',
    iconName: 'Activity',
    itemCount: 3,
    description: 'Équipements d’entraînement, fitness, running et accessoires de sport.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'Accessories',
    name: 'Accessories',
    slug: 'accessories',
    iconName: 'Watch',
    itemCount: 3,
    description: 'Montres, lunettes, maroquinerie, bijoux et sacs haut de gamme.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'Digital',
    name: 'Digital',
    slug: 'digital',
    iconName: 'Cpu',
    itemCount: 2,
    description: 'Logiciels, cartes cadeaux, abonnements et ressources numériques.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'Other',
    name: 'Other',
    slug: 'other',
    iconName: 'Package',
    itemCount: 2,
    description: 'Articles diversifiés, sélections spéciales et nouveautés exclusives.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  },
];

export const CATEGORY_MAP: Record<ProductCategory, Category> = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  },
  {} as Record<ProductCategory, Category>
);

export const DEFAULT_CATEGORY_ICONS: Record<ProductCategory, string> = {
  Electronics: 'Laptop',
  Fashion: 'Shirt',
  Books: 'BookOpen',
  Home: 'Home',
  Beauty: 'Sparkles',
  Sports: 'Activity',
  Accessories: 'Watch',
  Digital: 'Cpu',
  Other: 'Package',
};

export const DEFAULT_CATEGORY_IMAGES: Record<ProductCategory, string> = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat.image;
    return acc;
  },
  {} as Record<ProductCategory, string>
);

/**
 * Normalizes any category string or slug to one of the strict 9 ProductCategory values.
 */
export function normalizeCategory(rawCategory?: string | null): ProductCategory {
  if (!rawCategory) return 'Other';
  const clean = rawCategory.trim().toLowerCase();

  switch (clean) {
    case 'electronics':
    case 'electronique':
    case 'électronique':
    case 'audio':
    case 'computing':
    case 'smart-home':
    case 'smartphones':
    case 'gaming':
    case 'informatique':
      return 'Electronics';
    case 'fashion':
    case 'mode':
    case 'clothing':
    case 'vêtements':
    case 'vetements':
      return 'Fashion';
    case 'books':
    case 'livres':
    case 'reading':
      return 'Books';
    case 'home':
    case 'maison':
    case 'deco':
    case 'décors':
      return 'Home';
    case 'beauty':
    case 'beaute':
    case 'beauté':
    case 'soins':
    case 'cosmetique':
      return 'Beauty';
    case 'sports':
    case 'sport':
    case 'fitness':
      return 'Sports';
    case 'accessories':
    case 'accessoires':
    case 'lifestyle':
    case 'bijoux':
    case 'montres':
      return 'Accessories';
    case 'digital':
    case 'numerique':
    case 'numérique':
    case 'software':
      return 'Digital';
    case 'other':
    case 'divers':
    case 'autre':
    case 'autres':
      return 'Other';
    default:
      const match = PRODUCT_CATEGORIES.find((c) => c.toLowerCase() === clean);
      return match || 'Other';
  }
}
