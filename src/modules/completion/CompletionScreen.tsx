import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../shared/lib/i18n';
import { usePanels } from '../../shared/lib/panels';
import { getValue, setValue } from '../../shared/lib/storage';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Icon } from '../../shared/ui/Icon';
import './completion.screen.css';

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
    <div className="c-wrap">
      <Card variant="elevated" className="c-card">
        <div className="c-heroIcon">
          <Icon name="emoji_events" size={54} />
        </div>

        <div className="c-copy">
          <h2 className="c-title">{t('completion.cardTitle')}</h2>
          <p className="c-body">{t('completion.body')}</p>
          <p className="c-body">{completionMessage}</p>
        </div>

        <div className="c-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="c-stat">
              <span className="c-stat__value">{stat.value}</span>
              <span className="c-stat__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="c-actions">
        <Button variant="primary" fullWidth className="c-btnPrimary" onClick={handleBack}>
          <Icon name="home" size={22} />
          {t('completion.ctaBack')}
        </Button>
        <Button variant="secondary" fullWidth className="c-btnSecondary" onClick={handleProgress}>
          <Icon name="bar_chart" size={22} />
          {t('completion.ctaProgress')}
        </Button>
      </div>
    </div>
  );
};
