export type ThemeMode = 'dark' | 'light'

const THEME_STORAGE_KEY = 'chababia-theme-v2'

export function getStoredTheme(): ThemeMode {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' ? 'light' : 'dark'
}

export function applyTheme(theme: ThemeMode) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.classList.toggle('light', theme === 'light')
  root.style.colorScheme = theme
}

export function saveTheme(theme: ThemeMode) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
}
