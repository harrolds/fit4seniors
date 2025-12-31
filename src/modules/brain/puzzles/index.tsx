import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import { useI18n } from '../../../shared/lib/i18n';
import type {
  BrainDifficulty,
  BrainMetrics,
  LanguageCategoryPickDataset,
  LanguageOddWordDataset,
  MemoryGridDataset,
  MemoryPairsDataset,
  PatternToken,
  PatternsMatrixDataset,
  PatternsSequenceDataset,
} from '../types';

type BasePuzzleProps<TDataset> = {
  dataset: TDataset;
  mode: 'preview' | 'active';
  difficulty: BrainDifficulty;
  onComplete?: (metrics?: Partial<BrainMetrics>) => void;
};

const getLocaleLabel = (locale: string, label_de: string, label_en: string): string =>
  locale === 'de' ? label_de : label_en;

// ---- Memory grid ----

type MemoryPhase = 'preview' | 'show' | 'recall' | 'done';
const gridSequenceLength: Record<BrainDifficulty, number> = { light: 3, medium: 4, hard: 5 };

export const MemoryGridPuzzle: React.FC<BasePuzzleProps<MemoryGridDataset>> = ({
  dataset,
  mode,
  difficulty,
  onComplete,
}) => {
  const { t, locale } = useI18n();
  const [phase, setPhase] = useState<MemoryPhase>('preview');
  const [gridItems, setGridItems] = useState(dataset.items.slice(0, 9));
  const [sequence, setSequence] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [inputIndex, setInputIndex] = useState(0);
  const [feedback, setFeedback] = useState<string>(dataset.titleHint_en ?? '');
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const timersRef = useRef<number[]>([]);
  const completedRef = useRef(false);

  const sequenceLength = gridSequenceLength[difficulty] ?? 3;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const pickGridItems = useCallback(() => {
    const pool = [...dataset.items];
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 9);
  }, [dataset.items]);

  const pickSequence = useCallback(
    (length: number) => {
      const indices = Array.from({ length: 9 }, (_, index) => index);
      for (let i = indices.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return indices.slice(0, length);
    },
    [],
  );

  const playSequence = useCallback(
    (seq: number[]) => {
      clearTimers();
      setPhase('show');
      setActiveIndex(null);
      setInputIndex(0);
      setFeedback(t('brain.memory.watch'));

      let delay = 250;
      seq.forEach((cell, idx) => {
        timersRef.current.push(
          window.setTimeout(() => {
            setActiveIndex(cell);
          }, delay),
        );
        delay += 750;
        timersRef.current.push(
          window.setTimeout(() => {
            setActiveIndex(null);
            if (idx === seq.length - 1) {
              setPhase('recall');
              setFeedback(t('brain.memory.repeat'));
            }
          }, delay),
        );
        delay += 220;
      });
    },
    [clearTimers, t],
  );

  const startRound = useCallback(() => {
    const items = pickGridItems();
    const seq = pickSequence(sequenceLength);
    completedRef.current = false;
    setGridItems(items);
    setSequence(seq);
    setAttempts(0);
    setErrors(0);
    playSequence(seq);
  }, [pickGridItems, pickSequence, sequenceLength, playSequence]);

  useEffect(() => {
    if (mode === 'active') {
      startRound();
    } else {
      clearTimers();
      setGridItems(dataset.items.slice(0, 9));
      setSequence([]);
      setPhase('preview');
      setFeedback(t('brain.ui.tapStart'));
    }
    return () => clearTimers();
  }, [mode, dataset.items, startRound, clearTimers, t]);

  const finish = useCallback(() => {
    if (completedRef.current || mode === 'preview') return;
    completedRef.current = true;
    setPhase('done');
    setFeedback(t('brain.ui.completed'));
    window.setTimeout(() => {
      onComplete?.({ attempts, errors });
    }, 350);
  }, [attempts, errors, mode, onComplete, t]);

  const handleCellClick = (index: number) => {
    if (mode === 'preview' || phase !== 'recall' || completedRef.current) return;
    const expected = sequence[inputIndex];
    if (expected === undefined) return;

    setAttempts((prev) => prev + 1);

    if (index === expected) {
      const nextIndex = inputIndex + 1;
      if (nextIndex >= sequence.length) {
        finish();
      } else {
        setInputIndex(nextIndex);
        setFeedback(t('brain.memory.repeat'));
      }
    } else {
      setErrors((prev) => prev + 1);
      setFeedback(t('brain.ui.tryAgain'));
      setInputIndex(0);
      playSequence(sequence);
    }
  };

  return (
    <div className="brain-slot">
      <div className="brain-slot__header">
        <p className="brain-slot__title">
          {locale === 'de' ? 'Positionen merken' : 'Remember positions'}
        </p>
        <span className="brain-slot__status">
          {phase === 'done' ? t('brain.ui.completed') : phase === 'show' ? t('brain.memory.watch') : t('brain.memory.repeat')}
        </span>
      </div>

      <div className="brain-grid brain-grid--memory" aria-label="Memory grid">
        {gridItems.map((item, idx) => {
          const isActive = activeIndex === idx && phase === 'show';
          const showDot = phase === 'recall' || phase === 'preview';
          const label = getLocaleLabel(locale, item.label_de, item.label_en);
          return (
            <button
              key={item.id + idx}
              type="button"
              className={`brain-grid__cell${isActive ? ' brain-grid__cell--active' : ''}`}
              onClick={() => handleCellClick(idx)}
              disabled={phase === 'show' || phase === 'done' || mode === 'preview'}
            >
              {isActive ? label : showDot ? '•' : label}
            </button>
          );
        })}
      </div>

      <p className="brain-slot__hint">
        {locale === 'de' ? dataset.titleHint_de ?? feedback : dataset.titleHint_en ?? feedback}
      </p>

      {phase === 'done' && mode === 'active' ? (
        <div className="brain-actions">
          <Button fullWidth onClick={finish}>
            {t('brain.ui.finish')}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

// ---- Memory pairs ----
const pairCountByDifficulty: Record<BrainDifficulty, number> = { light: 6, medium: 8, hard: 10 };

type MemoryCard = {
  id: string;
  pairId: string;
  label: string;
  isMatched: boolean;
  isRevealed: boolean;
};

export const MemoryPairsPuzzle: React.FC<BasePuzzleProps<MemoryPairsDataset>> = ({
  dataset,
  mode,
  difficulty,
  onComplete,
}) => {
  const { t, locale } = useI18n();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selection, setSelection] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const completedRef = useRef(false);
  const pairTarget = pairCountByDifficulty[difficulty] ?? pairCountByDifficulty.light;

  const buildDeck = useCallback(() => {
    const pool = [...dataset.pairs];
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const chosen = pool.slice(0, pairTarget);
    const deck: MemoryCard[] = chosen
      .flatMap((pair) => [
        {
          id: `${pair.id}-a`,
          pairId: pair.id,
          label: getLocaleLabel(locale, pair.label_de, pair.label_en),
          isMatched: false,
          isRevealed: false,
        },
        {
          id: `${pair.id}-b`,
          pairId: pair.id,
          label: getLocaleLabel(locale, pair.label_de, pair.label_en),
          isMatched: false,
          isRevealed: false,
        },
      ])
      .sort(() => Math.random() - 0.5);
    return deck;
  }, [dataset.pairs, locale, pairTarget]);

  useEffect(() => {
    setCards(buildDeck());
    setSelection([]);
    setAttempts(0);
    setErrors(0);
    completedRef.current = false;
  }, [buildDeck, mode]);

  const triggerComplete = useCallback(() => {
    if (completedRef.current || mode === 'preview') return;
    completedRef.current = true;
    onComplete?.({ attempts, errors });
  }, [attempts, errors, mode, onComplete]);

  const handleCardClick = (index: number) => {
    if (mode === 'preview' || isLocked || completedRef.current) return;
    const card = cards[index];
    if (!card || card.isMatched || card.isRevealed) return;

    const nextCards = [...cards];
    nextCards[index] = { ...card, isRevealed: true };
    const nextSelection = [...selection, index];
    setCards(nextCards);
    setSelection(nextSelection);

    if (nextSelection.length === 2) {
      setAttempts((prev) => prev + 1);
      const [firstIdx, secondIdx] = nextSelection;
      const first = nextCards[firstIdx];
      const second = nextCards[secondIdx];
      if (first && second && first.pairId === second.pairId) {
        const updated = nextCards.map((c, idx) =>
          idx === firstIdx || idx === secondIdx ? { ...c, isMatched: true } : c,
        );
        setCards(updated);
        setSelection([]);
        const allMatched = updated.every((c) => c.isMatched);
        if (allMatched) {
          window.setTimeout(() => triggerComplete(), 300);
        }
      } else {
        setErrors((prev) => prev + 1);
        setIsLocked(true);
        window.setTimeout(() => {
          setIsLocked(false);
          setSelection([]);
          setCards((current) =>
            current.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, isRevealed: false } : c,
            ),
          );
        }, 700);
      }
    }
  };

  const columns = useMemo(() => {
    if (pairTarget >= 10) return 5;
    if (pairTarget >= 8) return 4;
    return 4;
  }, [pairTarget]);

  return (
    <div className="brain-slot">
      <div className="brain-slot__header">
        <p className="brain-slot__title">{locale === 'de' ? 'Paare finden' : 'Match pairs'}</p>
        <span className="brain-slot__status">
          {completedRef.current ? t('brain.ui.completed') : locale === 'de' ? 'Decke zwei Karten auf' : 'Flip two cards'}
        </span>
      </div>

      <div
        className="brain-card-grid"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        aria-label="Memory pairs grid"
      >
        {cards.map((card, idx) => {
          const isFaceUp = card.isMatched || card.isRevealed || mode === 'preview';
          return (
            <button
              key={card.id}
              type="button"
              className={`brain-card${card.isMatched ? ' brain-card--matched' : ''}`}
              onClick={() => handleCardClick(idx)}
              disabled={mode === 'preview' || isLocked || card.isMatched}
            >
              <div className="brain-card__face brain-card__front">{isFaceUp ? card.label : '•'}</div>
            </button>
          );
        })}
      </div>

      <p className="brain-slot__hint">
        {completedRef.current
          ? t('brain.ui.completed')
          : locale === 'de'
            ? 'Decke je zwei Karten auf und merke dir die Paare.'
            : 'Flip two cards at a time and remember the pairs.'}
      </p>
    </div>
  );
};

// ---- Language puzzles ----
const chooseRandom = <T,>(items: T[]): T | null => {
  if (!items.length) return null;
  const index = Math.floor(Math.random() * items.length);
  return items[index];
};

export const LanguageOddWordPuzzle: React.FC<BasePuzzleProps<LanguageOddWordDataset>> = ({
  dataset,
  mode,
  difficulty: _difficulty,
  onComplete,
}) => {
  const { t, locale } = useI18n();
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const [feedback, setFeedback] = useState(t('brain.ui.promptOddOneOut'));
  const [setIndex, setSetIndex] = useState(0);
  const completedRef = useRef(false);

  const currentSet = useMemo(() => dataset.sets[setIndex] ?? dataset.sets[0], [dataset.sets, setIndex]);

  useEffect(() => {
    const next = chooseRandom(dataset.sets);
    const index = next ? dataset.sets.indexOf(next) : 0;
    setSetIndex(Math.max(index, 0));
    setAttempts(0);
    setErrors(0);
    setFeedback(t('brain.ui.promptOddOneOut'));
    completedRef.current = false;
  }, [dataset.sets, mode, t]);

  const finish = useCallback(() => {
    if (completedRef.current || mode === 'preview') return;
    completedRef.current = true;
    onComplete?.({ attempts, errors });
  }, [attempts, errors, mode, onComplete]);

  const handleSelect = (index: number) => {
    if (completedRef.current || mode === 'preview') return;
    setAttempts((prev) => prev + 1);
    if (index === currentSet?.answerIndex) {
      setFeedback(t('brain.ui.completed'));
      window.setTimeout(() => finish(), 200);
    } else {
      setErrors((prev) => prev + 1);
      setFeedback(t('brain.ui.tryAgain'));
    }
  };

  const prompt = locale === 'de' ? 'Welches Wort passt nicht?' : 'Which word does not belong?';
  const categoryLabel =
    locale === 'de' ? currentSet?.category_de ?? 'Kategorie' : currentSet?.category_en ?? 'Category';

  return (
    <div className="brain-slot">
      <div className="brain-slot__header">
        <p className="brain-slot__title">{locale === 'de' ? 'Unpassendes Wort' : 'Odd one out'}</p>
        <span className="brain-slot__status">
          {completedRef.current ? t('brain.ui.completed') : t('brain.ui.promptOddOneOut')}
        </span>
      </div>

      <p className="brain-slot__prompt">
        {prompt} ({categoryLabel})
      </p>

      <div className="brain-grid brain-grid--words" role="group" aria-label="Odd word choices">
        {currentSet?.options.map((option, idx) => (
          <button
            key={`${option}-${idx}`}
            type="button"
            className="brain-word"
            onClick={() => handleSelect(idx)}
            disabled={completedRef.current || mode === 'preview'}
          >
            {option}
          </button>
        ))}
      </div>

      <p className="brain-slot__hint">{feedback}</p>
    </div>
  );
};

export const LanguageCategoryPickPuzzle: React.FC<BasePuzzleProps<LanguageCategoryPickDataset>> = ({
  dataset,
  mode,
  difficulty: _difficulty,
  onComplete,
}) => {
  const { t, locale } = useI18n();
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const [feedback, setFeedback] = useState(locale === 'de' ? 'Wähle das passende Wort.' : 'Pick the fitting word.');
  const [setIndex, setSetIndex] = useState(0);
  const completedRef = useRef(false);

  const currentSet = useMemo(() => dataset.sets[setIndex] ?? dataset.sets[0], [dataset.sets, setIndex]);

  useEffect(() => {
    const next = chooseRandom(dataset.sets);
    const index = next ? dataset.sets.indexOf(next) : 0;
    setSetIndex(Math.max(index, 0));
    setAttempts(0);
    setErrors(0);
    setFeedback(locale === 'de' ? 'Wähle das passende Wort.' : 'Pick the fitting word.');
    completedRef.current = false;
  }, [dataset.sets, mode, locale]);

  const finish = useCallback(() => {
    if (completedRef.current || mode === 'preview') return;
    completedRef.current = true;
    onComplete?.({ attempts, errors });
  }, [attempts, errors, mode, onComplete]);

  const handleSelect = (index: number) => {
    if (completedRef.current || mode === 'preview') return;
    setAttempts((prev) => prev + 1);
    if (index === currentSet?.answerIndex) {
      setFeedback(t('brain.ui.completed'));
      window.setTimeout(() => finish(), 200);
    } else {
      setErrors((prev) => prev + 1);
      setFeedback(t('brain.ui.tryAgain'));
    }
  };

  const prompt = locale === 'de' ? currentSet?.prompt_de : currentSet?.prompt_en;

  return (
    <div className="brain-slot">
      <div className="brain-slot__header">
        <p className="brain-slot__title">{locale === 'de' ? 'Kategorie wählen' : 'Pick the category word'}</p>
        <span className="brain-slot__status">
          {completedRef.current ? t('brain.ui.completed') : locale === 'de' ? 'Eine Antwort wählen' : 'Choose an answer'}
        </span>
      </div>

      <p className="brain-slot__prompt">{prompt}</p>

      <div className="brain-grid brain-grid--words" role="group" aria-label="Category options">
        {currentSet?.options.map((option, idx) => (
          <button
            key={`${option}-${idx}`}
            type="button"
            className="brain-word"
            onClick={() => handleSelect(idx)}
            disabled={completedRef.current || mode === 'preview'}
          >
            {option}
          </button>
        ))}
      </div>

      <p className="brain-slot__hint">{feedback}</p>
    </div>
  );
};

// ---- Pattern helpers ----
const TokenGlyph: React.FC<{ token: string; legend: Record<string, PatternToken>; isMissing?: boolean }> = ({
  token,
  legend,
  isMissing = false,
}) => {
  if (token === '?') {
    return <span className="brain-token brain-token--missing">?</span>;
  }
  const entry = legend[token];
  if (!entry) return <span className="brain-token brain-token--missing">{token}</span>;
  return (
    <span
      className={`brain-token${isMissing ? ' brain-token--missing' : ''}`}
      style={{ color: entry.color, borderColor: entry.color }}
      aria-label={entry.label_en}
    >
      {entry.glyph}
    </span>
  );
};

// ---- Pattern sequence ----
export const PatternsSequencePuzzle: React.FC<BasePuzzleProps<PatternsSequenceDataset>> = ({
  dataset,
  mode,
  difficulty: _difficulty,
  onComplete,
}) => {
  const { t } = useI18n();
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [feedback, setFeedback] = useState(t('brain.ui.promptPattern'));
  const completedRef = useRef(false);

  const currentSet = useMemo(() => dataset.sets[setIndex] ?? dataset.sets[0], [dataset.sets, setIndex]);

  useEffect(() => {
    const next = chooseRandom(dataset.sets);
    const index = next ? dataset.sets.indexOf(next) : 0;
    setSetIndex(Math.max(index, 0));
    setAttempts(0);
    setErrors(0);
    setFeedback(t('brain.ui.promptPattern'));
    completedRef.current = false;
  }, [dataset.sets, mode, t]);

  const finish = useCallback(() => {
    if (completedRef.current || mode === 'preview') return;
    completedRef.current = true;
    onComplete?.({ attempts, errors });
  }, [attempts, errors, mode, onComplete]);

  const handleSelect = (index: number) => {
    if (completedRef.current || mode === 'preview') return;
    setAttempts((prev) => prev + 1);
    if (index === currentSet?.answerIndex) {
      setFeedback(t('brain.ui.completed'));
      window.setTimeout(() => finish(), 200);
    } else {
      setErrors((prev) => prev + 1);
      setFeedback(t('brain.ui.tryAgain'));
    }
  };

  return (
    <div className="brain-slot">
      <div className="brain-slot__header">
        <p className="brain-slot__title">Muster-Folge</p>
        <span className="brain-slot__status">
          {completedRef.current ? t('brain.ui.completed') : t('brain.ui.promptPattern')}
        </span>
      </div>

      <div className="brain-pattern" aria-label="Pattern sequence">
        {currentSet?.sequence.map((token, idx) => (
          <TokenGlyph
            key={`${token}-${idx}`}
            token={token}
            legend={dataset.legend}
            isMissing={token === '?'}
          />
        ))}
      </div>

      <p className="brain-slot__hint">{feedback}</p>

      <div className="brain-grid brain-grid--answers" role="group" aria-label="Pattern answers">
        {currentSet?.options.map((token, idx) => (
          <button
            key={`${token}-${idx}`}
            type="button"
            className="brain-word brain-token-option"
            onClick={() => handleSelect(idx)}
            disabled={completedRef.current || mode === 'preview'}
          >
            <TokenGlyph token={token} legend={dataset.legend} />
          </button>
        ))}
      </div>
    </div>
  );
};

// ---- Pattern matrix ----
export const PatternsMatrixPuzzle: React.FC<BasePuzzleProps<PatternsMatrixDataset>> = ({
  dataset,
  mode,
  difficulty: _difficulty,
  onComplete,
}) => {
  const { t } = useI18n();
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [feedback, setFeedback] = useState(t('brain.ui.promptPattern'));
  const completedRef = useRef(false);

  const currentSet = useMemo(() => dataset.sets[setIndex] ?? dataset.sets[0], [dataset.sets, setIndex]);

  useEffect(() => {
    const next = chooseRandom(dataset.sets);
    const index = next ? dataset.sets.indexOf(next) : 0;
    setSetIndex(Math.max(index, 0));
    setAttempts(0);
    setErrors(0);
    setFeedback(t('brain.ui.promptPattern'));
    completedRef.current = false;
  }, [dataset.sets, mode, t]);

  const finish = useCallback(() => {
    if (completedRef.current || mode === 'preview') return;
    completedRef.current = true;
    onComplete?.({ attempts, errors });
  }, [attempts, errors, mode, onComplete]);

  const handleSelect = (index: number) => {
    if (completedRef.current || mode === 'preview') return;
    setAttempts((prev) => prev + 1);
    if (index === currentSet?.answerIndex) {
      setFeedback(t('brain.ui.completed'));
      window.setTimeout(() => finish(), 200);
    } else {
      setErrors((prev) => prev + 1);
      setFeedback(t('brain.ui.tryAgain'));
    }
  };

  return (
    <div className="brain-slot">
      <div className="brain-slot__header">
        <p className="brain-slot__title">Muster-Gitter</p>
        <span className="brain-slot__status">
          {completedRef.current ? t('brain.ui.completed') : t('brain.ui.promptPattern')}
        </span>
      </div>

      <div className="brain-matrix" aria-label="Pattern matrix">
        {currentSet?.grid.flatMap((row, rowIdx) =>
          row.map((token, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`brain-matrix__cell${token === null ? ' brain-matrix__cell--missing' : ''}`}
            >
              {token ? <TokenGlyph token={token} legend={dataset.legend} /> : '?'}
            </div>
          )),
        )}
      </div>

      <p className="brain-slot__hint">{feedback}</p>

      <div className="brain-grid brain-grid--answers" role="group" aria-label="Matrix answers">
        {currentSet?.options.map((token, idx) => (
          <button
            key={`${token}-${idx}`}
            type="button"
            className="brain-word brain-token-option"
            onClick={() => handleSelect(idx)}
            disabled={completedRef.current || mode === 'preview'}
          >
            <TokenGlyph token={token} legend={dataset.legend} />
          </button>
        ))}
      </div>
    </div>
  );
};

