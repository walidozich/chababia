import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getPref, setPref, keys } from '../storage/prefs';
import { defaultLocale, type Locale } from '../i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => Promise<void>;
  loaded: boolean;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: async () => {},
  loaded: false,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
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

  return (
    <LocaleContext.Provider value={{ locale, setLocale, loaded }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext(): LocaleContextValue {
  return useContext(LocaleContext);
}
