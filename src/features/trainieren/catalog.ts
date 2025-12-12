import { useCallback } from 'react';
import { useI18n } from '../../shared/lib/i18n';
import { useResource } from '../../shared/lib/data';
import type { ModuleCardTone } from '../../shared/ui/ModuleCard';
import seedCatalog from '../../seed/fit4seniors.catalog.seed.v1.json';

export type TrainingIntensity = 'light' | 'medium' | 'heavy';
export type DurationBucket = 'short' | 'medium' | 'long';

type Locale = 'de' | 'en';

type SeedVariant = {
  durationMin: number;
  paceCue_de?: string;
  paceCue_en?: string;
};

type SeedTraining = {
  id: string;
  moduleId: string;
  title_de: string;
  title_en: string;
  shortDesc_de: string;
  shortDesc_en: string;
  intensityScale: number;
  variants: Record<TrainingIntensity, SeedVariant>;
};

type SeedModule = {
  id: string;
  title_de: string;
  title_en: string;
  description_de: string;
  description_en: string;
};

type SeedCatalog = {
  modules: SeedModule[];
  trainings: SeedTraining[];
};

export interface TrainingVariant {
  intensity: TrainingIntensity;
  durationMin: number;
  paceCue: string;
}

export interface TrainingItem {
  id: string;
  moduleId: string;
  title: string;
  shortDesc: string;
  intensityScale: number;
  variants: Record<TrainingIntensity, TrainingVariant>;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  tone: ModuleCardTone;
  icon: string;
  accentColorVar: string;
}

export interface TrainingCatalog {
  modules: TrainingModule[];
  trainings: TrainingItem[];
}

export interface TrainingVariantItem {
  id: string;
  trainingId: string;
  moduleId: string;
  title: string;
  shortDesc: string;
  intensity: TrainingIntensity;
  durationMin: number;
  durationBucket: DurationBucket;
  paceCue: string;
}

const moduleMeta: Record<string, { tone: ModuleCardTone; icon: string }> = {
  cardio: { tone: 'module-1', icon: 'monitor_heart' },
  muskel: { tone: 'module-2', icon: 'fitness_center' },
  balance_flex: { tone: 'module-3', icon: 'accessibility_new' },
  brain: { tone: 'module-4', icon: 'psychology' },
};

const toneColorVar: Record<ModuleCardTone, string> = {
  'module-1': '--color-card-module-1',
  'module-2': '--color-card-module-2',
  'module-3': '--color-card-module-3',
  'module-4': '--color-card-module-4',
  'module-5': '--color-card-module-5',
  accent: '--color-card-accent',
};

const pickLocale = (locale: Locale, item: Record<string, string>, base: string): string => {
  return item[`${base}_${locale}`] ?? item[`${base}_de`] ?? '';
};

const normalizeVariant = (
  intensity: TrainingIntensity,
  variant: SeedVariant,
  locale: Locale,
): TrainingVariant => {
  const paceCue =
    locale === 'en'
      ? variant.paceCue_en ?? variant.paceCue_de ?? ''
      : variant.paceCue_de ?? variant.paceCue_en ?? '';

  return {
    intensity,
    durationMin: variant.durationMin,
    paceCue,
  };
};

const buildCatalog = (locale: Locale): TrainingCatalog => {
  const catalog = seedCatalog as SeedCatalog;

  const modules: TrainingModule[] = catalog.modules.map((module) => {
    const meta = moduleMeta[module.id] ?? { tone: 'module-5', icon: 'widgets' };
    const accentColorVar = `var(${toneColorVar[meta.tone] ?? '--color-card-module-1'})`;

    return {
      id: module.id,
      title: pickLocale(locale, module, 'title'),
      description: pickLocale(locale, module, 'description'),
      tone: meta.tone,
      icon: meta.icon,
      accentColorVar,
    };
  });

  const trainings: TrainingItem[] = catalog.trainings.map((training) => {
    const localizedVariants: Partial<Record<TrainingIntensity, TrainingVariant>> = {};

    (['light', 'medium', 'heavy'] as TrainingIntensity[]).forEach((intensity) => {
      const variant = training.variants[intensity];
      if (variant) {
        localizedVariants[intensity] = normalizeVariant(intensity, variant, locale);
      }
    });

    return {
      id: training.id,
      moduleId: training.moduleId,
      title: pickLocale(locale, training, 'title'),
      shortDesc: pickLocale(locale, training, 'shortDesc'),
      intensityScale: training.intensityScale,
      variants: localizedVariants as Record<TrainingIntensity, TrainingVariant>,
    };
  });

  return { modules, trainings };
};

export const intensityOrder: TrainingIntensity[] = ['light', 'medium', 'heavy'];

export const toneToCssVar = (tone: ModuleCardTone): string => {
  return `var(${toneColorVar[tone] ?? '--color-card-module-1'})`;
};

export const useTrainingCatalog = () => {
  const { locale } = useI18n();

  const fetcher = useCallback(async () => buildCatalog(locale), [locale]);

  return useResource<TrainingCatalog>(`fit4seniors-catalog-${locale}`, fetcher);
};

export const findModule = (catalog: TrainingCatalog | undefined, moduleId?: string): TrainingModule | undefined => {
  if (!catalog || !moduleId) return undefined;
  return catalog.modules.find((module) => module.id === moduleId);
};

export const listTrainingsForModule = (
  catalog: TrainingCatalog | undefined,
  moduleId?: string,
): TrainingItem[] => {
  if (!catalog || !moduleId) return [];
  return catalog.trainings.filter((training) => training.moduleId === moduleId);
};

export const findTraining = (
  catalog: TrainingCatalog | undefined,
  moduleId?: string,
  trainingId?: string,
): TrainingItem | undefined => {
  if (!catalog || !moduleId || !trainingId) return undefined;
  return catalog.trainings.find((training) => training.moduleId === moduleId && training.id === trainingId);
};

const resolveDurationBucket = (durationMin: number): DurationBucket => {
  if (durationMin <= 10) return 'short';
  if (durationMin <= 20) return 'medium';
  return 'long';
};

export const listVariantItemsForModule = (
  catalog: TrainingCatalog | undefined,
  moduleId?: string,
): TrainingVariantItem[] => {
  if (!catalog || !moduleId) return [];
  return listTrainingsForModule(catalog, moduleId).flatMap((training) =>
    intensityOrder
      .map((intensity) => training.variants[intensity])
      .filter(Boolean)
      .map((variant) => ({
        id: `${training.id}-${variant?.intensity}`,
        trainingId: training.id,
        moduleId,
        title: training.title,
        shortDesc: training.shortDesc,
        intensity: variant!.intensity,
        durationMin: variant!.durationMin,
        durationBucket: resolveDurationBucket(variant!.durationMin),
        paceCue: variant!.paceCue,
      })),
  );
};

export const intensityLabels: Record<TrainingIntensity, string> = {
  light: 'Leicht',
  medium: 'Mittel',
  heavy: 'Zwaar',
};


