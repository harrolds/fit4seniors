export const FREE_LIMITS = {
  cardio: 3,
  strength: 3,
  balance: 3,
  brain: 3,
} as const;

export type FreemiumCategoryKey = keyof typeof FREE_LIMITS;

