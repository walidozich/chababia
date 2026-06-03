import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus, Pencil, Trash2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { MOCK_DOCUMENTS } from '@/mocks'
import type { Document } from '@/types/collections'
import { can } from '@/lib/permissions'
import { DEV_ROLE, DEV_IS_ADMIN } from '@/lib/devRole'

const CATEGORY_LABELS: Record<string, string> = {
  orientation: 'Orientation',
  health: 'Santé',
  legal: 'Juridique',
  training: 'Formation',
  volunteering: 'Bénévolat',
  science: 'Sciences',
  arts: 'Arts',
  general: 'Général',
}

export default function DocumentsPage() {
  const canWrite = can('write', 'documents', DEV_ROLE, DEV_IS_ADMIN)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterLang, setFilterLang] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null)

  const filtered = useMemo(() => MOCK_DOCUMENTS.filter((d) => {
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatus !== 'all' && d.status !== filterStatus) return false
    if (filterCategory !== 'all' && d.category !== filterCategory) return false
    if (filterLang !== 'all' && d.language !== filterLang) return false
    return true
  }).sort((a, b) => b.created.localeCompare(a.created)), [search, filterStatus, filterCategory, filterLang])

  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: 'title',
      header: 'Document',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container">
            <FileText className="h-4 w-4 text-on-surface-variant" />
          </div>
          <div className="max-w-[260px]">
            <p className="truncate font-semibold text-on-surface">{row.original.title}</p>
            <p className="text-xs text-on-surface-variant">{CATEGORY_LABELS[row.original.category] ?? row.original.category}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: 'status', header: 'Statut', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'language', header: 'Langue', cell: ({ row }) => <span className="rounded-full border border-outline px-2 py-0.5 text-xs font-semibold text-on-surface-variant">{row.original.language.toUpperCase()}</span> },
    { accessorKey: 'created', header: 'Ajouté le', cell: ({ row }) => format(new Date(row.original.created), 'd MMM yyyy', { locale: fr }) },
    {
      id: 'actions', header: '',
      cell: ({ row }) => canWrite ? (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild><Link to={`/documents/${row.original.id}`}><Pencil className="h-3.5 w-3.5" /></Link></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-error hover:bg-error/10" onClick={() => setDeleteTarget(row.original)}><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" description={`${MOCK_DOCUMENTS.length} documents`} action={canWrite ? <Button asChild size="sm"><Link to="/documents/new"><Plus className="h-4 w-4" />Nouveau document</Link></Button> : undefined} />
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
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterLang} onValueChange={setFilterLang}>
          <SelectTrigger className="w-28"><SelectValue placeholder="Langue" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="ar">Arabe</SelectItem>
            <SelectItem value="tzm">Tamazight</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bento-card"><DataTable columns={columns} data={filtered} pageSize={10} /></div>
      <ConfirmDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }} title="Supprimer le document ?" description={`« ${deleteTarget?.title} » sera supprimé.`} confirmLabel="Supprimer" destructive onConfirm={() => { toast.success('Document supprimé (mock)'); setDeleteTarget(null) }} />
    </div>
  )
}
