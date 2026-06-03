# Chababia Dashboard — Backend Integration Notes

Reference doc for the dashboard frontend session. Read alongside `openapi.yaml` and `SDK_COOKBOOK.md`.
This file captures non-obvious backend behaviors that aren't in the spec or OpenAPI.

---

## 1. Backend connection

| Item | Value |
|---|---|
| Base URL (dev) | `http://localhost:8090` |
| Base URL (prod) | `https://api.chababia.dz` |
| PocketBase Admin UI | `http://localhost:8090/_/` |
| SDK | `npm install pocketbase` |

```ts
import PocketBase from 'pocketbase';
export const pb = new PocketBase('http://localhost:8090');
```

---

## 2. Two separate auth systems — critical

There are **two different auth flows** depending on who is logging in.

### Admin-role users (establishment_manager, content_editor, wilaya_admin, etc.)
These are regular records in the `users` collection with a `role` field.

```ts
await pb.collection('users').authWithPassword(email, password);
// token lands in pb.authStore.token
// pb.authStore.model.role → "content_editor" etc.
```

### Superusers (super_admin with full DB access)
These are in PocketBase's internal `_superusers` collection, NOT in `users`.

```ts
await pb.admins.authWithPassword(email, password);
// different endpoint: POST /_/api/admins/auth-with-password
// pb.authStore.isAdmin → true
```

**Why this matters for the dashboard:**
- The "Reports" queue (`content_reports`) is `listRule: null` — only superusers can read it. If you log in as a `wilaya_admin` user, the reports screen will get a 403.
- The recommendations endpoint checks `e.hasSuperuserAuth()` — only the superuser token passes that branch.
- Role-based menus should check `pb.authStore.isAdmin` (superuser) separately from `pb.authStore.model?.role`.

---

## 3. Role permissions matrix

| Role | Can do |
|---|---|
| `super_admin` (user role) | Everything in the app | 
| Superuser (PocketBase admin) | Everything + direct DB access, read reports queue |
| `wilaya_admin` | Manage establishments and activities in their wilaya |
| `establishment_manager` | Manage their own establishment + its activities |
| `content_editor` | Draft/publish announcements, newsletters, documents |
| `attendance_staff` | Check in registrations (PATCH `checked_in_at`) only |
| `youth` (default) | Browse + register for activities, submit projects |

Access rules are enforced server-side — the dashboard just needs to show/hide UI based on role. The API will reject unauthorized writes regardless.

---

## 4. Hook side-effects — don't send these fields

These fields are **set automatically by server-side hooks**. Do NOT send them from the client or they'll be overwritten/ignored.

| Collection | Field(s) | Set by hook |
|---|---|---|
| `registrations` | `status`, `qr_code`, `user` | `registrations.pb.js` — status auto-set to `registered` or `waiting_list` based on capacity; qr_code is a random 32-char token |
| `content_reports` | `reporter`, `status` | `reports.pb.js` — reporter is always the auth'd user; status always starts as `new` |
| All collections | `created_by`, `updated_by` | `audit.pb.js` — stamped automatically from the auth token |

For registrations: the dashboard **attendance_staff** only needs to PATCH `checked_in_at` to mark attendance — do not touch `status` or `qr_code`.

---

## 5. Custom endpoint — AI recommendations

This is NOT a standard PocketBase collection endpoint.

```
POST /api/admin/event-recommendations
Authorization: Bearer <superuser_or_admin_role_token>
Content-Type: application/json

{
  "commune": "Béjaïa",
  "wilaya": "Béjaïa",
  "establishment_type": "youth_house",
  "season": "summer",
  "context": "optional free text"
}
```

Response:
```json
{
  "suggestions": [...],
  "cached": false,
  "mock": false,
  "request_id": "..."
}
```

- `mock: true` means the Anthropic API was unavailable — suggestions are pre-written fallbacks, not AI-generated.
- `cached: true` means a previous identical request was returned from `recommendation_requests` — no new AI call was made.
- Rate limit: **10 requests per admin account** (lifetime). Returns 429 when exceeded.
- Auth: superuser token OR users with role `super_admin`, `wilaya_admin`, `establishment_manager`, `content_editor`. Youth (`role: "youth"`) and anonymous → 403.

---

## 6. Field gotchas

### `users.interests`
Stored as **multi-select string values**, NOT record IDs.
Valid values (exactly these strings, case-sensitive):
```
Sports · Culture · Training · Volunteering · Health Awareness · Science · Arts
Environment · Youth Orientation · Camps and Trips · Coding · Design
Robotics · Photography · Debate
```
The onboarding picker must submit these exact strings. PocketBase rejects anything not in the list.

### `users.role`
Valid values: `youth · super_admin · wilaya_admin · establishment_manager · content_editor · attendance_staff`
Default for new signups: `youth`. Dashboard user management should offer a dropdown from this list.

### Status enums per collection
Different collections use different status sets:

| Collection | Status values |
|---|---|
| `activities` | `draft · published · cancelled · archived` |
| `establishments` | `active · inactive` |
| `announcements` / `newsletters` / `documents` | `draft · published · archived` |
| `project_submissions` | `submitted · reviewed · accepted · rejected · needs_more_info` |
| `talent_showcase` | `draft · published · rejected` |
| `registrations` | `registered · waiting_list · cancelled · attended` |
| `content_reports` | `new · reviewed · resolved · dismissed` |
| `categories` | `active · inactive` |

### `activities.activity_mode`
Valid values: `physical · online · hybrid`

### `establishments.type`
Valid values: `youth_house · youth_hostel · sports_complex · youth_camp · polyvalent_hall · scientific_leisure_center`

---

## 7. Caching strategy for the dashboard

The backend sets `Cache-Control` and `ETag` headers on all public collection list endpoints. The dashboard should **honor these** to avoid hammering the backend.

| Collection(s) | Cache-Control | Dashboard implication |
|---|---|---|
| `categories`, `category_translations`, `documents` | `max-age=604800` (7d) | Fetch once, keep in memory |
| `establishments`, `*_translations` | `max-age=86400` (24h) | Refresh daily or on explicit user action |
| `activities` | `max-age=1800` (30m) | Stale-while-revalidate, no polling |
| `announcements`, `newsletters` | `max-age=600` (10m) | Refresh on tab focus |
| `talent_showcase` | `max-age=3600` (1h) | Refresh on tab focus |

**Always send `If-None-Match`** with the stored ETag on repeat requests. The server returns `304 Not Modified` (empty body) when nothing changed — saves bandwidth.

With TanStack Query:
```ts
const { data } = useQuery({
  queryKey: ['activities'],
  queryFn: () => pb.collection('activities').getList(1, 20),
  staleTime: 30 * 60 * 1000,   // 30 minutes — matches backend Cache-Control
  gcTime:    60 * 60 * 1000,   // keep in memory 1h
});
```

---

## 8. Pagination — always paginate

Never fetch all records at once. PocketBase default is `perPage=30`, max is `500`.

```ts
// List with pagination
pb.collection('activities').getList(page, 20, {
  filter: 'status = "published"',
  sort: '-created',
  fields: 'id,title,start_datetime,status,establishment',  // thin payload
});
```

Use `fields` to request only the columns you need for list views. Only fetch full records on the detail/edit screen.

---

## 9. File URLs

PocketBase file URLs follow this pattern:
```
{baseUrl}/api/files/{collectionId}/{recordId}/{filename}
```

With the SDK:
```ts
pb.files.getURL(record, record.image);           // full size
pb.files.getURL(record, record.image, { thumb: '300x0' }); // thumbnail
```

Images are stored as ≤300KB (enforced at upload). No video hosting — the spec explicitly excludes it.

---

## 10. Translations pattern

Every activity, establishment, and category has translation records in sibling collections:

```ts
// Get activity with all translations expanded
pb.collection('activities').getOne(id, {
  expand: 'activity_translations_via_activity'
});

// Or fetch translations separately
pb.collection('activity_translations').getList(1, 10, {
  filter: `activity = "${activityId}" && language = "fr"`
});
```

Supported languages: `ar · fr · tzm` (Tamazight).
Dashboard content editors will need a tabbed form: one tab per language.

---

## 11. Content reports queue

Only accessible with the **superuser token** (`pb.admins.authWithPassword`).

```ts
// List pending reports (superuser only)
pb.collection('content_reports').getList(1, 20, {
  filter: 'status = "new"',
  sort: '-created',
  expand: 'reporter',
});

// Resolve a report
pb.collection('content_reports').update(reportId, {
  status: 'resolved',
});
```

The `reporter` field expands to the `users` record. The `target_id` is a raw record ID — the dashboard needs to resolve it against `target_type` to show the actual content.

---

## 12. Running the backend locally

```bash
cd /path/to/backend
./pocketbase serve --dev
# Admin UI: http://localhost:8090/_/
# API: http://localhost:8090/api/
# Superuser: admin@chababia.dz / Chababia2026!
```

Migrations run automatically on `serve`. **Important:** PocketBase looks for `pb_migrations/` and `pb_hooks/` relative to the **current working directory**, not the `--dir` flag. Always run the binary from the backend root folder. If you need a different data directory for testing:

```bash
./pocketbase serve --dir /tmp/test_db --migrationsDir ./pb_migrations --hooksDir ./pb_hooks
```

---

## 13. Write permissions — who can do what

Added in migration `1748700014_dashboard_write_rules.js`:

| Collection | Create | Update | Delete |
|---|---|---|---|
| `activities` | super_admin, wilaya_admin, establishment_manager | same | superuser only |
| `establishments` | super_admin, wilaya_admin | + establishment_manager | superuser only |
| `announcements` / `newsletters` / `documents` | super_admin, wilaya_admin, content_editor | same | superuser only |
| `talent_showcase` | super_admin, wilaya_admin, content_editor | same | superuser only |
| `project_submissions` | any auth'd user (youth submits) | super_admin, wilaya_admin, establishment_manager | superuser only |
| `registrations` | any auth'd user | any auth'd non-youth (for check-in) | superuser only |
| `activity_translations` / `establishment_translations` | any non-youth auth'd user | same | superuser only |

**PocketBase returns HTTP 400 (not 403) when a createRule blocks a write.** Check for non-200 responses generically in the dashboard, not specifically for status 403.

List/view rules for these collections are widened: `status = 'published' || (authed AND role != 'youth')`. Admins see drafts; public/youth see published only.
