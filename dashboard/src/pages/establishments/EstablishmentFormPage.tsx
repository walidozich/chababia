import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, Save } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { FormField } from '@/components/shared/FormField'
import { LanguageTabs } from '@/components/shared/LanguageTabs'
import { FileUpload } from '@/components/shared/FileUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { PageSkeleton } from '@/components/shared/LoadingSkeletons'
import { can } from '@/lib/permissions'
import { useAuthStore } from '@/stores/authStore'
import { COLLECTIONS, createRecord, getFullList, getOne, payloadWithFiles, qk, recordFileUrl, scrubServerFields, updateRecord } from '@/lib/pbData'
import { STALE } from '@/lib/staleTimes'
import type { Establishment, EstablishmentTranslation, TranslationLanguage } from '@/types/collections'

const schema = z.object({
  name: z.string().min(3, 'Minimum 3 caractères'),
  type: z.enum(['youth_house', 'youth_hostel', 'sports_complex', 'youth_camp', 'polyvalent_hall', 'scientific_leisure_center']),
  commune: z.string().min(2, 'Commune requise'),
  wilaya: z.string().min(2, 'Wilaya requise'),
  address: z.string().min(5, 'Adresse requise'),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  phone: z.string().default(''),
  email: z.string().default(''),
  opening_hours: z.string().default(''),
  services: z.string().default(''),
  accessibility_notes: z.string().default(''),
  image: z.string().default(''),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
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
function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
}

export default function EstablishmentFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const { role, isAdmin } = useAuthStore()
  const canWrite = can('write', 'establishments', role, isAdmin)
  const queryClient = useQueryClient()

  const establishmentQuery = useQuery({
    queryKey: qk.detail(COLLECTIONS.establishments, id),
    queryFn: () => getOne<Establishment>(COLLECTIONS.establishments, id ?? ''),
    enabled: isEdit && Boolean(id),
    staleTime: STALE.establishments,
  })

  const translationsQuery = useQuery({
    queryKey: qk.list(COLLECTIONS.establishmentTranslations, id),
    queryFn: () => getFullList<EstablishmentTranslation>(COLLECTIONS.establishmentTranslations, {
      filter: `establishment = "${id ?? ''}"`,
      sort: 'language',
    }),
    enabled: isEdit && Boolean(id),
    staleTime: STALE.translations,
  })

  const existing = establishmentQuery.data
  const savedTranslations = translationsQuery.data ?? []

  const [translations, setTranslations] = useState<Record<string, { description: string; services_text: string; accessibility_text: string }>>({
    fr: { description: '', services_text: '', accessibility_text: '' },
    ar: { description: '', services_text: '', accessibility_text: '' },
    tzm: { description: '', services_text: '', accessibility_text: '' },
  })

  const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', type: 'youth_house', commune: '', wilaya: '', address: '', latitude: 36.7, longitude: 3.05, phone: '', email: '', opening_hours: '', services: '', accessibility_notes: '', image: '', status: 'draft' },
  })

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        type: existing.type,
        commune: existing.commune,
        wilaya: existing.wilaya,
        address: existing.address,
        latitude: existing.latitude,
        longitude: existing.longitude,
        phone: existing.phone,
        email: existing.email,
        opening_hours: existing.opening_hours,
        services: existing.services,
        accessibility_notes: existing.accessibility_notes,
        image: existing.image,
        status: existing.status,
      })
    }
  }, [existing, reset])

  useEffect(() => {
    if (savedTranslations.length > 0) {
      setTranslations((prev) => {
        const next = { ...prev }

        for (const translation of savedTranslations) {
          next[translation.language] = {
            description: translation.description,
            services_text: translation.services_text,
            accessibility_text: translation.accessibility_text,
          }
        }

        return next
      })
    }
  }, [savedTranslations])

  const saveMutation = useMutation({
    mutationFn: (data: FormValues) => {
      const payload = payloadWithFiles(scrubServerFields(data), ['image'])
      return isEdit && id
        ? updateRecord<Establishment>(COLLECTIONS.establishments, id, payload)
        : createRecord<Establishment>(COLLECTIONS.establishments, payload)
    },
    onSuccess: (establishment) => {
      toast.success(isEdit ? 'Établissement mis à jour' : 'Établissement créé', {
        description: establishment.name,
      })
      void queryClient.invalidateQueries({ queryKey: qk.collection(COLLECTIONS.establishments) })
      navigate('/establishments')
    },
  })

  const translationMutation = useMutation({
    mutationFn: (lang: TranslationLanguage) => {
      if (!id) {
        throw new Error('Créez d’abord l’établissement avant d’ajouter des traductions.')
      }

      const values = translations[lang]
      const existingTranslation = savedTranslations.find((translation) => translation.language === lang)
      const payload = {
        establishment: id,
        language: lang,
        description: values?.description ?? '',
        services_text: values?.services_text ?? '',
        accessibility_text: values?.accessibility_text ?? '',
      }

      return existingTranslation
        ? updateRecord<EstablishmentTranslation>(COLLECTIONS.establishmentTranslations, existingTranslation.id, payload)
        : createRecord<EstablishmentTranslation>(COLLECTIONS.establishmentTranslations, payload)
    },
    onSuccess: (translation) => {
      toast.success(`Traduction ${translation.language.toUpperCase()} enregistrée`)
      void queryClient.invalidateQueries({ queryKey: qk.collection(COLLECTIONS.establishmentTranslations) })
    },
  })

  function onSubmit(data: FormValues) {
    saveMutation.mutate(data)
  }

  if (isEdit && establishmentQuery.isLoading) {
    return <PageSkeleton />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        title={isEdit ? 'Modifier l\'établissement' : 'Nouvel établissement'}
        description={existing?.name}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild><Link to="/establishments"><ArrowLeft className="h-4 w-4" />Retour</Link></Button>
            {canWrite && <Button type="submit" size="sm" disabled={saveMutation.isPending || (!isDirty && isEdit)}><Save className="h-4 w-4" />{isEdit ? 'Enregistrer' : 'Créer'}</Button>}
          </div>
        }
      />
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="translations">Traductions</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="col-span-2 space-y-4">
              <SectionCard title="1 · Identification">
                <FormField label="Nom" required error={errors.name?.message}><Input {...register('name')} placeholder="Nom de l'établissement" /></FormField>
                <FormField label="Type" required error={errors.type?.message}>
                  <Controller control={control} name="type" render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youth_house">Maison de jeunes</SelectItem>
                        <SelectItem value="youth_hostel">Auberge de jeunesse</SelectItem>
                        <SelectItem value="sports_complex">Complexe sportif</SelectItem>
                        <SelectItem value="youth_camp">Camp de jeunes</SelectItem>
                        <SelectItem value="polyvalent_hall">Salle polyvalente</SelectItem>
                        <SelectItem value="scientific_leisure_center">Centre loisirs scientifiques</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </FormField>
              </SectionCard>
              <SectionCard title="2 · Localisation">
                <TwoCol>
                  <FormField label="Commune" required error={errors.commune?.message}><Input {...register('commune')} /></FormField>
                  <FormField label="Wilaya" required error={errors.wilaya?.message}><Input {...register('wilaya')} /></FormField>
                </TwoCol>
                <FormField label="Adresse" required error={errors.address?.message}><Input {...register('address')} placeholder="Rue, quartier, code postal" /></FormField>
                <TwoCol>
                  <FormField label="Latitude" error={errors.latitude?.message} hint="Ex: 36.7509"><Input {...register('latitude')} type="number" step="0.0001" /></FormField>
                  <FormField label="Longitude" error={errors.longitude?.message} hint="Ex: 5.0564"><Input {...register('longitude')} type="number" step="0.0001" /></FormField>
                </TwoCol>
              </SectionCard>
              <SectionCard title="3 · Contact & services">
                <TwoCol>
                  <FormField label="Téléphone" error={errors.phone?.message}><Input {...register('phone')} type="tel" placeholder="034 xx xx xx" /></FormField>
                  <FormField label="Email" error={errors.email?.message}><Input {...register('email')} type="email" placeholder="contact@odej.dz" /></FormField>
                </TwoCol>
                <FormField label="Horaires d'ouverture" error={errors.opening_hours?.message}><Input {...register('opening_hours')} placeholder="Ex: Dim–Jeu 08h–17h" /></FormField>
                <FormField label="Services" error={errors.services?.message}><Textarea {...register('services')} rows={2} placeholder="Liste des services proposés" /></FormField>
                <FormField label="Notes d'accessibilité" error={errors.accessibility_notes?.message}><Textarea {...register('accessibility_notes')} rows={2} placeholder="Accès PMR, rampe..." /></FormField>
              </SectionCard>
              <SectionCard title="4 · Image">
                <Controller control={control} name="image" render={({ field }) => (
                  <FileUpload accept="image" value={existing ? recordFileUrl(existing, field.value) : field.value} onChange={field.onChange} onClear={() => field.onChange('')} disabled={!canWrite} />
                )} />
              </SectionCard>
            </div>
            <div className="space-y-4">
              <SectionCard title="Publication">
                <FormField label="Statut" required>
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
        </TabsContent>
        <TabsContent value="translations" className="mt-4">
          <div className="bento-card space-y-4">
            <h2 className="text-label-lg font-bold">Traductions</h2>
            <Separator />
            <LanguageTabs>
              {(lang) => (
                <div className="mt-4 space-y-4">
                  <FormField label="Description">
                    <Textarea rows={4} value={translations[lang]?.description ?? ''} onChange={(e) => setTranslations((p) => ({ ...p, [lang]: { ...p[lang]!, description: e.target.value } }))} placeholder="Description de l'établissement" />
                  </FormField>
                  <FormField label="Services (texte localisé)">
                    <Textarea rows={3} value={translations[lang]?.services_text ?? ''} onChange={(e) => setTranslations((p) => ({ ...p, [lang]: { ...p[lang]!, services_text: e.target.value } }))} placeholder="Services en langue locale" />
                  </FormField>
                  <FormField label="Accessibilité (texte localisé)">
                    <Textarea rows={2} value={translations[lang]?.accessibility_text ?? ''} onChange={(e) => setTranslations((p) => ({ ...p, [lang]: { ...p[lang]!, accessibility_text: e.target.value } }))} placeholder="Notes d'accessibilité en langue locale" />
                  </FormField>
                  <Button type="button" size="sm" disabled={translationMutation.isPending || !isEdit} onClick={() => translationMutation.mutate(lang)}><Save className="h-4 w-4" />Enregistrer {lang.toUpperCase()}</Button>
                </div>
              )}
            </LanguageTabs>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}
