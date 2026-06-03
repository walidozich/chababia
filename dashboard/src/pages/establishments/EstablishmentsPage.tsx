import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { MOCK_ESTABLISHMENTS } from '@/mocks'
import type { Establishment } from '@/types/collections'
import { can } from '@/lib/permissions'
import { DEV_ROLE, DEV_IS_ADMIN } from '@/lib/devRole'

const TYPE_LABELS: Record<string, string> = {
  youth_house: 'Maison de jeunes',
  youth_hostel: 'Auberge de jeunesse',
  sports_complex: 'Complexe sportif',
  youth_camp: 'Camp de jeunes',
  polyvalent_hall: 'Salle polyvalente',
  scientific_leisure_center: 'Centre loisirs scientifiques',
}

export default function EstablishmentsPage() {
  const canWrite = can('write', 'establishments', DEV_ROLE, DEV_IS_ADMIN)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Establishment | null>(null)

  const filtered = useMemo(() =>
    MOCK_ESTABLISHMENTS.filter((e) => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.commune.toLowerCase().includes(search.toLowerCase())) return false
      if (filterStatus !== 'all' && e.status !== filterStatus) return false
      if (filterType !== 'all' && e.type !== filterType) return false
      return true
    }),
    [search, filterStatus, filterType],
  )

  const columns: ColumnDef<Establishment>[] = [
    {
      accessorKey: 'name',
      header: 'Nom',
      cell: ({ row }) => (
        <div className="max-w-[260px]">
          <p className="truncate font-semibold text-on-surface">{row.original.name}</p>
          <p className="text-xs text-on-surface-variant">{TYPE_LABELS[row.original.type] ?? row.original.type}</p>
        </div>
      ),
    },
    { accessorKey: 'status', header: 'Statut', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { id: 'location', header: 'Lieu', cell: ({ row }) => <span className="text-on-surface-variant">{row.original.commune}, {row.original.wilaya}</span> },
    { accessorKey: 'phone', header: 'Téléphone', cell: ({ row }) => <span className="text-on-surface-variant">{row.original.phone || '—'}</span> },
    {
      id: 'actions', header: '',
      cell: ({ row }) => canWrite ? (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link to={`/establishments/${row.original.id}`}><Pencil className="h-3.5 w-3.5" /></Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-error hover:bg-error/10" onClick={() => setDeleteTarget(row.original)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Établissements"
        description={`${MOCK_ESTABLISHMENTS.length} établissements`}
        action={canWrite ? <Button asChild size="sm"><Link to="/establishments/new"><Plus className="h-4 w-4" />Nouvel établissement</Link></Button> : undefined}
      />
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="published">Publiés</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
            <SelectItem value="archived">Archivés</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {Object.entries(TYPE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="bento-card">
        {filtered.length === 0
          ? <EmptyState title="Aucun établissement trouvé" description="Modifiez les filtres ou créez un nouvel établissement." />
          : <DataTable columns={columns} data={filtered} />
        }
      </div>
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Supprimer l'établissement ?"
        description={`« ${deleteTarget?.name} » sera supprimé définitivement.`}
        confirmLabel="Supprimer"
        destructive
        onConfirm={() => { toast.success('Établissement supprimé (mock)'); setDeleteTarget(null) }}
      />
    </div>
  )
}
