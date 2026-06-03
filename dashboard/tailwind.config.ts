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
          DEFAULT: '#fbf9f3',
          dim: '#dbdad4',
          bright: '#fbf9f3',
          'container-lowest': '#ffffff',
          'container-low': '#f5f4ee',
          container: '#efeee8',
          'container-high': '#eae8e2',
          'container-highest': '#e4e2dd',
          variant: '#e4e2dd',
          tint: '#2f6c00',
        },
        // On-surface text
        'on-surface': {
          DEFAULT: '#1b1c19',
          variant: '#41493a',
        },
        // Inverse
        'inverse-surface': '#30312d',
        'inverse-on-surface': '#f2f1eb',
        // Outlines
        outline: {
          DEFAULT: '#717a68',
          variant: '#c1cab5',
        },
        // Primary — lime green
        primary: {
          DEFAULT: '#2f6c00',
          container: '#9fe870',
          'on-primary': '#ffffff',
          'on-container': '#2e6900',
          inverse: '#91d963',
          fixed: '#acf67c',
          'fixed-dim': '#91d963',
          'on-fixed': '#092100',
          'on-fixed-variant': '#225100',
        },
        // Secondary
        secondary: {
          DEFAULT: '#5b5f5c',
          container: '#dbded9',
          'on-secondary': '#ffffff',
          'on-container': '#5e625e',
          fixed: '#e0e3de',
          'fixed-dim': '#c4c7c3',
          'on-fixed': '#191c1a',
          'on-fixed-variant': '#444844',
        },
        // Tertiary — deep forest
        tertiary: {
          DEFAULT: '#47672d',
          container: '#bae099',
          'on-tertiary': '#ffffff',
          'on-container': '#44642b',
          fixed: '#c8eea5',
          'fixed-dim': '#acd28c',
          'on-fixed': '#0c2000',
          'on-fixed-variant': '#304f18',
        },
        // Error
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          'on-error': '#ffffff',
          'on-container': '#93000a',
        },
        // Semantic aliases
        background: '#fbf9f3',
        foreground: '#1b1c19',
        // shadcn/ui compatibility aliases
        border: '#c1cab5',
        input: '#c1cab5',
        ring: '#2f6c00',
        card: {
          DEFAULT: '#efeee8',
          foreground: '#1b1c19',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#1b1c19',
        },
        muted: {
          DEFAULT: '#f5f4ee',
          foreground: '#41493a',
        },
        accent: {
          DEFAULT: '#efeee8',
          foreground: '#1b1c19',
        },
        destructive: {
          DEFAULT: '#ba1a1a',
          foreground: '#ffffff',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
}

export default config
