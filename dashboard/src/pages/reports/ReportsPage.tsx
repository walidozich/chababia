import { useMemo, useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CheckCircle, Eye, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  MOCK_CONTENT_REPORTS,
  MOCK_USERS,
  MOCK_ACTIVITIES,
  MOCK_ESTABLISHMENTS,
  MOCK_ANNOUNCEMENTS,
  MOCK_NEWSLETTERS,
  MOCK_DOCUMENTS,
} from '@/mocks'
import type { ContentReport } from '@/types/collections'
import { DEV_IS_ADMIN } from '@/lib/devRole'

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

function reporterName(id: string) {
  return MOCK_USERS.find((user) => user.id === id)?.full_name ?? 'Inconnu'
}

function resolveTarget(report: ContentReport): string {
  switch (report.target_type) {
    case 'activity':
      return MOCK_ACTIVITIES.find((activity) => activity.id === report.target_id)?.title ?? report.target_id
    case 'establishment':
      return MOCK_ESTABLISHMENTS.find((establishment) => establishment.id === report.target_id)?.name ?? report.target_id
    case 'announcement':
      return MOCK_ANNOUNCEMENTS.find((announcement) => announcement.id === report.target_id)?.title ?? report.target_id
    case 'newsletter':
      return MOCK_NEWSLETTERS.find((newsletter) => newsletter.id === report.target_id)?.title ?? report.target_id
    case 'document':
      return MOCK_DOCUMENTS.find((document) => document.id === report.target_id)?.title ?? report.target_id
    default:
      return report.target_id
  }
}

export default function ReportsPage() {
  const isSuperuser = [DEV_IS_ADMIN].some((value) => value)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('new')
  const [filterTargetType, setFilterTargetType] = useState('all')

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return MOCK_CONTENT_REPORTS.filter((report) => {
      if (query && !report.details.toLowerCase().includes(query)) return false
      if (filterStatus !== 'all' && report.status !== filterStatus) return false
      if (filterTargetType !== 'all' && report.target_type !== filterTargetType) return false
      return true
    }).sort((a, b) => b.created.localeCompare(a.created))
  }, [search, filterStatus, filterTargetType])

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
      cell: ({ row }) => <span className="font-semibold text-on-surface">{reporterName(row.original.reporter)}</span>,
    },
    {
      accessorKey: 'target_type',
      header: 'Cible',
      cell: ({ row }) => (
        <div className="max-w-[220px]">
          <StatusBadge status={TARGET_LABELS[row.original.target_type] ?? row.original.target_type} />
          <p className="mt-1 line-clamp-1 text-xs text-on-surface-variant">{resolveTarget(row.original)}</p>
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
                  onClick={() => toast.success('Signalement résolu (mock)', { description: resolveTarget(row.original) })}
                >
                  <CheckCircle className="h-3 w-3" />
                  Résolu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => toast.success('Signalement ignoré (mock)', { description: resolveTarget(row.original) })}
                >
                  <XCircle className="h-3 w-3" />
                  Ignoré
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => toast.success('Signalement examiné (mock)', { description: resolveTarget(row.original) })}
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
        description={`${String(MOCK_CONTENT_REPORTS.length)} signalements reçus`}
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
        {filtered.length === 0 ? (
          <EmptyState title="Aucun signalement trouvé" description="Modifiez les filtres de modération." />
        ) : (
          <DataTable columns={columns} data={filtered} pageSize={10} />
        )}
      </div>
    </div>
  )
}
