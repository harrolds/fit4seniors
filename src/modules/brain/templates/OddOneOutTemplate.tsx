import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { BrainRoundResult } from '../session/types';

export type OddOneOutRoundData = {
  id: string;
  prompt: string;
  options: string[];
  oddIndex: number;
  helper?: string;
};

type OddOneOutTemplateProps = {
  round: OddOneOutRoundData;
  onAnswer: (result: BrainRoundResult) => void;
};

export const OddOneOutTemplate: React.FC<OddOneOutTemplateProps> = ({ round, onAnswer }) => {
  const { t } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const timeoutRef = useRef<number>();
  const startedAtRef = useRef<number>(performance.now());

  useEffect(() => {
    setSelectedIndex(null);
    setFeedback(null);
    startedAtRef.current = performance.now();
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [round]);

  const handleSelect = (index: number) => {
    if (selectedIndex !== null) return;
    const isCorrect = index === round.oddIndex;
    setSelectedIndex(index);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    const reactionMs = Math.max(0, Math.round(performance.now() - startedAtRef.current));
    timeoutRef.current = window.setTimeout(() => {
      onAnswer({ correct: isCorrect, reactionMs });
    }, 600);
  };

  return (
    <div className="brain-session__round" aria-live="polite">
      <p className="brain-session__prompt">{round.prompt}</p>
      {round.helper && <p className="brain-session__helper">{round.helper}</p>}
      <div className="brain-session__options">
        {round.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = selectedIndex !== null && index === round.oddIndex;
          const optionClass =
            selectedIndex === null
              ? 'brain-session__option'
              : `brain-session__option ${isCorrect ? 'brain-session__option--correct' : ''} ${
                  isSelected && !isCorrect ? 'brain-session__option--incorrect' : ''
                }`.trim();

          return (
            <button
              key={`${option}-${index}`}
              type="button"
              className={optionClass}
              onClick={() => handleSelect(index)}
              disabled={selectedIndex !== null}
              aria-pressed={isSelected}
            >
              {option}
            </button>
          );
        })}
      </div>
      {feedback && (
        <div className={`brain-session__feedback brain-session__feedback--${feedback}`}>
          {feedback === 'correct' ? t('brain.session.feedback.correct') : t('brain.session.feedback.incorrect')}
        </div>
      )}
    </div>
  );
};

