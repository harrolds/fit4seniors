import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { BrainRoundResult } from '../session/types';
import { hashSeed, mulberry32 } from '../session/seed';

export type PairsRoundData = {
  id: string;
  pairs: { a: string; b: string }[];
};

type CardState = {
  key: string;
  label: string;
  pairId: string;
};

type PairsTemplateProps = {
  round: PairsRoundData;
  onAnswer: (result: BrainRoundResult) => void;
};

const shuffleDeterministic = <T,>(items: T[], seedSource: string): T[] => {
  const shuffled = [...items];
  const rng = mulberry32(hashSeed(seedSource));
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const PairsTemplate: React.FC<PairsTemplateProps> = ({ round, onAnswer }) => {
  const { t } = useI18n();
  const [revealedKeys, setRevealedKeys] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [mismatch, setMismatch] = useState(false);
  const answeredRef = useRef(false);

  const cards = useMemo(() => {
    const baseCards: CardState[] = round.pairs.flatMap((pair, pairIndex) => {
      const pairId = `${round.id}-pair-${pairIndex}`;
      return [
        { key: `${pairId}-a`, label: pair.a, pairId },
        { key: `${pairId}-b`, label: pair.b, pairId },
      ];
    });

    return shuffleDeterministic(baseCards, round.id);
  }, [round.id, round.pairs]);

  useEffect(() => {
    setRevealedKeys([]);
    setMatchedPairs(new Set());
    setMismatch(false);
    answeredRef.current = false;
  }, [round]);

  useEffect(() => {
    if (matchedPairs.size === round.pairs.length && !answeredRef.current) {
      answeredRef.current = true;
      onAnswer({ correct: true });
    }
  }, [matchedPairs, onAnswer, round.pairs.length]);

  const handleSelect = (card: CardState) => {
    if (answeredRef.current) return;
    if (matchedPairs.has(card.pairId)) return;
    if (revealedKeys.includes(card.key)) return;
    if (revealedKeys.length === 2) return;

    const nextRevealed = [...revealedKeys, card.key];
    setRevealedKeys(nextRevealed);
    setMismatch(false);

    if (nextRevealed.length === 2) {
      const [firstKey, secondKey] = nextRevealed;
      const firstCard = cards.find((item) => item.key === firstKey);
      const secondCard = cards.find((item) => item.key === secondKey);
      const isMatch = firstCard && secondCard && firstCard.pairId === secondCard.pairId;

      window.setTimeout(() => {
        if (isMatch && firstCard) {
          setMatchedPairs((prev) => new Set([...prev, firstCard.pairId]));
        } else {
          setMismatch(true);
        }
        setRevealedKeys([]);
      }, 500);
    }
  };

  return (
    <div className="brain-session__round" aria-live="polite">
      <p className="brain-session__prompt">{t('brain.session.pairs.prompt')}</p>
      <div className="brain-session__options pairs-grid">
        {cards.map((card) => {
          const isMatched = matchedPairs.has(card.pairId);
          const isRevealed = revealedKeys.includes(card.key) || isMatched;
          return (
            <button
              key={card.key}
              type="button"
              className={`brain-session__option pairs-card ${isMatched ? 'pairs-card--matched' : ''}`}
              onClick={() => handleSelect(card)}
              disabled={isMatched}
              style={{ minHeight: 72, fontSize: 18 }}
            >
              {isRevealed ? card.label : '❓'}
            </button>
          );
        })}
      </div>
      {mismatch && <div className="brain-session__feedback brain-session__feedback--incorrect">{t('brain.session.tryAgain')}</div>}
      {matchedPairs.size > 0 && (
        <div className="brain-session__feedback brain-session__feedback--correct">
          {t('brain.session.pairs.progress', { matched: matchedPairs.size, total: round.pairs.length })}
        </div>
      )}
    </div>
  );
};

