import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CartItem, ProductVariant } from '../types';

export interface StoreCartContextValue {
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

const StoreCartContext = createContext<StoreCartContextValue | null>(null);

const EMPTY_CART: CartItem[] = [];

export function getStoreCartStorageKey(storeId: string): string {
  return `nexa_cart_${storeId}`;
}

export function readStoreCartFromStorage(storeId: string): CartItem[] {
  if (!storeId || typeof storeId !== 'string' || typeof window === 'undefined') {
    return EMPTY_CART;
  }

  try {
    const raw = localStorage.getItem(getStoreCartStorageKey(storeId));
    if (!raw) return EMPTY_CART;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_CART;

    return parsed
      .filter((item: any) => {
        return (
          item &&
          item.product &&
          typeof item.product.id === 'string' &&
          typeof item.quantity === 'number'
        );
      })
      .map((item: CartItem) => ({
        ...item,
        store_id: storeId,
        product: {
          ...item.product,
          store_id: storeId,
        },
      }));
  } catch {
    return EMPTY_CART;
  }
}

export function writeStoreCartToStorage(storeId: string, items: CartItem[]): void {
  if (!storeId || typeof storeId !== 'string' || typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(getStoreCartStorageKey(storeId), JSON.stringify(items));
  } catch (err) {
    console.warn(`[StoreCartContext] Erreur d'écriture du panier pour la boutique ${storeId}:`, err);
  }
}

export interface StoreCartProviderProps {
  storeId: string;
  children?: React.ReactNode;
}

export const StoreCartProvider: React.FC<StoreCartProviderProps> = ({ storeId, children }) => {
  const cleanStoreId = typeof storeId === 'string' ? storeId.trim() : '';

  const [cart, setCart] = useState<CartItem[]>(() => {
    return readStoreCartFromStorage(cleanStoreId);
  });

  // Re-synchronize when storeId changes
  useEffect(() => {
    setCart(readStoreCartFromStorage(cleanStoreId));
  }, [cleanStoreId]);

  // Sync across browser tabs or windows for the same store
  useEffect(() => {
    if (typeof window === 'undefined' || !cleanStoreId) return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === getStoreCartStorageKey(cleanStoreId)) {
        setCart(readStoreCartFromStorage(cleanStoreId));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [cleanStoreId]);

  const addToCart = useCallback(
    (product: Product, quantity = 1, variant?: ProductVariant): boolean => {
      if (!cleanStoreId) {
        console.warn('[StoreCart] Impossible d’ajouter au panier : aucun storeId actif.');
        return false;
      }

      const maxStock = product.stockCount > 0 ? product.stockCount : 99;

      setCart((currentItems) => {
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

  const removeFromCart = useCallback(
    (productId: string, variantId?: string) => {
      if (!cleanStoreId) return;

      setCart((currentItems) => {
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

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number, variantId?: string) => {
      if (!cleanStoreId) return;

      if (quantity <= 0) {
        removeFromCart(productId, variantId);
        return;
      }

      setCart((currentItems) => {
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
    [cleanStoreId, removeFromCart]
  );

  const clearCart = useCallback(() => {
    if (!cleanStoreId) return;
    setCart([]);
    writeStoreCartToStorage(cleanStoreId, []);
  }, [cleanStoreId]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const unitPrice = Math.max(
        0,
        item.product.price + (item.selectedVariant?.priceModifier || 0)
      );
      return acc + unitPrice * item.quantity;
    }, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cartSubtotal;
  }, [cartSubtotal]);

  const value = useMemo<StoreCartContextValue>(() => {
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
  }, [
    cart,
    cartSubtotal,
    cartTotal,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cleanStoreId,
  ]);

  return <StoreCartContext.Provider value={value}>{children}</StoreCartContext.Provider>;
};

export function useStoreCartContext(): StoreCartContextValue | null {
  return useContext(StoreCartContext);
}
