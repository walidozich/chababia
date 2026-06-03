import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type PageSize = 10 | 25 | 50

interface PreferencesState {
  pageSize: PageSize
  setPageSize: (size: PageSize) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      pageSize: 10,
      setPageSize: (size) => set({ pageSize: size }),
    }),
    { name: 'dashboard-preferences' },
  ),
)
