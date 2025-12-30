import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../shared/ui/Button';

type BrainDifficulty = 'light' | 'medium' | 'hard';

type PatternSet = {
  sequence: string[];
  options: [string, string, string];
  answerIndex: number;
  hint: string;
};

type PatternsPuzzleProps = {
  difficulty: BrainDifficulty;
  onComplete: () => void;
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

export const PatternsPuzzle: React.FC<PatternsPuzzleProps> = ({ difficulty, onComplete }) => {
  const [status, setStatus] = useState<'playing' | 'completed'>('playing');
  const [feedback, setFeedback] = useState('Choose the item that completes the pattern.');
  const [currentSet, setCurrentSet] = useState<PatternSet>(() => patternSets[difficulty][0]);
  const completionFiredRef = useRef(false);

  const puzzleSet = useMemo(() => {
    const pool = patternSets[difficulty] ?? patternSets.light;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }, [difficulty]);

  useEffect(() => {
    setStatus('playing');
    setFeedback('Choose the item that completes the pattern.');
    completionFiredRef.current = false;
    setCurrentSet(puzzleSet);
  }, [puzzleSet]);

  const handleSelect = (index: number) => {
    if (status === 'completed') return;
    if (index === currentSet.answerIndex) {
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
        <p className="brain-slot__title">Patterns</p>
        <span className="brain-slot__status">
          {status === 'completed' ? 'Completed' : 'Pattern completion'}
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

      <p className="brain-slot__hint">{currentSet.hint}</p>

      <div className="brain-grid brain-grid--answers" role="group" aria-label="Answer choices">
        {currentSet.options.map((option, index) => (
          <button
            key={option + index}
            type="button"
            className="brain-word"
            onClick={() => handleSelect(index)}
            disabled={status === 'completed'}
          >
            {option}
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

