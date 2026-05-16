import { useSyncExternalStore } from 'react';
import { getVersion, subscribe } from '@/data/adminSharedData';

/** Forces a re-render whenever adminSharedData is mutated via addItem/updateItem/deleteItem. */
export function useAdminStore() {
  useSyncExternalStore(subscribe, getVersion, getVersion);
}
