import type { Category, CategoryTranslation } from '@/types/collections'

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat001', created: '2026-01-10T09:00:00.000Z', updated: '2026-01-10T09:00:00.000Z', name: 'Sports', icon: 'trophy', status: 'active', created_by: 'user001', updated_by: 'user001' },
  { id: 'cat002', created: '2026-01-10T09:00:00.000Z', updated: '2026-01-10T09:00:00.000Z', name: 'Science & Technologie', icon: 'flask', status: 'active', created_by: 'user001', updated_by: 'user001' },
  { id: 'cat003', created: '2026-01-10T09:00:00.000Z', updated: '2026-01-10T09:00:00.000Z', name: 'Arts & Culture', icon: 'palette', status: 'active', created_by: 'user001', updated_by: 'user001' },
  { id: 'cat004', created: '2026-01-10T09:00:00.000Z', updated: '2026-02-01T09:00:00.000Z', name: 'Formation', icon: 'book', status: 'active', created_by: 'user001', updated_by: 'user001' },
  { id: 'cat005', created: '2026-01-10T09:00:00.000Z', updated: '2026-01-10T09:00:00.000Z', name: 'Bénévolat', icon: 'heart', status: 'inactive', created_by: 'user001', updated_by: 'user001' },
]

export const MOCK_CATEGORY_TRANSLATIONS: CategoryTranslation[] = [
  { id: 'ctr001', created: '2026-01-10T09:00:00.000Z', updated: '2026-01-10T09:00:00.000Z', category: 'cat001', language: 'ar', name: 'الرياضة', created_by: 'user001', updated_by: 'user001' },
  { id: 'ctr002', created: '2026-01-10T09:00:00.000Z', updated: '2026-01-10T09:00:00.000Z', category: 'cat001', language: 'fr', name: 'Sports', created_by: 'user001', updated_by: 'user001' },
  { id: 'ctr003', created: '2026-01-10T09:00:00.000Z', updated: '2026-01-10T09:00:00.000Z', category: 'cat002', language: 'ar', name: 'العلوم والتكنولوجيا', created_by: 'user001', updated_by: 'user001' },
  { id: 'ctr004', created: '2026-01-10T09:00:00.000Z', updated: '2026-01-10T09:00:00.000Z', category: 'cat002', language: 'fr', name: 'Sciences & Technologies', created_by: 'user001', updated_by: 'user001' },
]
