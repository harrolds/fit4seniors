import type { ModuleCardTone } from '../shared/ui/ModuleCard';

export type CategoryId = 'brain' | 'cardio' | 'muscle' | 'balance';

type CategoryColor = {
  hex: string;
  varName: `--color-card-module-${1 | 2 | 3 | 4}`;
  tone: ModuleCardTone;
  iconTint: string;
  isLight: boolean;
};

export const CATEGORY_COLORS: Record<CategoryId, CategoryColor> = {
  brain: {
    hex: '#88b0a5',
    varName: '--color-card-module-1',
    tone: 'module-1',
    iconTint: '#e7efed',
    isLight: false,
  },
  cardio: {
    hex: '#72937c',
    varName: '--color-card-module-2',
    tone: 'module-2',
    iconTint: '#e3e9e5',
    isLight: false,
  },
  muscle: {
    hex: '#fcd7ac',
    varName: '--color-card-module-3',
    tone: 'module-3',
    iconTint: '#fef7ee',
    isLight: true,
  },
  balance: {
    hex: '#e6beae',
    varName: '--color-card-module-4',
    tone: 'module-4',
    iconTint: '#faf2ef',
    isLight: true,
  },
};

const CATEGORY_ALIASES: Record<CategoryId, string[]> = {
  brain: ['braintraining', 'brain-training', 'home-brain'],
  cardio: ['cardio', 'home-cardio'],
  muscle: ['muskel', 'muskelaufbau', 'muscle', 'strength', 'home-muscle'],
  balance: ['balance_flex', 'balance-flex', 'balance', 'home-balance'],
};

export const normalizeCategoryId = (raw?: string): CategoryId | undefined => {
  if (!raw) return undefined;
  const key = raw.toLowerCase();
  return (Object.keys(CATEGORY_COLORS) as CategoryId[]).find(
    (category) => category === key || CATEGORY_ALIASES[category]?.includes(key),
  );
};

export const getCategoryColor = (raw?: string) => {
  const id = normalizeCategoryId(raw);
  if (!id) return undefined;
  const color = CATEGORY_COLORS[id];
  return { id, ...color, cssVar: `var(${color.varName})` };
};

export const categoryTone = (raw?: string): ModuleCardTone => {
  const color = getCategoryColor(raw);
  return color?.tone ?? 'module-1';
};

export const categoryCssVar = (raw?: string): string => {
  const color = getCategoryColor(raw);
  return color?.cssVar ?? 'var(--color-card-module-1)';
};

export const categoryIconTintFallback = (raw?: string): string | undefined => {
  const color = getCategoryColor(raw);
  return color?.iconTint;
};


