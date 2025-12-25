export type BrainCategoryId = 'memory' | 'attention' | 'reaction' | 'logic' | 'flexibility';

export type BrainDifficulty = 'L1' | 'L2' | 'L3' | 'L4';

export type BrainScoringType =
  | 'accuracy'
  | 'accuracy_time'
  | 'reaction_time'
  | 'speed'
  | 'count'
  | 'timing_accuracy'
  | 'speed_accuracy';

export type BrainTemplate =
  | 'wordpuzzle'
  | 'pairs'
  | 'sequence'
  | 'association'
  | 'recall'
  | 'fill_gaps'
  | 'selection'
  | 'search'
  | 'choice'
  | 'count'
  | 'go_no_go'
  | 'stop_signal'
  | 'timing'
  | 'rhythm'
  | 'series'
  | 'spatial'
  | 'grid'
  | 'maze'
  | 'grouping'
  | 'rule_switch'
  | 'sorting'
  | 'alternating'
  | 'verbal'
  | 'reverse';

export type BrainExercise = {
  id: string;
  category: BrainCategoryId;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  difficulty: BrainDifficulty;
  estimatedMinutes: number;
  scoringType: BrainScoringType;
  uiTemplate: BrainTemplate;
  implemented: boolean;
};

export type BrainCategory = {
  id: BrainCategoryId;
  titleKey: string;
  subtitleKey: string;
  icon: string;
};

