import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import { useI18n } from '../../../shared/lib/i18n';
import type { BrainDifficulty, BrainMetrics } from '../components/BrainExerciseSlot';

type PatternSet = {
  sequence: string[];
  options: [string, string, string];
  answerIndex: number;
  hint: string;
};

type PatternsPuzzleProps = {
  difficulty: BrainDifficulty;
  disabled?: boolean;
  onComplete: (metrics: BrainMetrics) => void;
};

const patternSets: Record<BrainDifficulty, PatternSet[]> = {
  light: [
    { sequence: ['▲', '●', '▲', '?'], options: ['●', '■', '★'], answerIndex: 0, hint: 'Shapes alternate.' },
    { sequence: ['●', '★', '●', '★', '?'], options: ['●', '▲', '■'], answerIndex: 0, hint: 'Repeats two symbols.' },
    { sequence: ['■', '■', '▲', '■', '■', '?'], options: ['▲', '■', '●'], answerIndex: 0, hint: 'Two squares then a triangle.' },
  ],
  medium: [
    { sequence: ['▲', '■', '▲', '■', '?'], options: ['▲', '■', '★'], answerIndex: 0, hint: 'ABAB pattern continues.' },
    { sequence: ['★', '▲', '★', '▲', '★', '?'], options: ['▲', '★', '■'], answerIndex: 0, hint: 'Alternating shapes.' },
    { sequence: ['●', '■', '★', '●', '■', '?'], options: ['★', '●', '■'], answerIndex: 0, hint: 'ABC then A B ...' },
  ],
  hard: [
    { sequence: ['▲', '▲', '■', '▲', '▲', '■', '?'], options: ['▲', '■', '★'], answerIndex: 0, hint: 'Two triangles then a square.' },
    { sequence: ['●', '■', '●', '●', '■', '●', '?'], options: ['●', '■', '▲'], answerIndex: 0, hint: 'Repeating trio: circle, square, circle.' },
    { sequence: ['★', '▲', '▲', '★', '▲', '▲', '?'], options: ['★', '▲', '■'], answerIndex: 0, hint: 'Star then two triangles.' },
  ],
};

export const PatternsPuzzle: React.FC<PatternsPuzzleProps> = ({ difficulty, disabled = false, onComplete }) => {
  const { t } = useI18n();
  const [status, setStatus] = useState<'playing' | 'completed'>('playing');
  const [feedback, setFeedback] = useState('');
  const [currentSet, setCurrentSet] = useState<PatternSet>(() => patternSets[difficulty][0]);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const completionFiredRef = useRef(false);

  const puzzleSet = useMemo(() => {
    const pool = patternSets[difficulty] ?? patternSets.light;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }, [difficulty]);

  useEffect(() => {
    setStatus('playing');
    setFeedback(t('brain.ui.promptPattern'));
    setAttempts(0);
    setErrors(0);
    completionFiredRef.current = false;
    setCurrentSet(puzzleSet);
  }, [puzzleSet, t]);

  const handleSelect = (index: number) => {
    if (disabled || status === 'completed') return;
    setAttempts((prev) => prev + 1);
    if (index === currentSet.answerIndex) {
      setStatus('completed');
      setFeedback(t('brain.ui.completed'));
    } else {
      setErrors((prev) => prev + 1);
      setFeedback(t('brain.ui.tryAgain'));
    }
  };

  const handleFinish = () => {
    if (disabled || completionFiredRef.current || status !== 'completed') return;
    completionFiredRef.current = true;
    onComplete({ brainType: 'patterns', difficulty, attempts, errors });
  };

  return (
    <div className="brain-slot">
      <div className="brain-slot__header">
        <p className="brain-slot__title">{t('brain.type.patterns')}</p>
        <span className="brain-slot__status">
          {status === 'completed' ? t('brain.ui.completed') : t('brain.ui.promptPattern')}
        </span>
      </div>

      <div className="brain-pattern" aria-label="Pattern sequence">
        {currentSet.sequence.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className={`brain-pattern__item${item === '?' ? ' brain-pattern__item--missing' : ''}`}
            aria-hidden={item !== '?'}
          >
            {item}
          </div>
        ))}
      </div>

      <p className="brain-slot__hint">{t('brain.ui.promptPattern')}</p>

      <div className="brain-grid brain-grid--answers" role="group" aria-label="Answer choices">
        {currentSet.options.map((option, index) => (
          <button
            key={option + index}
            type="button"
            className="brain-word"
            onClick={() => handleSelect(index)}
            disabled={disabled || status === 'completed'}
          >
            {option}
          </button>
        ))}
      </div>

      <p className="brain-slot__hint">{feedback}</p>

      {status === 'completed' ? (
        <div className="brain-actions">
          <Button fullWidth onClick={handleFinish}>
            {t('brain.ui.finish')}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

