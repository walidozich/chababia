import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { type ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Plus, Pencil, Save } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { FormField } from '@/components/shared/FormField'
import { ErrorState } from '@/components/shared/ErrorState'
import { TableSkeleton } from '@/components/shared/LoadingSkeletons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import type { Category } from '@/types/collections'
import { can } from '@/lib/permissions'
import { useAuthStore } from '@/stores/authStore'
import { COLLECTIONS, createRecord, getFullList, qk, updateRecord } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'

const schema = z.object({
  name: z.string().min(2, 'Nom requis'),
  icon: z.string().min(1, 'Icône requise'),
  status: z.enum(['active', 'inactive']).default('active'),
})
type FormValues = z.infer<typeof schema>

export default function CategoriesPage() {
  const { role, isAdmin } = useAuthStore()
  const canWrite = can('write', 'categories', role, isAdmin)
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const queryClient = useQueryClient()

  const categoriesQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.categories),
    queryFn: () => getFullList<Category>(COLLECTIONS.categories, {
      fields: 'id,name,icon,status',
      sort: 'name',
    }),
    staleTime: STALE.categories,
  })

  const categories = categoriesQuery.data ?? []

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', icon: '', status: 'active' },
  })

  function openCreate() {
    reset({ name: '', icon: '', status: 'active' })
    setIsCreating(true)
    setEditTarget(null)
  }

  function openEdit(cat: Category) {
    reset({ name: cat.name, icon: cat.icon, status: cat.status })
    setEditTarget(cat)
    setIsCreating(false)
  }

  const saveMutation = useMutation({
    mutationFn: (data: FormValues) => editTarget
      ? updateRecord<Category>(COLLECTIONS.categories, editTarget.id, data)
      : createRecord<Category>(COLLECTIONS.categories, data),
    onSuccess: (category) => {
      toast.success(editTarget ? `Catégorie « ${category.name} » mise à jour` : `Catégorie « ${category.name} » créée`)
      setEditTarget(null)
      setIsCreating(false)
      void queryClient.invalidateQueries({ queryKey: qk.collection(COLLECTIONS.categories) })
    },
  })

  function onSubmit(data: FormValues) {
    saveMutation.mutate(data)
  }

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Nom',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-xs font-bold text-primary-on-container">
            {row.original.icon.slice(0, 2).toUpperCase()}
          </span>
          <span className="font-semibold text-on-surface">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: 'icon', header: 'Icône', cell: ({ row }) => <span className="font-mono text-xs text-on-surface-variant">{row.original.icon}</span> },
    { accessorKey: 'status', header: 'Statut', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    {
      id: 'actions', header: '',
      cell: ({ row }) => canWrite ? (
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { openEdit(row.original) }}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catégories"
        description={`${String(categories.length)} catégories`}
        action={canWrite ? <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" />Nouvelle catégorie</Button> : undefined}
      />
      <div className="bento-card">
        {categoriesQuery.isLoading ? (
          <TableSkeleton rows={8} cols={4} />
        ) : categoriesQuery.error ? (
          <ErrorState onRetry={() => { void categoriesQuery.refetch() }} />
        ) : (
          <DataTable columns={columns} data={categories} pageSize={10} />
        )}
      </div>

      <Dialog open={isCreating || editTarget !== null} onOpenChange={(open) => { if (!open) { setIsCreating(false); setEditTarget(null) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="space-y-4">
            <FormField label="Nom" required error={errors.name?.message}>
              <Input {...register('name')} placeholder="Ex: Sports" />
            </FormField>
            <FormField label="Icône (nom Lucide)" required error={errors.icon?.message} hint="Ex: trophy, palette, book">
              <Input {...register('icon')} placeholder="trophy" />
            </FormField>
            <FormField label="Statut">
              <Controller control={control} name="status" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </FormField>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsCreating(false); setEditTarget(null) }}>Annuler</Button>
              <Button type="submit" disabled={saveMutation.isPending}><Save className="h-4 w-4" />{editTarget ? 'Enregistrer' : 'Créer'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
