import React from 'react';
import { setValue } from '../../shared/lib/storage';
import type { ThemeDefinition, ThemeMode, ThemePreference } from './themeContract';
import { lightDefault } from './themes';

const THEME_STORAGE_KEY = 'theme-preference';
const DEFAULT_THEME_PREFERENCE: ThemePreference = 'light';

type ThemeContextValue = {
  theme: ThemeDefinition;
  preference: ThemePreference;
  resolvedMode: ThemeMode;
  setPreference: (preference: ThemePreference) => void;
};

const DEFAULT_THEME = lightDefault;

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  preference: DEFAULT_THEME_PREFERENCE,
  resolvedMode: DEFAULT_THEME.mode,
  setPreference: () => undefined,
});

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
  const [preference, setPreferenceState] = React.useState<ThemePreference>(() => 'light');
  const resolvedMode: ThemeMode = 'light';
  const theme = lightDefault;

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

export const useThemeContext = (): ThemeContextValue => {
  return React.useContext(ThemeContext);
};

export const useTheme = (): ThemeDefinition => {
  const context = React.useContext(ThemeContext);
  return context.theme;
};

export const useThemeController = (): ThemeContextValue => {
  return React.useContext(ThemeContext);
};

