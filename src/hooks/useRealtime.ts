import { useEffect, useRef } from 'react';
import { ProductsService } from '../services/products.service';

export interface RealtimeProductEvent {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  newRow: any;
  oldRow: any;
}

export function useRealtime(
  onProductChange: (event: RealtimeProductEvent) => void,
  enabled: boolean = true
) {
  const callbackRef = useRef(onProductChange);
  callbackRef.current = onProductChange;

  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = ProductsService.subscribeToProducts((event) => {
      callbackRef.current(event);
    });

    return () => {
      unsubscribe();
    };
  }, [enabled]);
}
