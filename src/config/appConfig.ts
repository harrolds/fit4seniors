export const APP_NAME = 'Fit4Seniors';
export const APP_SHORT_NAME = 'Fit4Seniors';
export const APP_DESCRIPTION = 'Seniorenfreundliche Gesundheits- und Trainings-PWA für Menschen ab 60.';
// Kleurkoppeling naar PWA-manifest en theming
export const THEME_COLOR = '#1B3A57';
export const BACKGROUND_COLOR = '#F7F2E8';
// API-baseline (voor nu nog niet gebruikt)
export const apiBaseUrl: string | undefined = undefined;
// Footer-navigatie (5 tabs): Heute, Übungen, Gehirn, Fortschritt, Mehr
export type FooterMenuItem = {
  id: string;
  route: string;
  labelKey: string;
  icon: string;
};
export const footerMenu: FooterMenuItem[] = [
  {
    id: 'today',
    route: '/today',
    labelKey: 'app.nav.today',
    icon: 'today',
  },
  {
    id: 'exercises',
    route: '/exercises',
    labelKey: 'app.nav.exercises',
    icon: 'exercise',
  },
  {
    id: 'brain',
    route: '/brain',
    labelKey: 'app.nav.brain',
    icon: 'brain',
  },
  {
    id: 'progress',
    route: '/progress',
    labelKey: 'app.nav.progress',
    icon: 'progress',
  },
  {
    id: 'more',
    route: '/more',
    labelKey: 'app.nav.more',
    icon: 'more',
  },
];
// Branding-object dat door AppShell + PWA-config gebruikt wordt
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