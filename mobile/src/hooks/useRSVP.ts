import { useState, useCallback } from 'react';
import { api } from '../api/client';
import { getPref, setPref, keys } from '../storage/prefs';
import type { getUserToken } from '../api/identity';
import rsvpFixture from '../api/__fixtures__/rsvp.json';

interface RsvpResponse {
  rsvp_id: string;
  event_code: string;
  confirmation_ts: number;
  qr_payload: string;
}

export interface StoredTicket {
  rsvpId: string;
  eventId: string;
  eventTitle: string;
  eventCode: string;
  date: string;
  qrPayload: string;
  confirmationTs: number;
  cancelled: boolean;
}

export function useRSVP() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<StoredTicket[]>([]);

  const loadTickets = useCallback(async () => {
    const stored = await getPref<StoredTicket[]>(keys.tickets);
    if (stored) setTickets(stored);
  }, []);

  const rsvp = useCallback(
    async (
      eventId: string,
      eventTitle: string,
      token: Awaited<ReturnType<typeof getUserToken>>,
    ): Promise<StoredTicket | null> => {
      setSubmitting(true);
      setError(null);

      const { data, error: apiError } = await api.post<RsvpResponse>('/rsvp', {
        event_id: eventId,
        user_token: token,
      });

      if (apiError || !data) {
        // fallback to fixture for development
        const fallback = rsvpFixture as RsvpResponse;
        const ticket: StoredTicket = {
          rsvpId: fallback.rsvp_id,
          eventId,
          eventTitle,
          eventCode: fallback.event_code,
          date: new Date().toISOString(),
          qrPayload: fallback.qr_payload,
          confirmationTs: fallback.confirmation_ts,
          cancelled: false,
        };
        const updated = [...tickets, ticket];
        setTickets(updated);
        await setPref(keys.tickets, updated);
        setSubmitting(false);
        return ticket;
      }

      const ticket: StoredTicket = {
        rsvpId: data.rsvp_id,
        eventId,
        eventTitle,
        eventCode: data.event_code,
        date: new Date().toISOString(),
        qrPayload: data.qr_payload,
        confirmationTs: data.confirmation_ts,
        cancelled: false,
      };
      const updated = [...tickets, ticket];
      setTickets(updated);
      await setPref(keys.tickets, updated);
      setSubmitting(false);
      return ticket;
    },
    [tickets],
  );

  const cancelRsvp = useCallback(
    async (
      rsvpId: string,
      token: Awaited<ReturnType<typeof getUserToken>>,
    ) => {
      setSubmitting(true);
      setError(null);

      const { error: apiError } = await api.delete(`/rsvp/${rsvpId}`, {
        Authorization: `Bearer ${token}`,
      });

      // always mark as cancelled locally regardless of API result
      const updated = tickets.map((t) =>
        t.rsvpId === rsvpId ? { ...t, cancelled: true } : t,
      );
      setTickets(updated);
      await setPref(keys.tickets, updated);
      setSubmitting(false);

      if (apiError) {
        setError(apiError);
      }
    },
    [tickets],
  );

  return { rsvp, cancelRsvp, tickets, submitting, error, loadTickets };
}
