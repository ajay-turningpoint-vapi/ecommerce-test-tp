import { useEffect, useState, useCallback } from 'react';

const KEY = 'recentlyViewed';
const MAX = 12;

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>(read);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setIds(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addRecent = useCallback((productId: string) => {
    setIds(prev => {
      const next = [productId, ...prev.filter(id => id !== productId)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentIds: ids, addRecent };
}
