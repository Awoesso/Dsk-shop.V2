import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CartItem, ProductVariant, FilterState, ActivePage, Order, ShippingAddress, PaymentMethod, ToastMessage, ProductReview } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/products';

interface ShopContextType {
  products: Product[];
  activePage: ActivePage;
  selectedProduct: Product | null;
  cart: CartItem[];
  wishlist: string[];
  filterState: FilterState;
  isCartOpen: boolean;
  lastOrder: Order | null;
  toasts: ToastMessage[];
  promoDiscount: { code: string; percent: number } | null;
  cartSubtotal: number;
  shippingCost: number;
  discountAmount: number;
  cartTotal: number;
  cartItemCount: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  refreshCatalog: () => void;
  
  // Navigation
  navigateTo: (page: ActivePage, options?: { product?: Product; category?: string; search?: string }) => void;
  openProduct: (product: Product) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  
  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Filtering & Search
  setFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
  filteredProducts: Product[];
  
  // Checkout & Orders
  applyPromoCode: (code: string) => boolean;
  createOrder: (shipping: ShippingAddress, payment: PaymentMethod) => Order;
  
  // Review submission
  addReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;
  
  // Toasts
  showToast: (message: string, type?: 'success' | 'info' | 'warning', actionLabel?: string, onAction?: () => void) => void;
  removeToast: (id: string) => void;
}

const initialFilterState: FilterState = {
  category: 'all',
  searchQuery: '',
  minPrice: 0,
  maxPrice: 400,
  sortBy: 'featured',
  minRating: 0,
  inStockOnly: false,
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 99;
const STANDARD_SHIPPING_FLAT = 12;

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [promoDiscount, setPromoDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const loadingTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Toast system
  const showToast = useCallback((
    message: string,
    type: 'success' | 'info' | 'warning' = 'success',
    actionLabel?: string,
    onAction?: () => void
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, actionLabel, onAction }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initial load simulation for initial mount to show skeleton loaders
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const triggerLoading = useCallback((duration = 380) => {
    setIsLoading(true);
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, duration);
  }, []);

  const refreshCatalog = useCallback(() => {
    triggerLoading(600);
    showToast('Refreshing product catalog...', 'info');
  }, [triggerLoading, showToast]);

  // Local storage for cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dsk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Local storage for wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dsk_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dsk_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('dsk_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Navigation
  const navigateTo = useCallback((
    page: ActivePage,
    options?: { product?: Product; category?: string; search?: string }
  ) => {
    if (options?.product) {
      setSelectedProduct(options.product);
    }
    if (options?.category) {
      setFilterState((prev) => ({ ...prev, category: options.category! }));
    }
    if (options?.search !== undefined) {
      setFilterState((prev) => ({ ...prev, searchQuery: options.search! }));
    }
    if (page === 'shop' || page === 'home') {
      triggerLoading(350);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [triggerLoading]);

  const openProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setActivePage('product');
    triggerLoading(300);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [triggerLoading]);

  // Cart Management
  const addToCart = useCallback((product: Product, quantity = 1, variant?: ProductVariant) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });

    showToast(`Added "${product.name.slice(0, 24)}..." to your cart!`, 'success', 'View Cart', () => {
      setIsCartOpen(true);
    });
  }, [showToast]);

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && (!variantId || item.selectedVariant?.id === variantId))
      )
    );
    showToast('Item removed from cart', 'info');
  }, [showToast]);

  const updateCartQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && (!variantId || item.selectedVariant?.id === variantId)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Wishlist
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        const prod = products.find((p) => p.id === productId);
        showToast(`Saved ${prod ? prod.name.slice(0, 20) : 'item'} to wishlist!`, 'success');
        return [...prev, productId];
      }
    });
  }, [products, showToast]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  // Filters
  const setFilters = useCallback((updates: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
    triggerLoading(350);
  }, [triggerLoading]);

  const resetFilters = useCallback(() => {
    setFilterState(initialFilterState);
    triggerLoading(350);
  }, [triggerLoading]);

  // Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const modifier = item.selectedVariant?.priceModifier || 0;
      return acc + (item.product.price + modifier) * item.quantity;
    }, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const shippingCost = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FLAT;
  }, [cart.length, cartSubtotal]);

  const discountAmount = useMemo(() => {
    if (!promoDiscount) return 0;
    return (cartSubtotal * promoDiscount.percent) / 100;
  }, [cartSubtotal, promoDiscount]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + shippingCost);
  }, [cartSubtotal, discountAmount, shippingCost]);

  const freeShippingRemaining = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  }, [cartSubtotal]);

  // Filtered Products Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (filterState.category !== 'all' && product.category !== filterState.category) {
        return false;
      }

      // Search query filter
      if (filterState.searchQuery.trim()) {
        const q = filterState.searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchTags = product.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchBrand && !matchTags) {
          return false;
        }
      }

      // Price filter
      if (product.price < filterState.minPrice || product.price > filterState.maxPrice) {
        return false;
      }

      // Rating filter
      if (product.rating < filterState.minRating) {
        return false;
      }

      // In-stock filter
      if (filterState.inStockOnly && !product.inStock) {
        return false;
      }

      // Brand filter
      if (filterState.selectedBrand && product.brand !== filterState.selectedBrand) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filterState.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [products, filterState]);

  // Promo Code
  const applyPromoCode = useCallback((code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'DSK15' || cleanCode === 'SAVE15') {
      setPromoDiscount({ code: cleanCode, percent: 15 });
      showToast('15% discount applied!', 'success');
      return true;
    } else if (cleanCode === 'WELCOME10') {
      setPromoDiscount({ code: cleanCode, percent: 10 });
      showToast('10% welcome discount applied!', 'success');
      return true;
    } else if (cleanCode === 'VIP25') {
      setPromoDiscount({ code: cleanCode, percent: 25 });
      showToast('25% VIP discount applied!', 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try "DSK15" or "WELCOME10"', 'warning');
      return false;
    }
  }, [showToast]);

  // Checkout & Order Creation
  const createOrder = useCallback((shipping: ShippingAddress, payment: PaymentMethod): Order => {
    const orderNumber = `DSK-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const deliveryDate = new Date(now);
    deliveryDate.setDate(now.getDate() + 3);

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 11),
      orderNumber,
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cart],
      subtotal: cartSubtotal,
      shipping: shippingCost,
      discount: discountAmount,
      total: cartTotal,
      shippingAddress: shipping,
      paymentMethod: payment,
      status: 'confirmed',
      estimatedDelivery: deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setLastOrder(newOrder);
    setCart([]);
    setPromoDiscount(null);
    setActivePage('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Order #${orderNumber} placed successfully!`, 'success');
    return newOrder;
  }, [cart, cartSubtotal, shippingCost, discountAmount, cartTotal, showToast]);

  // Add Review
  const addReview = useCallback((productId: string, reviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: Math.random().toString(36).substring(2, 9),
      date: 'Just now',
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentReviews = p.reviews || [];
          const updatedReviews = [newRev, ...currentReviews];
          const newAvgRating = Number(
            (updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            reviewCount: p.reviewCount + 1,
            rating: newAvgRating,
          };
        }
        return p;
      })
    );

    showToast('Thank you! Your review has been submitted.', 'success');
  }, [showToast]);

  return (
    <ShopContext.Provider
      value={{
        products,
        activePage,
        selectedProduct,
        cart,
        wishlist,
        filterState,
        isCartOpen,
        lastOrder,
        toasts,
        promoDiscount,
        cartSubtotal,
        shippingCost,
        discountAmount,
        cartTotal,
        cartItemCount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        isLoading,
        setIsLoading,
        refreshCatalog,
        navigateTo,
        openProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        setIsCartOpen,
        toggleWishlist,
        isInWishlist,
        setFilters,
        resetFilters,
        filteredProducts,
        applyPromoCode,
        createOrder,
        addReview,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
