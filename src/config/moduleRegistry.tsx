import type { ComponentType } from 'react';
import type { ScreenAction } from '../core/screenConfig';
import { TrainierenModule } from '../features/trainieren';
import { TrainingInfoModule } from '../modules/trainingInfo';
import { CompletionModule } from '../modules/completion';
import { ProgressModule } from '../modules/progress';
import { BrainModule } from '../modules/brain';
import { RemindersModule } from '../modules/reminders';
import { ProfileModule } from '../modules/profile';
import { SettingsModule } from '../modules/settings';
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
  {
    id: 'brain',
    labelKey: 'brain.title',
    routeBase: '/brain/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: BrainModule,
  },
  {
    id: 'completion',
    labelKey: 'completion.title',
    routeBase: '/completion/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: CompletionModule,
  },
  {
    id: 'progress',
    labelKey: 'progress.title',
    routeBase: '/progress/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: ProgressModule,
  },
  {
    id: 'reminders',
    labelKey: 'reminders.title',
    routeBase: '/reminders/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: RemindersModule,
  },
  {
    id: 'profile',
    labelKey: 'profile.title',
    routeBase: '/profile/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: ProfileModule,
  },
  {
    id: 'settings',
    labelKey: 'settings.title',
    routeBase: '/settings/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: SettingsModule,
  },
];

