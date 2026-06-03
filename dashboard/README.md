# Chababia — Tableau de bord administrateur

Tableau de bord interne pour la gestion de la plateforme **Chababia / ODEJ YouthConnect**.
Développé dans le cadre d'**ECOHACK '26** par Club Origo.

## Stack technique

| Outil | Rôle |
|---|---|
| React 18 + Vite (SWC) | Framework UI + bundler |
| TypeScript (strict) | Typage statique |
| TanStack Query v5 | Fetching, cache, mutations |
| Tailwind CSS v3 | Styles utilitaires |
| shadcn/ui + Radix UI | Composants accessibles |
| react-router-dom v7 | Routing côté client |
| react-hook-form + zod | Formulaires + validation |
| sonner | Toasts / notifications |
| PocketBase JS SDK | Client API backend |

## Design system

**Eco-Editorial Brutalism** — police Outfit, primaire vert citron `#9fe870`, grille Bento,
coins `rounded-xl` (24 px), élévation tonale sans ombres. Voir [`Design.md`](./Design.md).

## Prérequis

- Node.js ≥ 18
- PocketBase backend en cours d'exécution (voir `../backend/`)

## Installation

```bash
cp .env.example .env
# Éditer VITE_PB_URL si besoin (défaut : http://localhost:8090)
npm install
```

## Démarrage

```bash
# Backend (dans ../backend/)
./pocketbase serve --dev
# Superutilisateur de démo : admin@chababia.dz / Chababia2026!

# Dashboard
npm run dev
# → http://localhost:5173
```

> Ajouter `http://localhost:5173` à la liste des origines CORS autorisées dans
> PocketBase Admin UI → Settings → Application.

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (HMR) |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualisation du build |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | ESLint (0 avertissement toléré) |

## Structure du projet

```
src/
  api/          Requêtes et mutations PocketBase (un fichier par collection)
  components/   Primitives partagées (DataTable, StatusBadge, PageHeader…)
  features/     Un dossier par domaine (activities, auth, users…)
  hooks/        Hooks custom (useAuth, usePagination, useConfirm…)
  lib/          pb.ts · queryClient · permissions · staleTimes · errors
  routes/       Arborescence des routes + gardes
  stores/       Auth store (zustand)
  types/        Types PocketBase + enums (collections.ts)
  styles/       globals.css + tokens
```

## Rôles et permissions

| Rôle | Accès |
|---|---|
| Superutilisateur (PocketBase) | Tout + signalements + utilisateurs |
| `super_admin` | Tout dans l'application |
| `wilaya_admin` | Établissements + activités de sa wilaya |
| `establishment_manager` | Son établissement + ses activités |
| `content_editor` | Annonces, newsletters, documents, talent |
| `attendance_staff` | Présence uniquement (PATCH `checked_in_at`) |

## Plan d'implémentation

Voir [`todo.md`](./todo.md) pour le plan complet phase par phase.

## Eco-mandate

Conformément aux critères ECOHACK (30 % du score) :
- Payloads minces via `?fields=` sur toutes les listes
- Pagination systématique (`perPage ≤ 30`)
- `staleTime` aligné sur les `Cache-Control` du backend
- Pas de polling ni de realtime
- Thumbnails WebP (`?thumb=400x0`)
- Chargement paresseux des composants lourds (carte, viewer PDF)
