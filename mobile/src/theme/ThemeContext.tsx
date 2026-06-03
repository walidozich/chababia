import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { lightColors, darkColors, type ThemeColors } from './colors';
import { getPref, setPref, keys } from '../storage/prefs';

interface ThemeContextValue {
  isDark: boolean;
  colors: ThemeColors;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  colors: lightColors,
  toggleDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    getPref<boolean>(keys.darkMode).then((stored) => {
      if (stored !== null) {
        setIsDark(stored);
      } else {
        setIsDark(true);
      }
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      setPref(keys.darkMode, next);
      return next;
    });
  }, []);

  if (isDark === null) return null;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors: isDark ? darkColors : lightColors,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

export { type ThemeColors };
