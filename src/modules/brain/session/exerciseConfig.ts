import { ChoiceRoundData } from '../templates/ChoiceTemplate';
import { OddOneOutRoundData } from '../templates/OddOneOutTemplate';
import { PairsRoundData } from '../templates/PairsTemplate';
import { SequenceRoundData } from '../templates/SequenceTemplate';
import { ReactionRoundData } from '../templates/ReactionTemplate';
import { assertGlobalUniqueIds, assertUniqueIds, assertUniqueText } from '../content/guards';
import { ChoiceRound, OddOneOutRound, PairsRound, ReactionRound, SequenceRound } from '../content/types';
import { BANK_ID as MEMORY_CHOICE_BANK_ID, items as memoryChoiceTextItems } from '../content/banks/memory.choiceText.bank';
import { BANK_ID as ATTENTION_CHOICE_BANK_ID, items as attentionChoiceTextItems } from '../content/banks/attention.choiceText.bank';
import { BANK_ID as ATTENTION_ODD_BANK_ID, items as attentionOddOneOutItems } from '../content/banks/attention.oddOneOut.bank';
import { BANK_ID as LOGIC_CHOICE_BANK_ID, items as logicChoiceTextItems } from '../content/banks/logic.choiceText.bank';
import { BANK_ID as LOGIC_ODD_BANK_ID, items as logicOddOneOutItems } from '../content/banks/logic.oddOneOut.bank';
import { BANK_ID as FLEX_CHOICE_BANK_ID, items as flexibilityChoiceTextItems } from '../content/banks/flexibility.choiceText.bank';
import { BANK_ID as FLEX_SEQUENCE_BANK_ID, items as flexibilitySequenceItems } from '../content/banks/flexibility.sequence.bank';
import { BANK_ID as REACTION_BANK_ID, items as reactionItems } from '../content/banks/reaction.reaction.bank';
import { BANK_ID as MEMORY_PAIRS_BANK_ID, items as memoryPairsItems } from '../content/banks/memory.pairs.bank';
import { BANK_ID as LOGIC_SEQUENCE_BANK_ID, items as logicSequenceItems } from '../content/banks/logic.sequence.bank';

type BaseExerciseConfig<TemplateId, PoolItem> = {
  roundsTotal: number;
  template: TemplateId;
  pool: PoolItem[];
  seedKey?: string;
};

type ChoiceExerciseConfig = BaseExerciseConfig<'choice', ChoiceRoundData>;
type OddOneOutExerciseConfig = BaseExerciseConfig<'odd_one_out', OddOneOutRoundData>;
type PairsExerciseConfig = BaseExerciseConfig<'pairs', PairsRoundData>;
type SequenceExerciseConfig = BaseExerciseConfig<'sequence', SequenceRoundData>;
type ReactionExerciseConfig = BaseExerciseConfig<'reaction', ReactionRoundData>;

export type ExerciseRuntimeConfig =
  | ChoiceExerciseConfig
  | OddOneOutExerciseConfig
  | PairsExerciseConfig
  | SequenceExerciseConfig
  | ReactionExerciseConfig;

type Selection = { bankId: string; take: number; offset?: number; ids?: string[] };

type ExerciseDefinition = {
  roundsTotal: number;
  template: ExerciseRuntimeConfig['template'];
  selection: Selection;
  seedKey?: string;
};

type BankItem = ChoiceRound | OddOneOutRound | PairsRound | SequenceRound | ReactionRound;

const ENFORCE_GLOBAL_UNIQUE_IDS = true;

const BANK_REGISTRY: Record<string, BankItem[]> = {
  [MEMORY_CHOICE_BANK_ID]: memoryChoiceTextItems,
  [ATTENTION_CHOICE_BANK_ID]: attentionChoiceTextItems,
  [ATTENTION_ODD_BANK_ID]: attentionOddOneOutItems,
  [LOGIC_CHOICE_BANK_ID]: logicChoiceTextItems,
  [LOGIC_ODD_BANK_ID]: logicOddOneOutItems,
  [FLEX_CHOICE_BANK_ID]: flexibilityChoiceTextItems,
  [FLEX_SEQUENCE_BANK_ID]: flexibilitySequenceItems,
  [REACTION_BANK_ID]: reactionItems,
  [MEMORY_PAIRS_BANK_ID]: memoryPairsItems,
  [LOGIC_SEQUENCE_BANK_ID]: logicSequenceItems,
};

const EXERCISE_DEFINITIONS: Record<string, ExerciseDefinition> = {
  memory_story_gaps: {
    roundsTotal: 8,
    template: 'choice',
    selection: { bankId: MEMORY_CHOICE_BANK_ID, take: 8, ids: Array.from({ length: 8 }, (_, index) => `${MEMORY_CHOICE_BANK_ID}::q${String(index + 1).padStart(2, '0')}`) },
  },
  memory_objects: {
    roundsTotal: 8,
    template: 'choice',
    selection: {
      bankId: MEMORY_CHOICE_BANK_ID,
      take: 8,
      ids: Array.from({ length: 8 }, (_, index) => `${MEMORY_CHOICE_BANK_ID}::q${String(index + 9).padStart(2, '0')}`),
    },
  },
  attention_odd_one_out: {
    roundsTotal: 8,
    template: 'odd_one_out',
    selection: { bankId: ATTENTION_ODD_BANK_ID, take: 8, ids: Array.from({ length: 8 }, (_, index) => `${ATTENTION_ODD_BANK_ID}::q${String(index + 1).padStart(2, '0')}`) },
  },
  attention_color_word: {
    roundsTotal: 8,
    template: 'choice',
    selection: { bankId: ATTENTION_CHOICE_BANK_ID, take: 8, ids: Array.from({ length: 8 }, (_, index) => `${ATTENTION_CHOICE_BANK_ID}::q${String(index + 1).padStart(2, '0')}`) },
  },
  logic_next_in_series: {
    roundsTotal: 8,
    template: 'choice',
    selection: { bankId: LOGIC_CHOICE_BANK_ID, take: 8, ids: Array.from({ length: 8 }, (_, index) => `${LOGIC_CHOICE_BANK_ID}::q${String(index + 1).padStart(2, '0')}`) },
  },
  logic_grouping: {
    roundsTotal: 8,
    template: 'odd_one_out',
    selection: { bankId: LOGIC_ODD_BANK_ID, take: 8, ids: Array.from({ length: 8 }, (_, index) => `${LOGIC_ODD_BANK_ID}::q${String(index + 1).padStart(2, '0')}`) },
  },
  flex_reverse: {
    roundsTotal: 8,
    template: 'choice',
    selection: { bankId: FLEX_CHOICE_BANK_ID, take: 8, ids: Array.from({ length: 8 }, (_, index) => `${FLEX_CHOICE_BANK_ID}::q${String(index + 1).padStart(2, '0')}`) },
  },
  flex_switch_rules: {
    roundsTotal: 8,
    template: 'choice',
    selection: { bankId: FLEX_CHOICE_BANK_ID, take: 8, ids: Array.from({ length: 8 }, (_, index) => `${FLEX_CHOICE_BANK_ID}::q${String(index + 9).padStart(2, '0')}`) },
  },
  memory_pairs_smoke: {
    roundsTotal: 3,
    template: 'pairs',
    selection: { bankId: MEMORY_PAIRS_BANK_ID, take: 3, ids: Array.from({ length: 3 }, (_, index) => `${MEMORY_PAIRS_BANK_ID}::q${String(index + 1).padStart(2, '0')}`) },
  },
  logic_sequence_smoke: {
    roundsTotal: 3,
    template: 'sequence',
    selection: { bankId: LOGIC_SEQUENCE_BANK_ID, take: 3, ids: Array.from({ length: 3 }, (_, index) => `${LOGIC_SEQUENCE_BANK_ID}::q${String(index + 1).padStart(2, '0')}`) },
  },
  reaction_tap_smoke: {
    roundsTotal: 3,
    template: 'reaction',
    selection: { bankId: REACTION_BANK_ID, take: 3, ids: Array.from({ length: 3 }, (_, index) => `${REACTION_BANK_ID}::q${String(index + 1).padStart(2, '0')}`) },
  },
  memory_word_bridge: {
    roundsTotal: 8,
    template: 'choice',
    selection: { bankId: MEMORY_CHOICE_BANK_ID, take: 12, ids: Array.from({ length: 12 }, (_, index) => `${MEMORY_CHOICE_BANK_ID}::q${String(index + 17).padStart(2, '0')}`) },
    seedKey: 'memory_word_bridge',
  },
  memory_pairs_daily: {
    roundsTotal: 8,
    template: 'pairs',
    selection: { bankId: MEMORY_PAIRS_BANK_ID, take: 12, ids: Array.from({ length: 12 }, (_, index) => `${MEMORY_PAIRS_BANK_ID}::q${String(index + 4).padStart(2, '0')}`) },
    seedKey: 'memory_pairs_daily',
  },
  attention_focus_filter: {
    roundsTotal: 8,
    template: 'odd_one_out',
    selection: { bankId: ATTENTION_ODD_BANK_ID, take: 12, ids: Array.from({ length: 12 }, (_, index) => `${ATTENTION_ODD_BANK_ID}::q${String(index + 9).padStart(2, '0')}`) },
    seedKey: 'attention_focus_filter',
  },
  attention_quick_read: {
    roundsTotal: 8,
    template: 'choice',
    selection: { bankId: ATTENTION_CHOICE_BANK_ID, take: 12, ids: Array.from({ length: 12 }, (_, index) => `${ATTENTION_CHOICE_BANK_ID}::q${String(index + 9).padStart(2, '0')}`) },
    seedKey: 'attention_quick_read',
  },
  reaction_tap_target: {
    roundsTotal: 8,
    template: 'reaction',
    selection: { bankId: REACTION_BANK_ID, take: 12, ids: Array.from({ length: 12 }, (_, index) => `${REACTION_BANK_ID}::q${String(index + 4).padStart(2, '0')}`) },
    seedKey: 'reaction_tap_target',
  },
  reaction_go_nogo: {
    roundsTotal: 8,
    template: 'reaction',
    selection: { bankId: REACTION_BANK_ID, take: 12, ids: Array.from({ length: 12 }, (_, index) => `${REACTION_BANK_ID}::q${String(index + 16).padStart(2, '0')}`) },
    seedKey: 'reaction_go_nogo',
  },
  logic_order_steps: {
    roundsTotal: 8,
    template: 'sequence',
    selection: { bankId: LOGIC_SEQUENCE_BANK_ID, take: 12, ids: Array.from({ length: 12 }, (_, index) => `${LOGIC_SEQUENCE_BANK_ID}::q${String(index + 4).padStart(2, '0')}`) },
    seedKey: 'logic_order_steps',
  },
  logic_reason_choice: {
    roundsTotal: 8,
    template: 'choice',
    selection: { bankId: LOGIC_CHOICE_BANK_ID, take: 12, ids: Array.from({ length: 12 }, (_, index) => `${LOGIC_CHOICE_BANK_ID}::q${String(index + 9).padStart(2, '0')}`) },
    seedKey: 'logic_reason_choice',
  },
  flexibility_switch_order: {
    roundsTotal: 8,
    template: 'sequence',
    selection: { bankId: FLEX_SEQUENCE_BANK_ID, take: 12, ids: Array.from({ length: 12 }, (_, index) => `${FLEX_SEQUENCE_BANK_ID}::q${String(index + 1).padStart(2, '0')}`) },
    seedKey: 'flexibility_switch_order',
  },
  flexibility_context_shift: {
    roundsTotal: 8,
    template: 'choice',
    selection: { bankId: FLEX_CHOICE_BANK_ID, take: 12, ids: Array.from({ length: 12 }, (_, index) => `${FLEX_CHOICE_BANK_ID}::q${String(index + 17).padStart(2, '0')}`) },
    seedKey: 'flexibility_context_shift',
  },
};

const requireText = (value: string | undefined, label: string, roundId: string) => {
  if (!value) {
    throw new Error(`Missing ${label} for round ${roundId}`);
  }
  return value;
};

const selectFromBank = <T extends { id: string }>(selection: Selection, bankItems: T[]): T[] => {
  if (selection.ids && selection.ids.length > 0) {
    const selected = selection.ids.map((id) => {
      const match = bankItems.find((item) => item.id === id);
      if (!match) {
        throw new Error(`Missing bank item ${id} in bank ${selection.bankId}`);
      }
      return match;
    });
    if (selected.length < selection.take) {
      throw new Error(`Not enough items selected for bank ${selection.bankId}: expected ${selection.take}, got ${selected.length}`);
    }
    return selected.slice(0, selection.take);
  }

  const start = selection.offset ?? 0;
  const slice = bankItems.slice(start, start + selection.take);
  if (slice.length < selection.take) {
    throw new Error(`Not enough items in bank ${selection.bankId}: expected ${selection.take}, got ${slice.length}`);
  }
  return slice;
};

const toChoiceRoundData = (round: ChoiceRound): ChoiceRoundData => ({
  id: round.id,
  prompt: requireText(round.prompt ?? round.promptKey, 'prompt', round.id),
  options: round.options ?? round.optionsKey ?? [],
  correctIndex: round.correctIndex,
  helper: round.hint ?? round.hintKey,
});

const toOddOneOutRoundData = (round: OddOneOutRound): OddOneOutRoundData => ({
  id: round.id,
  prompt: requireText(round.prompt ?? round.promptKey, 'prompt', round.id),
  options: round.options ?? round.optionsKey ?? [],
  oddIndex: round.oddIndex,
  helper: round.hint ?? round.hintKey,
});

const toPairsRoundData = (round: PairsRound): PairsRoundData => ({
  id: round.id,
  pairs: round.pairs,
});

const toSequenceRoundData = (round: SequenceRound): SequenceRoundData => ({
  id: round.id,
  prompt: requireText(round.prompt ?? round.promptKey, 'prompt', round.id),
  items: round.items,
  correctOrder: round.correctOrder,
});

const toReactionRoundData = (round: ReactionRound): ReactionRoundData => ({
  id: round.id,
  instructionKey: round.instructionKey,
  stimuli: round.stimuli,
  paceMs: round.paceMs,
});

const enforcePoolGuards = (
  exerciseId: string,
  template: ExerciseRuntimeConfig['template'],
  pool: ExerciseRuntimeConfig['pool'],
) => {
  const context = `exercise:${exerciseId}`;
  assertUniqueIds(pool, context);

  if (template === 'choice') {
    assertUniqueText(
      pool as ChoiceRoundData[],
      (round) => `${round.prompt}|${round.options.join('|')}`,
      context,
    );
  }

  if (template === 'odd_one_out') {
    assertUniqueText(
      pool as OddOneOutRoundData[],
      (round) => `${round.prompt}|${round.options.join('|')}`,
      context,
    );
  }

  if (template === 'pairs') {
    assertUniqueText(
      pool as PairsRoundData[],
      (round) => round.pairs.map((pair) => `${pair.a}|${pair.b}`).join('||'),
      context,
    );
  }

  if (template === 'sequence') {
    assertUniqueText(
      pool as SequenceRoundData[],
      (round) => `${round.prompt}|${round.correctOrder.join('|')}`,
      context,
    );
  }

  if (template === 'reaction') {
    assertUniqueText(
      pool as ReactionRoundData[],
      (round) => `${round.instructionKey}|${round.stimuli.map((stimulus) => stimulus.label).join('|')}`,
      context,
    );
  }

  return pool;
};

const buildPool = (
  definition: ExerciseDefinition,
  exerciseId: string,
): ExerciseRuntimeConfig['pool'] => {
  const bankItems = BANK_REGISTRY[definition.selection.bankId];
  if (!bankItems) {
    throw new Error(`Unknown bank ${definition.selection.bankId} for exercise ${exerciseId}`);
  }

  const selected = selectFromBank(definition.selection, bankItems);

  switch (definition.template) {
    case 'choice':
      return enforcePoolGuards(
        exerciseId,
        definition.template,
        selected.map((round) => toChoiceRoundData(round as ChoiceRound)),
      );
    case 'odd_one_out':
      return enforcePoolGuards(
        exerciseId,
        definition.template,
        selected.map((round) => toOddOneOutRoundData(round as OddOneOutRound)),
      );
    case 'pairs':
      return enforcePoolGuards(
        exerciseId,
        definition.template,
        selected.map((round) => toPairsRoundData(round as PairsRound)),
      );
    case 'sequence':
      return enforcePoolGuards(
        exerciseId,
        definition.template,
        selected.map((round) => toSequenceRoundData(round as SequenceRound)),
      );
    case 'reaction':
      return enforcePoolGuards(
        exerciseId,
        definition.template,
        selected.map((round) => toReactionRoundData(round as ReactionRound)),
      );
    default:
      throw new Error(`Unsupported template ${definition.template} for exercise ${exerciseId}`);
  }
};

const buildConfigs = (): Record<string, ExerciseRuntimeConfig> => {
  const configs: Record<string, ExerciseRuntimeConfig> = {};
  const poolsForGlobalCheck: Record<string, { id: string }[]> = {};

  Object.entries(EXERCISE_DEFINITIONS).forEach(([exerciseId, definition]) => {
    const pool = buildPool(definition, exerciseId);
    configs[exerciseId] = {
      roundsTotal: definition.roundsTotal,
      template: definition.template,
      pool,
      seedKey: definition.seedKey,
    } as ExerciseRuntimeConfig;
    poolsForGlobalCheck[exerciseId] = pool;
  });

  if (ENFORCE_GLOBAL_UNIQUE_IDS) {
    assertGlobalUniqueIds(poolsForGlobalCheck);
  }

  return configs;
};

const CONFIGS: Record<string, ExerciseRuntimeConfig> = buildConfigs();

export const getRuntimeConfig = (exerciseId: string): ExerciseRuntimeConfig | null => CONFIGS[exerciseId] ?? null;

