import { useState, useEffect, useRef } from 'react';
import { getCachedOpportunities, setCachedOpportunities } from '../storage/prefs';

type CacheState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isStale: boolean;
};

type CacheConfig = {
  ttlMs: number;
  strategy: 'stale-while-revalidate' | 'cache-first';
};

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  config: CacheConfig = { ttlMs: CACHE_TTL, strategy: 'stale-while-revalidate' }
): CacheState<T> & { refresh: () => Promise<void> } {
  const [state, setState] = useState<CacheState<T>>({
    data: null,
    loading: true,
    error: null,
    isStale: false,
  });

  const mounted = useRef(true);

  const refresh = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const fresh = await fetcher();
      await setCachedOpportunities(fresh);
      if (mounted.current) {
        setState({ data: fresh, loading: false, error: null, isStale: false });
      }
    } catch (err) {
      if (mounted.current) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err as Error,
          isStale: true,
        }));
      }
    }
  };

  useEffect(() => {
    mounted.current = true;

    const load = async () => {
      const cached = await getCachedOpportunities<T>();
      const isStale =
        !cached.timestamp || Date.now() - cached.timestamp > config.ttlMs;

      if (cached.data) {
        setState({ data: cached.data, loading: false, error: null, isStale });
      }

      if (config.strategy === 'stale-while-revalidate' || !cached.data) {
        try {
          const fresh = await fetcher();
          await setCachedOpportunities(fresh);
          if (mounted.current) {
            setState({ data: fresh, loading: false, error: null, isStale: false });
          }
        } catch (err) {
          if (mounted.current && !cached.data) {
            setState({ data: null, loading: false, error: err as Error, isStale: false });
          }
        }
      }
    };

    load();

    return () => {
      mounted.current = false;
    };
  }, [key]);

  return { ...state, refresh };
}
