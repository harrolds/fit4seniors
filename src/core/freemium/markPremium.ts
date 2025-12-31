import { FREE_LIMITS, type FreemiumCategoryKey } from '../../config/freemium';

export type PremiumMarkableTraining = {
  id: string;
  order?: number;
  requiresPremium?: boolean;
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
  categoryKey: FreemiumCategoryKey,
): T[] => {
  const freeCount = FREE_LIMITS[categoryKey] ?? 0;
  const sorted = sortTrainings(trainings);

  return sorted.map((training, index) => ({
    ...training,
    requiresPremium: index >= freeCount,
  }));
};

