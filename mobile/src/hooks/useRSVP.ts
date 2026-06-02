import { useState, useCallback } from 'react';
import { apiClient } from '../api/client';
import { getUserToken } from '../api/identity';

type RSVPResponse = {
  rsvp_id: string;
  event_code: string;
  qr_payload: string;
  confirmation_ts: number;
};

type RSVPState = {
  loading: boolean;
  error: Error | null;
  rsvp: RSVPResponse | null;
};

export function useRSVP() {
  const [state, setState] = useState<RSVPState>({
    loading: false,
    error: null,
    rsvp: null,
  });

  const rsvp = useCallback(async (eventId: string) => {
    setState({ loading: true, error: null, rsvp: null });

    try {
      const userToken = await getUserToken();
      const response = await apiClient.post<RSVPResponse>('/v1/rsvp', {
        event_id: eventId,
        user_token: userToken,
      });
      setState({ loading: false, error: null, rsvp: response });
      return response;
    } catch (err) {
      setState({ loading: false, error: err as Error, rsvp: null });
      throw err;
    }
  }, []);

  const cancel = useCallback(async (rsvpId: string) => {
    setState({ loading: true, error: null, rsvp: state.rsvp });

    try {
      await apiClient.delete(`/v1/rsvp/${rsvpId}`);
      setState({ loading: false, error: null, rsvp: null });
    } catch (err) {
      setState({ loading: false, error: err as Error, rsvp: state.rsvp });
      throw err;
    }
  }, [state.rsvp]);

  return { ...state, rsvp, cancel };
}
