import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { ErrorState } from '@/components/shared/ErrorState'
import { TableSkeleton } from '@/components/shared/LoadingSkeletons'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import type { Activity, Category } from '@/types/collections'
import { can } from '@/lib/permissions'
import { useAuthStore } from '@/stores/authStore'
import { COLLECTIONS, createRecord, deleteRecord, getFullList, qk, scrubServerFields } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'

function VerifiedIndicator({ date }: { date: string }) {
  if (!date) return <span className="text-xs text-on-surface-variant/50">Non vérifié</span>
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
  if (days > 30) return <span className="text-xs text-error">Vérifié il y a {days}j · à revoir</span>
  return <span className="text-xs text-on-surface-variant">Vérifié il y a {days}j</span>
}

export default function ActivitiesPage() {
  const { role, isAdmin } = useAuthStore()
  const canWrite = can('write', 'activities', role, isAdmin)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMode, setFilterMode] = useState('all')
  const [filterWilaya, setFilterWilaya] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null)
  const queryClient = useQueryClient()

  const activitiesQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.activities),
    queryFn: () => getFullList<Activity>(COLLECTIONS.activities, {
      sort: 'start_datetime',
      expand: 'category,establishment',
    }),
    staleTime: STALE.activities,
  })

  const categoriesQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.categories, 'lookup'),
    queryFn: () => getFullList<Category>(COLLECTIONS.categories, {
      fields: 'id,name,status',
      sort: 'name',
    }),
    staleTime: STALE.categories,
  })

  const activities = activitiesQuery.data ?? []
  const categories = categoriesQuery.data ?? []
  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  )

  const wilayas = useMemo(
    () => [...new Set(activities.map((a) => a.wilaya))].sort(),
    [activities],
  )

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.commune.toLowerCase().includes(search.toLowerCase())) return false
      if (filterStatus !== 'all' && a.status !== filterStatus) return false
      if (filterMode !== 'all' && a.activity_mode !== filterMode) return false
      if (filterWilaya !== 'all' && a.wilaya !== filterWilaya) return false
      return true
    })
  }, [activities, search, filterStatus, filterMode, filterWilaya])

  const deleteMutation = useMutation({
    mutationFn: (activity: Activity) => deleteRecord(COLLECTIONS.activities, activity.id),
    onSuccess: () => {
      toast.success('Activité supprimée')
      setDeleteTarget(null)
      void queryClient.invalidateQueries({ queryKey: qk.collection(COLLECTIONS.activities) })
    },
  })

  const duplicateMutation = useMutation({
    mutationFn: (activity: Activity) => createRecord<Activity>(COLLECTIONS.activities, {
      ...scrubServerFields(activity as unknown as Record<string, unknown>),
      title: `${activity.title} (copie)`,
      status: 'draft',
      image: '',
    }),
    onSuccess: (activity) => {
      toast.success('Brouillon dupliqué', { description: activity.title })
      void queryClient.invalidateQueries({ queryKey: qk.collection(COLLECTIONS.activities) })
    },
  })

  const isLoading = activitiesQuery.isLoading || categoriesQuery.isLoading
  const error = activitiesQuery.error ?? categoriesQuery.error

  const columns: ColumnDef<Activity>[] = [
    {
      accessorKey: 'title',
      header: 'Titre',
      cell: ({ row }) => (
        <div className="max-w-[260px]">
          <p className="truncate font-semibold text-on-surface">{row.original.title}</p>
          <p className="truncate text-xs text-on-surface-variant">
            {row.original.expand?.category?.name ?? categoryMap.get(row.original.category) ?? row.original.category}
          </p>
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
      accessorKey: 'last_verified_at',
      header: 'Vérification',
      cell: ({ row }) => <VerifiedIndicator date={row.original.last_verified_at} />,
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
                disabled={duplicateMutation.isPending}
                onClick={() => duplicateMutation.mutate(row.original)}
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
        description={`${activities.length} activités au total`}
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
        {isLoading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : error ? (
          <ErrorState onRetry={() => { void activitiesQuery.refetch(); void categoriesQuery.refetch() }} />
        ) : filtered.length === 0 ? (
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
        onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget) }}
      />
    </div>
  )
}
