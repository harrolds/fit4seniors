import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../shared/ui/Button';

type BrainDifficulty = 'light' | 'medium' | 'hard';
type Phase = 'showing' | 'input' | 'completed';

type MemoryPuzzleProps = {
  difficulty: BrainDifficulty;
  onComplete: () => void;
};

const highlightOnMs = 600;
const highlightOffMs = 250;
const sequenceByDifficulty: Record<BrainDifficulty, number> = {
  light: 3,
  medium: 4,
  hard: 5,
};

export const MemoryPuzzle: React.FC<MemoryPuzzleProps> = ({ difficulty, onComplete }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('showing');
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [inputIndex, setInputIndex] = useState(0);
  const [message, setMessage] = useState('Watch the pattern, then repeat it.');
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
      setMessage('Watch the pattern, then repeat it.');
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
              setMessage('Now tap the same cells in order.');
            }
          }, delay),
        );
        delay += highlightOffMs;
      });
    },
    [clearTimers],
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
    playSequence(nextSequence);
  }, [difficulty, gridCells, playSequence]);

  useEffect(() => {
    startRound();
    return () => clearTimers();
  }, [startRound, clearTimers]);

  const handleCellClick = (index: number) => {
    if (phase !== 'input' || completionFiredRef.current) return;
    const expected = sequence[inputIndex];
    if (expected === undefined) return;

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
        setMessage('Completed! Tap Finish to continue.');
      }
      setInputIndex(nextIndex);
    } else {
      setMessage('Try again. Watch the pattern.');
      playSequence(sequence);
    }
  };

  const handleFinish = () => {
    if (completionFiredRef.current) return;
    completionFiredRef.current = true;
    onComplete();
  };

  return (
    <div className="brain-slot">
      <div className="brain-slot__header">
        <p className="brain-slot__title">Memory</p>
        <span className="brain-slot__status">
          {phase === 'completed' ? 'Completed' : 'Repeat the pattern'}
        </span>
      </div>

      <div className="brain-grid" aria-label="Memory grid">
        {gridCells.map((cell) => {
          const isLit = activeCell === cell;
          const isDisabled = phase === 'completed';
          return (
            <button
              key={cell}
              type="button"
              className={`brain-grid__cell${isLit ? ' brain-grid__cell--active' : ''}`}
              onClick={() => handleCellClick(cell)}
              disabled={isDisabled}
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
            Finish
          </Button>
        </div>
      ) : null}
    </div>
  );
};

