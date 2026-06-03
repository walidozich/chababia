import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { FormField } from '@/components/shared/FormField'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { MOCK_USERS } from '@/mocks'
import type { InterestCategory } from '@/types/collections'
import { useAuthStore } from '@/stores/authStore'

const schema = z.object({
  full_name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().default(''),
  role: z.enum(['youth', 'super_admin', 'wilaya_admin', 'establishment_manager', 'content_editor', 'attendance_staff']),
  preferred_language: z.enum(['ar', 'fr', 'tzm']).default('fr'),
  commune: z.string().default(''),
  wilaya: z.string().default(''),
  interests: z.array(z.string()).default([]),
  verified: z.boolean().default(false),
})
type FormValues = z.infer<typeof schema>

const INTEREST_CATEGORIES: InterestCategory[] = [
  'Sports',
  'Culture',
  'Training',
  'Volunteering',
  'Health Awareness',
  'Science',
  'Arts',
  'Environment',
  'Youth Orientation',
  'Camps and Trips',
  'Coding',
  'Design',
  'Robotics',
  'Photography',
  'Debate',
]

const ROLE_LABELS: Record<FormValues['role'], string> = {
  youth: 'Jeune',
  super_admin: 'Super Admin',
  wilaya_admin: 'Admin Wilaya',
  establishment_manager: 'Gestion Étab.',
  content_editor: 'Éditeur',
  attendance_staff: 'Pointage',
}

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

function AccessDenied() {
  return (
    <div className="bento-card py-16 text-center">
      <p className="text-label-lg font-bold text-error">Accès réservé aux superadmins.</p>
    </div>
  )
}

export default function UserFormPage() {
  const isSuperuser = useAuthStore((state) => state.isAdmin)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const existing = isEdit ? MOCK_USERS.find((user) => user.id === id) : undefined

  const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      role: 'youth',
      preferred_language: 'fr',
      commune: '',
      wilaya: '',
      interests: [],
      verified: false,
    },
  })

  useEffect(() => {
    if (existing) {
      reset({
        full_name: existing.full_name,
        email: existing.email,
        phone: existing.phone,
        role: existing.role,
        preferred_language: existing.preferred_language,
        commune: existing.commune,
        wilaya: existing.wilaya,
        interests: existing.interests,
        verified: existing.verified,
      })
    }
  }, [existing, reset])

  if (!isSuperuser) return <AccessDenied />

  if (isEdit && !existing) {
    return (
      <div className="bento-card py-16 text-center">
        <p className="text-label-lg font-bold text-on-surface">Utilisateur introuvable.</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to="/users">Retour</Link>
        </Button>
      </div>
    )
  }

  function onSubmit(data: FormValues) {
    toast.success(isEdit ? 'Utilisateur mis à jour (mock)' : 'Utilisateur créé (mock)', { description: data.email })
    void navigate('/users')
  }

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
      className="space-y-6"
    >
      <PageHeader
        title={isEdit ? 'Modifier l’utilisateur' : 'Nouvel utilisateur'}
        description={existing?.full_name}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/users">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Link>
            </Button>
            <Button type="submit" size="sm" disabled={!isDirty && isEdit}>
              <Save className="h-4 w-4" />
              {isEdit ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SectionCard title="Identité">
            <TwoCol>
              <FormField label="Nom complet" required error={errors.full_name?.message}>
                <Input {...register('full_name')} placeholder="Nom et prénom" />
              </FormField>
              <FormField label="Email" required error={errors.email?.message}>
                <Input {...register('email')} type="email" placeholder="nom@exemple.dz" />
              </FormField>
              <FormField label="Téléphone" error={errors.phone?.message}>
                <Input {...register('phone')} placeholder="0550000000" />
              </FormField>
              <FormField label="Rôle" required error={errors.role?.message}>
                <Controller control={control} name="role" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </FormField>
            </TwoCol>
          </SectionCard>

          <SectionCard title="Localisation">
            <TwoCol>
              <FormField label="Commune" error={errors.commune?.message}>
                <Input {...register('commune')} placeholder="Commune" />
              </FormField>
              <FormField label="Wilaya" error={errors.wilaya?.message}>
                <Input {...register('wilaya')} placeholder="Wilaya" />
              </FormField>
              <FormField label="Langue préférée" error={errors.preferred_language?.message}>
                <Controller control={control} name="preferred_language" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">Arabe</SelectItem>
                      <SelectItem value="tzm">Tamazight</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </FormField>
            </TwoCol>
          </SectionCard>

          <SectionCard title="Centres d’intérêt">
            <Controller control={control} name="interests" render={({ field }) => (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {INTEREST_CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      id={`interest-${category}`}
                      checked={field.value.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked === true) {
                          field.onChange([...field.value, category])
                          return
                        }
                        field.onChange(field.value.filter((value: string) => value !== category))
                      }}
                    />
                    <Label htmlFor={`interest-${category}`} className="text-xs">{category}</Label>
                  </div>
                ))}
              </div>
            )} />
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Compte">
            <Controller control={control} name="verified" render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="verified"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked === true)
                  }}
                />
                <Label htmlFor="verified">Compte vérifié</Label>
              </div>
            )} />
            <Button type="submit" className="w-full" disabled={!isDirty && isEdit}>
              <Save className="h-4 w-4" />
              {isEdit ? 'Enregistrer' : 'Créer'}
            </Button>
          </SectionCard>

          {isEdit && existing && (
            <div className="bento-card space-y-2 text-xs text-on-surface-variant">
              <p><span className="font-semibold">Créé le</span> {new Date(existing.created).toLocaleDateString('fr-FR')}</p>
              <p><span className="font-semibold">Modifié le</span> {new Date(existing.updated).toLocaleDateString('fr-FR')}</p>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
