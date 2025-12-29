import { hashSeed, mulberry32 } from './seed';

export const shuffleWithOddIndex = (
  options: string[],
  oddIndex: number,
  seed: number,
): { options: string[]; oddIndex: number } => {
  if (options.length === 0 || oddIndex < 0 || oddIndex >= options.length) {
    return { options, oddIndex };
  }

  const rng = mulberry32(hashSeed(`${seed}`));
  const source = options.map((value, index) => ({ value, index }));
  for (let i = source.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [source[i], source[j]] = [source[j], source[i]];
  }

  const newOptions = source.map((item) => item.value);
  const newOddIndex = source.findIndex((item) => item.index === oddIndex);

  return { options: newOptions, oddIndex: newOddIndex };
};


