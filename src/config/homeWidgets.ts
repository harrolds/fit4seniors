export interface HomeWidgetConfig {
  id: string;
  moduleId: string;
  priority?: number;
  span?: 1 | 2;
}

export const homeWidgets: HomeWidgetConfig[] = [
  {
    id: 'hero',
    moduleId: 'hero-widget',
    priority: 1,
    span: 2,
  },
  {
    id: 'goal',
    moduleId: 'goal-widget',
    priority: 2,
    span: 1,
  },
  {
    id: 'brain',
    moduleId: 'brain-widget',
    priority: 3,
    span: 1,
  },
  {
    id: 'last-session',
    moduleId: 'last-session-widget',
    priority: 4,
    span: 2,
  },
];

