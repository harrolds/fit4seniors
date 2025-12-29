import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { usePanels } from '../../../shared/lib/panels';
import { logBrainSession } from '../../../state/brainSessions';
import { BRAIN_CATEGORIES, getExerciseById } from '../brainCatalog';
import { BrainSessionEngine } from '../session/BrainSessionEngine';
import { BrainRoundResult } from '../session/types';
import { getRuntimeConfig } from '../session/exerciseConfig';
import { ChoiceTemplate, ChoiceRoundData } from '../templates/ChoiceTemplate';
import { OddOneOutTemplate, OddOneOutRoundData } from '../templates/OddOneOutTemplate';

type SupportedRound = ChoiceRoundData | OddOneOutRoundData;

const useOptionalPanels = () => {
  try {
    return usePanels();
  } catch {
    return null;
  }
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const WordpuzzleSession: React.FC<{ exerciseId: string }> = ({ exerciseId }) => {
  const { t, locale } = useI18n();
  const panels = useOptionalPanels();
  const navigate = useNavigate();
  const exerciseDef = getExerciseById(exerciseId);
  const category =
    exerciseDef ? BRAIN_CATEGORIES.find((c) => c.id === exerciseDef.category) : BRAIN_CATEGORIES.find((c) => c.id === 'memory');
  const categoryLabel = category ? t(category.titleKey) : t('brain.header.title');
  const levelLabel = exerciseDef?.difficulty ?? 'L2';
  const minutesLabel = exerciseDef?.estimatedMinutes ?? 5;
  const roundsLabel = 1;
  const levelTextRaw = t('brain.levelLabelShort', { level: levelLabel });
  const levelText = levelTextRaw === 'brain.levelLabelShort' ? `Level ${levelLabel}` : levelTextRaw;
  const roundsTextRaw = t('brain.session.roundsShort');
  const roundsText = roundsTextRaw === 'brain.session.roundsShort' ? 'Runden' : roundsTextRaw;
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const hasLoggedRef = useRef(false);

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

  const handleInfoClick = () => {
    panels?.openRightPanel('brain-exercise-info', { exerciseId });
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
      const durationMinutes = Math.max(1, Math.round(durationSec / 60));
      logBrainSession({
        exerciseId: exerciseId ?? 'wordpuzzle',
        category: exerciseDef?.category,
        durationMinutes,
        durationSecActual: durationSec,
        completed: true,
        timestamp: completedAt,
        trainingTitle: t(exerciseDef?.titleKey ?? 'brain.session.headerTitle'),
        unitTitle: t('brain.session.headerTitle'),
        summary: { kind: 'found_word', value: targetWord, success: true },
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
      <div className="td-metaRow">
        <span className="td-categoryPill">{categoryLabel}</span>
        <button
          type="button"
          className="td-infoBtn"
          aria-label={t('brain.detail.infoLabel')}
          onClick={handleInfoClick}
        >
          <Icon name="info" filled size={20} />
        </button>
      </div>

      <div className="td-subMeta">
        <span className="training-detail__chip">
          <Icon name="military_tech" size={18} />
          {levelText}
        </span>
        <span className="training-detail__chip">
          <Icon name="schedule" size={18} />
          ~{minutesLabel} {t('trainieren.minutes')}
        </span>
        <span className="training-detail__chip">
          <Icon name="repeat" size={18} />
          {roundsLabel} {roundsText}
        </span>
      </div>

      <div className="training-detail__header">
        <SectionHeader
          as="h1"
          className="page-title training-detail__title"
          title={t(exerciseDef?.titleKey ?? 'brain.session.headerTitle')}
          subtitle={t(exerciseDef?.subtitleKey ?? 'brain.session.headerTitle')}
        />
        <p className="training-detail__description">
          {t(exerciseDef?.descriptionKey ?? exerciseDef?.subtitleKey ?? 'brain.session.headerTitle')}
        </p>
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
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          </div>
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

type ResolvedRuntimeConfig = ReturnType<typeof getRuntimeConfig> extends infer T ? NonNullable<T> : never;

const renderTemplate = (template: ResolvedRuntimeConfig['template'], round: SupportedRound, onAnswer: (result: BrainRoundResult) => void) => {
  if (template === 'choice') {
    return <ChoiceTemplate round={round as ChoiceRoundData} onAnswer={onAnswer} />;
  }

  if (template === 'odd_one_out') {
    return <OddOneOutTemplate round={round as OddOneOutRoundData} onAnswer={onAnswer} />;
  }

  return null;
};

export const DedicatedSessionScreen: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { t } = useI18n();
  const exercise = exerciseId ? getExerciseById(exerciseId) : undefined;
  const category = exercise ? BRAIN_CATEGORIES.find((item) => item.id === exercise.category) : undefined;
  const runtimeConfig = useMemo(() => (exercise ? getRuntimeConfig(exercise.id) : undefined), [exercise]);
  const isAvailable = Boolean(exercise?.implemented);

  if (!exercise) {
    return <Navigate to="/brain" replace />;
  }

  if (!isAvailable) {
    if (category) {
      return <Navigate to={`/brain/category/${category.id}`} replace />;
    }
    return <Navigate to="/brain" replace />;
  }

  if (exercise.uiTemplate === 'wordpuzzle') {
    return <WordpuzzleSession exerciseId={exerciseId ?? exercise.id} />;
  }

  if (!runtimeConfig) {
    return <Navigate to="/brain" replace />;
  }

  return (
    <BrainSessionEngine
      exercise={exercise}
      roundsTotal={runtimeConfig.roundsTotal}
      generator={(index) => runtimeConfig.buildRound(index) as SupportedRound}
      renderer={(round, onAnswer) => renderTemplate(runtimeConfig.template, round, onAnswer)}
    />
  );
};




