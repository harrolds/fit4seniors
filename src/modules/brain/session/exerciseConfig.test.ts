import { describe, expect, it } from 'vitest';
import { BRAIN_EXERCISES } from '../brainCatalog';
import { getRuntimeConfig } from './exerciseConfig';

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

  it('has unique round ids per exercise', () => {
    exercisesWithConfig.forEach((exercise) => {
      const config = getRuntimeConfig(exercise.id);
      expect(config).not.toBeNull();
      if (!config) return;
      const ids = config.pool.map((round) => (round as { id?: string }).id);
      expect(ids.every(Boolean)).toBe(true);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });
  });
});

