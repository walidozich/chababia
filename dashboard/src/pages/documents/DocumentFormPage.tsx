import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, Save } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { FormField } from '@/components/shared/FormField'
import { FileUpload } from '@/components/shared/FileUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { MOCK_DOCUMENTS, MOCK_ESTABLISHMENTS } from '@/mocks'
import { can } from '@/lib/permissions'
import { useAuthStore } from '@/stores/authStore'

const schema = z.object({
  title: z.string().min(3, 'Titre requis'),
  description: z.string().default(''),
  file: z.string().default(''),
  language: z.enum(['ar', 'fr', 'tzm', 'all', 'mixed']).default('fr'),
  category: z.enum(['orientation', 'health', 'legal', 'training', 'volunteering', 'science', 'arts', 'general']).default('general'),
  establishment: z.string().default(''),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})
type FormValues = z.infer<typeof schema>

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="bento-card space-y-4"><h2 className="text-label-lg font-bold">{title}</h2><Separator />{children}</div>
}

export default function DocumentFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const { role, isAdmin } = useAuthStore()
  const canWrite = can('write', 'documents', role, isAdmin)
  const existing = isEdit ? MOCK_DOCUMENTS.find((d) => d.id === id) : undefined

  const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', file: '', language: 'fr', category: 'general', establishment: '', status: 'draft' },
  })

  useEffect(() => {
    if (existing) reset({ title: existing.title, description: existing.description, file: existing.file, language: existing.language, category: existing.category, establishment: existing.establishment, status: existing.status })
  }, [existing, reset])

  function onSubmit(data: FormValues) {
    toast.success(isEdit ? 'Document mis à jour (mock)' : 'Document créé (mock)', { description: data.title })
    navigate('/documents')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        title={isEdit ? 'Modifier le document' : 'Nouveau document'}
        description={existing?.title}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild><Link to="/documents"><ArrowLeft className="h-4 w-4" />Retour</Link></Button>
            {canWrite && <Button type="submit" size="sm" disabled={!isDirty && isEdit}><Save className="h-4 w-4" />{isEdit ? 'Enregistrer' : 'Créer'}</Button>}
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <SectionCard title="Informations">
            <FormField label="Titre" required error={errors.title?.message}><Input {...register('title')} placeholder="Titre du document" /></FormField>
            <FormField label="Description" error={errors.description?.message}><Textarea {...register('description')} rows={4} placeholder="Résumé du contenu du document" /></FormField>
          </SectionCard>
          <SectionCard title="Fichier PDF">
            <Controller control={control} name="file" render={({ field }) => (
              <FileUpload accept="pdf" value={field.value} onChange={field.onChange} onClear={() => field.onChange('')} disabled={!canWrite} />
            )} />
            <p className="text-xs text-on-surface-variant">Max 10 Mo · Format PDF uniquement</p>
          </SectionCard>
        </div>
        <div>
          <SectionCard title="Publication">
            <FormField label="Catégorie" required error={errors.category?.message}>
              <Controller control={control} name="category" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orientation">Orientation</SelectItem>
                    <SelectItem value="health">Santé</SelectItem>
                    <SelectItem value="legal">Juridique</SelectItem>
                    <SelectItem value="training">Formation</SelectItem>
                    <SelectItem value="volunteering">Bénévolat</SelectItem>
                    <SelectItem value="science">Sciences</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="general">Général</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </FormField>
            <FormField label="Langue">
              <Controller control={control} name="language" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">Arabe</SelectItem>
                    <SelectItem value="tzm">Tamazight</SelectItem>
                    <SelectItem value="all">Toutes langues</SelectItem>
                    <SelectItem value="mixed">Multilingue</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </FormField>
            <FormField label="Établissement">
              <Controller control={control} name="establishment" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                  <SelectContent><SelectItem value="">Aucun</SelectItem>{MOCK_ESTABLISHMENTS.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </FormField>
            <FormField label="Statut">
              <Controller control={control} name="status" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={!canWrite}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </FormField>
            {canWrite && <Button type="submit" className="w-full" disabled={!isDirty && isEdit}><Save className="h-4 w-4" />{isEdit ? 'Enregistrer' : 'Créer'}</Button>}
          </SectionCard>
        </div>
      </div>
    </form>
  )
}
