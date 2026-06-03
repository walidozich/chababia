import { create } from 'zustand'
import type { Role } from '@/types/collections'

interface AuthState {
  isAdmin: boolean
  role: Role | null
  userId: string | null
  userName: string | null
  userEmail: string | null
  setAuth: (payload: { isAdmin: boolean; role: Role | null; userId: string; userName: string; userEmail: string }) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAdmin: false,
  role: null,
  userId: null,
  userName: null,
  userEmail: null,
  setAuth: ({ isAdmin, role, userId, userName, userEmail }) => { set({ isAdmin, role, userId, userName, userEmail }) },
  clearAuth: () => { set({ isAdmin: false, role: null, userId: null, userName: null, userEmail: null }) },
}))
