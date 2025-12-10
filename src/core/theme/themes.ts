import { APP_BRAND } from '../../config/appConfig';
import type { ThemeDefinition, ThemePreference } from './themeContract';

const brandPrimary = APP_BRAND.primaryColor || '#2563eb';
const brandPrimaryDark = APP_BRAND.primaryColor ? APP_BRAND.primaryColor : '#60a5fa';

export type ThemeName = 'lightDefault' | 'darkDefault';

const baseTypography = {
  fontFamily:
    "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    normal: 1.5,
    snug: 1.4,
  },
} as const;

const baseSpacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
} as const;

const baseRadii = {
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  pill: '9999px',
} as const;

const baseShadows = {
  sm: '0 1px 2px rgba(15, 23, 42, 0.06)',
  md: '0 4px 10px rgba(15, 23, 42, 0.12)',
} as const;

export const lightDefault: ThemeDefinition = {
  name: 'lightDefault',
  mode: 'light',
  colors: {
    primary: brandPrimary,
    background: '#f4f4f5',
    surface: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    border: '#e4e4e7',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    accent: '#22c55e',
    overlay: 'rgba(15, 23, 42, 0.45)',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  radii: baseRadii,
  shadows: baseShadows,
  components: {
    button: {
      primary: {
        background: brandPrimary,
        text: '#ffffff',
        border: brandPrimary,
        hoverBackground: '#1d4ed8',
        activeBackground: '#1e40af',
        shadow: baseShadows.sm,
        activeShadow: baseShadows.md,
      },
      secondary: {
        background: '#f8fafc',
        text: '#0f172a',
        border: '#e4e4e7',
        hoverBackground: '#e2e8f0',
        activeBackground: '#cbd5e1',
        shadow: baseShadows.sm,
        activeShadow: baseShadows.md,
      },
      ghost: {
        background: 'transparent',
        text: '#0f172a',
        border: 'transparent',
        hoverBackground: 'rgba(15, 23, 42, 0.04)',
        activeBackground: 'rgba(15, 23, 42, 0.08)',
      },
    },
    card: {
      background: '#ffffff',
      border: '#e4e4e7',
      shadow: baseShadows.sm,
    },
    input: {
      background: '#ffffff',
      border: '#e4e4e7',
      text: '#0f172a',
      placeholder: '#64748b',
    },
    navBar: {
      background: '#ffffff',
      border: '#e4e4e7',
      text: '#475569',
      active: brandPrimary,
    },
    header: {
      background: '#ffffff',
      border: '#e4e4e7',
      text: '#0f172a',
    },
  },
};

export const darkDefault: ThemeDefinition = {
  name: 'darkDefault',
  mode: 'dark',
  colors: {
    primary: brandPrimaryDark,
    background: '#0b1220',
    surface: '#111827',
    textPrimary: '#e5e7eb',
    textSecondary: '#cbd5e1',
    border: '#1f2937',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#f87171',
    accent: '#38bdf8',
    overlay: 'rgba(8, 15, 30, 0.7)',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  radii: baseRadii,
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.45)',
    md: '0 6px 16px rgba(0, 0, 0, 0.55)',
  },
  components: {
    button: {
      primary: {
        background: brandPrimaryDark,
        text: '#0b1220',
        border: brandPrimaryDark,
        hoverBackground: brandPrimaryDark,
        activeBackground: '#3b82f6',
        shadow: '0 1px 3px rgba(0, 0, 0, 0.45)',
        activeShadow: '0 6px 16px rgba(0, 0, 0, 0.55)',
      },
      secondary: {
        background: '#1f2937',
        text: '#e5e7eb',
        border: '#334155',
        hoverBackground: '#273449',
        activeBackground: '#334155',
        shadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
        activeShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
      },
      ghost: {
        background: 'transparent',
        text: '#e5e7eb',
        border: 'transparent',
        hoverBackground: 'rgba(255, 255, 255, 0.06)',
        activeBackground: 'rgba(255, 255, 255, 0.12)',
      },
    },
    card: {
      background: '#111827',
      border: '#1f2937',
      shadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
    },
    input: {
      background: '#0f172a',
      border: '#1f2937',
      text: '#e5e7eb',
      placeholder: '#94a3b8',
    },
    navBar: {
      background: '#0f172a',
      border: '#1f2937',
      text: '#cbd5e1',
      active: brandPrimaryDark,
    },
    header: {
      background: '#0f172a',
      border: '#1f2937',
      text: '#e5e7eb',
    },
  },
};

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';

export const themes: Record<ThemeName, ThemeDefinition> = {
  lightDefault,
  darkDefault,
};

