import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '../types';
import { ProductsService } from '../services/products.service';

export function useProduct(slugOrId: string | null | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(slugOrId));
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchProduct = useCallback(async () => {
    if (!slugOrId) {
      if (isMountedRef.current) {
        setProduct(null);
        setIsLoading(false);
      }
      return;
    }
    setIsLoading(true);
    setError(null);
    const response = await ProductsService.getProductBySlug(slugOrId);
    if (!isMountedRef.current) return;
    if (response.error) {
      setError(response.error);
      setProduct(null);
    } else {
      setProduct(response.data);
    }
    setIsLoading(false);
  }, [slugOrId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}
