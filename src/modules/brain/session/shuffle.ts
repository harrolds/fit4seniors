import { hashSeed, mulberry32 } from './seed';

export const shuffleWithCorrectIndex = (
  options: string[],
  correctIndex: number,
  seed: number,
): { options: string[]; correctIndex: number } => {
  if (options.length === 0 || correctIndex < 0 || correctIndex >= options.length) {
    return { options, correctIndex };
  }

  const rng = mulberry32(hashSeed(`${seed}`));
  const source = options.map((value, index) => ({ value, index }));
  for (let i = source.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [source[i], source[j]] = [source[j], source[i]];
  }

  const newOptions = source.map((item) => item.value);
  const newCorrectIndex = source.findIndex((item) => item.index === correctIndex);

  return { options: newOptions, correctIndex: newCorrectIndex };
};

