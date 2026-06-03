import { useState, useCallback } from 'react'
import { pb } from '../api/client'
import { getPref, setPref, keys } from '../storage/prefs'
import type { Registration } from '../api/types'

export interface StoredTicket {
  rsvpId: string
  eventId: string
  eventTitle: string
  eventCode: string
  date: string
  qrPayload: string
  confirmationTs: number
  cancelled: boolean
}

export function useRSVP() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tickets, setTickets] = useState<StoredTicket[]>([])

  const loadTickets = useCallback(async (): Promise<StoredTicket[]> => {
    const stored = await getPref<StoredTicket[]>(keys.tickets)
    return stored ?? []
  }, [])

  const loadRegistrations = useCallback(async () => {
    try {
      return await pb.collection('registrations').getFullList<Registration>({
        sort: '-created',
        expand: 'activity',
      })
    } catch {
      return []
    }
  }, [])

  const rsvp = useCallback(
    async (activityId: string, eventTitle: string): Promise<StoredTicket | null> => {
      setSubmitting(true)
      setError(null)

      try {
        const reg = await pb.collection('registrations').create<Registration>({
          activity: activityId,
          full_name: pb.authStore.record?.full_name ?? '',
          phone: pb.authStore.record?.phone ?? '',
        })

        const ticket: StoredTicket = {
          rsvpId: reg.id,
          eventId: activityId,
          eventTitle,
          eventCode: reg.qr_code.slice(0, 8),
          date: reg.created,
          qrPayload: reg.qr_code,
          confirmationTs: Math.floor(Date.now() / 1000),
          cancelled: false,
        }

        const updated = [...tickets, ticket]
        setTickets(updated)
        await setPref(keys.tickets, updated)
        setSubmitting(false)
        return ticket
      } catch (err) {
        setSubmitting(false)
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        return null
      }
    },
    [tickets],
  )

  const cancelRsvp = useCallback(
    async (registrationId: string) => {
      setSubmitting(true)
      setError(null)

      try {
        await pb.collection('registrations').update(registrationId, { status: 'cancelled' })
      } catch {
        // proceed with local cancellation regardless
      }

      const updated = tickets.map((t) =>
        t.rsvpId === registrationId ? { ...t, cancelled: true } : t,
      )
      setTickets(updated)
      await setPref(keys.tickets, updated)
      setSubmitting(false)
    },
    [tickets],
  )

  return { rsvp, cancelRsvp, loadRegistrations, tickets, submitting, error, loadTickets }
}
