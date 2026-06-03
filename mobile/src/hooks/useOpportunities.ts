import { useState, useCallback, useMemo } from 'react'
import { pb } from '../api/client'
import { useCache } from './useCache'
import { keys } from '../storage/prefs'
import type { Activity } from '../api/types'

const CACHE_TTL = 15 * 60 * 1000

export interface FormattedOpportunity {
  id: string
  title: string
  category: string
  date: string
  distance: string
  slotsLeft: number
  establishmentName: string
}

export function useOpportunities() {
  const { data: rawData, stale, saveToCache } = useCache<FormattedOpportunity[]>(
    keys.cacheOpportunities,
    CACHE_TTL,
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOpportunities = useCallback(
    async (_filters?: { commune?: string; category?: string }) => {
      setLoading(true)
      setError(null)

      try {
        const result = await pb.collection('activities').getList<Activity>(1, 20, {
          filter: pb.filter('status = {:s}', { s: 'published' }),
          sort: '-start_datetime',
          expand: 'category,establishment',
        })

        const formatted: FormattedOpportunity[] = result.items.map((activity) => ({
          id: activity.id,
          title: activity.title,
          category: activity.expand?.category?.name ?? activity.category,
          date: activity.start_datetime,
          distance: '',
          slotsLeft: activity.capacity,
          establishmentName: activity.expand?.establishment?.name ?? '',
        }))

        await saveToCache(formatted)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur réseau'
        setError(message)
      }

      setLoading(false)
    },
    [saveToCache],
  )

  const formatted = useMemo<FormattedOpportunity[]>(() => rawData ?? [], [rawData])

  const filterByCategory = useCallback(
    (category: string | null): FormattedOpportunity[] => {
      if (!category) return formatted
      return formatted.filter((item) => item.category === category)
    },
    [formatted],
  )

  return {
    opportunities: formatted,
    filterByCategory,
    loading,
    error,
    stale,
    fetchOpportunities,
  }
}
