import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Archive, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { ImageThumb } from '@/components/shared/ImageThumb'
import { ErrorState } from '@/components/shared/ErrorState'
import { TableSkeleton } from '@/components/shared/LoadingSkeletons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { TalentShowcase, TalentStatus } from '@/types/collections'
import { can } from '@/lib/permissions'
import { useAuthStore } from '@/stores/authStore'
import { COLLECTIONS, getFullList, qk, updateRecord } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'

export default function TalentPage() {
  const { role, isAdmin } = useAuthStore()
  const canWrite = can('write', 'talent_showcase', role, isAdmin)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('draft')
  const queryClient = useQueryClient()

  const talentQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.talentShowcase),
    queryFn: () => getFullList<TalentShowcase>(COLLECTIONS.talentShowcase, {
      sort: '-created',
      expand: 'user',
    }),
    staleTime: STALE.talentShowcase,
  })

  const talents = talentQuery.data ?? []

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return talents.filter((talent) => {
      if (query && !talent.title.toLowerCase().includes(query)) return false
      if (filterStatus !== 'all' && talent.status !== filterStatus) return false
      return true
    })
  }, [talents, search, filterStatus])

  const statusMutation = useMutation({
    mutationFn: ({ talent, status }: { talent: TalentShowcase; status: TalentStatus }) => updateRecord<TalentShowcase>(
      COLLECTIONS.talentShowcase,
      talent.id,
      { status },
    ),
    onSuccess: (talent) => {
      toast.success('Vitrine mise à jour', { description: talent.title })
      void queryClient.invalidateQueries({ queryKey: qk.collection(COLLECTIONS.talentShowcase) })
    },
  })

  const columns: ColumnDef<TalentShowcase>[] = [
    {
      accessorKey: 'title',
      header: 'Talent',
      cell: ({ row }) => (
        <div className="max-w-[260px]">
          <p className="line-clamp-1 font-semibold text-on-surface">{row.original.title}</p>
          <p className="line-clamp-1 text-xs text-on-surface-variant">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Catégorie',
      cell: ({ row }) => <span className="text-on-surface-variant">{row.original.category}</span>,
    },
    {
      accessorKey: 'user',
      header: 'Jeune',
      cell: ({ row }) => <span className="text-on-surface-variant">{row.original.expand?.user?.full_name ?? 'Inconnu'}</span>,
    },
    {
      accessorKey: 'media',
      header: 'Média',
      cell: ({ row }) => <ImageThumb src={row.original.media} alt={row.original.title} size="sm" record={row.original} />,
    },
    {
      accessorKey: 'external_link',
      header: 'Lien',
      cell: ({ row }) =>
        row.original.external_link ? (
          <a
            href={row.original.external_link}
            target="_blank"
            rel="noreferrer"
            className="line-clamp-1 max-w-[180px] text-primary hover:underline"
          >
            {row.original.external_link}
          </a>
        ) : (
          <span className="text-on-surface-variant/60">—</span>
        ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex flex-wrap justify-end gap-1">
          {canWrite && row.original.status === 'draft' && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={statusMutation.isPending}
                onClick={() => statusMutation.mutate({ talent: row.original, status: 'published' })}
              >
                <Check className="h-3 w-3" />
                Publier
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={statusMutation.isPending}
                onClick={() => statusMutation.mutate({ talent: row.original, status: 'rejected' })}
              >
                <X className="h-3 w-3" />
                Rejeter
              </Button>
            </>
          )}
          {canWrite && row.original.status === 'published' && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => toast.error('Archivage non disponible', { description: 'Le schéma talent ne définit pas de statut archivé.' })}
            >
              <Archive className="h-3 w-3" />
              Archiver
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vitrine talents"
        description={`${String(talents.length)} propositions de talents`}
      />

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Rechercher un titre..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
          }}
          className="w-56"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
            <SelectItem value="published">Publiés</SelectItem>
            <SelectItem value="rejected">Rejetés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bento-card">
        {talentQuery.isLoading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : talentQuery.error ? (
          <ErrorState onRetry={() => { void talentQuery.refetch() }} />
        ) : filtered.length === 0 ? (
          <EmptyState title="Aucun talent trouvé" description="Modifiez les filtres de modération." />
        ) : (
          <DataTable columns={columns} data={filtered} pageSize={10} />
        )}
      </div>
    </div>
  )
}
