import React, { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { useI18n } from '../../../shared/lib/i18n';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import type { ScreenConfig } from '../../../core/screenConfig';
import { screenConfigs } from '../../../config/navigation';
import { registerHeaderActionHandler } from '../../../shared/lib/navigation/headerActionRegistry';
import { BRAIN_CATEGORIES, getExerciseById } from '../brainCatalog';

const ensureBrainExerciseScreenConfig = () => {
  const exists = screenConfigs.some((config) => config.id === 'brain-exercise');
  if (exists) return;

  const exerciseScreenConfig: ScreenConfig = {
    id: 'brain-exercise',
    route: '/brain/exercise/:exerciseId',
    titleKey: 'brain.header.title',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        onClick: { type: 'custom', handlerId: 'brain-exercise-back' },
      },
    ],
    primaryActions: [
      {
        id: 'openNotifications',
        labelKey: 'app.header.notifications',
        icon: 'notifications',
        onClick: { type: 'panel', panelId: 'notifications-center' },
      },
      { id: 'openSettings', labelKey: 'app.header.settings', icon: 'settings', navigationTarget: 'settings' },
    ],
  };

  screenConfigs.push(exerciseScreenConfig);
};

ensureBrainExerciseScreenConfig();

export const BrainExerciseDetailScreen: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { t } = useI18n();
  const { goTo } = useNavigation();

  const exercise = exerciseId ? getExerciseById(exerciseId) : undefined;
  const category = exercise ? BRAIN_CATEGORIES.find((item) => item.id === exercise.category) : undefined;
  const isAvailable = Boolean(exercise?.implemented);

  useEffect(() => {
    registerHeaderActionHandler('brain-exercise-back', () => {
      if (category) {
        goTo(`/brain/category/${category.id}`);
      } else {
        goTo('/brain');
      }
    });
  }, [category, goTo]);

  if (!exercise) {
    return <Navigate to="/brain" replace />;
  }

  const handleStart = () => {
    if (!isAvailable) return;
    goTo(`/brain/session/${exercise.id}`);
  };

  return (
    <div className="brain-page brain-exercise-detail">
      <SectionHeader as="h1" className="page-title" title={t(exercise.titleKey)} subtitle={t(exercise.subtitleKey)} />

      <Card className="brain-card brain-exercise-detail__card" variant="elevated">
        <div className="brain-exercise-detail__badge">
          <span className={isAvailable ? 'brain-badge brain-badge--available' : 'brain-badge brain-badge--planned'}>
            {t(isAvailable ? 'brain.catalog.badge.available' : 'brain.catalog.badge.planned')}
          </span>
        </div>

        <p className="brain-exercise-detail__description">{t(exercise.descriptionKey)}</p>

        <div className="brain-exercise-detail__meta">
          {category && (
            <div className="brain-exercise-detail__meta-item">
              <Icon name="category" size={18} />
              <span>
                {t('brain.exercises.category')}: {t(category.titleKey)}
              </span>
            </div>
          )}
          <div className="brain-exercise-detail__meta-item">
            <Icon name="insights" size={18} />
            <span>{t('brain.exercises.difficulty', { level: exercise.difficulty })}</span>
          </div>
          <div className="brain-exercise-detail__meta-item">
            <Icon name="schedule" size={18} />
            <span>{t('brain.exercises.duration', { minutes: exercise.estimatedMinutes })}</span>
          </div>
        </div>

        <div className="brain-exercise-detail__actions">
          <Button variant="primary" fullWidth disabled={!isAvailable} onClick={handleStart}>
            {t('brain.exercise.detail.start')}
          </Button>
          {!isAvailable && <p className="brain-exercise-detail__coming">{t('brain.catalog.comingSoon')}</p>}
        </div>
      </Card>
    </div>
  );
};

