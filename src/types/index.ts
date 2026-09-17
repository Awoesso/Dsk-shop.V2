export interface ProductReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'storage' | 'style';
  value: string;
  inStock: boolean;
  priceModifier?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  category: string;
  subcategory?: string;
  inStock: boolean;
  stockCount: number;
  description: string;
  features: string[];
  specs: Record<string, string>;
  images: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  variants?: ProductVariant[];
  reviews?: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  itemCount: number;
  description: string;
  image: string;
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

export interface FilterState {
  category: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
  minRating: number;
  inStockOnly: boolean;
  selectedBrand?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
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

export type ActivePage = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'order-success' | 'wishlist' | 'about' | 'contact';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  actionLabel?: string;
  onAction?: () => void;
}
