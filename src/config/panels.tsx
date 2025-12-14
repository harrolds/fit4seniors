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
];
