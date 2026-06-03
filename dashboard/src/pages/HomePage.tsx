import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  Zap,
  Building2,
  ClipboardList,
  AlertTriangle,
  Rocket,
  Plus,
  ChevronRight,
  Megaphone,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { MOCK_ACTIVITIES } from '@/mocks'
import { MOCK_REGISTRATIONS } from '@/mocks'
import { MOCK_CONTENT_REPORTS } from '@/mocks'
import { MOCK_ESTABLISHMENTS } from '@/mocks'
import { MOCK_PROJECT_SUBMISSIONS } from '@/mocks'

// ─── Design tokens for recharts (hex) ────────────────────────────────────────
const C = {
  lime: '#9fe870',         // primary-container
  limeDeep: '#2f6c00',     // primary
  forest: '#bae099',       // tertiary-container
  forestDeep: '#47672d',   // tertiary
  gray: '#dbded9',         // secondary-container
  grayDeep: '#5b5f5c',     // secondary
  surface: '#fbf9f3',      // surface
  surfaceContainer: '#efeee8',
  outline: '#c1cab5',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  text: '#1b1c19',         // on-surface
  textMuted: '#41493a',    // on-surface-variant
  orange: '#f4a261',
}

// ─── Derived data from mocks ──────────────────────────────────────────────────

const activityStatusData = [
  { name: 'Publiées', value: MOCK_ACTIVITIES.filter((a) => a.status === 'published').length, color: C.lime },
  { name: 'Brouillons', value: MOCK_ACTIVITIES.filter((a) => a.status === 'draft').length, color: C.gray },
  { name: 'Annulées', value: MOCK_ACTIVITIES.filter((a) => a.status === 'cancelled').length, color: C.errorContainer },
  { name: 'Archivées', value: MOCK_ACTIVITIES.filter((a) => a.status === 'archived').length, color: C.outline },
].filter((d) => d.value > 0)

const registrationStatusData = [
  { name: 'Inscrits', value: MOCK_REGISTRATIONS.filter((r) => r.status === 'registered').length, color: C.lime },
  { name: 'Présents', value: MOCK_REGISTRATIONS.filter((r) => r.status === 'attended').length, color: C.forest },
  { name: 'Liste att.', value: MOCK_REGISTRATIONS.filter((r) => r.status === 'waiting_list').length, color: C.gray },
  { name: 'Annulés', value: MOCK_REGISTRATIONS.filter((r) => r.status === 'cancelled').length, color: C.errorContainer },
].filter((d) => d.value > 0)

const activitiesByWilaya = Object.entries(
  MOCK_ACTIVITIES.reduce<Record<string, number>>((acc, a) => {
    acc[a.wilaya] = (acc[a.wilaya] ?? 0) + 1
    return acc
  }, {}),
).map(([wilaya, count]) => ({ wilaya, count }))

const activityModeData = [
  { name: 'Présentiel', value: MOCK_ACTIVITIES.filter((a) => a.activity_mode === 'physical').length, color: C.lime },
  { name: 'En ligne', value: MOCK_ACTIVITIES.filter((a) => a.activity_mode === 'online').length, color: C.forest },
  { name: 'Hybride', value: MOCK_ACTIVITIES.filter((a) => a.activity_mode === 'hybrid').length, color: C.gray },
].filter((d) => d.value > 0)

const projectStatusData = [
  { name: 'Soumis', value: MOCK_PROJECT_SUBMISSIONS.filter((p) => p.status === 'submitted').length, color: C.lime },
  { name: 'Examiné', value: MOCK_PROJECT_SUBMISSIONS.filter((p) => p.status === 'reviewed').length, color: C.gray },
  { name: 'Accepté', value: MOCK_PROJECT_SUBMISSIONS.filter((p) => p.status === 'accepted').length, color: C.forest },
  { name: 'Info manq.', value: MOCK_PROJECT_SUBMISSIONS.filter((p) => p.status === 'needs_more_info').length, color: C.orange },
].filter((d) => d.value > 0)

const upcomingActivities = [...MOCK_ACTIVITIES]
  .filter((a) => a.status === 'published')
  .sort((a, b) => a.start_datetime.localeCompare(b.start_datetime))
  .slice(0, 5)

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-outline bg-surface p-3 shadow-md text-body-sm">
      {label && <p className="mb-1 font-semibold text-on-surface">{label}</p>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-on-surface-variant">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span>{p.name}:</span>
          <span className="font-semibold text-on-surface">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const publishedActivities = MOCK_ACTIVITIES.filter((a) => a.status === 'published').length
  const activeEstablishments = MOCK_ESTABLISHMENTS.filter((e) => e.status === 'published').length
  const openReports = MOCK_CONTENT_REPORTS.filter((r) => r.status === 'new').length
  const pendingProjects = MOCK_PROJECT_SUBMISSIONS.filter((p) => p.status === 'submitted').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de la plateforme Chababia — Données de démonstration"
        action={
          <Button asChild size="sm">
            <Link to="/activities/new">
              <Plus className="h-4 w-4" />
              Nouvelle activité
            </Link>
          </Button>
        }
      />

      {/* ── Row 1 — KPIs ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Activités publiées"
          value={publishedActivities}
          icon={Zap}
          accent="bg-primary-container text-primary-on-container"
          sub={`${MOCK_ACTIVITIES.length} total`}
        />
        <KpiCard
          label="Établissements actifs"
          value={activeEstablishments}
          icon={Building2}
          accent="bg-tertiary-container text-tertiary-on-container"
          sub={`${MOCK_ESTABLISHMENTS.length} total`}
        />
        <KpiCard
          label="Inscriptions"
          value={MOCK_REGISTRATIONS.length}
          icon={ClipboardList}
          accent="bg-secondary-container text-secondary-on-container"
          sub={`${MOCK_REGISTRATIONS.filter((r) => r.status === 'attended').length} présences`}
        />
        <KpiCard
          label="Signalements ouverts"
          value={openReports}
          icon={AlertTriangle}
          accent="bg-error-container text-error-on-container"
          sub="Nécessitent attention"
        />
      </div>

      {/* ── Row 2 — Activity status donut + Registration bar ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Donut — activités par statut */}
        <div className="bento-card flex flex-col gap-4">
          <p className="text-label-lg font-bold text-on-surface">Activités par statut</p>
          <div className="relative h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {activityStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-headline-sm font-black text-on-surface">{MOCK_ACTIVITIES.length}</p>
              <p className="text-xs text-on-surface-variant">total</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {activityStatusData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-xs text-on-surface-variant">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar — inscriptions par statut */}
        <div className="bento-card col-span-1 flex flex-col gap-4 lg:col-span-2">
          <p className="text-label-lg font-bold text-on-surface">Inscriptions par statut</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationStatusData} barSize={28} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={C.outline} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: C.textMuted }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: C.textMuted }}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: C.surfaceContainer }} />
                <Bar dataKey="value" name="Inscriptions" radius={[6, 6, 0, 0]}>
                  {registrationStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 3 — Wilaya bar + mode donut + projects bar ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Horizontal bar — activités par wilaya */}
        <div className="bento-card flex flex-col gap-4">
          <p className="text-label-lg font-bold text-on-surface">Activités par wilaya</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activitiesByWilaya}
                layout="vertical"
                barSize={18}
                margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
              >
                <XAxis type="number" hide allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="wilaya"
                  axisLine={false}
                  tickLine={false}
                  width={90}
                  tick={{ fontSize: 11, fill: C.textMuted }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: C.surfaceContainer }} />
                <Bar dataKey="count" name="Activités" fill={C.lime} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut — mode */}
        <div className="bento-card flex flex-col gap-4">
          <p className="text-label-lg font-bold text-on-surface">Mode d'activité</p>
          <div className="relative h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityModeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {activityModeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2">
            {activityModeData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-xs text-on-surface-variant">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar — projets par statut */}
        <div className="bento-card flex flex-col gap-4">
          <p className="text-label-lg font-bold text-on-surface">Projets jeunes</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStatusData} barSize={24} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={C.outline} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: C.textMuted }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: C.textMuted }}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: C.surfaceContainer }} />
                <Bar dataKey="value" name="Projets" radius={[6, 6, 0, 0]}>
                  {projectStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">{pendingProjects} en attente de traitement</span>
            <Link to="/projects" className="flex items-center gap-0.5 text-xs font-semibold text-primary-on-container hover:underline">
              Voir tout <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 4 — Upcoming activities + Quick actions ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Prochaines activités */}
        <div className="bento-card col-span-1 flex flex-col gap-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-label-lg font-bold text-on-surface">Prochaines activités</p>
            <Link to="/activities">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                Voir toutes <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-outline">
            {upcomingActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-label-sm font-semibold text-on-surface">
                    {activity.title}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {activity.commune} · {activity.wilaya}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-xs font-medium text-on-surface">
                    {format(new Date(activity.start_datetime), 'd MMM', { locale: fr })}
                  </span>
                  <StatusBadge status={activity.activity_mode} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bento-card flex flex-col gap-3">
          <p className="text-label-lg font-bold text-on-surface">Actions rapides</p>
          <div className="flex flex-col gap-2">
            <Link
              to="/activities/new"
              className="flex items-center gap-3 rounded-xl border border-outline px-3 py-2.5 text-label-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-container">
                <Zap className="h-3.5 w-3.5 text-primary-on-container" />
              </div>
              Créer une activité
            </Link>
            <Link
              to="/announcements/new"
              className="flex items-center gap-3 rounded-xl border border-outline px-3 py-2.5 text-label-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-tertiary-container">
                <Megaphone className="h-3.5 w-3.5 text-tertiary-on-tertiary" />
              </div>
              Rédiger une annonce
            </Link>
            <Link
              to="/reports"
              className="flex items-center justify-between gap-3 rounded-xl border border-outline px-3 py-2.5 text-label-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-error-container">
                  <AlertTriangle className="h-3.5 w-3.5 text-error" />
                </div>
                Voir les signalements
              </div>
              {openReports > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-error text-xs font-bold text-white">
                  {openReports}
                </span>
              )}
            </Link>
            <Link
              to="/projects"
              className="flex items-center justify-between gap-3 rounded-xl border border-outline px-3 py-2.5 text-label-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary-container">
                  <Rocket className="h-3.5 w-3.5 text-secondary" />
                </div>
                Traiter les projets
              </div>
              {pendingProjects > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-primary-on-container">
                  {pendingProjects}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
