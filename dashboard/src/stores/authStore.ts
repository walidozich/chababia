import { create } from 'zustand'
import type { Role } from '@/types/collections'

interface AuthState {
  isAdmin: boolean
  role: Role | null
  userId: string | null
  userName: string | null
  setAuth: (payload: { isAdmin: boolean; role: Role | null; userId: string; userName: string }) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAdmin: false,
  role: null,
  userId: null,
  userName: null,
  setAuth: ({ isAdmin, role, userId, userName }) => set({ isAdmin, role, userId, userName }),
  clearAuth: () => set({ isAdmin: false, role: null, userId: null, userName: null }),
}))
