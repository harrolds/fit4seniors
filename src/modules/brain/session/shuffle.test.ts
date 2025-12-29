import { describe, expect, it } from 'vitest';
import { shuffleWithCorrectIndex } from './shuffle';
import { shuffleWithOddIndex } from './shuffleOdd';

const asSet = (options: string[]) => new Set(options);

describe('session shuffling', () => {
  it('shuffles choice options while keeping the correct value mapped', () => {
    const options = ['a', 'b', 'c', 'd'];
    const correctIndex = 1;
    const first = shuffleWithCorrectIndex(options, correctIndex, 42);
    const second = shuffleWithCorrectIndex(options, correctIndex, 42);

    expect(first.options).toEqual(second.options);
    expect(first.correctIndex).toBe(second.correctIndex);
    expect(first.options[first.correctIndex]).toBe(options[correctIndex]);
    expect(asSet(first.options)).toEqual(asSet(options));
  });

  it('shuffles odd-one-out options while keeping the odd value mapped', () => {
    const options = ['cat', 'dog', 'bird', 'fish'];
    const oddIndex = 2;
    const first = shuffleWithOddIndex(options, oddIndex, 123);
    const second = shuffleWithOddIndex(options, oddIndex, 123);

    expect(first.options).toEqual(second.options);
    expect(first.oddIndex).toBe(second.oddIndex);
    expect(first.options[first.oddIndex]).toBe(options[oddIndex]);
    expect(asSet(first.options)).toEqual(asSet(options));
  });
});


