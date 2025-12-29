import { describe, expect, it } from 'vitest';
import {
  assertGlobalUniqueIds,
  assertIndexBias,
  assertUniqueIds,
  assertUniqueText,
  assertValidChoiceRounds,
  assertValidOddOneOutRounds,
} from './guards';
import { items as attentionChoice } from './banks/attention.choiceText.bank';
import { items as flexibilityChoice } from './banks/flexibility.choiceText.bank';
import { items as memoryChoice } from './banks/memory.choiceText.bank';
import { items as logicChoice } from './banks/logic.choiceText.bank';
import { items as attentionOdd } from './banks/attention.oddOneOut.bank';
import { items as logicOdd } from './banks/logic.oddOneOut.bank';

describe('content guards', () => {
  it('assertUniqueIds throws on duplicate ids', () => {
    expect(() => assertUniqueIds([{ id: 'dup' }, { id: 'dup' }], 'ctx')).toThrow(/Duplicate round ids/);
  });

  it('assertUniqueText normalizes whitespace and casing', () => {
    const rounds = [{ prompt: 'Hello  World' }, { prompt: 'hello world' }];
    expect(() => assertUniqueText(rounds, (round) => (round as { prompt: string }).prompt, 'ctx')).toThrow(
      /Duplicate round text/,
    );
  });

  it('assertGlobalUniqueIds catches duplicates across exercises', () => {
    expect(() =>
      assertGlobalUniqueIds({
        exerciseA: [{ id: 'shared' }],
        exerciseB: [{ id: 'shared' }],
      }),
    ).toThrow(/Duplicate round ids across exercises/);
  });

  it('choice banks have valid indices and unique options', () => {
    const banks = [
      { name: 'attention.choiceText', rounds: attentionChoice },
      { name: 'flexibility.choiceText', rounds: flexibilityChoice },
      { name: 'memory.choiceText', rounds: memoryChoice },
      { name: 'logic.choiceText', rounds: logicChoice },
    ];

    banks.forEach(({ name, rounds }) => {
      expect(() =>
        assertValidChoiceRounds(
          rounds.map((round) => ({ id: round.id, options: round.options ?? round.optionsKey ?? [], correctIndex: round.correctIndex })),
          name,
        ),
      ).not.toThrow();
    });
  });

  it('odd-one-out banks have valid indices and unique options', () => {
    const banks = [
      { name: 'attention.oddOneOut', rounds: attentionOdd },
      { name: 'logic.oddOneOut', rounds: logicOdd },
    ];

    banks.forEach(({ name, rounds }) => {
      expect(() =>
        assertValidOddOneOutRounds(
          rounds.map((round) => ({ id: round.id, options: round.options ?? round.optionsKey ?? [], oddIndex: round.oddIndex })),
          name,
        ),
      ).not.toThrow();
    });
  });

  it('assertIndexBias flags skewed distributions', () => {
    expect(() =>
      assertIndexBias(
        [{ correctIndex: 0 }, { correctIndex: 0 }, { correctIndex: 1 }, { correctIndex: 0 }],
        'choice-bias',
        { maxShare: 0.6 },
      ),
    ).toThrow(/Index bias/);

    expect(() =>
      assertIndexBias(
        [{ correctIndex: 0 }, { correctIndex: 1 }, { correctIndex: 2 }, { correctIndex: 1 }],
        'choice-balanced',
      ),
    ).not.toThrow();
  });
});

