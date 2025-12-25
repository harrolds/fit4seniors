export type BrainRoundResult = {
  correct: boolean;
  reactionMs?: number;
};

export type BrainSessionSummary = {
  rounds: number;
  correct: number;
  durationSec: number;
};

