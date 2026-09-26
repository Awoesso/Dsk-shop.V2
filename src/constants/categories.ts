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
    itemCount: 0,
    description: 'Smartphones, audio, informatique et accessoires technologiques.',
    image: '',
  },
  {
    id: 'Fashion',
    name: 'Fashion',
    slug: 'fashion',
    iconName: 'Shirt',
    itemCount: 0,
    description: 'Vêtements, chaussures et mode urbaine.',
    image: '',
  },
  {
    id: 'Books',
    name: 'Books',
    slug: 'books',
    iconName: 'BookOpen',
    itemCount: 0,
    description: 'Livres et papeterie.',
    image: '',
  },
  {
    id: 'Home',
    name: 'Home',
    slug: 'home',
    iconName: 'Home',
    itemCount: 0,
    description: 'Maison, décoration et équipement.',
    image: '',
  },
  {
    id: 'Beauty',
    name: 'Beauty',
    slug: 'beauty',
    iconName: 'Sparkles',
    itemCount: 0,
    description: 'Soins, beauté et bien-être.',
    image: '',
  },
  {
    id: 'Sports',
    name: 'Sports',
    slug: 'sports',
    iconName: 'Activity',
    itemCount: 0,
    description: 'Sport, fitness et accessoires extérieurs.',
    image: '',
  },
  {
    id: 'Accessories',
    name: 'Accessories',
    slug: 'accessories',
    iconName: 'Watch',
    itemCount: 0,
    description: 'Montres, maroquinerie, bijoux et sacs.',
    image: '',
  },
  {
    id: 'Digital',
    name: 'Digital',
    slug: 'digital',
    iconName: 'Cpu',
    itemCount: 0,
    description: 'Services et produits numériques.',
    image: '',
  },
  {
    id: 'Other',
    name: 'Other',
    slug: 'other',
    iconName: 'Package',
    itemCount: 0,
    description: 'Articles divers et nouveautés.',
    image: '',
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
      return 'Electronics';
    case 'fashion':
    case 'mode':
    case 'streetwear':
    case 'chaussures':
    case 'habits':
      return 'Fashion';
    case 'books':
    case 'livres':
      return 'Books';
    case 'home':
    case 'maison':
      return 'Home';
    case 'beauty':
    case 'beauté':
    case 'parfums':
      return 'Beauty';
    case 'sports':
    case 'sport':
    case 'fitness':
      return 'Sports';
    case 'accessories':
    case 'accessoires':
    case 'montres':
    case 'coques':
      return 'Accessories';
    case 'digital':
    case 'numerique':
    case 'numérique':
      return 'Digital';
    default:
      return 'Other';
  }
}
