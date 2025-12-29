import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';
import { usePanels } from '../../../shared/lib/panels';
import { BrainExercise } from '../types';
import { BRAIN_CATEGORIES } from '../brainCatalog';
import { BrainRoundResult } from './types';
import { logBrainSession } from '../../../state/brainSessions';
import { hashSeed } from './seed';
import { pickUniqueRoundIndices } from './pickUnique';

type BrainSessionEngineProps<TRoundData> = {
  exercise: BrainExercise;
  config: {
    roundsTotal: number;
    pool: TRoundData[];
    seedKey?: string;
  };
  renderer: (round: TRoundData, onAnswer: (result: BrainRoundResult) => void, roundIndex: number) => React.ReactNode;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

export const BrainSessionEngine = <TRoundData,>({
  exercise,
  config,
  renderer,
}: BrainSessionEngineProps<TRoundData>) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const panels = usePanels();
  const category = BRAIN_CATEGORIES.find((c) => c.id === exercise.category);
  const categoryLabel = category ? t(category.titleKey) : t('brain.header.title');
  const levelTextRaw = t('brain.levelLabelShort', { level: exercise.difficulty ?? 'L2' });
  const levelText = levelTextRaw === 'brain.levelLabelShort' ? `Level ${exercise.difficulty ?? 'L2'}` : levelTextRaw;
  const roundsText = t('brain.session.roundsShort');
  const seed = useMemo(
    () => hashSeed(`${exercise.id}::${config.seedKey ?? exercise.id}::${new Date().toISOString().slice(0, 10)}`),
    [config.seedKey, exercise.id],
  );
  const sessionRounds = useMemo(() => {
    const indices = pickUniqueRoundIndices(config.pool.length, config.roundsTotal, seed);
    return indices.map((index) => config.pool[index]);
  }, [config.pool, config.roundsTotal, seed]);
  const roundsTotal = config.roundsTotal;
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    if (finishedAt) {
      setElapsedSeconds(Math.max(0, Math.round((finishedAt - startedAt) / 1000)));
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.round((Date.now() - startedAt) / 1000)));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [startedAt, finishedAt]);

  const currentRound = useMemo(() => sessionRounds[roundIndex], [sessionRounds, roundIndex]);
  const progressValue = Math.min((roundIndex + 1) / roundsTotal, 1);
  const isCompleted = finishedAt !== null;
  const durationSec = isCompleted
    ? Math.max(1, Math.round(((finishedAt ?? Date.now()) - startedAt) / 1000))
    : elapsedSeconds;

  useEffect(() => {
    if (!finishedAt || hasLoggedRef.current) return;

    const durationMinutes = Math.max(1, Math.round(durationSec / 60));

    logBrainSession({
      exerciseId: exercise.id,
      category: exercise.category,
      durationMinutes,
      durationSecActual: durationSec,
      completed: true,
      timestamp: finishedAt,
      trainingTitle: t(exercise.titleKey),
      unitTitle: t(exercise.titleKey),
    });

    hasLoggedRef.current = true;
  }, [durationSec, exercise, finishedAt, t]);

  const handleAnswer = useCallback(
    (result: BrainRoundResult) => {
      setCorrectCount((prev) => prev + (result.correct ? 1 : 0));
      setRoundIndex((prev) => {
        const next = prev + 1;
        if (next >= roundsTotal) {
          setFinishedAt(Date.now());
          return prev;
        }
        return next;
      });
    },
    [roundsTotal],
  );

  const handleRestart = () => {
    setRoundIndex(0);
    setCorrectCount(0);
    setStartedAt(Date.now());
    setFinishedAt(null);
    setElapsedSeconds(0);
    hasLoggedRef.current = false;
  };

  const handleBack = () => {
    navigate('/brain');
  };

  const handleInfoClick = () => {
    panels?.openRightPanel('brain-exercise-info', { exerciseId: exercise.id });
  };

  return (
    <div className="brain-page brain-session">
      <div className="td-metaRow">
        <span className="td-categoryPill">{categoryLabel}</span>
        <button
          type="button"
          className="td-infoBtn"
          aria-label={t('brain.detail.infoLabel')}
          onClick={handleInfoClick}
        >
          <Icon name="info" filled size={22} />
        </button>
      </div>

      <div className="td-subMeta">
        <span className="training-detail__chip">
          <Icon name="military_tech" size={18} />
          {levelText}
        </span>
        <span className="training-detail__chip">
          <Icon name="schedule" size={18} />
          ~{exercise.estimatedMinutes} {t('trainieren.minutes')}
        </span>
        <span className="training-detail__chip">
          <Icon name="repeat" size={18} />
          {roundsTotal} {roundsText}
        </span>
      </div>

      <div className="training-detail__header">
        <SectionHeader
          as="h1"
          className="page-title training-detail__title"
          title={t(exercise.titleKey)}
          subtitle={t(exercise.subtitleKey)}
        />
        <p className="training-detail__description">{t(exercise.descriptionKey ?? exercise.subtitleKey)}</p>
      </div>

      <Card className="brain-session__summary" variant="elevated">
        <div className="brain-session__summary-header">
          <div className="brain-session__summary-left">
            <div className="brain-session__summary-icon">
              <Icon name="psychology" size={32} />
            </div>
            <div className="brain-session__summary-meta">
              <p className="brain-session__eyebrow">{t('brain.session.section.focusLabel')}</p>
            </div>
          </div>
          <div className="brain-session__summary-right">
            <div className="brain-session__timer">
              <Icon name="timer" size={22} />
              <span>{formatTime(durationSec)}</span>
            </div>
            <button
              type="button"
              className="brain-session__infoBtn"
              aria-label={t('brain.detail.infoLabel')}
              onClick={handleInfoClick}
            >
              <Icon name="info" filled size={20} />
            </button>
          </div>
        </div>

        <div className="brain-session__progress" aria-label={t('brain.session.roundLabel', { current: roundIndex + 1, total: roundsTotal })}>
          <div className="brain-session__progress-row">
            <span>{t('brain.session.roundLabel', { current: Math.min(roundIndex + 1, roundsTotal), total: roundsTotal })}</span>
            <span>
              {correctCount}/{roundsTotal} {t('brain.session.correctShort')}
            </span>
          </div>
          <div className="brain-session__progress-bar" role="progressbar" aria-valuenow={progressValue * 100} aria-valuemin={0} aria-valuemax={100}>
            <div className="brain-session__progress-fill" style={{ width: `${progressValue * 100}%` }} />
          </div>
        </div>
      </Card>

      <div className="brain-session__board">
        {isCompleted ? (
          <div className="brain-session__completion">
            <p className="brain-session__completion-title">{t('brain.session.completedTitle')}</p>
            <p className="brain-session__completion-score">{t('brain.session.correctSummary', { correct: correctCount, total: roundsTotal })}</p>
            <div className="brain-session__completion-actions">
              <Button variant="primary" onClick={handleRestart}>
                {t('brain.session.retry')}
              </Button>
              <Button variant="ghost" onClick={handleBack}>
                {t('brain.session.backToOverview')}
              </Button>
            </div>
          </div>
        ) : (
          renderer(currentRound, handleAnswer, roundIndex)
        )}
      </div>
    </div>
  );
};

