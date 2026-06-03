# AGENTS.md — ODEJ YouthConnect · Chababia

> **Bible ultime.** Tout développement, toute décision, tout prompt agent DOIT suivre
> **exclusivement** ce fichier + `DESIGN.md`. Aucune déviation tolérée.

---

## ⚠️  DIRECTIVE IMPÉRATIVE ⚠️

1. **Chaque étape, chaque prompt, chaque génération de code DOIT activer
   TOUS les skills listés dans la section SKILLS ci-dessous.** Aucune exception.

2. **Tout design visuel DOIT respecter exclusivement `DESIGN.md`.**
   Couleurs, typographie, espacement, radius, composants — tout y est défini.

3. **Toute spécification fonctionnelle DOIT respecter exclusivement `PRD.md`.**
   Aucune feature hors PRD, aucun écart sur les contraintes Green Tech.

4. **Aucune librairie UI tierce.** StyleSheet natif React Native uniquement.
   Pas de NativeWind, Styled Components, Tamagui, NativeBase, Tailwind.

5. **Pas d'Axios.** Fetch natif uniquement.

---

## 🎯 SKILLS (À ACTIVER À CHAQUE PROMPT)

| # | Skill | Source |
|---|---|---|
| 1 | `frontend-design` | anthropics/skills |
| 2 | `vercel-react-best-practices` | vercel-labs/agent-skills |
| 3 | `web-design-guidelines` | vercel-labs/agent-skills |
| 4 | `grill-me` | mattpocock/skills |
| 5 | `impeccable` | pbakaus/impeccable |
| 6 | `ui-ux-polish` | oakoss/agent-skills |
| 7 | `ui-ux-designer` | sickn33/antigravity-awesome-skills |
| 8 | `uxui-principles` | sickn33/antigravity-awesome-skills |
| 9 | `ui-ux-reviewer` | arjenschwarz/agentic-coding |
| 10 | `vercel-react-native-skills` | vercel-labs/agent-skills |
| 11 | `react-native-best-practices` | callstackincubator/agent-skills |
| 12 | `react-native-design` | wshobson/agents |
| 13 | `react-native-architecture` | wshobson/agents |

> **RÈGLE :** Tout prompt doit commencer par `[Skills: ALL 13]` et les activer
> avant toute génération. Skills installés dans `~/.agents/skills/`.

---

## 📁 STRUCTURE DU PROJET

```
mobile/
├── AGENTS.md                     ← CE FICHIER (Bible)
├── DESIGN.md                     ← Design system Wise-inspired
├── PRD.md                        ← Spécifications fonctionnelles
├── app/                          ← Expo Router (file-based routing)
│   ├── _layout.tsx               ← Root layout + providers
│   ├── onboarding/
│   │   ├── language.tsx          ← US-01
│   │   ├── interests.tsx         ← US-02
│   │   └── radius.tsx            ← US-03
│   ├── (tabs)/
│   │   ├── _layout.tsx           ← Bottom tabs
│   │   ├── index.tsx             ← Opportunités (US-06, US-07)
│   │   ├── tickets.tsx           ← Mes billets (US-14)
│   │   └── settings.tsx          ← Paramètres (US-05)
│   └── opportunity/
│       └── [id].tsx              ← Détail (US-10)
├── src/
│   ├── api/
│   │   ├── client.ts             ← Fetch wrapper (< 2 KB)
│   │   ├── identity.ts           ← user_token anonyme
│   │   └── __fixtures__/         ← Mocks JSON
│   ├── design-system/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── rounded.ts
│   │   └── index.ts
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Chip.tsx
│   │   ├── OpportunityItem.tsx
│   │   └── TicketCard.tsx
│   ├── hooks/
│   │   ├── useOpportunities.ts
│   │   ├── useRSVP.ts
│   │   ├── useCache.ts
│   │   └── useLocale.ts
│   ├── i18n/
│   │   ├── ar.json
│   │   ├── fr.json
│   │   ├── tzm.json
│   │   └── index.ts
│   └── storage/
│       └── prefs.ts
├── app.json
├── tsconfig.json
└── package.json
```

---

## 🎨 DESIGN SYSTEM (Canonical — issu de DESIGN.md)

### Couleurs (palette stricte 3 couleurs)

| Token | Valeur | Usage |
|---|---|---|
| `primary` | `#9fe870` | Accent lime — CTA principal, texte sur fond sombre |
| `ink` | `#163300` | Encre — Texte principal, fonds sombres, bordures |
| `canvas` | `#dddddd` | Toile — Fond de page, fond de cartes claires |

### Typographie (Stack Sans Notch, Google Fonts)

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| `display-mega` | 126px | 700 | 107.1px | 0 | Titre Hero très large échelle |
| `display-xxl` | 96px | 700 | 81.6px | 0 | Titre Hero secondaire |
| `display-xl` | 64px | 700 | 54.4px | 0 | Titre Hero standard |
| `display-lg` | 47px | 400 | 70.5px | -0.108px | Titre large |
| `display-md` | 40px | 700 | 34px | 0 | Titres de sections / cartes |
| `display-sm` | 32px | 600 | 38.4px | -0.96px | Titres section mobile |
| `display-xs` | 24px | 600 | 31.2px | -0.48px | Sous-titres |
| `body-lg` | 20px | 400 | 30px | 0 | Paragraphes de tête |
| `body-md` | 16px | 400 | 24px | 0 | Corps de texte par défaut |
| `body-md-strong` | 16px | 600 | 24px | 0 | Corps gras |
| `body-sm` | 14px | 400 | 20px | 0 | Secondaire |
| `body-sm-strong` | 14px | 600 | 20px | 0 | Labels nav |
| `caption` | 12px | 400 | 16px | 0 | Fine print |
| `button-md` | 16px | 600 | 24px | 0 | Labels de boutons |

### Spacing (base 4px)

`xxs:2` `xs:4` `sm:8` `md:12` `lg:16` `xl:24` `2xl:32` `3xl:48`

### Radius

`none:0` `sm:8` `md:12` `lg:16` `xl:24` `pill:9999` `full:9999`

> **Canonical :** Boutons = `xl` (24px) · Cartes = `xl` (24px)

### Composants (Wise-inspired)

| Composant | BG | Texte | Bordure | Typo | Radius | Padding |
|---|---|---|---|---|---|---|
| `nav-bar` | `canvas` | `ink` | — | `body-sm-strong` | — | `md` `xl` |
| `nav-link` | — | `ink` | — | `body-sm-strong` | — | — |
| `button-primary` | `primary` | `ink` | — | `button-md` | `xl` | `md` `xl` |
| `button-secondary` | `ink` | `canvas` | — | `button-md` | `xl` | `md` `xl` |
| `button-tertiary` | `canvas` | `ink` | `ink` | `button-md` | `xl` | `md` `xl` |
| `button-icon-circular` | `canvas` | `ink` | `ink` | — | `full` | `sm` |
| `text-input` | `canvas` | `ink` | `ink` | `body-md` | `md` | `md` `lg` |
| `card-content` | `canvas` | `ink` | `ink` | `body-md` | `xl` | `xl` |
| `card-feature-dark` | `ink` | `primary` | — | `body-md` | `xl` | `xl` |
| `hero-band` | `canvas` | `ink` | — | `display-mega` | — | `3xl` `xl` |
| `hero-band-dark` | `ink` | `primary` | — | `display-mega` | — | `3xl` `xl` |
| `content-band` | `canvas` | `ink` | — | `display-md` | — | `3xl` `xl` |
| `badge-positive` | `primary` | `ink` | — | `body-sm-strong` | `pill` | `xs` `md` |
| `badge-negative` | `ink` | `canvas` | — | `body-sm-strong` | `pill` | `xs` `md` |
| `footer` | `ink` | `canvas` | — | `body-sm` | — | `3xl` `xl` |

---

## 🏗️ ARCHITECTURE

```
React Native 0.81 + Expo SDK 54
React 19.1.0
Node.js ≥ 20.19.x
TypeScript strict
Expo Router (file-based routing)
StyleSheet natif (pas de lib UI tierce)
Fetch natif (pas d'Axios)
AsyncStorage (cache + préférences)
expo-crypto (UUID pour token anonyme)
expo-secure-store (stockage token)
expo-localization (langue + RTL)
expo-font (Stack Sans Notch embarquée)
expo-notifications (locales uniquement)
react-native-qrcode-svg (QR client-side)
```

---

## 🌱 RÈGLES GREEN TECH (NON-NÉGOCIABLES)

1. **Payloads < 5 KB** pour 20 items liste
2. **0 carte interactive** par défaut — adresse textuelle + lien Maps natif
3. **0 requête réseau pendant onboarding** — données statiques embarquées
4. **QR code généré côté client** — 0 appel serveur
5. **Géolocalisation unique** — 1 call, cache 24h, pas de watchPosition
6. **Notifications locales uniquement** — pas de Firebase FCM
7. **Aucune image dans la liste** — miniatures uniquement dans le détail
8. **FlatList virtualisée** — rendu items visibles seulement
9. **Cache offline** — AsyncStorage systématique
10. **Cold start < 3s** — bundle JS < 1.5 MB

---

## 🔐 IDENTITÉ ANONYME

```typescript
// src/api/identity.ts
import * as SecureStore from 'expo-secure-store';
import { randomUUID } from 'expo-crypto';

export async function getUserToken(): Promise<string> {
  let token = await SecureStore.getItemAsync('user_token');
  if (!token) {
    token = `tok_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
    await SecureStore.setItemAsync('user_token', token);
  }
  return token;
}
```

---

## 💾 STRATÉGIE DE CACHE

| Données | TTL | Stratégie |
|---|---|---|
| Liste opportunités | 15 min | Stale-While-Revalidate |
| Détail événement | 30 min | Cache-first |
| Préférences | Permanent | AsyncStorage |
| Billets RSVP | Permanent | AsyncStorage |
| i18n | Bundle statique | 0 requête réseau |

---

## 📱 ORDRE D'IMPLÉMENTATION (strict)

```
1. Design System        → design-system/ + components/
2. Infrastructures      → i18n + api/ + storage/ + hooks/
3. Onboarding           → language → interests → radius
4. Discovery            → liste → filtres → détail
5. RSVP & Tickets       → bouton RSVP → QR → billets
6. Settings             → préférences
7. Accessibility        → RTL arabe + a11y labels
8. Mocks API            → __fixtures__/
```

---

## 📐 CONVENTIONS DE CODE

1. **TypeScript strict** — pas de `any`
2. **StyleSheet.create()** pour tous les styles — pas d'inline styles
3. **Composants fonctionnels** uniquement — pas de classes
4. **Hooks customs** pour toute logique métier
5. **Exports nommés** — pas d'exports par défaut
6. **`accessibilityLabel`** sur tout élément interactif
7. **Pas de commentaires inutiles** — code auto-documenté

---

## 🧠 ACTIVATION DES SKILLS (skills.sh)

Le script `skills.sh` à la racine du projet active les 13 skills avant chaque session :

```bash
#!/bin/bash
# Active tous les skills pour une session opencode
# Usage: source skills.sh (ou chargé automatiquement via ~/.bashrc)
export OPENCODE_SKILLS="frontend-design,vercel-react-best-practices,web-design-guidelines,grill-me,impeccable,ui-ux-polish,ui-ux-designer,uxui-principles,ui-ux-reviewer,vercel-react-native-skills,react-native-best-practices,react-native-design,react-native-architecture"
echo "[Skills: ALL 13] activés"
```

**Installation automatique :** Ajouter cette ligne dans `~/.bashrc` :

```bash
source /home/jeunecrack/Bureau/chababia/mobile/skills.sh
```

---

## 🔗 FICHIERS DE RÉFÉRENCE

- `DESIGN.md` — Design system Wise-inspired (290 lignes)
- `PRD.md` — Product Requirements Document (499 lignes)
- `SKILL.md` — Skill Activation Mandate (88 lignes)
- `skills.sh` — Script d'activation des 13 skills
- `../spec v2.md` — Spécification globale Chababia (2473 lignes)
