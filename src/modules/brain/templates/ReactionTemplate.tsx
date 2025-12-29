import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { BrainRoundResult } from '../session/types';

export type ReactionRoundData = {
  id: string;
  instructionKey: string;
  stimuli: { label: string; isTarget: boolean }[];
  paceMs: number;
};

type ReactionTemplateProps = {
  round: ReactionRoundData;
  onAnswer: (result: BrainRoundResult) => void;
};

export const ReactionTemplate: React.FC<ReactionTemplateProps> = ({ round, onAnswer }) => {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [falseHitCount, setFalseHitCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const hitCountRef = useRef(0);
  const falseHitCountRef = useRef(0);
  const answeredRef = useRef(false);
  const currentIdxRef = useRef(0);
  const startMsRef = useRef<number | null>(null);
  const firstHitMsRef = useRef<number | null>(null);

  const targetTotal = useMemo(() => round.stimuli.filter((item) => item.isTarget).length, [round.stimuli]);
  const currentStimulus = round.stimuli[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setHitCount(0);
    setFalseHitCount(0);
    setFinished(false);
    hitCountRef.current = 0;
    falseHitCountRef.current = 0;
    answeredRef.current = false;
    currentIdxRef.current = 0;
    startMsRef.current = null;
    firstHitMsRef.current = null;
  }, [round]);

  useEffect(() => {
    currentIdxRef.current = currentIndex;
    if (startMsRef.current === null && round.stimuli.length > 0) {
      startMsRef.current = performance.now();
    }
  }, [currentIndex, round.stimuli.length]);

  useEffect(() => {
    if (finished || round.stimuli.length === 0) return undefined;
    const timer = window.setTimeout(() => {
      if (currentIdxRef.current >= round.stimuli.length - 1) {
        setFinished(true);
        return;
      }
      setCurrentIndex((prev) => prev + 1);
    }, round.paceMs);

    return () => window.clearTimeout(timer);
  }, [finished, round.paceMs, round.stimuli.length, currentIndex]);

  useEffect(() => {
    if (round.stimuli.length === 0 && !answeredRef.current) {
      answeredRef.current = true;
      onAnswer({ correct: false });
    }
  }, [onAnswer, round.stimuli.length]);

  useEffect(() => {
    if (!finished || answeredRef.current) return;
    answeredRef.current = true;
    const hasHit = hitCountRef.current > 0;
    const correct = hasHit && falseHitCountRef.current === 0;
    const reactionMs =
      hasHit && startMsRef.current !== null && firstHitMsRef.current !== null
        ? Math.max(0, Math.round(firstHitMsRef.current - startMsRef.current))
        : undefined;
    onAnswer({ correct, reactionMs });
  }, [finished, onAnswer]);

  const handleTap = () => {
    if (finished) return;
    const stimulus = round.stimuli[currentIdxRef.current];
    if (!stimulus) return;

    if (stimulus.isTarget) {
      if (hitCountRef.current === 0 && firstHitMsRef.current === null && startMsRef.current !== null) {
        firstHitMsRef.current = performance.now();
      }
      hitCountRef.current += 1;
      setHitCount(hitCountRef.current);
    } else {
      falseHitCountRef.current += 1;
      setFalseHitCount(falseHitCountRef.current);
    }
  };

  return (
    <div className="brain-session__round" aria-live="polite">
      <p className="brain-session__prompt">{t(round.instructionKey)}</p>
      <div className="brain-session__helper">{t('brain.session.reaction.hint')}</div>
      <div
        className="brain-session__option brain-session__option--neutral"
        style={{ minHeight: 96, fontSize: 32, justifyContent: 'center' }}
      >
        {currentStimulus ? currentStimulus.label : '—'}
      </div>
      <div className="brain-session__controls" style={{ gap: 12 }}>
        <button type="button" className="brain-session__option" onClick={handleTap} disabled={finished} style={{ fontSize: 18 }}>
          {t('brain.session.tapNow')}
        </button>
      </div>
      <div className="brain-session__helper">
        {t('brain.session.matched')}: {hitCount}/{targetTotal} • {t('brain.session.missed')}: {falseHitCount}
      </div>
    </div>
  );
};

