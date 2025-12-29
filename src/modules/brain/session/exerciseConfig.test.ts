import { describe, expect, it } from 'vitest';
import { BRAIN_EXERCISES } from '../brainCatalog';
import { getRuntimeConfig } from './exerciseConfig';
import { assertUniqueIds, assertUniqueText } from '../content/guards';

describe('exerciseConfig', () => {
  const exercisesWithConfig = BRAIN_EXERCISES.filter((exercise) => getRuntimeConfig(exercise.id));

  it('provides enough pool entries for each configured exercise', () => {
    exercisesWithConfig.forEach((exercise) => {
      const config = getRuntimeConfig(exercise.id);
      expect(config).not.toBeNull();
      if (!config) return;
      expect(config.pool.length).toBeGreaterThanOrEqual(config.roundsTotal);
    });
  });

  it('has unique round ids and texts per exercise', () => {
    const textExtractor = (template: string) => {
      if (template === 'choice' || template === 'odd_one_out') {
        return (round: { prompt: string; options: string[] }) => `${round.prompt}|${round.options.join('|')}`;
      }
      if (template === 'pairs') {
        return (round: { pairs: { a: string; b: string }[] }) => round.pairs.map((pair) => `${pair.a}|${pair.b}`).join('||');
      }
      if (template === 'sequence') {
        return (round: { prompt: string; correctOrder: string[] }) => `${round.prompt}|${round.correctOrder.join('|')}`;
      }
      if (template === 'reaction') {
        return (round: { instructionKey: string; stimuli: { label: string }[] }) =>
          `${round.instructionKey}|${round.stimuli.map((stimulus) => stimulus.label).join('|')}`;
      }
      return null;
    };

    exercisesWithConfig.forEach((exercise) => {
      const config = getRuntimeConfig(exercise.id);
      expect(config).not.toBeNull();
      if (!config) return;
      expect(() => assertUniqueIds(config.pool as { id: string }[], `exercise:${exercise.id}`)).not.toThrow();

      const extractor = textExtractor(config.template);
      if (extractor) {
        expect(() => assertUniqueText(config.pool, extractor as (round: unknown) => string, `exercise:${exercise.id}`)).not.toThrow();
      }
    });
  });
});

