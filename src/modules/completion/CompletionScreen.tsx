import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../shared/lib/i18n';
import { usePanels } from '../../shared/lib/panels';
import { getValue, setValue } from '../../shared/lib/storage';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Icon } from '../../shared/ui/Icon';

const COMPLETION_STORAGE_KEY = 'completion:last-index';
const COMPLETION_MESSAGE_COUNT = 10;

const resolveNextMessageKey = (): string => {
  const stored = getValue<number | null>(COMPLETION_STORAGE_KEY, null);
  const safeIndex =
    typeof stored === 'number' && Number.isFinite(stored) && stored >= 0 && stored < COMPLETION_MESSAGE_COUNT
      ? stored
      : -1;
  const nextIndex = (safeIndex + 1) % COMPLETION_MESSAGE_COUNT;
  setValue<number>(COMPLETION_STORAGE_KEY, nextIndex);
  return `training.completionMessages.${nextIndex + 1}`;
};

export const CompletionScreen: React.FC = () => {
  const { t } = useI18n();
  const { closePanel } = usePanels();
  const navigate = useNavigate();
  const location = useLocation();

  const [messageKey] = useState<string>(() => resolveNextMessageKey());
  const completionMessage = t(messageKey);

  useEffect(() => {
    closePanel();
  }, [closePanel]);

  const returnTarget = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get('return');
    if (target && target.startsWith('/')) {
      return target;
    }
    return '/trainieren';
  }, [location.search]);

  const handleBack = () => {
    navigate(returnTarget, { replace: true });
  };

  const handleProgress = () => {
    navigate('/progress');
  };

  const stats = [
    { label: t('completion.stats.minutesLabel'), value: t('completion.stats.minutesValue') },
    { label: t('completion.stats.pointsLabel'), value: t('completion.stats.pointsValue') },
  ];

  return (
    <div
      style={{
        padding: 'var(--spacing-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xl)',
        backgroundColor: 'var(--color-background)',
        minHeight: '100%',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginTop: 'var(--spacing-lg)',
        }}
      >
        <p
          style={{
            margin: 0,
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-lg)',
            lineHeight: 'var(--line-height-snug)',
          }}
        >
          {t('completion.subtitle')}
        </p>
      </div>

      <Card
        variant="elevated"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-lg)',
          textAlign: 'center',
          padding: 'calc(var(--spacing-xl) * 1.25)',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-card-module-3)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: 'var(--shadow-md)',
            color: 'var(--color-secondary)',
          }}
        >
          <Icon name='emoji_events' size={48} />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 'var(--font-size-xl)',
              color: 'var(--color-text-primary)',
              fontWeight: 'var(--font-weight-bold)',
            }}
          >
            {t('completion.cardTitle')}
          </h2>
          <p
            style={{
              margin: 0,
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--line-height-normal)',
            }}
          >
            {t('completion.body')}
          </p>
          <p
            style={{
              margin: 0,
              color: 'var(--color-text-primary)',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            {completionMessage}
          </p>
        </div>

        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-lg)',
            borderTop: '1px solid var(--color-divider)',
            paddingTop: 'var(--spacing-lg)',
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)',
          marginTop: 'auto',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <Button variant="primary" fullWidth onClick={handleBack}>
          <Icon name="home" size={22} />
          {t('completion.ctaBack')}
        </Button>
        <Button variant="secondary" fullWidth onClick={handleProgress}>
          <Icon name="bar_chart" size={22} />
          {t('completion.ctaProgress')}
        </Button>
      </div>
    </div>
  );
};
