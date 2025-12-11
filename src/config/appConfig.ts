export const APP_NAME = 'PWA Skeleton v2';
export const APP_SHORT_NAME = 'Skeleton v2';
export const APP_DESCRIPTION = 'Baseline PWA skeleton for the PWA Factory.';
export const THEME_COLOR = '#111827';
export const BACKGROUND_COLOR = '#000000';

export const apiBaseUrl: string | undefined = undefined;

export type FooterMenuItem = {
  id: string;
  route: string;
  labelKey: string;
  icon: string;
};

export const footerMenu: FooterMenuItem[] = [
  { id: 'home', route: '/', labelKey: 'nav.home', icon: 'home' },
  { id: 'notifications', route: '/notifications', labelKey: 'nav.notifications', icon: 'notifications' },
  { id: 'settings', route: '/settings', labelKey: 'nav.settings', icon: 'settings' },
];

export type AppBranding = {
  appName: string;
  shortName: string;
  description: string;
  primaryColor: string;
  logoPath: string;
};

export const APP_BRAND: AppBranding = {
  appName: APP_NAME,
  shortName: APP_SHORT_NAME,
  description: APP_DESCRIPTION,
  primaryColor: '#2563eb',
  logoPath: '/icons/pwa-192x192.png',
};

export interface TelemetryConfig {
  endpoint?: string;
  enabledByDefault: boolean;
  sampleRate: number;
}

export const DEFAULT_TELEMETRY_CONFIG: TelemetryConfig = {
  endpoint: undefined,
  enabledByDefault: true,
  sampleRate: 1,
};