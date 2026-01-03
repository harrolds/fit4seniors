export const FREEMIUM_RULES = {
  cardio: { freeCount: 3 },
  strength: { freeCount: 3 },
  balance: { freeCount: 3 },

  // Gehirntraining: deterministic freebies per difficulty × subtype
  brain: {
    picksPerCell: 2,
    difficulties: ['light', 'medium', 'heavy'],
    subtypes: ['memory', 'language', 'patterns'],
  },
} as const;

export type FreemiumCategoryKey = keyof typeof FREEMIUM_RULES;
export type BrainDifficulty = (typeof FREEMIUM_RULES.brain.difficulties)[number];
export type BrainSubtype = (typeof FREEMIUM_RULES.brain.subtypes)[number];
