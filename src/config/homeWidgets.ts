// Contract: Home widgets list with id/moduleId/optional priority and span (1 or 2) consumed by WidgetHost and moduleRegistry.
export interface HomeWidgetConfig {
  id: string;
  moduleId: string;
  priority?: number;
  span?: 1 | 2;
}

export const homeWidgets: HomeWidgetConfig[] = [
  { id: 'start-exercise', moduleId: 'home-start', priority: 1, span: 2 },
  { id: 'cardio', moduleId: 'home-cardio', priority: 2 },
  { id: 'muscle', moduleId: 'home-muscle', priority: 3 },
  { id: 'balance', moduleId: 'home-balance', priority: 4 },
  { id: 'recent', moduleId: 'home-recent', priority: 5, span: 2 },
];

