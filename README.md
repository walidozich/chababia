# Chababia — ODEJ Youth Opportunities Platform

> ECOHACK '26 · "Bridging Youth and Opportunities"

A lightweight, multilingual ecosystem that centralises and verifies opportunities offered by the **Office des Établissements de Jeunes (ODEJ)** across Algeria — giving youth a single, mobile-friendly access point to discover activities, workshops, and services.

The platform is built around a **low-compute, low-payload** philosophy: aggressive caching, field-trimmed API responses, and a single-binary backend to minimise server cost, battery drain, and mobile data usage.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Mobile App                        │
│           Expo / React Native (AR · FR · TZM)        │
└───────────────────┬─────────────────────────────────┘
                    │ REST
┌───────────────────▼─────────────────────────────────┐
│                    Backend                           │
│          PocketBase 0.39 · Go · SQLite               │
│        JS hooks · RBAC · file storage · auth         │
└──────────┬──────────────────────────┬────────────────┘
           │ REST (admin)             │ internal
┌──────────▼──────────┐   ┌──────────▼────────────────┐
│   Admin Dashboard   │   │       AI Service           │
│  React 18 · Vite 6  │   │  FastAPI · SentenceXformrs │
│  TanStack · Shadcn  │   │  Qdrant vector DB · Groq   │
└─────────────────────┘   └───────────────────────────┘
```

---

## Modules

| Folder | Stack | Purpose |
|---|---|---|
| `backend/` | PocketBase 0.39 (Go + SQLite) | Auth, data, file storage, business logic via JS hooks |
| `dashboard/` | React 18, Vite 6, TypeScript, TanStack, Tailwind, Shadcn/UI | Staff management interface |
| `mobile/` | React Native, Expo Router | Youth-facing app — swipe cards, QR tickets, offline RSVP |
| `ai/` | FastAPI, SentenceTransformers, Qdrant | Personalised activity recommendations |

---

## Features

- **Trilingual** — Arabic, French, Tamazight (dedicated translation collections per language)
- **Offline-first mobile** — RSVP with QR-code ticket, works without connectivity
- **Role-based access** — `super_admin`, `wilaya_admin`, `establishment_manager`, `content_editor`, `attendance_staff`, `youth`
- **AI recommendations** — vector embeddings + user profile matching via Qdrant
- **Content moderation** — user report system with staff review workflow
- **Eco-efficient** — `fields=` trimmed API calls, HTTP Cache-Control on all public endpoints, lazy-loaded chart chunks

---

## Getting Started

### Backend
```bash
cd backend
./pocketbase serve
# Admin UI: http://localhost:8090/_/
```

### Dashboard
```bash
cd dashboard
npm install
npm run dev
# http://localhost:5173
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

### AI Service
```bash
cd ai/recommendation-system
pip install -r ../requirements.txt
uvicorn main:app --reload --port 8091
```

---

## Data Model

15 core PocketBase collections — highlights:

| Collection | Description |
|---|---|
| `activities` | Youth activities with capacity, mode, location, status |
| `establishments` | ODEJ establishments per wilaya |
| `registrations` | Activity sign-ups with QR token and check-in state |
| `users` | Accounts with role, wilaya, language preference |
| `activity_translations` | AR / FR / TZM content for activities |
| `content_reports` | User-submitted moderation reports |
| `project_submissions` | ECOHACK project entries |
| `talent_profiles` | Youth talent showcase |

---

## License

See `backend/LICENSE.md`.
