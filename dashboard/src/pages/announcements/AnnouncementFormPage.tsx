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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { PageSkeleton } from '@/components/shared/LoadingSkeletons'
import { can } from '@/lib/permissions'
import { useAuthStore } from '@/stores/authStore'
import { COLLECTIONS, createRecord, getFullList, getOne, qk, updateRecord } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'
import type { Activity, Announcement, Establishment } from '@/types/collections'

const schema = z.object({
  title: z.string().min(3, 'Minimum 3 caractères'),
  content: z.string().min(10, 'Contenu requis'),
  priority: z.enum(['normal', 'high', 'urgent']).default('normal'),
  language: z.enum(['ar', 'fr', 'tzm', 'all', 'mixed']).default('fr'),
  related_establishment: z.string().default(''),
  related_activity: z.string().default(''),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})
type FormValues = z.infer<typeof schema>

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="bento-card space-y-4"><h2 className="text-label-lg font-bold">{title}</h2><Separator />{children}</div>
}
function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
}

export default function AnnouncementFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const { role, isAdmin } = useAuthStore()
  const canWrite = can('write', 'announcements', role, isAdmin)
  const queryClient = useQueryClient()

  const announcementQuery = useQuery({
    queryKey: qk.detail(COLLECTIONS.announcements, id),
    queryFn: () => getOne<Announcement>(COLLECTIONS.announcements, id ?? ''),
    enabled: isEdit && Boolean(id),
    staleTime: STALE.announcements,
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

  const existing = announcementQuery.data
  const establishments = establishmentsQuery.data ?? []
  const activities = activitiesQuery.data ?? []

  const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', content: '', priority: 'normal', language: 'fr', related_establishment: '', related_activity: '', status: 'draft' },
  })

  useEffect(() => {
    if (existing) reset({ title: existing.title, content: existing.content, priority: existing.priority, language: existing.language, related_establishment: existing.related_establishment, related_activity: existing.related_activity, status: existing.status })
  }, [existing, reset])

  const saveMutation = useMutation({
    mutationFn: (data: FormValues) => isEdit && id
      ? updateRecord<Announcement>(COLLECTIONS.announcements, id, data)
      : createRecord<Announcement>(COLLECTIONS.announcements, data),
    onSuccess: (announcement) => {
      toast.success(isEdit ? 'Annonce mise à jour' : 'Annonce créée', { description: announcement.title })
      void queryClient.invalidateQueries({ queryKey: qk.collection(COLLECTIONS.announcements) })
      navigate('/announcements')
    },
  })

  function onSubmit(data: FormValues) {
    saveMutation.mutate(data)
  }

  if (isEdit && announcementQuery.isLoading) {
    return <PageSkeleton />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        title={isEdit ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
        description={existing?.title}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild><Link to="/announcements"><ArrowLeft className="h-4 w-4" />Retour</Link></Button>
            {canWrite && <Button type="submit" size="sm" disabled={saveMutation.isPending || (!isDirty && isEdit)}><Save className="h-4 w-4" />{isEdit ? 'Enregistrer' : 'Créer'}</Button>}
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <SectionCard title="Contenu">
            <FormField label="Titre" required error={errors.title?.message}><Input {...register('title')} placeholder="Titre de l'annonce" /></FormField>
            <FormField label="Contenu" required error={errors.content?.message}><Textarea {...register('content')} rows={8} placeholder="Corps de l'annonce…" /></FormField>
          </SectionCard>
          <SectionCard title="Paramètres">
            <TwoCol>
              <FormField label="Priorité" required>
                <Controller control={control} name="priority" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normale</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
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
            </TwoCol>
            <TwoCol>
              <FormField label="Établissement lié">
                <Controller control={control} name="related_establishment" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      {establishments.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </FormField>
              <FormField label="Activité liée">
                <Controller control={control} name="related_activity" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Aucune" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucune</SelectItem>
                      {activities.map((a) => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </FormField>
            </TwoCol>
          </SectionCard>
        </div>
        <div>
          <SectionCard title="Publication">
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
