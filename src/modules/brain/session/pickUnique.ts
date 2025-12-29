import { mulberry32 } from './seed';

export const pickUniqueRoundIndices = (poolSize: number, roundsTotal: number, seed: number): number[] => {
  if (poolSize < roundsTotal) {
    throw new Error(`Pool too small: need ${roundsTotal}, got ${poolSize}`);
  }

  const rng = mulberry32(seed);
  const indices = Array.from({ length: poolSize }, (_, i) => i);

  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices.slice(0, roundsTotal);
};

