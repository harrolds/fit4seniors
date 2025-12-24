import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useI18n } from '../../shared/lib/i18n';
import { Icon } from '../../shared/ui/Icon';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { List } from '../../shared/ui/List';
import {
  useTrainingCatalog,
  findModule,
  listVariantItemsForModule,
  getIntensityLabel,
  type TrainingIntensity,
  type DurationBucket,
} from './catalog';
import { usePanels } from '../../shared/lib/panels';
import { getProfile, getRecommendationsForTrainingList } from '../../app/services/profileMotor';
import { loadCompletedSessions } from '../../modules/progress/progressStorage';
import './trainieren.css';

const introKeyByModule: Record<string, string> = {
  cardio: 'trainieren.categories.cardio.intro',
  muskel: 'trainieren.categories.strength.intro',
  balance_flex: 'trainieren.categories.balance.intro',
  brain: 'trainieren.categories.brain.intro',
};

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
  const history = useMemo(() => loadCompletedSessions(), []);

  const recommendation = useMemo(() => {
    const profile = getProfile();
    return getRecommendationsForTrainingList(variantItems, profile, history);
  }, [variantItems, history]);

  const visibleItems = useMemo(() => {
    return recommendation.items.filter(
      (item) => activeIntensities.includes(item.intensity) && activeDurations.includes(item.durationBucket),
    );
  }, [activeDurations, activeIntensities, recommendation.items]);

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

  const introKey = introKeyByModule[moduleDef.id];
  const introText = introKey ? t(introKey) : '';

  return (
    <div className="trainieren-page trainieren-module-page" data-category={moduleDef.categoryId}>
      <section className="trainieren-module-hero">
        <h1 className="trainieren-module-hero__title">{moduleDef.title}</h1>
        <p className="trainieren-module-hero__intro">
          {introText || moduleDef.description}
        </p>
      </section>

      <div className="trainieren-filter-row">
        <button type="button" className="trainieren-filter-button" onClick={openFilterSheet}>
          <Icon name="tune" size={22} />
          <span>{t('trainieren.module.filterCta')}</span>
        </button>
      </div>

      <div className="trainieren-training-list">
        {visibleItems.length === 0 ? (
          <p className="trainieren-status">{t('trainieren.trainingList.empty')}</p>
        ) : (
          <List className="trainieren-training-list__grid">
            {visibleItems.map((item) => (
              <li
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
                <div className="training-variant-card__body">
                  <div className="training-variant-card__icon-tile">
                    <Icon name={moduleDef.icon ?? 'fitness_center'} size={28} />
                  </div>
                  <div className="training-variant-card__content">
                    {recommendation.recommendedIds.has(item.id) ? (
                      <Badge variant="accent" className="training-variant-card__recommend">
                        {t('profileMotor.recommendedForYou')}
                      </Badge>
                    ) : null}
                    <div className="training-variant-card__meta">
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
                  </div>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  className="training-variant-card__cta"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenTraining(item.trainingId, item.intensity);
                  }}
                >
                  {t('trainieren.detail.startCta')}
                </Button>
              </li>
            ))}
          </List>
        )}
      </div>
    </div>
  );
};


