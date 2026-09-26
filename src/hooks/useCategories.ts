import { useState, useEffect, useCallback, useRef } from 'react';
import { Category } from '../types';
import { CategoriesService } from '../services/categories.service';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const res = await CategoriesService.getCategories();
    if (!isMountedRef.current) return;
    if (res.error) {
      setError(res.error);
    } else {
      setCategories(res.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}
