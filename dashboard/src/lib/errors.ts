import { ClientResponseError } from 'pocketbase'

export interface ParsedError {
  message: string
  fields: Record<string, string>
}

export function parseClientError(err: unknown): ParsedError {
  if (err instanceof ClientResponseError) {
    const fields: Record<string, string> = {}
    const data = err.response?.data as Record<string, { message?: string }> | undefined

    if (data) {
      for (const [key, val] of Object.entries(data)) {
        if (val?.message) {
          fields[key] = val.message
        }
      }
    }

    return {
      message: err.message || 'Une erreur est survenue.',
      fields,
    }
  }

  if (err instanceof Error) {
    return { message: err.message, fields: {} }
  }

  return { message: 'Une erreur inattendue est survenue.', fields: {} }
}

export function isAuthError(err: unknown): boolean {
  return err instanceof ClientResponseError && (err.status === 401 || err.status === 403)
}

export function isRateLimitError(err: unknown): boolean {
  return err instanceof ClientResponseError && err.status === 429
}
