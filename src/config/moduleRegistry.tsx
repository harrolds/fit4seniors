import type { ComponentType } from 'react';
import type { ScreenAction } from '../core/screenConfig';
import { TrainierenModule } from '../features/trainieren';
import { TrainingInfoModule } from '../modules/trainingInfo';
import {
  BalanceWidget,
  BrainTrainingWidget,
  CardioWidget,
  HomeHeroWidget,
  MuscleWidget,
  RecentTrainingWidget,
} from './homeWidgetComponents';

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
    id: 'home-start',
    labelKey: 'home.hero.title',
    routeBase: '/home/start',
    hasHomeWidget: true,
    hasSettings: false,
    component: HomeHeroWidget,
  },
  {
    id: 'home-brain',
    labelKey: 'home.widgets.brainTraining.title',
    routeBase: '/home/brain',
    hasHomeWidget: true,
    hasSettings: false,
    component: BrainTrainingWidget,
  },
  {
    id: 'home-cardio',
    labelKey: 'home.widgets.cardio.title',
    routeBase: '/home/cardio',
    hasHomeWidget: true,
    hasSettings: false,
    component: CardioWidget,
  },
  {
    id: 'home-muscle',
    labelKey: 'home.widgets.muscle.title',
    routeBase: '/home/muscle',
    hasHomeWidget: true,
    hasSettings: false,
    component: MuscleWidget,
  },
  {
    id: 'home-balance',
    labelKey: 'home.widgets.balance.title',
    routeBase: '/home/balance',
    hasHomeWidget: true,
    hasSettings: false,
    component: BalanceWidget,
  },
  {
    id: 'home-recent',
    labelKey: 'home.widgets.recent.title',
    routeBase: '/home/recent',
    hasHomeWidget: true,
    hasSettings: false,
    component: RecentTrainingWidget,
  },
  {
    id: 'trainieren',
    labelKey: 'trainieren.title',
    routeBase: '/trainieren/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: TrainierenModule,
  },
  {
    id: 'trainingInfo',
    labelKey: 'trainingInfo.title',
    routeBase: '/training-info/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: TrainingInfoModule,
  },
];

