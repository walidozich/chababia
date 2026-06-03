# Chababia Admin Dashboard — Implementation Plan

> ECOHACK '26 · ODEJ Youth Opportunities Platform  
> Stack: **React + Vite + TypeScript + TanStack Query + Tailwind + shadcn/ui**  
> Backend: PocketBase 0.39.0 (`pocketbase` JS SDK) · dev `http://localhost:8090`  
> Design system: **Eco-Editorial Brutalism** (see `Design.md`) · UI language: **French**

---

## Resolved: open questions

- [x] **Write permissions.** Migration `1748700014_dashboard_write_rules.js` adds role-scoped write rules. `content_editor / wilaya_admin / super_admin` → create/update announcements, newsletters, documents, talent_showcase. `establishment_manager / wilaya_admin / super_admin` → create/update activities and establishments. Any non-youth authenticated user → write translations. PocketBase returns **HTTP 400** (not 403) on a blocked createRule — handle all non-200 generically.
- [x] **Design system.** No mobile `design.md`. Using the repo's own `Design.md`: **Eco-Editorial Brutalism** — Outfit font, primary `#9fe870` (lime green), off-white `#fbf9f3` surface, Bento-grid layout, 4px rhythm, `rounded-xl` (24px) as the signature radius. Details encoded in Phase 1.
- [x] **Prod base URL / CORS.** Prod: `https://api.chababia.dz`. Dev: `http://localhost:8090`. Add dashboard origin (e.g. `http://localhost:5173`) to CORS allowed list in PocketBase Admin UI → Settings → Application.
- [x] **Dashboard UI language.** Shell entirely in **French**. Content editing supports ar/fr/tzm via per-content tabbed forms. Only the text *content fields* (title, description, etc.) need `dir="auto"` — the UI shell stays LTR throughout v1.

---

## Phase 0 — Project scaffold & tooling ✓ DONE

- [x] Vite + React + TypeScript (SWC) — scaffolded manually (dir was non-empty)
- [x] Tailwind CSS + PostCSS; `tailwind.config.ts` with full Eco-Editorial Brutalism tokens
- [x] `components.json` (shadcn/ui config); `@/` alias in `vite.config.ts` + `tsconfig.app.json`
- [x] All core deps installed: pocketbase · @tanstack/react-query + devtools · react-router-dom · react-hook-form · zod · @hookform/resolvers · lucide-react · date-fns · sonner · zustand + all Radix UI primitives
- [x] ESLint (strict typed) + Prettier (`prettier-plugin-tailwindcss`) + `.editorconfig`; strict TS (`strict`, `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`)
- [x] `.env` + `.env.example`; `vite-env.d.ts` with typed `ImportMetaEnv`
- [x] Folder structure: `src/{api,components/ui,features,hooks,lib,routes,stores,types,styles}`
- [x] Scripts: `dev`, `build`, `preview`, `lint`, `typecheck` — build ✓, 0 TS errors

---

## Phase 1 — Foundation: app shell & shared primitives ✓ DONE

> **Lib work already done in Phase 0:** `lib/pb.ts` · `lib/queryClient.ts` · `lib/staleTimes.ts` · `lib/errors.ts` · `lib/permissions.ts` · `lib/utils.ts` · `types/collections.ts` · `stores/authStore.ts` · Tailwind design tokens · globals.css

### 1a · Design tokens ✓ DONE (Phase 0)

All Eco-Editorial Brutalism tokens baked into `tailwind.config.ts`: full color palette, Outfit type scale, 4px rhythm spacing, `rounded-xl` (24px) signature radius. Apply the **ui-ux-pro-max** / **frontend-design** skills for every component and page built from here on.

Component rules (reference):
- Primary button: pill, `bg-primary-container` (`#9fe870`), `text-[#0e0f0c]`, no shadow
- Secondary button: pill, transparent, `border border-outline-variant`
- Input: `bg-white border border-outline focus:border-primary`
- Bento card: `bg-surface-container p-xl rounded-xl` (24px)
- KPI card: large number in `text-tertiary font-black`, label in `text-body-sm text-on-surface-variant`
- Status chips: `rounded-full`, 10% opacity status background + solid status text

### 1b · PB client / query / types / errors ✓ DONE (Phase 0)

### 1c · Mock data setup ✓ DONE

- [x] `src/mocks/` — 13 files (activities, announcements, categories, content-reports, documents, establishments, newsletters, project-submissions, recommendations, registrations, talent-showcase, users, index.ts)
- [x] Each mock file exports a strictly typed array: `MOCK_ACTIVITIES: Activity[]`, etc. — never `any`, enum values exact, relation fields are IDs
- [x] `src/mocks/index.ts` — re-exports all mock arrays
- [x] `src/lib/devRole.ts` — `DEV_ROLE: Role = 'super_admin'` + `DEV_IS_ADMIN = true`

### 1d · App shell ✓ DONE

- [x] **Sidebar** (collapsible 240px / 64px): `Sidebar.tsx` — logo, grouped nav (4 groups) driven by `can()` with `DEV_ROLE`/`DEV_IS_ADMIN`, user mini-card + role badge, scroll area, collapse toggle persisted to localStorage
- [x] **Topbar**: `Topbar.tsx` — breadcrumbs, role badge (DEV_ROLE), user avatar dropdown (logout placeholder)
- [x] **AppLayout**: `AppLayout.tsx` — Sidebar + Topbar + `<Outlet />`, scrollable main
- [x] Mobile: Sheet drawer (hamburger in topbar) wraps full Sidebar
- [x] `sidebarStore.ts` — Zustand + persist middleware

### 1e · Shared primitives ✓ DONE

- [x] `DataTable` — TanStack Table, client-sort + pagination, `ColumnDef<T>` typed
- [x] `PageHeader` — title + description + right-slot action
- [x] `StatusBadge` — pill, all enum values colour-coded
- [x] `EmptyState` / `ErrorState` / `LoadingSkeletons` (TableSkeleton, CardSkeleton, PageSkeleton)
- [x] `ConfirmDialog` — wraps AlertDialog
- [x] `ImageThumb` — src string, fallback icon when empty
- [x] `FormField` — label + input + inline error/hint
- [x] `LanguageTabs` — tabs ar/fr/tzm, `dir="auto"` on content
- [x] Home page with 4 KPI cards + 5 recharts charts (activity status donut, registration bar, activities by wilaya, mode donut, projects bar) + upcoming activities list + quick actions
- [ ] `FileUpload` — image (≤300KB) + PDF (≤10MB), local preview only — **deferred to Phase 2** (needed in forms)

---

## Phase 2 — Core content management UI (static fixtures)

> All pages in this phase use typed mock data from `src/mocks/`. No PocketBase calls yet.
> Props/hooks must be written to accept `T[]` so the swap in Phase 6 is a one-line data source change.

### Activities (vertical slice — build first to prove the full stack)

- [ ] **List page**: DataTable, thin payload (`fields=id,title,status,commune,wilaya,activity_mode,start_datetime,establishment`), filters (status, activity_mode, commune, wilaya, category — dropdowns), sort `-start_datetime`, `staleTime: STALE.activities`
- [ ] **Create / Edit form** (react-hook-form + zod schema for all fields):
  - Section 1: title, short_description, full_description
  - Section 2: commune, wilaya, category (relation select), establishment (relation select)
  - Section 3: activity_mode (`physical/online/hybrid`), online_link (conditional on mode)
  - Section 4: start_datetime, end_datetime, registration_deadline, capacity, requires_registration, is_free
  - Section 5: age_min, age_max, language, accessibility_notes, required_documents, bandwidth_level, replay_available
  - Section 6: contact_phone, contact_email, image upload (≤300KB jpg/png/webp)
  - Status selector: `draft → published → cancelled / archived`
  - **Do NOT send** `created_by` / `updated_by` (hook-managed)
- [ ] **`LanguageTabs`** for `activity_translations` — three tabs (ar/fr/tzm), each editing title + short_description + full_description; save creates/updates the `activity_translations` row for that language. Text areas use `dir="auto"`.
- [ ] Duplicate-as-draft action; delete with ConfirmDialog.
- [ ] `expand: 'category,establishment'` on detail fetch to show names inline.

### Establishments

- [ ] List + filters (type, commune, wilaya, status); staleTime `STALE.establishments`
- [ ] CRUD form: name, type (select), commune, wilaya, address, lat/lng, phone, email, opening_hours, services, accessibility_notes, image upload, status
- [ ] Lat/lng: number inputs for v1; map picker as a future enhancement
- [ ] `establishment_translations` tabbed editor (description, services_text, accessibility_text) per ar/fr/tzm

### Categories

- [ ] CRUD list: name, icon (text input), status (`active/inactive`); staleTime `STALE.categories`
- [ ] `category_translations` tabbed editor per ar/fr/tzm

### Announcements

- [ ] List + filters (status, priority, language); staleTime `STALE.announcements`
- [ ] CRUD form: title, content, priority (`normal/high/urgent`), language, related_establishment, related_activity, status

### Newsletters

- [ ] List + filters (status, language, target_wilaya); staleTime `STALE.newsletters`
- [ ] CRUD form: title, content, language, target_commune, target_wilaya, related_activity, related_establishment, thumbnail upload, published_at, status

### Documents (PDF library)

- [ ] List + filters (status, language, category); staleTime `STALE.documents`
- [ ] CRUD form: title, description, file upload (PDF ≤10MB), language, category (select from schema enum), establishment, status

---

## Phase 3 — Engagement & moderation UI (static fixtures)

> Same rule: typed mock data only. `attendance_staff` flow rendered with `DEV_ROLE = 'attendance_staff'` to preview the restricted view.

### Registrations / Attendance

- [ ] Per-activity registrations list (expand `user`) with status breakdown (registered / waiting_list / attended / cancelled)
- [ ] `attendance_staff` workflow: PATCH `checked_in_at` only — no status/qr_code touch; "Marquer présent" button per row
- [ ] Capacity indicator: registered count vs capacity; waiting-list count
- [ ] CSV export (client-side, no extra library — build from array → Blob)

### Project submissions

- [ ] Review queue: list filtered to `status='submitted'`, sort `-created`; expand `user` and `establishment`
- [ ] Detail panel: all fields + optional_document PDF link; status workflow buttons (reviewed → accepted / rejected / needs_more_info); assigned_mentor text field

### Talent showcase

- [ ] Moderation list: filter `status='draft'`; preview media/external_link; publish / reject / archive actions

### Content reports *(superuser only)*

- [ ] Queue: list `status='new'`, sort `-created`; expand `reporter`
- [ ] `target_id` + `target_type` → resolve and display a linked preview of the reported item (fetch from the relevant collection on demand)
- [ ] Resolution: set status to `reviewed / resolved / dismissed`; hide behind superuser gate in UI

---

## Phase 4 — AI recommendations & users UI (static fixtures)

> AI form renders with a hardcoded `MOCK_SUGGESTIONS: Suggestion[]` response. The "Créer un brouillon" flow navigates to the activity form pre-filled from the suggestion object — no API call needed to test this UX.

### AI recommendations

- [ ] Form: commune, wilaya, establishment_type (optional select); in UI-first phase submits to a local handler returning `MOCK_SUGGESTIONS`
- [ ] Results: render each suggestion in a Bento card with a **BROUILLON** badge; show `cached` indicator ("Réponse en cache"), `mock` indicator ("IA indisponible — suggestions de secours")
- [ ] **429 handling**: clear message "Limite atteinte (10 requêtes par compte)" — this is a lifetime limit
- [ ] **403 / 501 / 502** handling: distinct toasts
- [ ] "Créer un brouillon" button per suggestion → pre-fills the activity create form (commune, wilaya, title, short_description, category, activity_mode, age_min, age_max, is_free); user must save + publish manually
- [ ] `recommendation_requests` history table (superuser only): list past requests with status (`pending/completed/failed/cached`), admin_user expand, suggestions_json viewer

### User management *(superuser only)*

- [ ] List: DataTable, filter by role / commune / wilaya, search by name/email
- [ ] Create / edit form: full_name, email, phone, role (dropdown — all 6 values), preferred_language, commune, wilaya, interests multi-select (15 exact string enums), verified toggle
- [ ] Password reset: trigger `pb.collection('users').requestPasswordReset(email)`

---

## Phase 5 — Dashboard home & polish

### Home overview page

- [ ] KPI Bento grid — hardcoded counts from mock arrays (`MOCK_ACTIVITIES.filter(a => a.status === 'published').length`, etc.):
  - Activités publiées / en brouillon / annulées
  - Établissements actifs
  - Inscriptions aujourd'hui
  - Signalements en attente (superuser only)
  - Soumissions de projets non traitées
- [ ] "Prochaines activités" mini-list (5 items, `sort=start_datetime, filter=status='published'`)
- [ ] Quick-action links: Créer une activité · Rédiger une annonce · Voir les signalements

### Polish pass

- [ ] i18n / French strings audit — all labels, placeholders, toast messages, empty states, confirm dialogs in French
- [ ] Arabic content `dir="auto"` QA — verify text fields in activity/establishment/announcement/newsletter forms display RTL correctly for Arabic input
- [ ] Accessibility: keyboard navigation, visible focus rings (primary green), ARIA labels on icon-only buttons, color contrast ≥ 4.5:1
- [ ] Loading / empty / error states on every page and every data-fetching component
- [ ] Optimistic updates on status-change mutations (toggle status → instant UI feedback, rollback on error)
- [ ] `last_verified_at` display on activities / establishments / announcements / newsletters / documents — show "Vérifié il y a X jours" or an alert if stale

### Eco audit (30% of ECOHACK score)

- [ ] Every list query uses `fields=` (thin payload) — no full records in tables
- [ ] All lists paginate (`perPage ≤ 30`)
- [ ] Relations fetched via `expand=` (never N+1)
- [ ] Image thumbs use `thumb=400x0` via `pb.files.getURL`
- [ ] No polling or realtime subscriptions
- [ ] Heavy components lazy-loaded (`React.lazy` + `Suspense`): map picker, PDF viewer, chart on home page
- [ ] `staleTime` set correctly on every `useQuery` — no unnecessary refetches
- [ ] Lighthouse performance / best-practices pass before ship

---

## Phase 6 — Auth & PocketBase integration

> The UI is complete and validated visually. Now wire it to the real backend.
> This phase is a **data source swap**, not a rewrite — every component already accepts the correct types.

### 6a · Auth

- [ ] **Login page** (replace placeholder): single form, "Connexion" CTA, zod validation. Try `pb.admins.authWithPassword` → on failure try `pb.collection('users').authWithPassword`.
- [ ] Wire `authStore`: `setAuth({ isAdmin: pb.authStore.isAdmin, role: pb.authStore.record?.role, userId, userName })` after successful login.
- [ ] On app boot: `pb.authStore.isValid` → `authRefresh()`; on failure → `clearAuth()` + redirect `/login`.
- [ ] **Protected route layout**: redirect to `/login` if `!pb.authStore.isValid`.
- [ ] Replace `DEV_ROLE` / `DEV_IS_ADMIN` with real values from `authStore` throughout the app shell and `can()` calls.
- [ ] 401 / 403 / 400 (blocked write) → toast "Accès refusé" + no crash.
- [ ] Logout → `pb.authStore.clear()` + `clearAuth()` + redirect.

### 6b · Data source swap (mock → real queries)

For each feature, replace the mock import with a `useQuery` / `useMutation` call — component props stay identical:

- [ ] **Activities**: `useQuery({ queryKey: ['activities', params], queryFn: () => pb.collection('activities').getList(...), staleTime: STALE.activities })`; mutations for create/update/delete; `activity_translations` mutations on LanguageTabs save
- [ ] **Establishments** + translations
- [ ] **Categories** + translations
- [ ] **Announcements** / **Newsletters** / **Documents**
- [ ] **Registrations**: attendance PATCH (`checked_in_at`) mutation; `staleTime: STALE.registrations`
- [ ] **Project submissions**: status update mutation
- [ ] **Talent showcase**: publish/reject mutations
- [ ] **Content reports** (superuser): list query + status update mutation; `expand: 'reporter'`
- [ ] **AI recommendations**: replace local handler with `pb.send('/api/admin/event-recommendations', ...)` + handle 429/403/501/502
- [ ] **Recommendation history**: `pb.collection('recommendation_requests').getList(...)` (superuser)
- [ ] **Users**: `pb.collection('users').getList(...)` + create/update; password reset via `requestPasswordReset`
- [ ] **Home KPIs**: replace mock counts with `perPage=1` queries to get `totalItems`

### 6c · File handling

- [ ] `ImageThumb`: swap placeholder URL → `pb.files.getURL(record, field, { thumb: '400x0' })`
- [ ] `FileUpload`: wire image/PDF inputs to `FormData` submissions in create/update mutations

### 6d · Integration smoke test

- [ ] Each collection: create → appears in list · edit → changes persist · delete → removed
- [ ] Translation tabs: save ar/fr/tzm → correct rows in `*_translations`
- [ ] Attendance PATCH: `checked_in_at` set, status unchanged
- [ ] AI endpoint: real response with `cached`/`mock` indicators
- [ ] 429 on AI: correct message shown
- [ ] Superuser-only screens: hidden for role users, visible for superuser

---

## Phase 7 — Build, QA, deploy

- [ ] `npm run typecheck` → 0 errors; `npm run lint` → clean
- [ ] Production build; verify bundle size; code-split by route
- [ ] Full manual QA against local PocketBase (`./pocketbase serve --dev`, superuser `admin@chababia.dz / Chababia2026!`):
  - Superuser login → can access reports, users, AI history
  - `content_editor` login → can create/edit announcements, newsletters, documents; cannot touch activities or users; reports queue hidden
  - `establishment_manager` login → can create/edit activities + establishments; content menu restricted
  - `attendance_staff` login → only registrations/attendance screen visible
- [ ] CORS: confirm `http://localhost:5173` is in PocketBase allowed origins; test prod build with `VITE_PB_URL=https://api.chababia.dz`
- [ ] Deploy as static site (Netlify / Vercel / Nginx); set `VITE_PB_URL` env var

---

## Global conventions

| Rule | Detail |
|---|---|
| **Mock data is strictly typed** | Every mock array must be typed as the exact collection interface: `const MOCK_ACTIVITIES: Activity[] = [...]`. Never use `any`, never invent fields not in `types/collections.ts`. Enum fields must use values from the enum (e.g. `status: 'published'` not `status: 'active'`). Relation fields (`category`, `establishment`) are IDs unless the `expand` key is also populated. |
| **Components accept the real type** | Props that will receive real PB records in Phase 6 must be typed now: `items: Activity[]`, not `items: unknown[]` or `items: Record<string, any>[]`. The swap must be zero-diff on the component. |
| **DEV_ROLE for permission preview** | `src/lib/devRole.ts` exports `DEV_ROLE` and `DEV_IS_ADMIN`. Change these locally to preview any role's UI. Deleted entirely in Phase 6 when real auth takes over. Never commit a `DEV_ROLE` other than `'super_admin'`. |
| **Never send hook-managed fields** | `registrations.{status, qr_code, user}` · `content_reports.{reporter, status}` · `created_by` / `updated_by` (all collections) |
| **Filters** | Always `pb.filter('x = {:v}', { v })` — never string-interpolate |
| **Pagination** | `getList(page, perPage)` — never `getFullList` in the admin UI unless exporting |
| **List payloads** | Always `fields=` for list views; full record only on detail/edit |
| **Relations** | `expand=` in one call; never fetch related records separately |
| **Write errors** | Map `ClientResponseError` → field errors + toast; treat HTTP 400 as possibly a write-rule rejection |
| **Accuracy** | Empty field → display "Non renseigné par l'ODEJ." — never invent data |
| **Superuser gate** | Content reports + User management + AI request history: always check `isAdmin` before rendering |
| **Design** | Eco-Editorial Brutalism — Outfit font, `#9fe870` primary, bento cards, `rounded-[24px]`, tonal elevation (no card shadows), pill buttons. Use **ui-ux-pro-max** / **frontend-design** skills for all UI work. |

## Build order

```
Phase 0  Scaffold                          ✓ DONE
Phase 1  App shell + shared primitives + mocks setup  ✓ DONE
Phase 2  Content management UI             (Activities → Establishments → Categories → Content)
Phase 3  Engagement & moderation UI
Phase 4  AI recommendations + Users UI
Phase 5  Home overview + polish + eco audit
Phase 6  Auth (real login) + PocketBase integration (swap mocks → useQuery/useMutation)
Phase 7  Build + QA + deploy
```

**The mock → real swap contract (Phases 2-5 → Phase 6):**
- Page component receives `items: T[]` — source changes, signature doesn't.
- Form component receives `onSubmit: (data: TInput) => void` — mutation replaces the no-op handler.
- `DataTable` pagination props stay identical; server-side `totalPages` replaces client-side derived count.
