import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../shared/lib/i18n';
import { usePanels } from '../../shared/lib/panels';
import { getValue, setValue } from '../../shared/lib/storage';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Icon } from '../../shared/ui/Icon';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import './completion.screen.css';

const COMPLETION_STORAGE_KEY = 'completion:last-index';
const COMPLETION_MESSAGE_COUNT = 10;

type CompletionPayload = {
  moduleId?: string;
  unitTitle?: string;
  durationSec?: number;
  finishedAt?: number;
  summary?: { kind: 'found_word'; value?: string; success?: boolean };
  completed?: boolean;
  returnPath?: string;
};

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
  const payload = (location.state as CompletionPayload | undefined) ?? {};
  const isBrain = payload.moduleId === 'brain';

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

  const backTarget = payload.returnPath ?? returnTarget;

  const formatDuration = (value?: number): string => {
    if (!value || Number.isNaN(value)) return '00:00';
    const safe = Math.max(0, Math.round(value));
    const minutes = Math.floor(safe / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (safe % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleBack = () => {
    navigate(backTarget, { replace: true });
  };

  const handleProgress = () => {
    navigate('/progress');
  };

  const stats = isBrain
    ? [
        { label: t('completion.brain.stat.time'), value: formatDuration(payload.durationSec) },
        { label: t('completion.brain.stat.unit'), value: payload.unitTitle ?? t('brain.session.headerTitle') },
        {
          label: t('completion.brain.stat.result'),
          value:
            payload.summary?.kind === 'found_word'
              ? t('completion.brain.result.foundWord', { word: payload.summary.value ?? '' })
              : '—',
        },
      ]
    : [
        { label: t('completion.stats.minutesLabel'), value: t('completion.stats.minutesValue') },
        { label: t('completion.stats.pointsLabel'), value: t('completion.stats.pointsValue') },
      ];

  const title = isBrain ? t('completion.brain.title') : t('completion.cardTitle');
  const subtitle = isBrain ? t('completion.brain.subtitle') : t('completion.body');

  return (
    <div className="c-wrap">
      <SectionHeader as="h1" className="page-title" title={title} subtitle={subtitle} />
      <Card variant="elevated" className="c-card">
        <div className="c-heroIcon">
          <Icon name="emoji_events" size={54} />
        </div>

        <div className="c-copy">
          <h2 className="c-title">{title}</h2>
          <p className="c-body">{subtitle}</p>
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
