import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../../shared/lib/i18n';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { registerHeaderActionHandler } from '../../shared/lib/navigation/headerActionRegistry';
import { Button } from '../../shared/ui/Button';
import { Badge } from '../../shared/ui/Badge';
import { Icon } from '../../shared/ui/Icon';
import { ProgressBar } from '../../shared/ui/ProgressBar';
import { usePanels } from '../../shared/lib/panels';
import {
  findModule,
  findTraining,
  useTrainingCatalog,
  type TrainingIntensity,
  getIntensityLabel,
} from './catalog';
import { addCompletedSession } from '../../modules/progress/progressStorage';
import './trainieren.css';

type SessionStatus = 'idle' | 'running' | 'paused' | 'completed';

type SessionState = {
  status: SessionStatus;
  totalSeconds: number;
  remainingSeconds: number;
  currentStepIndex: number;
  steps: string[];
};

const clampDuration = (value: number) => Math.min(90, Math.max(5, Math.round(value)));

const formatSeconds = (value: number): string => {
  const safe = Math.max(0, value);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const formatMinutesToTime = (minutes: number): string => {
  const safe = Math.max(1, Math.round(minutes));
  return `${safe.toString().padStart(2, '0')}:00`;
};

const TIMER_RADIUS = 52;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

const getDefaultSteps = (intensity: TrainingIntensity, t: (key: string) => string): string[] => {
  const baseKey =
    intensity === 'heavy'
      ? 'training.steps.intense'
      : intensity === 'medium'
        ? 'training.steps.medium'
        : 'training.steps.light';

  return [1, 2, 3, 4].map((index) => t(`${baseKey}.${index}`));
};

export const TrainingDetail: React.FC = () => {
  const { moduleId, trainingId, intensity } = useParams<{
    moduleId: string;
    trainingId: string;
    intensity: TrainingIntensity;
  }>();
  const { t } = useI18n();
  const { goBack, goTo, openNotifications, openSettings } = useNavigation();
  const { state: panelState, openBottomSheet, closePanel, openRightPanel } = usePanels();
  const { data, isLoading, error } = useTrainingCatalog();
  const navigate = useNavigate();

  const moduleDef = findModule(data, moduleId);
  const training = findTraining(data, moduleId, trainingId);
  const variant = intensity && training ? training.variants[intensity] : undefined;
  const isPhysicalModule =
    moduleId === 'cardio' || moduleId === 'muskel' || moduleId === 'balance_flex';
  const physicalIntroKey = useMemo(() => {
    if (!isPhysicalModule) return null;
    switch (moduleId) {
      case 'cardio':
        return 'trainDetail.physical.intro.cardio';
      case 'muskel':
        return 'trainDetail.physical.intro.strength';
      case 'balance_flex':
        return 'trainDetail.physical.intro.balance';
      default:
        return null;
    }
  }, [isPhysicalModule, moduleId]);

  const defaultSteps = useMemo(() => {
    if (!variant) return [];
    return getDefaultSteps(variant.intensity, t);
  }, [variant, t]);

  const resolvedSteps = useMemo(() => {
    if (!variant) return [];
    const trainingWithSteps = training as typeof training & { steps?: string[] };
    if (trainingWithSteps?.steps?.length) {
      return trainingWithSteps.steps;
    }
    return defaultSteps;
  }, [training, variant, defaultSteps]);

  const [plannedDuration, setPlannedDuration] = useState<number>(variant?.durationMin ?? 0);
  const [session, setSession] = useState<SessionState>({
    status: 'idle',
    totalSeconds: (variant?.durationMin ?? 0) * 60,
    remainingSeconds: (variant?.durationMin ?? 0) * 60,
    currentStepIndex: 0,
    steps: resolvedSteps,
  });
  const guardContextRef = useRef<{ wasRunning: boolean; onExit?: () => void } | null>(null);
  const previousPanelIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!variant) return;
    const safeDuration = variant.durationMin;
    const totalSeconds = Math.max(1, Math.round(safeDuration * 60));
    setPlannedDuration(safeDuration);
    setSession({
      status: 'idle',
      totalSeconds,
      remainingSeconds: totalSeconds,
      currentStepIndex: 0,
      steps: resolvedSteps.length ? resolvedSteps : defaultSteps,
    });
  }, [variant, resolvedSteps, defaultSteps]);

  useEffect(() => {
    if (session.status !== 'running') return;

    const intervalId = window.setInterval(() => {
      setSession((prev) => {
        if (prev.status !== 'running') return prev;
        const nextRemaining = Math.max(prev.remainingSeconds - 1, 0);
        const stepDuration = Math.max(Math.floor(prev.totalSeconds / Math.max(prev.steps.length, 1)), 1);
        const elapsed = prev.totalSeconds - nextRemaining;
        const nextStepIndex = Math.min(
          Math.floor(elapsed / stepDuration),
          Math.max(prev.steps.length - 1, 0),
        );

        if (nextRemaining === 0) {
          return {
            ...prev,
            status: 'completed',
            remainingSeconds: 0,
            currentStepIndex: nextStepIndex,
          };
        }

        return {
          ...prev,
          remainingSeconds: nextRemaining,
          currentStepIndex: nextStepIndex,
        };
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [session.status]);

  useEffect(() => {
    if (session.status !== 'completed') return;

    if (training && variant) {
      const completedAt = Date.now();
      const durationMinPlanned = plannedDuration || variant.durationMin;
      const durationSecActual = Math.max(session.totalSeconds - session.remainingSeconds, 0);
      const stepsSummary =
        session.steps && session.steps.length ? session.steps.slice(0, 3).join(' • ') : undefined;

      addCompletedSession({
        id: `${moduleId ?? 'module'}-${trainingId ?? 'training'}-${completedAt}`,
        completedAt,
        moduleId: moduleId ?? 'unknown',
        trainingId: trainingId ?? 'unknown',
        trainingTitle: training.title,
        intensity: variant.intensity,
        durationMinPlanned,
        durationSecActual: durationSecActual || Math.max(variant.durationMin * 60, 1),
        paceCue: variant.paceCue,
        stepsSummary,
      });
    }

    closePanel();
    navigate('/completion?return=/trainieren');
  }, [
    session.status,
    session.totalSeconds,
    session.remainingSeconds,
    session.steps,
    closePanel,
    navigate,
    training,
    trainingId,
    moduleId,
    variant,
    plannedDuration,
  ]);

  useEffect(() => {
    const previousId = previousPanelIdRef.current;

    if (
      previousId === 'trainieren-session-interrupt' &&
      panelState.panelId !== 'trainieren-session-interrupt'
    ) {
      const ctx = guardContextRef.current;
      if (ctx?.wasRunning) {
        setSession((prev) => (prev.status === 'paused' ? { ...prev, status: 'running' } : prev));
      }
      guardContextRef.current = null;
    }

    previousPanelIdRef.current = panelState.panelId;
  }, [panelState]);

  const resetSession = useCallback(() => {
    const baseDuration = plannedDuration || variant?.durationMin || 0;
    const totalSeconds = Math.max(1, Math.round(baseDuration * 60));
    setSession({
      status: 'idle',
      totalSeconds,
      remainingSeconds: totalSeconds,
      currentStepIndex: 0,
      steps: resolvedSteps.length ? resolvedSteps : variant ? defaultSteps : [],
    });
  }, [plannedDuration, resolvedSteps, variant, defaultSteps]);

  const handleAdjustDuration = useCallback(
    (delta: number) => {
      if (!variant) return;
      if (session.status === 'running' || session.status === 'paused') return;
      const nextDuration = clampDuration((plannedDuration || variant.durationMin) + delta);
      const totalSeconds = Math.max(1, Math.round(nextDuration * 60));
      setPlannedDuration(nextDuration);
      setSession((prev) => ({
        ...prev,
        status: 'idle',
        totalSeconds,
        remainingSeconds: totalSeconds,
        currentStepIndex: 0,
        steps: resolvedSteps.length ? resolvedSteps : defaultSteps,
      }));
    },
    [variant, session.status, plannedDuration, resolvedSteps, defaultSteps],
  );

  const handleStart = useCallback(() => {
    if (!variant) return;
    const baseDuration = plannedDuration || variant.durationMin;
    const totalSeconds = Math.max(1, Math.round(baseDuration * 60));
    closePanel();
    setSession({
      status: 'running',
      totalSeconds,
      remainingSeconds: totalSeconds,
      currentStepIndex: 0,
      steps: resolvedSteps.length ? resolvedSteps : defaultSteps,
    });
  }, [variant, plannedDuration, resolvedSteps, defaultSteps, closePanel]);

  const togglePause = useCallback(() => {
    setSession((prev) => {
      if (prev.status === 'running') return { ...prev, status: 'paused' };
      if (prev.status === 'paused') return { ...prev, status: 'running' };
      return prev;
    });
  }, []);

  const openInterruptConfirm = useCallback(
    (onExit?: () => void) => {
      if (session.status !== 'running' && session.status !== 'paused') {
        onExit?.();
        return;
      }

      const wasRunning = session.status === 'running';
      guardContextRef.current = { wasRunning, onExit };

      if (wasRunning) {
        setSession((prev) => ({ ...prev, status: 'paused' }));
      }

      openBottomSheet('trainieren-session-interrupt', {
        onContinue: () => {
          closePanel();
          const ctx = guardContextRef.current;
          guardContextRef.current = null;
          if (ctx?.wasRunning) {
            setSession((prev) => ({ ...prev, status: 'running' }));
          }
        },
        onExit: () => {
          closePanel();
          guardContextRef.current = null;
          resetSession();
          onExit?.();
        },
      });
    },
    [session.status, openBottomSheet, closePanel, resetSession],
  );

  const handleStop = useCallback(() => openInterruptConfirm(), [openInterruptConfirm]);

  const handleGuardedNavigation = useCallback(
    (actionId: string) => {
      const performNavigation = () => {
        switch (actionId) {
          case 'goBack':
            goBack();
            return;
          case 'openNotifications':
            openNotifications();
            return;
          case 'openSettings':
            openSettings();
            return;
          default:
            return;
        }
      };

      if (session.status === 'running' || session.status === 'paused') {
        openInterruptConfirm(performNavigation);
      } else {
        performNavigation();
      }
    },
    [session.status, goBack, openNotifications, openSettings, openInterruptConfirm],
  );

  useEffect(() => {
    registerHeaderActionHandler('trainieren-detail-guard', (action) => {
      handleGuardedNavigation(action.id);
    });
  }, [handleGuardedNavigation]);

  const handleInfoClick = useCallback(() => {
    if (!moduleId || !trainingId) return;

    openRightPanel('training-info', {
      moduleId,
      trainingId,
      intensity,
      title: training?.title,
      moduleTitle: moduleDef?.title,
    });
  }, [moduleId, trainingId, intensity, training?.title, moduleDef?.title, openRightPanel]);

  if (isLoading) {
    return <p className="trainieren-status">{t('trainieren.detail.loading')}</p>;
  }

  if (error || !moduleDef || !training || !variant) {
    return <p className="trainieren-status">{t('trainieren.detail.notFound')}</p>;
  }

  const activeSteps = session.steps.length ? session.steps : resolvedSteps;
  const isActive = session.status === 'running' || session.status === 'paused';
  const stepProgress =
    activeSteps.length > 0 ? ((session.currentStepIndex + 1) / activeSteps.length) * 100 : 0;
  const ringProgress =
    isActive && session.totalSeconds > 0
      ? Math.min(Math.max(session.remainingSeconds / session.totalSeconds, 0), 1)
      : 1;
  const ringDashOffset = TIMER_CIRCUMFERENCE * (1 - ringProgress);
  const timerLabel = isActive ? formatSeconds(session.remainingSeconds) : formatMinutesToTime(plannedDuration);
  const instructionSteps = resolvedSteps.slice(0, 4);
  const stepProgressLabel = `${t('trainieren.detail.stepPrefix')} ${session.currentStepIndex + 1}/${activeSteps.length}`;

  const goToOverview = () => {
    if (moduleDef) {
      goTo(`/trainieren/${moduleDef.id}`);
    } else {
      goBack();
    }
  };

  const pageClassName = `training-detail-page${isPhysicalModule ? ' training-detail-page--physical' : ''}`;

  return (
    <div className={pageClassName}>
      <div className="td-metaRow">
        <span className="td-categoryPill">{moduleDef?.title ?? moduleId}</span>
        <button
          type="button"
          className="td-infoBtn"
          aria-label={t('trainieren.detail.infoLabel')}
          onClick={handleInfoClick}
        >
          <Icon name="info" filled size={22} />
        </button>
      </div>

      {!isPhysicalModule && (
        <div className="td-subMeta">
          <span className="training-detail__chip training-detail__chip--intensity">
            <Icon name="favorite" filled size={18} />
            {getIntensityLabel(t, variant.intensity)}
          </span>
          <span className="training-detail__chip">
            <Icon name="schedule" size={18} />
            {variant.durationMin} {t('trainieren.minutes')}
          </span>
        </div>
      )}

      <div className="training-detail__header">
        <h1 className="training-detail__title">{training.title}</h1>
        {isPhysicalModule ? (
          <>
            <p className="training-detail__description">
              {physicalIntroKey ? t(physicalIntroKey) : training.shortDesc}
            </p>
            <p className="training-detail__info-hint">{t('trainDetail.physical.infoHint')}</p>
          </>
        ) : (
          <>
            <p className="training-detail__description">{training.shortDesc}</p>
            <p className="training-detail__highlight">{variant.paceCue}</p>
          </>
        )}
      </div>

      {isActive ? (
        <div className="training-detail__card training-detail__card--active">
          <div className="training-detail__section-top">
            <Badge variant="accent">{t('trainieren.detail.activeLabel')}</Badge>
            <span className="training-detail__step-progress">
              {stepProgressLabel}
            </span>
          </div>

          <div className="training-detail__timer-card">
            <div className="training-detail__timer-figure">
              <svg className="training-detail__timer-svg" viewBox="0 0 120 120" aria-hidden="true">
                <circle className="training-detail__timer-track" cx="60" cy="60" r={TIMER_RADIUS} />
                <circle
                  className="training-detail__timer-progress"
                  cx="60"
                  cy="60"
                  r={TIMER_RADIUS}
                  strokeDasharray={TIMER_CIRCUMFERENCE}
                  strokeDashoffset={ringDashOffset}
                />
              </svg>
              <div className="training-detail__timer-center">
                <span className="training-detail__time">{timerLabel}</span>
                <span className="training-detail__time-label">{t('trainieren.minutes')}</span>
              </div>
            </div>
          </div>

          <div className="training-detail__current-step">
            <p className="training-detail__current-step-label">{t('trainieren.detail.currentStep')}</p>
            <p className="training-detail__current-step-text">
              {activeSteps[session.currentStepIndex] ?? ''}
            </p>
          </div>

          <ProgressBar
            value={Math.round(stepProgress)}
            aria-label={stepProgressLabel}
          />

          <div className="training-detail__controls-grid">
            <Button variant="secondary" fullWidth onClick={togglePause}>
              {session.status === 'running'
                ? t('trainieren.detail.pause')
                : t('trainieren.detail.resume')}
            </Button>
            <Button variant="primary" fullWidth onClick={handleStop}>
              {t('trainieren.detail.stop')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="training-detail__card td-timerCard">
          <div className="training-detail__timer-card td-ring">
            <div className="training-detail__timer-figure">
              <svg className="training-detail__timer-svg" viewBox="0 0 120 120" aria-hidden="true">
                <circle className="training-detail__timer-track" cx="60" cy="60" r={TIMER_RADIUS} />
                <circle
                  className="training-detail__timer-progress"
                  cx="60"
                  cy="60"
                  r={TIMER_RADIUS}
                  strokeDasharray={TIMER_CIRCUMFERENCE}
                  strokeDashoffset={ringDashOffset}
                />
              </svg>
              <div className="training-detail__timer-center">
                <span className="training-detail__time">{timerLabel}</span>
                <span className="training-detail__time-label">{t('trainieren.minutes')}</span>
              </div>
              <div className="training-detail__ring-actions">
                <button
                  type="button"
                  className="training-detail__round-button"
                  onClick={() => handleAdjustDuration(-1)}
                  aria-label={t('trainieren.detail.decrease')}
                  disabled={session.status === 'running' || session.status === 'paused'}
                >
                  <Icon name="remove" size={22} />
                </button>
                <button
                  type="button"
                  className="training-detail__round-button"
                  onClick={() => handleAdjustDuration(1)}
                  aria-label={t('trainieren.detail.increase')}
                  disabled={session.status === 'running' || session.status === 'paused'}
                >
                  <Icon name="add" size={22} />
                </button>
              </div>
            </div>
          </div>

          <div className="training-detail__cta td-cta">
            <Button
              fullWidth
              className="training-detail__start-button"
              onClick={handleStart}
              disabled={session.status === 'running' || session.status === 'paused'}
            >
              <Icon name="play_circle" filled size={28} />
              {t('trainieren.detail.startCta')}
            </Button>
            <p className="training-detail__safety">{t('trainieren.detail.safety')}</p>
          </div>
        </div>
      )}

      {isActive || isPhysicalModule ? null : (
        <section className="training-detail__section">
          <div className="training-detail__section-top">
            <h2 className="training-detail__section-title">{t('trainieren.detail.instructions')}</h2>
          </div>
          <ul className="training-detail__steps">
            {instructionSteps.map((step, index) => (
              <li key={step} className="training-detail__step">
                <span className="training-detail__step-index">{index + 1}</span>
                <p className="training-detail__step-text">{step}</p>
              </li>
            ))}
          </ul>
          <div className="training-detail__secondary-actions">
            <Button variant="ghost" onClick={goToOverview}>
              {t('trainieren.detail.backToOverview')}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

