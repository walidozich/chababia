import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Download, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { MOCK_REGISTRATIONS, MOCK_ACTIVITIES } from '@/mocks'
import type { Registration } from '@/types/collections'
import { can } from '@/lib/permissions'
import { DEV_ROLE, DEV_IS_ADMIN } from '@/lib/devRole'

const activityTitle = (id: string) =>
  MOCK_ACTIVITIES.find((activity) => activity.id === id)?.title ?? id

function exportCSV(rows: Registration[]) {
  const header = 'Nom,Email,Téléphone,Statut,Pointage'
  const lines = rows.map((registration) =>
    [
      registration.full_name,
      registration.email,
      registration.phone,
      registration.status,
      registration.checked_in_at || '',
    ].join(','),
  )
  const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'inscriptions.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export default function RegistrationsPage() {
  const canWrite = can('write', 'registrations', DEV_ROLE, DEV_IS_ADMIN)
  const [search, setSearch] = useState('')
  const [filterActivity, setFilterActivity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return MOCK_REGISTRATIONS.filter((registration) => {
      if (
        query &&
        !registration.full_name.toLowerCase().includes(query) &&
        !registration.email.toLowerCase().includes(query)
      ) return false
      if (filterActivity !== 'all' && registration.activity !== filterActivity) return false
      if (filterStatus !== 'all' && registration.status !== filterStatus) return false
      return true
    }).sort((a, b) => b.created.localeCompare(a.created))
  }, [search, filterActivity, filterStatus])

  const activityStats = useMemo(() => {
    return MOCK_ACTIVITIES.map((activity) => {
      const rows = MOCK_REGISTRATIONS.filter((registration) => registration.activity === activity.id)
      const registered = rows.filter(
        (registration) => registration.status === 'registered' || registration.status === 'attended',
      ).length
      const waiting = rows.filter((registration) => registration.status === 'waiting_list').length
      return { activity, registered, waiting }
    }).filter((item) => item.registered > 0 || item.waiting > 0)
  }, [])

  const columns: ColumnDef<Registration>[] = [
    {
      accessorKey: 'full_name',
      header: 'Participant',
      cell: ({ row }) => (
        <div className="max-w-[220px]">
          <p className="truncate font-semibold text-on-surface">{row.original.full_name}</p>
          <p className="truncate text-xs text-on-surface-variant">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Téléphone',
      cell: ({ row }) => <span className="text-on-surface-variant">{row.original.phone || '—'}</span>,
    },
    {
      accessorKey: 'activity',
      header: 'Activité',
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-[240px] text-on-surface-variant">
          {activityTitle(row.original.activity)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'checked_in_at',
      header: 'Pointage',
      cell: ({ row }) =>
        row.original.checked_in_at
          ? format(new Date(row.original.checked_in_at), 'd MMM yyyy, HH:mm', { locale: fr })
          : <span className="text-on-surface-variant/60">—</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          {canWrite && row.original.status === 'registered' ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => toast.success('Pointage enregistré (mock)', { description: row.original.full_name })}
            >
              <UserCheck className="h-3 w-3" />
              Marquer présent
            </Button>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inscriptions"
        description={`${String(MOCK_REGISTRATIONS.length)} inscriptions au total`}
        action={
          <Button
            size="sm"
            onClick={() => {
              exportCSV(filtered)
            }}
          >
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {activityStats.map(({ activity, registered, waiting }) => (
          <div key={activity.id} className="bento-card space-y-1">
            <p className="line-clamp-1 text-label-lg font-bold text-on-surface">{activity.title}</p>
            <p className="text-body-sm text-on-surface-variant">
              {registered} inscrits / {activity.capacity || '—'} capacité
              {waiting > 0 ? ` · ${String(waiting)} en liste d'attente` : ''}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Rechercher nom ou email..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
          }}
          className="w-56"
        />
        <Select value={filterActivity} onValueChange={setFilterActivity}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Activité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les activités</SelectItem>
            {MOCK_ACTIVITIES.map((activity) => (
              <SelectItem key={activity.id} value={activity.id}>{activity.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="registered">Inscrits</SelectItem>
            <SelectItem value="waiting_list">Liste d'attente</SelectItem>
            <SelectItem value="attended">Présents</SelectItem>
            <SelectItem value="cancelled">Annulés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bento-card">
        {filtered.length === 0 ? (
          <EmptyState title="Aucune inscription trouvée" description="Modifiez les filtres de recherche." />
        ) : (
          <DataTable columns={columns} data={filtered} pageSize={10} />
        )}
      </div>
    </div>
  )
}
