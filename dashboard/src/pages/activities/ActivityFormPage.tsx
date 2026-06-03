import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { MOCK_ACTIVITIES, MOCK_CATEGORIES, MOCK_ESTABLISHMENTS } from '@/mocks'
import { can } from '@/lib/permissions'
import { DEV_ROLE, DEV_IS_ADMIN } from '@/lib/devRole'

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  title: z.string().min(3, 'Minimum 3 caractères'),
  short_description: z.string().min(10, 'Minimum 10 caractères'),
  full_description: z.string().min(20, 'Minimum 20 caractères'),
  commune: z.string().min(2, 'Commune requise'),
  wilaya: z.string().min(2, 'Wilaya requise'),
  category: z.string().min(1, 'Catégorie requise'),
  establishment: z.string().default(''),
  activity_mode: z.enum(['physical', 'online', 'hybrid']),
  online_link: z.string().default(''),
  start_datetime: z.string().min(1, 'Date de début requise'),
  end_datetime: z.string().min(1, 'Date de fin requise'),
  registration_deadline: z.string().default(''),
  capacity: z.coerce.number().int().min(1, 'Min 1 participant'),
  requires_registration: z.boolean().default(true),
  is_free: z.boolean().default(true),
  age_min: z.coerce.number().int().min(0).max(100),
  age_max: z.coerce.number().int().min(0).max(100),
  language: z.enum(['ar', 'fr', 'tzm', 'all', 'mixed']),
  accessibility_notes: z.string().default(''),
  required_documents: z.string().default(''),
  bandwidth_level: z.enum(['low', 'medium', 'high']).default('low'),
  replay_available: z.boolean().default(false),
  contact_phone: z.string().default(''),
  contact_email: z.string().default(''),
  image: z.string().default(''),
  status: z.enum(['draft', 'published', 'cancelled', 'archived']).default('draft'),
})

type FormValues = z.infer<typeof schema>

// ─── Section card helper ──────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ActivityFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const canWrite = can('write', 'activities', DEV_ROLE, DEV_IS_ADMIN)

  const existing = isEdit ? MOCK_ACTIVITIES.find((a) => a.id === id) : undefined

  // Translation state (mock — no PB calls)
  const [translations, setTranslations] = useState<Record<string, { title: string; short_description: string; full_description: string }>>({
    fr: { title: '', short_description: '', full_description: '' },
    ar: { title: '', short_description: '', full_description: '' },
    tzm: { title: '', short_description: '', full_description: '' },
  })

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      short_description: '',
      full_description: '',
      commune: '',
      wilaya: '',
      category: '',
      establishment: '',
      activity_mode: 'physical',
      online_link: '',
      start_datetime: '',
      end_datetime: '',
      registration_deadline: '',
      capacity: 30,
      requires_registration: true,
      is_free: true,
      age_min: 14,
      age_max: 30,
      language: 'fr',
      accessibility_notes: '',
      required_documents: '',
      bandwidth_level: 'low',
      replay_available: false,
      contact_phone: '',
      contact_email: '',
      image: '',
      status: 'draft',
    },
  })

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        short_description: existing.short_description,
        full_description: existing.full_description,
        commune: existing.commune,
        wilaya: existing.wilaya,
        category: existing.category,
        establishment: existing.establishment,
        activity_mode: existing.activity_mode,
        online_link: existing.online_link,
        start_datetime: existing.start_datetime.slice(0, 16),
        end_datetime: existing.end_datetime.slice(0, 16),
        registration_deadline: existing.registration_deadline?.slice(0, 16) ?? '',
        capacity: existing.capacity,
        requires_registration: existing.requires_registration,
        is_free: existing.is_free,
        age_min: existing.age_min,
        age_max: existing.age_max,
        language: existing.language,
        accessibility_notes: existing.accessibility_notes,
        required_documents: existing.required_documents,
        bandwidth_level: existing.bandwidth_level,
        replay_available: existing.replay_available,
        contact_phone: existing.contact_phone,
        contact_email: existing.contact_email,
        image: existing.image,
        status: existing.status,
      })
    }
  }, [existing, reset])

  const mode = watch('activity_mode')

  function onSubmit(data: FormValues) {
    toast.success(isEdit ? 'Activité mise à jour (mock)' : 'Activité créée (mock)', {
      description: data.title,
    })
    navigate('/activities')
  }

  if (isEdit && !existing) {
    return (
      <div className="bento-card text-center py-12">
        <p className="text-on-surface-variant">Activité introuvable.</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to="/activities">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        title={isEdit ? 'Modifier l\'activité' : 'Nouvelle activité'}
        description={existing?.title}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/activities">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Link>
            </Button>
            {canWrite && (
              <Button type="submit" size="sm" disabled={!isDirty && isEdit}>
                <Save className="h-4 w-4" />
                {isEdit ? 'Enregistrer' : 'Créer'}
              </Button>
            )}
          </div>
        }
      />

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="translations">Traductions</TabsTrigger>
        </TabsList>

        {/* ── Info tab ── */}
        <TabsContent value="info" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left — sections */}
            <div className="col-span-2 space-y-4">

              {/* Section 1 — Contenu */}
              <SectionCard title="1 · Contenu">
                <FormField label="Titre" required error={errors.title?.message}>
                  <Input {...register('title')} placeholder="Titre de l'activité" />
                </FormField>
                <FormField label="Description courte" required error={errors.short_description?.message}>
                  <Textarea {...register('short_description')} rows={2} placeholder="Résumé en 1-2 phrases" />
                </FormField>
                <FormField label="Description complète" required error={errors.full_description?.message}>
                  <Textarea {...register('full_description')} rows={5} placeholder="Description détaillée" />
                </FormField>
              </SectionCard>

              {/* Section 2 — Localisation */}
              <SectionCard title="2 · Localisation & rattachement">
                <TwoCol>
                  <FormField label="Commune" required error={errors.commune?.message}>
                    <Input {...register('commune')} placeholder="Ex: Béjaïa" />
                  </FormField>
                  <FormField label="Wilaya" required error={errors.wilaya?.message}>
                    <Input {...register('wilaya')} placeholder="Ex: Béjaïa" />
                  </FormField>
                </TwoCol>
                <TwoCol>
                  <FormField label="Catégorie" required error={errors.category?.message}>
                    <Controller
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_CATEGORIES.filter((c) => c.status === 'active').map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                  <FormField label="Établissement" error={errors.establishment?.message}>
                    <Controller
                      control={control}
                      name="establishment"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Optionnel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Aucun</SelectItem>
                            {MOCK_ESTABLISHMENTS.filter((e) => e.status === 'published').map((e) => (
                              <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                </TwoCol>
              </SectionCard>

              {/* Section 3 — Mode */}
              <SectionCard title="3 · Mode de diffusion">
                <FormField label="Mode d'activité" required error={errors.activity_mode?.message}>
                  <Controller
                    control={control}
                    name="activity_mode"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full sm:w-60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="physical">Présentiel</SelectItem>
                          <SelectItem value="online">En ligne</SelectItem>
                          <SelectItem value="hybrid">Hybride</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
                {(mode === 'online' || mode === 'hybrid') && (
                  <FormField label="Lien en ligne" error={errors.online_link?.message}>
                    <Input {...register('online_link')} placeholder="https://meet.example.dz/..." type="url" />
                  </FormField>
                )}
                <TwoCol>
                  <FormField label="Niveau bande passante" error={errors.bandwidth_level?.message}>
                    <Controller
                      control={control}
                      name="bandwidth_level"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Basse (présentiel / offline)</SelectItem>
                            <SelectItem value="medium">Moyenne (streaming léger)</SelectItem>
                            <SelectItem value="high">Haute (vidéo HD)</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                  <div className="flex items-end pb-1">
                    <div className="flex items-center gap-2">
                      <Controller
                        control={control}
                        name="replay_available"
                        render={({ field }) => (
                          <Checkbox id="replay" checked={field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                      <Label htmlFor="replay">Replay disponible</Label>
                    </div>
                  </div>
                </TwoCol>
              </SectionCard>

              {/* Section 4 — Dates & inscription */}
              <SectionCard title="4 · Dates & capacité">
                <TwoCol>
                  <FormField label="Date de début" required error={errors.start_datetime?.message}>
                    <Input {...register('start_datetime')} type="datetime-local" />
                  </FormField>
                  <FormField label="Date de fin" required error={errors.end_datetime?.message}>
                    <Input {...register('end_datetime')} type="datetime-local" />
                  </FormField>
                </TwoCol>
                <TwoCol>
                  <FormField label="Date limite d'inscription" error={errors.registration_deadline?.message}>
                    <Input {...register('registration_deadline')} type="datetime-local" />
                  </FormField>
                  <FormField label="Capacité maximale" required error={errors.capacity?.message}>
                    <Input {...register('capacity')} type="number" min={1} />
                  </FormField>
                </TwoCol>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Controller
                      control={control}
                      name="requires_registration"
                      render={({ field }) => (
                        <Checkbox id="requires_reg" checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    <Label htmlFor="requires_reg">Inscription requise</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Controller
                      control={control}
                      name="is_free"
                      render={({ field }) => (
                        <Checkbox id="is_free" checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    <Label htmlFor="is_free">Activité gratuite</Label>
                  </div>
                </div>
              </SectionCard>

              {/* Section 5 — Public cible */}
              <SectionCard title="5 · Public cible & accessibilité">
                <TwoCol>
                  <FormField label="Âge minimum" error={errors.age_min?.message}>
                    <Input {...register('age_min')} type="number" min={0} max={100} />
                  </FormField>
                  <FormField label="Âge maximum" error={errors.age_max?.message}>
                    <Input {...register('age_max')} type="number" min={0} max={100} />
                  </FormField>
                </TwoCol>
                <FormField label="Langue de l'activité" required error={errors.language?.message}>
                  <Controller
                    control={control}
                    name="language"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full sm:w-56">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="ar">Arabe</SelectItem>
                          <SelectItem value="tzm">Tamazight</SelectItem>
                          <SelectItem value="all">Toutes langues</SelectItem>
                          <SelectItem value="mixed">Multilingue</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
                <FormField label="Notes d'accessibilité" error={errors.accessibility_notes?.message}>
                  <Textarea {...register('accessibility_notes')} rows={2} placeholder="Ex: accès PMR, langue des signes…" />
                </FormField>
                <FormField label="Documents requis" error={errors.required_documents?.message}>
                  <Input {...register('required_documents')} placeholder="Ex: Carte d'identité, certificat médical" />
                </FormField>
              </SectionCard>

              {/* Section 6 — Contact & image */}
              <SectionCard title="6 · Contact & visuel">
                <TwoCol>
                  <FormField label="Téléphone contact" error={errors.contact_phone?.message}>
                    <Input {...register('contact_phone')} placeholder="034 xx xx xx" type="tel" />
                  </FormField>
                  <FormField label="Email contact" error={errors.contact_email?.message}>
                    <Input {...register('contact_email')} placeholder="info@odej.dz" type="email" />
                  </FormField>
                </TwoCol>
                <FormField label="Image (max 300 Ko — JPG/PNG/WebP)">
                  <Controller
                    control={control}
                    name="image"
                    render={({ field }) => (
                      <FileUpload
                        accept="image"
                        value={field.value}
                        onChange={field.onChange}
                        onClear={() => field.onChange('')}
                        disabled={!canWrite}
                      />
                    )}
                  />
                </FormField>
              </SectionCard>
            </div>

            {/* Right — status sidebar */}
            <div className="space-y-4">
              <SectionCard title="Publication">
                <FormField label="Statut" required error={errors.status?.message}>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={!canWrite}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Brouillon</SelectItem>
                          <SelectItem value="published">Publié</SelectItem>
                          <SelectItem value="cancelled">Annulé</SelectItem>
                          <SelectItem value="archived">Archivé</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
                {canWrite && (
                  <Button type="submit" className="w-full" disabled={!isDirty && isEdit}>
                    <Save className="h-4 w-4" />
                    {isEdit ? 'Enregistrer les modifications' : 'Créer l\'activité'}
                  </Button>
                )}
              </SectionCard>

              {isEdit && existing && (
                <div className="bento-card space-y-2 text-xs text-on-surface-variant">
                  <p><span className="font-semibold">Créé le</span> {new Date(existing.created).toLocaleDateString('fr-FR')}</p>
                  <p><span className="font-semibold">Modifié le</span> {new Date(existing.updated).toLocaleDateString('fr-FR')}</p>
                  {existing.last_verified_at && (
                    <p><span className="font-semibold">Vérifié le</span> {new Date(existing.last_verified_at).toLocaleDateString('fr-FR')}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── Translations tab ── */}
        <TabsContent value="translations" className="mt-4">
          <div className="bento-card space-y-4">
            <div>
              <h2 className="text-label-lg font-bold text-on-surface">Traductions</h2>
              <p className="text-body-sm text-on-surface-variant">
                Les champs de traduction permettent de fournir le titre, la description courte et la description complète dans d'autres langues.
              </p>
            </div>
            <Separator />
            <LanguageTabs>
              {(lang) => (
                <div className="mt-4 space-y-4">
                  <FormField label="Titre">
                    <Input
                      value={translations[lang]?.title ?? ''}
                      onChange={(e) =>
                        setTranslations((prev) => ({ ...prev, [lang]: { ...prev[lang]!, title: e.target.value } }))
                      }
                      placeholder={`Titre en ${lang === 'fr' ? 'français' : lang === 'ar' ? 'arabe' : 'tamazight'}`}
                    />
                  </FormField>
                  <FormField label="Description courte">
                    <Textarea
                      rows={2}
                      value={translations[lang]?.short_description ?? ''}
                      onChange={(e) =>
                        setTranslations((prev) => ({ ...prev, [lang]: { ...prev[lang]!, short_description: e.target.value } }))
                      }
                      placeholder="Résumé court"
                    />
                  </FormField>
                  <FormField label="Description complète">
                    <Textarea
                      rows={6}
                      value={translations[lang]?.full_description ?? ''}
                      onChange={(e) =>
                        setTranslations((prev) => ({ ...prev, [lang]: { ...prev[lang]!, full_description: e.target.value } }))
                      }
                      placeholder="Description détaillée"
                    />
                  </FormField>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => toast.success(`Traduction ${lang.toUpperCase()} enregistrée (mock)`)}
                  >
                    <Save className="h-4 w-4" />
                    Enregistrer traduction {lang.toUpperCase()}
                  </Button>
                </div>
              )}
            </LanguageTabs>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}
