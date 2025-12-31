import React from 'react';
import { Button } from '../../../shared/ui/Button';
import type { BrainDataset } from '../types';

type BrainPuzzlePlaceholderProps = {
  title: string;
  dataset: BrainDataset;
  mode: 'preview' | 'active';
  onComplete?: () => void;
};

export const BrainPuzzlePlaceholder: React.FC<BrainPuzzlePlaceholderProps> = ({
  title,
  dataset,
  mode,
  onComplete,
}) => {
  return (
    <div className="brain-slot">
      <div className="brain-slot__header">
        <p className="brain-slot__title">{title}</p>
        <span className="brain-slot__status">{mode === 'active' ? 'Active' : 'Preview'}</span>
      </div>

      <div className="brain-slot__placeholder">
        <p className="brain-slot__hint">Puzzle type: {dataset.puzzleType}</p>
        <p className="brain-slot__hint">Dataset: {dataset.datasetKey}</p>
        <p className="brain-slot__hint">Not implemented yet.</p>
      </div>

      {mode === 'active' ? (
        <div className="brain-actions">
          <Button fullWidth onClick={onComplete}>
            Mark complete
          </Button>
        </div>
      ) : null}
    </div>
  );
};


