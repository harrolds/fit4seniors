import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { addCompletedSession } from '../../progress/progressStorage';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

export const DedicatedSessionScreen: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const hasLoggedRef = useRef(false);

  const isWordPuzzle = exerciseId === 'wordpuzzle';
  const targetWord = useMemo(() => (locale === 'de' ? 'KAFFEE' : 'COFFEE'), [locale]);

  const letterGrid = useMemo(
    () =>
      locale === 'de'
        ? ['K', 'A', 'F', 'F', 'E', 'E', 'R', 'A', 'M', 'P', 'T', 'U', 'I', 'N', 'S']
        : ['C', 'O', 'F', 'F', 'E', 'E', 'R', 'A', 'M', 'P', 'T', 'U', 'I', 'N', 'S'],
    [locale],
  );

  const selectedWord = useMemo(
    () => selectedIndices.map((index) => letterGrid[index] ?? '').join(''),
    [selectedIndices, letterGrid],
  );

  const isSuccess = selectedWord.toUpperCase() === targetWord;
  const progressValue = Math.min(selectedWord.length / targetWord.length, 1);

  useEffect(() => {
    startTimeRef.current = Date.now();
    hasLoggedRef.current = false;
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        if (isPaused || isSuccess) return prev;
        return prev + 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isPaused, isSuccess]);

  if (!isWordPuzzle) {
    return <Navigate to="/brain" replace />;
  }

  const handleLetterClick = (index: number) => {
    if (isPaused || isSuccess) return;
    setSelectedIndices((prev) => {
      if (prev.includes(index)) return prev;
      if (prev.length >= targetWord.length) return prev;
      return [...prev, index];
    });
  };

  const handleReset = () => {
    setSelectedIndices([]);
    setElapsedSeconds(0);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    hasLoggedRef.current = false;
  };

  const handleStop = () => {
    const durationSec = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    navigate('/completion', {
      state: {
        moduleId: 'brain',
        unitTitle: t('brain.session.headerTitle'),
        durationSec,
        finishedAt: Date.now(),
        completed: false,
        returnPath: '/brain',
      },
    });
  };

  const handleFinish = () => {
    const completedAt = Date.now();
    const durationSec = Math.max(1, Math.round((completedAt - startTimeRef.current) / 1000));

    if (!hasLoggedRef.current) {
      addCompletedSession({
        id: `brain-${exerciseId ?? 'session'}-${completedAt}`,
        completedAt,
        moduleId: 'brain',
        trainingId: exerciseId ?? 'wordpuzzle',
        trainingTitle: t('brain.session.headerTitle'),
        unitTitle: t('brain.session.headerTitle'),
        intensity: 'medium',
        durationMinPlanned: 0,
        durationSecActual: durationSec,
        summary: { kind: 'found_word', value: targetWord, success: true },
        completed: true,
      });
      hasLoggedRef.current = true;
    }

    navigate('/completion', {
      state: {
        moduleId: 'brain',
        unitTitle: t('brain.session.headerTitle'),
        durationSec,
        finishedAt: completedAt,
        summary: { kind: 'found_word', value: targetWord, success: true },
        completed: true,
        returnPath: '/brain',
      },
    });
  };

  return (
    <div className="brain-page brain-session">
      <SectionHeader as="h1" className="page-title" title={t('brain.session.headerTitle')} />
      <Card className="brain-session__summary" variant="elevated">
        <div className="brain-session__summary-header">
          <div className="brain-session__summary-left">
            <div className="brain-session__summary-icon">
              <Icon name="psychology" size={32} />
            </div>
            <div className="brain-session__summary-meta">
              <p className="brain-session__eyebrow">{t('brain.session.section.focusLabel')}</p>
              <h3 className="brain-session__title">{t('brain.session.headerTitle')}</h3>
              <p className="brain-session__level">
                {t('brain.session.levelLabel')}
                <strong>{t('brain.session.level.medium')}</strong>
              </p>
            </div>
          </div>
          <Icon name="info" size={24} />
        </div>

        <p className="brain-session__description">{t('brain.overview.card.wordpuzzle.subtitle')}</p>

        <div className="brain-session__progress" aria-label={t('brain.session.targetLabel')}>
          <div className="brain-session__progress-row">
            <span>{t('brain.session.targetLabel')}</span>
            <span>
              {selectedWord.length}/{targetWord.length}
            </span>
          </div>
          <div className="brain-session__progress-bar" role="progressbar" aria-valuenow={progressValue * 100} aria-valuemin={0} aria-valuemax={100}>
            <div className="brain-session__progress-fill" style={{ width: `${progressValue * 100}%` }} />
          </div>
        </div>
      </Card>

      <div className="brain-session__board" aria-live="polite">
        <p className="brain-session__target">
          {t('brain.session.targetLabel')}: {targetWord}
        </p>

        <div className="brain-grid">
          {letterGrid.map((letter, index) => {
            const isSelected = selectedIndices.includes(index);
            const cellClass = isSelected ? 'brain-grid__cell brain-grid__cell--selected' : 'brain-grid__cell';
            return (
              <button
                key={`${letter}-${index}`}
                type="button"
                className={cellClass}
                onClick={() => handleLetterClick(index)}
                aria-pressed={isSelected}
              >
                {letter}
              </button>
            );
          })}
        </div>

        <p className="brain-session__selection">
          {t('brain.session.targetLabel')}: {selectedWord || '-'}
        </p>

        {isSuccess ? (
          <div className="brain-session__success">
            <p className="brain-session__success-title">{t('brain.session.success')}</p>
            <Button variant="primary" onClick={handleFinish}>
              {t('brain.session.finish')}
            </Button>
          </div>
        ) : (
          <div className="brain-session__controls">
            <Button variant="secondary" onClick={() => setIsPaused((prev) => !prev)}>
              <Icon name={isPaused ? 'play_arrow' : 'pause'} size={22} />
              {t('brain.session.controls.pause')}
            </Button>
            <Button variant="primary" onClick={handleStop}>
              <Icon name="stop" size={22} />
              {t('brain.session.controls.stop')}
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              <Icon name="refresh" size={22} />
              {t('brain.session.controls.reset')}
            </Button>
          </div>
        )}
      </div>

      <div className="brain-session__timer">
        <Icon name="timer" size={22} />
        <span>{formatTime(elapsedSeconds)}</span>
      </div>
    </div>
  );
};




