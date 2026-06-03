const m = 60 * 1000
const h = 60 * m
const d = 24 * h

export const STALE = {
  categories: 7 * d,
  documents: 7 * d,
  establishments: d,
  translations: d,
  activities: 30 * m,
  announcements: 10 * m,
  newsletters: 10 * m,
  talentShowcase: h,
  registrations: 0,
} as const
