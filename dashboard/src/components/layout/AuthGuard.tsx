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

function syncAuthStore() {
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
  })
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function verifySession() {
      if (!pb.authStore.isValid) {
        useAuthStore.getState().clearAuth()
        void navigate('/login', { replace: true })
        if (!cancelled) setIsChecking(false)
        return
      }

      try {
        if (pb.authStore.isSuperuser) {
          await pb.collection('_superusers').authRefresh()
        } else {
          await pb.collection('users').authRefresh()
        }
        syncAuthStore()
      } catch {
        pb.authStore.clear()
        useAuthStore.getState().clearAuth()
        void navigate('/login', { replace: true })
      } finally {
        if (!cancelled) setIsChecking(false)
      }
    }

    void verifySession()

    return () => {
      cancelled = true
    }
  }, [navigate])

  if (isChecking) return null

  return <>{children}</>
}
