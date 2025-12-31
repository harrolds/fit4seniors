import type { ComponentType } from 'react';
import type { ScreenAction } from '../core/screenConfig';
import { TrainierenModule } from '../features/trainieren';
import { TrainingInfoModule } from '../modules/trainingInfo';
import { CompletionModule } from '../modules/completion';
import { ProgressModule } from '../modules/progress';
import { RemindersModule } from '../modules/reminders';
import { ProfileModule } from '../modules/profile';
import { SettingsModule } from '../modules/settings';
import { MoreModule } from '../modules/more';
import { AccountModule } from '../modules/account';
import {
  BalanceWidget,
  CardioWidget,
  HomeHeroWidget,
  BrainWidget,
  MuscleWidget,
  RecentTrainingWidget,
} from './homeWidgetComponents';
import { BrainModule } from '../modules/brain';

export interface ModuleDefinition {
  id: string;
  labelKey: string;
  routeBase: string;
  hasHomeWidget: boolean;
  hasSettings: boolean;
  settingsRoute?: string;
  component: ComponentType;
  categoryType?: 'training' | 'info' | 'profile' | 'settings';
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
    id: 'home-brain',
    labelKey: 'trainieren.brain.title',
    routeBase: '/home/brain',
    hasHomeWidget: true,
    hasSettings: false,
    component: BrainWidget,
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
    id: 'brain',
    labelKey: 'trainieren.brain.title',
    routeBase: '/brain/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: BrainModule,
    categoryType: 'training',
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
    id: 'account',
    labelKey: 'account.title',
    routeBase: '/account/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: AccountModule,
    categoryType: 'profile',
  },
  {
    id: 'more',
    labelKey: 'more.title',
    routeBase: '/more/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: MoreModule,
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

