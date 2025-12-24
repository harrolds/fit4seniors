import React, { useMemo } from 'react';
import {
  findModule,
  findTraining,
  getIntensityLabel,
  intensityOrder,
  type TrainingIntensity,
  type TrainingItem,
  useTrainingCatalog,
} from '../../features/trainieren/catalog';
import { useI18n } from '../../shared/lib/i18n';
import { Card, CardBody, CardHeader } from '../../shared/ui/Card';
import { Divider } from '../../shared/ui/Divider';
import { Icon } from '../../shared/ui/Icon';
import { IconButton } from '../../shared/ui/IconButton';
import { List, ListItem } from '../../shared/ui/List';
import { Badge } from '../../shared/ui/Badge';
import './trainingInfo.css';

type TrainingInfoPanelProps = {
  moduleId?: string;
  trainingId?: string;
  intensity?: TrainingIntensity;
  title?: string;
  onClose?: () => void;
};

type TrainingMedia = { imageKey?: string; aspect?: string; videoUrl?: string };
type TrainingWithMedia = TrainingItem & { media?: TrainingMedia };

const buildVariant = (
  training?: TrainingItem,
  requested?: TrainingIntensity,
): { variant?: TrainingItem['variants'][TrainingIntensity]; resolvedIntensity?: TrainingIntensity } => {
  if (!training) {
    return { variant: undefined, resolvedIntensity: undefined };
  }

  if (requested && training.variants[requested]) {
    return { variant: training.variants[requested], resolvedIntensity: requested };
  }

  const fallbackIntensity = intensityOrder.find((level) => training.variants[level]);

  if (!fallbackIntensity) {
    return { variant: undefined, resolvedIntensity: undefined };
  }

  return { variant: training.variants[fallbackIntensity], resolvedIntensity: fallbackIntensity };
};

export const TrainingInfoPanelContent: React.FC<TrainingInfoPanelProps> = ({
  moduleId,
  trainingId,
  intensity,
  title,
  onClose,
}) => {
  const { t } = useI18n();
  const { data, isLoading } = useTrainingCatalog();

  const moduleDef = useMemo(() => findModule(data, moduleId), [data, moduleId]);
  const training = useMemo(() => findTraining(data, moduleId, trainingId), [data, moduleId, trainingId]);
  const { variant, resolvedIntensity } = useMemo(
    () => buildVariant(training, intensity),
    [training, intensity],
  );

  const trainingWithMedia = training as TrainingWithMedia | undefined;
  const hasMedia =
    Boolean(trainingWithMedia?.media) &&
    Boolean(
      trainingWithMedia?.media?.imageKey ??
        trainingWithMedia?.media?.videoUrl ??
        trainingWithMedia?.media?.aspect,
    );

  if (isLoading) {
    return <p>{t('trainingInfo.panel.loading')}</p>;
  }

  if (!training || !moduleDef) {
    return <p>{t('trainingInfo.panel.notFound')}</p>;
  }

  const headingTitle = title ?? training.title ?? t('trainingInfo.panel.title');

  return (
    <div className="training-info-panel">
      {onClose ? (
        <div className="training-info-panel__back">
          <IconButton ariaLabel={t('common.back')} onClick={onClose} variant="ghost">
            <Icon name="arrow_back" size={24} />
          </IconButton>
        </div>
      ) : null}

      <header className="training-info-panel__header">
        <div className="training-info-panel__heading-meta">
          <span className="training-info-panel__eyebrow">{moduleDef.title}</span>
          <h2 className="training-info-panel__title">{headingTitle}</h2>
          <p className="training-info-panel__desc">{training.shortDesc}</p>
        </div>
      </header>

      <section className="training-info-panel__badge-grid">
        {resolvedIntensity ? (
          <Badge variant="accent">{getIntensityLabel(t, resolvedIntensity)}</Badge>
        ) : null}
        {variant ? (
          <Badge>{`${variant.durationMin} ${t('trainieren.minutes')}`}</Badge>
        ) : null}
      </section>

      <Card variant="elevated" className="training-info-card">
        <CardHeader>
          <Icon name="info" size={24} />
          <div>
            <p className="training-info-card__meta">{t('trainingInfo.panel.section.about')}</p>
            <strong className="training-info-card__strong">{training.title}</strong>
          </div>
        </CardHeader>
        <CardBody>
          <p className="training-info-text training-info-text--normal">{moduleDef.description}</p>
          <Divider />
          <div className="training-info-card__body-stack">
            <span className="training-info-text training-info-text--semibold training-info-text--primary">
              {training.shortDesc}
            </span>
          </div>
        </CardBody>
      </Card>

      <Card className="training-info-card">
        <CardHeader>
          <Icon name="directions_walk" size={22} />
          <p className="training-info-text training-info-text--semibold">
            {t('trainingInfo.panel.section.how')}
          </p>
        </CardHeader>
        <CardBody>
          <p className="training-info-text training-info-text--muted">{training.shortDesc}</p>
          {variant ? (
            <p className="training-info-text training-info-text--primary training-info-text--medium">
              {variant.paceCue}
            </p>
          ) : null}
        </CardBody>
      </Card>

      {variant && resolvedIntensity ? (
        <Card className="training-info-card">
          <CardHeader>
            <Icon name="insights" size={22} />
            <p className="training-info-text training-info-text--semibold">
              {t('trainingInfo.panel.section.intensity')}
            </p>
          </CardHeader>
          <CardBody>
            <List>
              <ListItem
                title={t('trainingInfo.panel.section.intensity')}
                subtitle={getIntensityLabel(t, resolvedIntensity)}
                rightSlot={<Badge variant="accent">{getIntensityLabel(t, resolvedIntensity)}</Badge>}
              />
              <ListItem
                title={t('trainingInfo.panel.section.duration')}
                rightSlot={
                  <span className="training-info-text training-info-text--semibold training-info-text--primary">
                    {variant.durationMin} {t('trainieren.minutes')}
                  </span>
                }
              />
              <ListItem title={t('trainingInfo.panel.section.pace')} subtitle={variant.paceCue} />
            </List>
          </CardBody>
        </Card>
      ) : null}

      {hasMedia ? (
        <Card className="training-info-card">
          <CardHeader>
            <Icon name="collections" size={22} />
            <p className="training-info-text training-info-text--semibold">
              {t('trainingInfo.panel.section.media')}
            </p>
          </CardHeader>
          <CardBody>
            <p className="training-info-text training-info-text--muted">
              {trainingWithMedia?.media?.imageKey}
            </p>
            {trainingWithMedia?.media?.aspect ? (
              <p className="training-info-card__meta">{trainingWithMedia.media.aspect}</p>
            ) : null}
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
};

