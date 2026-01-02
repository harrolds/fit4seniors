import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../shared/lib/i18n';
import { usePanels } from '../../shared/lib/panels';
import { getValue, setValue } from '../../shared/lib/storage';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Icon } from '../../shared/ui/Icon';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import {
  useProfileMotorState,
  getRecommendationsForTrainingList,
  computePointsAwardedV1,
  getLevelFromPoints,
} from '../../app/services/profileMotor';
import {
  findModule,
  listVariantItemsForModule,
  useTrainingCatalog,
  type TrainingIntensity,
  type BrainType,
  brainTypesAll,
} from '../../features/trainieren/catalog';
import { loadCompletedSessions } from '../progress/progressStorage';
import './completion.screen.css';
import { requestStartTrainingWithGate } from '../../core/premium/premiumGateFlow';
import { useUserSession } from '../../core/user/userStore';

const COMPLETION_STORAGE_KEY = 'completion:last-index';
const BRAIN_FILTERS_KEY = 'trainieren:brainFilters:v1';
const COMPLETION_MESSAGE_COUNT = 10;

type StoredBrainFilters = {
  intensities: TrainingIntensity[];
  brainTypes: BrainType[];
};

const allBrainIntensities: TrainingIntensity[] = ['light', 'medium', 'heavy'];

const validateBrainIntensities = (values?: TrainingIntensity[]): TrainingIntensity[] => {
  const filtered = Array.isArray(values)
    ? values.filter((value): value is TrainingIntensity => allBrainIntensities.includes(value as TrainingIntensity))
    : [];
  return filtered.length ? Array.from(new Set(filtered)) : allBrainIntensities;
};

const validateBrainTypes = (values?: BrainType[]): BrainType[] => {
  const filtered = Array.isArray(values)
    ? values.filter((value): value is BrainType => brainTypesAll.includes(value as BrainType))
    : [];
  return filtered.length ? Array.from(new Set(filtered)) : brainTypesAll;
};

type CompletionPayload = {
  moduleId?: string;
  trainingId?: string;
  unitTitle?: string;
  durationSec?: number;
  activeMinutes?: number;
  pointsAwarded?: number;
  pointsModelVersion?: 'v1';
  intensity?: TrainingIntensity;
  brainType?: BrainType;
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
  const session = useUserSession();
  const isGuest = session.auth.status === 'anonymous';

  const [messageKey] = useState<string>(() => resolveNextMessageKey());
  const completionMessage = t(messageKey);
  const payload = (location.state as CompletionPayload | undefined) ?? {};
  const isBrain = payload.moduleId === 'brain';
  const brainFilters = useMemo(() => {
    if (!isBrain) {
      return { intensities: allBrainIntensities, brainTypes: brainTypesAll };
    }
    const stored = getValue<StoredBrainFilters | null>(BRAIN_FILTERS_KEY, null);
    return {
      intensities: validateBrainIntensities(stored?.intensities),
      brainTypes: validateBrainTypes(stored?.brainTypes),
    };
  }, [isBrain]);
  const allowedBrainIntensities = useMemo(
    () => (payload.intensity ? [payload.intensity] : brainFilters.intensities),
    [payload.intensity, brainFilters.intensities],
  );
  const allowedBrainTypes = useMemo(
    () => (payload.brainType ? [payload.brainType] : brainFilters.brainTypes),
    [payload.brainType, brainFilters.brainTypes],
  );

  const sessionMinutes = useMemo(() => {
    if (Number.isFinite(payload.activeMinutes ?? NaN)) {
      return Math.max(0, Math.round(payload.activeMinutes as number));
    }
    const sec =
      typeof payload.durationSec === 'number' && Number.isFinite(payload.durationSec)
        ? Math.max(0, payload.durationSec)
        : 0;
    return Math.max(0, Math.round(sec / 60));
  }, [payload.activeMinutes, payload.durationSec]);

  const pointsAwarded = useMemo(() => {
    if (Number.isFinite(payload.pointsAwarded ?? NaN)) {
      return Math.max(0, Math.round(payload.pointsAwarded as number));
    }
    return computePointsAwardedV1(sessionMinutes, payload.intensity);
  }, [payload.intensity, payload.pointsAwarded, sessionMinutes]);

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

  const levelInfo = useMemo(() => getLevelFromPoints(profile.totalPoints ?? 0), [profile.totalPoints]);
  const levelLabel = t(levelInfo.labelKey);
  const levelProgressText =
    isGuest || levelInfo.pointsToNext === null || !levelInfo.nextLevelLabelKey
      ? null
      : t('completion.levelProgress', { n: levelInfo.pointsToNext, next: t(levelInfo.nextLevelLabelKey) });

  const minutesUnit = t('completion.stats.minutesUnit');
  const sessionMinutesValue = String(sessionMinutes);
  const totalMinutesValue = String(totalMinutes);
  const sessionMinutesLabel = `${t('completion.stats.sessionMinutesLabel')} ${minutesUnit}`;
  const pointsValue = `+${pointsAwarded}`;
  const pointsLabel = t('completion.pointsLabel');


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
  const brainItems = useMemo(() => listVariantItemsForModule(catalog, 'brain'), [catalog]);
  const brainRecommendation = useMemo(
    () => getRecommendationsForTrainingList(brainItems, profile, history),
    [brainItems, profile, history],
  );
  const nextModule = findModule(catalog, nextModuleId);
  const recommendedVariant =
    recommendation.items.find((item) => recommendation.recommendedIds.has(item.id)) ?? recommendation.items[0];
  const brainCandidates = useMemo(
    () =>
      isBrain
        ? brainItems.filter(
            (item) =>
              allowedBrainIntensities.includes(item.intensity) &&
              item.brainType &&
              allowedBrainTypes.includes(item.brainType) &&
              item.trainingId !== payload.trainingId,
          )
        : [],
    [allowedBrainIntensities, allowedBrainTypes, brainItems, isBrain, payload.trainingId],
  );
  const brainNextVariant = useMemo(() => {
    if (!isBrain) return null;
    const recommended = brainCandidates.find((item) => brainRecommendation.recommendedIds.has(item.id));
    return recommended ?? brainCandidates[0] ?? null;
  }, [brainCandidates, brainRecommendation.recommendedIds, isBrain]);
  const nextVariant = isBrain ? brainNextVariant ?? recommendedVariant : recommendedVariant;

  const nextRoute = isBrain
    ? brainNextVariant
      ? `/trainieren/${brainNextVariant.moduleId}/${brainNextVariant.trainingId}/${brainNextVariant.intensity}`
      : '/trainieren/brain'
    : recommendedVariant
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
    if (nextVariant) {
      requestStartTrainingWithGate(
        {
          id: nextVariant.trainingId,
          title: nextVariant.title,
          moduleId: nextVariant.moduleId,
          categoryId: nextModule?.categoryId,
          requiresPremium: nextVariant.requiresPremium ?? false,
        },
        () => navigate(nextRoute, { replace: true }),
      );
      return;
    }
    navigate(nextRoute, { replace: true });
  };

  const stats = isBrain
    ? [
        { label: t('completion.brain.stat.timeLabel'), value: formatDuration(payload.durationSec) },
        {
          label: t('completion.brain.session.headerTitle'),
          value: payload.unitTitle ?? t('completion.brain.session.headerTitle'),
        },
        {
          label: t('completion.brain.stat.resultLabel'),
          value:
            payload.summary?.kind === 'found_word'
              ? t('completion.brain.result.foundWord', { word: payload.summary.value ?? '' })
              : '—',
        },
      ]
    : [
        { label: sessionMinutesLabel, value: sessionMinutesValue },
        { label: t('completion.stats.totalMinutesLabel'), value: totalMinutesValue },
        ...(isGuest
          ? []
          : [
              { label: pointsLabel, value: pointsValue },
              { label: t('completion.stats.levelLabel'), value: levelLabel },
            ]),
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
        {levelProgressText ? <p className="c-levelProgress">{levelProgressText}</p> : null}
      </Card>

      {nextRoute ? (
        <Card className="c-next">
          <div className="c-next__text">
            <p className="c-next__eyebrow">{t('profileMotor.nextUp')}</p>
            <p className="c-next__title">
              {nextVariant?.title ?? nextModule?.title ?? t('trainierenHub.title')}
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
