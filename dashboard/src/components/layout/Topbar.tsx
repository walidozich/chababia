import { Fragment } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, Menu, LogOut, Settings, User } from 'lucide-react'
import { pb } from '@/lib/pb'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'

const ROLE_LABELS: Record<string, string> = {
  youth: 'Jeune',
  super_admin: 'Super Admin',
  wilaya_admin: 'Admin Wilaya',
  establishment_manager: 'Responsable',
  content_editor: 'Éditeur',
  attendance_staff: 'Présence',
}

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Tableau de bord',
  '/activities': 'Activités',
  '/activities/new': 'Nouvelle activité',
  '/announcements': 'Annonces',
  '/announcements/new': 'Nouvelle annonce',
  '/newsletters': 'Newsletters',
  '/documents': 'Documents',
  '/establishments': 'Établissements',
  '/categories': 'Catégories',
  '/registrations': 'Inscriptions',
  '/projects': 'Projets jeunes',
  '/talent': 'Vitrine talents',
  '/reports': 'Signalements',
  '/users': 'Utilisateurs',
  '/recommendations': 'IA Recommandations',
}

function useBreadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) return [{ label: 'Tableau de bord', to: '/' }]

  const crumbs = [{ label: 'Tableau de bord', to: '/' }]
  let path = ''
  for (const seg of segments) {
    path += `/${seg}`
    const label = ROUTE_LABELS[path] ?? seg
    crumbs.push({ label, to: path })
  }
  return crumbs
}

function field(record: unknown, key: string): unknown {
  if (!record || typeof record !== 'object') return undefined
  return (record as Record<string, unknown>)[key]
}

export function Topbar() {
  const breadcrumbs = useBreadcrumbs()
  const navigate = useNavigate()
  const { role, isAdmin, userName: storedUserName, clearAuth } = useAuthStore()
  const roleName = isAdmin ? 'super_admin' : role
  const roleLabel = roleName ? ROLE_LABELS[roleName] ?? roleName : 'Session'

  const userName = storedUserName ?? 'Utilisateur'
  const email = field(pb.authStore.record, 'email')
  const emailLabel = typeof email === 'string' && email.length > 0 ? email : roleLabel
  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'CH'

  function handleLogout() {
    pb.authStore.clear()
    clearAuth()
    void navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-outline bg-surface px-4 lg:px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Breadcrumbs */}
      <nav className="flex min-w-0 flex-1 items-center gap-1 text-body-sm" aria-label="Fil d'Ariane">
        {breadcrumbs.map((crumb, i) => (
          <Fragment key={crumb.to}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-on-surface-variant/50" />}
            {i === breadcrumbs.length - 1 ? (
              <span className="truncate font-semibold text-on-surface">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.to}
                className="truncate text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {crumb.label}
              </Link>
            )}
          </Fragment>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Role badge */}
        <div className="hidden items-center gap-1.5 sm:flex">
          {isAdmin && (
            <span className="rounded-full bg-error/10 px-2 py-0.5 text-xs font-semibold text-error">
              Superadmin
            </span>
          )}
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-on-surface">
            {roleLabel}
          </span>
        </div>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-label-sm font-bold text-on-surface ring-offset-surface transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-label-sm font-semibold">{userName}</p>
                <p className="text-xs text-on-surface-variant">{emailLabel}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2">
              <User className="h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-error focus:bg-error/10 focus:text-error"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
