import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { CheckCircle, KeyRound, Pencil, Plus, XCircle } from 'lucide-react'
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
import type { User } from '@/types/collections'
import { useAuthStore } from '@/stores/authStore'
import { pb } from '@/lib/pb'
import { COLLECTIONS, getFullList, qk } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'

const ROLE_LABELS: Record<string, string> = {
  youth: 'Jeune',
  super_admin: 'Super Admin',
  wilaya_admin: 'Admin Wilaya',
  establishment_manager: 'Gestion Étab.',
  content_editor: 'Éditeur',
  attendance_staff: 'Pointage',
}

function AccessDenied() {
  return (
    <div className="bento-card py-16 text-center">
      <p className="text-label-lg font-bold text-error">Accès réservé aux superadmins.</p>
    </div>
  )
}

export default function UsersPage() {
  const isSuperuser = useAuthStore((state) => state.isAdmin)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterWilaya, setFilterWilaya] = useState('all')
  const usersQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.users),
    queryFn: () => getFullList<User>(COLLECTIONS.users, { sort: '-created' }),
    enabled: isSuperuser,
    staleTime: STALE.users,
  })

  const users = usersQuery.data ?? []

  const resetMutation = useMutation({
    mutationFn: (user: User) => pb.collection(COLLECTIONS.users).requestPasswordReset(user.email),
    onSuccess: (_result, user) => {
      toast.success('Email de réinitialisation envoyé', { description: user.email })
    },
  })

  const wilayas = useMemo(
    () => [...new Set(users.map((user) => user.wilaya).filter((wilaya) => wilaya.length > 0))].sort(),
    [users],
  )

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return users.filter((user) => {
      if (
        query &&
        !user.full_name.toLowerCase().includes(query) &&
        !user.email.toLowerCase().includes(query)
      ) return false
      if (filterRole !== 'all' && user.role !== filterRole) return false
      if (filterWilaya !== 'all' && user.wilaya !== filterWilaya) return false
      return true
    })
  }, [users, search, filterRole, filterWilaya])

  if (!isSuperuser) return <AccessDenied />

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'full_name',
      header: 'Utilisateur',
      cell: ({ row }) => (
        <div className="max-w-[240px]">
          <p className="truncate font-semibold text-on-surface">{row.original.full_name}</p>
          <p className="truncate text-xs text-on-surface-variant">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Rôle',
      cell: ({ row }) => <StatusBadge status={ROLE_LABELS[row.original.role] ?? row.original.role} />,
    },
    {
      id: 'location',
      header: 'Localisation',
      cell: ({ row }) => (
        <span className="text-on-surface-variant">
          {row.original.commune || '—'}{row.original.wilaya ? `, ${row.original.wilaya}` : ''}
        </span>
      ),
    },
    {
      accessorKey: 'verified',
      header: 'Vérifié',
      cell: ({ row }) =>
        row.original.verified ? (
          <CheckCircle className="h-4 w-4 text-primary" />
        ) : (
          <XCircle className="h-4 w-4 text-on-surface-variant/50" />
        ),
    },
    {
      accessorKey: 'preferred_language',
      header: 'Langue',
      cell: ({ row }) => <span className="uppercase text-on-surface-variant">{row.original.preferred_language}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Réinitialiser mot de passe"
            disabled={resetMutation.isPending}
            onClick={() => resetMutation.mutate(row.original)}
          >
            <KeyRound className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link to={`/users/${row.original.id}`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        description={`${String(users.length)} comptes enregistrés`}
        action={
          <Button asChild size="sm">
            <Link to="/users/new">
              <Plus className="h-4 w-4" />
              Nouvel utilisateur
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Rechercher nom ou email..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
          }}
          className="w-60"
        />
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterWilaya} onValueChange={setFilterWilaya}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Wilaya" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les wilayas</SelectItem>
            {wilayas.map((wilaya) => (
              <SelectItem key={wilaya} value={wilaya}>{wilaya}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bento-card">
        {usersQuery.isLoading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : usersQuery.error ? (
          <ErrorState onRetry={() => { void usersQuery.refetch() }} />
        ) : filtered.length === 0 ? (
          <EmptyState title="Aucun utilisateur trouvé" description="Modifiez les filtres de recherche." />
        ) : (
          <DataTable columns={columns} data={filtered} pageSize={10} />
        )}
      </div>
    </div>
  )
}
