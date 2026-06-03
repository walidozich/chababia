import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Loader2, Lock, Mail } from 'lucide-react'
import { ChababiaLogo } from '@/components/shared/ChababiaLogo'
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
        <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-outline-variant bg-primary p-10 text-white lg:flex">
          {/* ── Decorative background layer ── */}
          <div className="pointer-events-none absolute inset-0">
            {/* Dot grid texture */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="login-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#login-dots)" />
            </svg>

            {/* Organic arc lines — echoing the logo's swooping curves */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.09]" viewBox="0 0 700 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" fill="none">
              <path d="M-80 720 Q180 320 760 80" stroke="white" strokeWidth="1.5" />
              <path d="M-120 820 Q220 380 800 20" stroke="white" strokeWidth="0.8" />
              <path d="M60 900 Q380 480 800 260" stroke="#9fe870" strokeWidth="1.2" opacity="0.7" />
              <path d="M-40 580 Q300 200 760 180" stroke="#9fe870" strokeWidth="0.7" opacity="0.5" />
            </svg>

            {/* Large ghost logo — top-right, bleeding off edge */}
            <div className="absolute -right-16 -top-10 translate-x-4">
              <ChababiaLogo className="h-60 w-auto opacity-[0.07]" fill="white" />
            </div>

            {/* Medium ghost logo — bottom-left, slightly rotated */}
            <div className="absolute -bottom-6 -left-10 rotate-[8deg]">
              <ChababiaLogo className="h-40 w-auto opacity-[0.12]" fill="#9fe870" />
            </div>

            {/* Radial lime glow — top-left quadrant */}
            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
            {/* Radial lime glow — bottom-right */}
            <div className="absolute -bottom-32 -right-16 h-[480px] w-[480px] rounded-full bg-primary-container/8 blur-3xl" />
          </div>

          {/* ── Content (above decorations) ── */}
          <div className="relative z-10 flex items-center gap-3">
            <ChababiaLogo className="h-9 w-auto" fill="white" />
            <div>
              <p className="text-headline-sm font-black">Chababia</p>
              <p className="text-body-sm text-white/70">Dashboard ODEJ</p>
            </div>
          </div>
          <div className="relative z-10 max-w-xl space-y-5">
            <p className="text-display-lg font-black leading-tight">
              Administration des opportunités jeunesse.
            </p>
            <p className="text-body-lg text-white/75">
              Connexion sécurisée pour les équipes ODEJ, les éditeurs, les responsables
              d'établissement et les superadmins.
            </p>
          </div>
          <p className="relative z-10 text-body-sm text-white/60">ECOHACK '26 · Plateforme Chababia</p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-3 lg:hidden">
              <ChababiaLogo className="h-9 w-auto" fill="#2f6c00" />
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
