import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // ─── Eco-Editorial Brutalism — Design.md tokens ───────────────────────
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Surfaces
        surface: {
          DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
          dim: 'hsl(var(--surface-dim) / <alpha-value>)',
          bright: 'hsl(var(--surface-bright) / <alpha-value>)',
          'container-lowest': 'hsl(var(--surface-container-lowest) / <alpha-value>)',
          'container-low': 'hsl(var(--surface-container-low) / <alpha-value>)',
          container: 'hsl(var(--surface-container) / <alpha-value>)',
          'container-high': 'hsl(var(--surface-container-high) / <alpha-value>)',
          'container-highest': 'hsl(var(--surface-container-highest) / <alpha-value>)',
          variant: 'hsl(var(--surface-variant) / <alpha-value>)',
          tint: 'hsl(var(--surface-tint) / <alpha-value>)',
        },
        // On-surface text
        'on-surface': {
          DEFAULT: 'hsl(var(--on-surface) / <alpha-value>)',
          variant: 'hsl(var(--on-surface-variant) / <alpha-value>)',
        },
        // Inverse
        'inverse-surface': 'hsl(var(--inverse-surface) / <alpha-value>)',
        'inverse-on-surface': 'hsl(var(--inverse-on-surface) / <alpha-value>)',
        // Outlines
        outline: {
          DEFAULT: 'hsl(var(--outline) / <alpha-value>)',
          variant: 'hsl(var(--outline-variant) / <alpha-value>)',
        },
        // Primary — lime green
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          container: 'hsl(var(--primary-container) / <alpha-value>)',
          'on-primary': 'hsl(var(--primary-on-primary) / <alpha-value>)',
          'on-container': 'hsl(var(--primary-on-container) / <alpha-value>)',
          inverse: 'hsl(var(--primary-inverse) / <alpha-value>)',
          fixed: 'hsl(var(--primary-fixed) / <alpha-value>)',
          'fixed-dim': 'hsl(var(--primary-fixed-dim) / <alpha-value>)',
          'on-fixed': 'hsl(var(--primary-on-fixed) / <alpha-value>)',
          'on-fixed-variant': 'hsl(var(--primary-on-fixed-variant) / <alpha-value>)',
        },
        // Secondary
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          container: 'hsl(var(--secondary-container) / <alpha-value>)',
          'on-secondary': 'hsl(var(--secondary-on-secondary) / <alpha-value>)',
          'on-container': 'hsl(var(--secondary-on-container) / <alpha-value>)',
          fixed: 'hsl(var(--secondary-fixed) / <alpha-value>)',
          'fixed-dim': 'hsl(var(--secondary-fixed-dim) / <alpha-value>)',
          'on-fixed': 'hsl(var(--secondary-on-fixed) / <alpha-value>)',
          'on-fixed-variant': 'hsl(var(--secondary-on-fixed-variant) / <alpha-value>)',
        },
        // Tertiary — deep forest
        tertiary: {
          DEFAULT: 'hsl(var(--tertiary) / <alpha-value>)',
          container: 'hsl(var(--tertiary-container) / <alpha-value>)',
          'on-tertiary': 'hsl(var(--tertiary-on-tertiary) / <alpha-value>)',
          'on-container': 'hsl(var(--tertiary-on-container) / <alpha-value>)',
          fixed: 'hsl(var(--tertiary-fixed) / <alpha-value>)',
          'fixed-dim': 'hsl(var(--tertiary-fixed-dim) / <alpha-value>)',
          'on-fixed': 'hsl(var(--tertiary-on-fixed) / <alpha-value>)',
          'on-fixed-variant': 'hsl(var(--tertiary-on-fixed-variant) / <alpha-value>)',
        },
        // Error
        error: {
          DEFAULT: 'hsl(var(--error) / <alpha-value>)',
          container: 'hsl(var(--error-container) / <alpha-value>)',
          'on-error': 'hsl(var(--error-on-error) / <alpha-value>)',
          'on-container': 'hsl(var(--error-on-container) / <alpha-value>)',
        },
        // Semantic aliases
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        // shadcn/ui compatibility aliases
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
      },
      borderRadius: {
        // Eco-Editorial Brutalism radius scale
        sm: '0.25rem',     // 4px
        DEFAULT: '0.5rem', // 8px
        md: '0.75rem',     // 12px — inputs, tags
        lg: '1rem',        // 16px
        xl: '1.5rem',      // 24px — Bento cells, cards, primary buttons (signature)
        '2xl': '2rem',     // 32px
        full: '9999px',    // pills — status badges, chips
      },
      spacing: {
        // 4px base rhythm
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },
      fontSize: {
        // Display
        'display-xl': ['64px', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '900' }],
        'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '900' }],
        'display-lg-mobile': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '900' }],
        // Headlines
        'headline-md': ['32px', { lineHeight: '1.2', fontWeight: '800' }],
        'headline-sm': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        // Body
        'body-lg': ['20px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        // Labels
        'label-lg': ['16px', { lineHeight: '1.2', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fetch-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fetch-bar': 'fetch-bar 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
}

export default config
