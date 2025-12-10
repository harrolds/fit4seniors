/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import type { PanelType } from '../core/panels/PanelHost';

export type PanelRegistryEntry = {
  id: string;
  type: PanelType;
  component: React.ComponentType<any>;
};

/**
 * Lege registry voor runtime-panels.
 * De infrastructuur blijft intact; app-specifieke panels
 * (bijv. Fit4Seniors) kunnen hier later worden geregistreerd.
 */
export const panelRegistry: PanelRegistryEntry[] = [];
