import type {
  BrainDataset,
  BrainPuzzleType,
  LanguageCategoryPickDataset,
  LanguageOddWordDataset,
  MemoryGridDataset,
  MemoryPairsDataset,
  PatternsMatrixDataset,
  PatternsSequenceDataset,
} from '../types';
import { languageCategoryPickDatasets } from './languageCategoryPick.datasets';
import { languageOddwordDatasets } from './languageOddword.datasets';
import { memoryGridDatasets } from './memoryGrid.datasets';
import { memoryPairsDatasets } from './memoryPairs.datasets';
import { patternsMatrixDatasets } from './patternsMatrix.datasets';
import { patternsSequenceDatasets } from './patternsSequence.datasets';

type DatasetMap =
  | Record<string, MemoryGridDataset>
  | Record<string, MemoryPairsDataset>
  | Record<string, LanguageOddWordDataset>
  | Record<string, LanguageCategoryPickDataset>
  | Record<string, PatternsSequenceDataset>
  | Record<string, PatternsMatrixDataset>;

const registry: Record<BrainPuzzleType, DatasetMap> = {
  'memory-grid': memoryGridDatasets,
  'memory-pairs': memoryPairsDatasets,
  'language-oddword': languageOddwordDatasets,
  'language-categorypick': languageCategoryPickDatasets,
  'patterns-sequence': patternsSequenceDatasets,
  'patterns-matrix': patternsMatrixDatasets,
};

export const getBrainDataset = (puzzleType: BrainPuzzleType, datasetKey: string): BrainDataset | null => {
  const map = registry[puzzleType];
  if (!map) return null;
  return (map as Record<string, BrainDataset>)[datasetKey] ?? null;
};

export const listBrainDatasets = (puzzleType: BrainPuzzleType): BrainDataset[] => {
  const map = registry[puzzleType];
  if (!map) return [];
  return Object.values(map as Record<string, BrainDataset>);
};


