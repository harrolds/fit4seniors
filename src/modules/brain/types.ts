export type BrainPuzzleType =
  | 'memory-grid'
  | 'memory-pairs'
  | 'language-oddword'
  | 'language-categorypick'
  | 'patterns-sequence'
  | 'patterns-matrix';

export type BrainDifficulty = 'light' | 'medium' | 'hard';

export type BrainTrainingConfig = {
  puzzleType: BrainPuzzleType;
  datasetKey: string;
};

export type BrainCategory = 'memory' | 'language' | 'patterns';

export type MemoryGridItem = {
  id: string;
  label_de: string;
  label_en: string;
};

export type MemoryGridDataset = {
  puzzleType: 'memory-grid';
  datasetKey: string;
  titleHint_de?: string;
  titleHint_en?: string;
  items: MemoryGridItem[];
};

export type MemoryPairsItem = {
  id: string;
  label_de: string;
  label_en: string;
};

export type MemoryPairsDataset = {
  puzzleType: 'memory-pairs';
  datasetKey: string;
  pairs: MemoryPairsItem[];
};

export type LanguageOddWordSet = {
  category_de: string;
  category_en: string;
  options: string[];
  answerIndex: number;
};

export type LanguageOddWordDataset = {
  puzzleType: 'language-oddword';
  datasetKey: string;
  sets: LanguageOddWordSet[];
};

export type LanguageCategoryPickSet = {
  prompt_de: string;
  prompt_en: string;
  options: string[];
  answerIndex: number;
};

export type LanguageCategoryPickDataset = {
  puzzleType: 'language-categorypick';
  datasetKey: string;
  sets: LanguageCategoryPickSet[];
};

export type PatternToken = {
  label_de: string;
  label_en: string;
  glyph: string;
  color: string;
};

export type PatternsSequenceSet = {
  sequence: string[];
  options: string[];
  answerIndex: number;
  hint?: string;
};

export type PatternsSequenceDataset = {
  puzzleType: 'patterns-sequence';
  datasetKey: string;
  sets: PatternsSequenceSet[];
  legend: Record<string, PatternToken>;
};

export type PatternsMatrixSet = {
  grid: (string | null)[][];
  options: string[];
  answerIndex: number;
  hint?: string;
};

export type PatternsMatrixDataset = {
  puzzleType: 'patterns-matrix';
  datasetKey: string;
  sets: PatternsMatrixSet[];
  legend: Record<string, PatternToken>;
};

export type BrainDataset =
  | MemoryGridDataset
  | MemoryPairsDataset
  | LanguageOddWordDataset
  | LanguageCategoryPickDataset
  | PatternsSequenceDataset
  | PatternsMatrixDataset;

export type BrainMetrics = {
  brainType: BrainCategory;
  puzzleType: BrainPuzzleType;
  datasetKey: string;
  difficulty: BrainDifficulty;
  attempts?: number;
  errors?: number;
};

export type { BrainDifficulty as ExportedBrainDifficulty, BrainMetrics as ExportedBrainMetrics };

export const puzzleTypeToCategory = (puzzleType: BrainPuzzleType): BrainCategory => {
  if (puzzleType.startsWith('memory-')) return 'memory';
  if (puzzleType.startsWith('language-')) return 'language';
  return 'patterns';
};


