export type Role =
  | 'youth'
  | 'super_admin'
  | 'wilaya_admin'
  | 'establishment_manager'
  | 'content_editor'
  | 'attendance_staff'

export type Locale = 'ar' | 'fr' | 'tzm'

export type ActivityMode = 'physical' | 'online' | 'hybrid'
export type ActivityStatus = 'draft' | 'published' | 'cancelled' | 'archived'

export type EstablishmentType =
  | 'youth_house'
  | 'youth_hostel'
  | 'sports_complex'
  | 'youth_camp'
  | 'polyvalent_hall'
  | 'scientific_leisure_center'

export type RegistrationStatus = 'registered' | 'waiting_list' | 'cancelled' | 'attended'

export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  role: Role
  preferred_language: string
  commune: string
  wilaya: string
  interests: string[]
  created: string
  updated: string
}

export interface Category {
  id: string
  name: string
  icon: string
  status: string
}

export interface Establishment {
  id: string
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
  status: string
  last_verified_at: string
}

export interface Activity {
  id: string
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
  language: string
  accessibility_notes: string
  required_documents: string
  bandwidth_level: string
  replay_available: boolean
  image: string
  contact_phone: string
  contact_email: string
  status: ActivityStatus
  last_verified_at: string
  expand?: {
    category?: Category
    establishment?: Establishment
  }
}

export interface Registration {
  id: string
  user: string
  activity: string
  full_name: string
  phone: string
  email: string
  status: RegistrationStatus
  qr_code: string
  checked_in_at: string
  created: string
  updated: string
  expand?: {
    activity?: Activity
    user?: User
  }
}

export interface Announcement {
  id: string
  title: string
  content: string
  priority: string
  language: string
  status: string
  created: string
  updated: string
}

export interface Newsletter {
  id: string
  title: string
  content: string
  language: string
  target_commune: string
  target_wilaya: string
  status: string
  published_at: string
  created: string
  updated: string
}

export interface Document {
  id: string
  title: string
  description: string
  file: string
  language: string
  category: string
  establishment: string
  status: string
}

export interface ProjectSubmission {
  id: string
  user: string
  establishment: string
  project_title: string
  category: string
  commune: string
  short_description: string
  needed_support: string
  contact_phone: string
  optional_document: string
  status: string
  assigned_mentor: string
  created: string
  updated: string
}

export interface TalentShowcase {
  id: string
  user: string
  title: string
  description: string
  category: string
  media: string
  external_link: string
  status: string
  published_at: string
}

export interface ContentReport {
  id: string
  reporter: string
  target_type: string
  target_id: string
  reason: string
  details: string
  status: string
}

export interface ActivityTranslation {
  id: string
  activity: string
  language: Locale
  title: string
  short_description: string
  full_description: string
}

export interface CategoryTranslation {
  id: string
  category: string
  language: Locale
  name: string
}

export interface Suggestion {
  title: string
  short_description: string
  category: string
  activity_mode: ActivityMode
  age_min: number
  age_max: number
  is_free: boolean
  estimated_duration: string
}
