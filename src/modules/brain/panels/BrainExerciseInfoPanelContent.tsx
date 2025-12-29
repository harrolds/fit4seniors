import React from 'react';
import { Card, CardBody, CardHeader } from '../../../shared/ui/Card';
import { Divider } from '../../../shared/ui/Divider';
import { Icon } from '../../../shared/ui/Icon';
import { IconButton } from '../../../shared/ui/IconButton';
import { Badge } from '../../../shared/ui/Badge';
import { useI18n } from '../../../shared/lib/i18n';
import { BRAIN_CATEGORIES, getExerciseById } from '../brainCatalog';
import '../../trainingInfo/trainingInfo.css';

type BrainExerciseInfoPanelContentProps = {
  exerciseId?: string;
  onClose?: () => void;
};

export const BrainExerciseInfoPanelContent: React.FC<BrainExerciseInfoPanelContentProps> = ({
  exerciseId,
  onClose,
}) => {
  const { t } = useI18n();
  const exercise = exerciseId ? getExerciseById(exerciseId) : undefined;
  const category = exercise ? BRAIN_CATEGORIES.find((item) => item.id === exercise.category) : undefined;
  const handleClose = onClose ?? (() => undefined);

  if (!exercise) {
    return <p className="training-info-panel__desc">{t('trainingInfo.panel.notFound')}</p>;
  }

  return (
    <div className="training-info-panel">
      {onClose ? (
        <div className="training-info-panel__back">
          <IconButton ariaLabel={t('common.back')} onClick={handleClose} variant="ghost">
            <Icon name="arrow_back" size={24} />
          </IconButton>
        </div>
      ) : null}

      <header className="training-info-panel__header">
        <div className="training-info-panel__heading-meta">
          <span className="training-info-panel__eyebrow">
            {category ? t(category.titleKey) : t('brain.header.title')}
          </span>
          <h2 className="training-info-panel__title">{t('brain.panel.title')}</h2>
          <p className="training-info-panel__desc">{t(exercise.subtitleKey)}</p>
        </div>
      </header>

      <section className="training-info-panel__badge-grid">
        {category ? <Badge variant="accent">{t(category.titleKey)}</Badge> : null}
        <Badge>{t('brain.exercises.difficulty', { level: exercise.difficulty })}</Badge>
        <Badge>{t('brain.exercises.duration', { minutes: exercise.estimatedMinutes })}</Badge>
      </section>

      <Card variant="elevated" className="training-info-card">
        <CardHeader>
          <Icon name="info" size={24} />
          <div>
            <p className="training-info-card__meta">{t('brain.panel.title')}</p>
            <strong className="training-info-card__strong">{t(exercise.titleKey)}</strong>
          </div>
        </CardHeader>
        <CardBody>
          <p className="training-info-text training-info-text--normal">{t(exercise.descriptionKey)}</p>
          <Divider />
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
            {exercise.scoringType ? (
              <div className="brain-exercise-detail__meta-item">
                <Icon name="leaderboard" size={18} />
                <span>{exercise.scoringType}</span>
              </div>
            ) : null}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};


