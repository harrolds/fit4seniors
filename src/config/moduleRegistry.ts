import type { ComponentType } from 'react';
import type { ScreenAction } from '../core/screenConfig';
import { TrainierenModule } from '../features/trainieren';

export interface ModuleDefinition {
  id: string;
  labelKey: string;
  routeBase: string;
  hasHomeWidget: boolean;
  hasSettings: boolean;
  settingsRoute?: string;
  component: ComponentType;
  headerActions?: {
    primaryActions?: ScreenAction[];
    menuActions?: ScreenAction[];
  };
}

export const moduleRegistry: ModuleDefinition[] = [
  {
    id: 'trainieren',
    labelKey: 'trainieren.title',
    routeBase: '/trainieren/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: TrainierenModule,
  },
];

