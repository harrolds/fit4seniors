import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import { useI18n } from '../../../shared/lib/i18n';
import type { BrainDifficulty, BrainMetrics } from '../components/BrainExerciseSlot';

type Phase = 'showing' | 'input' | 'completed';

type MemoryPuzzleProps = {
  difficulty: BrainDifficulty;
  disabled?: boolean;
  onComplete: (metrics: BrainMetrics) => void;
};

const highlightOnMs = 600;
const highlightOffMs = 250;
const sequenceByDifficulty: Record<BrainDifficulty, number> = {
  light: 3,
  medium: 4,
  hard: 5,
};

export const MemoryPuzzle: React.FC<MemoryPuzzleProps> = ({ difficulty, disabled = false, onComplete }) => {
  const { t } = useI18n();
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('showing');
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [inputIndex, setInputIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const timersRef = useRef<number[]>([]);
  const completionFiredRef = useRef(false);

  const gridCells = useMemo(() => Array.from({ length: 9 }, (_, index) => index), []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const playSequence = useCallback(
    (seq: number[]) => {
      clearTimers();
      setPhase('showing');
      setInputIndex(0);
      setActiveCell(null);
      setMessage(t('brain.memory.watch'));
      let delay = 200;

      seq.forEach((cell, idx) => {
        timersRef.current.push(
          window.setTimeout(() => {
            setActiveCell(cell);
          }, delay),
        );
        delay += highlightOnMs;
        timersRef.current.push(
          window.setTimeout(() => {
            setActiveCell(null);
            if (idx === seq.length - 1) {
              setPhase('input');
              setMessage(t('brain.memory.repeat'));
            }
          }, delay),
        );
        delay += highlightOffMs;
      });
    },
    [clearTimers, t],
  );

  const startRound = useCallback(() => {
    const seqLength = sequenceByDifficulty[difficulty] ?? 3;
    const shuffled = [...gridCells];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const nextSequence = shuffled.slice(0, seqLength);
    completionFiredRef.current = false;
    setSequence(nextSequence);
    setPhase('showing');
    setInputIndex(0);
    setAttempts(0);
    setErrors(0);
    playSequence(nextSequence);
  }, [difficulty, gridCells, playSequence]);

  useEffect(() => {
    if (disabled) {
      clearTimers();
      const seqLength = sequenceByDifficulty[difficulty] ?? 3;
      setSequence(gridCells.slice(0, seqLength));
      setPhase('showing');
      setInputIndex(0);
      setActiveCell(null);
      setMessage(t('brain.memory.watch'));
      setAttempts(0);
      setErrors(0);
      return () => clearTimers();
    }

    startRound();
    return () => clearTimers();
  }, [startRound, clearTimers, disabled, difficulty, gridCells, t]);

  const handleCellClick = (index: number) => {
    if (disabled || phase !== 'input' || completionFiredRef.current) return;
    const expected = sequence[inputIndex];
    if (expected === undefined) return;

    setAttempts((prev) => prev + 1);
    setActiveCell(index);
    timersRef.current.push(
      window.setTimeout(() => {
        setActiveCell(null);
      }, 220),
    );

    if (index === expected) {
      const nextIndex = inputIndex + 1;
      if (nextIndex >= sequence.length) {
        setPhase('completed');
        setMessage(t('brain.ui.completed'));
      }
      setInputIndex(nextIndex);
    } else {
      setErrors((prev) => prev + 1);
      setMessage(t('brain.ui.tryAgain'));
      playSequence(sequence);
    }
  };

  const handleFinish = () => {
    if (disabled || completionFiredRef.current) return;
    completionFiredRef.current = true;
    onComplete({
      brainType: 'memory',
      puzzleType: 'memory-grid',
      datasetKey: 'legacy',
      difficulty,
      attempts,
      errors,
    });
  };

  return (
    <div className="brain-slot">
      <div className="brain-slot__header">
        <p className="brain-slot__title">{t('brain.type.memory')}</p>
        <span className="brain-slot__status">
          {phase === 'completed' ? t('brain.ui.completed') : t('brain.memory.status')}
        </span>
      </div>

      <div className="brain-grid" aria-label={t('brain.type.memory')}>
        {gridCells.map((cell) => {
          const isLit = activeCell === cell;
          const isCellDisabled = disabled || phase === 'completed';
          return (
            <button
              key={cell}
              type="button"
              className={`brain-grid__cell${isLit ? ' brain-grid__cell--active' : ''}`}
              onClick={() => handleCellClick(cell)}
              disabled={isCellDisabled}
            >
              {cell + 1}
            </button>
          );
        })}
      </div>

      <p className="brain-slot__hint">{message}</p>

      {phase === 'completed' ? (
        <div className="brain-actions">
          <Button fullWidth onClick={handleFinish}>
            {t('brain.ui.finish')}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

