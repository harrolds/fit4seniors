import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { BrainRoundResult } from '../session/types';

export type SequenceRoundData = {
  id: string;
  prompt: string;
  items: string[];
  correctOrder: string[];
};

type SequenceTemplateProps = {
  round: SequenceRoundData;
  onAnswer: (result: BrainRoundResult) => void;
};

export const SequenceTemplate: React.FC<SequenceTemplateProps> = ({ round, onAnswer }) => {
  const { t } = useI18n();
  const [selection, setSelection] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const answeredRef = useRef(false);

  const availableItems = useMemo(() => round.items, [round.items]);

  useEffect(() => {
    setSelection([]);
    setFeedback(null);
    answeredRef.current = false;
  }, [round]);

  const handleSelect = (item: string) => {
    if (answeredRef.current) return;
    if (selection.includes(item)) return;

    const next = [...selection, item];
    setSelection(next);

    if (next.length === round.correctOrder.length) {
      const isCorrect = next.every((value, index) => value === round.correctOrder[index]);
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      if (isCorrect) {
        answeredRef.current = true;
        onAnswer({ correct: true });
      } else {
        window.setTimeout(() => {
          setSelection([]);
          setFeedback(null);
        }, 800);
      }
    }
  };

  const handleUndo = () => {
    if (selection.length === 0) return;
    setSelection((prev) => prev.slice(0, -1));
    setFeedback(null);
  };

  return (
    <div className="brain-session__round" aria-live="polite">
      <p className="brain-session__prompt">{round.prompt}</p>
      <div className="brain-session__options">
        {availableItems.map((item) => (
          <button
            key={item}
            type="button"
            className={`brain-session__option ${selection.includes(item) ? 'brain-session__option--selected' : ''}`}
            onClick={() => handleSelect(item)}
            disabled={selection.includes(item) || answeredRef.current}
            style={{ minHeight: 56 }}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="brain-session__helper" aria-live="polite">
        {t('brain.session.selectedLabel')}: {selection.length > 0 ? selection.join(' → ') : '-'}
      </div>
      <div className="brain-session__controls" style={{ gap: 8 }}>
        <button type="button" className="brain-session__option" onClick={handleUndo} disabled={selection.length === 0}>
          {t('brain.session.undo')}
        </button>
      </div>
      {feedback && (
        <div className={`brain-session__feedback brain-session__feedback--${feedback}`}>
          {feedback === 'correct' ? t('brain.session.sequence.correct') : t('brain.session.sequence.incorrect')}
        </div>
      )}
    </div>
  );
};

