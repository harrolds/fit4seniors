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
    order,
    brainType,
    variants: { [difficulty]: { intensity: difficulty } },
  });

  it('marks exactly 1 free training per subtype × difficulty (deterministic)', () => {
    const trainings: TestTraining[] = [];

    const difficulties: Array<'light' | 'medium' | 'heavy'> = ['light', 'medium', 'heavy'];
    const subtypes: Array<'memory' | 'language' | 'patterns'> = ['memory', 'language', 'patterns'];

    // 3 per group (so: 2 free + 1 premium expected)
    difficulties.forEach((difficulty) => {
      subtypes.forEach((subtype) => {
        trainings.push(makeTraining(`${subtype}-${difficulty}-1`, subtype, difficulty, 1));
        trainings.push(makeTraining(`${subtype}-${difficulty}-2`, subtype, difficulty, 2));
        trainings.push(makeTraining(`${subtype}-${difficulty}-3`, subtype, difficulty, 3));
      });
    });

    const marked = markTrainingsWithPremiumFlag(trainings, 'brain');

    const groupFree = (subtype: TestTraining['brainType'], difficulty: 'light' | 'medium' | 'heavy') =>
      marked.filter(
        (t) => t.brainType === subtype && Boolean(t.variants?.[difficulty]) && !t.requiresPremium,
      );

    // Exactly 2 free per group: the first two (order=1,2) deterministically
    expect(groupFree('memory', 'light').map((t) => t.id)).toEqual([
      'memory-light-1',
      'memory-light-2',
    ]);
    expect(groupFree('language', 'light').map((t) => t.id)).toEqual([
      'language-light-1',
      'language-light-2',
    ]);
    expect(groupFree('patterns', 'light').map((t) => t.id)).toEqual([
      'patterns-light-1',
      'patterns-light-2',
    ]);

    expect(groupFree('memory', 'medium').map((t) => t.id)).toEqual([
      'memory-medium-1',
      'memory-medium-2',
    ]);
    expect(groupFree('language', 'medium').map((t) => t.id)).toEqual([
      'language-medium-1',
      'language-medium-2',
    ]);
    expect(groupFree('patterns', 'medium').map((t) => t.id)).toEqual([
      'patterns-medium-1',
      'patterns-medium-2',
    ]);

    expect(groupFree('memory', 'heavy').map((t) => t.id)).toEqual(['memory-heavy-1', 'memory-heavy-2']);
    expect(groupFree('language', 'heavy').map((t) => t.id)).toEqual([
      'language-heavy-1',
      'language-heavy-2',
    ]);
    expect(groupFree('patterns', 'heavy').map((t) => t.id)).toEqual(['patterns-heavy-1', 'patterns-heavy-2']);

    const premiumCountByGroup = (subtype: TestTraining['brainType'], difficulty: 'light' | 'medium' | 'heavy') =>
      marked.filter(
        (t) => t.brainType === subtype && Boolean(t.variants?.[difficulty]) && t.requiresPremium,
      ).length;

    // 3 total per group -> 1 premium (since 2 are free)
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
