import { useSyncExternalStore } from 'react';
import { products, subscribe, getVersion } from '@/data/adminSharedData';
import type { Product } from '@/types';

/**
 * Returns the shared mutable products array.
 * Re-renders when admin panel mutates data via addItem/updateItem/deleteItem.
 */
export function useDbProducts() {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return {
    data: products as Product[],
    isLoading: false,
    error: null,
  };
}

export function useDbProduct(slug: string | undefined) {
  const { data: allProducts, ...rest } = useDbProducts();
  return {
    ...rest,
    data: allProducts?.find(p => p.slug === slug),
  };
}
