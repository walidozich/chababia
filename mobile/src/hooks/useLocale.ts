import { useState, useEffect, useCallback } from 'react';
import { getPref, setPref, keys } from '../storage/prefs';
import type { Locale } from '../i18n';
import { defaultLocale } from '../i18n';

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getPref<Locale>(keys.locale).then((stored) => {
      if (stored) setLocaleState(stored);
      setLoaded(true);
    });
  }, []);

  const setLocale = useCallback(async (next: Locale) => {
    setLocaleState(next);
    await setPref(keys.locale, next);
  }, []);

  return { locale, setLocale, loaded };
}
