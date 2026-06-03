import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageSkeleton } from '@/components/shared/LoadingSkeletons'

const HomePage = lazy(() => import('@/pages/HomePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Phase 2+ pages — stubs until implemented
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">À venir</p>
      <h1 className="text-headline-sm font-extrabold text-on-surface">{label}</h1>
      <p className="text-body-sm text-on-surface-variant">Cette section sera disponible en Phase 2.</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<ComingSoon label="Connexion" />} />

        {/* App */}
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageSkeleton />}>
                <HomePage />
              </Suspense>
            }
          />
          {/* Phase 2 — Content */}
          <Route path="activities" element={<ComingSoon label="Activités" />} />
          <Route path="activities/new" element={<ComingSoon label="Nouvelle activité" />} />
          <Route path="activities/:id" element={<ComingSoon label="Détail activité" />} />
          <Route path="announcements" element={<ComingSoon label="Annonces" />} />
          <Route path="announcements/new" element={<ComingSoon label="Nouvelle annonce" />} />
          <Route path="newsletters" element={<ComingSoon label="Newsletters" />} />
          <Route path="documents" element={<ComingSoon label="Documents" />} />
          <Route path="establishments" element={<ComingSoon label="Établissements" />} />
          <Route path="categories" element={<ComingSoon label="Catégories" />} />
          {/* Phase 3 — Engagement */}
          <Route path="registrations" element={<ComingSoon label="Inscriptions" />} />
          <Route path="projects" element={<ComingSoon label="Projets jeunes" />} />
          <Route path="talent" element={<ComingSoon label="Vitrine talents" />} />
          {/* Phase 4 — Admin */}
          <Route path="reports" element={<ComingSoon label="Signalements" />} />
          <Route path="users" element={<ComingSoon label="Utilisateurs" />} />
          <Route path="recommendations" element={<ComingSoon label="IA Recommandations" />} />
          {/* 404 within layout */}
          <Route
            path="*"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
