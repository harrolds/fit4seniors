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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
        padding: 'var(--spacing-lg)',
        minHeight: '100%',
      }}
    >
      {onClose ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          <IconButton ariaLabel={t('common.back')} onClick={onClose} variant="ghost">
            <Icon name="arrow_back" size={24} />
          </IconButton>
        </div>
      ) : null}

      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xs)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
            {moduleDef.title}
          </span>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-xl)', color: 'var(--color-text-primary)' }}>
            {headingTitle}
          </h2>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{training.shortDesc}</p>
        </div>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        {resolvedIntensity ? (
          <Badge variant="accent">{getIntensityLabel(t, resolvedIntensity)}</Badge>
        ) : null}
        {variant ? (
          <Badge>{`${variant.durationMin} ${t('trainieren.minutes')}`}</Badge>
        ) : null}
      </section>

      <Card variant="elevated" style={{ boxShadow: 'none' }}>
        <CardHeader>
          <Icon name="info" size={24} />
          <div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              {t('trainingInfo.panel.section.about')}
            </p>
            <strong style={{ color: 'var(--color-text-primary)' }}>{training.title}</strong>
          </div>
        </CardHeader>
        <CardBody>
          <p style={{ margin: 0, lineHeight: 'var(--line-height-normal)' }}>{moduleDef.description}</p>
          <Divider />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
              {training.shortDesc}
            </span>
          </div>
        </CardBody>
      </Card>

      <Card style={{ boxShadow: 'none' }}>
        <CardHeader>
          <Icon name="directions_walk" size={22} />
          <p style={{ margin: 0, fontWeight: 'var(--font-weight-semibold)' }}>
            {t('trainingInfo.panel.section.how')}
          </p>
        </CardHeader>
        <CardBody>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{training.shortDesc}</p>
          {variant ? (
            <p style={{ margin: 0, color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
              {variant.paceCue}
            </p>
          ) : null}
        </CardBody>
      </Card>

      {variant && resolvedIntensity ? (
        <Card style={{ boxShadow: 'none' }}>
          <CardHeader>
            <Icon name="insights" size={22} />
            <p style={{ margin: 0, fontWeight: 'var(--font-weight-semibold)' }}>
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
                  <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
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
        <Card style={{ boxShadow: 'none' }}>
          <CardHeader>
            <Icon name="collections" size={22} />
            <p style={{ margin: 0, fontWeight: 'var(--font-weight-semibold)' }}>
              {t('trainingInfo.panel.section.media')}
            </p>
          </CardHeader>
          <CardBody>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              {trainingWithMedia?.media?.imageKey}
            </p>
            {trainingWithMedia?.media?.aspect ? (
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                {trainingWithMedia.media.aspect}
              </p>
            ) : null}
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
};

