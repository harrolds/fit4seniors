import type { ComponentType } from 'react';
import type { ScreenAction } from '../core/screenConfig';
import { HeroWidget } from '../modules/today/HeroWidget';
import { GoalWidget } from '../modules/today/GoalWidget';
import { BrainWidget } from '../modules/today/BrainWidget';
import { LastSessionWidget } from '../modules/today/LastSessionWidget';


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
    id: 'hero-widget',
    labelKey: 'today.hero',
    routeBase: '/today',
    hasHomeWidget: true,
    hasSettings: false,
    component: HeroWidget,
  },
  {
    id: 'goal-widget',
    labelKey: 'today.goal',
    routeBase: '/today',
    hasHomeWidget: true,
    hasSettings: false,
    component: GoalWidget,
  },
  {
    id: 'brain-widget',
    labelKey: 'today.brain',
    routeBase: '/today',
    hasHomeWidget: true,
    hasSettings: false,
    component: BrainWidget,
  },
  {
    id: 'last-session-widget',
    labelKey: 'today.lastsession',
    routeBase: '/today',
    hasHomeWidget: true,
    hasSettings: false,
    component: LastSessionWidget,
  },
];


