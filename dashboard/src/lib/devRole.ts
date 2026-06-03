import type { Role } from '@/types/collections'

// Used during UI-first phases (1–5) only.
// Change locally to preview any role's visible surface.
// Deleted and replaced by real authStore values in Phase 6.
// Never commit a value other than 'super_admin'.
export const DEV_ROLE: Role = 'super_admin'
export const DEV_IS_ADMIN = true
