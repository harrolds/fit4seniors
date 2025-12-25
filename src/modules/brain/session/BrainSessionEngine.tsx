import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';
import { BrainExercise } from '../types';
import { BrainRoundResult } from './types';

type BrainSessionEngineProps<TRoundData> = {
  exercise: BrainExercise;
  generator: (roundIndex: number) => TRoundData;
  renderer: (round: TRoundData, onAnswer: (result: BrainRoundResult) => void) => React.ReactNode;
  roundsTotal?: number;
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
  generator,
  renderer,
  roundsTotal = 8,
}: BrainSessionEngineProps<TRoundData>) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

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

  const currentRound = useMemo(() => generator(roundIndex), [generator, roundIndex]);
  const progressValue = Math.min((roundIndex + 1) / roundsTotal, 1);
  const isCompleted = finishedAt !== null;
  const durationSec = isCompleted
    ? Math.max(1, Math.round(((finishedAt ?? Date.now()) - startedAt) / 1000))
    : elapsedSeconds;

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
  };

  const handleBack = () => {
    navigate('/brain');
  };

  return (
    <div className="brain-page brain-session">
      <SectionHeader as="h1" className="page-title" title={t(exercise.titleKey)} subtitle={t(exercise.subtitleKey)} />

      <Card className="brain-session__summary" variant="elevated">
        <div className="brain-session__summary-header">
          <div className="brain-session__summary-left">
            <div className="brain-session__summary-icon">
              <Icon name="psychology" size={32} />
            </div>
            <div className="brain-session__summary-meta">
              <p className="brain-session__eyebrow">{t('brain.session.section.focusLabel')}</p>
              <h3 className="brain-session__title">{t(exercise.titleKey)}</h3>
              <p className="brain-session__level">
                {t('brain.session.roundLabel', { current: Math.min(roundIndex + 1, roundsTotal), total: roundsTotal })}
              </p>
            </div>
          </div>
          <div className="brain-session__timer">
            <Icon name="timer" size={22} />
            <span>{formatTime(durationSec)}</span>
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
          renderer(currentRound, handleAnswer)
        )}
      </div>
    </div>
  );
};

