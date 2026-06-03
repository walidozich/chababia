import fr from './fr.json';
import ar from './ar.json';
import tzm from './tzm.json';

export type Locale = 'fr' | 'ar' | 'tzm';
export type TranslationKeys = typeof fr;

const translations: Record<Locale, TranslationKeys> = { fr, ar, tzm };

export const defaultLocale: Locale = 'fr';

export const availableLocales: { code: Locale; label: string; nativeLabel: string }[] = [
  { code: 'fr', label: 'Français', nativeLabel: 'Français' },
  { code: 'ar', label: 'العربية', nativeLabel: 'العربية' },
  { code: 'tzm', label: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', nativeLabel: 'ⵜⴰⵎⴰⵣⵉⵖⵜ' },
];

export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale] ?? translations[defaultLocale];
}

export function t(locale: Locale, path: string): string {
  const keys = path.split('.');
  let value: unknown = getTranslations(locale);

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof value === 'string' ? value : path;
}
