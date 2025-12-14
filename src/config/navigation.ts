import { matchPath } from 'react-router-dom';
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
  {
    id: 'trainieren-hub',
    route: '/trainieren',
    titleKey: 'trainieren.title',
    primaryActions: [
      { id: 'openNotifications', labelKey: 'app.header.notifications', icon: 'notifications' },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'settings' },
    ],
  },
  {
    id: 'trainieren-module',
    route: '/trainieren/:moduleId',
    titleKey: 'trainieren.title',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
      },
    ],
    primaryActions: [
      { id: 'openNotifications', labelKey: 'app.header.notifications', icon: 'notifications' },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'settings' },
    ],
  },
  {
    id: 'trainieren-detail',
    route: '/trainieren/:moduleId/:trainingId/:intensity',
    titleKey: 'trainieren.detail.headerTitle',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        onClick: { type: 'custom', handlerId: 'trainieren-detail-guard' },
      },
    ],
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'custom', handlerId: 'trainieren-detail-guard' },
      },
      {
        id: 'openSettings',
        labelKey: 'app.header.settings',
        icon: 'settings',
        onClick: { type: 'custom', handlerId: 'trainieren-detail-guard' },
      },
    ],
  },
  {
    id: 'completion',
    route: '/completion',
    titleKey: 'completion.title',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
      },
    ],
    primaryActions: [
      { id: 'openNotifications', labelKey: 'app.header.notifications', icon: 'notifications' },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'person' },
    ],
  },
];

/**
 * Resolve the screen configuration for a given path.
 */
export const getScreenConfigByPath = (path: string): ScreenConfig | undefined => {
  const normalizedPath = path || '/';
  return screenConfigs.find((screen) => matchPath({ path: screen.route, end: true }, normalizedPath));
};
