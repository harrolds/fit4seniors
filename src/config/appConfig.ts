export const APP_NAME = 'Fit4Seniors';
export const APP_SHORT_NAME = 'Fit4Seniors';
export const APP_DESCRIPTION = 'Seniorenfreundliche Trainings- und Gesundheits-App.';
export const THEME_COLOR = '#88b0a5';
export const BACKGROUND_COLOR = '#fff5e3';

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
  { id: 'train', route: '/trainieren', labelKey: 'nav.train', icon: 'fitness_center', available: true },
  { id: 'brain', route: '/brain', labelKey: 'nav.brain', icon: 'psychology', available: true },
  { id: 'progress', route: '/progress', labelKey: 'nav.progress', icon: 'bar_chart', available: true, fallbackRoute: '/' },
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
  primaryColor: THEME_COLOR,
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