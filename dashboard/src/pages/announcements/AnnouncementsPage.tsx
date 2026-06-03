import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ErrorState } from '@/components/shared/ErrorState'
import { TableSkeleton } from '@/components/shared/LoadingSkeletons'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import type { Announcement } from '@/types/collections'
import { can } from '@/lib/permissions'
import { useAuthStore } from '@/stores/authStore'
import { COLLECTIONS, deleteRecord, getFullList, qk } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'

function VerifiedIndicator({ date }: { date: string }) {
  if (!date) return <span className="text-xs text-on-surface-variant/50">Non vérifié</span>
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
  if (days > 30) return <span className="text-xs text-error">Vérifié il y a {days}j · à revoir</span>
  return <span className="text-xs text-on-surface-variant">Vérifié il y a {days}j</span>
}

export default function AnnouncementsPage() {
  const { role, isAdmin } = useAuthStore()
  const canWrite = can('write', 'announcements', role, isAdmin)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterLang, setFilterLang] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null)
  const queryClient = useQueryClient()

  const announcementsQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.announcements),
    queryFn: () => getFullList<Announcement>(COLLECTIONS.announcements, { sort: '-created' }),
    staleTime: STALE.announcements,
  })

  const announcements = announcementsQuery.data ?? []

  const filtered = useMemo(() => announcements.filter((a) => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatus !== 'all' && a.status !== filterStatus) return false
    if (filterPriority !== 'all' && a.priority !== filterPriority) return false
    if (filterLang !== 'all' && a.language !== filterLang) return false
    return true
  }), [announcements, search, filterStatus, filterPriority, filterLang])

  const deleteMutation = useMutation({
    mutationFn: (announcement: Announcement) => deleteRecord(COLLECTIONS.announcements, announcement.id),
    onSuccess: () => {
      toast.success('Annonce supprimée')
      setDeleteTarget(null)
      void queryClient.invalidateQueries({ queryKey: qk.collection(COLLECTIONS.announcements) })
    },
  })

  const columns: ColumnDef<Announcement>[] = [
    {
      accessorKey: 'title',
      header: 'Titre',
      cell: ({ row }) => (
        <div className="max-w-[320px]">
          <p className="truncate font-semibold text-on-surface">{row.original.title}</p>
          <p className="truncate text-xs text-on-surface-variant">{row.original.content.slice(0, 60)}…</p>
        </div>
      ),
    },
    { accessorKey: 'priority', header: 'Priorité', cell: ({ row }) => <StatusBadge status={row.original.priority} /> },
    { accessorKey: 'status', header: 'Statut', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'language', header: 'Langue', cell: ({ row }) => <span className="rounded-full border border-outline px-2 py-0.5 text-xs font-semibold text-on-surface-variant">{row.original.language.toUpperCase()}</span> },
    { accessorKey: 'created', header: 'Date', cell: ({ row }) => format(new Date(row.original.created), 'd MMM yyyy', { locale: fr }) },
    { accessorKey: 'last_verified_at', header: 'Vérification', cell: ({ row }) => <VerifiedIndicator date={row.original.last_verified_at} /> },
    {
      id: 'actions', header: '',
      cell: ({ row }) => canWrite ? (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild><Link to={`/announcements/${row.original.id}`}><Pencil className="h-3.5 w-3.5" /></Link></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-error hover:bg-error/10" onClick={() => setDeleteTarget(row.original)}><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Annonces"
        description={`${announcements.length} annonces`}
        action={canWrite ? <Button asChild size="sm"><Link to="/announcements/new"><Plus className="h-4 w-4" />Nouvelle annonce</Link></Button> : undefined}
      />
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="published">Publiées</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
            <SelectItem value="archived">Archivées</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Priorité" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">Haute</SelectItem>
            <SelectItem value="normal">Normale</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterLang} onValueChange={setFilterLang}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Langue" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="ar">Arabe</SelectItem>
            <SelectItem value="all">Toutes langues</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bento-card">
        {announcementsQuery.isLoading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : announcementsQuery.error ? (
          <ErrorState onRetry={() => { void announcementsQuery.refetch() }} />
        ) : (
          <DataTable columns={columns} data={filtered} pageSize={10} />
        )}
      </div>
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Supprimer l'annonce ?"
        description={`« ${deleteTarget?.title} » sera supprimée.`}
        confirmLabel="Supprimer" destructive
        onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget) }}
      />
    </div>
  )
}
