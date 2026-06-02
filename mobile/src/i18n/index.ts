import { useCallback } from 'react';

type Translations = Record<string, string>;

let currentLocale = 'fr';
let currentTranslations: Translations = {};

const locales: Record<string, Translations> = {};

function registerLocale(code: string, translations: Translations) {
  locales[code] = translations;
}

registerLocale('fr', require('./fr.json'));
registerLocale('ar', require('./ar.json'));
registerLocale('tzm', require('./tzm.json'));

export function setLocale(code: string) {
  if (locales[code]) {
    currentLocale = code;
    currentTranslations = locales[code];
  }
}

export function getLocale(): string {
  return currentLocale;
}

setLocale('fr');

export function t(key: string): string {
  return currentTranslations[key] ?? key;
}

export function useTranslation() {
  return {
    t: useCallback((key: string) => t(key), []),
    locale: currentLocale,
  };
}
