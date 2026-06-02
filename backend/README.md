# Chababia — Backend

PocketBase 0.39.0 backend for the ODEJ Youth Opportunities Platform (ECOHACK '26).

## Requirements

- Linux / macOS (the `pocketbase` binary is the only dependency)
- Download PocketBase 0.39.0 for your OS from https://pocketbase.io/docs/ and place the binary here.

## Run

```bash
./pocketbase serve
```

- API: http://127.0.0.1:8090/api/
- Admin dashboard: http://127.0.0.1:8090/_/

## Admin credentials (dev)

```
Email:    admin@chababia.dz
Password: Chababia2026!
```

> Change these before any public deployment.

## Project structure

```
pb_migrations/   JS migration files — define collections, indexes, access rules, seed data
pb_hooks/        JS hook files — server-side logic (capacity check, QR, cache headers)
pb_data/         SQLite runtime data (gitignored — auto-created on first run)
```

## Migrations

PocketBase auto-runs JS migrations from `pb_migrations/` on startup.
To apply manually:

```bash
./pocketbase migrate up
```

## Development

Run with hot-reload on hook changes and SQL logging:

```bash
./pocketbase serve --dev
```
