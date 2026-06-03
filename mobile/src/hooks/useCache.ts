import { useState, useEffect, useCallback, useRef } from 'react';
import { getPref, setPref } from '../storage/prefs';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function useCache<T>(key: string, ttlMs: number) {
  const [data, setData] = useState<T | null>(null);
  const [stale, setStale] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadFromCache = useCallback(async (): Promise<T | null> => {
    const entry = await getPref<CacheEntry<T>>(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    setStale(age > ttlMs);
    return entry.data;
  }, [key, ttlMs]);

  const saveToCache = useCallback(
    async (newData: T) => {
      const entry: CacheEntry<T> = { data: newData, timestamp: Date.now() };
      await setPref(key, entry);
      if (mounted.current) {
        setData(newData);
        setStale(false);
      }
    },
    [key],
  );

  return { data, setData, stale, loadFromCache, saveToCache };
}
