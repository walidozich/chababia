import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { pb } from '@/lib/pb'
import { isAuthError, parseClientError } from '@/lib/errors'

function handleGlobalError(error: unknown) {
  if (isAuthError(error)) {
    // Clearing pb.authStore fires onChange → AuthGuard detects it → navigates to /login.
    pb.authStore.clear()
  } else {
    const { message } = parseClientError(error)
    toast.error('Erreur', { description: message })
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleGlobalError }),
  mutationCache: new MutationCache({ onError: handleGlobalError }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isAuthError(error)) return false
        return failureCount < 1
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
