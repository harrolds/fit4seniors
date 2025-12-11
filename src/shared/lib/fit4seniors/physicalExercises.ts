import type {
  ExerciseCategory,
  ExercisePosition,
  PhysicalExercise,
} from '../../../domain/fit4seniors/exercises';
import { PHYSICAL_EXERCISES_DE } from '../../../data/fit4seniors/physicalExercises.de';

export type CategoryFilter = ExerciseCategory | 'all';

export const getAllPhysicalExercises = (): PhysicalExercise[] => PHYSICAL_EXERCISES_DE;

export const getPhysicalExerciseById = (
  id: string | undefined
): PhysicalExercise | undefined =>
  id ? PHYSICAL_EXERCISES_DE.find((exercise) => exercise.id === id) : undefined;

export const filterPhysicalExercisesByCategory = (
  category: CategoryFilter
): PhysicalExercise[] =>
  category === 'all'
    ? PHYSICAL_EXERCISES_DE
    : PHYSICAL_EXERCISES_DE.filter((exercise) => exercise.category === category);

export const getCategoryLabel = (category: ExerciseCategory): string => {
  switch (category) {
    case 'balance':
      return 'Balance';
    case 'strength':
      return 'Kraft';
    case 'mobility':
      return 'Mobilität';
    default:
      return category;
  }
};

export const getPositionLabel = (position: ExercisePosition): string => {
  switch (position) {
    case 'chair':
      return 'Mit Stuhl';
    case 'standing':
      return 'Im Stehen';
    case 'seated':
      return 'Im Sitzen';
    default:
      return position;
  }
};

export const formatDuration = (durationSeconds: number): string => {
  if (durationSeconds < 60) {
    return `${durationSeconds} Sekunden`;
  }

  const minutes = Math.round(durationSeconds / 60);
  return minutes === 1 ? '1 Minute' : `${minutes} Minuten`;
};

