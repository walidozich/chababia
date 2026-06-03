import type { ListResult, RecordListOptions, RecordModel, RecordOptions } from 'pocketbase'
import { pb } from '@/lib/pb'

export const COLLECTIONS = {
  activities: 'activities',
  activityTranslations: 'activity_translations',
  announcements: 'announcements',
  categories: 'categories',
  categoryTranslations: 'category_translations',
  contentReports: 'content_reports',
  documents: 'documents',
  establishments: 'establishments',
  establishmentTranslations: 'establishment_translations',
  newsletters: 'newsletters',
  projectSubmissions: 'project_submissions',
  recommendationRequests: 'recommendation_requests',
  registrations: 'registrations',
  talentShowcase: 'talent_showcase',
  users: 'users',
} as const

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS]

const SERVER_MANAGED_FIELDS = new Set([
  'id',
  'created',
  'updated',
  'created_by',
  'updated_by',
  'collectionId',
  'collectionName',
  'expand',
  'last_verified_at',
  'qr_code',
  'user',
  'reporter',
])

type MutablePayload = Record<string, unknown>

export const qk = {
  collection: (collection: CollectionName) => [collection] as const,
  list: (collection: CollectionName, scope = 'list') => [collection, scope] as const,
  detail: (collection: CollectionName, id: string | undefined) => [collection, 'detail', id] as const,
}

export async function getList<T>(
  collection: CollectionName,
  page = 1,
  perPage = 30,
  options?: RecordListOptions,
): Promise<ListResult<T>> {
  const result = await pb.collection(collection).getList<RecordModel>(page, perPage, options)
  return {
    ...result,
    items: result.items as unknown as T[],
  }
}

export async function getFullList<T>(
  collection: CollectionName,
  options?: RecordListOptions,
): Promise<T[]> {
  const items = await pb.collection(collection).getFullList<RecordModel>(options)
  return items as unknown as T[]
}

export async function getOne<T>(
  collection: CollectionName,
  id: string,
  options?: RecordOptions,
): Promise<T> {
  const record = await pb.collection(collection).getOne<RecordModel>(id, options)
  return record as unknown as T
}

export async function createRecord<T>(
  collection: CollectionName,
  payload: MutablePayload | FormData,
): Promise<T> {
  const record = await pb.collection(collection).create<RecordModel>(payload)
  return record as unknown as T
}

export async function updateRecord<T>(
  collection: CollectionName,
  id: string,
  payload: MutablePayload | FormData,
): Promise<T> {
  const record = await pb.collection(collection).update<RecordModel>(id, payload)
  return record as unknown as T
}

export function deleteRecord(collection: CollectionName, id: string): Promise<boolean> {
  return pb.collection(collection).delete(id)
}

export function scrubServerFields<T extends MutablePayload>(payload: T): MutablePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !SERVER_MANAGED_FIELDS.has(key)),
  )
}

export function payloadWithFiles(
  payload: MutablePayload,
  fileFields: readonly string[],
): MutablePayload | FormData {
  const files = fileFields
    .map((field) => ({ field, file: dataUrlToFile(payload[field], field) }))
    .filter((item): item is { field: string; file: File } => item.file !== null)

  if (files.length === 0) {
    return payload
  }

  const formData = new FormData()

  for (const [key, value] of Object.entries(payload)) {
    const file = files.find((item) => item.field === key)?.file

    if (file) {
      formData.append(key, file)
      continue
    }

    if (value !== undefined && value !== null) {
      formData.append(key, serializeFormValue(value))
    }
  }

  return formData
}

export function recordFileUrl(
  record: RecordModel | { id: string; collectionId?: string; collectionName?: string },
  fileName: string | undefined,
): string {
  if (!fileName || fileName.startsWith('data:') || fileName.startsWith('http')) {
    return fileName ?? ''
  }

  return pb.files.getURL(record as RecordModel, fileName)
}

function dataUrlToFile(value: unknown, field: string): File | null {
  if (typeof value !== 'string' || !value.startsWith('data:')) {
    return null
  }

  const [meta, base64] = value.split(',')

  if (!meta || !base64) {
    return null
  }

  const mime = meta.match(/^data:(.*?);base64$/)?.[1] ?? 'application/octet-stream'
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
  const ext = mime.split('/')[1] ?? 'bin'

  return new File([bytes], `${field}.${ext}`, { type: mime })
}

function serializeFormValue(value: unknown): string {
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
    return JSON.stringify(value)
  }

  return String(value)
}
