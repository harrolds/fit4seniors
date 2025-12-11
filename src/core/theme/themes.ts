import { APP_BRAND } from '../../config/appConfig';
import type { ThemeDefinition, ThemePreference } from './themeContract';

const brandPrimary = APP_BRAND.primaryColor || '#2563eb';
const brandPrimaryDark = APP_BRAND.primaryColor ? APP_BRAND.primaryColor : '#60a5fa';

export type ThemeName = 'lightDefault' | 'darkDefault';

const baseTypography = {
  fontFamily:
    "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSizes: {
    xs: '0.875rem',
    sm: '1rem',
    md: '1.125rem',
    lg: '1.375rem',
    xl: '1.75rem',
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    normal: 1.6,
    snug: 1.45,
  },
} as const;

const baseSpacing = {
  xs: '0.35rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
} as const;

const baseRadii = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1.25rem',
  lg: '1.5rem',
  xl: '1.75rem',
  pill: '9999px',
} as const;

const baseShadows = {
  sm: '0 6px 18px rgba(27, 58, 87, 0.08)',
  md: '0 14px 36px rgba(27, 58, 87, 0.14)',
} as const;

export const lightDefault: ThemeDefinition = {
  name: 'lightDefault',
  mode: 'light',
  colors: {
    primary: brandPrimary,
    background: '#F7F2E8',
    surface: '#ffffff',
    textPrimary: '#1B3A57',
    textSecondary: '#3b5871',
    border: '#e3d8cc',
    success: '#75967f',
    warning: '#f6b16d',
    error: '#d75a53',
    accent: '#f6b16d',
    overlay: 'rgba(27, 58, 87, 0.32)',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  radii: baseRadii,
  shadows: baseShadows,
  components: {
    button: {
      primary: {
        background: '#f6b16d',
        text: '#ffffff',
        border: '#efaa62',
        hoverBackground: '#f3a45b',
        activeBackground: '#e79650',
        shadow: baseShadows.sm,
        activeShadow: baseShadows.md,
      },
      secondary: {
        background: '#ffffff',
        text: '#1B3A57',
        border: '#d4c8bb',
        hoverBackground: '#f0e7db',
        activeBackground: '#e6d7c8',
        shadow: baseShadows.sm,
        activeShadow: baseShadows.md,
      },
      ghost: {
        background: 'transparent',
        text: '#1B3A57',
        border: 'transparent',
        hoverBackground: 'rgba(27, 58, 87, 0.06)',
        activeBackground: 'rgba(27, 58, 87, 0.12)',
      },
    },
    card: {
      background: '#ffffff',
      border: '#e3d8cc',
      shadow: baseShadows.sm,
    },
    input: {
      background: '#ffffff',
      border: '#e3d8cc',
      text: '#1B3A57',
      placeholder: '#3b5871',
    },
    navBar: {
      background: '#ffffff',
      border: '#e3d8cc',
      text: '#3b5871',
      active: brandPrimary,
    },
    header: {
      background: '#F7F2E8',
      border: '#e3d8cc',
      text: '#1B3A57',
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

