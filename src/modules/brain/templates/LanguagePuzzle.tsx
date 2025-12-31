import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import { useI18n } from '../../../shared/lib/i18n';
import type { BrainDifficulty, BrainMetrics } from '../components/BrainExerciseSlot';

type WordSet = {
  prompt: string;
  words: [string, string, string, string];
  oddIndex: number;
};

type LanguagePuzzleProps = {
  difficulty: BrainDifficulty;
  disabled?: boolean;
  onComplete: (metrics: BrainMetrics) => void;
};

const languageSets: Record<BrainDifficulty, WordSet[]> = {
  light: [
    { prompt: 'Pick the word that does NOT belong', words: ['apple', 'banana', 'carrot', 'pear'], oddIndex: 2 },
    { prompt: 'Pick the word that does NOT belong', words: ['red', 'blue', 'green', 'table'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['cat', 'dog', 'bird', 'chair'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['water', 'tea', 'milk', 'rock'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['spring', 'summer', 'autumn', 'spoon'], oddIndex: 3 },
  ],
  medium: [
    { prompt: 'Pick the word that does NOT belong', words: ['bus', 'train', 'bicycle', 'sofa'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['scarf', 'gloves', 'jacket', 'spoon'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['piano', 'violin', 'drums', 'garden'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['toast', 'cereal', 'yogurt', 'pillow'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['silver', 'gold', 'bronze', 'window'], oddIndex: 3 },
  ],
  hard: [
    { prompt: 'Pick the word that does NOT belong', words: ['tiny', 'minute', 'huge', 'little'], oddIndex: 2 },
    { prompt: 'Pick the word that does NOT belong', words: ['ponder', 'consider', 'imagine', 'sprint'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['novel', 'poem', 'essay', 'banana'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['rapid', 'swift', 'slow', 'brisk'], oddIndex: 2 },
    { prompt: 'Pick the word that does NOT belong', words: ['ancient', 'old', 'modern', 'aged'], oddIndex: 2 },
  ],
};

export const LanguagePuzzle: React.FC<LanguagePuzzleProps> = ({ difficulty, disabled = false, onComplete }) => {
  const { t } = useI18n();
  const [status, setStatus] = useState<'playing' | 'completed'>('playing');
  const [feedback, setFeedback] = useState('');
  const [currentSet, setCurrentSet] = useState<WordSet>(() => languageSets[difficulty][0]);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const completionFiredRef = useRef(false);

  const puzzleSet = useMemo(() => {
    const pool = languageSets[difficulty] ?? languageSets.light;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }, [difficulty]);

  useEffect(() => {
    setStatus('playing');
    setFeedback(t('brain.ui.promptOddOneOut'));
    setAttempts(0);
    setErrors(0);
    completionFiredRef.current = false;
    setCurrentSet(puzzleSet);
  }, [puzzleSet, t]);

  const handleSelect = (index: number) => {
    if (disabled || status === 'completed') return;
    setAttempts((prev) => prev + 1);
    if (index === currentSet.oddIndex) {
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
    onComplete({
      brainType: 'language',
      puzzleType: 'language-oddword',
      datasetKey: 'legacy',
      difficulty,
      attempts,
      errors,
    });
  };

  return (
    <div className="brain-slot">
      <div className="brain-slot__header">
        <p className="brain-slot__title">{t('brain.type.language')}</p>
        <span className="brain-slot__status">
          {status === 'completed' ? t('brain.ui.completed') : t('brain.ui.promptOddOneOut')}
        </span>
      </div>

      <p className="brain-slot__prompt">{t('brain.ui.promptOddOneOut')}</p>

      <div className="brain-grid brain-grid--words" role="group" aria-label="Word choices">
        {currentSet.words.map((word, index) => (
          <button
            key={word}
            type="button"
            className="brain-word"
            onClick={() => handleSelect(index)}
            disabled={disabled || status === 'completed'}
          >
            {word}
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

