import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pb } from '@/lib/pb'
import { useAuthStore } from '@/stores/authStore'
import type { Role } from '@/types/collections'

const ROLES: Role[] = [
  'youth',
  'super_admin',
  'wilaya_admin',
  'establishment_manager',
  'content_editor',
  'attendance_staff',
]

function isRole(value: unknown): value is Role {
  return typeof value === 'string' && ROLES.includes(value as Role)
}

function field(record: unknown, key: string): unknown {
  if (!record || typeof record !== 'object') return undefined
  return (record as Record<string, unknown>)[key]
}

export function syncAuthStore() {
  const record = pb.authStore.record
  const isSuperuser = pb.authStore.isSuperuser
  const id = field(record, 'id')
  const role = field(record, 'role')
  const fullName = field(record, 'full_name')
  const email = field(record, 'email')

  useAuthStore.getState().setAuth({
    isAdmin: isSuperuser,
    role: isSuperuser ? 'super_admin' : isRole(role) ? role : null,
    userId: typeof id === 'string' ? id : '',
    userName: typeof fullName === 'string' && fullName.length > 0
      ? fullName
      : typeof email === 'string' && email.length > 0
        ? email
        : 'Admin Chababia',
    userEmail: typeof email === 'string' ? email : '',
  })
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Synchronous local JWT check — no network call needed.
    // pb.authStore.isValid checks the token's `exp` claim locally.
    if (!pb.authStore.isValid) {
      useAuthStore.getState().clearAuth()
      void navigate('/login', { replace: true })
    } else {
      syncAuthStore()
    }
    setIsReady(true)

    // React to auth store changes: token cleared by logout, 401 handler, or SDK expiry.
    const unsubscribe = pb.authStore.onChange(() => {
      if (!pb.authStore.isValid) {
        useAuthStore.getState().clearAuth()
        void navigate('/login', { replace: true })
      }
    })

    return unsubscribe
  }, [navigate])

  if (!isReady) return null
  return <>{children}</>
}
