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

    getPref<CacheEntry<T>>(key).then((entry) => {
      if (!mounted.current) return;
      if (entry) {
        setData(entry.data);
        setStale(Date.now() - entry.timestamp > ttlMs);
      }
    });

    return () => {
      mounted.current = false;
    };
  }, [key, ttlMs]);

  const loadFromCache = useCallback(async (): Promise<T | null> => {
    const entry = await getPref<CacheEntry<T>>(key);
    if (!entry) return null;

    return entry.data;
  }, [key]);

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
