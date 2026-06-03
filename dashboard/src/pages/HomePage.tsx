import { lazy, Suspense } from 'react'
import {
  Zap,
  Building2,
  ClipboardList,
  AlertTriangle,
  Rocket,
  Plus,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageHeader } from '@/components/shared/PageHeader'
import { KpiSkeleton, ChartSkeleton } from '@/components/shared/LoadingSkeletons'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import type { Activity, ContentReport, Establishment, ProjectSubmission, Registration } from '@/types/collections'
import { COLLECTIONS, getFullList, qk } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'

// Recharts and all chart rendering is deferred in a separate chunk
const HomeCharts = lazy(() => import('./HomeCharts'))
const EstablishmentsMap = lazy(() => import('@/components/shared/EstablishmentsMap'))

// ─── KPI card ─────────────────────────────────────────────────────────────────

interface KpiProps {
  label: string
  value: number
  icon: React.ElementType
  accent: string
  sub?: string
}

function KpiCard({ label, value, icon: Icon, accent, sub }: KpiProps) {
  return (
    <div className="bento-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-label-sm font-semibold text-on-surface-variant">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <p className="text-display-lg font-black leading-none text-on-surface">{value}</p>
        {sub && <p className="mt-1 text-xs text-on-surface-variant">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Charts skeleton — shown while the HomeCharts chunk loads ─────────────────

function HomeChartsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartSkeleton height={176} />
        <div className="lg:col-span-2"><ChartSkeleton height={176} /></div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartSkeleton height={160} />
        <ChartSkeleton height={160} />
        <ChartSkeleton height={160} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><ChartSkeleton height={192} /></div>
        <ChartSkeleton height={192} />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const isAdmin = useAuthStore((state) => state.isAdmin)

  const activitiesQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.activities, 'home'),
    queryFn: () => getFullList<Activity>(COLLECTIONS.activities, {
      fields: 'id,title,status,activity_mode,commune,wilaya,start_datetime',
      sort: 'start_datetime',
    }),
    staleTime: STALE.activities,
  })
  const establishmentsQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.establishments, 'home'),
    queryFn: () => getFullList<Establishment>(COLLECTIONS.establishments, {
      filter: 'status = "published"',
      sort: 'name',
    }),
    staleTime: STALE.establishments,
  })
  const registrationsQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.registrations, 'home'),
    queryFn: () => getFullList<Registration>(COLLECTIONS.registrations, {
      fields: 'id,status',
    }),
    staleTime: STALE.registrations,
  })
  const reportsQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.contentReports, 'home'),
    queryFn: () => getFullList<ContentReport>(COLLECTIONS.contentReports, {
      fields: 'id,status',
    }),
    enabled: isAdmin,
    staleTime: STALE.contentReports,
  })
  const projectsQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.projectSubmissions, 'home'),
    queryFn: () => getFullList<ProjectSubmission>(COLLECTIONS.projectSubmissions, {
      fields: 'id,status',
    }),
    staleTime: STALE.projectSubmissions,
  })

  const activities = activitiesQuery.data ?? []
  const establishments = establishmentsQuery.data ?? []
  const registrations = registrationsQuery.data ?? []
  const reports = reportsQuery.data ?? []
  const projects = projectsQuery.data ?? []

  const isKpiLoading =
    activitiesQuery.isLoading ||
    establishmentsQuery.isLoading ||
    registrationsQuery.isLoading ||
    projectsQuery.isLoading

  const publishedActivities = activities.filter((a) => a.status === 'published').length
  const activeEstablishments = establishments.filter((e) => e.status === 'published').length
  const totalRegistrations = registrations.length
  const openReports = isAdmin ? reports.filter((r) => r.status === 'new').length : null
  const pendingProjects = projects.filter((p) => p.status === 'submitted').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de la plateforme Chababia"
        action={
          <Button asChild size="sm">
            <Link to="/activities/new">
              <Plus className="h-4 w-4" />
              Nouvelle activité
            </Link>
          </Button>
        }
      />

      {/* ── Row 1 — KPIs (render immediately, skeleton while loading) ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {isKpiLoading ? (
          Array.from({ length: 5 }).map((_, i) => <KpiSkeleton key={i} />)
        ) : (
          <>
            <KpiCard
              label="Activités publiées"
              value={publishedActivities}
              icon={Zap}
              accent="bg-primary-container text-primary-on-container"
              sub={`${String(activities.length)} total`}
            />
            <KpiCard
              label="Établissements actifs"
              value={activeEstablishments}
              icon={Building2}
              accent="bg-tertiary-container text-tertiary-on-container"
              sub={`${String(establishments.length)} total`}
            />
            <KpiCard
              label="Inscriptions"
              value={totalRegistrations}
              icon={ClipboardList}
              accent="bg-secondary-container text-secondary-on-container"
              sub={`${String(registrations.filter((r) => r.status === 'attended').length)} présences`}
            />
            {openReports !== null && (
              <KpiCard
                label="Signalements ouverts"
                value={openReports}
                icon={AlertTriangle}
                accent="bg-error-container text-error-on-container"
                sub="Nécessitent attention"
              />
            )}
            <div className="bento-card flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-label-sm font-semibold text-on-surface-variant">Projets en attente</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-tertiary-container text-tertiary-on-container">
                  <Rocket className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className="text-display-lg font-black leading-none text-tertiary">{pendingProjects}</p>
                <Link to="/projects" className="mt-2 inline-flex text-label-sm text-primary hover:underline">
                  Voir les soumissions
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Carte territoriale ── */}
      <div className="bento-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-label-lg font-bold text-on-surface">Couverture territoriale</h2>
            <p className="text-body-sm text-on-surface-variant">
              {activeEstablishments} établissements · {
                new Set(establishments.map((e) => e.commune).filter(Boolean)).size
              } communes
            </p>
          </div>
        </div>
        <Suspense fallback={
          <div
            className="flex animate-pulse items-center justify-center rounded-xl bg-surface"
            style={{ height: 400 }}
          >
            <p className="text-body-sm text-on-surface-variant">Chargement de la carte...</p>
          </div>
        }>
          <EstablishmentsMap establishments={establishments} height={400} />
        </Suspense>
      </div>

      {/* ── Charts — lazy chunk, deferred until after KPIs ── */}
      <Suspense fallback={<HomeChartsSkeleton />}>
        <HomeCharts />
      </Suspense>
    </div>
  )
}
