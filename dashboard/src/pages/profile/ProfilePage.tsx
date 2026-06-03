import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { KeyRound, Save, User } from 'lucide-react'
import { pb } from '@/lib/pb'
import { useAuthStore } from '@/stores/authStore'
import { PageHeader } from '@/components/shared/PageHeader'
import { FormField } from '@/components/shared/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const ROLE_LABELS: Record<string, string> = {
  youth: 'Jeune',
  super_admin: 'Super Admin',
  wilaya_admin: 'Admin Wilaya',
  establishment_manager: 'Responsable Établissement',
  content_editor: 'Éditeur de contenu',
  attendance_staff: 'Personnel présence',
}

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Mot de passe actuel requis'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  passwordConfirm: z.string().min(1, 'Confirmation requise'),
}).refine((d) => d.password === d.passwordConfirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['passwordConfirm'],
})

type PasswordValues = z.infer<typeof passwordSchema>

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bento-card space-y-4">
      <h2 className="text-label-lg font-bold text-on-surface">{title}</h2>
      <Separator />
      {children}
    </div>
  )
}

function field(record: unknown, key: string): unknown {
  if (!record || typeof record !== 'object') return undefined
  return (record as Record<string, unknown>)[key]
}

export default function ProfilePage() {
  const { role, isAdmin, userName } = useAuthStore()
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const record = pb.authStore.record
  const email = String(field(record, 'email') ?? '')
  const commune = String(field(record, 'commune') ?? '')
  const wilaya = String(field(record, 'wilaya') ?? '')
  const roleName = isAdmin ? 'Super Admin' : (role ? (ROLE_LABELS[role] ?? role) : '—')

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: '', password: '', passwordConfirm: '' },
  })

  async function onPasswordSubmit(data: PasswordValues) {
    setIsChangingPassword(true)
    try {
      if (pb.authStore.isSuperuser) {
        await pb.collection('_superusers').update(pb.authStore.record?.id ?? '', {
          oldPassword: data.oldPassword,
          password: data.password,
          passwordConfirm: data.passwordConfirm,
        })
      } else {
        await pb.collection('users').update(pb.authStore.record?.id ?? '', {
          oldPassword: data.oldPassword,
          password: data.password,
          passwordConfirm: data.passwordConfirm,
        })
      }
      toast.success('Mot de passe modifié avec succès')
      reset()
    } catch {
      toast.error('Erreur', { description: 'Mot de passe actuel incorrect ou erreur serveur.' })
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mon profil"
        description="Informations de votre compte administrateur"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <SectionCard title="Informations du compte">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-2xl font-black text-primary-on-container">
                {userName?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) ?? 'CH'}
              </div>
              <div>
                <p className="text-headline-sm font-extrabold text-on-surface">{userName ?? '—'}</p>
                <p className="text-body-sm text-on-surface-variant">{email}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Rôle</p>
                <span className="inline-flex rounded-full bg-primary/15 px-2.5 py-0.5 text-label-sm font-semibold text-on-surface">
                  {roleName}
                </span>
              </div>
              {commune && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Commune</p>
                  <p className="text-body-sm text-on-surface">{commune}</p>
                </div>
              )}
              {wilaya && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Wilaya</p>
                  <p className="text-body-sm text-on-surface">{wilaya}</p>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Modifier le mot de passe">
            <form onSubmit={(e) => { void handleSubmit(onPasswordSubmit)(e) }} className="space-y-4">
              <FormField label="Mot de passe actuel" required error={errors.oldPassword?.message}>
                <Input type="password" autoComplete="current-password" {...register('oldPassword')} />
              </FormField>
              <FormField label="Nouveau mot de passe" required error={errors.password?.message}>
                <Input type="password" autoComplete="new-password" {...register('password')} />
              </FormField>
              <FormField label="Confirmer le nouveau mot de passe" required error={errors.passwordConfirm?.message}>
                <Input type="password" autoComplete="new-password" {...register('passwordConfirm')} />
              </FormField>
              <Button type="submit" size="sm" disabled={isChangingPassword || !isDirty}>
                <KeyRound className="h-4 w-4" />
                {isChangingPassword ? 'Modification…' : 'Modifier le mot de passe'}
              </Button>
            </form>
          </SectionCard>
        </div>

        <div>
          <SectionCard title="Résumé">
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
                <User className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-on-surface-variant">Identifiant</p>
                  <p className="truncate text-label-sm font-semibold text-on-surface">{String(field(record, 'id') ?? '—')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
                <Save className="h-5 w-5 shrink-0 text-tertiary" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-on-surface-variant">Session active</p>
                  <p className="text-label-sm font-semibold text-primary">Connecté</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
