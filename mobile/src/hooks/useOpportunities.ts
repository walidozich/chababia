import { useCallback } from 'react';
import { apiClient } from '../api/client';
import { useCache } from './useCache';
import type { OpportunityData } from '../components/OpportunityItem';

type OpportunitiesResponse = {
  data: OpportunityData[];
};

const OPPORTUNITIES_KEY = 'opportunities_list';

export function useOpportunities() {
  const fetcher = useCallback(
    () => apiClient.get<OpportunitiesResponse>('/v1/opportunities').then((r) => r.data),
    []
  );

  const { data, loading, error, isStale, refresh } = useCache<OpportunityData[]>(
    OPPORTUNITIES_KEY,
    fetcher
  );

  return { opportunities: data ?? [], loading, error, isStale, refresh };
}
