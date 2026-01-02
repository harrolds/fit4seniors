import { describe, expect, it } from 'vitest';
import { markTrainingsWithPremiumFlag, type PremiumMarkableTraining } from './markPremium';

describe('markTrainingsWithPremiumFlag – brain', () => {
  type TestTraining = PremiumMarkableTraining & {
    brainType: 'memory' | 'language' | 'patterns';
    variants: {
      [key in 'light' | 'medium' | 'heavy']?: { intensity: key };
    };
  };

  const makeTraining = (
    id: string,
    brainType: TestTraining['brainType'],
    difficulty: 'light' | 'medium' | 'heavy',
    order: number,
  ): TestTraining => ({
    id,
    brainType,
    order,
    variants: {
      [difficulty]: { intensity: difficulty },
    },
  });

  it('selects at most two free trainings per subtype per difficulty (stable order/id)', () => {
    const trainings = [
      // light
      makeTraining('memory-light-1', 'memory', 'light', 1),
      makeTraining('memory-light-2', 'memory', 'light', 2),
      makeTraining('memory-light-3', 'memory', 'light', 3),
      makeTraining('language-light-1', 'language', 'light', 4),
      makeTraining('language-light-2', 'language', 'light', 5),
      makeTraining('language-light-3', 'language', 'light', 6),
      makeTraining('patterns-light-1', 'patterns', 'light', 7),
      makeTraining('patterns-light-2', 'patterns', 'light', 8),
      makeTraining('patterns-light-3', 'patterns', 'light', 9),
      // medium
      makeTraining('memory-medium-1', 'memory', 'medium', 10),
      makeTraining('memory-medium-2', 'memory', 'medium', 11),
      makeTraining('memory-medium-3', 'memory', 'medium', 12),
      makeTraining('language-medium-1', 'language', 'medium', 13),
      makeTraining('language-medium-2', 'language', 'medium', 14),
      makeTraining('language-medium-3', 'language', 'medium', 15),
      makeTraining('patterns-medium-1', 'patterns', 'medium', 16),
      makeTraining('patterns-medium-2', 'patterns', 'medium', 17),
      makeTraining('patterns-medium-3', 'patterns', 'medium', 18),
      // heavy
      makeTraining('memory-heavy-1', 'memory', 'heavy', 19),
      makeTraining('memory-heavy-2', 'memory', 'heavy', 20),
      makeTraining('memory-heavy-3', 'memory', 'heavy', 21),
      makeTraining('language-heavy-1', 'language', 'heavy', 22),
      makeTraining('language-heavy-2', 'language', 'heavy', 23),
      makeTraining('language-heavy-3', 'language', 'heavy', 24),
      makeTraining('patterns-heavy-1', 'patterns', 'heavy', 25),
      makeTraining('patterns-heavy-2', 'patterns', 'heavy', 26),
      makeTraining('patterns-heavy-3', 'patterns', 'heavy', 27),
    ];

    const marked = markTrainingsWithPremiumFlag(trainings, 'brain');

    const groupFree = (subtype: TestTraining['brainType'], difficulty: 'light' | 'medium' | 'heavy') =>
      marked.filter(
        (t) =>
          t.brainType === subtype &&
          Boolean(t.variants?.[difficulty]) &&
          !t.requiresPremium,
      );

    expect(groupFree('memory', 'light').map((t) => t.id)).toEqual(['memory-light-1', 'memory-light-2']);
    expect(groupFree('language', 'light').map((t) => t.id)).toEqual(['language-light-1', 'language-light-2']);
    expect(groupFree('patterns', 'light').map((t) => t.id)).toEqual(['patterns-light-1', 'patterns-light-2']);

    expect(groupFree('memory', 'medium').map((t) => t.id)).toEqual(['memory-medium-1', 'memory-medium-2']);
    expect(groupFree('language', 'medium').map((t) => t.id)).toEqual(['language-medium-1', 'language-medium-2']);
    expect(groupFree('patterns', 'medium').map((t) => t.id)).toEqual(['patterns-medium-1', 'patterns-medium-2']);

    expect(groupFree('memory', 'heavy').map((t) => t.id)).toEqual(['memory-heavy-1', 'memory-heavy-2']);
    expect(groupFree('language', 'heavy').map((t) => t.id)).toEqual(['language-heavy-1', 'language-heavy-2']);
    expect(groupFree('patterns', 'heavy').map((t) => t.id)).toEqual(['patterns-heavy-1', 'patterns-heavy-2']);

    // Ensure remaining in each group are premium
    const premiumCountByGroup = (subtype: TestTraining['brainType'], difficulty: 'light' | 'medium' | 'heavy') =>
      marked.filter(
        (t) =>
          t.brainType === subtype &&
          Boolean(t.variants?.[difficulty]) &&
          t.requiresPremium,
      ).length;

    expect(premiumCountByGroup('memory', 'light')).toBe(1);
    expect(premiumCountByGroup('language', 'light')).toBe(1);
    expect(premiumCountByGroup('patterns', 'light')).toBe(1);
    expect(premiumCountByGroup('memory', 'medium')).toBe(1);
    expect(premiumCountByGroup('language', 'medium')).toBe(1);
    expect(premiumCountByGroup('patterns', 'medium')).toBe(1);
    expect(premiumCountByGroup('memory', 'heavy')).toBe(1);
    expect(premiumCountByGroup('language', 'heavy')).toBe(1);
    expect(premiumCountByGroup('patterns', 'heavy')).toBe(1);
  });
});

