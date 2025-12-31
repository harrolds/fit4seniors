import { getBrainDataset as resolveDataset } from '../datasets';
import type { BrainDataset, BrainPuzzleType } from '../types';

export const getBrainDataset = (puzzleType: BrainPuzzleType, datasetKey: string): BrainDataset | null =>
  resolveDataset(puzzleType, datasetKey);


