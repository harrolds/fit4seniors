import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../shared/lib/i18n';
import { usePanels } from '../../shared/lib/panels';
import { getValue, setValue } from '../../shared/lib/storage';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Icon } from '../../shared/ui/Icon';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { useProfileMotorState, getRecommendationsForTrainingList } from '../../app/services/profileMotor';
import { findModule, listVariantItemsForModule, useTrainingCatalog } from '../../features/trainieren/catalog';
import { loadCompletedSessions } from '../progress/progressStorage';
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
  const { data: catalog } = useTrainingCatalog();
  const profile = useProfileMotorState();

  const [messageKey] = useState<string>(() => resolveNextMessageKey());
  const completionMessage = t(messageKey);
  const payload = (location.state as CompletionPayload | undefined) ?? {};
  const isBrain = payload.moduleId === 'brain';

  const sessionMinutes = useMemo(() => {
    const sec = typeof payload.durationSec === 'number' && Number.isFinite(payload.durationSec) ? Math.max(0, payload.durationSec) : 0;
    return Math.max(0, Math.round(sec / 60));
  }, [payload.durationSec]);

  const totalMinutes = useMemo(() => {
    const sessions = loadCompletedSessions();
    const totalSeconds = sessions.reduce((acc, s) => acc + (s.durationSecActual || 0), 0);

    const payloadFinishedAt = typeof payload.finishedAt === 'number' ? payload.finishedAt : null;
    const latestFinishedAt = sessions.reduce((max, s) => Math.max(max, s.completedAt || 0), 0);

    const maybeAddCurrent =
      payloadFinishedAt !== null && payloadFinishedAt > latestFinishedAt
        ? (typeof payload.durationSec === 'number' && Number.isFinite(payload.durationSec) ? Math.max(0, payload.durationSec) : 0)
        : 0;

    return Math.max(0, Math.round((totalSeconds + maybeAddCurrent) / 60));
  }, [payload.durationSec, payload.finishedAt]);

  const levelLabel = useMemo(() => {
    const resolveLabel = (key: string) => {
      const raw = t(key);
      return raw.replace(/^L\d+\s*/i, '').trim() || raw;
    };

    if (totalMinutes >= 1200) return resolveLabel('profile.level.l4.label');
    if (totalMinutes >= 600) return resolveLabel('profile.level.l3.label');
    if (totalMinutes >= 200) return resolveLabel('profile.level.l2.label');
    return resolveLabel('profile.level.l1.label');
  }, [t, totalMinutes]);

  const minutesUnit = t('completion.stats.minutesUnit');
  const sessionMinutesValue = String(sessionMinutes);
  const totalMinutesValue = String(totalMinutes);
  const sessionMinutesLabel = `${t('completion.stats.sessionMinutesLabel')} ${minutesUnit}`;


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

  const focusToModule: Record<string, string> = {
    cardio: 'cardio',
    strength: 'muskel',
    balance: 'balance_flex',
    brain: 'brain',
  };
  const nextModuleId = payload.moduleId && payload.moduleId !== 'unknown' ? payload.moduleId : focusToModule[profile.preferredFocus];
  const history = useMemo(() => loadCompletedSessions(), []);
  const variantItems = useMemo(() => listVariantItemsForModule(catalog, nextModuleId), [catalog, nextModuleId]);
  const recommendation = useMemo(
    () => getRecommendationsForTrainingList(variantItems, profile, history),
    [variantItems, profile, history],
  );
  const nextModule = findModule(catalog, nextModuleId);
  const recommendedVariant =
    recommendation.items.find((item) => recommendation.recommendedIds.has(item.id)) ?? recommendation.items[0];

  const nextRoute = recommendedVariant
    ? `/trainieren/${recommendedVariant.moduleId}/${recommendedVariant.trainingId}/${recommendedVariant.intensity}`
    : '/trainieren';

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

  const handleNext = () => {
    navigate(nextRoute, { replace: true });
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
        { label: sessionMinutesLabel, value: sessionMinutesValue },
        { label: t('completion.stats.totalMinutesLabel'), value: totalMinutesValue },
        { label: t('completion.stats.pointsLabel'), value: t('completion.stats.pointsValue') },
        { label: t('completion.stats.levelLabel'), value: levelLabel },
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

      {nextRoute ? (
        <Card className="c-next">
          <div className="c-next__text">
            <p className="c-next__eyebrow">{t('profileMotor.nextUp')}</p>
            <p className="c-next__title">
              {recommendedVariant?.title ?? nextModule?.title ?? t('trainierenHub.title')}
            </p>
          </div>
          <Button variant="primary" fullWidth className="c-next__cta" onClick={handleNext}>
            <Icon name="navigate_next" size={22} />
            {t('trainieren.detail.startCta')}
          </Button>
        </Card>
      ) : null}

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
