---
version: alpha
name: Wise-Inspired-design-analysis
description: Une interprétation minimaliste de l'identité Wise avec une contrainte stricte de trois couleurs (#9FE870, #163300, #DDDDDD). Les surfaces grises, les typographies Stack Sans Notch sombres et les accents vert citron structurent l'expérience globale pour un rendu fintech épuré.

colors:
  primary: "#9fe870"
  ink: "#163300"
  canvas: "#dddddd"

typography:
  display-mega:
    fontFamily: "'Stack Sans Notch', system-ui, -apple-system, sans-serif"
    fontSize: 126px
    fontWeight: 700
    lineHeight: 107.1px
  display-xxl:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 96px
    fontWeight: 700
    lineHeight: 81.6px
  display-xl:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 64px
    fontWeight: 700
    lineHeight: 54.4px
  display-lg:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 47px
    fontWeight: 400
    lineHeight: 70.5px
    letterSpacing: -0.108px
  display-md:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 34px
  display-sm:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 32px
    fontWeight: 600
    lineHeight: 38.4px
    letterSpacing: -0.96px
  display-xs:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 31.2px
    letterSpacing: -0.48px
  body-lg:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 30px
  body-md:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  body-sm:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm-strong:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  caption:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  button-md:
    fontFamily: "'Stack Sans Notch', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px

rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    padding: "{spacing.md} {spacing.xl}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.xl}"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.xl}"
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.xl}"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.lg}"
  card-content:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-feature-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-mega}"
    padding: "{spacing.3xl} {spacing.xl}"
  hero-band-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.primary}"
    typography: "{typography.display-mega}"
    padding: "{spacing.3xl} {spacing.xl}"
  content-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "{spacing.3xl} {spacing.xl}"
  currency-converter-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  badge-positive:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  badge-negative:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-sm}"
    padding: "{spacing.3xl} {spacing.xl}"

  # ─── Examples (illustrative) — auto-derived ───
  ex-pricing-tier:
    description: "Carte de prix par défaut avec bordure pour séparation visuelle."
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-pricing-tier-featured:
    description: "Carte mise en avant — couleurs inversées."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-app-shell-row:
    description: "Ligne de navigation. L'état actif utilise la couleur primaire."
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  ex-toast:
    description: "Notification avec une bordure tranchée."
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.lg}"
    typography: "{typography.body-sm}"

---

## Overview

Cette déclinaison est basée sur l'identité de la marque Wise, mais strictement réduite à une palette de **trois couleurs**. Le design préserve l'énergie du vert citron `{colors.primary}` (`#9fe870`), utilisé comme pilule d'action (CTA) principale. L'interface repose sur une toile gris clair `{colors.canvas}` (`#dddddd`) accompagnée d'un vert forêt presque noir `{colors.ink}` (`#163300`) pour les textes et les bordures. L'ensemble donne un rendu très contrasté, à la fois calme et lisible.

La typographie confie tout son caractère à **Stack Sans Notch**, une police géométrique robuste de Google Fonts. Pour respecter ses limites techniques tout en mimant le poids imposant de l'identité Wise originale, les grands titres héroïques utilisent la graisse maximale de la police (weight 700).

Les cartes et boutons conservent la courbure emblématique en pilule `{rounded.xl}` (24 px). L'absence d'ombrage logiciel et de nuances multiples donne à ce design system un aspect "Brutalist-Lite", compensant la palette réduite par des bordures nettes de 1 px.

**Caractéristiques clés :**
- Une règle stricte de trois couleurs pour l'ensemble du système (Primary, Ink, Canvas).
- L'utilisation universelle du vert citron `{colors.primary}` pour chaque appel à l'action.
- Une unique police Google Fonts (**Stack Sans Notch**) avec un jeu assumé sur les graisses pour différencier la voix de marque de l'utilitaire.
- Des rayons canoniques très arrondis à 24 px (`{rounded.xl}`).

## Couleurs (Inspiré de Wise.com)

Le style de Wise repose sur l'exploitation judicieuse de ce contraste ternaire :

1. **L'Accent (Primary - `#9FE870`) :** Le fameux vert Wise. Il n'est pas utilisé comme couleur de fond de page. C'est l'étincelle visuelle. Il remplit les boutons principaux et agit comme texte de contraste lorsque le fond est foncé.
2. **Le Fond (Canvas - `#DDDDDD`) :** Remplace le "sage-tint" et le blanc pur de la version originale. Cette couleur neutre habille toute la page par défaut, imposant l'ajout de bordures foncées (`colors.ink`) pour délimiter les éléments posés dessus (cartes, inputs).
3. **L'Encre (Ink - `#163300`) :** Le "Dark Mode" et le texte. Ce vert forêt très foncé assure le rôle de noir. Il remplit les bandeaux Hero inversés, colore le texte, trace les contours des cartes et sert de fond de secours pour les badges ou boutons secondaires.

## Typographie

### Font Family
L'identité s'appuie sur une seule famille : **Stack Sans Notch** depuis Google Fonts.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 126px | 700 | 107.1px | 0 | Titre Hero à très grande échelle. |
| `{typography.display-xl}` | 64px | 700 | 54.4px | 0 | Titre standard Hero. |
| `{typography.display-md}` | 40px | 700 | 34px | 0 | Titres de sections / cartes. |
| `{typography.body-lg}` | 20px | 400 | 30px | 0 | Paragraphes de tête. |
| `{typography.body-md}` | 16px | 400 | 24px | 0 | Corps de texte par défaut. |
| `{typography.body-sm-strong}` | 14px | 600 | 20px | 0 | Légendes en gras / Liens de nav. |
| `{typography.button-md}` | 16px | 600 | 24px | 0 | Labels de boutons. |

## Layout & Elevation

Puisque le système ne comporte qu'une seule couleur de fond et aucune ombre (`box-shadow`), la profondeur de l'interface s'exprime uniquement par **la bordure**.

| Niveau | Traitement | Usage |
|---|---|---|
| Level 0 — Plat | Pas de bordure | Arrière-plan de la page (`canvas`) ou bandeaux sombres (`ink`). |
| Level 1 — Bordure Tranchée | Bordure pleine 1 px `{colors.ink}` | Cartes blanches posées sur le fond clair, boutons tertiaires, champs de saisie. |

## Composants (Logique Ternaire)

### Boutons
- **`button-primary`** : Fond Lime-Green (`#9FE870`), texte foncé (`#163300`). C'est le bouton vedette.
- **`button-secondary`** : L'inverse absolu. Fond sombre (`#163300`), texte clair (`#DDDDDD`).
- **`button-tertiary`** : Un contour simple. Fond clair (`#DDDDDD`), texte et bordure sombres (`#163300`).

### Cartes
- **`card-content`** : Comme le système manque d'ombres et qu'il n'y a qu'un fond clair, la carte standard utilise le fond `#DDDDDD` mais se détache grâce à une bordure `#163300`.
- **`card-feature-dark`** : Carte inversée utilisée pour les mises en avant. Fond `#163300` et texte `#9FE870` (Vert Wise).

## Do'