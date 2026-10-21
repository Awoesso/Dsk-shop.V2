import { useState, useEffect, useCallback } from 'react';

const WISHLIST_STORAGE_KEY = 'nexa_wishlist';
const LEGACY_STORAGE_KEY = 'dsk_wishlist';

/**
 * useWishlist
 * Manages customer product favoriting in a lightweight, local-storage backed store.
 * Fully decoupled from the legacy mono-store ShopContext.
 */
export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      // Check nexa_wishlist first, then fallback to legacy dsk_wishlist
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.includes(productId);
    },
    [wishlist]
  );

  return {
    wishlist,
    toggleWishlist,
    isInWishlist,
  };
}
