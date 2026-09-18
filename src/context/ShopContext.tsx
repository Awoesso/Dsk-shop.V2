import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CartItem, ProductVariant, FilterState, ActivePage, Order, ShippingAddress, PaymentMethod, ToastMessage, ProductReview } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { USD_TO_FCFA_RATE } from '../utils/currency';

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
  isFreeShipping: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isInitialLoading: boolean;
  isPageLoading: boolean;
  pageLoading: ActivePage | null;
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
  removePromoCode: () => void;
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

const isSessionAlreadyInitialized = (): boolean => {
  try {
    return sessionStorage.getItem('dsk_session_initialized') === 'true';
  } catch {
    return false;
  }
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [promoDiscount, setPromoDiscount] = useState<{ code: string; percent: number } | null>(() => {
    try {
      const saved = localStorage.getItem('dsk_promo');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  // Initial Full-Screen Loader state (only for the very first visit of this browser session)
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(() => {
    return !isSessionAlreadyInitialized();
  });

  // Page Skeleton Loading state (used exclusively for subsequent route transitions)
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<ActivePage | null>(null);
  const [cachedPages, setCachedPages] = useState<Set<string>>(() => new Set(['home']));
  const [cachedProductIds, setCachedProductIds] = useState<Set<string>>(() => new Set());

  // Backward compatibility flag
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loadingTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial app load simulation for first session visit
  useEffect(() => {
    if (!isSessionAlreadyInitialized()) {
      const timer = setTimeout(() => {
        try {
          sessionStorage.setItem('dsk_session_initialized', 'true');
        } catch {
          // ignore
        }
        setIsInitialLoading(false);
      }, 850);
      return () => clearTimeout(timer);
    } else {
      setIsInitialLoading(false);
    }
  }, []);

  const triggerLoading = useCallback((duration = 380) => {
    setIsLoading(true);
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, duration);
  }, []);

  const refreshCatalog = useCallback(() => {
    setIsPageLoading(true);
    setPageLoading('shop');
    setIsLoading(true);
    showToast('Actualisation du catalogue...', 'info');
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => {
      setIsPageLoading(false);
      setPageLoading(null);
      setIsLoading(false);
    }, 450);
  }, [showToast]);

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

  useEffect(() => {
    try {
      if (promoDiscount) {
        localStorage.setItem('dsk_promo', JSON.stringify(promoDiscount));
      } else {
        localStorage.removeItem('dsk_promo');
      }
    } catch {
      // ignore
    }
  }, [promoDiscount]);

  // Navigation with elegant page skeleton transition
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

    // Scroll to top immediately
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Activate Skeleton for the targeted page during transition
    setActivePage(page);
    setIsPageLoading(true);
    setPageLoading(page);
    setIsLoading(true);

    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => {
      setIsPageLoading(false);
      setPageLoading(null);
      setIsLoading(false);
      setCachedPages((prev) => new Set(prev).add(page));
    }, 280);
  }, []);

  const openProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setActivePage('product');
    setIsPageLoading(true);
    setPageLoading('product');
    setIsLoading(true);

    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => {
      setIsPageLoading(false);
      setPageLoading(null);
      setIsLoading(false);
      setCachedProductIds((prev) => new Set(prev).add(product.id));
      setCachedPages((prev) => new Set(prev).add('product'));
    }, 280);
  }, []);

  // Cart Management
  const addToCart = useCallback((product: Product, quantity = 1, variant?: ProductVariant) => {
    const maxStock = product.stockCount > 0 ? product.stockCount : 99;
    let reachedLimit = false;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && (item.selectedVariant?.id ?? null) === (variant?.id ?? null)
      );

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = currentQty + quantity;
        if (newQty > maxStock) {
          reachedLimit = true;
          if (currentQty >= maxStock) {
            return prev;
          }
        }
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: Math.min(newQty, maxStock) };
        return updated;
      }

      if (quantity > maxStock) {
        reachedLimit = true;
      }
      return [...prev, { product, quantity: Math.min(quantity, maxStock), selectedVariant: variant }];
    });

    if (reachedLimit) {
      showToast(`Stock maximum atteint (${maxStock} unités) pour cet article`, 'warning');
    } else {
      showToast(`« ${product.name.slice(0, 24)}... » ajouté au panier !`, 'success', 'Voir Panier', () => {
        setIsCartOpen(true);
      });
    }
  }, [showToast]);

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        const matchesProduct = item.product.id === productId;
        const matchesVariant = (item.selectedVariant?.id ?? null) === (variantId ?? null);
        return !(matchesProduct && matchesVariant);
      })
    );
    showToast('Article retiré du panier', 'info');
  }, [showToast]);

  const updateCartQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        const matchesProduct = item.product.id === productId;
        const matchesVariant = (item.selectedVariant?.id ?? null) === (variantId ?? null);
        if (matchesProduct && matchesVariant) {
          const maxStock = item.product.stockCount > 0 ? item.product.stockCount : 99;
          const validQty = Math.min(Math.max(1, quantity), maxStock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    showToast('Le panier a été vidé', 'info');
  }, [showToast]);

  // Wishlist
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Retiré des favoris', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        const prod = products.find((p) => p.id === productId);
        showToast(`« ${prod ? prod.name.slice(0, 20) : 'Article'} » ajouté aux favoris !`, 'success');
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

  // Calculations:
  // 1. cartSubtotal: Sum of (unit price with variant modifier) * quantity
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const unitPrice = Math.max(0, item.product.price + (item.selectedVariant?.priceModifier || 0));
      return acc + unitPrice * item.quantity;
    }, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const isFreeShipping = useMemo(() => {
    return cart.length > 0 && cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  }, [cart.length, cartSubtotal]);

  const freeShippingRemaining = useMemo(() => {
    if (cart.length === 0) return FREE_SHIPPING_THRESHOLD;
    return Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  }, [cart.length, cartSubtotal]);

  const shippingCost = useMemo(() => {
    if (cart.length === 0) return 0;
    return isFreeShipping ? 0 : STANDARD_SHIPPING_FLAT;
  }, [cart.length, isFreeShipping]);

  // Exact FCFA parity for discount and total:
  // Subtotal FCFA - Discount FCFA + Shipping FCFA = Total FCFA (Exact to the single FCFA)
  const discountAmount = useMemo(() => {
    if (!promoDiscount || cart.length === 0 || cartSubtotal === 0) return 0;
    const subtotalFCFA = Math.round(cartSubtotal * USD_TO_FCFA_RATE);
    const discountFCFA = Math.round((subtotalFCFA * promoDiscount.percent) / 100);
    return discountFCFA / USD_TO_FCFA_RATE;
  }, [cart.length, cartSubtotal, promoDiscount]);

  const cartTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    const subtotalFCFA = Math.round(cartSubtotal * USD_TO_FCFA_RATE);
    const discountFCFA = promoDiscount ? Math.round((subtotalFCFA * promoDiscount.percent) / 100) : 0;
    const shippingFCFA = isFreeShipping ? 0 : Math.round(STANDARD_SHIPPING_FLAT * USD_TO_FCFA_RATE);
    const totalFCFA = Math.max(0, subtotalFCFA - discountFCFA + shippingFCFA);
    return totalFCFA / USD_TO_FCFA_RATE;
  }, [cart.length, cartSubtotal, promoDiscount, isFreeShipping]);

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
    if (!cleanCode) return false;

    if (cleanCode === 'DSK15' || cleanCode === 'SAVE15') {
      setPromoDiscount({ code: cleanCode, percent: 15 });
      showToast('Code promo DSK15 appliqué : 15% de réduction !', 'success');
      return true;
    } else if (cleanCode === 'WELCOME10' || cleanCode === 'BIENVENUE10') {
      setPromoDiscount({ code: cleanCode, percent: 10 });
      showToast('Code de bienvenue appliqué : 10% de réduction !', 'success');
      return true;
    } else if (cleanCode === 'VIP25') {
      setPromoDiscount({ code: cleanCode, percent: 25 });
      showToast('Code VIP Privilège appliqué : 25% de réduction !', 'success');
      return true;
    } else if (cleanCode === 'DSK20' || cleanCode === 'PROMO20') {
      setPromoDiscount({ code: cleanCode, percent: 20 });
      showToast('Code promo spécial appliqué : 20% de réduction !', 'success');
      return true;
    } else if (cleanCode === 'LOME5' || cleanCode === 'DSK5') {
      setPromoDiscount({ code: cleanCode, percent: 5 });
      showToast('Code fidélité appliqué : 5% de réduction !', 'success');
      return true;
    } else {
      showToast('Code promo invalide. Essayez « DSK15 », « BIENVENUE10 » ou « VIP25 »', 'warning');
      return false;
    }
  }, [showToast]);

  const removePromoCode = useCallback(() => {
    setPromoDiscount(null);
    try {
      localStorage.removeItem('dsk_promo');
    } catch {
      // ignore
    }
    showToast('Code promo retiré', 'info');
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
      date: now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...cart],
      subtotal: cartSubtotal,
      shipping: shippingCost,
      discount: discountAmount,
      total: cartTotal,
      shippingAddress: shipping,
      paymentMethod: payment,
      status: 'confirmed',
      estimatedDelivery: deliveryDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    setLastOrder(newOrder);
    setCart([]);
    setPromoDiscount(null);
    try {
      localStorage.removeItem('dsk_promo');
    } catch {
      // ignore
    }
    setActivePage('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Commande #${orderNumber} confirmée avec succès !`, 'success');
    return newOrder;
  }, [cart, cartSubtotal, shippingCost, discountAmount, cartTotal, showToast]);

  // Add Review
  const addReview = useCallback((productId: string, reviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: Math.random().toString(36).substring(2, 9),
      date: 'À l’instant',
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

    showToast('Merci ! Votre avis a été publié avec succès.', 'success');
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
        isFreeShipping,
        isLoading,
        setIsLoading,
        isInitialLoading,
        isPageLoading,
        pageLoading,
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
        removePromoCode,
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
