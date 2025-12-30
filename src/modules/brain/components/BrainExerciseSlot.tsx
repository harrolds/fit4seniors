import React from 'react';
import type { TrainingItem } from '../../../features/trainieren/catalog';
import { MemoryPuzzle } from '../templates/MemoryPuzzle';
import { LanguagePuzzle } from '../templates/LanguagePuzzle';
import { PatternsPuzzle } from '../templates/PatternsPuzzle';
import '../brain.css';

export type BrainDifficulty = 'light' | 'medium' | 'hard';

type BrainExerciseSlotProps = {
  training: TrainingItem;
  difficulty: BrainDifficulty;
  isActive: boolean;
  onComplete: () => void;
};

export const BrainExerciseSlot: React.FC<BrainExerciseSlotProps> = ({
  training,
  difficulty,
  isActive,
  onComplete,
}) => {
  if (!training?.brainType) {
    return (
      <div className="brain-slot brain-slot--inactive">
        <p className="brain-slot__hint">Dieses Training unterstützt aktuell keine Übungen.</p>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="brain-slot brain-slot--inactive">
        <p className="brain-slot__hint">Tap Start training to begin.</p>
      </div>
    );
  }

  switch (training.brainType) {
    case 'memory':
      return <MemoryPuzzle difficulty={difficulty} onComplete={onComplete} />;
    case 'language':
      return <LanguagePuzzle difficulty={difficulty} onComplete={onComplete} />;
    case 'patterns':
      return <PatternsPuzzle difficulty={difficulty} onComplete={onComplete} />;
    default:
      return (
        <div className="brain-slot brain-slot--inactive">
          <p className="brain-slot__hint">Übungstyp wird nicht unterstützt.</p>
        </div>
      );
  }
};

