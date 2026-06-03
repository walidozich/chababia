import { pb } from './client'

const AI_URL = process.env.EXPO_PUBLIC_AI_URL ?? ''

export interface ActivityCard {
  id: string
  title: string
  category?: string
  category_name?: string
  commune?: string
  wilaya?: string
  activity_mode?: string
  is_free?: boolean
  score: number
}

export interface FeedResponse {
  user_id: string
  items: ActivityCard[]
  cached: boolean
  profile_summary: string
}

export async function getRecommendations(userId: string): Promise<FeedResponse | null> {
  if (!AI_URL) return null

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const token = pb.authStore.token
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (token) headers.Authorization = token

    const response = await fetch(`${AI_URL}/api/feed/${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers,
      signal: controller.signal,
    })

    if (!response.ok) return null

    return (await response.json()) as FeedResponse
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}
