import React from 'react';
import type { ThemeDefinition, ThemeMode, ThemePreference } from './themeContract';
import { lightDefault } from './themes';

export const DEFAULT_THEME = lightDefault;
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'light';

export type ThemeContextValue = {
  theme: ThemeDefinition;
  preference: ThemePreference;
  resolvedMode: ThemeMode;
  setPreference: (preference: ThemePreference) => void;
};

export const ThemeContext = React.createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  preference: DEFAULT_THEME_PREFERENCE,
  resolvedMode: DEFAULT_THEME.mode,
  setPreference: () => undefined,
});

export const useThemeContext = (): ThemeContextValue => {
  return React.useContext(ThemeContext);
};

export const useTheme = (): ThemeDefinition => {
  return useThemeContext().theme;
};

export const useThemeController = (): ThemeContextValue => {
  return useThemeContext();
};



