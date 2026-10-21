import { useCallback, useMemo, useState, useEffect } from 'react';
import { Product, CartItem, ProductVariant } from '../types';
import {
  useStoreCartContext,
  readStoreCartFromStorage,
  writeStoreCartToStorage,
  getStoreCartStorageKey,
} from '../context/StoreCartContext';

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

const EMPTY_CART: CartItem[] = [];

/**
 * Multi-tenant isolated store cart hook for Nexa / DSK-Shop.
 * 
 * When mounted within a StoreResolver / StoreCartProvider, consumes the synchronized
 * context directly (preventing setState-in-render and duplicate external subscriptions).
 * When mounted standalone or with an explicit storeId, falls back to storage-backed state.
 */
export function useStoreCart(storeId?: string): UseStoreCartReturn {
  const context = useStoreCartContext();
  const cleanStoreId = typeof storeId === 'string' ? storeId.trim() : '';

  // If context is present and matches the requested storeId (or no storeId was provided):
  const shouldUseContext = context && (!cleanStoreId || context.storeId === cleanStoreId);

  // Standalone fallback state when outside StoreCartProvider
  const [standaloneCart, setStandaloneCart] = useState<CartItem[]>(() => {
    if (shouldUseContext) return EMPTY_CART;
    return readStoreCartFromStorage(cleanStoreId);
  });

  useEffect(() => {
    if (shouldUseContext) return;
    setStandaloneCart(readStoreCartFromStorage(cleanStoreId));
  }, [cleanStoreId, shouldUseContext]);

  useEffect(() => {
    if (shouldUseContext || typeof window === 'undefined' || !cleanStoreId) return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === getStoreCartStorageKey(cleanStoreId)) {
        setStandaloneCart(readStoreCartFromStorage(cleanStoreId));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [cleanStoreId, shouldUseContext]);

  const standaloneAddToCart = useCallback(
    (product: Product, quantity = 1, variant?: ProductVariant): boolean => {
      if (!cleanStoreId) {
        console.warn('[useStoreCart] Impossible d’ajouter au panier : aucun storeId actif.');
        return false;
      }

      const maxStock = product.stockCount > 0 ? product.stockCount : 99;

      setStandaloneCart((currentItems) => {
        const existingIndex = currentItems.findIndex(
          (item) =>
            item.product.id === product.id &&
            (item.selectedVariant?.id ?? null) === (variant?.id ?? null)
        );

        let nextCart: CartItem[];

        if (existingIndex > -1) {
          const currentQty = currentItems[existingIndex].quantity;
          const newQty = Math.min(currentQty + quantity, maxStock);
          nextCart = [...currentItems];
          nextCart[existingIndex] = {
            ...nextCart[existingIndex],
            quantity: newQty,
            store_id: cleanStoreId,
          };
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
          nextCart = [...currentItems, newItem];
        }

        writeStoreCartToStorage(cleanStoreId, nextCart);
        return nextCart;
      });

      return true;
    },
    [cleanStoreId]
  );

  const standaloneRemoveFromCart = useCallback(
    (productId: string, variantId?: string) => {
      if (!cleanStoreId) return;

      setStandaloneCart((currentItems) => {
        const nextCart = currentItems.filter((item) => {
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

  const standaloneUpdateCartQuantity = useCallback(
    (productId: string, quantity: number, variantId?: string) => {
      if (!cleanStoreId) return;

      if (quantity <= 0) {
        standaloneRemoveFromCart(productId, variantId);
        return;
      }

      setStandaloneCart((currentItems) => {
        const nextCart = currentItems.map((item) => {
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
    [cleanStoreId, standaloneRemoveFromCart]
  );

  const standaloneClearCart = useCallback(() => {
    if (!cleanStoreId) return;
    setStandaloneCart([]);
    writeStoreCartToStorage(cleanStoreId, []);
  }, [cleanStoreId]);

  const standaloneCartSubtotal = useMemo(() => {
    return standaloneCart.reduce((acc, item) => {
      const unitPrice = Math.max(
        0,
        item.product.price + (item.selectedVariant?.priceModifier || 0)
      );
      return acc + unitPrice * item.quantity;
    }, 0);
  }, [standaloneCart]);

  const standaloneCartItemCount = useMemo(() => {
    return standaloneCart.reduce((acc, item) => acc + item.quantity, 0);
  }, [standaloneCart]);

  if (shouldUseContext) {
    return context!;
  }

  return {
    cart: standaloneCart,
    cartSubtotal: standaloneCartSubtotal,
    cartTotal: standaloneCartSubtotal,
    cartItemCount: standaloneCartItemCount,
    addToCart: standaloneAddToCart,
    removeFromCart: standaloneRemoveFromCart,
    updateCartQuantity: standaloneUpdateCartQuantity,
    clearCart: standaloneClearCart,
    storeId: cleanStoreId,
  };
}
