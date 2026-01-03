import {
  FREEMIUM_RULES,
  type FreemiumCategoryKey,
  type BrainDifficulty,
  type BrainSubtype,
} from '../../config/freemium';

export type PremiumMarkableTraining = {
  id: string;
  order?: number;
  requiresPremium?: boolean;

  // Brain-only metadata (optional for other categories)
  brainType?: BrainSubtype;
  variants?: Partial<Record<BrainDifficulty, { intensity: BrainDifficulty }>>;
};

const sortTrainings = <T extends PremiumMarkableTraining>(trainings: T[]): T[] => {
  return [...trainings].sort((a, b) => {
    const hasOrderA = typeof a.order === 'number';
    const hasOrderB = typeof b.order === 'number';

    if (hasOrderA && hasOrderB) {
      if (a.order !== b.order) {
        return (a.order ?? 0) - (b.order ?? 0);
      }
      return a.id.localeCompare(b.id);
    }

    if (hasOrderA) return -1;
    if (hasOrderB) return 1;
    return a.id.localeCompare(b.id);
  });
};

export const markTrainingsWithPremiumFlag = <T extends PremiumMarkableTraining>(
  trainings: T[],
  categoryKey?: FreemiumCategoryKey,
): T[] => {
  const sorted = sortTrainings(trainings);

  if (!categoryKey) {
    return sorted.map((training) => ({ ...training, requiresPremium: false }));
  }

  // Gehirntraining: deterministic “matrix freebies”
  if (categoryKey === 'brain') {
    const selectedIds = new Set<string>();

    const { difficulties, subtypes, picksPerCell } = FREEMIUM_RULES.brain;

    difficulties.forEach((difficulty) => {
      subtypes.forEach((subtype) => {
        const candidates = sorted.filter(
          (training) => training.brainType === subtype && Boolean(training.variants?.[difficulty]),
        );

        // pick the first N deterministically (sorted already)
        const picks = candidates.slice(0, picksPerCell);
        picks.forEach((pick) => selectedIds.add(pick.id));
      });
    });

    return sorted.map((training) => ({
      ...training,
      requiresPremium: !selectedIds.has(training.id),
    }));
  }

  const freeCount = FREEMIUM_RULES[categoryKey]?.freeCount ?? 0;

  return sorted.map((training, index) => ({
    ...training,
    requiresPremium: index >= freeCount,
  }));
};
