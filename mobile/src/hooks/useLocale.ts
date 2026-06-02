import { useCallback, useMemo, useEffect } from 'react';
import { setLocale, getLocale, t as translate } from '../i18n/index';
import { getLanguage, setLanguage } from '../storage/prefs';

type Locale = 'fr' | 'ar' | 'tzm';

export function useLocale() {
  useEffect(() => {
    getLanguage().then((saved) => {
      if (saved) {
        setLocale(saved);
      }
    });
  }, []);

  const changeLocale = useCallback(async (locale: Locale) => {
    setLocale(locale);
    await setLanguage(locale);
  }, []);

  const t = useCallback((key: string) => translate(key), []);

  return useMemo(
    () => ({ t, locale: getLocale() as Locale, changeLocale }),
    [t, changeLocale]
  );
}
