import React from 'react';
import { useParams } from 'react-router-dom';
import { useI18n } from '../../shared/lib/i18n';
import { Button } from '../../shared/ui/Button';
import { Badge } from '../../shared/ui/Badge';
import { Icon } from '../../shared/ui/Icon';
import {
  findModule,
  findTraining,
  toneToCssVar,
  useTrainingCatalog,
  type TrainingIntensity,
  intensityLabels,
} from './catalog';
import './trainieren.css';

export const TrainingDetail: React.FC = () => {
  const { moduleId, trainingId, intensity } = useParams<{
    moduleId: string;
    trainingId: string;
    intensity: TrainingIntensity;
  }>();
  const { t } = useI18n();
  const { data, isLoading, error } = useTrainingCatalog();

  const moduleDef = findModule(data, moduleId);
  const training = findTraining(data, moduleId, trainingId);
  const variant = intensity && training ? training.variants[intensity] : undefined;

  if (isLoading) {
    return <p className="trainieren-status">{t('trainieren.detail.loading')}</p>;
  }

  if (error || !moduleDef || !training || !variant) {
    return <p className="trainieren-status">{t('trainieren.detail.notFound')}</p>;
  }

  return (
    <div className="trainieren-page training-detail">
      <section
        className="trainieren-hero training-detail__hero"
        style={{ backgroundColor: toneToCssVar(moduleDef.tone) }}
      >
        <div className="trainieren-hero__top">
          <span className="trainieren-hero__eyebrow">{moduleDef.title}</span>
          <Icon name={moduleDef.icon} size={28} />
        </div>
        <h1 className="trainieren-hero__title">{training.title}</h1>
        <p className="trainieren-hero__description">{training.shortDesc}</p>
        <div className="training-detail__meta">
          <Badge variant="accent">{intensityLabels[variant.intensity]}</Badge>
          <span className="trainieren-hero__divider">•</span>
          <span>
            {variant.durationMin} {t('trainieren.minutes')}
          </span>
        </div>
      </section>

      <section className="training-detail__section">
        <h2 className="training-detail__section-title">{t('trainieren.detail.intensities')}</h2>
        <div className="training-detail__variants">
          <div className="training-detail__variant">
            <div className="training-detail__variant-head">
              <Badge variant="accent">{intensityLabels[variant.intensity]}</Badge>
              <span className="training-detail__variant-duration">
                {variant.durationMin} {t('trainieren.minutes')}
              </span>
            </div>
            <p className="training-detail__variant-body">{variant.paceCue}</p>
          </div>
        </div>
      </section>

      <section className="training-detail__section">
        <h2 className="training-detail__section-title">{t('trainieren.detail.actions')}</h2>
        <Button fullWidth disabled>
          {t('trainieren.detail.startCta')}
        </Button>
      </section>
    </div>
  );
};


