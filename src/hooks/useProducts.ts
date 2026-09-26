import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '../types';
import { ProductsService, GetProductsOptions } from '../services/products.service';

export function useProducts(options: GetProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const response = await ProductsService.getProducts(options);
    if (!isMountedRef.current) return;
    if (response.error) {
      setError(response.error);
    } else {
      setProducts(response.data);
      setTotalCount(response.totalCount);
    }
    setIsLoading(false);
  }, [
    options.page,
    options.limit,
    options.category,
    options.searchQuery,
    options.minPrice,
    options.maxPrice,
    options.sortBy,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    totalCount,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}
