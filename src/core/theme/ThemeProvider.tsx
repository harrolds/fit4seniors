import React from 'react';
import { getValue, setValue } from '../../shared/lib/storage';
import type { ThemeDefinition, ThemeMode, ThemePreference } from './themeContract';
import { DEFAULT_THEME_PREFERENCE, darkDefault, lightDefault } from './themes';

const THEME_STORAGE_KEY = 'theme-preference';

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

const getSystemMode = (): ThemeMode => {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const loadPreference = (): ThemePreference => {
  const stored = getValue<ThemePreference>(THEME_STORAGE_KEY, DEFAULT_THEME_PREFERENCE);

  if (stored === 'system' || stored === 'light' || stored === 'dark') {
    return stored;
  }

  return DEFAULT_THEME_PREFERENCE;
};

const applyThemeToDocument = (theme: ThemeDefinition): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  const setVar = (name: string, value: string | number) => {
    root.style.setProperty(name, String(value));
  };

  const { colors, typography, spacing, radii, shadows } = theme;

  setVar('--color-primary', colors.primary);
  setVar('--color-background', colors.background);
  setVar('--color-surface', colors.surface);
  setVar('--color-text-primary', colors.textPrimary);
  setVar('--color-text-secondary', colors.textSecondary);
  setVar('--color-border', colors.border);
  setVar('--color-success', colors.success);
  setVar('--color-warning', colors.warning);
  setVar('--color-error', colors.error);

  if (colors.accent) {
    setVar('--color-accent', colors.accent);
  }

  if (colors.overlay) {
    setVar('--color-overlay', colors.overlay);
  }

  setVar('--font-family-base', typography.fontFamily);
  setVar('--font-size-xs', typography.fontSizes.xs);
  setVar('--font-size-sm', typography.fontSizes.sm);
  setVar('--font-size-md', typography.fontSizes.md);
  setVar('--font-size-lg', typography.fontSizes.lg);
  setVar('--font-size-xl', typography.fontSizes.xl);

  setVar('--font-weight-regular', typography.fontWeights.regular);
  setVar('--font-weight-medium', typography.fontWeights.medium);
  setVar('--font-weight-semibold', typography.fontWeights.semibold);
  setVar('--font-weight-bold', typography.fontWeights.bold);

  setVar('--line-height-normal', typography.lineHeights.normal);
  setVar('--line-height-snug', typography.lineHeights.snug);

  setVar('--spacing-xs', spacing.xs);
  setVar('--spacing-sm', spacing.sm);
  setVar('--spacing-md', spacing.md);
  setVar('--spacing-lg', spacing.lg);
  setVar('--spacing-xl', spacing.xl);

  setVar('--radius-xs', radii.xs);
  setVar('--radius-sm', radii.sm);
  setVar('--radius-md', radii.md);
  setVar('--radius-lg', radii.lg);
  setVar('--radius-xl', radii.xl);
  setVar('--radius-pill', radii.pill);

  setVar('--shadow-sm', shadows.sm);
  setVar('--shadow-md', shadows.md);

  root.dataset.theme = theme.name;
  root.dataset.colorScheme = theme.mode;
  root.style.colorScheme = theme.mode;

  document.body.style.backgroundColor = colors.background;
  document.body.style.color = colors.textPrimary;
  document.body.style.fontFamily = typography.fontFamily;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreferenceState] = React.useState<ThemePreference>(() => loadPreference());
  const [systemMode, setSystemMode] = React.useState<ThemeMode>(() => getSystemMode());

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemMode(event.matches ? 'dark' : 'light');
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const resolvedMode: ThemeMode = preference === 'system' ? systemMode : preference;
  const theme = resolvedMode === 'dark' ? darkDefault : lightDefault;

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

