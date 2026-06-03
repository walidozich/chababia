import { Globe, Info, Palette, Shield, PanelLeftClose, PanelLeftOpen, List } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore } from '@/stores/authStore'
import { useSidebarStore } from '@/stores/sidebarStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { ChababiaLogo } from '@/components/shared/ChababiaLogo'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bento-card space-y-4">
      <h2 className="text-label-lg font-bold text-on-surface">{title}</h2>
      <Separator />
      {children}
    </div>
  )
}

function SettingRow({ icon: Icon, label, note, children }: { icon: React.ElementType; label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-surface p-3">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-on-surface-variant" />
        <div>
          <p className="text-label-sm font-semibold text-on-surface">{label}</p>
          {note && <p className="text-xs text-on-surface-variant">{note}</p>}
        </div>
      </div>
      <div className="shrink-0">
        {children}
      </div>
    </div>
  )
}

function StaticRow({ icon: Icon, label, value, note }: { icon: React.ElementType; label: string; value: string; note?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-surface p-3">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-on-surface-variant" />
        <div>
          <p className="text-label-sm font-semibold text-on-surface">{label}</p>
          {note && <p className="text-xs text-on-surface-variant">{note}</p>}
        </div>
      </div>
      <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-on-surface">
        {value}
      </span>
    </div>
  )
}

export default function SettingsPage() {
  const { role, isAdmin } = useAuthStore()
  const { collapsed, setCollapsed } = useSidebarStore()
  const { pageSize, setPageSize } = usePreferencesStore()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paramètres"
        description="Configuration de l'interface d'administration"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <SectionCard title="Interface">
            <SettingRow
              icon={Globe}
              label="Langue de l'interface"
              note="Langue utilisée pour tous les menus et labels"
            >
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-on-surface">
                Français
              </span>
            </SettingRow>

            <SettingRow
              icon={Palette}
              label="Thème"
              note="Vert lime · Police Outfit · Bento grid"
            >
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-on-surface">
                Eco-Editorial Brutalism
              </span>
            </SettingRow>

            <SettingRow
              icon={collapsed ? PanelLeftOpen : PanelLeftClose}
              label="Barre latérale"
              note={collapsed ? 'Actuellement réduite — cliquez pour développer' : 'Actuellement développée — cliquez pour réduire'}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setCollapsed(!collapsed) }}
              >
                {collapsed ? (
                  <>
                    <PanelLeftOpen className="h-3.5 w-3.5" />
                    Développer
                  </>
                ) : (
                  <>
                    <PanelLeftClose className="h-3.5 w-3.5" />
                    Réduire
                  </>
                )}
              </Button>
            </SettingRow>

            <SettingRow
              icon={List}
              label="Éléments par page (défaut)"
              note="Appliqué aux nouvelles sessions de tableaux"
            >
              <Select
                value={String(pageSize)}
                onValueChange={(v) => { setPageSize(Number(v) as 10 | 25 | 50) }}
              >
                <SelectTrigger className="h-8 w-24 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </SectionCard>

          <SectionCard title="Sécurité">
            <StaticRow
              icon={Shield}
              label="Mode d'authentification"
              value={isAdmin ? 'Superadmin PocketBase' : 'Utilisateur dashboard'}
              note="Défini lors de la connexion — immuable en session"
            />
            <StaticRow
              icon={Shield}
              label="Rôle actif"
              value={isAdmin ? 'super_admin' : (role ?? 'non défini')}
              note="Contrôle les accès en lecture et écriture"
            />
          </SectionCard>

          <SectionCard title="À propos de la plateforme">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center">
                <ChababiaLogo className="h-10 w-auto text-primary-container" />
              </div>
              <div className="space-y-1">
                <p className="text-label-lg font-extrabold text-on-surface">Chababia</p>
                <p className="text-body-sm text-on-surface-variant">
                  Plateforme de gestion des opportunités jeunesse — ODEJ Algérie
                </p>
                <p className="text-xs text-on-surface-variant/60">ECOHACK '26 · PocketBase 0.39 · React 18</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: 'Backend', value: 'PocketBase 0.39' },
                { label: 'Frontend', value: 'React + Vite 6' },
                { label: 'Base URL', value: import.meta.env.VITE_PB_URL as string ?? 'non défini' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-surface p-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{item.label}</p>
                  <p className="mt-0.5 truncate text-label-sm font-semibold text-on-surface">{item.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div>
          <SectionCard title="Info système">
            <div className="space-y-2 text-xs text-on-surface-variant">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <p>Les préférences d'interface sont sauvegardées localement dans le navigateur.</p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <p>Pour modifier les règles d'accès et les collections, rendez-vous dans l'interface PocketBase Admin.</p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <p>Les paramètres de langue et de thème seront configurables par utilisateur dans une prochaine version.</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
