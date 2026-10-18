import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CartItem, ProductVariant } from '../types';

export interface UseStoreCartReturn {
  cart: CartItem[];
  cartSubtotal: number;
  cartTotal: number;
  cartItemCount: number;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => boolean;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  storeId: string;
}

const CART_EVENT_NAME = 'nexa_cart_updated';

/**
 * Dispatches a cross-component notification within the current window
 * to keep store cart badges, drawers, and views synchronized.
 */
function notifyCartChange(storeId: string) {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent(CART_EVENT_NAME, { detail: { storeId } }));
    } catch {
      // Safe fallback
    }
  }
}

/**
 * Safely reads the isolated cart for a given storeId from localStorage.
 */
function readStoreCartFromStorage(storeId: string): CartItem[] {
  if (!storeId || typeof storeId !== 'string' || typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(`nexa_cart_${storeId}`);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter and sanitize: every item must have a valid product and belong to this store
    return parsed.filter((item: any) => {
      return item && item.product && typeof item.product.id === 'string' && typeof item.quantity === 'number';
    }).map((item: CartItem) => ({
      ...item,
      store_id: storeId,
      product: {
        ...item.product,
        store_id: storeId,
      },
    }));
  } catch (err) {
    console.warn(`[useStoreCart] Erreur de lecture du panier pour la boutique ${storeId}:`, err);
    return [];
  }
}

/**
 * Safely writes the isolated cart to localStorage under nexa_cart_{storeId}.
 */
function writeStoreCartToStorage(storeId: string, items: CartItem[]): void {
  if (!storeId || typeof storeId !== 'string' || typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(`nexa_cart_${storeId}`, JSON.stringify(items));
    notifyCartChange(storeId);
  } catch (err) {
    console.warn(`[useStoreCart] Erreur d'écriture du panier pour la boutique ${storeId}:`, err);
  }
}

/**
 * Specialized hook for store-isolated carts in Nexa / DSK-Shop.
 * Persists under 'nexa_cart_${storeId}'.
 * Guarantees zero leakage between different stores.
 */
export function useStoreCart(storeId: string): UseStoreCartReturn {
  const cleanStoreId = typeof storeId === 'string' ? storeId.trim() : '';

  const [cart, setCart] = useState<CartItem[]>(() => {
    return readStoreCartFromStorage(cleanStoreId);
  });

  // Re-read storage whenever storeId changes
  useEffect(() => {
    if (!cleanStoreId) {
      setCart([]);
      return;
    }
    setCart(readStoreCartFromStorage(cleanStoreId));
  }, [cleanStoreId]);

  // Listen to same-window and cross-tab storage changes for this storeId
  useEffect(() => {
    if (!cleanStoreId || typeof window === 'undefined') return;

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.storeId === cleanStoreId) {
        setCart(readStoreCartFromStorage(cleanStoreId));
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `nexa_cart_${cleanStoreId}`) {
        setCart(readStoreCartFromStorage(cleanStoreId));
      }
    };

    window.addEventListener(CART_EVENT_NAME, handleCustomChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(CART_EVENT_NAME, handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [cleanStoreId]);

  const addToCart = useCallback(
    (product: Product, quantity = 1, variant?: ProductVariant): boolean => {
      if (!cleanStoreId) {
        console.warn('[useStoreCart] Impossible d’ajouter au panier : aucun storeId actif.');
        return false;
      }

      const maxStock = product.stockCount > 0 ? product.stockCount : 99;
      let added = false;

      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product.id === product.id && (item.selectedVariant?.id ?? null) === (variant?.id ?? null)
        );

        let nextCart: CartItem[];

        if (existingIndex > -1) {
          const currentQty = prev[existingIndex].quantity;
          const newQty = Math.min(currentQty + quantity, maxStock);
          nextCart = [...prev];
          nextCart[existingIndex] = {
            ...nextCart[existingIndex],
            quantity: newQty,
            store_id: cleanStoreId,
          };
          added = true;
        } else {
          const itemQuantity = Math.min(Math.max(1, quantity), maxStock);
          const newItem: CartItem = {
            product: {
              ...product,
              store_id: cleanStoreId,
            },
            quantity: itemQuantity,
            selectedVariant: variant,
            store_id: cleanStoreId,
          };
          nextCart = [...prev, newItem];
          added = true;
        }

        writeStoreCartToStorage(cleanStoreId, nextCart);
        return nextCart;
      });

      return added;
    },
    [cleanStoreId]
  );

  const removeFromCart = useCallback(
    (productId: string, variantId?: string) => {
      if (!cleanStoreId) return;

      setCart((prev) => {
        const nextCart = prev.filter((item) => {
          const matchesProduct = item.product.id === productId;
          const matchesVariant = (item.selectedVariant?.id ?? null) === (variantId ?? null);
          return !(matchesProduct && matchesVariant);
        });
        writeStoreCartToStorage(cleanStoreId, nextCart);
        return nextCart;
      });
    },
    [cleanStoreId]
  );

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number, variantId?: string) => {
      if (!cleanStoreId) return;

      if (quantity <= 0) {
        removeFromCart(productId, variantId);
        return;
      }

      setCart((prev) => {
        const nextCart = prev.map((item) => {
          const matchesProduct = item.product.id === productId;
          const matchesVariant = (item.selectedVariant?.id ?? null) === (variantId ?? null);
          if (matchesProduct && matchesVariant) {
            const maxStock = item.product.stockCount > 0 ? item.product.stockCount : 99;
            const validQty = Math.min(Math.max(1, quantity), maxStock);
            return { ...item, quantity: validQty, store_id: cleanStoreId };
          }
          return item;
        });
        writeStoreCartToStorage(cleanStoreId, nextCart);
        return nextCart;
      });
    },
    [cleanStoreId, removeFromCart]
  );

  const clearCart = useCallback(() => {
    if (!cleanStoreId) return;
    setCart([]);
    writeStoreCartToStorage(cleanStoreId, []);
  }, [cleanStoreId]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const unitPrice = Math.max(0, item.product.price + (item.selectedVariant?.priceModifier || 0));
      return acc + unitPrice * item.quantity;
    }, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cartSubtotal;
  }, [cartSubtotal]);

  return {
    cart,
    cartSubtotal,
    cartTotal,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    storeId: cleanStoreId,
  };
}
