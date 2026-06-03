import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageSkeleton } from '@/components/shared/LoadingSkeletons'

// ─── Pages ───────────────────────────────────────────────────────────────────

const HomePage = lazy(() => import('@/pages/HomePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Phase 2 — Content
const ActivitiesPage = lazy(() => import('@/pages/activities/ActivitiesPage'))
const ActivityFormPage = lazy(() => import('@/pages/activities/ActivityFormPage'))
const EstablishmentsPage = lazy(() => import('@/pages/establishments/EstablishmentsPage'))
const EstablishmentFormPage = lazy(() => import('@/pages/establishments/EstablishmentFormPage'))
const CategoriesPage = lazy(() => import('@/pages/categories/CategoriesPage'))
const AnnouncementsPage = lazy(() => import('@/pages/announcements/AnnouncementsPage'))
const AnnouncementFormPage = lazy(() => import('@/pages/announcements/AnnouncementFormPage'))
const NewslettersPage = lazy(() => import('@/pages/newsletters/NewslettersPage'))
const NewsletterFormPage = lazy(() => import('@/pages/newsletters/NewsletterFormPage'))
const DocumentsPage = lazy(() => import('@/pages/documents/DocumentsPage'))
const DocumentFormPage = lazy(() => import('@/pages/documents/DocumentFormPage'))

// Phase 3–4 stubs
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">À venir</p>
      <h1 className="text-headline-sm font-extrabold text-on-surface">{label}</h1>
      <p className="text-body-sm text-on-surface-variant">Cette section sera disponible en Phase 3.</p>
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<ComingSoon label="Connexion" />} />
        <Route element={<AppLayout />}>
          {/* Home */}
          <Route index element={<P><HomePage /></P>} />

          {/* Activities */}
          <Route path="activities" element={<P><ActivitiesPage /></P>} />
          <Route path="activities/new" element={<P><ActivityFormPage /></P>} />
          <Route path="activities/:id" element={<P><ActivityFormPage /></P>} />

          {/* Establishments */}
          <Route path="establishments" element={<P><EstablishmentsPage /></P>} />
          <Route path="establishments/new" element={<P><EstablishmentFormPage /></P>} />
          <Route path="establishments/:id" element={<P><EstablishmentFormPage /></P>} />

          {/* Categories */}
          <Route path="categories" element={<P><CategoriesPage /></P>} />

          {/* Announcements */}
          <Route path="announcements" element={<P><AnnouncementsPage /></P>} />
          <Route path="announcements/new" element={<P><AnnouncementFormPage /></P>} />
          <Route path="announcements/:id" element={<P><AnnouncementFormPage /></P>} />

          {/* Newsletters */}
          <Route path="newsletters" element={<P><NewslettersPage /></P>} />
          <Route path="newsletters/new" element={<P><NewsletterFormPage /></P>} />
          <Route path="newsletters/:id" element={<P><NewsletterFormPage /></P>} />

          {/* Documents */}
          <Route path="documents" element={<P><DocumentsPage /></P>} />
          <Route path="documents/new" element={<P><DocumentFormPage /></P>} />
          <Route path="documents/:id" element={<P><DocumentFormPage /></P>} />

          {/* Phase 3 stubs */}
          <Route path="registrations" element={<ComingSoon label="Inscriptions" />} />
          <Route path="projects" element={<ComingSoon label="Projets jeunes" />} />
          <Route path="talent" element={<ComingSoon label="Vitrine talents" />} />

          {/* Phase 4 stubs */}
          <Route path="reports" element={<ComingSoon label="Signalements" />} />
          <Route path="users" element={<ComingSoon label="Utilisateurs" />} />
          <Route path="recommendations" element={<ComingSoon label="IA Recommandations" />} />

          <Route path="*" element={<P><NotFoundPage /></P>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
