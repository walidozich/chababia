import type { Role } from '@/types/collections'

type Resource =
  | 'activities'
  | 'establishments'
  | 'categories'
  | 'announcements'
  | 'newsletters'
  | 'documents'
  | 'talent_showcase'
  | 'translations'
  | 'registrations'
  | 'project_submissions'
  | 'content_reports'
  | 'users'
  | 'recommendations'
  | 'recommendation_history'

type Action = 'read' | 'write' | 'delete'

const WRITE_RULES: Record<Resource, (role: Role | null, isAdmin: boolean) => boolean> = {
  activities: (role, isAdmin) =>
    isAdmin || role === 'super_admin' || role === 'wilaya_admin' || role === 'establishment_manager',
  establishments: (role, isAdmin) =>
    isAdmin || role === 'super_admin' || role === 'wilaya_admin' || role === 'establishment_manager',
  categories: (_role, isAdmin) => isAdmin,
  announcements: (role, isAdmin) =>
    isAdmin || role === 'super_admin' || role === 'wilaya_admin' || role === 'content_editor',
  newsletters: (role, isAdmin) =>
    isAdmin || role === 'super_admin' || role === 'wilaya_admin' || role === 'content_editor',
  documents: (role, isAdmin) =>
    isAdmin || role === 'super_admin' || role === 'wilaya_admin' || role === 'content_editor',
  talent_showcase: (role, isAdmin) =>
    isAdmin || role === 'super_admin' || role === 'wilaya_admin' || role === 'content_editor',
  translations: (role, isAdmin) => isAdmin || (role !== null && role !== 'youth'),
  registrations: (role, isAdmin) =>
    isAdmin ||
    role === 'super_admin' ||
    role === 'wilaya_admin' ||
    role === 'establishment_manager' ||
    role === 'attendance_staff',
  project_submissions: (role, isAdmin) =>
    isAdmin || role === 'super_admin' || role === 'wilaya_admin' || role === 'establishment_manager',
  content_reports: (_role, isAdmin) => isAdmin,
  users: (_role, isAdmin) => isAdmin,
  recommendations: (role, isAdmin) =>
    isAdmin ||
    role === 'super_admin' ||
    role === 'wilaya_admin' ||
    role === 'establishment_manager' ||
    role === 'content_editor',
  recommendation_history: (_role, isAdmin) => isAdmin,
}

export function can(
  action: Action,
  resource: Resource,
  role: Role | null,
  isAdmin: boolean,
): boolean {
  if (action === 'read') {
    if (resource === 'content_reports') return isAdmin
    if (resource === 'users') return isAdmin
    if (resource === 'recommendation_history') return isAdmin
    // all other resources are readable by any authenticated user with a non-youth role
    return isAdmin || (role !== null && role !== 'youth')
  }
  if (action === 'delete') {
    // delete uses the same gates as write; can be tightened per-resource in future
    return WRITE_RULES[resource](role, isAdmin)
  }
  return WRITE_RULES[resource](role, isAdmin)
}
