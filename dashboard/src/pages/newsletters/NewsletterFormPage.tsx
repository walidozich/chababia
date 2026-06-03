import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { PageSkeleton } from '@/components/shared/LoadingSkeletons'
import { can } from '@/lib/permissions'
import { useAuthStore } from '@/stores/authStore'
import { COLLECTIONS, createRecord, getFullList, getOne, payloadWithFiles, qk, recordFileUrl, scrubServerFields, updateRecord } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'
import type { Activity, Establishment, Newsletter } from '@/types/collections'

const schema = z.object({
  title: z.string().min(3, 'Titre requis'),
  content: z.string().min(10, 'Contenu requis'),
  language: z.enum(['ar', 'fr', 'tzm', 'all', 'mixed']).default('fr'),
  target_commune: z.string().default(''),
  target_wilaya: z.string().default(''),
  related_activity: z.string().default(''),
  related_establishment: z.string().default(''),
  thumbnail: z.string().default(''),
  published_at: z.string().default(''),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})
type FormValues = z.infer<typeof schema>

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="bento-card space-y-4"><h2 className="text-label-lg font-bold">{title}</h2><Separator />{children}</div>
}
function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
}

export default function NewsletterFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const { role, isAdmin } = useAuthStore()
  const canWrite = can('write', 'newsletters', role, isAdmin)
  const queryClient = useQueryClient()

  const newsletterQuery = useQuery({
    queryKey: qk.detail(COLLECTIONS.newsletters, id),
    queryFn: () => getOne<Newsletter>(COLLECTIONS.newsletters, id ?? ''),
    enabled: isEdit && Boolean(id),
    staleTime: STALE.newsletters,
  })

  const establishmentsQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.establishments, 'lookup'),
    queryFn: () => getFullList<Establishment>(COLLECTIONS.establishments, {
      fields: 'id,name,status',
      sort: 'name',
    }),
    staleTime: STALE.establishments,
  })

  const activitiesQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.activities, 'lookup'),
    queryFn: () => getFullList<Activity>(COLLECTIONS.activities, {
      fields: 'id,title,status,start_datetime',
      sort: '-start_datetime',
    }),
    staleTime: STALE.activities,
  })

  const existing = newsletterQuery.data
  const establishments = establishmentsQuery.data ?? []
  const activities = activitiesQuery.data ?? []

  const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', content: '', language: 'fr', target_commune: '', target_wilaya: '', related_activity: '', related_establishment: '', thumbnail: '', published_at: '', status: 'draft' },
  })

  useEffect(() => {
    if (existing) reset({ ...existing, published_at: existing.published_at?.slice(0, 16) ?? '' })
  }, [existing, reset])

  const saveMutation = useMutation({
    mutationFn: (data: FormValues) => {
      const payload = payloadWithFiles(scrubServerFields(data), ['thumbnail'])
      return isEdit && id
        ? updateRecord<Newsletter>(COLLECTIONS.newsletters, id, payload)
        : createRecord<Newsletter>(COLLECTIONS.newsletters, payload)
    },
    onSuccess: (newsletter) => {
      toast.success(isEdit ? 'Newsletter mise à jour' : 'Newsletter créée', { description: newsletter.title })
      void queryClient.invalidateQueries({ queryKey: qk.collection(COLLECTIONS.newsletters) })
      navigate('/newsletters')
    },
  })

  function onSubmit(data: FormValues) {
    saveMutation.mutate(data)
  }

  if (isEdit && newsletterQuery.isLoading) {
    return <PageSkeleton />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        title={isEdit ? 'Modifier la newsletter' : 'Nouvelle newsletter'}
        description={existing?.title}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild><Link to="/newsletters"><ArrowLeft className="h-4 w-4" />Retour</Link></Button>
            {canWrite && <Button type="submit" size="sm" disabled={saveMutation.isPending || (!isDirty && isEdit)}><Save className="h-4 w-4" />{isEdit ? 'Enregistrer' : 'Créer'}</Button>}
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <SectionCard title="Contenu">
            <FormField label="Titre" required error={errors.title?.message}><Input {...register('title')} placeholder="Titre de la newsletter" /></FormField>
            <FormField label="Contenu" required error={errors.content?.message}><Textarea {...register('content')} rows={10} placeholder="Corps de la newsletter…" /></FormField>
          </SectionCard>
          <SectionCard title="Ciblage">
            <TwoCol>
              <FormField label="Commune cible" hint="Laisser vide = nationale"><Input {...register('target_commune')} placeholder="Ex: Béjaïa" /></FormField>
              <FormField label="Wilaya cible" hint="Laisser vide = nationale"><Input {...register('target_wilaya')} placeholder="Ex: Béjaïa" /></FormField>
            </TwoCol>
            <TwoCol>
              <FormField label="Activité liée">
                <Controller control={control} name="related_activity" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Aucune" /></SelectTrigger>
                    <SelectContent><SelectItem value="">Aucune</SelectItem>{activities.map((a) => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}</SelectContent>
                  </Select>
                )} />
              </FormField>
              <FormField label="Établissement lié">
                <Controller control={control} name="related_establishment" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                    <SelectContent><SelectItem value="">Aucun</SelectItem>{establishments.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                  </Select>
                )} />
              </FormField>
            </TwoCol>
          </SectionCard>
          <SectionCard title="Image de couverture">
            <Controller control={control} name="thumbnail" render={({ field }) => (
              <FileUpload accept="image" value={existing ? recordFileUrl(existing, field.value) : field.value} onChange={field.onChange} onClear={() => field.onChange('')} disabled={!canWrite} />
            )} />
          </SectionCard>
        </div>
        <div>
          <SectionCard title="Publication">
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
            <FormField label="Date de publication"><Input {...register('published_at')} type="datetime-local" /></FormField>
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
            {canWrite && <Button type="submit" className="w-full" disabled={saveMutation.isPending || (!isDirty && isEdit)}><Save className="h-4 w-4" />{isEdit ? 'Enregistrer' : 'Créer'}</Button>}
          </SectionCard>
        </div>
      </div>
    </form>
  )
}
