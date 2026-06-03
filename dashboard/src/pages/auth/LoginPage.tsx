import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Leaf, Loader2, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { pb } from '@/lib/pb'
import { useAuthStore } from '@/stores/authStore'
import type { Role } from '@/types/collections'

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})
type FormValues = z.infer<typeof schema>

const ROLES: Role[] = [
  'youth',
  'super_admin',
  'wilaya_admin',
  'establishment_manager',
  'content_editor',
  'attendance_staff',
]

function isRole(value: unknown): value is Role {
  return typeof value === 'string' && ROLES.includes(value as Role)
}

function field(record: unknown, key: string): unknown {
  if (!record || typeof record !== 'object') return undefined
  return (record as Record<string, unknown>)[key]
}

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    if (pb.authStore.isValid) {
      void navigate('/', { replace: true })
    }
  }, [navigate])

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      await pb.collection('_superusers').authWithPassword(data.email, data.password)
      const record = pb.authStore.record
      const id = field(record, 'id')
      setAuth({
        isAdmin: true,
        role: 'super_admin',
        userId: typeof id === 'string' ? id : '',
        userName: data.email,
      })
      toast.success('Connexion superadmin réussie')
      void navigate('/', { replace: true })
      return
    } catch {
      // Fall through to regular dashboard user auth.
    }

    try {
      const authData = await pb.collection('users').authWithPassword(data.email, data.password)
      const record = authData.record
      const id = field(record, 'id')
      const role = field(record, 'role')
      const fullName = field(record, 'full_name')
      const email = field(record, 'email')

      setAuth({
        isAdmin: false,
        role: isRole(role) ? role : null,
        userId: typeof id === 'string' ? id : '',
        userName: typeof fullName === 'string' && fullName.length > 0
          ? fullName
          : typeof email === 'string' && email.length > 0
            ? email
            : data.email,
      })
      toast.success('Connexion réussie')
      void navigate('/', { replace: true })
    } catch {
      pb.authStore.clear()
      toast.error('Identifiants incorrects')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_520px]">
        <section className="hidden min-h-screen flex-col justify-between border-r border-outline bg-primary p-10 text-white lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container text-primary-on-container">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-headline-sm font-black">Chababia</p>
              <p className="text-body-sm text-white/70">Dashboard ODEJ</p>
            </div>
          </div>
          <div className="max-w-xl space-y-5">
            <p className="text-display-lg font-black leading-tight">
              Administration des opportunités jeunesse.
            </p>
            <p className="text-body-lg text-white/75">
              Connexion sécurisée pour les équipes ODEJ, les éditeurs, les responsables
              d'établissement et les superadmins.
            </p>
          </div>
          <p className="text-body-sm text-white/60">ECOHACK '26 · Plateforme Chababia</p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container text-primary-on-container">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-headline-sm font-black">Chababia</p>
                <p className="text-body-sm text-on-surface-variant">Dashboard ODEJ</p>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-headline-sm font-black tracking-tight">Connexion</h1>
              <p className="text-body-sm text-on-surface-variant">
                Utilisez votre compte superadmin PocketBase ou votre compte administrateur.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(event) => {
                void handleSubmit(onSubmit)(event)
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@chababia.dz"
                    className="pl-9"
                    disabled={isSubmitting}
                    {...register('email')}
                  />
                </div>
                {errors.email?.message && <p className="text-xs text-error">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Mot de passe"
                    className="pl-9"
                    disabled={isSubmitting}
                    {...register('password')}
                  />
                </div>
                {errors.password?.message && <p className="text-xs text-error">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Se connecter
              </Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
