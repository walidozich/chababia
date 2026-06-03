import { useLocaleContext } from '../theme/LocaleContext';
import type { Locale } from '../i18n';

export function useLocale() {
  const { locale, setLocale, loaded } = useLocaleContext();
  return { locale, setLocale, loaded };
}

export type { Locale };
