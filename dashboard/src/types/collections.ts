// ─── Enums ────────────────────────────────────────────────────────────────────

export type Role =
  | 'youth'
  | 'super_admin'
  | 'wilaya_admin'
  | 'establishment_manager'
  | 'content_editor'
  | 'attendance_staff'

export type ContentLanguage = 'ar' | 'fr' | 'tzm' | 'all' | 'mixed'
export type TranslationLanguage = 'ar' | 'fr' | 'tzm'

export type ActivityStatus = 'draft' | 'published' | 'cancelled' | 'archived'
export type ActivityMode = 'physical' | 'online' | 'hybrid'
export type BandwidthLevel = 'low' | 'medium' | 'high'

export type EstablishmentStatus = 'draft' | 'published' | 'archived'
export type EstablishmentType =
  | 'youth_house'
  | 'youth_hostel'
  | 'sports_complex'
  | 'youth_camp'
  | 'polyvalent_hall'
  | 'scientific_leisure_center'

export type ContentStatus = 'draft' | 'published' | 'archived'
export type AnnouncementPriority = 'normal' | 'high' | 'urgent'

export type RegistrationStatus = 'registered' | 'waiting_list' | 'cancelled' | 'attended'

export type ProjectStatus =
  | 'submitted'
  | 'reviewed'
  | 'accepted'
  | 'rejected'
  | 'needs_more_info'

export type TalentStatus = 'draft' | 'published' | 'rejected'

export type ReportStatus = 'new' | 'reviewed' | 'resolved' | 'dismissed'
export type ReportReason =
  | 'outdated_info'
  | 'wrong_contact'
  | 'cancelled'
  | 'wrong_location'
  | 'other'
export type ReportTargetType =
  | 'activity'
  | 'establishment'
  | 'announcement'
  | 'newsletter'
  | 'document'

export type CategoryStatus = 'active' | 'inactive'

export type DocumentCategory =
  | 'orientation'
  | 'health'
  | 'legal'
  | 'training'
  | 'volunteering'
  | 'science'
  | 'arts'
  | 'general'

export type InterestCategory =
  | 'Sports'
  | 'Culture'
  | 'Training'
  | 'Volunteering'
  | 'Health Awareness'
  | 'Science'
  | 'Arts'
  | 'Environment'
  | 'Youth Orientation'
  | 'Camps and Trips'
  | 'Coding'
  | 'Design'
  | 'Robotics'
  | 'Photography'
  | 'Debate'

export type RecommendationStatus = 'pending' | 'completed' | 'failed' | 'cached'

// ─── Base record ──────────────────────────────────────────────────────────────

interface BaseRecord {
  id: string
  created: string
  updated: string
}

// ─── Collections ──────────────────────────────────────────────────────────────

export interface User extends BaseRecord {
  email: string
  emailVisibility: boolean
  verified: boolean
  full_name: string
  phone: string
  role: Role
  preferred_language: TranslationLanguage
  commune: string
  wilaya: string
  interests: InterestCategory[]
}

export interface Category extends BaseRecord {
  name: string
  icon: string
  status: CategoryStatus
  created_by: string
  updated_by: string
}

export interface CategoryTranslation extends BaseRecord {
  category: string
  language: TranslationLanguage
  name: string
  created_by: string
  updated_by: string
}

export interface Establishment extends BaseRecord {
  name: string
  type: EstablishmentType
  commune: string
  wilaya: string
  address: string
  latitude: number
  longitude: number
  phone: string
  email: string
  opening_hours: string
  services: string
  accessibility_notes: string
  image: string
  status: EstablishmentStatus
  last_verified_at: string
  created_by: string
  updated_by: string
}

export interface EstablishmentTranslation extends BaseRecord {
  establishment: string
  language: TranslationLanguage
  description: string
  services_text: string
  accessibility_text: string
  created_by: string
  updated_by: string
}

export interface Activity extends BaseRecord {
  title: string
  short_description: string
  full_description: string
  commune: string
  wilaya: string
  category: string
  establishment: string
  activity_mode: ActivityMode
  online_link: string
  start_datetime: string
  end_datetime: string
  registration_deadline: string
  capacity: number
  requires_registration: boolean
  is_free: boolean
  age_min: number
  age_max: number
  language: ContentLanguage
  accessibility_notes: string
  required_documents: string
  bandwidth_level: BandwidthLevel
  replay_available: boolean
  image: string
  contact_phone: string
  contact_email: string
  status: ActivityStatus
  last_verified_at: string
  created_by: string
  updated_by: string
  // expand
  expand?: {
    category?: Category
    establishment?: Establishment
  }
}

export interface ActivityTranslation extends BaseRecord {
  activity: string
  language: TranslationLanguage
  title: string
  short_description: string
  full_description: string
  created_by: string
  updated_by: string
}

export interface Announcement extends BaseRecord {
  title: string
  content: string
  priority: AnnouncementPriority
  related_establishment: string
  related_activity: string
  language: ContentLanguage
  status: ContentStatus
  last_verified_at: string
  created_by: string
  updated_by: string
}

export interface Newsletter extends BaseRecord {
  title: string
  content: string
  language: ContentLanguage
  target_commune: string
  target_wilaya: string
  related_activity: string
  related_establishment: string
  thumbnail: string
  status: ContentStatus
  published_at: string
  last_verified_at: string
  created_by: string
  updated_by: string
}

export interface Document extends BaseRecord {
  title: string
  description: string
  file: string
  language: ContentLanguage
  category: DocumentCategory
  establishment: string
  status: ContentStatus
  last_verified_at: string
  created_by: string
  updated_by: string
}

export interface Registration extends BaseRecord {
  user: string
  activity: string
  full_name: string
  phone: string
  email: string
  status: RegistrationStatus
  qr_code: string
  checked_in_at: string
  created_by: string
  updated_by: string
  expand?: {
    user?: User
    activity?: Activity
  }
}

export interface ProjectSubmission extends BaseRecord {
  user: string
  establishment: string
  project_title: string
  category: InterestCategory
  commune: string
  short_description: string
  needed_support: string
  contact_phone: string
  optional_document: string
  status: ProjectStatus
  assigned_mentor: string
  created_by: string
  updated_by: string
  expand?: {
    user?: User
    establishment?: Establishment
  }
}

export interface TalentShowcase extends BaseRecord {
  user: string
  title: string
  description: string
  category: InterestCategory
  media: string
  external_link: string
  status: TalentStatus
  published_at: string
  last_verified_at: string
  created_by: string
  updated_by: string
  expand?: {
    user?: User
  }
}

export interface ContentReport extends BaseRecord {
  reporter: string
  target_type: ReportTargetType
  target_id: string
  reason: ReportReason
  details: string
  status: ReportStatus
  created_by: string
  updated_by: string
  expand?: {
    reporter?: User
  }
}

export interface RecommendationRequest extends BaseRecord {
  commune: string
  wilaya: string
  establishment_type: EstablishmentType
  input_summary: string
  model_provider: string
  model_api_used: string
  suggestions_json: string
  status: RecommendationStatus
  admin_user: string
  created_by: string
  updated_by: string
  expand?: {
    admin_user?: User
  }
}

// ─── API response types ────────────────────────────────────────────────────────

export interface Suggestion {
  title: string
  short_description: string
  category: InterestCategory
  activity_mode: ActivityMode
  age_min: number
  age_max: number
  is_free: boolean
  estimated_duration: string
}

export interface RecommendationResponse {
  suggestions: Suggestion[]
  cached: boolean
  mock: boolean
  request_id: string
}
