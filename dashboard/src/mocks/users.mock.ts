import type { User } from '@/types/collections'

export const MOCK_USERS: User[] = [
  {
    id: 'user001', created: '2026-01-01T08:00:00.000Z', updated: '2026-05-01T10:00:00.000Z',
    email: 'admin@chababia.dz', emailVisibility: false, verified: true,
    full_name: 'Mohamed Walid', phone: '0550000001', role: 'super_admin',
    preferred_language: 'fr', commune: 'Alger', wilaya: 'Alger', interests: [],
  },
  {
    id: 'user002', created: '2026-01-15T09:00:00.000Z', updated: '2026-04-10T11:00:00.000Z',
    email: 'mj.bejaia@odej.dz', emailVisibility: false, verified: true,
    full_name: 'Sofiane Aït Yahia', phone: '0661100200', role: 'establishment_manager',
    preferred_language: 'fr', commune: 'Béjaïa', wilaya: 'Béjaïa', interests: ['Sports', 'Science'],
  },
  {
    id: 'user003', created: '2026-01-20T10:00:00.000Z', updated: '2026-03-05T09:00:00.000Z',
    email: 'wilaya.oran@odej.dz', emailVisibility: false, verified: true,
    full_name: 'Fatima Benali', phone: '0770300400', role: 'wilaya_admin',
    preferred_language: 'ar', commune: 'Oran', wilaya: 'Oran', interests: ['Culture', 'Arts'],
  },
  {
    id: 'user004', created: '2026-02-01T08:00:00.000Z', updated: '2026-02-01T08:00:00.000Z',
    email: 'content@odej.dz', emailVisibility: false, verified: true,
    full_name: 'Rima Hadj', phone: '0555600700', role: 'content_editor',
    preferred_language: 'fr', commune: 'Alger', wilaya: 'Alger', interests: ['Culture', 'Photography', 'Design'],
  },
  {
    id: 'user005', created: '2026-03-01T09:00:00.000Z', updated: '2026-03-01T09:00:00.000Z',
    email: 'presence@odej-bejaia.dz', emailVisibility: false, verified: true,
    full_name: 'Hocine Moulai', phone: '0661800900', role: 'attendance_staff',
    preferred_language: 'fr', commune: 'Béjaïa', wilaya: 'Béjaïa', interests: [],
  },
]
