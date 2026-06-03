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
import type { Newsletter } from '@/types/collections'
import { can } from '@/lib/permissions'
import { useAuthStore } from '@/stores/authStore'
import { COLLECTIONS, deleteRecord, getFullList, qk } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'

export default function NewslettersPage() {
  const { role, isAdmin } = useAuthStore()
  const canWrite = can('write', 'newsletters', role, isAdmin)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterLang, setFilterLang] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Newsletter | null>(null)
  const queryClient = useQueryClient()

  const newslettersQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.newsletters),
    queryFn: () => getFullList<Newsletter>(COLLECTIONS.newsletters, { sort: '-created' }),
    staleTime: STALE.newsletters,
  })

  const newsletters = newslettersQuery.data ?? []

  const filtered = useMemo(() => newsletters.filter((n) => {
    if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatus !== 'all' && n.status !== filterStatus) return false
    if (filterLang !== 'all' && n.language !== filterLang) return false
    return true
  }), [newsletters, search, filterStatus, filterLang])

  const deleteMutation = useMutation({
    mutationFn: (newsletter: Newsletter) => deleteRecord(COLLECTIONS.newsletters, newsletter.id),
    onSuccess: () => {
      toast.success('Newsletter supprimée')
      setDeleteTarget(null)
      void queryClient.invalidateQueries({ queryKey: qk.collection(COLLECTIONS.newsletters) })
    },
  })

  const columns: ColumnDef<Newsletter>[] = [
    {
      accessorKey: 'title',
      header: 'Titre',
      cell: ({ row }) => (
        <div className="max-w-[280px]">
          <p className="truncate font-semibold text-on-surface">{row.original.title}</p>
          {row.original.target_wilaya && <p className="text-xs text-on-surface-variant">Wilaya: {row.original.target_wilaya}</p>}
        </div>
      ),
    },
    { accessorKey: 'status', header: 'Statut', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'language', header: 'Langue', cell: ({ row }) => <span className="rounded-full border border-outline px-2 py-0.5 text-xs font-semibold text-on-surface-variant">{row.original.language.toUpperCase()}</span> },
    { accessorKey: 'published_at', header: 'Publié le', cell: ({ row }) => row.original.published_at ? format(new Date(row.original.published_at), 'd MMM yyyy', { locale: fr }) : '—' },
    {
      id: 'actions', header: '',
      cell: ({ row }) => canWrite ? (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild><Link to={`/newsletters/${row.original.id}`}><Pencil className="h-3.5 w-3.5" /></Link></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-error hover:bg-error/10" onClick={() => setDeleteTarget(row.original)}><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Newsletters" description={`${newsletters.length} newsletters`} action={canWrite ? <Button asChild size="sm"><Link to="/newsletters/new"><Plus className="h-4 w-4" />Nouvelle newsletter</Link></Button> : undefined} />
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
        <Select value={filterLang} onValueChange={setFilterLang}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Langue" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="ar">Arabe</SelectItem>
            <SelectItem value="tzm">Tamazight</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bento-card">
        {newslettersQuery.isLoading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : newslettersQuery.error ? (
          <ErrorState onRetry={() => { void newslettersQuery.refetch() }} />
        ) : (
          <DataTable columns={columns} data={filtered} pageSize={10} />
        )}
      </div>
      <ConfirmDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }} title="Supprimer la newsletter ?" description={`« ${deleteTarget?.title} » sera supprimée.`} confirmLabel="Supprimer" destructive onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget) }} />
    </div>
  )
}
