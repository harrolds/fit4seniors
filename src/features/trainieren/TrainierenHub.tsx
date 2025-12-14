import React from 'react';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useI18n } from '../../shared/lib/i18n';
import { Icon } from '../../shared/ui/Icon';
import { ModuleCard } from '../../shared/ui/ModuleCard';
import { useTrainingCatalog, toneToCssVar } from './catalog';
import './trainieren.css';

export const TrainierenHub: React.FC = () => {
  const { goTo } = useNavigation();
  const { t } = useI18n();
  const { data, isLoading, error } = useTrainingCatalog();

  if (isLoading) {
    return <p className="trainieren-status">{t('trainieren.hub.loading')}</p>;
  }

  if (error || !data) {
    return <p className="trainieren-status">{t('trainieren.hub.error')}</p>;
  }

  return (
    <div className="trainieren-page">
      <header className="trainieren-page__intro">
        <p className="trainieren-page__description">{t('trainieren.hub.description')}</p>
      </header>

      <div className="trainieren-grid">
        {data.modules.map((module) => (
          <ModuleCard
            key={module.id}
            tone={module.tone}
            title={module.title}
            subtitle={module.description}
            rightSlot={<Icon name={module.icon} size={28} />}
            role="button"
            tabIndex={0}
            onClick={() => (module.id === 'brain' ? goTo('/brain') : goTo(`/trainieren/${module.id}`))}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (module.id === 'brain') {
                  goTo('/brain');
                } else {
                  goTo(`/trainieren/${module.id}`);
                }
              }
            }}
            className="trainieren-module-card"
            style={{ cursor: 'pointer', backgroundColor: toneToCssVar(module.tone) }}
            aria-label={module.title}
          />
        ))}
      </div>
    </div>
  );
};


