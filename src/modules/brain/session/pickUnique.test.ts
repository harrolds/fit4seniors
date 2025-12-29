import { describe, expect, it } from 'vitest';
import { pickUniqueRoundIndices } from './pickUnique';

describe('pickUniqueRoundIndices', () => {
  it('returns exactly the requested number of indices', () => {
    const result = pickUniqueRoundIndices(10, 5, 123);
    expect(result).toHaveLength(5);
  });

  it('returns unique indices', () => {
    const result = pickUniqueRoundIndices(10, 10, 456);
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });

  it('is deterministic for the same seed', () => {
    const first = pickUniqueRoundIndices(8, 4, 999);
    const second = pickUniqueRoundIndices(8, 4, 999);
    expect(second).toEqual(first);
  });

  it('throws when pool is too small', () => {
    expect(() => pickUniqueRoundIndices(3, 4, 1)).toThrowError(/Pool too small/);
  });
});

