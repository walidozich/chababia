# Chababia — Backend

PocketBase 0.39.0 backend for the **ODEJ Youth Opportunities Platform** (ECOHACK '26).
Single binary + SQLite. No Redis, no microservices, no background jobs — schema, seed,
and server logic all live in git-tracked JS files.

## Requirements

- Linux / macOS (the `pocketbase` binary is the only dependency)
- Download PocketBase 0.39.0 for your OS from https://pocketbase.io/docs/ and place the binary here.

## Run

```bash
./pocketbase serve
```

- API: http://127.0.0.1:8090/api/
- Admin dashboard (ODEJ staff): http://127.0.0.1:8090/_/

On first run, migrations apply automatically and the database is seeded with real ODEJ Béjaïa
demo data (see *Seed data* below).

## Admin credentials (dev)

```
Email:    admin@chababia.dz
Password: Chababia2026!
```

> Change these before any public deployment. Bootstrap a superuser with:
> `./pocketbase superuser upsert admin@chababia.dz <password>`

## Project structure

```
pb_migrations/   JS migrations — collections, indexes, access rules, seed data (applied in order)
pb_hooks/        JS hooks — server-side logic (capacity + QR, reports, audit, cache, AI)
pb_data/         SQLite runtime data (gitignored — auto-created on first run)
docs/            API documentation (OpenAPI spec + frontend SDK cookbook)
todo.md          Phased build checklist (all phases complete)
```

## Collections (15)

| Collection | Public read | Notes |
|---|---|---|
| `users` (auth) | — | email+password; roles: youth, super_admin, wilaya_admin, establishment_manager, content_editor, attendance_staff |
| `categories` | ✅ | 15 seeded |
| `establishments` | ✅ published | 6 ODEJ facility types |
| `activities` | ✅ published | denormalized commune/wilaya for fast filtering |
| `registrations` | own only | capacity + QR handled by hook |
| `announcements` | ✅ published | priority: normal/high/urgent |
| `newsletters` | ✅ published | text-first, optional ≤300 KB thumbnail |
| `documents` | ✅ published | PDF only, ≤10 MB |
| `project_submissions` | own only | youth project ideas, optional PDF ≤5 MB |
| `talent_showcase` | ✅ published | admin-curated, no video hosting |
| `recommendation_requests` | superuser only | compact AI request log |
| `content_reports` | superuser only | authenticated users report outdated or incorrect public content |
| `activity_translations` | ✅ | ar / fr / tzm |
| `establishment_translations` | ✅ | ar / fr / tzm |
| `category_translations` | ✅ | ar / fr / tzm |

## Server hooks (`pb_hooks/`)

- **`registrations.pb.js`** — on registration create: locks the owner to the auth user, enforces
  capacity server-side (→ `waiting_list` when full), and generates a 32-char QR token.
- **`reports.pb.js`** — on report create: locks `reporter` to the auth user and forces
  `status = new`.
- **`audit.pb.js`** — stamps `created_by` / `updated_by` when the target collection has those
  fields, including Admin UI edits.
- **`cache_headers.pb.js`** — sets `Cache-Control` per collection (spec §13.3) plus a weak `ETag`,
  and returns `304` on a matching `If-None-Match`.
- **`recommendations.pb.js`** — `POST /api/admin/event-recommendations`: admin-only AI event-idea
  helper. Input-cached, rate-limited (10/account), returns draft suggestions only, never
  auto-publishes. Falls back to realistic mock drafts if the AI provider is unavailable.
  Set `ANTHROPIC_API_KEY` to enable live calls (uses `claude-haiku-4-5-20251001`).

## API documentation

- **[`docs/openapi.yaml`](docs/openapi.yaml)** — OpenAPI 3.1 spec. Import into Swagger UI, Redoc,
  Postman, or Insomnia for interactive "try it" docs.
- **[`docs/SDK_COOKBOOK.md`](docs/SDK_COOKBOOK.md)** — copy-paste TypeScript recipes for the
  React Native app and custom dashboards (auth, filtering, registration, translations, caching).

## Migrations

PocketBase auto-runs JS migrations from `pb_migrations/` on startup. Manual control:

```bash
./pocketbase migrate up           # apply pending migrations
./pocketbase migrate down 1       # roll back the last migration
```

Migrations are fully reversible — `up → down → up` runs clean (verified).

## Seed data

`pb_migrations/1748700009_seed_demo.js` seeds real ODEJ Béjaïa data (source: odejbejaia-dz.com):

- 15 categories (+ 45 ar/fr/tzm translations)
- 5 establishments — MJ Takerietz, MJ Fatima Ramtani, Camp Beni Ksila, CLS Oued Ghir, SP Jebla
  (+ 15 translations)
- 6 published activities across them (+ 18 translations)

## Development

Hot-reload on hook changes + SQL logging:

```bash
./pocketbase serve --dev
```

## Verification

A full clean-room verification (fresh DB → all migrations → end-to-end checks covering
collections, seed counts, access rules, cache headers/ETag/304, the capacity+QR hook, and the
recommendations/report/audit hooks) passes. See `todo.md` for the checklist.
