# Product Requirements Document (PRD)
## ODEJ YouthConnect — ECOHACK '26
### Thème : "Bridging Youth and Opportunities"

---

> **Version :** 1.0.0
> **Date :** Juin 2026
> **Statut :** Draft — Soumission Hackathon
> **Stack :** Monorepo · Bun · React Native + Expo

---

## Table des matières

1. [Résumé exécutif](#1-résumé-exécutif)
2. [Vision du produit](#2-vision-du-produit)
3. [Problématique & Solution](#3-problématique--solution)
4. [Personas utilisateurs](#4-personas-utilisateurs)
5. [User Stories détaillées](#5-user-stories-détaillées)
6. [Spécifications techniques & Architecture de la donnée](#6-spécifications-techniques--architecture-de-la-donnée)
7. [Critères d'acceptation Green Tech](#7-critères-dacceptation-green-tech)
8. [Roadmap Hackathon](#8-roadmap-hackathon)
9. [Risques & Mitigations](#9-risques--mitigations)

---

## 1. Résumé exécutif

**ODEJ YouthConnect** est une application mobile native conçue pour connecter les jeunes Algériens (15–30 ans) aux opportunités culturelles, sportives, de formation et de loisirs proposées par les établissements de l'**Office des Établissements de Jeunes (ODEJ)**. La solution répond au thème ECOHACK '26 "Bridging Youth and Opportunities" en opérant à l'intersection de trois impératifs :

| Impératif | Réponse produit |
|---|---|
| **Accessibilité sociale** | Multilinguisme AR / FR / TZM, UX zero-friction |
| **Inclusion numérique** | Fonctionne sur connexions 3G dégradées, appareils d'entrée de gamme |
| **Éco-responsabilité** | Architecture Green-First : payloads minimaux, zéro carte interactive par défaut, One-Click RSVP |

La livraison cible le **MVP hackathon** : onboarding géolocalisé, liste d'opportunités par proximité, inscription en un clic avec billet numérique.

---

## 2. Vision du produit

> *"Permettre à chaque jeune Algérien, quel que soit son appareil ou sa connexion, de découvrir et rejoindre une opportunité ODEJ à moins de 5 km de chez lui — en moins de 10 secondes et sans remplir un seul formulaire."*

### Principes directeurs

1. **Green-First by Design** — chaque fonctionnalité est évaluée à l'aune de son coût énergétique avant d'être retenue.
2. **Progressive Disclosure** — l'utilisateur accède à l'information minimale nécessaire ; les détails s'affichent à la demande.
3. **Offline Graceful** — les données consultées récemment restent accessibles sans connexion.
4. **Localisation native** — l'arabe (RTL), le français et le tamazight sont des citoyens de première classe, non des ajouts tardifs.

---

## 3. Problématique & Solution

### 3.1 Problématique constatée

Les jeunes Algériens ignorent massivement les offres ODEJ pour quatre raisons structurelles :

- **Découvrabilité nulle** : aucune interface digitale centralisée et à jour.
- **Démarches administratives** : inscription sur papier, formulaires multi-champs, présence physique exigée.
- **Fracture numérique** : applications existantes (si elles existent) gourmandes en data et incompatibles avec les smartphones d'entrée de gamme.
- **Barrière linguistique** : interfaces quasi-exclusivement en français, excluant arabophones et berbérophones.

### 3.2 Le pivot éco-responsable — pourquoi c'est central

La contrainte Green Tech n'est pas un habillage marketing ; c'est une **décision d'architecture première** justifiée par le contexte algérien :

| Réalité terrain | Conséquence produit |
|---|---|
| ~60 % des utilisateurs sur forfaits data limités (< 5 Go/mois) | Payloads JSON compressés < 5 KB par écran |
| Smartphones d'entrée de gamme (RAM < 2 Go) répandus | Pas de cartes vectorielles interactives par défaut |
| Coupures réseau fréquentes dans les wilayas intérieures | Cache local (AsyncStorage) systématique |
| Enjeu climatique global | Réduction de l'empreinte carbone serveur |

**Résultat :** une application plus rapide, plus inclusive et plus durable — la Green Tech est ici synonyme d'accessibilité universelle.

### 3.3 Solution proposée

```
[Jeune] ──onboarding──► [Intérêts + Rayon (max 5 km)]
                                │
                    ▼ requête géo-filtrée
             [API ODEJ YouthConnect]
                    │
          ◄── Liste JSON < 5 KB ──┘
                    │
          [Affichage liste texte, trié par proximité]
                    │
          [One-Click RSVP] ──► [Billet numérique ID/QR]
```

---

## 4. Personas utilisateurs

### Persona Principal — « Le Jeune »

---

**Nom fictif :** Amine Rahmani
**Âge :** 19 ans
**Localisation :** Bir Mourad Raïs, Alger
**Appareil :** Tecno Spark 10 (Android 13, 4 Go RAM)
**Connexion :** Forfait 4G limité (4 Go/mois), fréquentes dégradations en 3G

**Profil :**
Étudiant en 1ère année de licence. Passionné de sport (handball) et de musique. Cherche des activités parascolaires mais ignore les ressources ODEJ disponibles dans son quartier. Utilise son téléphone principalement pour WhatsApp, YouTube et TikTok. Parle arabe dialectal au quotidien, utilise le français à l'université.

**Motivations :**
- Trouver des activités sportives gratuites ou peu coûteuses.
- Rencontrer d'autres jeunes partageant ses centres d'intérêt.
- Améliorer son CV avec des certifications ou formations.

**Frustrations :**
- Les formulaires d'inscription en ligne sont longs et fastidieux.
- Les applications lourdes consomment sa data et vident sa batterie.
- Les informations sur les activités sont éparpillées (affiches papier, bouche-à-oreille).

**Citation représentative :**
> *"Si c'est compliqué à utiliser, j'abandonne au bout de 30 secondes."*

**Critères de succès pour Amine :**
- Trouve une activité ODEJ en < 30 secondes après ouverture de l'app.
- S'inscrit en 1 clic sans créer de compte complexe.
- Reçoit son billet sans connexion stable (mode offline-capable).

---

## 5. User Stories détaillées

### Epic 1 — Onboarding & Profil

| ID | User Story | Critères d'acceptation | Priorité |
|---|---|---|---|
| US-01 | En tant que **nouveau jeune**, je veux **choisir ma langue** (AR/FR/TZM) dès le premier écran, afin de **naviguer dans ma langue maternelle**. | L'écran s'affiche en < 1s. La sélection est persistée localement. L'interface bascule immédiatement en RTL pour l'arabe. | 🔴 Must |
| US-02 | En tant que **nouveau jeune**, je veux **sélectionner mes centres d'intérêt** (sport, culture, formation, loisirs) via des tags visuels, afin de **recevoir uniquement les opportunités pertinentes**. | Maximum 6 tags proposés. Sélection minimum 1 tag requise. Aucun appel réseau pendant cette étape (données statiques embarquées). | 🔴 Must |
| US-03 | En tant que **nouveau jeune**, je veux **définir mon rayon géographique** (1 km, 2 km, 5 km) afin de **voir uniquement les opportunités accessibles près de chez moi**. | Slider 3 positions. Valeur par défaut : 5 km. Géolocalisation demandée une seule fois avec explication claire du motif. | 🔴 Must |
| US-04 | En tant que **jeune récurrent**, je veux que **mes préférences d'onboarding soient mémorisées**, afin de **ne pas répéter la configuration à chaque ouverture**. | Données stockées en AsyncStorage local. Aucun compte requis pour cette persistance. | 🔴 Must |
| US-05 | En tant que **jeune**, je veux **modifier mon rayon et mes intérêts depuis les paramètres**, afin d'**adapter l'app à l'évolution de mes besoins**. | Accessible depuis icône paramètres en haut à droite. Modification immédiate sans rechargement complet. | 🟡 Should |

---

### Epic 2 — Découverte des opportunités (liste)

| ID | User Story | Critères d'acceptation | Priorité |
|---|---|---|---|
| US-06 | En tant que **jeune**, je veux **voir une liste d'opportunités ODEJ triée par proximité**, afin de **trouver rapidement ce qui est proche de moi**. | Liste chargée en < 2s sur 3G. Chaque item = nom, type, distance, date uniquement. Aucune miniature image par défaut. | 🔴 Must |
| US-07 | En tant que **jeune**, je veux **filtrer la liste par catégorie** (sport, culture, formation, loisirs), afin de **restreindre aux activités qui m'intéressent**. | Filtres sous forme de chips horizontaux scrollables. Filtre actif visible. Application du filtre sans nouvel appel réseau (filtre côté client sur payload déjà reçu). | 🔴 Must |
| US-08 | En tant que **jeune**, je veux **voir le nombre de places restantes** pour chaque opportunité, afin de **savoir si je peux encore m'inscrire**. | Affiché sous forme numérique simple ("3 places restantes"). Mis à jour à chaque ouverture de l'écran (pas de polling temps-réel pour économiser la batterie). | 🟡 Should |
| US-09 | En tant que **jeune avec connexion limitée**, je veux **accéder à la dernière liste chargée même hors connexion**, afin de **consulter les opportunités sans gaspiller ma data**. | Cache AsyncStorage des 20 derniers items. Bandeau "Données du [date]" affiché si hors connexion. | 🟡 Should |
| US-10 | En tant que **jeune**, je veux **accéder au détail d'une opportunité** (lieu, description, horaires) en appuyant sur un item, afin de **décider si elle m'intéresse avant de m'inscrire**. | Chargement du détail < 1s (payload < 2 KB). Pas de carte interactive — adresse textuelle + lien "Ouvrir dans Maps" en tap unique. | 🔴 Must |

---

### Epic 3 — One-Click RSVP & Billet numérique

| ID | User Story | Critères d'acceptation | Priorité |
|---|---|---|---|
| US-11 | En tant que **jeune**, je veux **m'inscrire à une opportunité en un seul clic** sans remplir de formulaire, afin de **ne pas abandonner l'inscription par friction**. | Bouton "Je participe" unique. Appel API unique (POST /rsvp avec user_token + event_id). Confirmation visuelle en < 1.5s. | 🔴 Must |
| US-12 | En tant que **jeune inscrit**, je veux **recevoir un billet numérique simple** (ID texte lisible + QR code minimaliste), afin de **présenter ma participation à l'entrée de l'établissement**. | Billet généré localement à partir de la réponse API (rsvp_id + event_code). QR code encodant une string de 20 caractères max. Accessible hors connexion depuis l'onglet "Mes billets". | 🔴 Must |
| US-13 | En tant que **jeune**, je veux **annuler mon inscription** depuis mon billet, afin de **libérer la place si je ne peux pas y aller**. | Bouton "Annuler" sur la vue billet. Confirmation en 1 tap. Appel DELETE /rsvp/{rsvp_id}. | 🟡 Should |
| US-14 | En tant que **jeune**, je veux **retrouver tous mes billets dans un onglet dédié**, afin de **gérer mes participations sans chercher dans l'historique**. | Onglet "Mes billets" dans la navigation principale. Billets passés archivés, billets à venir en haut. Stockage 100 % local. | 🟡 Should |
| US-15 | En tant que **jeune**, je veux **être notifié 1 heure avant un événement auquel je suis inscrit**, afin de **ne pas oublier ma participation**. | Notification locale (pas de push serveur). Programmée au moment du RSVP via expo-notifications. Un seul rappel par événement. | 🟢 Nice-to-have |

---

### Epic 4 — Accessibilité & Inclusion

| ID | User Story | Critères d'acceptation | Priorité |
|---|---|---|---|
| US-16 | En tant que **jeune arabophone**, je veux **une interface entièrement en arabe avec mise en page RTL**, afin de **lire l'application naturellement**. | Tous les libellés traduits. Mise en page miroir RTL correcte sur Android et iOS. Police arabe lisible (taille min 14sp). | 🔴 Must |
| US-17 | En tant que **jeune tamazightophone**, je veux **accéder à une version en Tamazight (Tifinagh ou Latin)**, afin de **m'exprimer dans ma langue**. | Au minimum les écrans principaux traduits (onboarding, liste, billet). Tifinagh affiché si police système disponible, sinon translittération latine. | 🟡 Should |
| US-18 | En tant que **jeune malvoyant**, je veux **que les éléments interactifs aient des labels d'accessibilité**, afin de **naviguer avec un lecteur d'écran (TalkBack/VoiceOver)**. | `accessibilityLabel` défini sur tous les boutons et icônes. Contraste minimum WCAG AA (4.5:1). | 🟡 Should |

---

## 6. Spécifications techniques & Architecture de la donnée

### 6.1 Stack technique

```
Monorepo (Bun)
├── apps/
│   └── mobile/          ← React Native + Expo (SDK 52+)
├── packages/
│   ├── api-client/      ← Fetch wrapper léger (pas d'Axios)
│   ├── i18n/            ← Dictionnaires AR / FR / TZM
│   └── ui/              ← Composants partagés (StyleSheet natif, pas de lib UI tierce lourde)
└── bun.lockb
```

**Choix techniques justifiés par le Green Tech :**

| Choix | Alternative écartée | Raison |
|---|---|---|
| Fetch natif + wrapper léger | Axios (45 KB) | Réduction bundle -45 KB |
| StyleSheet natif RN | Styled-components / NativeWind | Pas de runtime JS supplémentaire |
| AsyncStorage pour le cache | Redux Persist + Redux | Stack plus légère, moins de re-renders |
| expo-notifications (local) | Firebase FCM | Pas de connexion réseau pour les rappels |
| Liste FlatList virtualisée | ScrollView | Rendu uniquement des items visibles |
| QR code généré client-side | Image QR depuis serveur | 0 requête réseau pour le billet |

---

### 6.2 Architecture de la donnée — Payloads minimaux

#### Endpoint : `GET /v1/opportunities`

**Paramètres de requête :**
```
?lat=36.73&lng=3.08&radius=5000&categories=sport,culture&limit=20
```

**Payload de réponse (cible < 5 KB pour 20 items) :**
```json
{
  "data": [
    {
      "id": "evt_a1b2c3",
      "title": "Tournoi de Handball",
      "category": "sport",
      "date_ts": 1751500800,
      "distance_m": 1240,
      "slots_left": 8,
      "establishment_name": "Maison de Jeunes Bir Mourad Raïs"
    }
  ],
  "meta": {
    "total": 47,
    "cached_at": 1751414400
  }
}
```

> **Ce qui est délibérément absent du payload liste :** images, description longue, adresse complète, coordonnées GPS de l'établissement, logo. Ces données sont chargées uniquement au tap sur l'item (détail).

---

#### Endpoint : `GET /v1/opportunities/{id}`

**Payload détail (cible < 2 KB) :**
```json
{
  "id": "evt_a1b2c3",
  "title": "Tournoi de Handball",
  "category": "sport",
  "description": "Tournoi inter-quartiers. Équipes de 7 joueurs.",
  "date_ts": 1751500800,
  "end_ts": 1751515200,
  "address": "Rue des Frères Bouchama, Bir Mourad Raïs, Alger",
  "slots_total": 20,
  "slots_left": 8,
  "contact": "+213 23 XX XX XX",
  "establishment_id": "est_bmr_01"
}
```

> **Pas de coordonnées GPS dans ce payload.** L'adresse textuelle suffit. Si le jeune veut s'y rendre, un tap sur l'adresse ouvre l'application Maps native — aucune carte n'est rendue dans l'app.

---

#### Endpoint : `POST /v1/rsvp` — One-Click RSVP

**Requête (payload envoyé < 200 octets) :**
```json
{
  "event_id": "evt_a1b2c3",
  "user_token": "tok_xxxxxxxxxxxxxxxx"
}
```

> Le `user_token` est un identifiant anonyme généré à l'installation (UUID v4) — pas de compte, pas de mot de passe.

**Réponse succès (< 300 octets) :**
```json
{
  "rsvp_id": "rsvp_z9y8x7",
  "event_code": "HAND-BMR-0614",
  "confirmation_ts": 1751414500,
  "qr_payload": "ODEJ:rsvp_z9y8x7:HAND-BMR-0614"
}
```

**Génération du QR code :**
Le QR code est généré **entièrement côté client** (librairie `react-native-qrcode-svg`, < 30 KB gzippé) à partir du champ `qr_payload`. Aucune image n'est transmise par le serveur.

---

### 6.3 Flux One-Click RSVP — Diagramme de séquence

```
Jeune              App Mobile           API YouthConnect        DB
  │                    │                      │                   │
  │── Tap "Je participe"──►│                   │                   │
  │                    │── POST /rsvp ────────►│                   │
  │                    │   {event_id,          │── INSERT rsvp ───►│
  │                    │    user_token}        │◄── rsvp_id ───────│
  │                    │◄── {rsvp_id,          │                   │
  │                    │    event_code,        │                   │
  │                    │    qr_payload}        │                   │
  │                    │                      │                   │
  │                    │ [Génère QR en local]  │                   │
  │◄── Affiche billet ─│                      │                   │
  │    (hors ligne OK) │                      │                   │
```

**Latence cible : < 1.5s** (réseau 3G inclus)

---

### 6.4 Gestion de l'identité anonyme

```typescript
// packages/api-client/src/identity.ts
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

> Aucune donnée personnelle (nom, email, téléphone) n'est collectée. L'identifiant est purement technique et local.

---

### 6.5 Stratégie de cache (Green Cache Policy)

| Données | TTL cache | Stratégie |
|---|---|---|
| Liste des opportunités | 15 minutes | Stale-While-Revalidate |
| Détail d'un événement | 30 minutes | Cache-first |
| Préférences utilisateur | Permanent | AsyncStorage local |
| Billets (RSVP) | Permanent jusqu'à annulation | AsyncStorage local |
| Traductions i18n | Bundle (statique) | Pas de requête réseau |

---

### 6.6 Internationalisation (i18n)

```
packages/i18n/
├── ar.json      ← Arabe (RTL activé dans app.json)
├── fr.json      ← Français (défaut)
└── tzm.json     ← Tamazight (Tifinagh + fallback latin)
```

Les fichiers JSON sont **bundlés dans l'application** — pas de chargement réseau des traductions.

```typescript
// Exemple d'entrée i18n multi-langue
{
  "cta_rsvp": {
    "fr": "Je participe",
    "ar": "أشارك",
    "tzm": "ⴰⴽⴽⵓⵜⵖ"  // Tifinagh
  }
}
```

---

## 7. Critères d'acceptation Green Tech

> Ces critères sont **bloquants pour la démo hackathon**. Une fonctionnalité qui passe les tests fonctionnels mais échoue aux critères Green Tech est considérée **non conforme**.

### 7.1 Performance réseau

| Métrique | Cible | Méthode de mesure |
|---|---|---|
| Taille payload liste (20 items) | **< 5 KB** (gzip) | DevTools Network / curl -I |
| Taille payload détail (1 item) | **< 2 KB** (gzip) | DevTools Network |
| Payload RSVP request | **< 200 octets** | DevTools Network |
| Payload RSVP response | **< 300 octets** | DevTools Network |
| Nombre de requêtes au démarrage | **≤ 1** | Network profiler Expo |
| Requêtes en arrière-plan | **0** (pas de polling) | Network profiler Expo |

---

### 7.2 Performance applicative

| Métrique | Cible | Méthode de mesure |
|---|---|---|
| Temps de chargement liste (3G simulé) | **< 2 secondes** | Expo + Network throttling 3G |
| Temps de chargement détail | **< 1 seconde** | Mesure tap → render |
| Temps de confirmation RSVP | **< 1.5 secondes** | Mesure tap → billet affiché |
| Temps de démarrage à froid (cold start) | **< 3 secondes** | Expo DevTools |
| Re-renders inutiles (composants React) | **0 sur liste** | React DevTools Profiler |

---

### 7.3 Taille de l'application

| Métrique | Cible |
|---|---|
| Taille APK (Android) | **< 30 MB** |
| Taille IPA (iOS) | **< 25 MB** |
| Taille bundle JS (Hermes) | **< 1.5 MB** |
| Pas de librairies UI tierces > 50 KB | Vérification `bun run bundle-analyze` |

---

### 7.4 Consommation énergétique

| Comportement | Règle |
|---|---|
| Géolocalisation | Demandée **une seule fois** à l'onboarding, mise en cache 24h. Jamais de `watchPosition` continu. |
| Cartes interactives | **Interdites par défaut.** Adresse textuelle uniquement. Ouverture Maps native sur tap explicite. |
| Images d'événements | **Aucune miniature dans la liste.** Optionnelles dans le détail (lazy load, WebP, max 40 KB). |
| Animations | Limitées à une seule transition (`FadeIn` 200ms). Pas d'animations en boucle. |
| Polling/WebSocket | **Interdit.** Mise à jour uniquement sur ouverture de l'écran (pull-to-refresh explicite). |
| Notifications push serveur | **Remplacées par des notifications locales** programmées au moment du RSVP. |

---

### 7.5 Base de données — Requêtes optimisées

| Règle | Détail |
|---|---|
| Index géospatial obligatoire | Index PostGIS sur `(lat, lng)` des établissements |
| Requête liste : SELECT limité | Uniquement les colonnes nécessaires au payload liste (7 champs) |
| Pas de N+1 | La liste est retournée en une seule requête avec JOIN établissement |
| Rate limiting RSVP | Max 5 RSVP/minute par `user_token` pour éviter les abus serveur |
| Pagination obligatoire | `limit=20` par défaut, `max=50` |

---

### 7.6 Checklist Green Tech — Validation pré-démo

```
[ ] Payload liste mesuré et conforme (< 5 KB)
[ ] Aucune carte Mapbox/Google Maps rendue par défaut
[ ] 0 requête réseau pendant l'onboarding (données statiques)
[ ] QR code généré localement (0 appel serveur)
[ ] Notifications locales uniquement (0 connexion FCM/APNs)
[ ] Cache AsyncStorage fonctionnel (test mode avion)
[ ] APK < 30 MB vérifié
[ ] Cold start < 3s mesuré sur appareil réel Android
[ ] Géolocalisation non-continue confirmée (1 call unique)
[ ] 0 image dans la vue liste par défaut
```

---

## 8. Roadmap Hackathon

### Phase 1 — Setup & Architecture (H+0 → H+4)
- Initialisation monorepo Bun
- Configuration Expo SDK 52, i18n, navigation
- Mise en place du design system minimaliste (tokens couleur ODEJ, typographie)

### Phase 2 — Onboarding & Profil (H+4 → H+8)
- Écran de sélection de langue (US-01)
- Écran de sélection des intérêts (US-02)
- Écran de rayon géographique (US-03)
- Persistance AsyncStorage (US-04)

### Phase 3 — Liste & Détail (H+8 → H+16)
- Intégration endpoint `/v1/opportunities` (mock JSON local)
- Composant `OpportunityListItem` (texte uniquement)
- Filtres par catégorie côté client (US-07)
- Écran détail avec adresse textuelle (US-10)
- Cache Stale-While-Revalidate (US-09)

### Phase 4 — One-Click RSVP & Billet (H+16 → H+22)
- Implémentation POST /rsvp (US-11)
- Génération QR code client-side (US-12)
- Onglet "Mes billets" (US-14)
- Notification locale programmée (US-15)

### Phase 5 — Polish & Validation Green Tech (H+22 → H+24)
- Audit réseau (Network profiler)
- Test mode avion (cache offline)
- Validation checklist Green Tech complète
- Préparation démo (parcours Amine en 45 secondes)

---

## 9. Risques & Mitigations

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| API ODEJ inexistante / non documentée | Élevée | Élevé | Mocker entièrement l'API avec des données réalistes (fixture JSON) |
| Géolocalisation refusée par l'utilisateur | Moyenne | Moyen | Fallback sur sélection manuelle de wilaya / commune |
| Police Tifinagh absente sur certains appareils | Élevée | Faible | Fallback automatique sur translittération latine |
| QR code illisible sur petits écrans | Faible | Élevé | Afficher aussi l'ID texte (rsvp_id) en clair sous le QR |
| Temps de démo trop court pour valider le Green Tech | Moyenne | Moyen | Préparer screenshots Network profiler et tableau de métriques |

---

*Document produit par l'équipe ECOHACK '26 — Tous droits réservés.*
*Rédigé dans le cadre du hackathon, pour usage de démonstration et évaluation technique.*
