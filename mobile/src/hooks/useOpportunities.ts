import { useState, useCallback, useMemo } from 'react'
import { pb } from '../api/client'
import { useCache } from './useCache'
import { keys } from '../storage/prefs'
import { getRecommendations } from '../api/recommendations'
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

type PocketBaseExpand = {
  category?: { name: string }
  establishment?: { name: string }
}

export function useOpportunities() {
  const { data: rawData, stale, saveToCache } = useCache<FormattedOpportunity[]>(
    keys.cacheOpportunities,
    CACHE_TTL,
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFromAI = useCallback(async (): Promise<FormattedOpportunity[] | null> => {
    if (!pb.authStore.isValid) return null
    const userId = pb.authStore.model?.id
    if (!userId) return null

    const feed = await getRecommendations(userId)
    if (!feed?.items?.length) return null

    return feed.items.map((card) => ({
      id: card.id,
      title: card.title,
      category: card.category_name ?? card.category ?? '',
      date: '',
      distance: `${Math.round(card.score * 100)}%`,
      slotsLeft: 0,
      establishmentName: card.commune ?? '',
    }))
  }, [])

  const fetchFromPocketBase = useCallback(async (): Promise<FormattedOpportunity[]> => {
    const result = await pb.collection('activities').getList<Activity>(1, 20, {
      filter: pb.filter('status = {:s}', { s: 'published' }),
      sort: '-start_datetime',
      expand: 'category,establishment',
    })

    return result.items.map((activity) => ({
      id: activity.id,
      title: activity.title,
      category: (activity.expand as PocketBaseExpand | undefined)?.category?.name ?? activity.category,
      date: activity.start_datetime,
      distance: '',
      slotsLeft: activity.capacity,
      establishmentName: (activity.expand as PocketBaseExpand | undefined)?.establishment?.name ?? '',
    }))
  }, [])

  const fetchOpportunities = useCallback(
    async (_filters?: { commune?: string; category?: string }) => {
      setLoading(true)
      setError(null)

      try {
        const aiResults = await fetchFromAI()
        if (aiResults && aiResults.length > 0) {
          await saveToCache(aiResults)
          setLoading(false)
          return
        }

        const pocketbaseResults = await fetchFromPocketBase()
        await saveToCache(pocketbaseResults)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur réseau'
        setError(message)
      }

      setLoading(false)
    },
    [fetchFromAI, fetchFromPocketBase, saveToCache],
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
