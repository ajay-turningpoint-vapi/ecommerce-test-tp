import { useSyncExternalStore } from 'react';
import { categories, subCategories, subscribe, getVersion } from '@/data/adminSharedData';
import type { Category, SubCategory } from '@/types';

/**
 * Returns the shared mutable categories/subCategories arrays.
 * Re-renders when admin panel mutates data.
 */
export function useDbCategories() {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return {
    data: {
      categories: categories as Category[],
      subCategories: subCategories as SubCategory[],
    },
    isLoading: false,
    error: null,
  };
}
