import React from 'react';
import { homeWidgets } from '../../config/homeWidgets';
import type { HomeWidgetConfig } from '../../config/homeWidgets';
import { useI18n } from '../../shared/lib/i18n';
import { getModuleById } from '../../shared/lib/modules';

export const WidgetHost: React.FC = () => {
  const { t } = useI18n();

  const sortedWidgets: HomeWidgetConfig[] = [...homeWidgets].sort((a, b) => {
    const aPriority = typeof a.priority === 'number' ? a.priority : 0;
    const bPriority = typeof b.priority === 'number' ? b.priority : 0;
    return aPriority - bPriority;
  });

  if (sortedWidgets.length === 0) {
    return null;
  }

  return (
    <div
      className="home-widget-grid"
      aria-label={t('home.widgets.ariaLabel')}
    >
      {sortedWidgets.map((widget) => {
        const moduleDefinition = getModuleById(widget.moduleId);

        if (!moduleDefinition || !moduleDefinition.hasHomeWidget) {
          return null;
        }

        const ModuleComponent = moduleDefinition.component;

        const spanClass =
          widget.span === 2 ? ' home-widget-grid__item--span-2' : '';

        return (
          <section
            key={widget.id}
            className={`home-widget-grid__item${spanClass}`}
            aria-label={t(moduleDefinition.labelKey)}
          >
            <ModuleComponent />
          </section>
        );
      })}
    </div>
  );
};
