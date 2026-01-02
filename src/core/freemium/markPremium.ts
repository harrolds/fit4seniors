import { FREE_LIMITS, type FreemiumCategoryKey } from '../../config/freemium';

export type PremiumMarkableTraining = {
  id: string;
  order?: number;
  requiresPremium?: boolean;
  brainType?: BrainSubtype;
  variants?: Partial<Record<BrainDifficulty, { intensity: BrainDifficulty }>>;
};

type BrainSubtype = 'memory' | 'language' | 'patterns';
type BrainDifficulty = 'light' | 'medium' | 'heavy';

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
  categoryKey: FreemiumCategoryKey,
): T[] => {
  const sorted = sortTrainings(trainings);

  if (categoryKey === 'brain') {
    const selectedIds = new Set<string>();
    const difficulties: BrainDifficulty[] = ['light', 'medium', 'heavy'];
    const subtypes: BrainSubtype[] = ['memory', 'language', 'patterns'];

    difficulties.forEach((difficulty) => {
      subtypes.forEach((subtype) => {
        const candidates = sorted.filter(
          (training) => training.brainType === subtype && Boolean(training.variants?.[difficulty]),
        );
        const picks = candidates.slice(0, 2);
        picks.forEach((pick) => selectedIds.add(pick.id));
      });
    });

    return sorted.map((training) => ({
      ...training,
      requiresPremium: !selectedIds.has(training.id),
    }));
  }

  const freeCount = FREE_LIMITS[categoryKey] ?? 0;

  return sorted.map((training, index) => ({
    ...training,
    requiresPremium: index >= freeCount,
  }));
};

