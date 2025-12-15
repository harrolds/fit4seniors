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
        onClick: { type: 'panel', panelId: 'notifications-center' },
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
    id: 'settings-help',
    route: '/settings/help',
    titleKey: 'settings.help.title',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        navigationTarget: 'settings',
      },
    ],
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'settings', navigationTarget: 'settings' },
    ],
  },
  {
    id: 'settings-detail',
    route: '/settings/:section',
    titleKey: 'settings.detail.header',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        navigationTarget: 'settings',
      },
    ],
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'settings', navigationTarget: 'settings' },
    ],
  },
  {
    id: 'reminders',
    route: '/reminders',
    titleKey: 'reminders.title',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        navigationTarget: 'home',
      },
    ],
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'person', navigationTarget: 'settings' },
    ],
  },
  {
    id: 'profile',
    route: '/profile',
    titleKey: 'profile.title',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        navigationTarget: 'home',
      },
    ],
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'person', navigationTarget: 'settings' },
    ],
  },
  {
    id: 'profile-edit',
    route: '/profile/edit',
    titleKey: 'profile.edit.title',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        navigationTarget: 'profile',
      },
    ],
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'person', navigationTarget: 'settings' },
    ],
  },
  {
    id: 'trainieren-hub',
    route: '/trainieren',
    titleKey: 'trainieren.title',
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'settings', navigationTarget: 'settings' },
    ],
  },
  {
    id: 'brain',
    route: '/brain',
    titleKey: 'brain.header.title',
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'person', navigationTarget: 'settings' },
    ],
  },
  {
    id: 'brain-session',
    route: '/brain/session/:exerciseId',
    titleKey: 'brain.session.headerTitle',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        onClick: { type: 'navigate', target: '/brain' },
      },
    ],
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'person', navigationTarget: 'settings' },
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
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'person', navigationTarget: 'settings' },
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
        icon: 'person',
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
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'person', navigationTarget: 'settings' },
    ],
  },
  {
    id: 'progress-overview',
    route: '/progress',
    titleKey: 'progress.title',
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'person', navigationTarget: 'settings' },
    ],
  },
  {
    id: 'progress-history',
    route: '/progress/history',
    titleKey: 'progress.history.title',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        navigationTarget: 'progress',
      },
    ],
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'person' },
    ],
  },
  {
    id: 'progress-history-detail',
    route: '/progress/history/:id',
    titleKey: 'progress.history.detail.title',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        navigationTarget: 'progress/history',
      },
    ],
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
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
