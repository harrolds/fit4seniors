import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Icon } from '../../../shared/ui/Icon';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { useI18n } from '../../../shared/lib/i18n';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import type { ScreenConfig } from '../../../core/screenConfig';
import { screenConfigs } from '../../../config/navigation';
import { BRAIN_CATEGORIES, getExercisesByCategory } from '../brainCatalog';

const ensureBrainCategoryScreenConfig = () => {
  const exists = screenConfigs.some((config) => config.id === 'brain-category');
  if (exists) return;

  const categoryScreenConfig: ScreenConfig = {
    id: 'brain-category',
    route: '/brain/category/:categoryId',
    titleKey: 'brain.header.title',
    actions: [
      {
        id: 'goBack',
        labelKey: 'common.back',
        icon: 'back',
        onClick: { type: 'navigate', target: '/brain' },
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

  screenConfigs.push(categoryScreenConfig);
};

ensureBrainCategoryScreenConfig();

export const BrainCategoryScreen: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t } = useI18n();
  const { goTo } = useNavigation();

  const category = BRAIN_CATEGORIES.find((item) => item.id === categoryId);

  if (!category) {
    return <Navigate to="/brain" replace />;
  }

  const exercises = getExercisesByCategory(category.id);

  return (
    <div className="brain-page brain-category">
      <SectionHeader as="h1" className="page-title" title={t(category.titleKey)} subtitle={t(category.subtitleKey)} />
      <div className="brain-section" aria-label={t('brain.category.exercisesTitle')}>
        <h2 className="brain-section__title">{t('brain.category.exercisesTitle')}</h2>
        <div className="brain-exercise-list">
          {exercises.map((exercise) => {
            const badgeClass = exercise.implemented ? 'brain-badge brain-badge--available' : 'brain-badge brain-badge--planned';
            const badgeLabel = exercise.implemented ? t('brain.catalog.badge.available') : t('brain.catalog.badge.planned');
            return (
              <Card key={exercise.id} className="brain-exercise-item" variant="elevated">
                <button type="button" className="brain-exercise-item__body" onClick={() => goTo(`/brain/exercise/${exercise.id}`)}>
                  <div className="brain-exercise-item__header">
                    <div>
                      <p className="brain-exercise-item__eyebrow">{t(category.titleKey)}</p>
                      <h3 className="brain-exercise-item__title">{t(exercise.titleKey)}</h3>
                      <p className="brain-exercise-item__subtitle">{t(exercise.subtitleKey)}</p>
                    </div>
                    <div className={badgeClass}>{badgeLabel}</div>
                  </div>
                  <div className="brain-exercise-item__meta">
                    <span>{t('brain.exercises.difficulty', { level: exercise.difficulty })}</span>
                    <span>{t('brain.exercises.duration', { minutes: exercise.estimatedMinutes })}</span>
                  </div>
                  <div className="brain-exercise-item__chevron" aria-hidden="true">
                    <Icon name="chevron_right" size={20} />
                  </div>
                </button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

