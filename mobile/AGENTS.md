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

## 🎨 DESIGN SYSTEM (Extrait de DESIGN.md)

### Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `primary` | `#9fe870` | CTA principal |
| `primary-active` | `#cdffad` | Hover/press |
| `primary-pale` | `#e2f6d5` | Badge positif |
| `ink` | `#0e0f0c` | Texte principal |
| `body` | `#454745` | Texte secondaire |
| `mute` | `#868685` | Texte tertiaire |
| `canvas` | `#ffffff` | Fond cartes |
| `canvas-soft` | `#e8ebe6` | Fond page (sage) |
| `positive` | `#2ead4b` | Succès |
| `negative` | `#d03238` | Erreur |
| `warning` | `#ffd11a` | Attention |

### Typographie (Inter, substitut Wise Sans)

| Token | Size | Weight | Usage |
|---|---|---|---|
| `display-sm` | 32px | 600 | Titres section |
| `display-xs` | 24px | 600 | Sous-titres |
| `body-lg` | 20px | 400 | Lead |
| `body-md` | 16px | 400 | Corps |
| `body-md-strong` | 16px | 600 | Corps gras |
| `body-sm` | 14px | 400 | Secondaire |
| `body-sm-strong` | 14px | 600 | Labels nav |
| `caption` | 12px | 400 | Fine print |
| `button-md` | 16px | 600 | Boutons |

### Spacing (base 4px)

`xxs:2` `xs:4` `sm:8` `md:12` `lg:16` `xl:24` `2xl:32` `3xl:48`

### Radius

`none:0` `sm:8` `md:12` `lg:16` `xl:24` `pill:9999` `full:9999`

> **Canonical :** Boutons = `xl` (24px) · Cartes = `xl` (24px)

---

## 🏗️ ARCHITECTURE

```
React Native + Expo SDK 56+
TypeScript strict
Expo Router (file-based routing)
StyleSheet natif (pas de lib UI tierce)
Fetch natif (pas d'Axios)
AsyncStorage (cache + préférences)
expo-crypto (UUID pour token anonyme)
expo-secure-store (stockage token)
expo-localization (langue + RTL)
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

## 🔗 FICHIERS DE RÉFÉRENCE

- `DESIGN.md` — Design system Wise-inspired (544 lignes)
- `PRD.md` — Product Requirements Document (499 lignes)
- `../spec v2.md` — Spécification globale Chababia (2473 lignes)
