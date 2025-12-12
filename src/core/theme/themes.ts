import { APP_BRAND } from '../../config/appConfig';
import type { ThemeDefinition, ThemePreference } from './themeContract';

export type ThemeName = 'lightDefault' | 'darkDefault';

const baseTypography = {
  fontFamily: "var(--font-family-base)",
  fontSizes: {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    md: 'var(--font-size-md)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    normal: 1.6,
    snug: 1.4,
  },
} as const;

const baseSpacing = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
} as const;

const baseRadii = {
  xs: 'var(--radius-sm)',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  pill: 'var(--radius-pill)',
} as const;

const baseShadows = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
} as const;

export const lightDefault: ThemeDefinition = {
  name: 'lightDefault',
  mode: 'light',
  colors: {
    primary: 'var(--color-primary)',
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    textPrimary: 'var(--color-text-primary)',
    textSecondary: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    accent: 'var(--color-accent)',
    overlay: 'var(--color-overlay)',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  radii: baseRadii,
  shadows: baseShadows,
  components: {
    button: {
      primary: {
        background: 'var(--color-primary)',
        text: 'var(--color-on-primary)',
        border: 'var(--color-primary)',
        hoverBackground: 'var(--color-primary-strong)',
        activeBackground: 'var(--color-primary-stronger)',
        shadow: baseShadows.sm,
        activeShadow: baseShadows.md,
      },
      secondary: {
        background: 'var(--color-surface)',
        text: 'var(--color-text-primary)',
        border: 'var(--color-border)',
        hoverBackground: 'var(--color-background)',
        activeBackground: 'var(--color-divider)',
        shadow: baseShadows.sm,
        activeShadow: baseShadows.md,
      },
      ghost: {
        background: 'transparent',
        text: 'var(--color-text-primary)',
        border: 'transparent',
        hoverBackground: 'var(--color-ghost-hover)',
        activeBackground: 'var(--color-ghost-active)',
      },
    },
    card: {
      background: 'var(--color-card)',
      border: 'var(--color-border)',
      shadow: baseShadows.sm,
    },
    input: {
      background: 'var(--color-surface)',
      border: 'var(--color-border)',
      text: 'var(--color-text-primary)',
      placeholder: 'var(--color-text-muted)',
    },
    navBar: {
      background: 'var(--color-surface-footer)',
      border: 'var(--color-divider)',
      text: 'var(--color-nav-inactive)',
      active: 'var(--color-active)',
      inactive: 'var(--color-nav-inactive)',
    },
    header: {
      background: 'var(--color-surface)',
      border: 'var(--color-border)',
      text: 'var(--color-text-primary)',
    },
  },
};

export const darkDefault: ThemeDefinition = {
  name: 'darkDefault',
  mode: 'light',
  colors: {
    primary: 'var(--color-primary)',
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    textPrimary: 'var(--color-text-primary)',
    textSecondary: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    accent: 'var(--color-accent)',
    overlay: 'var(--color-overlay)',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  radii: baseRadii,
  shadows: baseShadows,
  components: {
    button: {
      primary: {
        background: 'var(--color-primary)',
        text: 'var(--color-on-primary)',
        border: 'var(--color-primary)',
        hoverBackground: 'var(--color-primary-strong)',
        activeBackground: 'var(--color-primary-stronger)',
        shadow: baseShadows.sm,
        activeShadow: baseShadows.md,
      },
      secondary: {
        background: 'var(--color-surface)',
        text: 'var(--color-text-primary)',
        border: 'var(--color-border)',
        hoverBackground: 'var(--color-background)',
        activeBackground: 'var(--color-divider)',
        shadow: baseShadows.sm,
        activeShadow: baseShadows.md,
      },
      ghost: {
        background: 'transparent',
        text: 'var(--color-text-primary)',
        border: 'transparent',
        hoverBackground: 'var(--color-ghost-hover)',
        activeBackground: 'var(--color-ghost-active)',
      },
    },
    card: {
      background: 'var(--color-card)',
      border: 'var(--color-border)',
      shadow: baseShadows.sm,
    },
    input: {
      background: 'var(--color-surface)',
      border: 'var(--color-border)',
      text: 'var(--color-text-primary)',
      placeholder: 'var(--color-text-muted)',
    },
    navBar: {
      background: 'var(--color-surface-footer)',
      border: 'var(--color-divider)',
      text: 'var(--color-nav-inactive)',
      active: 'var(--color-active)',
      inactive: 'var(--color-nav-inactive)',
    },
    header: {
      background: 'var(--color-surface)',
      border: 'var(--color-border)',
      text: 'var(--color-text-primary)',
    },
  },
};

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'light';

export const themes: Record<ThemeName, ThemeDefinition> = {
  lightDefault,
  darkDefault,
};

