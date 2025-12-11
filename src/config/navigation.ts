import type { ScreenConfig } from '../core/screenConfig';

/**
 * Central registry for screen configuration used by the app shell.
 */
export const screenConfigs: ScreenConfig[] = [
  {
    id: 'home',
    route: '/',
    titleKey: 'home.title',
    actions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        navigationTarget: 'notifications',
      },
      {
        id: 'openSettings',
        labelKey: 'app.header.settings',
        icon: 'settings',
        navigationTarget: 'settings',
      },
    ],
  },
  {
    id: 'notifications',
    route: '/notifications',
    titleKey: 'notifications.title',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        navigationTarget: 'home',
      },
    ],
  },
  {
    id: 'settings',
    route: '/settings',
    titleKey: 'settings.title',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        navigationTarget: 'home',
      },
    ],
  },
];

/**
 * Resolve the screen configuration for a given path.
 */
export const getScreenConfigByPath = (path: string): ScreenConfig | undefined => {
  const normalizedPath = path || '/';
  return screenConfigs.find((screen) => screen.route === normalizedPath);
};
