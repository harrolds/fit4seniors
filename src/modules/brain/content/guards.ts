const normalize = (value: string) => value.replace(/\s+/g, ' ').trim().toLowerCase();

export const assertUniqueIds = (rounds: { id: string }[], context: string): void => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  rounds.forEach((round) => {
    if (seen.has(round.id)) {
      duplicates.add(round.id);
    } else {
      seen.add(round.id);
    }
  });

  if (duplicates.size > 0) {
    throw new Error(`Duplicate round ids in ${context}: ${Array.from(duplicates).join(', ')}`);
  }
};

export const assertUniqueText = <T>(rounds: T[], textExtractor: (round: T) => string, context: string): void => {
  const seen = new Map<string, string>();
  const duplicates = new Set<string>();

  rounds.forEach((round) => {
    const key = normalize(textExtractor(round));
    const previous = seen.get(key);
    if (previous) {
      duplicates.add(previous);
      duplicates.add(key);
    } else {
      seen.set(key, key);
    }
  });

  if (duplicates.size > 0) {
    throw new Error(`Duplicate round text in ${context}: ${Array.from(duplicates).join(', ')}`);
  }
};

export const assertGlobalUniqueIds = (allByExercise: Record<string, { id: string }[]>): void => {
  const ownerById = new Map<string, string>();
  const collisions = new Set<string>();

  Object.entries(allByExercise).forEach(([exerciseId, rounds]) => {
    rounds.forEach((round) => {
      const existingOwner = ownerById.get(round.id);
      if (existingOwner && existingOwner !== exerciseId) {
        collisions.add(`${round.id} (${existingOwner} vs ${exerciseId})`);
      } else {
        ownerById.set(round.id, exerciseId);
      }
    });
  });

  if (collisions.size > 0) {
    throw new Error(`Duplicate round ids across exercises: ${Array.from(collisions).join(', ')}`);
  }
};

const hasDuplicateOptions = (options: string[]) => {
  const normalized = options.map(normalize);
  return new Set(normalized).size !== normalized.length;
};

const isIndexOutOfRange = (index: number, options: string[]) => index < 0 || index >= options.length;

const formatRoundLabel = (round: { id?: string }, index: number) => round.id ?? `index:${index}`;

export const assertValidChoiceRounds = (rounds: { options: string[]; correctIndex: number; id?: string }[], context: string): void => {
  const issues: string[] = [];

  rounds.forEach((round, idx) => {
    if (!round.options || round.options.length < 2) {
      issues.push(`${formatRoundLabel(round, idx)} has insufficient options`);
    }
    if (hasDuplicateOptions(round.options)) {
      issues.push(`${formatRoundLabel(round, idx)} has duplicate options`);
    }
    if (isIndexOutOfRange(round.correctIndex, round.options)) {
      issues.push(`${formatRoundLabel(round, idx)} has out-of-range correctIndex ${round.correctIndex}`);
    }
  });

  if (issues.length > 0) {
    throw new Error(`Invalid choice rounds in ${context}: ${issues.join('; ')}`);
  }
};

export const assertValidOddOneOutRounds = (rounds: { options: string[]; oddIndex: number; id?: string }[], context: string): void => {
  const issues: string[] = [];

  rounds.forEach((round, idx) => {
    if (!round.options || round.options.length < 2) {
      issues.push(`${formatRoundLabel(round, idx)} has insufficient options`);
    }
    if (hasDuplicateOptions(round.options)) {
      issues.push(`${formatRoundLabel(round, idx)} has duplicate options`);
    }
    if (isIndexOutOfRange(round.oddIndex, round.options)) {
      issues.push(`${formatRoundLabel(round, idx)} has out-of-range oddIndex ${round.oddIndex}`);
    }
  });

  if (issues.length > 0) {
    throw new Error(`Invalid odd-one-out rounds in ${context}: ${issues.join('; ')}`);
  }
};

export const assertIndexBias = (
  rounds: ({ correctIndex?: number; oddIndex?: number; id?: string } | undefined)[],
  context: string,
  { maxShare = 0.6 }: { maxShare?: number } = {},
): void => {
  const indices = rounds
    .filter((round): round is { correctIndex?: number; oddIndex?: number; id?: string } => Boolean(round))
    .map((round) => (typeof round.correctIndex === 'number' ? round.correctIndex : round.oddIndex))
    .filter((index): index is number => typeof index === 'number');

  if (indices.length === 0) return;

  const countAtZero = indices.filter((index) => index === 0).length;
  const share = countAtZero / indices.length;

  if (share > maxShare) {
    const percentage = Math.round(share * 1000) / 10;
    throw new Error(`Index bias detected in ${context}: ${percentage}% at position 0 exceeds maxShare ${maxShare}`);
  }
};

