export interface ProductImageRelational {
  id?: string;
  product_id?: string;
  url?: string;
  image_url?: string;
  storage_path?: string;
  is_primary?: boolean;
  sort_order?: number | null;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'storage' | 'style';
  value: string;
  inStock: boolean;
  priceModifier?: number;
}

export type ProductCategory =
  | 'Electronics'
  | 'Fashion'
  | 'Books'
  | 'Home'
  | 'Beauty'
  | 'Sports'
  | 'Accessories'
  | 'Digital'
  | 'Other';

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: ProductCategory;
  subcategory?: string;
  inStock: boolean;
  stockCount: number;
  description: string;
  features: string[];
  specs: Record<string, string>;
  primaryImage?: string;
  images: string[];
  product_images?: ProductImageRelational[];
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  variants?: ProductVariant[];
  currency?: string;
  status?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Category {
  id: ProductCategory;
  name: ProductCategory;
  slug: string;
  iconName: string;
  itemCount: number;
  description: string;
  image: string;
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest';

export interface FilterState {
  category: ProductCategory | 'all' | string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
  inStockOnly: boolean;
  selectedBrand?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  email?: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export type PaymentMethod = 'credit_card' | 'paypal' | 'apple_pay' | 'cod';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  estimatedDelivery: string;
}

export type ActivePage =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'wishlist'
  | 'about'
  | 'contact'
  | 'account';

export * from './orders';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  actionLabel?: string;
  onAction?: () => void;
}
