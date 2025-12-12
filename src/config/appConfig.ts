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
  available?: boolean;
  fallbackRoute?: string;
};

export const footerMenu: FooterMenuItem[] = [
  { id: 'home', route: '/', labelKey: 'nav.today', icon: 'home', available: true },
  { id: 'train', route: '/trainings', labelKey: 'nav.train', icon: 'fitness_center', available: false, fallbackRoute: '/' },
  { id: 'brain', route: '/brain', labelKey: 'nav.brain', icon: 'psychology', available: false, fallbackRoute: '/' },
  { id: 'progress', route: '/progress', labelKey: 'nav.progress', icon: 'bar_chart', available: false, fallbackRoute: '/' },
  { id: 'more', route: '/settings', labelKey: 'nav.more', icon: 'more_horiz', available: true },
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