import React, { useCallback, useMemo } from 'react';
import type { TrainingItem } from '../../../features/trainieren/catalog';
import {
  LanguageCategoryPickPuzzle,
  LanguageOddWordPuzzle,
  MemoryGridPuzzle,
  MemoryPairsPuzzle,
  PatternsMatrixPuzzle,
  PatternsSequencePuzzle,
} from '../puzzles';
import { getBrainDataset } from '../data/getBrainDataset';
import {
  puzzleTypeToCategory,
  type BrainDataset,
  type BrainDifficulty,
  type BrainMetrics,
  type LanguageCategoryPickDataset,
  type LanguageOddWordDataset,
  type MemoryGridDataset,
  type MemoryPairsDataset,
  type PatternsMatrixDataset,
  type PatternsSequenceDataset,
  type BrainPuzzleType,
} from '../types';
import '../brain.css';

type BrainExerciseSlotProps = {
  training: TrainingItem;
  difficulty: BrainDifficulty;
  mode: 'preview' | 'active';
  onComplete: (metrics: BrainMetrics) => void;
};

export type { BrainDifficulty, BrainMetrics } from '../types';

export const BrainExerciseSlot: React.FC<BrainExerciseSlotProps> = ({
  training,
  difficulty,
  mode,
  onComplete,
}) => {
  const isPreview = mode === 'preview';
  const config = training?.brainConfig;
  const dataset = useMemo<BrainDataset | null>(() => {
    if (!config) return null;
    return getBrainDataset(config.puzzleType, config.datasetKey);
  }, [config]);

  const baseMetrics = useMemo(() => {
    if (!config) return null;
    return {
      brainType: puzzleTypeToCategory(config.puzzleType),
      puzzleType: config.puzzleType,
      datasetKey: config.datasetKey,
    };
  }, [config]);

  const handleComplete = useCallback(
    (metrics?: Partial<BrainMetrics>) => {
      if (!baseMetrics) return;
      onComplete({ ...baseMetrics, ...metrics, difficulty });
    },
    [baseMetrics, difficulty, onComplete],
  );

  if (!config) {
    return (
      <div className="brain-slot brain-slot--inactive">
        <p className="brain-slot__hint">Missing brain training configuration.</p>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="brain-slot brain-slot--inactive">
        <p className="brain-slot__hint">Unsupported brain puzzle type.</p>
      </div>
    );
  }

  switch (config.puzzleType) {
    case 'memory-grid':
      return (
        <MemoryGridPuzzle
          dataset={dataset as MemoryGridDataset}
          mode={mode}
          difficulty={difficulty}
          onComplete={(metrics) => handleComplete(metrics)}
        />
      );
    case 'memory-pairs':
      return (
        <MemoryPairsPuzzle
          dataset={dataset as MemoryPairsDataset}
          mode={mode}
          difficulty={difficulty}
          onComplete={(metrics) => handleComplete(metrics)}
        />
      );
    case 'language-oddword':
      return (
        <LanguageOddWordPuzzle
          dataset={dataset as LanguageOddWordDataset}
          mode={mode}
          difficulty={difficulty}
          onComplete={(metrics) => handleComplete(metrics)}
        />
      );
    case 'language-categorypick':
      return (
        <LanguageCategoryPickPuzzle
          dataset={dataset as LanguageCategoryPickDataset}
          mode={mode}
          difficulty={difficulty}
          onComplete={(metrics) => handleComplete(metrics)}
        />
      );
    case 'patterns-sequence':
      return (
        <PatternsSequencePuzzle
          dataset={dataset as PatternsSequenceDataset}
          mode={mode}
          difficulty={difficulty}
          onComplete={(metrics) => handleComplete(metrics)}
        />
      );
    case 'patterns-matrix':
      return (
        <PatternsMatrixPuzzle
          dataset={dataset as PatternsMatrixDataset}
          mode={mode}
          difficulty={difficulty}
          onComplete={(metrics) => handleComplete(metrics)}
        />
      );
    default:
      return (
        <div className="brain-slot brain-slot--inactive">
          <p className="brain-slot__hint">Unsupported brain puzzle type.</p>
        </div>
      );
  }
};

