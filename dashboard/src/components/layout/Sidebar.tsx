import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Zap,
  Megaphone,
  Newspaper,
  FileText,
  Building2,
  Tags,
  ClipboardList,
  Rocket,
  Star,
  AlertTriangle,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { can } from '@/lib/permissions'
import { DEV_ROLE, DEV_IS_ADMIN } from '@/lib/devRole'
import { useSidebarStore } from '@/stores/sidebarStore'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  wilaya_admin: 'Admin Wilaya',
  establishment_manager: 'Responsable',
  content_editor: 'Éditeur',
  attendance_staff: 'Présence',
  youth: 'Jeune',
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-primary text-on-surface',
  wilaya_admin: 'bg-tertiary/20 text-tertiary',
  establishment_manager: 'bg-secondary/20 text-secondary',
  content_editor: 'bg-blue-100 text-blue-700',
  attendance_staff: 'bg-orange-100 text-orange-700',
  youth: 'bg-surface-container text-on-surface-variant',
}

interface NavItem {
  to: string
  icon: React.ElementType
  label: string
  resource?: Parameters<typeof can>[1]
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Vue d\'ensemble',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    ],
  },
  {
    title: 'Contenu',
    items: [
      { to: '/activities', icon: Zap, label: 'Activités', resource: 'activities' },
      { to: '/announcements', icon: Megaphone, label: 'Annonces', resource: 'announcements' },
      { to: '/newsletters', icon: Newspaper, label: 'Newsletters', resource: 'newsletters' },
      { to: '/documents', icon: FileText, label: 'Documents', resource: 'documents' },
      { to: '/establishments', icon: Building2, label: 'Établissements', resource: 'establishments' },
      { to: '/categories', icon: Tags, label: 'Catégories', resource: 'categories' },
    ],
  },
  {
    title: 'Engagement',
    items: [
      { to: '/registrations', icon: ClipboardList, label: 'Inscriptions', resource: 'registrations' },
      { to: '/projects', icon: Rocket, label: 'Projets jeunes', resource: 'project_submissions' },
      { to: '/talent', icon: Star, label: 'Vitrine talents', resource: 'talent_showcase' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { to: '/reports', icon: AlertTriangle, label: 'Signalements', resource: 'content_reports' },
      { to: '/users', icon: Users, label: 'Utilisateurs', resource: 'users' },
      { to: '/recommendations', icon: Sparkles, label: 'IA Reco', resource: 'recommendations' },
    ],
  },
]

function NavItemLink({
  item,
  collapsed,
}: {
  item: NavItem
  collapsed: boolean
}) {
  const location = useLocation()
  const isVisible =
    !item.resource || can('read', item.resource, DEV_ROLE, DEV_IS_ADMIN)

  if (!isVisible) return null

  const isActive =
    item.to === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.to)

  const link = (
    <NavLink
      to={item.to}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-label-sm font-semibold transition-all duration-150',
        isActive
          ? 'bg-primary text-on-surface'
          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
        collapsed && 'justify-center px-2',
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  return link
}

export function Sidebar() {
  const { collapsed, toggle } = useSidebarStore()
  const roleName = DEV_ROLE
  const userName = 'Mohamed Walid'
  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-outline bg-surface transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-outline px-4',
          collapsed ? 'justify-center' : 'gap-3',
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Leaf className="h-4 w-4 text-on-surface" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-label-lg font-extrabold tracking-tight text-on-surface">
              Chababia
            </p>
            <p className="truncate text-xs text-on-surface-variant">Dashboard ODEJ</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="flex flex-col gap-1">
          {NAV_GROUPS.map((group, gi) => {
            const visibleItems = group.items.filter(
              (item) => !item.resource || can('read', item.resource, DEV_ROLE, DEV_IS_ADMIN),
            )
            if (visibleItems.length === 0) return null
            return (
              <div key={gi} className="mb-2">
                {!collapsed && (
                  <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-on-surface-variant/60">
                    {group.title}
                  </p>
                )}
                {collapsed && gi > 0 && <Separator className="my-2" />}
                {visibleItems.map((item) => (
                  <NavItemLink key={item.to} item={item} collapsed={collapsed} />
                ))}
              </div>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User footer */}
      <div className="shrink-0 border-t border-outline p-2">
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex h-10 w-10 cursor-default items-center justify-center rounded-xl bg-primary text-label-sm font-bold text-on-surface mx-auto">
                {initials}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">{userName}</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-2 rounded-xl px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-surface">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-label-sm font-semibold text-on-surface">{userName}</p>
              <span
                className={cn(
                  'inline-block rounded-full px-1.5 py-0.5 text-xs font-semibold',
                  ROLE_COLORS[roleName] ?? 'bg-surface-container text-on-surface-variant',
                )}
              >
                {ROLE_LABELS[roleName] ?? roleName}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className="flex h-10 w-full items-center justify-center border-t border-outline text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
        aria-label={collapsed ? 'Développer' : 'Réduire'}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  )
}
