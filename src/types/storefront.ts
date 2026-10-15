import { Product, ProductCategory } from './index';

export type TemplateId = 'fashion' | 'tech' | 'general' | string;

export type TemplateCategory =
  | 'fashion'
  | 'tech'
  | 'general'
  | 'beauty'
  | 'food'
  | 'lifestyle'
  | 'other';

export type HeadingFontFamily =
  | 'Montserrat'
  | 'Inter'
  | 'Playfair Display'
  | 'Plus Jakarta Sans'
  | 'Syne'
  | 'Space Grotesk';

export type BodyFontFamily =
  | 'Inter'
  | 'Plus Jakarta Sans'
  | 'Roboto'
  | 'Montserrat';

export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ContentWidth = 'compact' | 'standard' | 'wide';
export type SpacingScale = 'compact' | 'comfortable' | 'spacious';
export type ProductCardStyle = 'standard' | 'minimal' | 'bordered' | 'elevated';
export type ProductLayout = 'grid' | 'list';

export interface StoreThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
}

export interface StoreThemeTypography {
  headingFont: HeadingFontFamily;
  bodyFont: BodyFontFamily;
}

export interface StoreThemeShape {
  buttonRadius: ButtonRadius;
  cardRadius: CardRadius;
}

export interface StoreThemeLayout {
  contentWidth: ContentWidth;
  spacing: SpacingScale;
  productCardStyle: ProductCardStyle;
  productGridColumns: 2 | 3 | 4;
  productLayout: ProductLayout;
}

export interface StoreThemeSections {
  showHeroBanner: boolean;
  showBrandStory: boolean;
  showFeaturedGrid: boolean;
  showCategoryPills: boolean;
  showPromoBanner: boolean;
  showNewsletter: boolean;
  showTrustBadges: boolean;
  showContactCta: boolean;
}

export interface StoreTheme {
  templateId: TemplateId;
  colors: StoreThemeColors;
  typography: StoreThemeTypography;
  shape: StoreThemeShape;
  layout: StoreThemeLayout;
  sections: StoreThemeSections;
  customCss?: string;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface StoreSocialLinks {
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
  website?: string;
}

export interface StoreIdentity {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  currency: string;
  socialLinks?: StoreSocialLinks;
  isPublished: boolean;
  owner_id?: string | null;
  status?: string | null;
}

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  itemCount?: number;
  image?: string;
}

export interface Storefront {
  identity: StoreIdentity;
  theme: StoreTheme;
  categories: StoreCategory[];
  products: Product[];
  featuredProducts: Product[];
}

export interface TemplateProps {
  storefront: Storefront;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: (productId: string) => boolean;
  onSelectProduct?: (product: Product) => void;
  onSearch?: (query: string) => void;
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
  searchQuery?: string;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  slug: string;
  description: string;
  category: TemplateCategory;
  version: string;
  author: string;
  previewImage: string;
  component: React.ComponentType<TemplateProps>;
  defaultTheme: StoreTheme;
  supportedFeatures: string[];
  isAvailable: boolean;
}

export interface StorefrontConfig {
  id?: string;
  store_id: string;
  template_id: TemplateId;
  theme_settings: StoreTheme;
  version: number;
  created_at?: string;
  updated_at?: string;
}
