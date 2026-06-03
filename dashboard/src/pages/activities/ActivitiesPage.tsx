import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus, Pencil, Copy, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { MOCK_ACTIVITIES, MOCK_CATEGORIES } from '@/mocks'
import type { Activity } from '@/types/collections'
import { can } from '@/lib/permissions'
import { DEV_ROLE, DEV_IS_ADMIN } from '@/lib/devRole'

const categoryName = (id: string) =>
  MOCK_CATEGORIES.find((c) => c.id === id)?.name ?? id

export default function ActivitiesPage() {
  const canWrite = can('write', 'activities', DEV_ROLE, DEV_IS_ADMIN)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMode, setFilterMode] = useState('all')
  const [filterWilaya, setFilterWilaya] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null)

  const wilayas = useMemo(
    () => [...new Set(MOCK_ACTIVITIES.map((a) => a.wilaya))].sort(),
    [],
  )

  const filtered = useMemo(() => {
    return MOCK_ACTIVITIES.filter((a) => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.commune.toLowerCase().includes(search.toLowerCase())) return false
      if (filterStatus !== 'all' && a.status !== filterStatus) return false
      if (filterMode !== 'all' && a.activity_mode !== filterMode) return false
      if (filterWilaya !== 'all' && a.wilaya !== filterWilaya) return false
      return true
    }).sort((a, b) => a.start_datetime.localeCompare(b.start_datetime))
  }, [search, filterStatus, filterMode, filterWilaya])

  const columns: ColumnDef<Activity>[] = [
    {
      accessorKey: 'title',
      header: 'Titre',
      cell: ({ row }) => (
        <div className="max-w-[260px]">
          <p className="truncate font-semibold text-on-surface">{row.original.title}</p>
          <p className="truncate text-xs text-on-surface-variant">{categoryName(row.original.category)}</p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'activity_mode',
      header: 'Mode',
      cell: ({ row }) => <StatusBadge status={row.original.activity_mode} />,
    },
    {
      id: 'location',
      header: 'Lieu',
      cell: ({ row }) => (
        <span className="text-on-surface-variant">
          {row.original.commune}, {row.original.wilaya}
        </span>
      ),
    },
    {
      accessorKey: 'start_datetime',
      header: 'Date début',
      cell: ({ row }) =>
        row.original.start_datetime
          ? format(new Date(row.original.start_datetime), 'd MMM yyyy', { locale: fr })
          : '—',
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          {canWrite && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link to={`/activities/${row.original.id}`}>
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  toast.success('Brouillon dupliqué', { description: row.original.title })
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-error hover:bg-error/10 hover:text-error"
                onClick={() => setDeleteTarget(row.original)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activités"
        description={`${MOCK_ACTIVITIES.length} activités au total`}
        action={
          canWrite ? (
            <Button asChild size="sm">
              <Link to="/activities/new">
                <Plus className="h-4 w-4" />
                Nouvelle activité
              </Link>
            </Button>
          ) : undefined
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="published">Publiés</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
            <SelectItem value="cancelled">Annulés</SelectItem>
            <SelectItem value="archived">Archivés</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterMode} onValueChange={setFilterMode}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les modes</SelectItem>
            <SelectItem value="physical">Présentiel</SelectItem>
            <SelectItem value="online">En ligne</SelectItem>
            <SelectItem value="hybrid">Hybride</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterWilaya} onValueChange={setFilterWilaya}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Wilaya" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les wilayas</SelectItem>
            {wilayas.map((w) => (
              <SelectItem key={w} value={w}>{w}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bento-card">
        {filtered.length === 0 ? (
          <EmptyState
            title="Aucune activité trouvée"
            description="Modifiez les filtres ou créez une nouvelle activité."
            action={canWrite ? <Button asChild size="sm"><Link to="/activities/new"><Plus className="h-4 w-4" />Créer</Link></Button> : undefined}
          />
        ) : (
          <DataTable columns={columns} data={filtered} pageSize={8} />
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Supprimer l'activité ?"
        description={`« ${deleteTarget?.title} » sera supprimée définitivement.`}
        confirmLabel="Supprimer"
        destructive
        onConfirm={() => {
          toast.success('Activité supprimée (mock — aucun changement réel)')
          setDeleteTarget(null)
        }}
      />
    </div>
  )
}
