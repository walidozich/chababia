import { useState, useCallback, useMemo } from 'react';
import { useCache } from './useCache';
import { keys } from '../storage/prefs';
import { api } from '../api/client';
import type { getUserToken } from '../api/identity';
import opportunitiesFixture from '../api/__fixtures__/opportunities.json';

interface Opportunity {
  id: string;
  title: string;
  category: string;
  date_ts: number;
  distance_m: number;
  slots_left: number;
  establishment_name: string;
}

interface OpportunitiesResponse {
  data: Opportunity[];
  meta: { total: number; cached_at: number };
}

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDate(ts: number, locale: string): string {
  const date = new Date(ts * 1000);
  return date.toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export interface FormattedOpportunity {
  id: string;
  title: string;
  category: string;
  date: string;
  distance: string;
  slotsLeft: number;
  establishmentName: string;
}

export function useOpportunities() {
  const { data: rawData, stale, saveToCache } = useCache<Opportunity[]>(
    keys.cacheOpportunities,
    CACHE_TTL,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(
    async (token: Awaited<ReturnType<typeof getUserToken>>, locale: string) => {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await api.get<OpportunitiesResponse>('/opportunities', {
        Authorization: `Bearer ${token}`,
      });

      if (apiError || !data) {
        // fallback to fixtures for development
        const fallback = opportunitiesFixture as OpportunitiesResponse;
        await saveToCache(fallback.data);
        setLoading(false);
        return;
      }

      await saveToCache(data.data);
      setLoading(false);
    },
    [saveToCache],
  );

  const formatted = useMemo<FormattedOpportunity[]>(
    () =>
      rawData
        ? rawData.map(
            (item): FormattedOpportunity => ({
              id: item.id,
              title: item.title,
              category: item.category,
              date: formatDate(item.date_ts, 'fr'),
              distance: formatDistance(item.distance_m),
              slotsLeft: item.slots_left,
              establishmentName: item.establishment_name,
            }),
          )
        : [],
    [rawData],
  );

  const filterByCategory = useCallback(
    (category: string | null): FormattedOpportunity[] => {
      if (!category) return formatted;
      return formatted.filter((item) => item.category === category);
    },
    [formatted],
  );

  return {
    opportunities: formatted,
    filterByCategory,
    loading,
    error,
    stale,
    fetchOpportunities,
  };
}
