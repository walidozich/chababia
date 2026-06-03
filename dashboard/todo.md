# Chababia Admin Dashboard — Implementation Plan & Codex Handoff

> ECOHACK '26 · ODEJ Youth Opportunities Platform  
> Stack: **React 18 + Vite 6 + TypeScript strict + TanStack Table v8 + TanStack Query v5 + Tailwind 3 + shadcn/ui + Zustand 5 + react-hook-form v7 + zod v3 + date-fns v4 + recharts + sonner + lucide-react**  
> Backend: PocketBase 0.39.0 (`pocketbase` JS SDK) · dev `http://localhost:8090`  
> Design system: **Eco-Editorial Brutalism** · UI language: **French**  
> Working dir: `/run/media/walidozich/Data1/Ecohack/DEV/dashboard`

---

## ⚠️ CRITICAL CONSTRAINTS — READ BEFORE WRITING ANY CODE

### 1. NTFS mount — shadcn CLI is broken on this machine
`npx shadcn@latest add` silently skips writing files on this NTFS-mounted drive.
**NEVER run `npx shadcn@latest add`. Write ALL UI components manually using file-write tools.**
All current `src/components/ui/` files were already written manually. If you need a new shadcn component, copy the source from the shadcn/ui GitHub repo and write it manually.

### 2. TypeScript strict mode
`tsconfig.app.json` has `strict: true`, `noUncheckedIndexedAccess: true`, `noUnusedLocals: true`, `noUnusedParameters: true`.
- Every import must be used or the build fails.
- Array index access (`arr[0]`) returns `T | undefined` — always handle the undefined case.
- Never use `any`. Use `unknown` with type narrowing or exact collection types from `src/types/collections.ts`.
- After completing each phase: run `npm run build` (runs tsc + vite build). Fix ALL errors before moving on.

### 3. Tailwind color model — lime green is NOT `bg-primary`
This project uses Material Design 3 tonal tokens:
- `bg-primary` = **dark forest green #2f6c00** (use for text on lime)
- `bg-primary-container` = **lime green #9fe870** ← the brand color; use for ALL primary buttons
- `text-primary-on-container` = **dark green text on lime bg**
- `bg-surface` = off-white `#fbf9f3`
- `bg-surface-container` = very light `#eef2e6` (bento card background)
- `text-on-surface` = near-black `#191d15`
- `text-on-surface-variant` = muted gray-green
- `bg-error` = red `#ba1a1a`

**Primary button must be:** `bg-primary-container text-primary-on-container hover:bg-primary-container/90`  
**NEVER use:** `bg-primary` for buttons (renders dark green button — unreadable)

### 4. Design tokens in use
Typography: `text-display-xl`, `text-display-lg`, `text-headline-md`, `text-headline-sm`, `text-body-lg`, `text-body-md`, `text-body-sm`, `text-label-lg`, `text-label-sm`  
Spacing: `p-xs`(4px) `p-sm`(8px) `p-md`(12px) `p-lg`(16px) `p-xl`(24px) `p-2xl`(32px) `p-3xl`(48px)  
Card: `.bento-card` = `rounded-xl bg-surface-container p-xl` (defined in `src/styles/globals.css`)  
Signature radius: `rounded-xl` = 24px

### 5. Permission gate pattern
```tsx
import { can } from '@/lib/permissions'
import { DEV_ROLE, DEV_IS_ADMIN } from '@/lib/devRole'

// In every page/form:
const canWrite = can('write', 'resource_name', DEV_ROLE, DEV_IS_ADMIN)
const canDelete = can('delete', 'resource_name', DEV_ROLE, DEV_IS_ADMIN)

// Superuser-only pages (reports, users, AI history):
if (!DEV_IS_ADMIN) return <AccessDenied />
```

Resources (second arg to `can()`): `'activities'` `'establishments'` `'categories'` `'announcements'` `'newsletters'` `'documents'` `'registrations'` `'project_submissions'` `'talent_showcase'` `'content_reports'` `'users'` `'recommendation_history'`

### 6. Mock data — never call PocketBase in Phases 3–5
Import from `@/mocks` (re-exports 13 typed arrays):
```ts
import {
  MOCK_REGISTRATIONS, MOCK_ACTIVITIES, MOCK_USERS,
  MOCK_PROJECT_SUBMISSIONS, MOCK_ESTABLISHMENTS,
  MOCK_TALENT_SHOWCASE, MOCK_CONTENT_REPORTS,
  MOCK_SUGGESTIONS, MOCK_RECOMMENDATION_REQUESTS,
  MOCK_CATEGORIES,
} from '@/mocks'
```
All arrays are typed: `MOCK_REGISTRATIONS: Registration[]`, `MOCK_PROJECT_SUBMISSIONS: ProjectSubmission[]`, etc.

### 7. Hook-managed fields — NEVER send from client
In forms, exclude these fields from Zod schema and never include in `reset()` calls:
- `registrations`: `status`, `qr_code`, `user`
- `content_reports`: `reporter`, `status`
- All collections: `created_by`, `updated_by`, `id`, `created`, `updated`
- Activities/Establishments: `last_verified_at`

### 8. Route wiring — App.tsx pattern
```tsx
// 1. Add lazy import at top with other lazy imports:
const MyPage = lazy(() => import('@/pages/section/MyPage'))

// 2. Add route inside <Route element={<AppLayout />}> block:
<Route path="section" element={<P><MyPage /></P>} />
<Route path="section/new" element={<P><MyFormPage /></P>} />
<Route path="section/:id" element={<P><MyFormPage /></P>} />

// 3. Replace the ComingSoon stub for that path
```

---

## Established code patterns — copy these exactly

### List page pattern
```tsx
export default function ThingsPage() {
  const canWrite = can('write', 'things', DEV_ROLE, DEV_IS_ADMIN)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Thing | null>(null)

  const filtered = useMemo(() => {
    return MOCK_THINGS
      .filter((t) => {
        if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
        if (filterStatus !== 'all' && t.status !== filterStatus) return false
        return true
      })
      .sort((a, b) => b.created.localeCompare(a.created))
  }, [search, filterStatus])

  const columns: ColumnDef<Thing>[] = [
    { accessorKey: 'title', header: 'Titre', cell: ({ row }) => <span className="font-semibold">{row.original.title}</span> },
    { accessorKey: 'status', header: 'Statut', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { id: 'actions', header: '', cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        {canWrite && (
          <>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link to={`/things/${row.original.id}`}><Pencil className="h-3.5 w-3.5" /></Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-error hover:bg-error/10 hover:text-error"
              onClick={() => setDeleteTarget(row.original)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Choses" description={`${MOCK_THINGS.length} au total`}
        action={canWrite ? <Button asChild size="sm"><Link to="/things/new"><Plus className="h-4 w-4" />Nouveau</Link></Button> : undefined}
      />
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
            <SelectItem value="published">Publiés</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bento-card">
        {filtered.length === 0
          ? <EmptyState title="Aucun résultat" description="Modifiez les filtres." />
          : <DataTable columns={columns} data={filtered} pageSize={10} />}
      </div>
      <ConfirmDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Supprimer ?" description={`« ${deleteTarget?.title} » sera supprimée définitivement.`}
        confirmLabel="Supprimer" destructive
        onConfirm={() => { toast.success('Supprimé (mock)'); setDeleteTarget(null) }}
      />
    </div>
  )
}
```

### Form page pattern
```tsx
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="bento-card space-y-4"><h2 className="text-label-lg font-bold text-on-surface">{title}</h2><Separator />{children}</div>
}
function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
}

export default function ThingFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const canWrite = can('write', 'things', DEV_ROLE, DEV_IS_ADMIN)
  const existing = isEdit ? MOCK_THINGS.find((t) => t.id === id) : undefined

  const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', status: 'draft', ... },
  })

  useEffect(() => {
    if (existing) reset({ title: existing.title, status: existing.status, ... })
  }, [existing, reset])

  function onSubmit(data: FormValues) {
    toast.success(isEdit ? 'Mis à jour (mock)' : 'Créé (mock)', { description: data.title })
    navigate('/things')
  }

  if (isEdit && !existing) return (
    <div className="bento-card text-center py-12">
      <p className="text-on-surface-variant">Introuvable.</p>
      <Button asChild variant="outline" size="sm" className="mt-4"><Link to="/things">Retour</Link></Button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader title={isEdit ? 'Modifier' : 'Nouveau'}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild><Link to="/things"><ArrowLeft className="h-4 w-4" />Retour</Link></Button>
            {canWrite && <Button type="submit" size="sm" disabled={!isDirty && isEdit}><Save className="h-4 w-4" />{isEdit ? 'Enregistrer' : 'Créer'}</Button>}
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 space-y-4">
          {/* SectionCard sections here */}
        </div>
        <div>
          <SectionCard title="Publication">
            {/* status Select + save Button */}
            {canWrite && <Button type="submit" className="w-full" disabled={!isDirty && isEdit}><Save className="h-4 w-4" />{isEdit ? 'Enregistrer' : 'Créer'}</Button>}
          </SectionCard>
          {isEdit && existing && (
            <div className="bento-card mt-4 space-y-2 text-xs text-on-surface-variant">
              <p><span className="font-semibold">Créé le</span> {new Date(existing.created).toLocaleDateString('fr-FR')}</p>
              <p><span className="font-semibold">Modifié le</span> {new Date(existing.updated).toLocaleDateString('fr-FR')}</p>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
```

### Controller pattern for Select
```tsx
<Controller control={control} name="status" render={({ field }) => (
  <Select value={field.value} onValueChange={field.onChange} disabled={!canWrite}>
    <SelectTrigger><SelectValue /></SelectTrigger>
    <SelectContent>
      <SelectItem value="draft">Brouillon</SelectItem>
      <SelectItem value="published">Publié</SelectItem>
    </SelectContent>
  </Select>
)} />
```

### Controller pattern for Checkbox
```tsx
<Controller control={control} name="is_free" render={({ field }) => (
  <Checkbox id="is_free" checked={field.value} onCheckedChange={field.onChange} />
)} />
<Label htmlFor="is_free">Gratuit</Label>
```

### Status-only mutation toast (no form, action button)
```tsx
function handleStatusChange(item: Thing, newStatus: ThingStatus) {
  toast.success(`Statut mis à jour : ${newStatus} (mock)`, { description: item.title })
}
```

---

## Phase 0 — Project scaffold & tooling ✓ DONE
## Phase 1 — Foundation: app shell & shared primitives ✓ DONE
## Phase 2 — Core content management UI (static fixtures) ✓ DONE

> Phases 0–2 are complete. All routes for activities, establishments, categories, announcements, newsletters, documents are wired and working. Shared primitives (DataTable, PageHeader, StatusBadge, FormField, FileUpload, LanguageTabs, ConfirmDialog, EmptyState, ErrorState, LoadingSkeletons) are all built. Home page has 4 KPI cards + 5 recharts charts.

---

## Phase 3 — Engagement & moderation UI (static fixtures) ✓ DONE

> Same rule as Phase 2: typed mock data only. No PocketBase calls.  
> After completing Phase 3: run `npm run build` — fix all TS errors before Phase 4.

### 3a · Registrations / Attendance

**File to create:** `src/pages/registrations/RegistrationsPage.tsx`

**What it does:** Show all registrations grouped by activity. Allow filtering + CSV export. `attendance_staff` workflow: "Marquer présent" button that calls `toast.success('Pointage enregistré (mock)')`.

**Imports needed:**
```tsx
import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Download, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { MOCK_REGISTRATIONS, MOCK_ACTIVITIES } from '@/mocks'
import type { Registration } from '@/types/collections'
import { can } from '@/lib/permissions'
import { DEV_ROLE, DEV_IS_ADMIN } from '@/lib/devRole'
```

**Fields to show in table:** full_name, email, phone, linked activity title (resolve via `MOCK_ACTIVITIES.find(a => a.id === row.activity)?.title`), status badge, checked_in_at (format or "—"), actions.

**Filters:** search (name/email), filterActivity (select from unique activity IDs, show title), filterStatus (all/registered/waiting_list/attended/cancelled).

**"Marquer présent" button:** Only show when `status === 'registered'` and `can('write', 'registrations', DEV_ROLE, DEV_IS_ADMIN)`. On click: `toast.success('Pointage enregistré (mock)', { description: row.full_name })`.

**CSV export:**
```tsx
function exportCSV(rows: Registration[]) {
  const header = 'Nom,Email,Téléphone,Statut,Pointage'
  const lines = rows.map((r) =>
    [r.full_name, r.email, r.phone, r.status, r.checked_in_at || ''].join(',')
  )
  const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'inscriptions.csv'
  a.click()
  URL.revokeObjectURL(url)
}
```
Add "Exporter CSV" button in PageHeader action slot (always visible regardless of canWrite).

**Capacity indicator:** Above the table, show a `<div className="bento-card">` with per-activity stats: "X inscrits / Y capacité · Z en liste d'attente". Derive from MOCK_REGISTRATIONS grouped by activity_id, join with MOCK_ACTIVITIES for capacity.

**App.tsx route wiring:**
```tsx
// Replace: <Route path="registrations" element={<ComingSoon label="Inscriptions" />} />
// With:
const RegistrationsPage = lazy(() => import('@/pages/registrations/RegistrationsPage'))
<Route path="registrations" element={<P><RegistrationsPage /></P>} />
```

---

### 3b · Project submissions

**Files to create:**
- `src/pages/projects/ProjectsPage.tsx` — list + filters
- `src/pages/projects/ProjectDetailPage.tsx` — detail + status workflow

**ProjectsPage.tsx imports:**
```tsx
import { MOCK_PROJECT_SUBMISSIONS, MOCK_ESTABLISHMENTS, MOCK_USERS } from '@/mocks'
import type { ProjectSubmission } from '@/types/collections'
```

**Columns:** project_title, category (StatusBadge), commune/wilaya, status (StatusBadge), link to detail, created date.

**Filters:** search (title/commune), filterStatus (all/submitted/reviewed/accepted/rejected/needs_more_info).

**Default sort:** `-created` (newest first) — use `.sort((a, b) => b.created.localeCompare(a.created))`.

**Row action:** View button → `/projects/:id` (no edit, only status workflow in detail).

**ProjectDetailPage.tsx:** Full read-only view of submission fields + status workflow panel.

Layout: same `lg:grid-cols-3` pattern. Left `col-span-2`: read-only SectionCards showing all fields. Right: SectionCard "Décision" with:
- current status badge
- 5 action buttons (only relevant ones based on current status):
  - `submitted` → show "Marquer examiné", "Accepter", "Rejeter", "Infos manquantes"
  - `reviewed` → show "Accepter", "Rejeter", "Infos manquantes"
  - terminal states (accepted/rejected) → show "Archiver" only
- `assigned_mentor` Input field (free text, `canWrite` gated)
- On each action button: `toast.success('Statut mis à jour : X (mock)')`

**Expand mocks inline:**
```tsx
const user = MOCK_USERS.find((u) => u.id === submission.user)
const establishment = MOCK_ESTABLISHMENTS.find((e) => e.id === submission.establishment)
```

**Schema for types:**
```tsx
// ProjectSubmission has: user, establishment, project_title, category (InterestCategory),
// commune, short_description, needed_support, contact_phone, optional_document, status, assigned_mentor
```

**App.tsx route wiring:**
```tsx
const ProjectsPage = lazy(() => import('@/pages/projects/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('@/pages/projects/ProjectDetailPage'))
// Replace stub:
<Route path="projects" element={<P><ProjectsPage /></P>} />
<Route path="projects/:id" element={<P><ProjectDetailPage /></P>} />
```

---

### 3c · Talent showcase

**File to create:** `src/pages/talent/TalentPage.tsx`

**Imports:**
```tsx
import { MOCK_TALENT_SHOWCASE, MOCK_USERS } from '@/mocks'
import type { TalentShowcase } from '@/types/collections'
// TalentStatus = 'draft' | 'published' | 'rejected'
```

**Columns:** title, category (text, not badge), user name (resolve via MOCK_USERS), media (small ImageThumb or "—"), external_link (truncated link or "—"), status badge, action buttons.

**Filters:** search (title), filterStatus (all/draft/published/rejected).

**Default filter:** `filterStatus = 'draft'` (moderation queue view).

**Action buttons (canWrite gated):**
- "Publier" → `toast.success('Vitrine publiée (mock)')` — only when `status === 'draft'`
- "Rejeter" → `toast.success('Vitrine rejetée (mock)')` — only when `status === 'draft'`
- "Archiver" → `toast.success('Vitrine archivée (mock)')` — only when `status === 'published'`

Use small icon+label buttons in actions column:
```tsx
<Button variant="outline" size="sm" className="h-7 text-xs" onClick={...}>
  <Check className="h-3 w-3" />Publier
</Button>
```

**Import:** `ImageThumb` from `@/components/shared/ImageThumb`

**App.tsx route wiring:**
```tsx
const TalentPage = lazy(() => import('@/pages/talent/TalentPage'))
// Replace stub:
<Route path="talent" element={<P><TalentPage /></P>} />
```

---

### 3d · Content reports *(superuser only — check `DEV_IS_ADMIN` at page top)*

**File to create:** `src/pages/reports/ReportsPage.tsx`

**Guard at top of component:**
```tsx
if (!DEV_IS_ADMIN) {
  return (
    <div className="bento-card py-16 text-center">
      <p className="text-label-lg font-bold text-error">Accès réservé aux superadmins.</p>
    </div>
  )
}
```

**Imports:**
```tsx
import { MOCK_CONTENT_REPORTS, MOCK_USERS, MOCK_ACTIVITIES, MOCK_ESTABLISHMENTS, MOCK_ANNOUNCEMENTS, MOCK_NEWSLETTERS, MOCK_DOCUMENTS } from '@/mocks'
import type { ContentReport } from '@/types/collections'
// ReportStatus = 'new' | 'reviewed' | 'resolved' | 'dismissed'
// ReportTargetType = 'activity' | 'establishment' | 'announcement' | 'newsletter' | 'document'
// ReportReason = 'outdated_info' | 'wrong_contact' | 'cancelled' | 'wrong_location' | 'other'
```

**Columns:** reporter name (resolve via `MOCK_USERS.find(u => u.id === r.reporter)?.full_name ?? 'Inconnu'`), target_type (badge), reason (human label — map below), details (truncated 80 chars), status badge, created date, action buttons.

**Reason labels map:**
```tsx
const REASON_LABELS: Record<string, string> = {
  outdated_info: 'Info obsolète', wrong_contact: 'Contact erroné',
  cancelled: 'Activité annulée', wrong_location: 'Mauvais lieu', other: 'Autre',
}
```

**Target type labels map:**
```tsx
const TARGET_LABELS: Record<string, string> = {
  activity: 'Activité', establishment: 'Établissement',
  announcement: 'Annonce', newsletter: 'Newsletter', document: 'Document',
}
```

**Resolve target preview inline:**
```tsx
function resolveTarget(report: ContentReport): string {
  switch (report.target_type) {
    case 'activity': return MOCK_ACTIVITIES.find((a) => a.id === report.target_id)?.title ?? report.target_id
    case 'establishment': return MOCK_ESTABLISHMENTS.find((e) => e.id === report.target_id)?.name ?? report.target_id
    case 'announcement': return MOCK_ANNOUNCEMENTS.find((a) => a.id === report.target_id)?.title ?? report.target_id
    case 'newsletter': return MOCK_NEWSLETTERS.find((n) => n.id === report.target_id)?.title ?? report.target_id
    case 'document': return MOCK_DOCUMENTS.find((d) => d.id === report.target_id)?.title ?? report.target_id
    default: return report.target_id
  }
}
```

**Filters:** search (details text), filterStatus (all/new/reviewed/resolved/dismissed), filterTargetType (all/activity/establishment/announcement/newsletter/document).

**Default filter:** `filterStatus = 'new'`.

**Action buttons (3) per row — only for `status === 'new'` or `'reviewed'`:**
- "Résolu" → `toast.success('Signalement résolu (mock)')`
- "Ignoré" → `toast.success('Signalement ignoré (mock)')`
- "Marquer examiné" → `toast.success('Signalement examiné (mock)')`

**App.tsx route wiring:**
```tsx
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'))
// Replace stub:
<Route path="reports" element={<P><ReportsPage /></P>} />
```

---

## Phase 4 — AI recommendations & user management UI (static fixtures) ✓ DONE

> Superuser-only screens. Guard both with `DEV_IS_ADMIN` check at page top.  
> After completing Phase 4: run `npm run build` — 0 errors required.

### 4a · AI Recommendations

**File to create:** `src/pages/recommendations/RecommendationsPage.tsx`

**Superuser guard** — same pattern as ReportsPage above.

**Imports:**
```tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Sparkles, Clock, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { FormField } from '@/components/shared/FormField'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { MOCK_SUGGESTIONS, MOCK_RECOMMENDATION_REQUESTS, MOCK_USERS } from '@/mocks'
import type { Suggestion, RecommendationRequest } from '@/types/collections'
import { DEV_IS_ADMIN } from '@/lib/devRole'
import { useNavigate } from 'react-router-dom'
```

**Layout:** Two sections stacked vertically:
1. **Request form + results** (bento-card)
2. **History table** (bento-card, superuser only)

**Form schema:**
```tsx
const schema = z.object({
  commune: z.string().min(2, 'Commune requise'),
  wilaya: z.string().min(2, 'Wilaya requise'),
  establishment_type: z.string().default(''),
})
type FormValues = z.infer<typeof schema>
```

**Form submission (mock):**
```tsx
const [results, setResults] = useState<Suggestion[] | null>(null)
const [isLoading, setIsLoading] = useState(false)
const [apiError, setApiError] = useState<'429' | '403' | '502' | null>(null)

function onSubmit(_data: FormValues) {
  setIsLoading(true)
  setApiError(null)
  // Simulate async — use setTimeout 800ms then:
  setTimeout(() => {
    setResults(MOCK_SUGGESTIONS)
    setIsLoading(false)
    toast.success('Suggestions générées (mock)')
  }, 800)
}
```

**Error state rendering:**
```tsx
{apiError === '429' && (
  <div className="bento-card border border-error/30 bg-error/5 flex items-start gap-3">
    <AlertTriangle className="h-5 w-5 text-error shrink-0 mt-0.5" />
    <div>
      <p className="font-semibold text-error">Limite atteinte</p>
      <p className="text-body-sm text-on-surface-variant">10 requêtes par compte (limite lifetime). Contactez un superadmin.</p>
    </div>
  </div>
)}
```

**Suggestion card (per suggestion in results):**
```tsx
<div className="bento-card space-y-3" key={i}>
  <div className="flex items-start justify-between gap-2">
    <div>
      <p className="font-bold text-on-surface">{s.title}</p>
      <p className="text-body-sm text-on-surface-variant mt-1">{s.short_description}</p>
    </div>
    <span className="rounded-full bg-primary-container/30 px-2 py-0.5 text-xs font-semibold text-primary">BROUILLON</span>
  </div>
  <div className="flex flex-wrap gap-2 text-xs text-on-surface-variant">
    <span>{s.category}</span>
    <StatusBadge status={s.activity_mode} />
    <span>{s.age_min}–{s.age_max} ans</span>
    {s.is_free && <span className="text-primary font-semibold">Gratuit</span>}
    <span>{s.estimated_duration}</span>
  </div>
  <Button size="sm" variant="outline" onClick={() => handleCreateDraft(s)}>
    Créer un brouillon
  </Button>
</div>
```

**handleCreateDraft:** Navigate to `/activities/new` with state. The ActivityFormPage doesn't need changes — in Phase 6 this becomes a proper pre-fill. For now:
```tsx
const navigate = useNavigate()
function handleCreateDraft(s: Suggestion) {
  toast.success('Naviguez vers "Nouvelle activité" pour créer ce brouillon', {
    description: s.title,
    action: { label: 'Créer', onClick: () => navigate('/activities/new') },
  })
}
```

**History table (MOCK_RECOMMENDATION_REQUESTS):**
```tsx
// Columns: commune, wilaya, status badge, admin_user name (resolve), created date, view JSON action
// "Voir suggestions" button: toast showing suggestions_json truncated — no modal needed
const columns: ColumnDef<RecommendationRequest>[] = [
  { accessorKey: 'commune', header: 'Commune' },
  { accessorKey: 'wilaya', header: 'Wilaya' },
  { accessorKey: 'status', header: 'Statut', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  { id: 'admin', header: 'Admin', cell: ({ row }) => MOCK_USERS.find(u => u.id === row.original.admin_user)?.full_name ?? '—' },
  { accessorKey: 'created', header: 'Date', cell: ({ row }) => format(new Date(row.original.created), 'd MMM yyyy', { locale: fr }) },
  { id: 'actions', header: '', cell: ({ row }) => (
    <Button variant="ghost" size="sm" onClick={() => toast.info('Suggestions', { description: row.original.suggestions_json.slice(0, 100) + '...' })}>
      Voir JSON
    </Button>
  )},
]
```

**App.tsx route wiring:**
```tsx
const RecommendationsPage = lazy(() => import('@/pages/recommendations/RecommendationsPage'))
// Replace stub:
<Route path="recommendations" element={<P><RecommendationsPage /></P>} />
```

---

### 4b · User management

**Files to create:**
- `src/pages/users/UsersPage.tsx` — list + filters
- `src/pages/users/UserFormPage.tsx` — create/edit form

**Superuser guard** on BOTH files.

**UsersPage.tsx imports:**
```tsx
import { MOCK_USERS } from '@/mocks'
import type { User } from '@/types/collections'
// Role = 'youth' | 'super_admin' | 'wilaya_admin' | 'establishment_manager' | 'content_editor' | 'attendance_staff'
```

**Columns:** full_name (+ email below in muted text), role badge, commune/wilaya, verified (✓ icon or ✗), preferred_language, actions (edit).

**Role label map:**
```tsx
const ROLE_LABELS: Record<string, string> = {
  youth: 'Jeune', super_admin: 'Super Admin', wilaya_admin: 'Admin Wilaya',
  establishment_manager: 'Gestion Étab.', content_editor: 'Éditeur', attendance_staff: 'Pointage',
}
```

**Filters:** search (name/email), filterRole (all + 6 role values), filterWilaya (dynamic from data).

**Password reset button** in row actions:
```tsx
<Button variant="ghost" size="icon" className="h-8 w-8" title="Réinitialiser mot de passe"
  onClick={() => toast.success('Email de réinitialisation envoyé (mock)', { description: user.email })}>
  <KeyRound className="h-3.5 w-3.5" />
</Button>
```

**UserFormPage.tsx schema:**
```tsx
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
```

**Interests multi-select** — use a series of Checkbox + Label pairs in a 3-column grid. The 15 InterestCategory values:
`'Sports' | 'Culture' | 'Training' | 'Volunteering' | 'Health Awareness' | 'Science' | 'Arts' | 'Environment' | 'Youth Orientation' | 'Camps and Trips' | 'Coding' | 'Design' | 'Robotics' | 'Photography' | 'Debate'`

```tsx
// interests field: z.array(z.string()).default([])
// In form, store as string[] in Controller:
<Controller control={control} name="interests" render={({ field }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {INTEREST_CATEGORIES.map((cat) => (
      <div key={cat} className="flex items-center gap-2">
        <Checkbox id={`int-${cat}`}
          checked={field.value.includes(cat)}
          onCheckedChange={(checked) => {
            if (checked) field.onChange([...field.value, cat])
            else field.onChange(field.value.filter((v: string) => v !== cat))
          }}
        />
        <Label htmlFor={`int-${cat}`} className="text-xs">{cat}</Label>
      </div>
    ))}
  </div>
)} />
```

**Form sections:** 1 · Identité (full_name, email, phone, role) · 2 · Localisation (commune, wilaya, preferred_language) · 3 · Centres d'intérêt (interests checkboxes) · Sidebar: verified toggle + save

**App.tsx route wiring:**
```tsx
const UsersPage = lazy(() => import('@/pages/users/UsersPage'))
const UserFormPage = lazy(() => import('@/pages/users/UserFormPage'))
// Replace stub:
<Route path="users" element={<P><UsersPage /></P>} />
<Route path="users/new" element={<P><UserFormPage /></P>} />
<Route path="users/:id" element={<P><UserFormPage /></P>} />
```

---

## Phase 5 — Dashboard home polish + eco audit ✓ DONE

> Update existing files only. No new page files.  
> After completing Phase 5: run `npm run build` — 0 errors required.

### 5a · Home page enhancements

**File to update:** `src/pages/HomePage.tsx`

KPI cards already use mock counts from the existing arrays. Verify these counts are accurate:
```tsx
// Should already be present — if not, add:
const publishedActivities = MOCK_ACTIVITIES.filter((a) => a.status === 'published').length
const activeEstablishments = MOCK_ESTABLISHMENTS.filter((e) => e.status === 'published').length
const totalRegistrations = MOCK_REGISTRATIONS.length
const openReports = DEV_IS_ADMIN ? MOCK_CONTENT_REPORTS.filter((r) => r.status === 'new').length : null
const pendingProjects = MOCK_PROJECT_SUBMISSIONS.filter((p) => p.status === 'submitted').length
```

Add a 5th KPI card for pending projects (visible to all admins, not just superuser):
```tsx
<div className="bento-card">
  <p className="text-body-sm text-on-surface-variant">Projets en attente</p>
  <p className="text-display-lg font-black text-tertiary">{pendingProjects}</p>
  <Link to="/projects" className="text-label-sm text-primary hover:underline">Voir les soumissions →</Link>
</div>
```

Quick actions panel — add links for Phase 3 pages:
```tsx
// Add to quick-action list:
{ label: 'Pointage activité', href: '/registrations', icon: UserCheck }
{ label: 'Projets à traiter', href: '/projects', icon: FolderOpen }
// Keep existing: Créer une activité, Rédiger une annonce, Voir les signalements
```

### 5b · French strings audit

Check every page for:
- All toast messages in French ending with " (mock)"
- All empty state titles/descriptions in French
- All confirm dialog titles/descriptions in French
- All placeholder text in French
- All `<option>` / SelectItem labels in French (use the label maps defined above)

### 5c · `last_verified_at` display

On **ActivitiesPage**, **EstablishmentsPage**, **AnnouncementsPage** — add a column or row indicator:
```tsx
function VerifiedIndicator({ date }: { date: string }) {
  if (!date) return <span className="text-xs text-on-surface-variant/50">Non vérifié</span>
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
  if (days > 30) return <span className="text-xs text-error">Vérifié il y a {days}j ⚠</span>
  return <span className="text-xs text-on-surface-variant">Vérifié il y a {days}j</span>
}
```

### 5d · Eco audit checklist

- [x] Verify all `DataTable` calls pass `pageSize={10}` or `pageSize={8}` — never load all rows without pagination
- [x] Verify `React.lazy` is used for ALL page components in App.tsx (already done for Phase 1–2 pages; extend to Phase 3–4 pages)
- [x] Verify no inline `require()` or dynamic imports outside of lazy boundaries
- [x] In `tailwind.config.ts` → `content` array must include `'./src/**/*.{ts,tsx}'` (already set)
- [x] No `console.log` in production code (remove any debug logs added during development)
- [ ] Lighthouse: run `npm run build && npm run preview` then open Lighthouse. Target: Performance ≥ 85, Best Practices ≥ 90 (not run in Codex session: no browser/Lighthouse environment)

---

## Phase 6 — Auth & PocketBase integration

> The UI is validated. This phase swaps every mock import for real PocketBase queries.  
> Component props stay identical — only the data source changes.

### 6a · Login page ✓ DONE

**File to create:** `src/pages/auth/LoginPage.tsx`

**Replace** the `<Route path="/login" element={<ComingSoon label="Connexion" />} />` in App.tsx.

```tsx
// Dual-auth flow:
async function onSubmit({ email, password }: { email: string; password: string }) {
  try {
    // Try superuser first
    await pb.admins.authWithPassword(email, password)
    authStore.setAuth({ isAdmin: true, role: 'super_admin', userId: pb.authStore.record?.id ?? '', userName: email })
  } catch {
    try {
      // Fall back to regular user
      const record = await pb.collection('users').authWithPassword(email, password)
      authStore.setAuth({ isAdmin: false, role: record.role as Role, userId: record.id, userName: record.full_name })
    } catch {
      toast.error('Identifiants incorrects')
      return
    }
  }
  navigate('/')
}
```

**App boot guard** — wrap `<AppLayout />` route:
```tsx
// src/components/layout/AuthGuard.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pb } from '@/lib/pb'
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  useEffect(() => {
    if (!pb.authStore.isValid) navigate('/login', { replace: true })
    else pb.collection('users').authRefresh().catch(() => { pb.authStore.clear(); navigate('/login', { replace: true }) })
  }, [navigate])
  if (!pb.authStore.isValid) return null
  return <>{children}</>
}
```

### 6b · Replace DEV_ROLE with real auth ✓ DONE

After login page works, replace all `DEV_ROLE` / `DEV_IS_ADMIN` usages:

1. In `src/lib/devRole.ts` — delete the file entirely
2. In every page component — replace:
   ```tsx
   // Before:
   import { DEV_ROLE, DEV_IS_ADMIN } from '@/lib/devRole'
   const canWrite = can('write', 'things', DEV_ROLE, DEV_IS_ADMIN)
   // After:
   import { useAuthStore } from '@/stores/authStore'
   const { role, isAdmin } = useAuthStore()
   const canWrite = can('write', 'things', role, isAdmin)
   ```
3. In Sidebar.tsx — same swap for nav item visibility

### 6c · Data source swap — query pattern ✓ DONE

Implemented with `src/lib/pbData.ts` shared helpers:
- typed `getFullList` / `getOne` / create / update / delete wrappers
- stable query keys via `qk`
- dataURL file conversion for PB `FormData`
- server-managed field scrubbing for mutation payloads
- PB file URL resolution for thumbnails/previews

All visible mock imports were removed from pages/components. Reports and project/talent archive actions respect current schema/server-hook limits instead of sending invalid client-managed statuses.

For each collection, replace the mock import with a useQuery call:

```tsx
// BEFORE (Phase 2-5):
import { MOCK_ACTIVITIES } from '@/mocks'
const filtered = useMemo(() => MOCK_ACTIVITIES.filter(...), [search, filterStatus])

// AFTER (Phase 6):
import { useQuery } from '@tanstack/react-query'
import { pb } from '@/lib/pb'
import { STALE } from '@/lib/staleTimes'

const { data, isLoading, error } = useQuery({
  queryKey: ['activities', { search, filterStatus, filterMode }],
  queryFn: () => pb.collection('activities').getList(1, 30, {
    filter: pb.filter(
      'status = {:s} && title ~ {:q}',
      { s: filterStatus === 'all' ? undefined : filterStatus, q: search }
    ),
    sort: 'start_datetime',
    fields: 'id,title,status,activity_mode,commune,wilaya,start_datetime,category',
  }),
  staleTime: STALE.activities,
})
const filtered = data?.items ?? []
```

**staleTime values from `src/lib/staleTimes.ts`:**
- categories, documents: `7 * 24 * 60 * 60 * 1000` (7 days)
- establishments, translations: `24 * 60 * 60 * 1000` (1 day)
- activities: `30 * 60 * 1000` (30 min)
- announcements, newsletters: `10 * 60 * 1000` (10 min)
- talent_showcase, registrations: `0` (always fresh)

**Create/update mutation pattern:**
```tsx
const mutation = useMutation({
  mutationFn: (data: FormValues) =>
    isEdit
      ? pb.collection('activities').update(id!, data)
      : pb.collection('activities').create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['activities'] })
    toast.success(isEdit ? 'Activité mise à jour' : 'Activité créée')
    navigate('/activities')
  },
  onError: (err) => {
    const e = err as ClientResponseError
    toast.error('Erreur', { description: e.message })
  },
})
```

**File upload in Phase 6:**
```tsx
// In create/update mutation — when field contains a dataURL:
function buildFormData(data: FormValues): FormData {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => {
    if (typeof v === 'string' && v.startsWith('data:')) {
      const [header, b64] = v.split(',')
      const mime = header.match(/:(.*?);/)?.[1] ?? 'application/octet-stream'
      const bytes = atob(b64 ?? '')
      const arr = new Uint8Array(bytes.length)
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
      fd.append(k, new Blob([arr], { type: mime }), `${k}.${mime.split('/')[1]}`)
    } else if (v !== undefined && v !== null) {
      fd.append(k, String(v))
    }
  })
  return fd
}
```

**ImageThumb in Phase 6:**
```tsx
// Replace placeholder URLs:
// BEFORE: <img src={record.image} />
// AFTER:
import { pb } from '@/lib/pb'
<img src={record.image ? pb.files.getURL(record, record.image, { thumb: '400x0' }) : ''} />
```

**AI endpoint in Phase 6:**
```tsx
const response = await pb.send('/api/admin/event-recommendations', {
  method: 'POST',
  body: JSON.stringify({ commune, wilaya, establishment_type }),
})
// Handle errors:
// 429 → "Limite atteinte (10 requêtes par compte)"
// 403 → "Accès refusé"
// 501/502 → "Service IA indisponible"
```

---

## Phase 7 — Build, QA, deploy

- [ ] `npm run typecheck` → 0 errors
- [ ] `npm run lint` → 0 warnings (or all acknowledged)
- [ ] `npm run build` → clean build, check bundle size with `npx vite-bundle-analyzer dist/stats.html`
- [ ] Full manual QA against local PocketBase (`./pocketbase serve --dev`, superuser `admin@chababia.dz`):
  - Superuser login → can access reports, users, AI history
  - `content_editor` → can create/edit announcements, newsletters, documents; cannot access activities or users; reports queue hidden
  - `establishment_manager` → can create/edit activities + establishments; content menu restricted
  - `attendance_staff` → only registrations/attendance screen visible; all other sections hidden by `can()` gate in Sidebar
- [ ] CORS: confirm `http://localhost:5173` (and prod domain) in PocketBase allowed origins
- [ ] Deploy as static site (Netlify/Vercel/Nginx); `VITE_PB_URL=https://api.chababia.dz`
- [ ] Post-deploy: test auth, create 1 activity, check it appears in list

---

## Build order

```
Phase 0  Scaffold                                              ✓ DONE
Phase 1  App shell + shared primitives + mocks setup           ✓ DONE
Phase 2  Content management UI (activities, estab, cat, etc.)  ✓ DONE
Phase 3  Engagement & moderation UI (registrations, projects, talent, reports) ✓ DONE
Phase 4  AI recommendations + User management                      ✓ DONE
Phase 5  Home polish + eco audit                                 ✓ DONE
Phase 6  Auth login page + PocketBase integration (swap all mocks)
Phase 7  Build + QA + deploy
```

---

## Global conventions — enforced in all code

| Rule | Detail |
|---|---|
| **Lime green = `bg-primary-container`** | NEVER `bg-primary` for buttons. `bg-primary` = dark forest green #2f6c00. Lime = `bg-primary-container` (#9fe870) + `text-primary-on-container`. |
| **Mock data typed** | `const MOCK_X: X[] = [...]`. Never `any`. Enum values exact. |
| **Component props typed** | `items: Activity[]` not `items: unknown[]`. Zero-diff Phase 6 swap. |
| **DEV_ROLE** | Always `'super_admin'`. Never commit other values. Deleted in Phase 6. |
| **No hook fields in forms** | Never include `created_by`, `updated_by`, `id`, `created`, `updated`, `last_verified_at`, `registrations.{status,qr_code,user}`, `content_reports.{reporter,status}` in Zod schema or `reset()`. |
| **Numeric inputs** | Use `z.coerce.number()` for any `<Input type="number" />` binding. |
| **All UI strings in French** | Labels, placeholders, toasts, empty states, confirm dialogs. Only content fields use `dir="auto"` for ar/tzm. |
| **`(mock)` suffix on toasts** | Every `toast.success/error` in Phases 2–5 ends with `(mock)`. Remove in Phase 6. |
| **PocketBase filter** | Always `pb.filter('x = {:v}', { v })`. Never template literals. |
| **Pagination** | `getList(page, 30)`. Never `getFullList` except for CSV export. |
| **List payloads** | `fields=` param on all list queries. Full record only on detail/edit. |
| **Relations** | `expand=` in one call. Never secondary fetches. |
| **Superuser gate** | Reports + Users + AI history: check `isAdmin` (DEV_IS_ADMIN in Phases 3–5, real `authStore.isAdmin` in Phase 6). |
| **Build after each phase** | `npm run build` must produce 0 TS errors before starting next phase. |
