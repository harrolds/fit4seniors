import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useI18n } from '../../shared/lib/i18n';
import { Icon } from '../../shared/ui/Icon';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { List, ListItem } from '../../shared/ui/List';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import {
  useTrainingCatalog,
  findModule,
  listVariantItemsForModule,
  getIntensityLabel,
  type TrainingIntensity,
  type DurationBucket,
} from './catalog';
import { usePanels } from '../../shared/lib/panels';
import './trainieren.css';

export const ModuleLanding: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { goBack, goTo } = useNavigation();
  const { t } = useI18n();
  const { openBottomSheet, closePanel } = usePanels();
  const { data, isLoading, error } = useTrainingCatalog();

  const [activeIntensities, setActiveIntensities] = useState<TrainingIntensity[]>(['light', 'medium', 'heavy']);
  const [activeDurations, setActiveDurations] = useState<DurationBucket[]>(['short', 'medium', 'long']);

  const moduleDef = findModule(data, moduleId);
  const variantItems = listVariantItemsForModule(data, moduleId);

  const visibleItems = useMemo(() => {
    return variantItems.filter(
      (item) => activeIntensities.includes(item.intensity) && activeDurations.includes(item.durationBucket),
    );
  }, [activeDurations, activeIntensities, variantItems]);

  if (isLoading) {
    return <p className="trainieren-status">{t('trainieren.module.loading')}</p>;
  }

  if (error || !data || !moduleDef) {
    return (
      <div className="trainieren-status">
        <p>{t('trainieren.module.notFound')}</p>
        <Button variant="secondary" onClick={goBack}>
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const handleOpenTraining = (trainingId: string, intensity: TrainingIntensity) => {
    goTo(`/trainieren/${moduleDef.id}/${trainingId}/${intensity}`);
  };

  const toggleIntensity = (value: TrainingIntensity) => {
    setActiveIntensities((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  };

  const toggleDuration = (value: DurationBucket) => {
    setActiveDurations((prev) => (prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]));
  };

  const resetFilters = () => {
    setActiveIntensities(['light', 'medium', 'heavy']);
    setActiveDurations(['short', 'medium', 'long']);
  };

  const openFilterSheet = () => {
    openBottomSheet('trainieren-filter', {
      intensities: activeIntensities,
      durations: activeDurations,
      onToggleIntensity: toggleIntensity,
      onToggleDuration: toggleDuration,
      onReset: resetFilters,
      onApply: closePanel,
    });
  };

  return (
    <div className="trainieren-page">
      <div className="trainieren-module-header">
        <SectionHeader
          as="h1"
          className="page-title"
          title={moduleDef.title}
          subtitle={moduleDef.description}
        />
        <button type="button" className="trainieren-filter-button" onClick={openFilterSheet}>
          <Icon name="tune" size={22} />
          <span>{t('trainieren.module.filterCta')}</span>
        </button>
      </div>

      <div className="trainieren-training-list">
        {visibleItems.length === 0 ? (
          <p className="trainieren-status">{t('trainieren.trainingList.empty')}</p>
        ) : (
          <List>
            {visibleItems.map((item) => (
              <ListItem
                key={item.id}
                className="training-variant-card"
                role="button"
                tabIndex={0}
                onClick={() => handleOpenTraining(item.trainingId, item.intensity)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleOpenTraining(item.trainingId, item.intensity);
                  }
                }}
              >
                <div className="training-variant-card__top">
                  <Badge
                    variant="neutral"
                    className={`training-variant-card__badge training-variant-card__badge--${item.intensity}`}
                  >
                    {getIntensityLabel(t, item.intensity)}
                  </Badge>
                  <div className="training-variant-card__time">
                    <Icon name="schedule" size={18} />
                    <span>
                      {item.durationMin} {t('trainieren.minutes')}
                    </span>
                  </div>
                </div>
                <p className="training-variant-card__title">{item.title}</p>
                <p className="training-variant-card__description">{item.shortDesc}</p>
                <p className="training-variant-card__cue">{item.paceCue}</p>
                <div className="training-variant-card__chevron" aria-hidden="true">
                  <Icon name="chevron_right" size={22} />
                </div>
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </div>
  );
};


