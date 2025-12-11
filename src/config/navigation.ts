import type { ScreenConfig } from '../core/screenConfig';
/**
 * Centrale registry voor screen-configuraties die de AppShell gebruikt.
 */
export const screenConfigs: ScreenConfig[] = [
  {
    id: 'today',
    route: '/today',
    titleKey: 'app.nav.today',
  },
  {
    id: 'exercises',
    route: '/exercises',
    titleKey: 'app.nav.exercises',
  },
  {
    id: 'brain',
    route: '/brain',
    titleKey: 'app.nav.brain',
  },
  {
    id: 'progress',
    route: '/progress',
    titleKey: 'app.nav.progress',
  },
  {
    id: 'more',
    route: '/more',
    titleKey: 'app.nav.more',
  },
  {
    id: 'settings',
    route: '/settings',
    titleKey: 'settings.title',
  },
  {
    id: 'offline',
    route: '/offline',
    titleKey: 'offline.title',
  },
];
/**
 * Resolve de screenconfig voor een gegeven pad.
 */
export const getScreenConfigByPath = (path: string): ScreenConfig | undefined => {
  const normalizedPath = path || '/today';
  return screenConfigs.find((screen) => screen.route === normalizedPath);
};
