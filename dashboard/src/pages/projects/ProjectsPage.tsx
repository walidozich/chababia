import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Eye } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { TableSkeleton } from '@/components/shared/LoadingSkeletons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ProjectSubmission } from '@/types/collections'
import { COLLECTIONS, getFullList, qk } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const projectsQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.projectSubmissions),
    queryFn: () => getFullList<ProjectSubmission>(COLLECTIONS.projectSubmissions, {
      sort: '-created',
      expand: 'user,establishment',
    }),
    staleTime: STALE.projectSubmissions,
  })

  const submissions = projectsQuery.data ?? []

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return submissions.filter((submission) => {
      if (
        query &&
        !submission.project_title.toLowerCase().includes(query) &&
        !submission.commune.toLowerCase().includes(query)
      ) return false
      if (filterStatus !== 'all' && submission.status !== filterStatus) return false
      return true
    })
  }, [submissions, search, filterStatus])

  const columns: ColumnDef<ProjectSubmission>[] = [
    {
      accessorKey: 'project_title',
      header: 'Projet',
      cell: ({ row }) => (
        <div className="max-w-[280px]">
          <p className="line-clamp-1 font-semibold text-on-surface">{row.original.project_title}</p>
          <p className="line-clamp-1 text-xs text-on-surface-variant">{row.original.short_description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Catégorie',
      cell: ({ row }) => <StatusBadge status={row.original.category} />,
    },
    {
      id: 'location',
      header: 'Commune',
      cell: ({ row }) => <span className="text-on-surface-variant">{row.original.commune}</span>,
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
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/projects/${row.original.id}`}>
              <Eye className="h-3.5 w-3.5" />
              Voir
            </Link>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projets jeunes"
        description={`${String(submissions.length)} soumissions au total`}
      />

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Rechercher projet ou commune..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
          }}
          className="w-64"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="submitted">Soumis</SelectItem>
            <SelectItem value="reviewed">Examinés</SelectItem>
            <SelectItem value="accepted">Acceptés</SelectItem>
            <SelectItem value="rejected">Rejetés</SelectItem>
            <SelectItem value="needs_more_info">Infos manquantes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bento-card">
        {projectsQuery.isLoading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : projectsQuery.error ? (
          <ErrorState onRetry={() => { void projectsQuery.refetch() }} />
        ) : filtered.length === 0 ? (
          <EmptyState title="Aucun projet trouvé" description="Modifiez les filtres de recherche." />
        ) : (
          <DataTable columns={columns} data={filtered} pageSize={10} />
        )}
      </div>
    </div>
  )
}
