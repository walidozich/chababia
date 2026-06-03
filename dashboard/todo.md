# Chababia Admin Dashboard — Implementation Plan

> ECOHACK '26 · ODEJ Youth Opportunities Platform
> Stack: **React + Vite + TypeScript + TanStack Query + Tailwind + shadcn/ui**
> Backend: PocketBase 0.39.0 (`pocketbase` JS SDK) · dev `http://localhost:8090`
> Design: follows the mobile app — **waiting on `design.md`** (will drive tokens/theme before heavy UI work).
> UI built with the **ui-ux-pro-max** / **frontend-design** skills for quality.

---

## ⚠️ Open questions / dependencies (resolve before/while building)

- [ ] **Write permissions.** Backend `createRule/updateRule/deleteRule` are `null` (superuser-only) on activities, establishments, categories, content, talent_showcase, etc. → the dashboard can only **write** when authed as a **superuser** (`pb.admins.authWithPassword`). Admin-*role* users (wilaya_admin, content_editor…) can log in but their writes will be rejected by the current rules.
  - Decide: (a) dashboard is superuser-only for writes (simplest, ship first), or (b) backend team adds role-scoped write rules later. Plan assumes **(a)** for v1, role-aware UI ready for **(b)**.
- [ ] **`design.md`** from the mobile app — colors, typography, spacing, components, logo, RTL behavior. Blocks the theming task in Phase 1.
- [ ] Confirm prod base URL / CORS allowlist with backend team.
- [ ] Confirm whether the dashboard needs all 3 languages in its own UI (ar/fr/tzm) or just for content editing. Assume: **UI in fr/en, content editing in ar/fr/tzm**.

---

## Phase 0 — Project scaffold & tooling

- [ ] `npm create vite@latest` → React + TypeScript (SWC).
- [ ] Tailwind CSS + PostCSS config; base globals.
- [ ] Init **shadcn/ui** (`components.json`), set up `@/` path alias (vite + tsconfig).
- [ ] Install core deps: `pocketbase`, `@tanstack/react-query`, `@tanstack/react-query-devtools`, `react-router-dom`, `react-hook-form`, `zod`, `@hookform/resolvers`, `lucide-react`, `date-fns`, `sonner` (toasts).
- [ ] ESLint + Prettier + `.editorconfig`; strict TS (`strict: true`, `noUncheckedIndexedAccess`).
- [ ] `.env` (`VITE_PB_URL`) + `.env.example`; never hardcode base URL.
- [ ] Folder structure: `src/{lib,api,components,features,routes,hooks,stores,types,i18n,styles}`.
- [ ] Scripts: `dev`, `build`, `preview`, `lint`, `typecheck`.

## Phase 1 — Foundation (PB client, query, theme, layout)

- [ ] **PocketBase singleton** (`lib/pb.ts`) reading `VITE_PB_URL`; `pb.autoCancellation(false)` only if needed.
- [ ] **Typed collections** — hand-written TS types from `DATABASE_SCHEMA.md` (or generate via `pocketbase-typegen`). Enums for status/role/category/language/mode/establishment-type.
- [ ] **TanStack Query** provider + `QueryClient` with sane defaults + Devtools.
- [ ] Centralized `staleTime` map (mirror backend Cache-Control): categories/documents 7d · establishments/*_translations 24h · activities 30m · announcements/newsletters 10m · talent_showcase 1h · registrations session-only.
- [ ] **Error handling** util: map `ClientResponseError` → toast + per-field form errors (`err.response.data`).
- [ ] **Theme/tokens** from `design.md` (mobile-app parity): Tailwind theme extension, CSS vars, dark mode, **RTL support** (`dir` switch for Arabic), font stack.
- [ ] **App shell**: sidebar (role-aware nav), topbar (user menu, language switch), content area, breadcrumbs, mobile-responsive collapse.
- [ ] Reusable primitives: DataTable (sort/paginate/filter), PageHeader, EmptyState, LoadingState/skeletons, ConfirmDialog, StatusBadge, FileUpload, ImageThumb, FormField wrappers.

## Phase 2 — Auth & access control

- [ ] **Dual login** UI: superuser (`pb.admins.authWithPassword`) vs admin-role user (`pb.collection('users').authWithPassword`). One form, detect/branch (or a toggle).
- [ ] Auth store (context or zustand) tracking `isAdmin` (superuser) **separately** from `record.role`.
- [ ] Session persistence (`pb.authStore` + localStorage) + `authRefresh()` on app launch; clear on expiry.
- [ ] **Route guards**: protected layout, redirect to `/login`; role/superuser gating per route.
- [ ] **Permission helper** `can(action, resource)` driven by the role matrix; used to show/hide nav + buttons. (Reports + Users = superuser-only.)
- [ ] Logout; "session expired" handling on 401/403.

## Phase 3 — Core content management (the bulk of the app)

### Activities (flagship CRUD)
- [ ] List: paginated DataTable, `fields=` thin payload, filters (status, commune, wilaya, category, establishment, date), search, sort `-start_datetime`.
- [ ] Detail/edit form (react-hook-form + zod): all fields incl. mode/online_link, capacity, age range, registration flags, accessibility, contact, image upload (≤300KB, jpg/png/webp).
- [ ] **Multi-language tabs** (ar/fr/tzm) writing to `activity_translations` (one row per language; unique activity+lang).
- [ ] Status workflow: draft → published → cancelled/archived. **Never** send `created_by/updated_by`.
- [ ] Create flow; duplicate-as-draft helper; delete with confirm.

### Establishments
- [ ] List + filters (type, commune, wilaya, status); CRUD form; image upload.
- [ ] Lat/long inputs (+ optional map picker, lazy-loaded to stay eco-friendly).
- [ ] `establishment_translations` tabbed editor (description/services/accessibility).

### Categories
- [ ] CRUD list (name, icon, status) + `category_translations` tabbed editor.

### Content: Announcements / Newsletters / Documents
- [ ] Announcements: CRUD, priority, related establishment/activity, draft/publish.
- [ ] Newsletters: CRUD, target commune/wilaya, language, thumbnail, `published_at`.
- [ ] Documents: PDF library CRUD (PDF ≤10MB), category, language, establishment link.

## Phase 4 — Engagement & moderation

- [ ] **Registrations / Attendance**: per-activity registration list; `attendance_staff` flow = PATCH `checked_in_at` only (do not touch status/qr_code); capacity/waiting-list visibility; CSV export (client-side).
- [ ] **Project submissions** review queue: list, detail, status workflow (submitted→reviewed→accepted/rejected/needs_more_info), assign mentor, view attached PDF.
- [ ] **Talent showcase** moderation: publish/reject/draft, view media/external link.
- [ ] **Content reports** queue (**superuser-only**): list filter `status='new'`, expand `reporter`, resolve `target_id` against `target_type` to preview the reported item, set status (reviewed/resolved/dismissed).

## Phase 5 — AI recommendations & users

- [ ] **AI recommendations**: form (commune, wilaya, establishment_type) → `pb.send('/api/admin/event-recommendations')`; render suggestions with a **DRAFT** badge; show `cached`/`mock` indicators; **handle 429 (10/account lifetime limit)** and 403/501/502 gracefully; "convert suggestion → activity draft" shortcut.
- [ ] (Optional) `recommendation_requests` history view (superuser-only).
- [ ] **User management** (superuser): list users, filter by role/commune, create/edit, **role dropdown** (youth/super_admin/wilaya_admin/establishment_manager/content_editor/attendance_staff), interests multi-select (string enums), verify toggle.

## Phase 6 — Dashboard home & polish

- [ ] **Home/overview**: KPI cards (counts of activities by status, upcoming activities, pending reports, new submissions, registrations) — built from cheap `totalItems` (`perPage=1`) queries, not full fetches.
- [ ] Recent activity / quick links.
- [ ] i18n wiring + RTL QA pass (Arabic).
- [ ] Accessibility pass (keyboard nav, focus, contrast, labels) — counts toward ECOHACK UX 20%.
- [ ] Empty/loading/error states everywhere; optimistic updates where safe.
- [ ] **Eco audit**: confirm thin `fields=`, pagination (perPage≤30), `expand=` for relations, `If-None-Match`/304 honored, no polling/realtime, lazy-loaded heavy bits (map, charts), WebP thumbnails (`thumb=400x0`).

## Phase 7 — Build, QA, deploy

- [ ] `npm run typecheck` + `lint` clean; production build.
- [ ] Manual QA against local PocketBase (`./pocketbase serve --dev`, superuser `admin@chababia.dz`).
- [ ] Test each role's visible surface + write-permission reality (see open question).
- [ ] Bundle-size check (code-split routes); Lighthouse pass.
- [ ] Deployment notes (static host + `VITE_PB_URL` for prod, CORS).

---

## Conventions (apply throughout)

- **Eco first** (30% of score): thin list payloads (`fields=`), always paginate, `expand=` not N+1, honor cache headers, no realtime/polling, lazy-load heavy UI, WebP thumbs.
- **Never send** hook-managed fields: `registrations.{status,qr_code,user}`, `content_reports.{reporter,status}`, `created_by/updated_by` (all).
- Build filters with `pb.filter(...)` (escaping/injection-safe).
- Forms: react-hook-form + zod; surface `ClientResponseError` field errors inline.
- Query keys: `[collection, params]`; invalidate on mutation; set `staleTime` from the map.
- Accuracy rule (spec): empty field → show "Not specified by ODEJ.", never invent data.
- Match mobile-app design (`design.md`) for visual parity.

## Suggested build order
Phase 0 → 1 → 2 → **Activities (Phase 3)** as the vertical slice that proves the whole stack → rest of Phase 3 → 4 → 5 → 6 → 7.
