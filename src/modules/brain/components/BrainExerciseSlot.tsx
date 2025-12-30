import React, { useCallback } from 'react';
import type { TrainingItem } from '../../../features/trainieren/catalog';
import { useI18n } from '../../../shared/lib/i18n';
import { MemoryPuzzle } from '../templates/MemoryPuzzle';
import { LanguagePuzzle } from '../templates/LanguagePuzzle';
import { PatternsPuzzle } from '../templates/PatternsPuzzle';
import '../brain.css';

export type BrainDifficulty = 'light' | 'medium' | 'hard';
export type BrainMetrics = {
  brainType: 'memory' | 'language' | 'patterns';
  difficulty: BrainDifficulty;
  attempts?: number;
  errors?: number;
};

type BrainExerciseSlotProps = {
  training: TrainingItem;
  difficulty: BrainDifficulty;
  mode: 'preview' | 'active';
  onComplete: (metrics: BrainMetrics) => void;
};

export const BrainExerciseSlot: React.FC<BrainExerciseSlotProps> = ({
  training,
  difficulty,
  mode,
  onComplete,
}) => {
  const { t } = useI18n();
  const isPreview = mode === 'preview';

  const handleComplete = useCallback(
    (metrics: BrainMetrics) => {
      onComplete({ ...metrics, difficulty });
    },
    [difficulty, onComplete],
  );

  if (!training?.brainType) {
    return (
      <div className="brain-slot brain-slot--inactive">
        <p className="brain-slot__hint">{t('brain.ui.unsupported')}</p>
      </div>
    );
  }

  switch (training.brainType) {
    case 'memory':
      return <MemoryPuzzle difficulty={difficulty} disabled={isPreview} onComplete={handleComplete} />;
    case 'language':
      return <LanguagePuzzle difficulty={difficulty} disabled={isPreview} onComplete={handleComplete} />;
    case 'patterns':
      return <PatternsPuzzle difficulty={difficulty} disabled={isPreview} onComplete={handleComplete} />;
    default:
      return (
        <div className="brain-slot brain-slot--inactive">
          <p className="brain-slot__hint">{t('brain.ui.unsupported')}</p>
        </div>
      );
  }
};

