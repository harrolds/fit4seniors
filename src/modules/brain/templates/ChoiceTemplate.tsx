import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { BrainRoundResult } from '../session/types';

export type ChoiceRoundData = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  helper?: string;
};

type ChoiceTemplateProps = {
  round: ChoiceRoundData;
  onAnswer: (result: BrainRoundResult) => void;
};

export const ChoiceTemplate: React.FC<ChoiceTemplateProps> = ({ round, onAnswer }) => {
  const { t } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const startedAtRef = useRef<number>(performance.now());
  const answeredRef = useRef(false);

  useEffect(() => {
    setSelectedIndex(null);
    setFeedback(null);
    startedAtRef.current = performance.now();
    answeredRef.current = false;
  }, [round]);

  const handleSelect = (event: React.PointerEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    event.stopPropagation();
    if ('pointerId' in event) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (answeredRef.current) return;
    answeredRef.current = true;
    const isCorrect = index === round.correctIndex;
    setSelectedIndex(index);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    const reactionMs = Math.max(0, Math.round(performance.now() - startedAtRef.current));
    onAnswer({ correct: isCorrect, reactionMs });
  };

  return (
    <div className="brain-session__round" aria-live="polite">
      <p className="brain-session__prompt">{round.prompt}</p>
      {round.helper && <p className="brain-session__helper">{round.helper}</p>}
      <div className="brain-session__options">
        {round.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = selectedIndex !== null && index === round.correctIndex;
          const optionClass =
            selectedIndex === null
              ? 'brain-session__option'
              : `brain-session__option ${isCorrect ? 'brain-session__option--correct' : ''} ${
                  isSelected && !isCorrect ? 'brain-session__option--incorrect' : ''
                }`.trim();

          return (
            <button
              key={`${round.id}::opt::${index}`}
              type="button"
              className={optionClass}
              onPointerDown={(event) => handleSelect(event, index)}
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

