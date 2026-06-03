---
name: Eco-Editorial Brutalism
colors:
  surface: '#fbf9f3'
  surface-dim: '#dbdad4'
  surface-bright: '#fbf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4ee'
  surface-container: '#efeee8'
  surface-container-high: '#eae8e2'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#41493a'
  inverse-surface: '#30312d'
  inverse-on-surface: '#f2f1eb'
  outline: '#717a68'
  outline-variant: '#c1cab5'
  surface-tint: '#2f6c00'
  primary: '#2f6c00'
  on-primary: '#ffffff'
  primary-container: '#9fe870'
  on-primary-container: '#2e6900'
  inverse-primary: '#91d963'
  secondary: '#5b5f5c'
  on-secondary: '#ffffff'
  secondary-container: '#dbded9'
  on-secondary-container: '#5e625e'
  tertiary: '#47672d'
  on-tertiary: '#ffffff'
  tertiary-container: '#bae099'
  on-tertiary-container: '#44642b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf67c'
  primary-fixed-dim: '#91d963'
  on-primary-fixed: '#092100'
  on-primary-fixed-variant: '#225100'
  secondary-fixed: '#e0e3de'
  secondary-fixed-dim: '#c4c7c3'
  on-secondary-fixed: '#191c1a'
  on-secondary-fixed-variant: '#444844'
  tertiary-fixed: '#c8eea5'
  tertiary-fixed-dim: '#acd28c'
  on-tertiary-fixed: '#0c2000'
  on-tertiary-fixed-variant: '#304f18'
  background: '#fbf9f3'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-xl:
    fontFamily: Outfit
    fontSize: 64px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '900'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-lg:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
---

## Brand & Style

The design system embodies a "Scandinavian Fintech Magazine" aesthetic, merging the high-authority editorial feel of heavyweight typography with the structured efficiency of a mobile-first Bento Grid. It is designed for the **ODEJ YouthConnect** platform, targeting a youth demographic with an emphasis on "Green IT" principles: clarity, high contrast, and rapid information processing.

The style is a blend of **Minimalism** and **Bento-style Brutalism**. It utilizes a clean, Light Mode interface to prioritize legibility and a fresh editorial feel, while employing vibrant lime accents to guide the user's eye toward critical actions. The emotional response should be one of professional reliability mixed with modern, youthful energy—balancing the seriousness of a financial tool with the approachability of a community hub.

## Colors

The system uses a **Light Mode** default to prioritize clarity and an airy editorial aesthetic. 

- **Primary (#9fe870):** The "Wise Green" serves as the primary action color. It is paired with the **Ink (#0e0f0c)** neutral for text to maintain maximum accessibility.
- **Backgrounds:** The primary surface is a crisp, off-white derived from the neutral palette. Interactive cards and Bento cells use tonal shifts (like **Sage #e8ebe6**) to create hierarchy without relying on heavy shadows.
- **Accents:** **Deep Forest Ink (#163300)** is utilized for tertiary emphasis, deep-colored cards, or high-contrast borders to ground the airy interface.
- **Functional Colors:** Success, error, and warning states use calibrated high-saturation tones to ensure feedback is immediate and unmistakable against the light background.

## Typography

The typography system relies on **Outfit** with extreme weight variance to mimic a bold editorial impact. 

- **Display Hierarchy:** Use `900` weight for all display and large headline levels. The geometric nature of Outfit maintains the "blocky" brutalist feel while appearing modern and clean.
- **Readability:** Body text uses standard weights (`400`) with generous line heights to ensure long-form content is legible against the light surface.
- **Scale:** On mobile devices, `display-xl` is restricted to prevent orphans and layout breaking. Use `display-lg-mobile` as the primary hero size for smaller screens.
- **Functional Labels:** Use `600` weight for buttons and navigation items to ensure they remain distinct from body copy.

## Layout & Spacing

This design system uses a **Bento Grid** philosophy based on a 4px rhythm.

- **Grid Model:** A 12-column fluid grid for desktop and a 4-column grid for mobile. 
- **Bento Cells:** Elements are housed in "cells" that span varying column widths (e.g., 2x2, 4x2).
- **Margins & Gutters:** The canonical spacing for gutters and internal card padding is **24px (xl)**. This creates significant "air" between blocks, essential for a premium magazine feel.
- **Sectioning:** Vertical spacing between major Bento groups should use **48px (3xl)** or **64px (4xl)** to clearly delineate different content streams.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** rather than traditional shadows.

- **Base Layer:** The deepest layer is the neutral off-white background.
- **Card Layer:** Bento cells use subtle tonal shifts or Sage (#e8ebe6) to create a visual "lift" while maintaining the flat theme.
- **Interactive Layer:** Thin Ink (#0e0f0c) or Sage outlines are used for ghost buttons and input fields to define boundaries.
- **High-Emphasis:** Only the most critical overlays (Modals/Toasts) may use a soft, low-opacity shadow to suggest physical elevation above the grid.

## Shapes

The shape language is defined by a "Friendly Brutalist" approach. While the layout is rigid and grid-based, the corners are generously rounded to keep the experience approachable.

- **Canonical Radius:** The **24px (rounded-xl)** radius is the signature of the system, used for all Bento cells, feature cards, and primary buttons.
- **Small Elements:** Form inputs and tags use a **12px (rounded-md)** radius to maintain consistency with the larger containers without losing internal space.
- **Pills:** Status badges and secondary indicator chips use a **full pill** shape.

## Components

- **Bento Cards:** Use neutral off-whites or soft Sage as the background. Padding is fixed at `24px`. Typography inside should be high-contrast Ink.
- **Buttons:** 
  - *Primary:* Pill-shaped, `#9fe870` background with `#0e0f0c` text. 
  - *Secondary:* Pill-shaped, transparent with a 1px Ink or Sage border.
- **KPI Cards:** For the admin dashboard, use a "Minimalist Bento" style. Large `display-md` numbers in Deep Forest Ink, with `label-sm` descriptors in secondary neutrals.
- **Input Fields:** Background should be white with a Sage 1px border. On focus, the border transitions to Primary Green.
- **Chips/Badges:** Small, pill-shaped containers with low-opacity versions of the status colors (e.g., 10% opacity Primary Green background with solid Primary Green text).
- **Lists:** Clean, border-bottom only dividers using a low-opacity Sage. No icons unless necessary for functional clarity.