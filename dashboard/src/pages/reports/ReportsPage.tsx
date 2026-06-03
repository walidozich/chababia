import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CheckCircle, Eye, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { TableSkeleton } from '@/components/shared/LoadingSkeletons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Activity, Announcement, ContentReport, Document, Establishment, Newsletter } from '@/types/collections'
import { useAuthStore } from '@/stores/authStore'
import { COLLECTIONS, getFullList, qk } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'

const REASON_LABELS: Record<string, string> = {
  outdated_info: 'Info obsolète',
  wrong_contact: 'Contact erroné',
  cancelled: 'Activité annulée',
  wrong_location: 'Mauvais lieu',
  other: 'Autre',
}

const TARGET_LABELS: Record<string, string> = {
  activity: 'Activité',
  establishment: 'Établissement',
  announcement: 'Annonce',
  newsletter: 'Newsletter',
  document: 'Document',
}

function resolveTarget(
  report: ContentReport,
  targets: {
    activities: Map<string, string>
    establishments: Map<string, string>
    announcements: Map<string, string>
    newsletters: Map<string, string>
    documents: Map<string, string>
  },
): string {
  switch (report.target_type) {
    case 'activity':
      return targets.activities.get(report.target_id) ?? report.target_id
    case 'establishment':
      return targets.establishments.get(report.target_id) ?? report.target_id
    case 'announcement':
      return targets.announcements.get(report.target_id) ?? report.target_id
    case 'newsletter':
      return targets.newsletters.get(report.target_id) ?? report.target_id
    case 'document':
      return targets.documents.get(report.target_id) ?? report.target_id
    default:
      return report.target_id
  }
}

export default function ReportsPage() {
  const isSuperuser = useAuthStore((state) => state.isAdmin)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('new')
  const [filterTargetType, setFilterTargetType] = useState('all')

  const reportsQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.contentReports),
    queryFn: () => getFullList<ContentReport>(COLLECTIONS.contentReports, {
      sort: '-created',
      expand: 'reporter',
    }),
    enabled: isSuperuser,
    staleTime: STALE.contentReports,
  })

  const activitiesQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.activities, 'report-targets'),
    queryFn: () => getFullList<Activity>(COLLECTIONS.activities, { fields: 'id,title' }),
    enabled: isSuperuser,
    staleTime: STALE.activities,
  })

  const establishmentsQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.establishments, 'report-targets'),
    queryFn: () => getFullList<Establishment>(COLLECTIONS.establishments, { fields: 'id,name' }),
    enabled: isSuperuser,
    staleTime: STALE.establishments,
  })

  const announcementsQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.announcements, 'report-targets'),
    queryFn: () => getFullList<Announcement>(COLLECTIONS.announcements, { fields: 'id,title' }),
    enabled: isSuperuser,
    staleTime: STALE.announcements,
  })

  const newslettersQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.newsletters, 'report-targets'),
    queryFn: () => getFullList<Newsletter>(COLLECTIONS.newsletters, { fields: 'id,title' }),
    enabled: isSuperuser,
    staleTime: STALE.newsletters,
  })

  const documentsQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.documents, 'report-targets'),
    queryFn: () => getFullList<Document>(COLLECTIONS.documents, { fields: 'id,title' }),
    enabled: isSuperuser,
    staleTime: STALE.documents,
  })

  const reports = reportsQuery.data ?? []
  const targets = useMemo(() => ({
    activities: new Map((activitiesQuery.data ?? []).map((item) => [item.id, item.title])),
    establishments: new Map((establishmentsQuery.data ?? []).map((item) => [item.id, item.name])),
    announcements: new Map((announcementsQuery.data ?? []).map((item) => [item.id, item.title])),
    newsletters: new Map((newslettersQuery.data ?? []).map((item) => [item.id, item.title])),
    documents: new Map((documentsQuery.data ?? []).map((item) => [item.id, item.title])),
  }), [activitiesQuery.data, announcementsQuery.data, documentsQuery.data, establishmentsQuery.data, newslettersQuery.data])

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return reports.filter((report) => {
      if (query && !report.details.toLowerCase().includes(query)) return false
      if (filterStatus !== 'all' && report.status !== filterStatus) return false
      if (filterTargetType !== 'all' && report.target_type !== filterTargetType) return false
      return true
    })
  }, [reports, search, filterStatus, filterTargetType])

  if (!isSuperuser) {
    return (
      <div className="bento-card py-16 text-center">
        <p className="text-label-lg font-bold text-error">Accès réservé aux superadmins.</p>
      </div>
    )
  }

  const columns: ColumnDef<ContentReport>[] = [
    {
      accessorKey: 'reporter',
      header: 'Reporter',
      cell: ({ row }) => <span className="font-semibold text-on-surface">{row.original.expand?.reporter?.full_name ?? 'Inconnu'}</span>,
    },
    {
      accessorKey: 'target_type',
      header: 'Cible',
      cell: ({ row }) => (
        <div className="max-w-[220px]">
          <StatusBadge status={TARGET_LABELS[row.original.target_type] ?? row.original.target_type} />
          <p className="mt-1 line-clamp-1 text-xs text-on-surface-variant">{resolveTarget(row.original, targets)}</p>
        </div>
      ),
    },
    {
      accessorKey: 'reason',
      header: 'Raison',
      cell: ({ row }) => <span className="text-on-surface-variant">{REASON_LABELS[row.original.reason]}</span>,
    },
    {
      accessorKey: 'details',
      header: 'Détails',
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-[260px] text-on-surface-variant">
          {row.original.details.length > 80 ? `${row.original.details.slice(0, 80)}...` : row.original.details}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'created',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.created), 'd MMM yyyy', { locale: fr }),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const isActionable = row.original.status === 'new' || row.original.status === 'reviewed'
        return (
          <div className="flex flex-wrap justify-end gap-1">
            {isActionable && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => toast.info('Traitement côté serveur requis', { description: resolveTarget(row.original, targets) })}
                >
                  <CheckCircle className="h-3 w-3" />
                  Résolu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => toast.info('Traitement côté serveur requis', { description: resolveTarget(row.original, targets) })}
                >
                  <XCircle className="h-3 w-3" />
                  Ignoré
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => toast.info('Traitement côté serveur requis', { description: resolveTarget(row.original, targets) })}
                >
                  <Eye className="h-3 w-3" />
                  Examiné
                </Button>
              </>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Signalements"
        description={`${String(reports.length)} signalements reçus`}
      />

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Rechercher dans les détails..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
          }}
          className="w-64"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="new">Nouveaux</SelectItem>
            <SelectItem value="reviewed">Examinés</SelectItem>
            <SelectItem value="resolved">Résolus</SelectItem>
            <SelectItem value="dismissed">Ignorés</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterTargetType} onValueChange={setFilterTargetType}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Type de cible" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les cibles</SelectItem>
            <SelectItem value="activity">Activités</SelectItem>
            <SelectItem value="establishment">Établissements</SelectItem>
            <SelectItem value="announcement">Annonces</SelectItem>
            <SelectItem value="newsletter">Newsletters</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bento-card">
        {reportsQuery.isLoading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : reportsQuery.error ? (
          <ErrorState onRetry={() => { void reportsQuery.refetch() }} />
        ) : filtered.length === 0 ? (
          <EmptyState title="Aucun signalement trouvé" description="Modifiez les filtres de modération." />
        ) : (
          <DataTable columns={columns} data={filtered} pageSize={10} />
        )}
      </div>
    </div>
  )
}
