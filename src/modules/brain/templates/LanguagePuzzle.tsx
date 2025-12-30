import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../shared/ui/Button';

type BrainDifficulty = 'light' | 'medium' | 'hard';

type WordSet = {
  prompt: string;
  words: [string, string, string, string];
  oddIndex: number;
};

type LanguagePuzzleProps = {
  difficulty: BrainDifficulty;
  onComplete: () => void;
};

const languageSets: Record<BrainDifficulty, WordSet[]> = {
  light: [
    { prompt: 'Pick the word that does NOT belong', words: ['apple', 'banana', 'carrot', 'pear'], oddIndex: 2 },
    { prompt: 'Pick the word that does NOT belong', words: ['red', 'blue', 'green', 'table'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['cat', 'dog', 'bird', 'chair'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['water', 'tea', 'milk', 'rock'], oddIndex: 3 },
  ],
  medium: [
    { prompt: 'Pick the word that does NOT belong', words: ['bus', 'train', 'bicycle', 'sofa'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['scarf', 'gloves', 'jacket', 'spoon'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['piano', 'violin', 'drums', 'garden'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['toast', 'cereal', 'yogurt', 'pillow'], oddIndex: 3 },
  ],
  hard: [
    { prompt: 'Pick the word that does NOT belong', words: ['tiny', 'minute', 'huge', 'little'], oddIndex: 2 },
    { prompt: 'Pick the word that does NOT belong', words: ['ponder', 'consider', 'imagine', 'sprint'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['novel', 'poem', 'essay', 'banana'], oddIndex: 3 },
    { prompt: 'Pick the word that does NOT belong', words: ['rapid', 'swift', 'slow', 'brisk'], oddIndex: 2 },
  ],
};

export const LanguagePuzzle: React.FC<LanguagePuzzleProps> = ({ difficulty, onComplete }) => {
  const [status, setStatus] = useState<'playing' | 'completed'>('playing');
  const [feedback, setFeedback] = useState('Tap the word that does not fit.');
  const [currentSet, setCurrentSet] = useState<WordSet>(() => languageSets[difficulty][0]);
  const completionFiredRef = useRef(false);

  const puzzleSet = useMemo(() => {
    const pool = languageSets[difficulty] ?? languageSets.light;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }, [difficulty]);

  useEffect(() => {
    setStatus('playing');
    setFeedback('Tap the word that does not fit.');
    completionFiredRef.current = false;
    setCurrentSet(puzzleSet);
  }, [puzzleSet]);

  const handleSelect = (index: number) => {
    if (status === 'completed') return;
    if (index === currentSet.oddIndex) {
      setStatus('completed');
      setFeedback('Completed! Tap Finish to continue.');
    } else {
      setFeedback('Not quite, try again.');
    }
  };

  const handleFinish = () => {
    if (completionFiredRef.current || status !== 'completed') return;
    completionFiredRef.current = true;
    onComplete();
  };

  return (
    <div className="brain-slot">
      <div className="brain-slot__header">
        <p className="brain-slot__title">Language</p>
        <span className="brain-slot__status">
          {status === 'completed' ? 'Completed' : 'Odd one out'}
        </span>
      </div>

      <p className="brain-slot__prompt">{currentSet.prompt}</p>

      <div className="brain-grid brain-grid--words" role="group" aria-label="Word choices">
        {currentSet.words.map((word, index) => (
          <button
            key={word}
            type="button"
            className="brain-word"
            onClick={() => handleSelect(index)}
            disabled={status === 'completed'}
          >
            {word}
          </button>
        ))}
      </div>

      <p className="brain-slot__hint">{feedback}</p>

      {status === 'completed' ? (
        <div className="brain-actions">
          <Button fullWidth onClick={handleFinish}>
            Finish
          </Button>
        </div>
      ) : null}
    </div>
  );
};

