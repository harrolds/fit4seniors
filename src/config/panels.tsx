/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import type { PanelType } from '../core/panels/PanelHost';

export type PanelRegistryEntry = {
  id: string;
  type: PanelType;
  component: React.ComponentType<any>;
};

import { FilterSheet } from '../features/trainieren/FilterSheet';
import { SessionInterruptSheet } from '../features/trainieren/SessionInterruptSheet';
import { TrainingInfoPanelContent } from '../modules/trainingInfo';
import { NotificationsCenterSheet } from '../modules/reminders';
import { ReminderToastPanel } from '../modules/reminders/panels/ReminderToastPanel';
import { SettingsRemindersSheet } from '../modules/reminders/panels/SettingsRemindersSheet';
import { SettingsBottomToastHost } from '../modules/settings/bottomToast/SettingsBottomToastHost';
import { InfoPanelContent } from '../modules/more/panels/InfoPanelContent';

const MoreHelpPanel: React.FC = (props) => <InfoPanelContent variant="help" {...props} />;
const MorePrivacyPanel: React.FC = (props) => <InfoPanelContent variant="privacy" {...props} />;
const MoreSafetyPanel: React.FC = (props) => <InfoPanelContent variant="safety" {...props} />;
const MoreAboutPanel: React.FC = (props) => <InfoPanelContent variant="about" {...props} />;

/**
 * Lege registry voor runtime-panels.
 * De infrastructuur blijft intact; app-specifieke panels
 * (bijv. Fit4Seniors) kunnen hier later worden geregistreerd.
 */
export const panelRegistry: PanelRegistryEntry[] = [
  {
    id: 'trainieren-filter',
    type: 'bottom',
    component: FilterSheet,
  },
  {
    id: 'trainieren-session-interrupt',
    type: 'bottom',
    component: SessionInterruptSheet,
  },
  {
    id: 'training-info',
    type: 'right',
    component: TrainingInfoPanelContent,
  },
  {
    id: 'more-help',
    type: 'right',
    component: MoreHelpPanel,
  },
  {
    id: 'more-privacy',
    type: 'right',
    component: MorePrivacyPanel,
  },
  {
    id: 'more-safety',
    type: 'right',
    component: MoreSafetyPanel,
  },
  {
    id: 'more-about',
    type: 'right',
    component: MoreAboutPanel,
  },
  {
    id: 'notifications-center',
    type: 'bottom',
    component: NotificationsCenterSheet,
  },
  {
    id: 'settings-bottom-toast',
    type: 'bottom',
    component: SettingsBottomToastHost,
  },
  {
    id: 'reminders-toast',
    type: 'bottom',
    component: ReminderToastPanel,
  },
  {
    id: 'settings-reminders',
    type: 'bottom',
    component: SettingsRemindersSheet,
  },
];
