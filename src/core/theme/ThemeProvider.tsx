import React from 'react';
import { setValue } from '../../shared/lib/storage';
import type { ThemeDefinition, ThemeMode, ThemePreference } from './themeContract';
import {
  DEFAULT_THEME,
  DEFAULT_THEME_PREFERENCE,
  ThemeContext,
  type ThemeContextValue,
} from './themeContext';

const THEME_STORAGE_KEY = 'theme-preference';

const applyThemeToDocument = (theme: ThemeDefinition): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  root.dataset.theme = theme.name;
  root.dataset.colorScheme = 'light';
  root.style.colorScheme = 'light';

  document.body.style.backgroundColor = 'var(--color-background)';
  document.body.style.color = 'var(--color-text-primary)';
  document.body.style.fontFamily = 'var(--font-family-base)';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreferenceState] = React.useState<ThemePreference>(() => DEFAULT_THEME_PREFERENCE);
  const resolvedMode: ThemeMode = 'light';
  const theme = DEFAULT_THEME;

  React.useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setPreference = React.useCallback((nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference);
    setValue(THEME_STORAGE_KEY, nextPreference);
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      preference,
      resolvedMode,
      setPreference,
    }),
    [preference, resolvedMode, setPreference, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

