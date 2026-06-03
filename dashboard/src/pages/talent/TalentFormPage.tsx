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
import { COLLECTIONS, createRecord, getOne, payloadWithFiles, qk, recordFileUrl, scrubServerFields, updateRecord } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'
import type { TalentShowcase } from '@/types/collections'

const INTEREST_CATEGORIES = [
  'Sports', 'Culture', 'Training', 'Volunteering', 'Health Awareness',
  'Science', 'Arts', 'Environment', 'Youth Orientation', 'Camps and Trips',
  'Coding', 'Design', 'Robotics', 'Photography', 'Debate',
] as const

const schema = z.object({
  title: z.string().min(3, 'Minimum 3 caractères'),
  description: z.string().min(10, 'Minimum 10 caractères'),
  category: z.enum([
    'Sports', 'Culture', 'Training', 'Volunteering', 'Health Awareness',
    'Science', 'Arts', 'Environment', 'Youth Orientation', 'Camps and Trips',
    'Coding', 'Design', 'Robotics', 'Photography', 'Debate',
  ]),
  external_link: z.string().url('URL invalide').or(z.literal('')).default(''),
  status: z.enum(['draft', 'published', 'rejected']).default('draft'),
  media: z.string().default(''),
})

type FormValues = z.infer<typeof schema>

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bento-card space-y-4">
      <h2 className="text-label-lg font-bold text-on-surface">{title}</h2>
      <Separator />
      {children}
    </div>
  )
}

export default function TalentFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { role, isAdmin } = useAuthStore()
  const canWrite = can('write', 'talent_showcase', role, isAdmin)
  const isEdit = Boolean(id)

  const { data: existing, isLoading } = useQuery({
    queryKey: qk.detail(COLLECTIONS.talentShowcase, id),
    queryFn: () => getOne<TalentShowcase>(COLLECTIONS.talentShowcase, id ?? ''),
    enabled: isEdit,
    staleTime: STALE.talentShowcase,
  })

  const { register, handleSubmit, control, reset, watch, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Sports',
      external_link: '',
      status: 'draft',
      media: '',
    },
  })

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        description: existing.description,
        category: existing.category,
        external_link: existing.external_link ?? '',
        status: existing.status,
        media: existing.media,
      })
    }
  }, [existing, reset])

  const saveMutation = useMutation({
    mutationFn: (data: FormValues) => {
      const payload = payloadWithFiles(scrubServerFields(data), ['media'])
      return isEdit && id
        ? updateRecord<TalentShowcase>(COLLECTIONS.talentShowcase, id, payload)
        : createRecord<TalentShowcase>(COLLECTIONS.talentShowcase, payload)
    },
    onSuccess: (talent) => {
      toast.success(isEdit ? 'Talent mis à jour' : 'Talent créé', { description: talent.title })
      void queryClient.invalidateQueries({ queryKey: qk.collection(COLLECTIONS.talentShowcase) })
      void navigate('/talent')
    },
  })

  if (isEdit && isLoading) return <PageSkeleton />

  const mediaValue = watch('media')
  const mediaPreviewUrl = isEdit && existing?.media && !mediaValue.startsWith('data:')
    ? recordFileUrl(existing, existing.media)
    : mediaValue

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Modifier le talent' : 'Nouveau talent'}
        description={isEdit ? 'Modifier les informations de cette vitrine talent' : 'Ajouter une nouvelle entrée à la vitrine talents'}
        action={
          <Link to="/talent">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
        }
      />

      <form
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
        onSubmit={(e) => { void handleSubmit((data) => saveMutation.mutate(data))(e) }}
      >
        <div className="col-span-2 space-y-4">
          <SectionCard title="Informations">
            <FormField label="Titre" required error={errors.title?.message}>
              <Input placeholder="Titre du talent..." {...register('title')} disabled={!canWrite} />
            </FormField>
            <FormField label="Description" required error={errors.description?.message}>
              <Textarea
                placeholder="Décrivez ce talent..."
                rows={4}
                {...register('description')}
                disabled={!canWrite}
              />
            </FormField>
            <FormField label="Catégorie" required error={errors.category?.message}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={!canWrite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTEREST_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Lien externe" error={errors.external_link?.message}>
              <Input
                type="url"
                placeholder="https://..."
                {...register('external_link')}
                disabled={!canWrite}
              />
            </FormField>
          </SectionCard>

          <SectionCard title="Média">
            <Controller
              name="media"
              control={control}
              render={({ field }) => (
                <FileUpload
                  accept="image"
                  value={mediaPreviewUrl}
                  onChange={(dataUrl) => { field.onChange(dataUrl) }}
                  onClear={() => { field.onChange('') }}
                  disabled={!canWrite}
                />
              )}
            />
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Statut">
            <FormField label="Statut de publication" required error={errors.status?.message}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={!canWrite}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                      <SelectItem value="rejected">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </SectionCard>

          {canWrite && (
            <Button
              type="submit"
              className="w-full"
              disabled={saveMutation.isPending || (!isDirty && isEdit)}
            >
              <Save className="h-4 w-4" />
              {saveMutation.isPending ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer le talent'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
